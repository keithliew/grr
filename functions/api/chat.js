// POST /api/chat: the grrmalaysia.com chat assistant.
// The browser sends the conversation so far; we ask Claude for the next reply,
// using only functions/_lib/chat-facts.js, then check the reply against its BLOCKED
// list (rates, projections, certainty, other sites) before it reaches the visitor. Nothing is stored here: a
// conversation is only kept if the visitor sends their details from the chat window.
//
// Needs the secret ANTHROPIC_API_KEY (Cloudflare Pages > Settings > Variables and secrets),
// added by Keith. Without it the chat still works as a "leave your number" form.
// Raw fetch, not the Anthropic SDK: this repo deploys with no build step or package.json.

import { SYSTEM_PROMPT, contextNote, safeReply, busyReply, BLOCKED } from "../_lib/chat-facts.js";

const MODEL = "claude-opus-5-5";
const LANGS = ["en", "zh", "zh-tw"];
const MAX_TURNS = 24; // messages in one conversation (12 visitor messages)
const MAX_USER_CHARS = 600;
const HOSTS = /^(grrmalaysia\.com|(?:[a-z0-9-]+\.)?grr-8dz\.pages\.dev|localhost|127\.0\.0\.1)$/;

const SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string" },
    property: { type: "string", enum: ["lexis-hibiscus-2", "royal-lexis", "residensi-platinum", "not-sure", "none"] },
    offer_contact: { type: "boolean" },
  },
  required: ["reply", "property", "offer_contact"],
  additionalProperties: false,
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" },
  });

function cleanConversation(messages) {
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > MAX_TURNS) return null;
  const out = [];
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    const role = i % 2 === 0 ? "user" : "assistant";
    if (!m || m.role !== role || typeof m.content !== "string") return null;
    const text = m.content.trim().slice(0, role === "user" ? MAX_USER_CHARS : 1500);
    if (!text) return null;
    out.push({ role, content: text });
  }
  return out[out.length - 1].role === "user" ? out : null;
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("origin") || "";
  let host = "";
  try { host = new URL(origin).hostname; } catch (e) { host = ""; }
  if (!HOSTS.test(host)) return json({ error: "forbidden" }, 403);

  let body;
  try { body = await request.json(); } catch (e) { return json({ error: "bad request" }, 400); }
  const lang = LANGS.includes(body.lang) ? body.lang : "en";
  const page = typeof body.page === "string" ? body.page.slice(0, 80).replace(/[^\w\/\-.]/g, "") : "/";
  const messages = cleanConversation(body.messages);
  if (!messages) return json({ reply: busyReply(lang), property: "none", offer_contact: true, limited: true });
  if (!env.ANTHROPIC_API_KEY) return json({ reply: busyReply(lang), property: "none", offer_contact: true, unavailable: true });

  let res;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2026-10-21",
        "anthropic-beta": "server-side-fallback-2026-07-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2000,
        fallbacks: "default",
        output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
        system: [
          { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
          { type: "text", text: contextNote(Date.now(), lang, page) },
        ],
        messages,
      }),
    });
  } catch (e) {
    console.log("chat: network error", String(e));
    return json({ reply: busyReply(lang), property: "none", offer_contact: true, unavailable: true });
  }
  if (!res.ok) {
    console.log("chat: api status", res.status, (await res.text()).slice(0, 300));
    return json({ reply: busyReply(lang), property: "none", offer_contact: true, unavailable: true });
  }

  const data = await res.json();
  let out = null;
  if (data.stop_reason !== "refusal") {
    const block = (data.content || []).find((b) => b.type === "text");
    try { out = JSON.parse(block.text); } catch (e) { out = null; }
  }
  if (!out || typeof out.reply !== "string" || !out.reply.trim()) {
    console.log("chat: unusable reply", data.stop_reason);
    return json({ reply: safeReply(lang), property: "none", offer_contact: true, flagged: true });
  }

  const hit = BLOCKED.find((re) => re.test(out.reply));
  if (hit) {
    console.log("chat: blocked reply, pattern", String(hit));
    return json({ reply: safeReply(lang), property: out.property || "none", offer_contact: true, flagged: true });
  }
  return json({ reply: out.reply.trim(), property: out.property, offer_contact: !!out.offer_contact });
}
