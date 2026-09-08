
(function(){
 const data={
  Context:['문맥','같은 표현도 앞뒤 문장, 대상, 사용 목적에 따라 위험도가 달라집니다.'],
  Slang:['은어','변형어·초성·온라인 은어를 DB 후보와 연결해 확인합니다.'],
  Meme:['밈','밈은 특정 집단에서만 공유되는 의미 때문에 오해 가능성이 생길 수 있습니다.'],
  Privacy:['개인정보','이메일·전화번호·식별 가능 정보를 별도 위험으로 확인합니다.'],
  Reputation:['명예·평판','개인·기업·단체를 범죄자나 문제 대상으로 단정하는 표현을 검토합니다.'],
  Hate:['혐오·차별','특정 집단을 비하하는 표현과 갈등 맥락을 확인합니다.'],
  Intent:['의도','설명·연구·인용인지 실제 공격·비하 사용인지 구분하려고 합니다.'],
  Audience:['대상','개인 SNS와 공공기관 콘텐츠는 같은 표현도 다른 기준이 필요합니다.'],
  Fact:['사실성','확인되지 않은 단정과 오인 가능성을 별도 영역으로 표시합니다.'],
  Public:['공적 커뮤니케이션','브랜드·학교·방송·공공기관에서의 표현 적합성을 확인합니다.']
 };
 const panel=document.getElementById('riskDetail');
 document.querySelectorAll('[data-riskword]').forEach(b=>b.addEventListener('click',()=>{
   document.querySelectorAll('[data-riskword]').forEach(x=>x.classList.remove('active'));b.classList.add('active');
   const d=data[b.dataset.riskword]||[b.dataset.riskword,'관련 문맥을 확인합니다.'];panel.innerHTML=`<div class="eyebrow">SELECTED SIGNAL</div><h3>${d[0]}</h3><p>${d[1]}</p>`;panel.classList.add('show');
 }));
})();
