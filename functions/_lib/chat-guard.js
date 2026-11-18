// Abuse guards for /api/chat.
// 1. tooMany(): at most LIMIT requests per visitor IP per 10 minutes, counted in the
//    Cloudflare cache of the data centre the visitor reaches. Approximate (per data centre,
//    not atomic) but needs no extra Cloudflare setup; the Anthropic monthly spend cap is
//    the backstop. The cache is not used on *.pages.dev, so staging is not limited.
// (sign/verified are not used on GRR: its chat only takes fixed questions.)
//    conversation so far. The browser sends the conversation back; if the signature does
//    not match, the earlier turns were edited and only the visitor's latest message is used.

const LIMIT = 30;
const WINDOW_S = 600;

export async function tooMany(request, site) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const slot = Math.floor(Date.now() / 1000 / WINDOW_S);
  const key = new Request(`https://chat-limit.invalid/${site}/${encodeURIComponent(ip)}/${slot}`);
  try {
    const cache = caches.default;
    const hit = await cache.match(key);
    const count = hit ? parseInt(await hit.text(), 10) || 0 : 0;
    if (count >= LIMIT) return true;
    await cache.put(key, new Response(String(count + 1), { headers: { "cache-control": `max-age=${WINDOW_S}` } }));
  } catch (e) {
    // cache unavailable: do not block real visitors
  }
  return false;
}

async function hmacKey(secret, site) {
  const raw = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${site}-chat-history|${secret}`));
  return crypto.subtle.importKey("raw", raw, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

export async function sign(secret, site, messages) {
  const key = await hmacKey(secret, site);
  return b64(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(JSON.stringify(messages))));
}

export async function verified(secret, site, messages, sig) {
  if (typeof sig !== "string" || !sig) return false;
  return (await sign(secret, site, messages)) === sig;
}
