(function(){
 document.getElementById('dbCountText').textContent=`현재 ${RiskStore.all().length}개의 Risk Term 레코드가 브라우저에 저장되어 있습니다.`;
 document.getElementById('exportRisk').onclick=()=>{const blob=new Blob([JSON.stringify(RiskStore.all(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='narock-risk-db.json';a.click();URL.revokeObjectURL(a.href)};
 document.getElementById('importRisk').onchange=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!Array.isArray(d))throw new Error();RiskStore.save(d);showToast('Risk DB를 가져왔습니다.');setTimeout(()=>location.reload(),500)}catch(err){alert('올바른 JSON 배열 파일이 아닙니다.')}};r.readAsText(f)};
 document.getElementById('resetRisk').onclick=()=>{if(confirm('기본 Risk DB로 초기화할까요?')){RiskStore.reset();showToast('초기화했습니다.');setTimeout(()=>location.reload(),500)}};
 document.querySelectorAll('[data-reset]').forEach(b=>b.onclick=()=>{if(confirm(`${b.dataset.reset} 데이터를 Demo Seed로 초기화할까요?`)){AppStore.reset(b.dataset.reset);showToast('초기화했습니다.')}});
})();
