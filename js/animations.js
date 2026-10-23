const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let textObserver;
export function animateText(root=document){
  if(reduced)return;
  textObserver??=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('text-visible');textObserver.unobserve(entry.target);}
  }),{threshold:.15});
  root.querySelectorAll('.hero h1,.hero-subtitle,.hero-description,.section h2,.section-description').forEach(element=>{
    if(element.dataset.animatedText===element.textContent)return;
    element.dataset.animatedText=element.textContent;
    element.classList.remove('text-visible');
    const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    let index=0;
    nodes.forEach(node=>{
      const fragment=document.createDocumentFragment();
      node.textContent.split(/(\s+)/).filter(Boolean).forEach(word=>{
        if(/^\s+$/.test(word)){fragment.append(document.createTextNode(word));return;}
        const span=document.createElement('span');span.className='text-word';span.textContent=word;
        span.style.setProperty('--word-delay',`${Math.min(index++*45,500)}ms`);fragment.append(span);
      });
      node.replaceWith(fragment);
    });
    element.classList.add('text-reveal');textObserver.observe(element);
  });
}
function initializeSpotlight(){
  if(reduced||!matchMedia('(hover: hover) and (pointer: fine)').matches)return;
  const hero=document.querySelector('.hero');
  let frame=0,clientX=0,clientY=0;
  const update=()=>{
    frame=0;const bounds=hero.getBoundingClientRect();
    hero.style.setProperty('--spot-x',`${clientX-bounds.left}px`);
    hero.style.setProperty('--spot-y',`${clientY-bounds.top}px`);
  };
  hero.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch')return;
    clientX=event.clientX;clientY=event.clientY;
    if(!frame)frame=requestAnimationFrame(update);
    hero.classList.add('spotlight-active');
  },{passive:true});
  const clear=()=>{hero.classList.remove('spotlight-active');if(frame)cancelAnimationFrame(frame);frame=0;};
  hero.addEventListener('pointerleave',clear);hero.addEventListener('pointercancel',clear);
  addEventListener('blur',clear);addEventListener('scroll',clear,{passive:true});
}
export function observeCounters(root){const counters=root.querySelectorAll('[data-count]');if(reduced)return;const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;observer.unobserve(entry.target);const target=Number(entry.target.dataset.count);let start;function frame(time){start??=time;const progress=Math.min((time-start)/1300,1);entry.target.textContent=new Intl.NumberFormat('lt-LT').format(Math.round(target*(1-(1-progress)**3)));if(progress<1)requestAnimationFrame(frame);}requestAnimationFrame(frame);}),{threshold:.5});counters.forEach(el=>observer.observe(el));}
export function initializeAnimations(){if(reduced)return;animateText();initializeSpotlight();const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.section').forEach(el=>{el.classList.add('reveal');observer.observe(el);});const particles=document.querySelector('.particles');for(let i=0;i<19;i++){const p=document.createElement('i');p.className='particle';p.style.cssText=`left:${(i*37)%100}%;top:${35+(i*13)%65}%;animation-delay:-${i*.7}s;animation-duration:${8+i%5}s`;particles.append(p);}let ticking=false;const art=document.querySelector('.hero-art');addEventListener('scroll',()=>{if(!ticking&&scrollY<1000){ticking=true;requestAnimationFrame(()=>{art.style.transform=`translateY(${scrollY*.13}px)`;ticking=false;});}},{passive:true});}
