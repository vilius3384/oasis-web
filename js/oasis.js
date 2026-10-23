// Decorative, locally drawn oasis for the final invitation.
export function initializeClosingOasis(){
  const section=document.querySelector('.closing');
  if(!section)return;
  const canvas=document.createElement('canvas');
  canvas.className='closing-oasis';
  canvas.setAttribute('aria-hidden','true');
  section.prepend(canvas);
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  const scene=document.createElement('canvas');
  const bg=scene.getContext('2d');
  if(!bg)return;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let width=0,height=0,frame=0,visible=false;
  const bubbles=Array.from({length:18},(_,i)=>({x:((i*47+13)%100)/100,y:((i*31)%100)/100,r:1+i%3,speed:.012+(i%5)*.004}));

  function palm(x,y,scale,lean){
    bg.save();bg.translate(x,y);bg.scale(scale,scale);
    bg.strokeStyle='#020f17';bg.fillStyle='#03151c';
    bg.lineWidth=13;bg.lineCap='round';
    bg.beginPath();bg.moveTo(0,0);bg.quadraticCurveTo(lean*.25,-100,lean,-205);bg.stroke();
    for(let i=0;i<9;i++){
      const angle=-Math.PI+i*Math.PI/8;
      const reach=85+(i%3)*15;
      const dx=Math.cos(angle)*reach,dy=Math.sin(angle)*45+25;
      bg.beginPath();bg.moveTo(lean,-205);
      bg.quadraticCurveTo(lean+dx*.55,-240+dy*.3,lean+dx,-205+dy);
      bg.quadraticCurveTo(lean+dx*.45,-211+dy*.3,lean,-205);bg.fill();
    }
    bg.restore();
  }
  function resize(){
    width=section.clientWidth;height=section.clientHeight;
    const dpr=Math.min(devicePixelRatio||1,2);
    for(const target of [canvas,scene]){target.width=Math.round(width*dpr);target.height=Math.round(height*dpr);}
    ctx.setTransform(dpr,0,0,dpr,0,0);bg.setTransform(dpr,0,0,dpr,0,0);
    const sky=bg.createLinearGradient(0,0,0,height);
    sky.addColorStop(0,'#071824');sky.addColorStop(.6,'#163b40');sky.addColorStop(1,'#081c28');
    bg.fillStyle=sky;bg.fillRect(0,0,width,height);
    // Layered dunes surround a softly lit central pool.
    for(let i=0;i<3;i++){
      bg.fillStyle=['#243a38','#1a302f','#10282b'][i];
      bg.beginPath();bg.moveTo(0,height*(.48+i*.08));
      bg.bezierCurveTo(width*.25,height*(.23+i*.1),width*.55,height*.84,width,height*(.4+i*.12));
      bg.lineTo(width,height);bg.lineTo(0,height);bg.fill();
    }
    const water=bg.createRadialGradient(width*.5,height*.86,0,width*.5,height*.86,width*.4);
    water.addColorStop(0,'#28646b');water.addColorStop(1,'#0a2631');
    bg.fillStyle=water;bg.beginPath();bg.ellipse(width*.5,height*.9,width*.37,height*.24,0,0,Math.PI*2);bg.fill();
    bg.lineWidth=1;
    for(let i=0;i<10;i++){
      bg.strokeStyle=`rgba(108,185,176,${.14-i*.009})`;
      bg.beginPath();bg.ellipse(width*.5,height*(.77+i*.022),width*(.08+i*.023),3+i*.5,0,0,Math.PI);bg.stroke();
    }
    const size=Math.min(1.6,Math.max(.75,height/340));
    palm(width*.035,height*1.04,size,35);palm(width*.16,height*1.07,size*.72,-25);
    palm(width*.965,height*1.04,size,-38);palm(width*.84,height*1.08,size*.7,26);
    draw(0);
  }
  function draw(time){
    ctx.clearRect(0,0,width,height);ctx.drawImage(scene,0,0,width,height);
    // Dark veil preserves contrast for the invitation above the scenery.
    ctx.fillStyle='#020d1870';ctx.fillRect(0,0,width,height);
    if(motion.matches)return;
    for(const bubble of bubbles){
      const y=height*(1-((bubble.y+time*.001*bubble.speed)%1));
      const x=width*(.2+bubble.x*.6)+Math.sin(time*.0005+bubble.x*12)*8;
      const opacity=Math.sin(Math.PI*y/height)*.22;
      ctx.strokeStyle=`rgba(139,211,202,${opacity})`;ctx.lineWidth=.8;
      ctx.beginPath();ctx.arc(x,y,bubble.r,0,Math.PI*2);ctx.stroke();
    }
  }
  function tick(time){frame=0;draw(time);if(visible&&!document.hidden&&!motion.matches)frame=requestAnimationFrame(tick);}
  function sync(){
    if(frame)cancelAnimationFrame(frame);frame=0;
    if(visible&&!document.hidden&&!motion.matches)frame=requestAnimationFrame(tick);
    else draw(0);
  }
  new ResizeObserver(resize).observe(section);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(section);
  document.addEventListener('visibilitychange',sync);
  motion.addEventListener('change',sync);
  resize();
}
