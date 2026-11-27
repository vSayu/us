document.documentElement.classList.add("js");
const $=s=>document.querySelector(s);
const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
const entry=$("#entry-screen"),gift=$("#gift-screen"),main=$("#main");
const music=$("#background-music"),musicButton=$("#music"),musicStatus=$("#music-status");
const song=$("#memory-song"),songStatus=$("#track-status");
const videoSingle=$("#video-single"),clipDialog=$("#video-dialog"),videoStatus=$("#video-status"),videoDialogTitle=$("#video-dialog-title"),videoDialogLabel=$("#video-dialog-label");
let opening=false,musicStatusTimer,ambientFrame=0,songResume=false,videoResume=false,finaleShown=false;
music.volume=.1;

function startGift(auto){
  if(opening)return;
  opening=true;
  if(!auto)try{localStorage.setItem("entrada-ok","1")}catch(e){}
  entry.hidden=true;gift.hidden=false;
  musicButton.classList.add("active");
  if(!auto)toggleMusic(true);
  const bar=$("#gift-progress"),msg=$("#gift-message");
  const msgs=["Preparando algo para ti...","Poniendo todo mi cariño...","Ya casi está ♡"];
  let n=0;
  const t=setInterval(()=>{
    n=Math.min(100,n+7+Math.random()*8);
    bar.style.width=n+"%";
    msg.textContent=msgs[Math.min(2,Math.floor(n/36))];
    if(n>=100){clearInterval(t);setTimeout(openApp,450)}
  },170);
}

function openApp(){
  gift.hidden=true;main.hidden=false;
  setUpImages();setUpSong();setUpLyrics();setUpDates();
  document.querySelectorAll(".reveal").forEach(s=>revealObserver.observe(s));
  document.querySelectorAll(".page").forEach((s,i)=>loadBackground(s,i+1));
  addEventListener("scroll",scheduleAmbient,{passive:true});
  addEventListener("resize",scheduleAmbient);
  scheduleAmbient();
}

/* ——— Música ——— */
function toggleMusic(play){
  if(!play){music.pause();musicButton.textContent="♫";musicButton.setAttribute("aria-label","Activar música");return}
  music.play().then(()=>{
    musicButton.textContent="Ⅱ";musicButton.setAttribute("aria-label","Pausar música");
    musicStatus.textContent="";musicStatus.classList.remove("visible");clearTimeout(musicStatusTimer);
  }).catch(()=>{
    musicStatus.textContent="Añade musica.mp3 junto a index.html para escuchar música.";
    musicStatus.classList.add("visible");
    clearTimeout(musicStatusTimer);
    musicStatusTimer=setTimeout(()=>musicStatus.classList.remove("visible"),4000);
    musicButton.textContent="♫";musicButton.setAttribute("aria-label","Activar música");
  });
}
musicButton.addEventListener("click",()=>toggleMusic(music.paused));

/* ——— Imágenes ——— */
function setUpImages(){
  const exts=[".jpg",".png",".webp"];
  document.querySelectorAll(".photo-slot[data-image]").forEach(slot=>{
    const base=slot.dataset.image;
    const hasExt=/\.[a-z0-9]+$/i.test(base);
    const root=hasExt?base.replace(/\.[^/.]+$/,""):base;
    const list=hasExt?[base,...exts.map(e=>root+e).filter(n=>n!==base)]:exts.map(e=>root+e);
    const img=new Image();
    let k=0;
    img.alt=slot.dataset.alt||"";
    img.onload=()=>{slot.append(img);slot.classList.add("has")};
    img.onerror=()=>{if(++k<list.length)img.src="img/"+list[k];else slot.querySelector(".placeholder").textContent="＋ img/"+list[0]};
    img.src="img/"+list[0];
  });
  document.querySelectorAll(".deco").forEach(i=>i.addEventListener("error",()=>i.remove(),{once:true}));
}
function loadBackground(section,n){
  const img=new Image(),path="img/fondo-p"+n+".jpg";
  img.onload=()=>{
    section.style.backgroundImage="radial-gradient(circle,var(--dot) 1.5px,transparent 1.9px),url("+path+")";
    section.style.backgroundPosition="0 0,center";section.style.backgroundSize="var(--dot-size) var(--dot-size),cover";
  };
  img.src=path;
}

/* ——— Fechas ——— */
function setUpDates(){
  const start=new Date(CONFIG.startDate+"T00:00:00");
  if(Number.isNaN(start.getTime()))throw new Error("CONFIG.startDate debe tener formato AAAA-MM-DD.");
  const now=new Date();
  $("#days").textContent=Math.max(0,Math.floor((now-start)/864e5)).toLocaleString("es");
  const half=new Date(start);half.setMonth(half.getMonth()+6);
  const left=Math.ceil((half-now)/864e5);
  $("#anniversary-countdown").textContent=left>0?"Faltan "+left+" días para celebrar nuestro medio año.":left===0?"Hoy celebramos seis meses de nosotros. ♡":"Nuestro medio año ya llegó; seguimos sumando días juntitos. ♡";
  $("#moon-date").textContent=[CONFIG.birthDates.jair,CONFIG.birthDates.nicole].map(d=>d.split("-").reverse().join(" / ")).join("  ·  ");
}

