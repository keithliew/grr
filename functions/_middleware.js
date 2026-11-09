// GTM Tracking ID config
const GTM_ID = 'GTM-MQBXGWD3'; // Replace with your actual GTM Container ID

class GTMHeadInjector {
  element(element) {
    element.prepend(`<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');</script>
\n`, { html: true });
  }
}

class GTMBodyInjector {
  element(element) {
    element.prepend(`<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
\n`, { html: true });
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
    let rw = new HTMLRewriter()
      .on("head", new GTMHeadInjector())
      .on("body", new GTMBodyInjector());
    if (footerHtml) {
      rw = rw.on("#site-footer-container", {
        element(el) { el.setInnerContent(footerHtml, { html: true }); },
      });
    }
    return rw.transform(response);
  }

  return response;
}