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
