(function(){
 let s=AppStore.list('settings');
 const c=document.getElementById('contextRange'),p=document.getElementById('publicRange'),l=document.getElementById('localeSwitch'),pr=document.getElementById('privacySwitch');
 c.value=s.contextSensitivity;p.value=s.publicStrictness;document.getElementById('contextVal').textContent=s.contextSensitivity;document.getElementById('publicVal').textContent=s.publicStrictness;l.classList.toggle('on',!!s.localization);pr.classList.toggle('on',!!s.privacyDetection);
 c.oninput=()=>document.getElementById('contextVal').textContent=c.value;p.oninput=()=>document.getElementById('publicVal').textContent=p.value;l.onclick=()=>l.classList.toggle('on');pr.onclick=()=>pr.classList.toggle('on');
 document.getElementById('saveSettings').onclick=()=>{const next={contextSensitivity:+c.value,publicStrictness:+p.value,localization:l.classList.contains('on'),privacyDetection:pr.classList.contains('on'),engine:'rule-db'};localStorage.setItem('narock_settings_v1',JSON.stringify(next));showToast('설정을 저장했습니다.')};
})();
