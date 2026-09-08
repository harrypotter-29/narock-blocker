(function(){
 const ents=AppStore.list('enterprises'),enabled=ents.filter(x=>x.apiEnabled);let logs=[];try{logs=JSON.parse(localStorage.getItem('narock_scan_logs')||'[]')}catch(e){}
 document.getElementById('apiOrgs').textContent=enabled.length;document.getElementById('webCalls').textContent=logs.length;document.getElementById('apiCalls').textContent='0';
 document.getElementById('apiOrgList').innerHTML=ents.map(x=>`<div class="queue-card"><div style="display:flex;justify-content:space-between"><b>${x.name}</b><span class="admin-badge ${x.apiEnabled?'done':''}">${x.apiEnabled?'API ENABLED':'WEB ONLY'}</span></div><p class="muted">${x.plan} · ${x.seats} seats</p></div>`).join('');
 document.getElementById('apiNotice').innerHTML='<b>현재 실제 API 서버는 연결되지 않았습니다.</b><br>GitHub Pages 정적 배포에서는 API Key 발급과 서버 사용량 집계가 불가능하므로, 이 화면은 기업별 API 권한 구조만 관리합니다.';
})();
