(function(){
 const input=document.getElementById('contentInput');if(!input)return;
 const char=document.getElementById('charCount'),run=document.getElementById('analyzeBtn'),empty=document.getElementById('emptyResult'),stepsBox=document.getElementById('analysisSteps'),res=document.getElementById('result'),beam=document.getElementById('activeBeam'),editState=document.getElementById('editState');
 const platformEl=document.getElementById('platform'),regionEl=document.getElementById('region'),usageEl=document.getElementById('usage');
 let last=null,rewriteMode='minimal',sourceBeforeEdits='';
 const regionName={KR:'Korea',US:'United States',JP:'Japan'};
 const usageName={general:'General',personal_social:'개인 SNS',school:'학교',corporate:'기업',media:'언론·방송',public_institution:'공공기관'};
 const publicUsage=new Set(['school','corporate','media','public_institution']);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const delay=ms=>new Promise(r=>setTimeout(r,ms));

 function syncCount(){char.textContent=input.value.length+' / 2,000'}
 input.addEventListener('input',syncCount);
 document.querySelectorAll('[data-sample]').forEach(b=>b.addEventListener('click',()=>{input.value=b.dataset.sample;syncCount();input.focus();editState.style.display='none'}));
 const mode=new URLSearchParams(location.search).get('mode')||'text';
 document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
 if(mode!=='text'){document.getElementById('textWorkspace').style.display='none';document.getElementById('mediaWorkspace').style.display='grid';document.getElementById('mediaTitle').textContent=mode==='image'?'Image Analyzer · BETA':'Video Analyzer · COMING SOON'}

 function pickAlternative(f,modeName){
  const a=[...(f.alternatives||[])].filter(Boolean);if(!a.length)return f.matchedText;
  let index=0;
  if(modeName==='natural')index=Math.min(1,a.length-1);
  if(modeName==='formal')index=a.length-1;
  if(publicUsage.has(usageEl.value)&&modeName==='minimal'&&a.length>1)index=1;
  if(['instagram','tiktok','x'].includes(platformEl.value)&&modeName==='natural')index=0;
  return a[index]||a[0];
 }
 function buildRewrite(r,modeName){
  let out=r.text;
  [...r.findings].sort((a,b)=>b.start-a.start).forEach(f=>{const alt=pickAlternative(f,modeName);if(alt&&alt!==f.matchedText)out=out.slice(0,f.start)+alt+out.slice(f.end)});
  return out;
 }
 function contextLabel(){return `${platformEl.options[platformEl.selectedIndex].text} · ${regionName[regionEl.value]||regionEl.value} · ${usageName[usageEl.value]||usageEl.value}`}
 function logCorrection(kind,detail={}){
  let a=[];try{a=JSON.parse(localStorage.getItem('narock_correction_events')||'[]')}catch(e){}
  a.unshift({id:'cor_'+Date.now(),at:new Date().toISOString(),kind,platform:platformEl.value,region:regionEl.value,usage:usageEl.value,...detail});
  localStorage.setItem('narock_correction_events',JSON.stringify(a.slice(0,200)));
 }
 function markEdited(msg){editState.style.display='flex';editState.querySelector('b').textContent=msg||'수정안이 입력창에 적용되었습니다.';syncCount()}

 async function analyze(){
  const text=input.value.trim();if(!text)return input.focus();
  sourceBeforeEdits=text;editState.style.display='none';
  empty.style.display='none';res.style.display='none';stepsBox.classList.add('show');beam.style.display='block';run.disabled=true;run.textContent='Analyzing ···';
  const ss=[...document.querySelectorAll('.runtime-step')];ss.forEach(s=>{s.className='runtime-step';s.lastElementChild.textContent='WAIT'});
  for(let i=0;i<ss.length;i++){ss.forEach((s,j)=>s.classList.toggle('active',j===i));await delay(560);ss[i].classList.remove('active');ss[i].classList.add('done');ss[i].lastElementChild.textContent='DONE'}
  const r=NarockEngine.analyze({text,platform:platformEl.value,region:regionEl.value,usage:usageEl.value});last=r;
  if(publicUsage.has(usageEl.value))rewriteMode='formal';else rewriteMode='minimal';
  render(r);saveLog(r);
  await delay(220);beam.style.display='none';stepsBox.classList.remove('show');res.style.display='block';run.disabled=false;run.textContent='검사 다시 실행 →';
 }
 run.addEventListener('click',analyze);
 input.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();analyze()}});

 function render(r){
  const l=r.overall.level,b=document.getElementById('overallBadge');b.textContent=r.overall.label;b.className='badge r'+l;
  document.getElementById('resultTitle').textContent=l>=4?'공개 전 수정이 권장됩니다.':l===3?'검토가 필요한 표현이 있습니다.':l===2?'일부 표현을 확인해보세요.':'현재 DB 기준 큰 위험을 찾지 못했습니다.';
  document.getElementById('resultMeta').textContent=`${r.findings.length} findings · ${contextLabel()} · DB + JavaScript`;
  document.getElementById('categories').innerHTML=r.categories.map(c=>`<div class="cat-row"><span>${c.name}</span><span class="blocks">${[1,2,3,4,5].map(i=>`<i class="${i<=c.level?'on':''}"></i>`).join('')}</span><b>${NarockEngine.LEVEL[c.level]}</b></div>`).join('');
  let h='',p=0;for(const f of r.findings){if(f.start<p)continue;h+=esc(r.text.slice(p,f.start))+`<mark>${esc(r.text.slice(f.start,f.end))}</mark>`;p=f.end}h+=esc(r.text.slice(p));document.getElementById('highlighted').innerHTML=h||esc(r.text);
  document.getElementById('findings').innerHTML=r.findings.length?r.findings.map(f=>{
   const alts=(f.alternatives||[]).filter(Boolean);
   return `<div class="finding"><div class="finding-top"><div><b>${esc(f.matchedText)}</b><div class="muted" style="font-size:11px">${esc(NarockEngine.CAT_NAME[f.category]||f.category)} · ${contextLabel()} 추천</div></div><span class="badge r${f.severity}">${NarockEngine.LEVEL[f.severity]}</span></div><p style="font-size:12px;line-height:1.65">${esc(f.description)}</p>${alts.length?`<div class="reco-label">추천 대체 표현</div><div class="reco-list">${alts.map((a,i)=>`<button class="reco" data-finding="${f.id}" data-alt-index="${i}">${esc(a)} <small>적용</small></button>`).join('')}</div>`:'<div class="reco-label muted">등록된 대체 표현이 없습니다. 관리자 표현 관리에서 추가할 수 있습니다.</div>'}</div>`;
  }).join(''):'<div class="finding">등록된 위험 표현을 찾지 못했습니다.</div>';
  bindIndividualRecommendations();renderRewrite();
 }
 function bindIndividualRecommendations(){
  document.querySelectorAll('[data-finding]').forEach(btn=>btn.addEventListener('click',()=>{
   if(!last)return;const f=last.findings.find(x=>x.id===btn.dataset.finding);if(!f)return;const alt=(f.alternatives||[])[+btn.dataset.altIndex];if(!alt)return;
   const before=input.value;input.value=before.replace(f.matchedText,alt);logCorrection('individual',{from:f.matchedText,to:alt,termId:f.termId||null});markEdited(`“${f.matchedText}” → “${alt}” 적용됨`);btn.classList.add('applied');
  }));
 }
 function renderRewrite(){
  if(!last)return;const after=buildRewrite(last,rewriteMode);
  document.querySelectorAll('[data-rewrite-mode]').forEach(b=>b.classList.toggle('active',b.dataset.rewriteMode===rewriteMode));
  document.getElementById('recommendationContext').textContent=`${contextLabel()} 기준 · ${rewriteMode==='minimal'?'원문을 최대한 유지':rewriteMode==='natural'?'자연스러운 대체어 우선':'공적 환경에 더 중립적인 표현 우선'}`;
  document.getElementById('rewriteBefore').textContent=last.text;
  document.getElementById('rewriteAfter').textContent=after;
  document.getElementById('rewriteNote').textContent=last.findings.length?`${last.findings.filter(f=>pickAlternative(f,rewriteMode)!==f.matchedText).length}개 표현의 수정안을 생성했습니다. 현재 추천은 AI 생성이 아니라 관리자 Risk DB + 지역/플랫폼 규칙 기반입니다.`:'수정이 필요한 표현을 찾지 못했습니다.';
  document.getElementById('applyAllRecommendations').disabled=!last.findings.length||after===last.text;
 }
 document.querySelectorAll('[data-rewrite-mode]').forEach(b=>b.addEventListener('click',()=>{rewriteMode=b.dataset.rewriteMode;renderRewrite()}));
 document.getElementById('applyAllRecommendations').addEventListener('click',()=>{if(!last)return;const after=buildRewrite(last,rewriteMode);input.value=after;logCorrection('apply_all',{mode:rewriteMode,count:last.findings.length});markEdited('전체 추천 표현을 입력창에 적용했습니다.');});
 document.getElementById('recheckRecommendation').addEventListener('click',()=>{if(!input.value.trim())return;analyze()});
 document.getElementById('restoreOriginal').addEventListener('click',()=>{if(!last&&!sourceBeforeEdits)return;input.value=last?.text||sourceBeforeEdits;markEdited('검사 당시 원문으로 복원했습니다.');});
 [platformEl,regionEl,usageEl].forEach(el=>el.addEventListener('change',()=>{if(last){last=NarockEngine.analyze({text:last.text,platform:platformEl.value,region:regionEl.value,usage:usageEl.value});if(publicUsage.has(usageEl.value))rewriteMode='formal';render(last)}}));
 function saveLog(r){
  let a=[];try{a=JSON.parse(localStorage.getItem('narock_scan_logs')||'[]')}catch(e){}
  a.unshift({id:r.id,at:r.meta.at,platform:r.platform,region:r.region,usage:r.usage,overall:r.overall,findings:r.findings.length,detectedTerms:r.findings.map(f=>f.matchedText),detectedCategories:[...new Set(r.findings.map(f=>f.category))],preview:r.text.slice(0,100)});
  localStorage.setItem('narock_scan_logs',JSON.stringify(a.slice(0,150)));
 }
})();
