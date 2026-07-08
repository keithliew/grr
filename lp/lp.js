/* ============================================================
   Lexis Hibiscus 2 — Landing Page JS (shared, self-contained)
   Replace placeholders before launch:
   [WHATSAPP_NUMBER]  e.g. 60123456789 (country code, no + or spaces)
   ============================================================ */

(function () {
  "use strict";

  var WHATSAPP_NUMBER = "60122970362"; // <-- REPLACE before launch

  // Which variant is this page? (set via <body data-variant="A|B">)
  var variant = document.body.getAttribute("data-variant") || "A";
  var waText =
    variant === "A"
      ? "Hi, I'd like the Lexis Hibiscus 2 rental programme details."
      : "Hi, I'd like more information on Lexis Hibiscus 2 villas.";

  // ---------- WhatsApp links: build href + track clicks ----------
  var waUrl =
    "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(waText);
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    el.setAttribute("href", waUrl);
    el.setAttribute("rel", "noopener");
  });

  // ---------- FAQ accordion ----------
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var isOpen = item.classList.contains("open");
      // close others for a tidy single-open behaviour
      document.querySelectorAll(".faq-item.open").forEach(function (o) {
        o.classList.remove("open");
        o.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // ---------- Sticky mobile CTA bar (appears after hero) ----------
  var sticky = document.querySelector(".sticky-bar");
  var hero = document.querySelector(".hero");
  if (sticky && hero) {
    var onScroll = function () {
      if (window.scrollY > hero.offsetHeight * 0.7) {
        sticky.classList.add("visible");
      } else {
        sticky.classList.remove("visible");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---------- Scroll reveal (respects reduced motion) ----------
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");
  if (!reduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  }

  // ---------- Lead form: stash variant + source, light validation ----------
  var form = document.querySelector(".lead-form");
  if (form) {
    var variantField = form.querySelector('input[name="lp_variant"]');
    if (variantField) variantField.value = variant;

    form.addEventListener("submit", function (e) {
      var phone = form.querySelector('input[name="whatsapp_number"]');
      if (phone && phone.value.replace(/\D/g, "").length < 7) {
        e.preventDefault();
        phone.setCustomValidity(
          "Enter a valid WhatsApp number so our consultant can reach you."
        );
        phone.reportValidity();
        return;
      }
      // Note: lead_form_submit conversion fires on thank-you.html,
      // not here, so only completed submissions count.
    });
    var phoneInput = form.querySelector('input[name="whatsapp_number"]');
    if (phoneInput) {
      phoneInput.addEventListener("input", function () {
        phoneInput.setCustomValidity("");
      });
    }
  }
})();
