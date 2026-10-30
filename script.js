(() => {
 const $=s=>document.querySelector(s), art=$('#visualInvitation'), interactive=$('#interactiveInvitation');
 const music=$('#backgroundMusic'), musicBtn=$('#musicBtn'), musicLabel=$('#musicLabel'), musicState=$('#musicState');
 let lang=localStorage.getItem('engagement-language')||'ar', playing=false;
 const eventDate=new Date(2026,11,9,21,0,0);
 function setLanguage(next){
   lang=next;localStorage.setItem('engagement-language',lang);
   document.documentElement.lang=lang==='ar'?'ar':'en';document.documentElement.dir=lang==='ar'?'rtl':'ltr';
   document.querySelectorAll('[data-ar][data-en]').forEach(el=>{el.innerHTML=el.dataset[lang]});
   $('#langBtn').textContent=lang==='ar'?'عربي | English':'English | عربي';
   if(!playing) musicLabel.textContent=lang==='ar'?'تشغيل الموسيقى':'Play Music';
 }
 $('#langBtn').addEventListener('click',()=>setLanguage(lang==='ar'?'en':'ar'));
 async function toggleMusic(){
   if(playing){music.pause();playing=false;musicState.textContent='▶';musicLabel.textContent=lang==='ar'?'تشغيل الموسيقى':'Play Music';return}
   try{await music.play();playing=true;musicState.textContent='Ⅱ';musicLabel.textContent=lang==='ar'?'إيقاف الموسيقى':'Pause Music'}
   catch(e){musicLabel.textContent=lang==='ar'?'الصوت غير متاح':'Audio unavailable';setTimeout(()=>{if(!playing)musicLabel.textContent=lang==='ar'?'تشغيل الموسيقى':'Play Music'},2500)}
 }
 musicBtn.addEventListener('click',toggleMusic);
 $('#openArtBtn').addEventListener('click',async()=>{
   art.hidden=true;interactive.hidden=false;window.scrollTo({top:0,behavior:'smooth'});
   if(!playing) await toggleMusic();
 });
 $('#showDetailsBtn').addEventListener('click',()=>document.querySelector('.couple-section').scrollIntoView({behavior:'smooth'}));
 $('#topBtn').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
 function countdown(){
   let d=eventDate-Date.now();if(d<=0){['days','hours','minutes','seconds'].forEach(id=>$('#'+id).textContent='0');$('#countdownMessage').textContent=lang==='ar'?'بدأت فرحتنا! نتمنى لكم لحظات جميلة ❤️':'Our celebration has begun! ❤️';return}
   $('#days').textContent=Math.floor(d/86400000);$('#hours').textContent=Math.floor(d%86400000/3600000);$('#minutes').textContent=Math.floor(d%3600000/60000);$('#seconds').textContent=Math.floor(d%60000/1000);
 }
 countdown();setInterval(countdown,1000);setLanguage(lang);
})();