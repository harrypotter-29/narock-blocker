(function(){
 const list=document.getElementById('inquiryList');if(!list)return;
 const detail=document.getElementById('inquiryDetail');
 const statusFilter=document.getElementById('inquiryStatusFilter');
 const tabs=[...document.querySelectorAll('[data-inquiry-type]')];
 let store='enterpriseRequests',selected=null;
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const label={enterpriseRequests:'기업 문의',feedback:'표현 신고',inquiries:'일반 문의'};
 function badge(s){const cls=s==='new'?'new':s==='done'?'done':'progress';const txt={new:'신규',done:'완료',reviewing:'검토 중',consulting:'상담 중',in_progress:'처리 중'}[s]||s;return `<span class="admin-badge ${cls}">${txt}</span>`}
 function counts(){
  const e=AppStore.list('enterpriseRequests'),f=AppStore.list('feedback'),s=AppStore.list('inquiries');
  document.getElementById('iEnterprise').textContent=e.length;document.getElementById('iFeedback').textContent=f.length;document.getElementById('iSupport').textContent=s.length;
  const open=[...e,...f,...s].filter(x=>x.status!=='done').length;document.getElementById('iOpen').textContent=open;
  document.getElementById('tabEnterpriseCount').textContent=e.filter(x=>x.status!=='done').length;document.getElementById('tabFeedbackCount').textContent=f.filter(x=>x.status!=='done').length;document.getElementById('tabSupportCount').textContent=s.filter(x=>x.status!=='done').length;
 }
 function titleOf(x){return store==='enterpriseRequests'?(x.company||'기업 도입 문의'):store==='feedback'?(x.term||({missed_term:'놓친 표현',judgement:'판단 이의',recommendation:'추천 개선'}[x.kind])||'표현 신고'):(x.subject||'일반 문의')}
 function subtitleOf(x){return store==='enterpriseRequests'?`${x.name||'-'} · ${x.need||'general'}`:store==='feedback'?({missed_term:'놓친 표현',judgement:'판단 이의',recommendation:'추천 개선'}[x.kind]||x.kind||'feedback'):`${x.name||'-'} · ${x.type||'support'}`}
 function renderList(){
  counts();const st=statusFilter.value;const arr=AppStore.list(store).filter(x=>!st||x.status===st);
  if(selected&&!arr.some(x=>x.id===selected))selected=null;
  list.innerHTML=arr.map(x=>`<button class="inbox-item ${selected===x.id?'active':''}" data-id="${x.id}">${badge(x.status)}${x.demo?'<span class="admin-badge demo" style="margin-left:5px">DEMO</span>':''}<b>${esc(titleOf(x))}</b><span class="muted" style="font-size:10px">${esc(subtitleOf(x))} · ${new Date(x.createdAt).toLocaleDateString()}</span></button>`).join('')||'<div class="empty-box">이 조건의 문의가 없습니다.</div>';
  list.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{selected=b.dataset.id;renderList();renderDetail()});
  if(!selected&&arr[0]){selected=arr[0].id;renderList();renderDetail()}
  if(!arr.length)detail.innerHTML='<div class="empty-box">표시할 문의가 없습니다.</div>';
 }
 function statusButtons(x){
  if(store==='enterpriseRequests')return `<button class="btn small" data-status="new">신규</button><button class="btn small" data-status="consulting">상담 중</button><button class="btn small purple" data-status="done">완료</button>`;
  if(store==='feedback')return `<button class="btn small" data-status="new">신규</button><button class="btn small" data-status="reviewing">검토 중</button><button class="btn small purple" data-status="done">완료</button>`;
  return `<button class="btn small" data-status="new">신규</button><button class="btn small" data-status="in_progress">처리 중</button><button class="btn small purple" data-status="done">완료</button>`;
 }
 function renderDetail(){
  const x=AppStore.list(store).find(v=>v.id===selected);if(!x){detail.innerHTML='<div class="empty-box">문의 항목을 선택하세요.</div>';return}
  let extra='';
  if(store==='enterpriseRequests')extra=`<div class="inquiry-data-grid"><div><small>회사 / 기관</small><b>${esc(x.company||'-')}</b></div><div><small>담당자</small><b>${esc(x.name||'-')}</b></div><div><small>이메일</small><b>${esc(x.email||'-')}</b></div><div><small>팀 규모</small><b>${esc(x.teamSize||'-')}</b></div><div><small>도입 목적</small><b>${esc(x.need||'-')}</b></div></div>`;
  if(store==='feedback')extra=`<div class="inquiry-data-grid"><div><small>표현</small><b>${esc(x.term||'-')}</b></div><div><small>제보 유형</small><b>${esc(subtitleOf(x))}</b></div><div><small>Risk DB 등록 여부</small><b>${x.term&&RiskStore.all().some(v=>v.term===x.term)?'등록됨':'미등록'}</b></div></div>`;
  if(store==='inquiries')extra=`<div class="inquiry-data-grid"><div><small>이름</small><b>${esc(x.name||'-')}</b></div><div><small>이메일</small><b>${esc(x.email||'-')}</b></div><div><small>문의 유형</small><b>${esc(x.type||'-')}</b></div></div>`;
  detail.innerHTML=`<div class="eyebrow">${label[store]}</div><div class="inquiry-detail-head"><h2>${esc(titleOf(x))}</h2>${badge(x.status)}</div><div class="detail-meta"><span>${new Date(x.createdAt).toLocaleString()}</span>${x.demo?'<span>DEMO DATA</span>':''}</div>${extra}<div class="inquiry-message">${esc(x.message||'추가 내용이 없습니다.').replace(/\n/g,'<br>')}</div><div class="toolbar inquiry-actions">${statusButtons(x)}${store==='feedback'&&x.term?'<button class="btn small" id="sendToExpression">표현 관리로 보내기 →</button>':''}${store==='enterpriseRequests'?'<button class="btn small" id="convertCustomer">기업 고객 등록</button>':''}</div>`;
  detail.querySelectorAll('[data-status]').forEach(b=>b.onclick=()=>{AppStore.update(store,x.id,{status:b.dataset.status});showToast('문의 상태를 변경했습니다.');renderList();renderDetail()});
  const send=document.getElementById('sendToExpression');if(send)send.onclick=()=>{
    let target=RiskStore.all().find(v=>v.term===x.term);
    if(!target){target={id:'report_'+Date.now(),term:x.term,variants:[],category:'community_meme_slang',secondary:[],severity:2,status:'pending',description:x.message||'사용자 제보 표현',origin:'표현 신고',safeContexts:[],riskyContexts:[],alternatives:{KR:[],US:[],JP:[]}};RiskStore.add(target)}
    AppStore.update('feedback',x.id,{status:'reviewing'});showToast('표현 관리의 검토 대기로 보냈습니다.');setTimeout(()=>location.href='admin-expressions.html?q='+encodeURIComponent(x.term),450);
  };
  const convert=document.getElementById('convertCustomer');if(convert)convert.onclick=()=>{
    const exists=AppStore.list('enterprises').some(v=>v.name===x.company);if(!exists)AppStore.add('enterprises',{name:x.company,plan:'Team',status:'lead',seats:5,apiEnabled:x.need==='api',owner:x.name});AppStore.update('enterpriseRequests',x.id,{status:'done'});showToast('기업 고객 목록에 등록했습니다.');renderList();renderDetail();
  };
 }
 tabs.forEach(b=>b.onclick=()=>{tabs.forEach(x=>x.classList.remove('active'));b.classList.add('active');store=b.dataset.inquiryType;selected=null;statusFilter.value='';renderList()});
 statusFilter.onchange=()=>{selected=null;renderList()};
 counts();renderList();
})();
