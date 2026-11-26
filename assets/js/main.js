(function(){
  // ===== Cookie consent (PDPA) =====
  // หมวด: necessary (เปิดเสมอ), analytics (เช่น GA4), marketing (เช่น Google Maps, pixel โฆษณา)
  // ใส่ script ที่ต้องรอความยินยอมแบบนี้:
  //   <script type="text/plain" data-consent="analytics" src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>
  //   <script type="text/plain" data-consent="analytics"> ...inline code... </script>
  // iframe ภายนอก: เปลี่ยน src เป็น data-src และใส่ data-consent="marketing"
  // ฟังการเปลี่ยนแปลง: window.icaConsent.onChange(function(c){ /* c.analytics, c.marketing */ })
  var KEY='ica_consent', VER=1, MAX_AGE=365*24*3600*1000;
  var th=(document.documentElement.lang||'').indexOf('th')===0;
  var T=th?{title:'ตั้งค่าคุกกี้',nec:'คุกกี้ที่จำเป็น',necD:'จำเป็นต่อการทำงานของเว็บไซต์ ปิดไม่ได้',ana:'คุกกี้เพื่อการวิเคราะห์',anaD:'ช่วยให้เราเข้าใจการใช้งานเว็บไซต์ (เช่น Google Analytics)',mkt:'คุกกี้การตลาดและบริการภายนอก',mktD:'แผนที่ Google Maps และเครื่องมือโฆษณา',save:'บันทึกการตั้งค่า',all:'ยอมรับทั้งหมด',map:'แสดงแผนที่ต้องเปิดใช้คุกกี้การตลาดและบริการภายนอก',mapBtn:'แสดงแผนที่',always:'เปิดใช้งานเสมอ'}
           :{title:'Cookie Settings',nec:'Strictly necessary',necD:'Required for the website to work. Always on.',ana:'Analytics cookies',anaD:'Help us understand how the site is used (e.g. Google Analytics).',mkt:'Marketing & third-party cookies',mktD:'Google Maps embeds and advertising tools.',save:'Save settings',all:'Accept all',map:'Showing the map requires marketing & third-party cookies.',mapBtn:'Show map',always:'Always on'};
  var listeners=[], consent=read();

  function read(){
    try{var c=JSON.parse(localStorage.getItem(KEY)); if(c&&c.v===VER&&Date.now()-c.ts<MAX_AGE) return c;}catch(e){}
    return null;
  }
  function save(a,m){
    consent={v:VER,ts:Date.now(),necessary:true,analytics:!!a,marketing:!!m};
    try{localStorage.setItem(KEY,JSON.stringify(consent));localStorage.removeItem('ica_cookie')}catch(e){}
    hideBar(); apply(); listeners.forEach(function(f){try{f(consent)}catch(e){}});
  }
  function allowed(cat){return cat==='necessary'||!!(consent&&consent[cat])}
  function apply(){
    document.querySelectorAll('script[type="text/plain"][data-consent]').forEach(function(s){
      if(!allowed(s.getAttribute('data-consent'))) return;
      var n=document.createElement('script');
      [].forEach.call(s.attributes,function(a){if(a.name!=='type'&&a.name!=='data-consent')n.setAttribute(a.name,a.value)});
      if(!s.src) n.text=s.text;
      s.parentNode.replaceChild(n,s);
    });
    document.querySelectorAll('iframe[data-src][data-consent]').forEach(function(f){
      var ph=f.previousElementSibling&&f.previousElementSibling.classList.contains('consent-ph')?f.previousElementSibling:null;
      if(allowed(f.getAttribute('data-consent'))){
        f.src=f.getAttribute('data-src'); f.removeAttribute('data-src'); f.style.display=''; if(ph) ph.remove();
      }else if(!ph){
        f.style.display='none';
        ph=document.createElement('div'); ph.className='consent-ph';
        ph.style.width=(f.getAttribute('width')||600)+'px'; ph.style.height=(f.getAttribute('height')||400)+'px';
        ph.innerHTML='<p>'+T.map+'</p><button type="button">'+T.mapBtn+'</button>';
        ph.querySelector('button').onclick=function(){save(consent?consent.analytics:false,true)};
        f.parentNode.insertBefore(ph,f);
      }
    });
  }

  var ck=document.getElementById('cookie');
  function hideBar(){if(ck)ck.classList.remove('show')}
  if(ck){
    if(!consent) ck.classList.add('show');
    var on=function(sel,fn){var b=ck.querySelector(sel); if(b){b.removeAttribute('data-close'); b.onclick=fn}};
    on('.accept',function(){save(true,true)});
    on('.reject',function(){save(false,false)});
    on('.x',function(){save(false,false)});            // ปิดโดยไม่เลือก = ปฏิเสธ (ไม่ถือว่ายินยอม)
    on('.setting',function(){openPanel()});
  }

  var panel;
  function openPanel(){
    if(!panel){
      panel=document.createElement('div'); panel.className='ck-panel'; panel.setAttribute('role','dialog'); panel.setAttribute('aria-modal','true'); panel.setAttribute('aria-label',T.title);
      var row=function(id,t,d,fixed){return '<label class="ck-row"><span><strong>'+t+'</strong><small>'+d+'</small></span>'+(fixed?'<em>'+T.always+'</em>':'<input type="checkbox" id="'+id+'">')+'</label>'};
      panel.innerHTML='<div class="ck-box"><button class="ck-x" type="button" aria-label="Close">×</button><h3>'+T.title+'</h3>'
        +row('',T.nec,T.necD,true)+row('ckA',T.ana,T.anaD)+row('ckM',T.mkt,T.mktD)
        +'<div class="ck-btns"><button type="button" class="ck-save">'+T.save+'</button><button type="button" class="ck-all">'+T.all+'</button></div></div>';
      document.body.appendChild(panel);
      panel.querySelector('.ck-x').onclick=closePanel;
      panel.addEventListener('click',function(e){if(e.target===panel)closePanel()});
      panel.querySelector('.ck-save').onclick=function(){save(panel.querySelector('#ckA').checked,panel.querySelector('#ckM').checked);closePanel()};
      panel.querySelector('.ck-all').onclick=function(){save(true,true);closePanel()};
    }
    panel.querySelector('#ckA').checked=allowed('analytics');
    panel.querySelector('#ckM').checked=allowed('marketing');
    panel.classList.add('show'); panel.querySelector('.ck-save').focus();
  }
  function closePanel(){if(panel)panel.classList.remove('show')}
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closePanel()});
  document.querySelectorAll('[data-cookie-settings]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();openPanel()})});

  window.icaConsent={get:function(){return consent},allowed:allowed,open:openPanel,onChange:function(f){listeners.push(f)}};
  apply();

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