/* ——— Aparición y escritura letra por letra ——— */
const revealObserver=new IntersectionObserver(list=>{
  list.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");startWriting(e.target);revealObserver.unobserve(e.target)}});
},{threshold:.12});
const TW=["p:not([role='status'])",".primary-btn",".text-btn",".bonus-btn",".track-artist",".final-sign",".anniversary-number",".moment small","#days",".track-link",".whatsapp-link",".whatsapp-note","#skip-video"].join(",");
function wrapChars(root,start){
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];
  while(w.nextNode())nodes.push(w.currentNode);
  let i=start;
  nodes.forEach(node=>{
    if(!node.nodeValue)return;
    const frag=document.createDocumentFragment();
    for(const ch of node.nodeValue){
      const s=document.createElement("span");
      s.className="tw-char";s.style.setProperty("--i",i++);s.textContent=ch;
      frag.appendChild(s);
    }
    node.parentNode.replaceChild(frag,node);
  });
  return i;
}
function startWriting(root){
  if(reduceMotion.matches)return;
  const targets=[];
  if(root.matches(TW))targets.push(root);
  targets.push(...root.querySelectorAll(TW));
  let idx=0;
  [...new Set(targets)].forEach(el=>{
    if(el.closest("[hidden],h1,h2,h3,h4,h5,h6,.eyebrow,.cover-subtitle,.final-intro,.video-caption"))return;
    if(el.dataset.tw)return;
    el.dataset.tw="1";
    if(!el.hasAttribute("aria-label"))el.setAttribute("aria-label",el.textContent.replace(/\s+/g," ").trim());
    idx=wrapChars(el,idx);
    requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add("writing")));
  });
}
/* (startWriting(entry) eliminado: la intro anima su propio texto) */

/* ——— Fondo que cambia de color al hacer scroll ——— */
const channels=c=>{const v=(c.match(/[\d.]+/g)||[]).slice(0,3).map(Number);return v.length===3?v:[247,241,231]};
const blend=(a,b,t)=>"rgb("+a.map((x,i)=>Math.round(x+(b[i]-x)*t)).join(",")+")";
function updateAmbient(){
  const secs=[...document.querySelectorAll(".page:not([hidden]), #anniversary-footer:not([hidden])")];
  if(!secs.length)return;
  const stops=secs.map(s=>{const b=s.getBoundingClientRect();return{center:b.top+scrollY+b.height/2,color:channels(getComputedStyle(s).backgroundColor)}});
  secs.forEach((s,i)=>{if(s.classList.contains("page"))s.style.setProperty("--next-surface",blend(stops[i].color,stops[Math.min(i+1,stops.length-1)].color,1))});
  const pos=scrollY+innerHeight/2;
  let i=0;
  while(i<stops.length-2&&pos>stops[i+1].center)i++;
  const cur=stops[i],next=stops[Math.min(i+1,stops.length-1)],d=next.center-cur.center;
  const p=d>0?Math.max(0,Math.min(1,(pos-cur.center)/d)):0;
  const amb=$("#ambient");
  amb.style.setProperty("--ambient-from",blend(cur.color,next.color,p));
  amb.style.setProperty("--ambient-to",blend(cur.color,next.color,Math.min(1,p+.24)));
}
function scheduleAmbient(){
  if(ambientFrame)return;
  ambientFrame=requestAnimationFrame(()=>{ambientFrame=0;updateAmbient()});
}

/* ——— Canción ——— */
function setUpSong(){
  $("#track-title").textContent=CONFIG.songTitle;
  $("#track-artist").textContent=CONFIG.songArtist;
  if(!CONFIG.songUrl)return;
  try{
    const u=new URL(CONFIG.songUrl);
    if(u.protocol!=="https:")throw new Error("CONFIG.songUrl debe usar HTTPS.");
    $("#track-link").href=u.href;$("#track-link").hidden=false;
  }catch(err){songStatus.textContent=err.message||"CONFIG.songUrl no es un enlace válido."}
}
function resumeAfterSong(){if(songResume){songResume=false;toggleMusic(true)}}

