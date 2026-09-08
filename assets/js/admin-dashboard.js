(function(){
 const db=RiskStore.all();
 const approved=db.filter(x=>x.status==='approved').length;
 const pending=db.filter(x=>x.status==='pending'||x.status==='ambiguous').length;
 let logs=[];try{logs=JSON.parse(localStorage.getItem('narock_scan_logs')||'[]')}catch(e){}
 const c=AppStore.counts(),open=(c.inquiriesOpen||0)+(c.enterpriseOpen||0)+(c.feedbackOpen||0);
 document.getElementById('mApproved').textContent=approved;
 document.getElementById('mPending').textContent=pending;
 document.getElementById('mOpenInquiries').textContent=open;
 document.getElementById('mScans').textContent=logs.length;
 document.getElementById('modulePending').textContent=pending+'개 검토 대기';
 document.getElementById('moduleInquiry').textContent=open+'개 미처리';
 document.getElementById('moduleScans').textContent=logs.length+'회 검사';
 document.getElementById('expressionSummary').innerHTML=`<div class="admin-summary-row"><span>승인 · Analyzer 사용</span><b>${approved}</b></div><div class="admin-summary-row"><span>검토 대기 / 애매함</span><b>${pending}</b></div><div class="admin-summary-row"><span>제외 표현</span><b>${db.filter(x=>x.status==='rejected').length}</b></div><div class="admin-summary-row"><span>대체 표현 등록</span><b>${db.filter(x=>Object.values(x.alternatives||{}).some(a=>a?.length)).length}</b></div>`;
 document.getElementById('recentScans').innerHTML=logs.slice(0,5).map(x=>`<div class="queue-card"><div style="display:flex;justify-content:space-between"><b>${x.overall?.label||'SAFE'}</b><span class="admin-badge">${x.platform||'general'} · ${x.region||'KR'}</span></div><div class="muted" style="font-size:11px;margin-top:5px">${x.preview||''}</div></div>`).join('')||'<div class="empty-box">Analyzer에서 실제 검사를 실행하면 이곳에 기록됩니다.</div>';
})();
