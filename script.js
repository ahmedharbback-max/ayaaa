(() => {
 const $ = s => document.querySelector(s);
 const opening = $('.opening'), invitation = $('#invitation'), openBtn = $('#openBtn');
 const music = $('#backgroundMusic'), musicBtn = $('#musicBtn'), musicState = $('#musicState');
 const controls = $('#motionControls'), pauseBtn = $('#pauseBtn'), resumeBtn = $('#resumeBtn');
 const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let opened = false, isPlaying = false, autoScroll = false, raf = null, lastTime = 0, scrollSpeed = 18, lang = localStorage.getItem('engagement-language') || 'ar';
 const eventDate = new Date(2026, 11, 9, 21, 0, 0); // local time, month is zero-based
 function setLanguage(next) {
   lang = next; localStorage.setItem('engagement-language', lang);
   document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
   document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
   document.querySelectorAll('[data-ar][data-en]').forEach(el => {
     const value = el.dataset[lang];
     if (value !== undefined) el.innerHTML = value;
   });
   $('#langBtn').textContent = lang === 'ar' ? 'عربي | English' : 'English | عربي';
 }
 $('#langBtn').addEventListener('click', () => setLanguage(lang === 'ar' ? 'en' : 'ar'));
 setLanguage(lang);

 async function toggleMusic() {
   if (isPlaying) {
     music.pause(); isPlaying = false; musicState.textContent = '▶';
     musicBtn.setAttribute('aria-label', lang === 'ar' ? 'تشغيل الموسيقى' : 'Play music');
     musicBtn.querySelector('[data-ar]').textContent = lang === 'ar' ? 'تشغيل الموسيقى' : 'Play Music';
   } else {
     try {
       await music.play(); isPlaying = true; musicState.textContent = 'Ⅱ';
       musicBtn.setAttribute('aria-label', lang === 'ar' ? 'إيقاف الموسيقى' : 'Pause music');
       musicBtn.querySelector('[data-ar]').textContent = lang === 'ar' ? 'إيقاف الموسيقى' : 'Pause Music';
     } catch (e) {
       musicBtn.querySelector('[data-ar]').textContent = lang === 'ar' ? 'تعذر تشغيل الصوت' : 'Audio unavailable';
       setTimeout(() => { if (!isPlaying) musicBtn.querySelector('[data-ar]').textContent = lang === 'ar' ? 'تشغيل الموسيقى' : 'Play Music'; }, 2500);
     }
   }
 }
 musicBtn.addEventListener('click', toggleMusic);

 function startAutoScroll() {
   if (reducedMotion || !opened) return;
   autoScroll = true; lastTime = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(scrollFrame);
 }
 function scrollFrame(time) {
   if (!autoScroll) return;
   if (!lastTime) lastTime = time;
   const delta = Math.min((time - lastTime) / 1000, .05); lastTime = time;
   window.scrollBy(0, scrollSpeed * delta);
   if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 3) {
     autoScroll = false; return;
   }
   raf = requestAnimationFrame(scrollFrame);
 }
 function stopAutoScroll() { autoScroll = false; cancelAnimationFrame(raf); }
 ['wheel','touchstart','pointerdown','keydown'].forEach(evt => {
   window.addEventListener(evt, e => {
     if (evt === 'keydown' && !['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key)) return;
     if (opened && !e.target.closest('.motion-controls') && !e.target.closest('.music-control') && !e.target.closest('.language-control')) stopAutoScroll();
   }, {passive:true});
 });
 openBtn.addEventListener('click', async () => {
   if (opened) return;
   opened = true; openBtn.disabled = true;
   opening.classList.add('opened');
   await toggleMusic();
   const finish = () => {
     opening.classList.add('finished'); invitation.classList.remove('hidden'); controls.hidden = false;
     invitation.querySelectorAll('.section').forEach((section,i) => { section.classList.add('reveal'); section.style.animationDelay = `${Math.min(i*.08,.4)}s`; });
     setTimeout(startAutoScroll, reducedMotion ? 0 : 700);
     openBtn.style.display = 'none';
   };
   setTimeout(finish, reducedMotion ? 50 : 1100);
 });
 pauseBtn.addEventListener('click', stopAutoScroll);
 resumeBtn.addEventListener('click', startAutoScroll);
 $('#restartBtn').addEventListener('click', () => {
   stopAutoScroll(); music.pause(); music.currentTime = 0; isPlaying = false;
   opened = false; openBtn.disabled = false; openBtn.style.display = '';
   invitation.classList.add('hidden'); controls.hidden = true; opening.classList.remove('opened','finished');
   window.scrollTo({top:0,behavior:reducedMotion?'auto':'smooth'});
   musicState.textContent = 'Ⅱ';
   musicBtn.querySelector('[data-ar]').textContent = lang === 'ar' ? 'تشغيل الموسيقى' : 'Play Music';
 });
 $('#topBtn').addEventListener('click', () => { stopAutoScroll(); window.scrollTo({top:0,behavior:reducedMotion?'auto':'smooth'}); });
 function updateCountdown() {
   const diff = eventDate.getTime() - Date.now();
   const msg = $('#countdownMessage');
   if (diff <= 0) {
     ['#days','#hours','#minutes','#seconds'].forEach(id => $(id).textContent = '0');
     msg.textContent = lang === 'ar' ? 'بدأت فرحتنا! نتمنى لكم لحظات جميلة ❤️' : 'Our celebration has begun! ❤️';
     return;
   }
   const d = Math.floor(diff/86400000), h = Math.floor(diff%86400000/3600000), m = Math.floor(diff%3600000/60000), s = Math.floor(diff%60000/1000);
   $('#days').textContent = d; $('#hours').textContent = h; $('#minutes').textContent = m; $('#seconds').textContent = s;
   msg.textContent = '';
 }
 updateCountdown(); setInterval(updateCountdown,1000);
})();