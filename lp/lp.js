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
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
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

  // ---------- Hero photo: manual cover-crop + scroll-driven reveal ----------
  // Renders the hero <img> at its true natural aspect ratio, scaled up just
  // enough to cover its frame (replicating object-fit:cover math ourselves),
  // which gives real pixel overflow to translate as the user scrolls. On a
  // tall portrait source image this reveals content below the initial crop;
  // on a landscape image overflowY comes out near zero, so this is a
  // harmless static cover-fill there — same code path for every page.
  if (!reduced) {
    document.querySelectorAll(".hero-photo-frame").forEach(function (frame) {
      var img = frame.querySelector(".hero-photo");
      if (!img) return;

      var overflowY = 0, overflowX = 0, ready = false;

      var measure = function () {
        var fw = frame.clientWidth, fh = frame.clientHeight;
        var nw = img.naturalWidth, nh = img.naturalHeight;
        if (!fw || !fh || !nw || !nh) { ready = false; return; }
        var scale = Math.max(fw / nw, fh / nh);
        var rw = nw * scale, rh = nh * scale;
        overflowX = Math.max(0, rw - fw);
        overflowY = Math.max(0, rh - fh);
        img.style.width = rw + "px";
        img.style.height = rh + "px";
        img.style.left = (-overflowX / 2) + "px";
        img.style.top = "0px";
        ready = true;
      };

      var applyScroll = function () {
        if (!ready) return;
        var rect = frame.getBoundingClientRect();
        var total = rect.height || 1;
        var progress = Math.max(0, Math.min(1, -rect.top / total));
        img.style.transform = "translateY(" + (-overflowY * progress).toFixed(1) + "px)";
      };

      var onResize = function () { measure(); applyScroll(); };

      if (img.complete && img.naturalWidth) {
        measure();
      } else {
        img.addEventListener("load", onResize, { once: true });
      }
      applyScroll();
      window.addEventListener("scroll", applyScroll, { passive: true });
      window.addEventListener("resize", onResize);
    });
  }

  // ---------- Lightbox for real property photo galleries (.gallery img, .villa-grid img) ----------
  var galleries = document.querySelectorAll(".gallery, .villa-grid");
  if (galleries.length) {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML =
      '<button class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button class="lightbox-prev" aria-label="Previous image">&lsaquo;</button>' +
      '<img class="lightbox-img" alt="">' +
      '<p class="lightbox-caption"></p>' +
      '<button class="lightbox-next" aria-label="Next image">&rsaquo;</button>';
    document.body.appendChild(lb);

    var imgEl = lb.querySelector(".lightbox-img");
    var capEl = lb.querySelector(".lightbox-caption");
    var currentItems = [], currentIndex = 0, touchStartX = null;

    galleries.forEach(function (gallery) {
      var imgs = Array.prototype.slice.call(gallery.querySelectorAll("img"));
      if (!imgs.length) return;
      var items = imgs.map(function (img) {
        var fig = img.closest("figure");
        var cap = fig ? fig.querySelector("figcaption") : null;
        return { src: img.currentSrc || img.src, caption: cap ? cap.textContent.trim() : (img.alt || "") };
      });
      imgs.forEach(function (img, i) {
        img.style.cursor = "pointer";
        img.addEventListener("click", function () { openLb(items, i); });
      });
    });

    var openLb = function (items, i) {
      currentItems = items; currentIndex = i;
      renderLb();
      lb.classList.add("open");
      document.addEventListener("keydown", onLbKey);
    };
    var closeLb = function () {
      lb.classList.remove("open");
      document.removeEventListener("keydown", onLbKey);
    };
    var renderLb = function () {
      var item = currentItems[currentIndex];
      imgEl.src = item.src; imgEl.alt = item.caption; capEl.textContent = item.caption;
    };
    var nextLb = function () { currentIndex = (currentIndex + 1) % currentItems.length; renderLb(); };
    var prevLb = function () { currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length; renderLb(); };
    var onLbKey = function (e) {
      if (e.key === "Escape") closeLb();
      else if (e.key === "ArrowRight") nextLb();
      else if (e.key === "ArrowLeft") prevLb();
    };

    lb.querySelector(".lightbox-close").addEventListener("click", closeLb);
    lb.querySelector(".lightbox-next").addEventListener("click", nextLb);
    lb.querySelector(".lightbox-prev").addEventListener("click", prevLb);
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    lb.addEventListener("touchstart", function (e) { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { dx < 0 ? nextLb() : prevLb(); }
      touchStartX = null;
    }, { passive: true });
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
