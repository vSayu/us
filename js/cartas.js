/* Cartas "ábrelo cuando…". Edita aquí los títulos y los textos. */
(()=>{
  const LETTERS=[
    {t:"estés triste",p:"Mi niña preciosa, si estás leyendo esto es porque hoy no fue un buen día. Quiero que sepas que no tienes que poder con todo sola.\n\nRespira, tómate un ratito y recuerda que aquí estoy, aunque a veces no sepa decir lo correcto. Me importas muchísimo."},
    {t:"me extrañes",p:"Si me extrañas, tranquila: yo también te extraño.\n\nCierra los ojos un momento y piensa en alguna de nuestras conversaciones tontas. Esa risa también es una forma de estar juntos."},
    {t:"no puedas dormir",p:"Ya es tarde y tu cabeza no se apaga. Eso pasa.\n\nSuelta lo que no puedas resolver hoy. Mañana será otro día y yo voy a estar ahí para escucharte. Descansa, mi amor."},
    {t:"estés feliz",p:"¡Qué bonito que estés feliz! Ojalá me cuentes qué fue lo que pasó.\n\nMe encanta verte así, y me alegra un montón ser parte de tus días buenos."},
    {t:"dudes de ti",p:"A veces no te ves como te veo yo. Y créeme que lo que veo es increíble.\n\nTu forma de ser, tu risa y hasta eso que crees raro de ti son parte de lo que me encanta. No tienes que ser perfecta."},
    {t:"quieras un abrazo",p:"Imagina que estoy ahí, apretándote fuerte sin decir nada.\n\nEste es un abrazo guardado: úsalo las veces que quieras, nunca se acaba."}
  ];
  const KEY="cartas-aperturas-v2",OLD_KEY="cartas-abiertas",SIGN="— Jair ♡";
  const reduce=false;
  let counts=Array(LETTERS.length).fill(0),timer;
  try{
    const saved=JSON.parse(localStorage.getItem(KEY)||"null");
    if(Array.isArray(saved))counts=LETTERS.map((_,i)=>Math.max(0,Number(saved[i])||0));
    else{
      const old=JSON.parse(localStorage.getItem(OLD_KEY)||"[]");
      old.forEach(i=>{if(Number.isInteger(i)&&i>=0&&i<counts.length)counts[i]=1});
    }
  }catch(e){}

  const sec=document.createElement("section");
  sec.className="page letters reveal";
  sec.dataset.theme="#efe9dc";
  sec.setAttribute("aria-labelledby","letters-title");
  sec.innerHTML='<span class="eyebrow">CARTITAS PARA TI</span><h2 class="section-heading" id="letters-title">Ábrelas cuando lo necesites</h2><p class="section-copy">Dejé unas cartitas guardadas para momentos distintos. Toca la que necesites hoy. ♡</p><div class="env-grid"></div><span class="letters-count"></span>';
  document.querySelector(".video-page").before(sec);

  const grid=sec.querySelector(".env-grid"),count=sec.querySelector(".letters-count");
  const dlg=document.createElement("dialog");
  dlg.className="note-dialog";
  dlg.setAttribute("aria-label","Carta");
  dlg.innerHTML='<form method="dialog"><button class="note-close" aria-label="Cerrar carta">×</button></form><span class="note-kicker">ÁBRELO CUANDO…</span><h3 class="note-title"></h3><p class="note-body"></p><p class="note-sign">'+SIGN+'</p>';
  document.body.append(dlg);
  const title=dlg.querySelector(".note-title"),body=dlg.querySelector(".note-body");

  function refreshCount(){
    const total=counts.reduce((sum,n)=>sum+n,0);
    count.textContent="Abriste cartas "+total+(total===1?" vez en total":" veces en total");
    grid.querySelectorAll(".env-reads").forEach((el,i)=>{
      el.textContent="La abriste "+counts[i]+(counts[i]===1?" vez":" veces");
    });
  }
  function typeText(text){
    clearInterval(timer);
    if(reduce){body.textContent=text;return}
    body.textContent="";
    let i=0;
    timer=setInterval(()=>{
      body.textContent=text.slice(0,++i);
      if(i>=text.length)clearInterval(timer);
    },24);
  }
  function openLetter(i,btn){
    const l=LETTERS[i];
    btn.classList.add("open");
    counts[i]++;
    try{localStorage.setItem(KEY,JSON.stringify(counts))}catch(e){}
    refreshCount();
    title.textContent="Cuando "+l.t;
    if(typeof burstHearts==="function")burstHearts();
    setTimeout(()=>{dlg.showModal();typeText(l.p)},reduce?0:450);
    dlg.addEventListener("close",()=>btn.classList.remove("open"),{once:true});
  }
  LETTERS.forEach((l,i)=>{
    const b=document.createElement("button");
    b.type="button";
    b.className="env";
    b.style.setProperty("--i",i);
    b.innerHTML='<span class="env-seal" aria-hidden="true">♡</span><span class="env-label"><small>Ábrelo cuando</small>'+l.t+'<small class="env-reads"></small></span>';
    b.addEventListener("click",()=>openLetter(i,b));
    grid.append(b);
  });
  dlg.addEventListener("close",()=>clearInterval(timer));
  refreshCount();
})();
