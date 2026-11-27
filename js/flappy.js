(()=>{
  const canvas=document.getElementById("flappy-canvas");
  if(!canvas)return;
  const ctx=canvas.getContext("2d");
  const dialog=document.getElementById("game-dialog");
  const startButton=document.getElementById("game-start");
  const restartButton=document.getElementById("game-restart");
  const scoreLabel=document.getElementById("game-score");
  const hint=document.getElementById("game-hint");
  const bird={x:0,y:0,vy:0,r:15};
  let width=0,height=0,dpr=1,raf=0,last=0,frames=0,score=0,running=false,started=false,pipes=[];
  const gap=158,pipeWidth=58,speed=2.5;

  function resize(){
    const rect=canvas.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    dpr=Math.min(devicePixelRatio||1,2);width=rect.width;height=rect.height;
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    bird.x=width*.27;bird.r=Math.max(12,width*.043);
    if(!started)bird.y=height*.46;
    draw();
  }
  function flap(){if(!running)return;bird.vy=-6.1;}
  function start(){
    cancelAnimationFrame(raf);resize();started=true;running=true;frames=0;score=0;pipes=[];
    bird.y=height*.46;bird.vy=-5.5;scoreLabel.textContent="0";scoreLabel.hidden=false;
    restartButton.hidden=true;hint.textContent="Toca o presiona espacio para volar";
    last=performance.now();raf=requestAnimationFrame(loop);
  }
  function end(){running=false;cancelAnimationFrame(raf);hint.textContent="¡Llegaste a " + score + " tuberías! ♡";restartButton.hidden=false;}
  function input(e){if(e)e.preventDefault();flap();}
  function loop(now){
    if(!running)return;
    const dt=Math.min((now-last)/16.67,2);last=now;frames+=dt;
    bird.vy+=.34*dt;bird.y+=bird.vy*dt;
    if(frames>72&&frames%92<dt){const top=75+Math.random()*(height-gap-150);pipes.push({x:width+pipeWidth,top,passed:false});}
    pipes.forEach(p=>{p.x-=speed*dt;if(!p.passed&&p.x+pipeWidth<bird.x){p.passed=true;score++;scoreLabel.textContent=score;}});
    pipes=pipes.filter(p=>p.x+pipeWidth>-5);
    if(bird.y-bird.r<0||bird.y+bird.r>height||pipes.some(p=>bird.x+bird.r>p.x&&bird.x-bird.r<p.x+pipeWidth&&(bird.y-bird.r<p.top||bird.y+bird.r>p.top+gap))){end();draw();return;}
    draw();raf=requestAnimationFrame(loop);
  }
  function draw(){
    if(!width||!height)return;
    const sky=ctx.createLinearGradient(0,0,0,height);sky.addColorStop(0,"#c8eff0");sky.addColorStop(1,"#f8e9e4");
    ctx.clearRect(0,0,width,height);ctx.fillStyle=sky;ctx.fillRect(0,0,width,height);
    ctx.fillStyle="#ffffff70";
    [[.18,.18,25],[.72,.28,34],[.44,.62,20]].forEach(([x,y,r])=>{ctx.beginPath();ctx.arc(width*x,height*y,r,0,Math.PI*2);ctx.fill()});
    pipes.forEach(p=>{
      const grad=ctx.createLinearGradient(p.x,0,p.x+pipeWidth,0);grad.addColorStop(0,"#87966b");grad.addColorStop(.5,"#a9b987");grad.addColorStop(1,"#718157");ctx.fillStyle=grad;
      ctx.fillRect(p.x,0,pipeWidth,p.top);ctx.fillRect(p.x,p.top+gap,pipeWidth,height-p.top-gap);
      ctx.fillStyle="#718157";ctx.fillRect(p.x-5,p.top-16,pipeWidth+10,16);ctx.fillRect(p.x-5,p.top+gap,pipeWidth+10,16);
    });
    ctx.save();ctx.translate(bird.x,bird.y);ctx.rotate(Math.max(-.35,Math.min(.65,bird.vy*.045)));
    ctx.shadowColor="#9d667077";ctx.shadowBlur=12;ctx.fillStyle="#f4c5a3";ctx.beginPath();ctx.ellipse(0,0,bird.r*1.2,bird.r*.92,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle="#fff8e9";ctx.beginPath();ctx.arc(bird.r*.48,-bird.r*.2,bird.r*.34,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#30342f";ctx.beginPath();ctx.arc(bird.r*.59,-bird.r*.18,bird.r*.12,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#d98c79";ctx.beginPath();ctx.moveTo(bird.r*.95,0);ctx.lineTo(bird.r*1.55,bird.r*.18);ctx.lineTo(bird.r*.95,bird.r*.34);ctx.closePath();ctx.fill();
    ctx.restore();
  }
  startButton.addEventListener("click",()=>{dialog.showModal();start();});
  restartButton.addEventListener("click",start);
  document.getElementById("game-close").addEventListener("click",()=>{running=false;cancelAnimationFrame(raf);dialog.close();});
  dialog.addEventListener("cancel",()=>{running=false;cancelAnimationFrame(raf);});
  canvas.addEventListener("pointerdown",e=>{e.stopPropagation();input(e);});
  document.addEventListener("keydown",e=>{if(e.code==="Space"&&running){e.preventDefault();flap();}});
  addEventListener("resize",()=>{if(started){resize();draw();}});
  resize();
})();
