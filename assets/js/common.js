
(function(){
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const active=(file)=>path===file?' active':'';
  const adminShortcut = path==='index.html'
    ? '<a class="btn small admin-shortcut route" href="admin.html" title="관리자 콘솔 열기"><span class="admin-shortcut-dot"></span>Admin</a>'
    : '';
  const header=`
  <header class="site-header">
   <div class="header-shell">
    <a class="brand route" href="index.html"><img src="assets/img/logo.png" alt=""><span>NAROCK BLOCKER</span></a>
    <nav class="nav" aria-label="주요 메뉴">
      <div class="nav-group">
        <button class="nav-trigger${active('product.html')}" type="button">Product ▾</button>
        <div class="mega"><div class="mega-title">PRODUCT</div><div class="mega-grid">
          <a class="mega-item route" href="product.html#text"><b>Text Analysis <i class="pill">LIVE</i></b><span>표현·문맥 기반 텍스트 검토</span></a>
          <a class="mega-item route" href="product.html#image"><b>Image Analysis <i class="pill">BETA</i></b><span>OCR + 시각적 맥락 구조</span></a>
          <a class="mega-item route" href="product.html#video"><b>Video Analysis <i class="pill">SOON</i></b><span>자막·음성·장면 분석</span></a>
          <a class="mega-item route" href="product.html#local"><b>Localization</b><span>나라·플랫폼별 표현 추천</span></a>
        </div></div>
      </div>
      <div class="nav-group">
        <button class="nav-trigger${active('analyzer.html')}" type="button">Analyzer ▾</button>
        <div class="mega"><div class="mega-title">ANALYZER</div><div class="mega-grid">
          <a class="mega-item route" href="analyzer.html?mode=text"><b>Text Analyzer <i class="pill">LIVE</i></b><span>실제 DB 기반 검사 Workspace</span></a>
          <a class="mega-item route" href="analyzer.html?mode=image"><b>Image Analyzer <i class="pill">BETA</i></b><span>이미지 검사 확장 화면</span></a>
          <a class="mega-item route" href="analyzer.html?mode=video"><b>Video Analyzer <i class="pill">SOON</i></b><span>영상 분석 Pipeline Preview</span></a>
          <a class="mega-item route" href="risk-system.html"><b>Local Context</b><span>플랫폼·지역별 표현 추천</span></a>
        </div></div>
      </div>
      <a class="nav-link route${active('how-it-works.html')}" href="how-it-works.html">How it works</a>
      <div class="nav-group">
        <button class="nav-trigger${active('risk-system.html')}" type="button">Risk System ▾</button>
        <div class="mega"><div class="mega-title">RISK SYSTEM</div><div class="mega-grid">
          <a class="mega-item route" href="risk-system.html"><b>Risk Universe</b><span>위험 요소를 인터랙티브하게 탐색</span></a>
          <a class="mega-item route" href="risk-system.html#categories"><b>10 Risk Categories</b><span>10개 위험 영역 · 5단계</span></a>
          <a class="mega-item route" href="trust.html"><b>Trust & Criteria</b><span>판단 기준·한계·사람 검토</span></a>
        </div></div>
      </div>
      <div class="nav-group">
        <button class="nav-trigger${active('solutions.html')}" type="button">Solutions ▾</button>
        <div class="mega"><div class="mega-title">SOLUTIONS</div><div class="mega-grid">
          <a class="mega-item route" href="solutions.html#creator"><b>Creator / MCN</b><span>업로드 전 영상·게시물 검토</span></a>
          <a class="mega-item route" href="solutions.html#brand"><b>Brand</b><span>기업 SNS·마케팅 표현 검수</span></a>
          <a class="mega-item route" href="solutions.html#media"><b>Media</b><span>방송·언론 공개 전 검토</span></a>
          <a class="mega-item route" href="solutions.html#public"><b>Education & Public</b><span>학교·공공기관용 보수적 기준</span></a>
        </div></div>
      </div>
      <a class="nav-link route${active('business.html')}" href="business.html">Enterprise</a>
    </nav>
    <div class="nav-actions">
      ${adminShortcut}
      <a class="btn small secondary route" href="trust.html">Trust</a>
      <a class="btn small secondary route" href="login.html">로그인</a>
      <a class="btn small purple route" href="analyzer.html">무료 검사 시작 →</a>
      <a class="btn small mobile-menu route" href="analyzer.html">검사</a>
    </div>
   </div>
  </header>
  <div id="pageWipe"></div><div class="mouse-aura" id="mouseAura"></div>`;
  document.body.insertAdjacentHTML('afterbegin',header);

  // Route transition
  document.querySelectorAll('a.route').forEach(a=>a.addEventListener('click',e=>{
    const href=a.getAttribute('href'); if(!href||href.startsWith('#'))return;
    const base=href.split('#')[0].split('?')[0];
    if(base===path && href.includes('#'))return;
    e.preventDefault(); const wipe=document.getElementById('pageWipe'); wipe.classList.add('go');
    setTimeout(()=>location.href=href,430);
  }));

  // Mobile tap toggles mega menu
  document.querySelectorAll('.nav-trigger').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const g=btn.closest('.nav-group');
      document.querySelectorAll('.nav-group.open').forEach(x=>{if(x!==g)x.classList.remove('open')});
      g.classList.toggle('open');
    });
  });

  // Slow reveal
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on')}),{threshold:.11});
  document.querySelectorAll('.reveal').forEach(x=>io.observe(x));

  // Mouse aura with eased follow
  const aura=document.getElementById('mouseAura');
  if(aura && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    let tx=innerWidth/2,ty=innerHeight/2,x=tx,y=ty;
    addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY});
    const loop=()=>{x+=(tx-x)*.075;y+=(ty-y)*.075;aura.style.left=x+'px';aura.style.top=y+'px';requestAnimationFrame(loop)};loop();
  }

  // magnetic CTA
  document.querySelectorAll('[data-magnetic]').forEach(el=>{
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.10,y=(e.clientY-r.top-r.height/2)*.10;el.style.transform=`translate(${x}px,${y}px)`});
    el.addEventListener('pointerleave',()=>el.style.transform='');
  });

  // tilt cards
  document.querySelectorAll('[data-tilt]').forEach(el=>{
    el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateY(${x*5}deg) rotateX(${-y*4}deg) translateY(-5px)`});
    el.addEventListener('pointerleave',()=>el.style.transform='');
  });
})();
