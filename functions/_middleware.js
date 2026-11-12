// Google Analytics 4 (the Google tag), added to every page. Replaces Tag Manager (GTM-MQBXGWD3), Nov 2026.
// Only grrmalaysia.com reports to GA4. Staging (*.pages.dev) sends nothing, unless a tester opens a page
// with ?gadebug=1, which sends to GA4 DebugView only and can never switch on for grrmalaysia.com.
const GA_ID = "G-KCVFNS9WY9";

class GAHeadInjector {
  constructor(debug) { this.debug = debug; }
  element(element) {
    const cfg = this.debug ? ", { debug_mode: true }" : "";
    element.prepend(`<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}'${cfg});</script>
<script src="/tracking.js?v=1" defer></script>
`, { html: true });
  }
}

export async function onRequest(context) {
  const url = new URL(context.request.url);

  // One address for search engines: www.grrmalaysia.com -> grrmalaysia.com
  if (url.hostname === "www.grrmalaysia.com") {
    url.hostname = "grrmalaysia.com";
    return Response.redirect(url.toString(), 301);
  }

  // Staging copies (*.pages.dev) tell every crawler to stay out
  if (url.hostname.endsWith(".pages.dev") && url.pathname === "/robots.txt") {
    return new Response("User-agent: *\nDisallow: /\n", {
      headers: { "content-type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" },
    });
  }

  let response = await context.next();
  const contentType = response.headers.get("content-type") || "";

  // Keep the pages.dev copy and the footer fragment out of Google
  if (url.hostname.endsWith(".pages.dev") || url.pathname.startsWith("/footer")) {
    response = new Response(response.body, response);
    response.headers.set("X-Robots-Tag", "noindex");
  }

  // Only run this on actual HTML pages
  if (contentType.includes("text/html")) {
    // Put the shared footer into the HTML itself, so search engines and AI crawlers
    // that don't run JavaScript still see it (script.js keeps a fallback)
    let footerHtml = "";
    if (!url.pathname.startsWith("/footer")) {
      try {
        const f = await context.env.ASSETS.fetch(new URL("/footer", url));
        if (f.ok) footerHtml = await f.text();
      } catch (e) { footerHtml = ""; }
    }
    const live = url.hostname === "grrmalaysia.com";
    const cookie = context.request.headers.get("cookie") || "";
    const debug = url.hostname.endsWith(".pages.dev") &&
      (url.searchParams.get("gadebug") === "1" || /(?:^|;\s*)gadebug=1/.test(cookie));
    let rw = new HTMLRewriter();
    if (live || debug) rw = rw.on("head", new GAHeadInjector(debug && !live));
    if (footerHtml) {
      rw = rw.on("#site-footer-container", {
        element(el) { el.setInnerContent(footerHtml, { html: true }); },
      });
    }
    let out = rw.transform(response);
    if (debug && url.searchParams.get("gadebug") === "1") {
      out = new Response(out.body, out);
      out.headers.append("Set-Cookie", "gadebug=1; Path=/; Max-Age=3600; Secure; SameSite=Lax");
    }
    return out;
  }

  return response;
}