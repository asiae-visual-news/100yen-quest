/* 100yen-quest | iframe-free Shadow DOM embed */
(()=>{
  const script=document.currentScript;
  const base=new URL('.',script.src).href;
  const target=document.getElementById('yen100-quest');
  if(!target){console.error('[100yen-quest] #yen100-quest not found');return;}
  if(target.dataset.yenMounted)return;
  target.dataset.yenMounted='1';
  // Space-tourism reference: keep the game IN FLOW.
  // Never move it under body and never cover the editor with a fixed layer.
  target.style.cssText='display:block!important;position:relative!important;box-sizing:border-box!important;width:100%!important;max-width:none!important;min-width:0!important;margin:0!important;padding:0!important;left:0!important;right:auto!important;transform:none!important;float:none!important;clear:both!important;overflow:hidden!important;';
  const shadow=target.attachShadow({mode:'open'});
  const root=document.createElement('div');root.className='quest-root';shadow.append(root);
  const fix=(html)=>html.replace(/(src|href)=(['"])(?!https?:|data:|#|\/)([^'"]+)\2/g,(_,a,q,p)=>`${a}=${q}${new URL(p,base).href}${q}`);
  Promise.all(['content.html','style.css','game.js'].map(f=>fetch(new URL(f,base)).then(r=>{if(!r.ok)throw Error(f+': '+r.status);return r.text()})))
  .then(([markup,css,js])=>{
    const style=document.createElement('style');style.textContent=css+'\n:host{display:block!important;width:100%;} .quest-root{position:relative;min-height:100vh;}';shadow.prepend(style);
    root.innerHTML=fix(markup);
    // Local DOM proxy: original game logic queries its own isolated DOM.
    const localWindow=Object.create(window);localWindow.scrollTo=()=>{target.scrollIntoView({behavior:'smooth',block:'start'});};
    const localDoc={getElementById:(id)=>shadow.getElementById(id),querySelector:(sel)=>shadow.querySelector(sel),querySelectorAll:(sel)=>shadow.querySelectorAll(sel),createElement:(tag)=>document.createElement(tag),addEventListener:(...a)=>document.addEventListener(...a),removeEventListener:(...a)=>document.removeEventListener(...a),documentElement:document.documentElement,body:document.body};
    const onAttrs=[...shadow.querySelectorAll('[onclick]')].map(el=>[el,el.getAttribute('onclick')]);
    onAttrs.forEach(([el])=>el.removeAttribute('onclick'));
    try{
      // The original two scripts and inline handlers share one lexical scope.
      new Function('document','window','root','handlers',js+'\n;handlers.forEach(([el,code])=>el.addEventListener("click",function(event){return eval(code)}));')(localDoc,localWindow,root,onAttrs);
    }catch(err){console.error('[100yen-quest] Game initialization:',err)}
    // Adapted from the working spaceVisualNews bleed routine.
    // The viewport is ALWAYS the current document's viewport (including
    // the editor document); do not use top-window width.
    function unlock(){
      let p=target.parentElement, count=0;
      while(p && p!==document.body && count++<12){
        const s=getComputedStyle(p);
        if(['hidden','clip'].includes(s.overflowX) || ['hidden','clip'].includes(s.overflow)){
          p.style.setProperty('overflow-x','visible','important');
          if(['hidden','clip'].includes(s.overflowY))
            p.style.setProperty('overflow-y','visible','important');
        }
        p=p.parentElement;
      }
    }
    function align(){
      const vw=document.documentElement.clientWidth||window.innerWidth;
      if(!vw)return;
      unlock();
      target.style.setProperty('position','relative','important');
      target.style.setProperty('width',vw+'px','important');
      target.style.setProperty('max-width','none','important');
      target.style.setProperty('transform','none','important');
      target.style.setProperty('left','0px','important');
      // Reset before measuring: prevents offset accumulation on each resize.
      const x=target.getBoundingClientRect().left;
      if(Math.abs(x)>1)target.style.setProperty('left',(-x)+'px','important');
    }
    align();
    requestAnimationFrame(align);
    setTimeout(align,100);
    setTimeout(align,400);
    window.addEventListener('resize',align,{passive:true});
    window.addEventListener('orientationchange',align,{passive:true});
    if(document.fonts?.ready)document.fonts.ready.then(align);
    }).catch(err=>{console.error('[100yen-quest] load:',err);root.innerHTML='<p style="padding:24px;font-family:sans-serif">게임을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>'});
})();
