(function(){
 const path=(location.pathname.split('/').pop()||'admin.html').toLowerCase();
 const app=window.AppStore?AppStore.counts():{inquiriesOpen:0,enterpriseOpen:0,feedbackOpen:0};
 const pending=window.RiskStore?RiskStore.all().filter(x=>x.status==='pending'||x.status==='ambiguous').length:0;
 const openInquiries=(app.inquiriesOpen||0)+(app.enterpriseOpen||0)+(app.feedbackOpen||0);

 const items=[
  ['OVERVIEW',[['admin.html','대시보드','']]],
  ['MANAGEMENT',[
    ['admin-expressions.html','표현 관리',pending||''],
    ['admin-inquiries.html','문의 관리',openInquiries||''],
    ['admin-analytics.html','통계 관리','']
  ]],
  ['SYSTEM',[
    ['admin-database.html','데이터 백업',''],
    ['admin-settings.html','시스템 설정','']
  ]]
 ];

 const sidebar=`
 <aside class="admin-sidebar">
   <a class="admin-brand admin-nav-link" href="admin.html">
     <img src="assets/img/logo.png" alt="">
     <span>NAROCK BLOCKER<br><span class="purple">ADMIN</span></span>
   </a>

   ${items.map(([g,ls])=>`
     <div class="admin-group">
       <div class="admin-group-title">${g}</div>
       <div class="admin-menu">
         ${ls.map(([f,n,b])=>`
           <a class="${path===f?'active':''} admin-nav-link" href="${f}">
             <span>${n}</span>${b?`<em>${b}</em>`:''}
           </a>`).join('')}
       </div>
     </div>`).join('')}

   <div class="admin-engine">
     <div class="admin-engine-line"><span class="admin-live-dot"></span>Prototype Engine</div>
     <div>Risk DB + LocalStorage</div>
     <div class="admin-engine-links">
       <a href="analyzer.html">Analyzer ↗</a>
       <span>·</span>
       <a href="index.html">Public Site ↗</a>
     </div>
   </div>
 </aside>

 <div class="admin-page-transition" id="adminPageTransition" aria-hidden="true">
   <div class="admin-transition-orb"></div>
   <div class="admin-transition-line"></div>
 </div>`;

 const root=document.querySelector('.admin-layout');
 if(root)root.insertAdjacentHTML('afterbegin',sidebar);

 // Enter animation: applied after sidebar injection so content/sidebar animate together.
 requestAnimationFrame(()=>{
   document.body.classList.add('admin-ready');
 });

 // Animated navigation between admin HTML pages.
 const links=[...document.querySelectorAll('a.admin-nav-link')];
 links.forEach(link=>{
   link.addEventListener('click',e=>{
     const href=link.getAttribute('href');
     if(!href || href===path || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

     e.preventDefault();

     // Visual feedback on the exact item the user selected.
     document.querySelectorAll('.admin-menu a').forEach(a=>a.classList.remove('nav-selected'));
     link.classList.add('nav-selected');

     document.body.classList.add('admin-navigating');
     const transition=document.getElementById('adminPageTransition');
     if(transition) transition.classList.add('show');

     // Keep the animation noticeable but still responsive.
     window.setTimeout(()=>{ location.href=href; }, 430);
   });
 });

 // Keyboard / browser-back friendly entry state.
 window.addEventListener('pageshow',()=>{
   document.body.classList.remove('admin-navigating');
   const transition=document.getElementById('adminPageTransition');
   if(transition)transition.classList.remove('show');
 });

 window.showToast=function(msg){
   let t=document.getElementById('adminToast');
   if(!t){
     t=document.createElement('div');
     t.id='adminToast';
     t.className='toast';
     document.body.appendChild(t);
   }
   t.textContent=msg;
   t.classList.add('show');
   clearTimeout(window.__toast);
   window.__toast=setTimeout(()=>t.classList.remove('show'),1900);
 };
})();