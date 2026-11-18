// Language suggestion for English pages that also exist in Chinese or Malay.
// Never redirects (search engines and people on English-set phones keep the English page).
// If the browser prefers a language this page is available in, a small bar offers to switch.
// "No thanks", or any use of the language bar, is remembered on this device.
(function () {
  var KEY = "grr_lang_choice";
  var TEXT = {
    "zh-Hans": ["此页面有简体中文版。", "切换到中文", "不用了"],
    "zh-TW": ["此頁面有繁體中文版。", "切換到中文", "不用了"],
    "ms": ["Halaman ini ada dalam Bahasa Malaysia.", "Tukar ke Bahasa Malaysia", "Tidak, terima kasih"]
  };
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return "x"; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function track(name) { (window.dataLayer = window.dataLayer || []).push({ event: name }); }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest(".lang-switch a[hreflang]");
    if (a) set(a.getAttribute("hreflang"));
  });
  if (get()) return;

  var alt = {};
  [].forEach.call(document.querySelectorAll('link[rel="alternate"][hreflang]'), function (l) {
    alt[l.getAttribute("hreflang")] = l.getAttribute("href");
  });
  function pick(tag) {
    tag = tag.toLowerCase();
    if (tag.indexOf("en") === 0) return "en";
    if (tag.indexOf("zh") === 0) return /tw|hk|mo|hant/.test(tag) ? "zh-TW" : "zh-Hans";
    if (tag.indexOf("ms") === 0) return "ms";
    return null;
  }
  var prefs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
  var want = null;
  for (var i = 0; i < prefs.length && !want; i++) want = pick(prefs[i]);
  if (!want || want === "en" || !alt[want] || !TEXT[want]) return;

  var t = TEXT[want], href = new URL(alt[want]).pathname + location.search + location.hash;
  var css = document.createElement("style");
  css.textContent = ".lang-suggest{background:#142A3B;color:#fff;font-size:15px}" +
    ".lang-suggest .container{display:flex;flex-wrap:wrap;align-items:center;gap:10px 16px;padding-top:10px;padding-bottom:10px}" +
    ".lang-suggest a{color:#fff;font-weight:600;background:#E2604B;padding:6px 14px;border-radius:6px;text-decoration:none}" +
    ".lang-suggest button{background:none;border:0;color:#fff;opacity:.8;text-decoration:underline;cursor:pointer;font:inherit;padding:6px 0}";
  document.head.appendChild(css);
  var bar = document.createElement("div");
  bar.className = "lang-suggest";
  bar.setAttribute("lang", want);
  bar.innerHTML = '<div class="container"><span></span> <a></a> <button type="button"></button></div>';
  bar.querySelector("span").textContent = t[0];
  var go = bar.querySelector("a"); go.href = href; go.textContent = t[1];
  var no = bar.querySelector("button"); no.textContent = t[2];
  go.addEventListener("click", function () { set(want); track("grr_lang_suggest_accept"); });
  no.addEventListener("click", function () { set("en"); bar.remove(); track("grr_lang_suggest_dismiss"); });
  var anchor = document.querySelector(".lang-switch") || document.querySelector("header");
  anchor.parentNode.insertBefore(bar, anchor.nextSibling);
  track("grr_lang_suggest_shown");
})();
