(function(){
  const K={
    inquiries:'narock_inquiries_v1',
    enterpriseRequests:'narock_enterprise_requests_v1',
    feedback:'narock_feedback_v1',
    enterprises:'narock_enterprises_v1',
    settings:'narock_settings_v1'
  };
  const clone=v=>JSON.parse(JSON.stringify(v));
  const seeds={
    inquiries:[
      {id:'inq_demo_1',subject:'분석 결과 저장 방식 문의',name:'Demo User',email:'demo.user@example.com',type:'support',status:'new',message:'검사 기록이 브라우저를 닫아도 유지되는지 궁금합니다.',createdAt:'2026-09-06T10:20:00+09:00',demo:true},
      {id:'inq_demo_2',subject:'위험 표현 제보 방법 문의',name:'Demo Creator',email:'creator@example.com',type:'product',status:'in_progress',message:'검사에서 놓친 표현을 제보하고 싶습니다. 관리자 검토 흐름이 있나요?',createdAt:'2026-09-05T16:45:00+09:00',demo:true}
    ],
    enterpriseRequests:[
      {id:'entreq_demo_1',company:'Demo Media Lab',name:'김담당',email:'media@example.com',teamSize:'20-49',need:'broadcast',message:'방송 자막과 숏폼 업로드 전 검수에 활용하고 싶습니다.',status:'new',createdAt:'2026-09-06T09:10:00+09:00',demo:true},
      {id:'entreq_demo_2',company:'Demo Brand Studio',name:'이마케팅',email:'brand@example.com',teamSize:'10-19',need:'api',message:'사내 CMS에서 게시 버튼 전에 API로 검사하고 싶습니다.',status:'consulting',createdAt:'2026-09-04T14:30:00+09:00',demo:true}
    ],
    feedback:[
      {id:'fb_demo_1',kind:'missed_term',term:'알잘딱깔센',message:'커뮤니티 맥락을 함께 설명해주면 좋겠습니다.',status:'new',createdAt:'2026-09-06T13:00:00+09:00',demo:true},
      {id:'fb_demo_2',kind:'judgement',term:'레전드',message:'일상적인 칭찬 문맥에서는 너무 민감하게 잡히지 않았으면 좋겠습니다.',status:'reviewing',createdAt:'2026-09-05T11:40:00+09:00',demo:true}
    ],
    enterprises:[
      {id:'org_demo_1',name:'Demo Media Lab',plan:'Enterprise',status:'trial',seats:20,apiEnabled:true,owner:'김담당',createdAt:'2026-09-01T09:00:00+09:00',demo:true},
      {id:'org_demo_2',name:'Demo Brand Studio',plan:'Team',status:'lead',seats:8,apiEnabled:false,owner:'이마케팅',createdAt:'2026-09-03T09:00:00+09:00',demo:true}
    ],
    settings:{contextSensitivity:70,publicStrictness:80,localization:true,privacyDetection:true,engine:'rule-db'}
  };
  function read(key){try{const v=JSON.parse(localStorage.getItem(key)||'null');if(v!==null)return v}catch(e){}return null}
  function ensure(name){const key=K[name];let v=read(key);if(v===null){v=clone(seeds[name]);localStorage.setItem(key,JSON.stringify(v))}return v}
  function write(name,v){localStorage.setItem(K[name],JSON.stringify(v));window.dispatchEvent(new CustomEvent('narock-app-change',{detail:{name}}));return v}
  function list(name){return ensure(name)}
  function add(name,item){const d=list(name);d.unshift({...item,id:item.id||name+'_'+Date.now(),createdAt:item.createdAt||new Date().toISOString()});return write(name,d)}
  function update(name,id,patch){const d=list(name);const i=d.findIndex(x=>x.id===id);if(i>=0)d[i]={...d[i],...patch,updatedAt:new Date().toISOString()};write(name,d);return d[i]}
  function remove(name,id){return write(name,list(name).filter(x=>x.id!==id))}
  function reset(name){return write(name,clone(seeds[name]))}
  function counts(){
    const inquiries=list('inquiries'), req=list('enterpriseRequests'), fb=list('feedback'), ents=list('enterprises');
    return {
      inquiriesOpen:inquiries.filter(x=>x.status!=='done').length,
      enterpriseOpen:req.filter(x=>x.status!=='done').length,
      feedbackOpen:fb.filter(x=>x.status!=='done').length,
      enterprises:ents.length,
      apiEnabled:ents.filter(x=>x.apiEnabled).length
    };
  }
  window.AppStore={list,add,update,remove,reset,counts,seeds:clone(seeds)};
})();