/* ——— Letra estilo Spotify ——— */
function setUpLyrics(){
  const box=$("#lyrics"),lines=CONFIG.lyrics||[];
  if(!box||!lines.length)return;
  box.innerHTML="";
  lines.forEach(l=>{
    const p=document.createElement("p");p.className="lyric-line";
    const ko=document.createElement("span");ko.className="lyric-ko";ko.textContent=l.text;p.append(ko);
    if(l.es){const es=document.createElement("span");es.className="lyric-es";es.textContent=l.es;p.append(es);}
    box.append(p);
  });
  box.hidden=false;
  syncLyrics();
}
function syncLyrics(){
  const box=$("#lyrics"),lines=CONFIG.lyrics||[];
  if(!box||!lines.length)return;
  const t=song.currentTime+(CONFIG.lyricsOffset||0);
  let idx=-1;
  for(let i=0;i<lines.length;i++){if(t>=lines[i].t)idx=i;else break;}
  const shown=idx<0?0:idx;
  [...box.children].forEach((el,i)=>{el.classList.toggle("show",i<=shown);el.classList.toggle("active",i===idx)});
  const active=box.children[idx];
  if(active)box.scrollTo({top:active.offsetTop-box.clientHeight*0.32,behavior:"auto"});
}
song.addEventListener("timeupdate",syncLyrics);

/* ——— Barra de tiempo ——— */
const seekBar=$("#seek-bar"),seekCurrent=$("#seek-current"),seekDuration=$("#seek-duration");
const fmtTime=s=>{s=Math.max(0,s||0);const m=Math.floor(s/60),r=Math.floor(s%60);return m+":"+String(r).padStart(2,"0")};
song.addEventListener("loadedmetadata",()=>{seekBar.max=100;seekDuration.textContent=fmtTime(song.duration)});
song.addEventListener("timeupdate",()=>{
  if(document.activeElement!==seekBar)seekBar.value=song.currentTime;
  seekCurrent.textContent=fmtTime(song.currentTime);
  const pct=song.duration?(song.currentTime/song.duration)*100:0;
  seekBar.style.setProperty("--progress",pct+"%");
});
seekBar.addEventListener("input",()=>{if(!Number.isNaN(song.duration))song.currentTime=(seekBar.value/100)*song.duration});

const songMissing=()=>{songStatus.textContent="Añade audio/cancion-especial.mp3 para escuchar esta canción.";resumeAfterSong()};
$("#play-song").addEventListener("click",()=>{
  if(!song.paused){song.pause();return}
  songStatus.textContent="";
  songResume=!music.paused;
  if(songResume)toggleMusic(false);
  song.play().catch(songMissing);
  setTimeout(()=>{if(song.networkState===song.NETWORK_NO_SOURCE)songMissing()},500);
});
const songIdle=()=>{$("#track-icon").textContent="▶";$("#play-song").setAttribute("aria-label","Reproducir canción");resumeAfterSong()};
song.addEventListener("play",()=>{$("#track-icon").textContent="Ⅱ";$("#play-song").setAttribute("aria-label","Pausar canción")});
song.addEventListener("pause",songIdle);
song.addEventListener("ended",songIdle);

/* ——— Notita extra ——— */
$("#bonus-button").addEventListener("click",e=>{
  const note=$("#bonus-note"),open=note.hidden,b=e.currentTarget;
  note.hidden=!open;
  if(open)startWriting(note);
  b.setAttribute("aria-expanded",String(open));
  b.textContent=open?"Cerrar notita":"Abrir una última notita ✉";
  b.removeAttribute("aria-label");b.removeAttribute("data-tw");b.classList.remove("writing");
  startWriting(b);
});

