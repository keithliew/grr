// GRR Malaysia — shared behaviors (nav, fade-up, count-up, video facades)
(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile nav
  var t=document.querySelector('.nav-toggle'), n=document.getElementById('nav');
  if(t&&n){ t.addEventListener('click',function(){ n.classList.toggle('open'); }); }

  // Fade-up + count-up on scroll
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-count]').forEach(startCount);
      io.unobserve(e.target);
    });
  },{threshold:.25});
  document.querySelectorAll('.fade-up').forEach(function(el){ io.observe(el); });

  function startCount(el){
    if(el.dataset.done) return; el.dataset.done="1";
    var target=parseFloat(el.dataset.count), dec=parseInt(el.dataset.dec||"0",10),
        prefix=el.dataset.prefix||"", suffix=el.dataset.suffix||"";
    if(reduced){ el.textContent=prefix+fmt(target,dec)+suffix; return; }
    var dur=1200, t0=null;
    function step(ts){ if(!t0)t0=ts; var p=Math.min((ts-t0)/dur,1);
      p=1-Math.pow(1-p,3); // ease-out
      el.textContent=prefix+fmt(target*p,dec)+suffix;
      if(p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function fmt(v,dec){ return v.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec}); }

  // YouTube facades — iframe injected only on click (performance)
  document.querySelectorAll('.video-facade').forEach(function(f){
    f.addEventListener('click',function(){
      if(f.dataset.loaded) return; f.dataset.loaded="1";
      var id=f.dataset.yt, ifr=document.createElement('iframe');
      ifr.src="https://www.youtube-nocookie.com/embed/"+id+"?autoplay=1&rel=0";
      ifr.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      ifr.allowFullscreen=true; ifr.title=f.dataset.title||"Video";
      f.appendChild(ifr);
    });
  });
})();

// Lightbox for real property photo galleries (.gallery img)
(function(){
  var galleries = document.querySelectorAll('.gallery');
  if(!galleries.length) return;

  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML =
    '<button class="lightbox-close" aria-label="Close">&times;</button>' +
    '<button class="lightbox-prev" aria-label="Previous image">&lsaquo;</button>' +
    '<img class="lightbox-img" alt="">' +
    '<p class="lightbox-caption"></p>' +
    '<button class="lightbox-next" aria-label="Next image">&rsaquo;</button>';
  document.body.appendChild(lb);

  var imgEl = lb.querySelector('.lightbox-img');
  var capEl = lb.querySelector('.lightbox-caption');
  var currentItems = [], currentIndex = 0, touchStartX = null;

  galleries.forEach(function(gallery){
    var imgs = Array.prototype.slice.call(gallery.querySelectorAll('img'));
    if(!imgs.length) return;
    var items = imgs.map(function(img){
      var fig = img.closest('figure');
      var cap = fig ? fig.querySelector('figcaption') : null;
      return { src: img.currentSrc || img.src, caption: cap ? cap.textContent.trim() : (img.alt || '') };
    });
    imgs.forEach(function(img, i){
      img.style.cursor = 'pointer';
      img.addEventListener('click', function(){ open(items, i); });
    });
  });

  function open(items, i){
    currentItems = items; currentIndex = i;
    render();
    lb.classList.add('open');
    document.addEventListener('keydown', onKey);
  }
  function close(){
    lb.classList.remove('open');
    document.removeEventListener('keydown', onKey);
  }
  function render(){
    var item = currentItems[currentIndex];
    imgEl.src = item.src; imgEl.alt = item.caption; capEl.textContent = item.caption;
  }
  function next(){ currentIndex = (currentIndex + 1) % currentItems.length; render(); }
  function prev(){ currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length; render(); }
  function onKey(e){
    if(e.key === 'Escape') close();
    else if(e.key === 'ArrowRight') next();
    else if(e.key === 'ArrowLeft') prev();
  }

  lb.querySelector('.lightbox-close').addEventListener('click', close);
  lb.querySelector('.lightbox-next').addEventListener('click', next);
  lb.querySelector('.lightbox-prev').addEventListener('click', prev);
  lb.addEventListener('click', function(e){ if(e.target === lb) close(); });
  lb.addEventListener('touchstart', function(e){ touchStartX = e.changedTouches[0].clientX; }, {passive:true});
  lb.addEventListener('touchend', function(e){
    if(touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if(Math.abs(dx) > 40){ dx < 0 ? next() : prev(); }
    touchStartX = null;
  }, {passive:true});
})();

// Automatically load the shared footer into the container
document.addEventListener("DOMContentLoaded", () => {
  const footerContainer = document.getElementById('site-footer-container');
  if (footerContainer) {
    fetch('footer.html')
      .then(response => response.text())
      .then(data => {
        footerContainer.innerHTML = data;
      })
      .catch(error => console.error('Error loading footer:', error));
  }
});