// Briefing-form funnel: sends each step to the GTM dataLayer so Google Analytics can show
// how far visitors get before they leave. Only field names and counts are sent, never what people type.
(function () {
  var form = document.getElementById("briefing-form");
  if (!form) return;
  window.dataLayer = window.dataLayer || [];

  var fields = [].slice.call(form.querySelectorAll("input, select, textarea")).filter(function (el) {
    return el.type !== "hidden" && el.name !== "botcheck";
  });
  var total = fields.length;
  var done = {};
  var started = false, submitted = false, lastField = "";
  var property = function () { return (document.getElementById("f-property") || {}).value || "not chosen"; };
  var filledCount = function () { return Object.keys(done).length; };

  function send(event, extra) {
    var data = { event: event, form_name: "briefing", property: property(), fields_total: total, fields_filled: filledCount() };
    for (var k in extra) data[k] = extra[k];
    window.dataLayer.push(data);
  }

  // 1. The form came into view
  var seen = false;
  function viewed() { if (!seen) { seen = true; send("grr_form_view", {}); } }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting) { viewed(); obs.disconnect(); }
    }, { threshold: 0.3 }).observe(form);
  } else { viewed(); }

  fields.forEach(function (el, i) {
    // 2. First touch of any field
    function start() {
      lastField = el.name;
      if (!started) { started = true; viewed(); send("grr_form_start", { first_field: el.name }); }
    }
    el.addEventListener("focus", start);
    el.addEventListener("input", start);
    // 3. A field was completed (the first time only)
    el.addEventListener("change", function () {
      start();
      if (!el.value || done[el.name]) return;
      done[el.name] = true;
      send("grr_form_field", { field_name: el.name, field_position: i + 1 });
    });
    // 4. The browser blocked the submit because a required field is empty or wrong
    el.addEventListener("invalid", function () { send("grr_form_error", { field_name: el.name }); });
  });

  // 5. Submit pressed and accepted by the browser
  form.addEventListener("submit", function () {
    submitted = true;
    send("grr_form_submit", {});
    var r = form.querySelector('input[name="redirect"]');
    if (r) r.value = r.value.split("?")[0] + "?property=" + encodeURIComponent(property());
  });

  // 6. Left the page after starting but without sending
  var left = false;
  function abandon() {
    if (left || !started || submitted) return;
    left = true;
    send("grr_form_abandon", { last_field: lastField });
  }
  window.addEventListener("pagehide", abandon);
})();
