
(function(){
 const KEY='narock_static_risk_terms_v1';
 const clone=v=>JSON.parse(JSON.stringify(v));
 function seed(){const d=clone(window.NAROCK_SEED||[]);localStorage.setItem(KEY,JSON.stringify(d));return d}
 function all(){try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(Array.isArray(d))return d}catch(e){}return seed()}
 function save(d){localStorage.setItem(KEY,JSON.stringify(d));window.dispatchEvent(new Event('narock-db-change'));return d}
 function add(v){const d=all();d.push(v);return save(d)}
 function update(id,p){const d=all();const i=d.findIndex(x=>x.id===id);if(i>=0)d[i]={...d[i],...p,updatedAt:new Date().toISOString()};save(d);return d[i]}
 function remove(id){return save(all().filter(x=>x.id!==id))}
 function reset(){return seed()}
 window.RiskStore={all,save,add,update,remove,reset};
})();
