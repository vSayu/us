/* "Dar un toque": cambia estas dos líneas cuando tengas tu Worker */
const TOQUE_URL="https://TU-WORKER.TU-USUARIO.workers.dev";
const TOQUE_SECRET="cambia-este-codigo";

(()=>{
  const KEY="quien-soy",COOLDOWN=20;
  const get=()=>{try{return localStorage.getItem(KEY)}catch(e){return null}};
  const set=v=>{try{localStorage.setItem(KEY,v)}catch(e){}};
  const names={jair:"Jair",nicole:"Nicole"};
  let who=get(),busy=false;

  const btn=document.createElement("button");
  btn.id="toque-btn";btn.type="button";btn.hidden=true;
  btn.innerHTML='<span aria-hidden="true">♡</span> Dar un toque';
  document.body.append(btn);
  const toast=document.createElement("p");
  toast.id="toque-toast";toast.setAttribute("role","status");
  document.body.append(toast);

  const dlg=document.createElement("dialog");
  dlg.className="who-dialog";
  dlg.innerHTML='<h3>¿Quién eres?</h3><p>Así sabré a quién avisarle cuando des un toque.</p><div><button type="button" data-who="nicole">Soy Nicole</button><button type="button" data-who="jair">Soy Jair</button></div>';
  document.body.append(dlg);
  dlg.addEventListener("cancel",e=>e.preventDefault());
  dlg.querySelectorAll("[data-who]").forEach(b=>b.addEventListener("click",()=>{
    who=b.dataset.who;set(who);dlg.close();identify();
  }));

  function identify(){
    if(who&&typeof median!=="undefined"&&median.onesignal&&median.onesignal.login){
      try{median.onesignal.login(who)}catch(e){}
    }
  }
  function say(text){
    toast.textContent=text;toast.classList.add("show");
    clearTimeout(say.t);say.t=setTimeout(()=>toast.classList.remove("show"),3200);
  }
  function cooldown(){
    let n=COOLDOWN;
    btn.disabled=true;
    const t=setInterval(()=>{
      btn.lastChild.textContent=" Espera "+(--n)+"s";
      if(n<=0){clearInterval(t);btn.disabled=false;busy=false;btn.lastChild.textContent=" Dar un toque"}
    },1000);
  }
  btn.addEventListener("click",async()=>{
    if(busy||!who)return;
    busy=true;
    try{
      const r=await fetch(TOQUE_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({from:who,secret:TOQUE_SECRET})});
      if(!r.ok)throw new Error(r.status);
      say("Toque enviado ♡");
      if(typeof burstHearts==="function")burstHearts();
      cooldown();
    }catch(e){
      say("No se pudo enviar el toque. Revisa tu internet e inténtalo otra vez.");
      busy=false;
    }
  });

  /* mostrar todo cuando la app ya se abrió */
  const main=document.getElementById("main");
  function ready(){
    btn.hidden=false;
    if(!who)dlg.showModal();else identify();
  }
  if(!main.hidden)ready();
  else new MutationObserver((m,o)=>{if(!main.hidden){o.disconnect();ready()}}).observe(main,{attributes:true,attributeFilter:["hidden"]});
})();
