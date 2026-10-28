export function initDepth() {
  const sections=[...document.querySelectorAll('.section')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries)entry.target.classList.toggle('is-engaged',entry.isIntersecting);
  });
  sections.forEach(section=>observer.observe(section));
  const stages=[...document.querySelectorAll('.section-stage')];
  const wires=document.querySelector('#scene-wires');
  if(wires)stages.forEach(stage=>stage.prepend(wires.content.cloneNode(true)));
  if(stages.length){
    const loader=new IntersectionObserver(entries=>{
      if(!entries.some(entry=>entry.isIntersecting))return;
      loader.disconnect();
      import('./section-scenes.js').then(module=>module.initSectionScenes()).catch(()=>{});
    },{rootMargin:'300px'});
    stages.forEach(stage=>loader.observe(stage));
  }
  const timeline=document.querySelector('.timeline');
  let scrollFrame=0;
  function paintTimeline(){
    scrollFrame=0;if(!timeline)return;
    const box=timeline.getBoundingClientRect();
    timeline.style.setProperty('--timeline-fill',Math.min(1,Math.max(0,(innerHeight*.7-box.top)/Math.max(1,box.height))).toFixed(3));
  }
  window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(paintTimeline);},{passive:true});
  paintTimeline();
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  let pointerFrame=0;
  document.querySelector('.site-content')?.addEventListener('pointermove',event=>{
    if(reduced.matches)return;
    const panel=event.target.closest('.panel');if(!panel)return;
    cancelAnimationFrame(pointerFrame);
    pointerFrame=requestAnimationFrame(()=>{
      const box=panel.getBoundingClientRect();
      panel.style.setProperty('--shine-x',`${event.clientX-box.left}px`);
      panel.style.setProperty('--shine-y',`${event.clientY-box.top}px`);
    });
  },{passive:true});
}
