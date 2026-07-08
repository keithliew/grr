// GTM Tracking ID config
const GTM_ID = 'GTM-XXXXXXX'; // Replace with your actual GTM Container ID

class GTMHeadInjector {
  element(element) {
    element.prepend(`<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PCWVBT2G');</script>
\n`, { html: true });
  }
}

class GTMBodyInjector {
  element(element) {
    element.prepend(`<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PCWVBT2G"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
\n`, { html: true });
  }
}

export async function onRequest(context) {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";

  // Only run this on actual HTML pages
  if (contentType.includes("text/html")) {
    return new HTMLRewriter()
      .on("head", new GTMHeadInjector())
      .on("body", new GTMBodyInjector())
      .transform(response);
  }

  return response;
}