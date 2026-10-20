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

  let response = await context.next();
  const contentType = response.headers.get("content-type") || "";

  // Keep the pages.dev copy and the footer fragment out of Google
  if (url.hostname.endsWith(".pages.dev") || url.pathname.startsWith("/footer")) {
    response = new Response(response.body, response);
    response.headers.set("X-Robots-Tag", "noindex");
  }

  // Only run this on actual HTML pages
  if (contentType.includes("text/html")) {
    return new HTMLRewriter()
      .on("head", new GTMHeadInjector())
      .on("body", new GTMBodyInjector())
      .transform(response);
  }

  return response;
}