
(function(){
 const CATS=[
 ['insult_abuse','욕설·모욕'],['hate_discrimination','혐오·차별'],['sexual_sensitive','성적·선정성'],
 ['violence_threat','폭력·위협'],['political_ideological','정치·이념 민감성'],['community_meme_slang','커뮤니티·밈·은어'],
 ['reputation_defamation','명예·평판'],['privacy_personal_information','개인정보·신상'],
 ['misinformation_misleading','사실성·오인 가능성'],['public_communication','공적 커뮤니케이션 적합성']];
 const N=Object.fromEntries(CATS), LV={1:'SAFE',2:'LOW',3:'CAUTION',4:'HIGH',5:'CRITICAL'};
 const PUBLIC=['school','corporate','advertisement','media','public_institution'];
 const norm=s=>(s||'').toLowerCase().normalize('NFKC').replace(/[\s._\-·•~`'"“”‘’()[\]{}<>]/g,'');
 function compactMap(t){let n='',m=[];for(let i=0;i<t.length;i++){const c=t[i].toLowerCase().normalize('NFKC');if(/[\s._\-·•~`'"“”‘’()[\]{}<>]/.test(c))continue;n+=c;m.push(i)}return{n,m}}
 function allidx(h,n){let o=[],p=0,i;if(!n)return o;while((i=h.indexOf(n,p))!==-1){o.push(i);p=i+Math.max(1,n.length)}return o}
 function adjust(term,ctx,use){let s=+term.severity||1,l=ctx.toLowerCase();if((term.safeContexts||[]).some(k=>l.includes(k.toLowerCase())))s--;if((term.riskyContexts||[]).some(k=>l.includes(k.toLowerCase())))s++;if((term.secondary||[]).includes('public_communication')&&PUBLIC.includes(use))s++;return Math.max(1,Math.min(5,s))}
 function privacy(text){const out=[],defs=[[/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,'이메일 주소','[이메일 비공개]'],[/(?:01[016789])[-.\s]?\d{3,4}[-.\s]?\d{4}/g,'전화번호','[전화번호 비공개]']];for(const [re,label,alt] of defs){let m;while((m=re.exec(text)))out.push({id:'p'+m.index,matchedText:m[0],start:m.index,end:m.index+m[0].length,category:'privacy_personal_information',secondary:[],severity:4,description:label+'가 공개되어 개인정보 노출 가능성이 있습니다.',alternatives:[alt]})}return out}
 function analyze({text,platform='general',region='KR',usage='general'}){
   const terms=RiskStore.all().filter(x=>x.status==='approved'),{n,m}=compactMap(text),fs=[],seen=new Set();
   for(const term of terms)for(const alias of [term.term,...(term.variants||[])].filter(Boolean)){
     const needle=norm(alias);
     for(const idx of allidx(n,needle)){const st=m[idx],en=(m[idx+needle.length-1]??st)+1,key=st+':'+en+':'+term.id;if(seen.has(key))continue;seen.add(key);const ctx=text.slice(Math.max(0,st-55),Math.min(text.length,en+55));
       const alts=(term.alternatives?.[region]||term.alternatives?.KR||[]);
       fs.push({id:'f'+term.id+st,termId:term.id,matchedText:text.slice(st,en),start:st,end:en,category:term.category,secondary:term.secondary||[],severity:adjust(term,ctx,usage),description:term.description,origin:term.origin,alternatives:alts});
     }
   }
   fs.push(...privacy(text));fs.sort((a,b)=>a.start-b.start||b.severity-a.severity);
   const uniq=[],pos=new Set();for(const f of fs){const k=f.start+':'+f.end;if(pos.has(k))continue;pos.add(k);uniq.push(f)}
   const cats=CATS.map(([id,name])=>({id,name,level:1,count:0})),by=Object.fromEntries(cats.map(c=>[c.id,c]));
   for(const f of uniq)for(const c of [f.category,...(f.secondary||[])])if(by[c]){by[c].level=Math.max(by[c].level,f.severity);by[c].count++}
   const levels=cats.map(c=>c.level),mx=Math.max(...levels),hi=levels.filter(x=>x===4).length;let ol=1;if(mx===5)ol=5;else if(hi)ol=4;else if(mx===3)ol=3;else if(mx===2)ol=2;
   let corrected=text;[...uniq].sort((a,b)=>b.start-a.start).forEach(f=>{if(f.alternatives?.[0])corrected=corrected.slice(0,f.start)+f.alternatives[0]+corrected.slice(f.end)});
   return {id:'scan_'+Date.now(),text,platform,region,usage,findings:uniq,categories:cats,overall:{level:ol,label:LV[ol]},corrected,meta:{engine:'DB + JavaScript',at:new Date().toISOString()}};
 }
 window.NarockEngine={analyze,CATS,CAT_NAME:N,LEVEL:LV};
})();
