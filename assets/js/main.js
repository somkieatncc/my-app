(function(){
  // Cookie bar
  var ck=document.getElementById('cookie'), stored=null;
  if(ck){
    try{stored=localStorage.getItem('ica_cookie')}catch(e){}
    if(!stored) ck.classList.add('show');
    ck.querySelectorAll('[data-close]').forEach(function(b){b.onclick=function(){ck.classList.remove('show');try{localStorage.setItem('ica_cookie',b.className||'closed')}catch(e){}}});
  }

  // Sticky header
  var bar=document.getElementById('Top_bar'), sp=document.getElementById('headerSpacer'), ab=document.getElementById('Action_bar');
  window.addEventListener('scroll',function(){
    var s=window.scrollY>(ab.offsetHeight+70);
    bar.classList.toggle('is-sticky',s); sp.classList.toggle('on',s);
  },{passive:true});

  // Mobile menu
  var menu=document.getElementById('menu');
  document.getElementById('burger').onclick=function(){menu.classList.toggle('open')};
  menu.querySelectorAll('.menu-toggle').forEach(function(t){t.onclick=function(){t.parentNode.classList.toggle('open')}});
  menu.querySelectorAll('li.submenu > a').forEach(function(a){a.addEventListener('click',function(e){if(a.getAttribute('href')==='#'){e.preventDefault(); if(window.innerWidth<1240)a.parentNode.classList.toggle('open')}})});

  // B2B carousel (home only)
  var c=document.getElementById('b2bCarousel');
  if(c){
    var track=c.querySelector('.track'), slides=track.children, dots=c.querySelector('.dots'), i=0, timer;
    for(var k=0;k<slides.length;k++){(function(k){var b=document.createElement('button');b.setAttribute('aria-label','Slide '+(k+1));b.onclick=function(){go(k);restart()};dots.appendChild(b)})(k)}
    function go(n){i=(n+slides.length)%slides.length;track.style.transform='translateX(-'+(i*100)+'%)';[].forEach.call(dots.children,function(d,j){d.classList.toggle('active',j===i)})}
    function restart(){clearInterval(timer);timer=setInterval(function(){go(i+1)},5000)}
    c.addEventListener('mouseenter',function(){clearInterval(timer)});
    c.addEventListener('mouseleave',restart);
    go(0);restart();
  }

  // Forms: static site has no backend yet.
  // TODO: point form[data-endpoint] to the real receiver (e.g. Power Automate / n8n webhook).
  document.querySelectorAll('form.static-form').forEach(function(f){
    f.addEventListener('submit',function(e){
      var ep=f.getAttribute('data-endpoint');
      var note=f.querySelector('.form-note');
      if(!ep){e.preventDefault(); if(note) note.classList.add('show'); return;}
      e.preventDefault();
      fetch(ep,{method:'POST',body:new FormData(f)}).then(function(){ if(note){note.textContent=f.getAttribute('data-ok')||'Thank you.';note.classList.add('show')} f.reset(); });
    });
  });
})();