/* ——— Video y final ——— */
const videoProblem=()=>{videoStatus.textContent="No se pudo cargar el clip. Comprueba video-hori.mp4 y video-miyamura.mp4 y vuelve a intentarlo."};
function resetVideo(){videoSingle.pause();videoSingle.removeAttribute("src");videoSingle.load()}
function setVideo(src,label){
  resetVideo();
  videoDialogTitle.textContent=label+" ♡";
  videoDialogLabel.textContent=label;
  videoSingle.src=src;
  videoSingle.load();
}
function pickVideo(src,label){
  videoStatus.textContent="";
  videoResume=!music.paused;
  if(videoResume)toggleMusic(false);
  setVideo(src,label);
  clipDialog.showModal();
  videoSingle.play().catch(()=>{});
}
function burstHearts(){
  if(reduceMotion.matches)return;
  const glyphs=["♡","❤","💕","💖","✨","💞"],colors=["#c98283","#d98c8c","#b98179","#e4d5a5","#78845b"],vh=innerHeight;
  for(let i=0;i<18;i++){
    const h=document.createElement("span");
    h.className="burst-heart";
    h.textContent=glyphs[Math.floor(Math.random()*glyphs.length)];
    h.style.left=Math.random()*100+"%";
    h.style.fontSize=(14+Math.random()*26)+"px";
    h.style.color=colors[i%colors.length];
    document.body.appendChild(h);
    const dr=(Math.random()*2-1)*140,sp=(Math.random()*2-1)*90;
    h.animate([
      {transform:"translate(0,0) scale(.5) rotate(0deg)",opacity:0},
      {transform:`translate(${dr*.35}px,-${vh*.45}px) scale(1) rotate(${sp*.3}deg)`,opacity:1,offset:.35},
      {transform:`translate(${dr}px,-${vh*1.05}px) scale(.85) rotate(${sp}deg)`,opacity:0}
    ],{duration:2400+Math.random()*2000,delay:Math.random()*700,easing:"cubic-bezier(.2,.7,.2,1)",fill:"forwards"}).onfinish=()=>h.remove();
  }
}
const resumeAfterVideo=()=>{if(videoResume){videoResume=false;toggleMusic(true)}};
function showFinale(){
  if(finaleShown)return;
  finaleShown=true;
  const overlay=$("#page-transition"),fp=$("#final-page"),footer=$("#anniversary-footer");
  overlay.classList.add("active");
  burstHearts();
  setTimeout(()=>{
    fp.hidden=false;footer.hidden=false;
    revealObserver.observe(fp);revealObserver.observe(footer);
    fp.scrollIntoView({behavior:"auto"});
    scheduleAmbient();
    requestAnimationFrame(()=>requestAnimationFrame(()=>overlay.classList.remove("active")));
    resumeAfterVideo();
  },780);
}
$("#pick-hori").addEventListener("click",()=>pickVideo("video-hori.mp4","Hori"));
$("#pick-miyamura").addEventListener("click",()=>pickVideo("video-miyamura.mp4","Miyamura"));
$("#skip-video").addEventListener("click",()=>{resetVideo();showFinale()});
videoSingle.addEventListener("ended",()=>{clipDialog.close();showFinale()});
videoSingle.addEventListener("error",()=>{if(videoSingle.getAttribute("src"))videoProblem()});
clipDialog.addEventListener("close",()=>{videoSingle.pause();resumeAfterVideo()});
$("#whatsapp-link").href="https://wa.me/"+CONFIG.whatsapp.phone+"?text="+encodeURIComponent(CONFIG.whatsapp.text);

/* ——— Extras con vida ——— */
(()=>{
  const bar=document.createElement("div");
  bar.id="progress";document.body.append(bar);
  addEventListener("scroll",()=>{
    const max=document.documentElement.scrollHeight-innerHeight;
    bar.style.transform="scaleX("+(max>0?Math.min(1,scrollY/max):0)+")";
  },{passive:true});
  if(reduceMotion.matches)return;

  const moon=$(".moon");
  for(let i=0;i<30;i++){
    const s=document.createElement("span");
    s.className="star";
    s.style.left=Math.random()*100+"%";s.style.top=Math.random()*100+"%";
    s.style.setProperty("--t",(2+Math.random()*3)+"s");
    s.style.animationDelay=(-Math.random()*4)+"s";
    moon.append(s);
  }

  const glyphs=["♡","♥","✿","✧","♡"],colors=["#c98283","#d9a3a3","#b98179","#e4d5a5","#9aa67d"];
  let alive=0;
  setInterval(()=>{
    if(document.hidden||alive>=10)return;
    const h=document.createElement("span");
    h.className="float-heart";
    h.textContent=glyphs[Math.floor(Math.random()*glyphs.length)];
    h.style.left=Math.random()*100+"%";
    h.style.fontSize=(12+Math.random()*16)+"px";
    h.style.color=colors[Math.floor(Math.random()*colors.length)];
    h.style.setProperty("--dx",((Math.random()*2-1)*90)+"px");
    h.style.setProperty("--rot",((Math.random()*2-1)*60)+"deg");
    h.style.animationDuration=(7+Math.random()*6)+"s";
    alive++;
    h.addEventListener("animationend",()=>{h.remove();alive--});
    document.body.append(h);
  },1400);

  document.addEventListener("pointerdown",e=>{
    const h=document.createElement("span");
    h.className="tap-heart";
    h.textContent=Math.random()>.5?"♡":"♥";
    h.style.left=(e.clientX-10)+"px";h.style.top=(e.clientY-10)+"px";
    document.body.append(h);
    const dx=(Math.random()*2-1)*30;
    h.animate([
      {transform:"translate(0,0) scale(.4)",opacity:0},
      {transform:`translate(${dx*.4}px,-18px) scale(1.2)`,opacity:1,offset:.25},
      {transform:`translate(${dx}px,-70px) scale(.8)`,opacity:0}
    ],{duration:900,easing:"cubic-bezier(.2,.7,.2,1)"}).onfinish=()=>h.remove();
  },{passive:true});
})();

/* Si ya abrió el regalo antes, entra directo sin preguntar */
try{if(localStorage.getItem("entrada-ok"))startGift(true)}catch(e){}
