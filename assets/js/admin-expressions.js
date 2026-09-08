(function(){
 const rows=document.getElementById('expressionRows');if(!rows)return;
 const search=document.getElementById('expressionSearch');
 const categoryFilter=document.getElementById('expressionCategory');
 const tabs=[...document.querySelectorAll('[data-expression-status]')];
 const modal=document.getElementById('expressionModal');
 const form=document.getElementById('expressionForm');
 const deleteBtn=document.getElementById('deleteExpressionBtn');
 const pendingBtn=document.getElementById('savePendingBtn');
 let activeStatus='',editingId=null;

 const split=v=>String(v||'').split(',').map(x=>x.trim()).filter(Boolean);
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const catOptions=NarockEngine.CATS.map(([id,name])=>`<option value="${id}">${name}</option>`).join('');
 categoryFilter.insertAdjacentHTML('beforeend',catOptions);
 document.getElementById('expressionCategoryField').innerHTML=catOptions;

 function statusLabel(s){return s==='approved'?'사용 중':s==='pending'?'검토 대기':s==='ambiguous'?'애매함':'제외'}
 function statusClass(s){return s==='approved'?'done':s==='pending'?'new':s==='ambiguous'?'progress':''}
 function updateMetrics(){
  const d=RiskStore.all(), approved=d.filter(x=>x.status==='approved').length,pending=d.filter(x=>x.status==='pending'||x.status==='ambiguous').length;
  const covered=d.filter(x=>Object.values(x.alternatives||{}).some(a=>Array.isArray(a)&&a.length)).length;
  document.getElementById('eTotal').textContent=d.length;
  document.getElementById('eApproved').textContent=approved;
  document.getElementById('ePending').textContent=pending;
  document.getElementById('eCoverage').textContent=d.length?Math.round(covered/d.length*100)+'%':'0%';
 }
 function filtered(){
  const q=search.value.trim().toLowerCase(),cat=categoryFilter.value;
  return RiskStore.all().filter(x=>{
   const blob=[x.term,(x.variants||[]).join(' '),x.description||'',x.origin||''].join(' ').toLowerCase();
   return (!q||blob.includes(q))&&(!activeStatus||x.status===activeStatus)&&(!cat||x.category===cat);
  });
 }
 function render(){
  updateMetrics();
  const d=filtered();
  rows.innerHTML=d.map(x=>{
   const alts=(x.alternatives?.KR||[]).slice(0,2);
   return `<div class="expression-row">
    <span><b>${esc(x.term)}</b><small>${esc((x.variants||[]).join(' · ')||'별칭 없음')}</small></span>
    <span>${esc(NarockEngine.CAT_NAME[x.category]||x.category)}</span>
    <span><span class="risk-mini r${x.severity}">${x.severity}/5</span></span>
    <span class="expression-alt-cell">${alts.length?alts.map(a=>`<em>${esc(a)}</em>`).join(''):'<small>미등록</small>'}</span>
    <span><span class="admin-badge ${statusClass(x.status)}">${statusLabel(x.status)}</span></span>
    <span class="expression-actions"><button class="btn small" data-edit="${x.id}">수정</button>${x.status!=='approved'?`<button class="btn small purple" data-approve="${x.id}">승인</button>`:''}</span>
   </div>`;
  }).join('')||'<div class="empty-box">조건에 맞는 표현이 없습니다.</div>';
  rows.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>openEdit(b.dataset.edit));
  rows.querySelectorAll('[data-approve]').forEach(b=>b.onclick=()=>{RiskStore.update(b.dataset.approve,{status:'approved'});showToast('승인했습니다. 다음 Analyzer 검사부터 반영됩니다.');render()});
 }
 function fields(){return form.elements}
 function openNew(){
  editingId=null;form.reset();fields().severity.value='3';fields().status.value='pending';
  document.getElementById('expressionModalTitle').textContent='새 표현 추가';deleteBtn.style.display='none';modal.classList.add('open');
 }
 function openEdit(id){
  const x=RiskStore.all().find(v=>v.id===id);if(!x)return;editingId=id;
  const f=fields();f.term.value=x.term||'';f.variants.value=(x.variants||[]).join(', ');f.category.value=x.category||'community_meme_slang';f.severity.value=x.severity||3;f.status.value=x.status||'pending';f.origin.value=x.origin||'';f.description.value=x.description||'';f.safeContexts.value=(x.safeContexts||[]).join(', ');f.riskyContexts.value=(x.riskyContexts||[]).join(', ');f.altKR.value=(x.alternatives?.KR||[]).join(', ');f.altUS.value=(x.alternatives?.US||[]).join(', ');f.altJP.value=(x.alternatives?.JP||[]).join(', ');
  document.getElementById('expressionModalTitle').textContent='표현 수정';deleteBtn.style.display='inline-flex';modal.classList.add('open');
 }
 function payload(forceStatus){
  const f=fields();return {term:f.term.value.trim(),variants:split(f.variants.value),category:f.category.value,secondary:[],severity:+f.severity.value,status:forceStatus||f.status.value,description:f.description.value.trim(),origin:f.origin.value.trim()||(editingId?'관리자 수정':'관리자 등록'),safeContexts:split(f.safeContexts.value),riskyContexts:split(f.riskyContexts.value),alternatives:{KR:split(f.altKR.value),US:split(f.altUS.value),JP:split(f.altJP.value)}};
 }
 function save(forceStatus){
  const p=payload(forceStatus);if(!p.term)return alert('대표 표현을 입력해주세요.');
  const dup=RiskStore.all().find(x=>x.id!==editingId&&x.term.trim().toLowerCase()===p.term.toLowerCase());if(dup)return alert('이미 등록된 표현입니다.');
  if(editingId)RiskStore.update(editingId,p);else RiskStore.add({...p,id:'admin_'+Date.now(),createdAt:new Date().toISOString()});
  modal.classList.remove('open');showToast(p.status==='approved'?'저장했습니다. Analyzer에 즉시 반영됩니다.':'검토 대기로 저장했습니다.');render();
 }
 form.onsubmit=e=>{e.preventDefault();save()};
 pendingBtn.onclick=()=>save('pending');
 deleteBtn.onclick=()=>{if(!editingId||!confirm('이 표현을 삭제할까요?'))return;RiskStore.remove(editingId);modal.classList.remove('open');showToast('표현을 삭제했습니다.');render()};
 document.getElementById('addExpressionBtn').onclick=openNew;
 document.getElementById('closeExpressionModal').onclick=()=>modal.classList.remove('open');
 modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});
 tabs.forEach(b=>b.onclick=()=>{tabs.forEach(x=>x.classList.remove('active'));b.classList.add('active');activeStatus=b.dataset.expressionStatus;render()});
 search.oninput=render;categoryFilter.onchange=render;
 const q=new URLSearchParams(location.search).get('q');if(q)search.value=q;
 render();
})();
