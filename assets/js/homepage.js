
(function(){
 // Hero tilt
 const stage=document.querySelector('.stage'),card=document.querySelector('.product-window');
 if(stage&&card&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1100px) rotateY(${x*6-3}deg) rotateX(${-y*5+2}deg)`});
   stage.addEventListener('pointerleave',()=>card.style.transform='');
 }
 // story step scroll
 const steps=[...document.querySelectorAll('.story-step')];
 const section=document.querySelector('.context-story');
 function updateStory(){
  if(!section||!steps.length)return;
  const r=section.getBoundingClientRect(),p=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height*.42))),idx=Math.min(steps.length-1,Math.floor(p*steps.length));
  steps.forEach((s,i)=>s.classList.toggle('active',i===idx));
 }
 addEventListener('scroll',updateStory,{passive:true});updateStory();

 // clickable word cloud
 const data={
  Context:['Context','같은 단어도 앞뒤 문장과 전체 흐름에 따라 의미가 달라질 수 있습니다.'],
  Community:['Community','특정 온라인 커뮤니티의 말투와 내부 문화를 별도 맥락으로 확인합니다.'],
  Meme:['Meme','밈과 유행어가 다른 집단에서 어떻게 오해될 수 있는지 확인합니다.'],
  Privacy:['Privacy','전화번호·이메일·식별 정보의 공개 가능성을 확인합니다.'],
  Fact:['Fact','단정적 주장이나 사실 확인이 필요한 표현을 구분합니다.'],
  Reputation:['Reputation','개인·기업의 명예와 평판에 영향을 줄 수 있는 표현을 검토합니다.'],
  Intent:['Intent','사용 의도가 설명인지 공격인지에 따라 위험도를 달리 봅니다.'],
  Audience:['Audience','누가 보는 콘텐츠인지에 따라 공적 적합성을 다르게 평가합니다.'],
  Hate:['Hate','집단 비하·차별로 해석될 가능성이 있는 표현을 검토합니다.'],
  Slang:['Slang','은어·변형어·초성 표현을 위험 DB와 함께 탐지합니다.']
 };
 const detail=document.querySelector('.cloud-detail');
 document.querySelectorAll('.cloud-word').forEach(b=>b.addEventListener('click',()=>{
   document.querySelectorAll('.cloud-word').forEach(x=>x.classList.remove('active'));b.classList.add('active');
   const [title,desc]=data[b.dataset.word]||[b.dataset.word,'관련 위험 문맥을 확인합니다.'];
   detail.innerHTML=`<div class="eyebrow">RISK CATEGORY</div><h4>${title}</h4><p>${desc}</p><a class="btn small" href="risk-system.html">자세히 보기 →</a>`;
   detail.classList.add('show');
 }));
 // locale demo
 const localeData={KR:['Instagram · Korea','해당 이용자','공개 게시물에서는 특정 집단을 직접 비하하는 표현보다 중립적 지칭을 우선합니다.'],US:['YouTube · United States','the user','직접 번역보다 공개 환경에서 자연스럽고 중립적인 표현을 우선합니다.'],JP:['X · Japan','該当する利用者','직역보다 플랫폼과 문화권에서 무난한 표현을 우선 추천합니다.']};
 document.querySelectorAll('[data-locale]').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('[data-locale]').forEach(x=>x.classList.remove('active'));b.classList.add('active');
  const d=localeData[b.dataset.locale];document.getElementById('localeContext').textContent=d[0];document.getElementById('localeWord').textContent=d[1];document.getElementById('localeDesc').textContent=d[2];
 }));
})();
