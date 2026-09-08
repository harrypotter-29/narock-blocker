(function(){
 let logs=[];try{logs=JSON.parse(localStorage.getItem('narock_scan_logs')||'[]')}catch(e){}
 let corrections=[];try{corrections=JSON.parse(localStorage.getItem('narock_correction_events')||'[]')}catch(e){}
 const db=RiskStore.all();
 const total=logs.length,high=logs.filter(x=>(x.overall?.level||0)>=4).length,avg=total?(logs.reduce((a,b)=>a+(b.findings||0),0)/total).toFixed(1):'0.0';
 document.getElementById('aTotal').textContent=total;
 document.getElementById('aHigh').textContent=total?Math.round(high/total*100)+'%':'0%';
 document.getElementById('aAvg').textContent=avg;
 document.getElementById('aCorrections').textContent=corrections.length;
 document.getElementById('analyticsCountLabel').textContent=total+' records';
 const labels={KR:'Korea',US:'United States',JP:'Japan',general:'General',personal_social:'개인 SNS',school:'학교',corporate:'기업',media:'언론·방송',public_institution:'공공기관',advertisement:'광고'};
 function dist(arr,key){const m={};arr.forEach(x=>{const k=key(x)||'unknown';m[k]=(m[k]||0)+1});return m}
 function bars(el,obj,mapper=v=>v){
  const entries=Object.entries(obj).sort((a,b)=>b[1]-a[1]).slice(0,8),max=Math.max(1,...entries.map(x=>x[1]));
  el.innerHTML=entries.map(([k,v])=>`<div class="stat-row"><span>${mapper(k)}</span><div class="stat-track"><span style="width:${v/max*100}%"></span></div><b>${v}</b></div>`).join('')||'<div class="empty-box">데이터가 아직 없습니다.</div>';
 }
 bars(document.getElementById('platformBars'),dist(logs,x=>x.platform),k=>labels[k]||k);
 bars(document.getElementById('regionBars'),dist(logs,x=>x.region),k=>labels[k]||k);
 bars(document.getElementById('riskBars'),dist(logs,x=>x.overall?.label));
 bars(document.getElementById('usageBars'),dist(logs,x=>x.usage),k=>labels[k]||k);
 const terms={};logs.forEach(x=>(x.detectedTerms||[]).forEach(t=>terms[t]=(terms[t]||0)+1));
 bars(document.getElementById('termBars'),terms);
 bars(document.getElementById('dbBars'),dist(db.filter(x=>x.status==='approved'),x=>NarockEngine.CAT_NAME[x.category]||x.category));
 document.getElementById('analyticsRecent').innerHTML=logs.slice(0,12).map(x=>`<div class="analytics-row"><span>${new Date(x.at).toLocaleString()}</span><span>${x.platform||'general'} · ${x.region||'KR'}</span><span>${labels[x.usage]||x.usage||'general'}</span><span><span class="badge r${x.overall?.level||1}">${x.overall?.label||'SAFE'}</span></span><span>${x.findings||0}</span><span>${x.preview||''}</span></div>`).join('')||'<div class="empty-box">Analyzer에서 실제 검사를 실행하면 이곳에 기록됩니다.</div>';
 document.getElementById('clearAnalytics').onclick=()=>{if(!confirm('현재 브라우저에 저장된 검사 기록과 추천 적용 기록을 초기화할까요?'))return;localStorage.removeItem('narock_scan_logs');localStorage.removeItem('narock_correction_events');showToast('통계 기록을 초기화했습니다.');setTimeout(()=>location.reload(),500)};
})();
