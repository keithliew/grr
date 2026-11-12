// Sends the site's own events to Google Analytics 4 (replaces the Tag Manager container, Nov 2026).
// The Google tag (gtag) is added to every page by functions/_middleware.js on grrmalaysia.com only.
//  - dataLayer events named grr_* and form_submit go to GA4 under the same name, with only the
//    8 parameters the reports use (marketing-loop matches custom dimensions by these names).
//  - A click on any WhatsApp link (wa.me) sends whatsapp_click, as before.
(function () {
  if (typeof window.gtag !== "function") return;
  var PARAMS = ["form_name", "property", "first_field", "field_name", "field_position", "fields_filled", "fields_total", "last_field"];
  var dl = (window.dataLayer = window.dataLayer || []);

  function forward(item) {
    if (!item || typeof item !== "object" || item._grrSent || typeof item.event !== "string") return;
    if (!/^grr_/.test(item.event) && item.event !== "form_submit") return;
    item._grrSent = true;
    var p = {};
    PARAMS.forEach(function (k) { if (item[k] !== undefined) p[k] = item[k]; });
    window.gtag("event", item.event, p);
  }

  for (var i = 0; i < dl.length; i++) forward(dl[i]);
  var push = dl.push;
  dl.push = function () {
    var r = push.apply(dl, arguments);
    for (var j = 0; j < arguments.length; j++) forward(arguments[j]);
    return r;
  };

  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href*="wa.me"]') : null;
    if (a) window.gtag("event", "whatsapp_click");
  }, true);
})();
