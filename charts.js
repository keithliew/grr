// Hover and tap tooltips for chart marks that carry data-tip
(function () {
  var tip = document.createElement("div");
  tip.className = "tip";
  tip.setAttribute("role", "status");
  document.body.appendChild(tip);

  function show(el, x, y) {
    tip.textContent = el.getAttribute("data-tip");
    tip.classList.add("on");
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var left = Math.min(Math.max(8, x - w / 2), window.innerWidth - w - 8);
    tip.style.left = left + "px";
    tip.style.top = Math.max(8, y - h - 14) + "px";
  }
  function hide() { tip.classList.remove("on"); }

  document.querySelectorAll("[data-tip]").forEach(function (el) {
    el.addEventListener("mousemove", function (e) { show(el, e.clientX, e.clientY); });
    el.addEventListener("mouseleave", hide);
    el.addEventListener("focus", function () {
      var r = el.getBoundingClientRect();
      show(el, r.left + r.width / 2, r.top);
    });
    el.addEventListener("blur", hide);
    el.addEventListener("click", function (e) {
      var r = el.getBoundingClientRect();
      show(el, r.left + r.width / 2, r.top);
      e.stopPropagation();
    });
  });
  document.addEventListener("click", hide);
  window.addEventListener("scroll", hide, { passive: true });
})();
