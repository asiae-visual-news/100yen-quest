/* 100yen-quest | iframe-free Shadow DOM embed */
(()=>{
  const script=document.currentScript;
  const base=new URL('.',script.src).href;
  const target=document.getElementById('yen100-quest');
  if(!target){console.error('[100yen-quest] #yen100-quest not found');return;}
  if(target.dataset.yenMounted)return;
  target.dataset.yenMounted='1';
  // Space-tourism-style in-flow full bleed: never portal into body.
  // This keeps the article's own scroll position and avoids overlaying the CMS.
  target.style.setProperty('display','block','important');
  target.style.setProperty('position','relative','important');
  target.style.setProperty('width','100%','important');
  target.style.setProperty('max-width','none','important');
  target.style.setProperty('min-width','0','important');
  target.style.setProperty('left','0','important');
  target.style.setProperty('right','auto','important');
  target.style.setProperty('margin','0','important');
  target.style.setProperty('padding','0','important');
  target.style.setProperty('transform','none','important');
  target.style.setProperty('float','none','important');
  target.style.setProperty('clear','both','important');
  target.style.setProperty('box-sizing','border-box','important');
  target.style.setProperty('overflow-x','clip','important');
  const shadow=target.attachShadow({mode:'open'});
  const root=document.createElement('div');root.className='quest-root';shadow.append(root);
  const fix=(html)=>html.replace(/(src|href)=(['"])(?!https?:|data:|#|\/)([^'"]+)\2/g,(_,a,q,p)=>`${a}=${q}${new URL(p,base).href}${q}`);
  Promise.all(['content.html','style.css','game.js'].map(f=>fetch(new URL(f,base)).then(r=>{if(!r.ok)throw Error(f+': '+r.status);return r.text()})))
  .then(([markup,css,js])=>{
    const style=document.createElement('style');style.textContent=css+'\n:host{display:block!important;width:100%;} .quest-root{position:relative;min-height:100vh;}';shadow.prepend(style);
    root.innerHTML=fix(markup);
    // Local DOM proxy: original game logic queries its own isolated DOM.
    const localDoc={getElementById:(id)=>shadow.getElementById(id),querySelector:(sel)=>shadow.querySelector(sel),querySelectorAll:(sel)=>shadow.querySelectorAll(sel),createElement:(tag)=>document.createElement(tag),addEventListener:(...a)=>document.addEventListener(...a),removeEventListener:(...a)=>document.removeEventListener(...a),documentElement:document.documentElement,body:document.body};
    const onAttrs=[...shadow.querySelectorAll('[onclick]')].map(el=>[el,el.getAttribute('onclick')]);
    onAttrs.forEach(([el])=>el.removeAttribute('onclick'));
    try{
      // The original two scripts and inline handlers share one lexical scope.
      new Function('document','window','root','handlers',js+'\n;handlers.forEach(([el,code])=>el.addEventListener("click",function(event){return eval(code)}));')(localDoc,window,root,onAttrs);
    }catch(err){console.error('[100yen-quest] Game initialization:',err)}
    // Based on the proven spaceVisualNews approach: expand the in-flow
    // root to the current document viewport and compensate for its x-offset.
    // Do not move the node to body or create a fixed/absolute overlay.
    const unlock=()=>{
      let parent=target.parentElement, count=0;
      while(parent && parent!==document.body && count++<8){
        try{
          const computed=getComputedStyle(parent);
          if(['hidden','clip','auto','scroll'].includes(computed.overflowX)){
            parent.style.setProperty('overflow-x','visible','important');
            if(computed.overflowY==='hidden'||computed.overflowY==='clip')
              parent.style.setProperty('overflow-y','visible','important');
          }
        }catch(e){}
        parent=parent.parentElement;
      }
    };
    const align=()=>{
      let framed=false;
      try{framed=window.self!==window.top}catch(e){framed=true}
      // The reference space-tourism article deliberately uses 100% inside
      // an editor iframe to avoid escaping into the outer browser UI.
      if(framed){
        target.style.setProperty('width','100%','important');
        target.style.setProperty('max-width','100%','important');
        target.style.setProperty('left','0','important');
        return;
      }
      unlock();
      const vw=document.documentElement.clientWidth||window.innerWidth;
      if(!vw)return;
      target.style.setProperty('width',vw+'px','important');
      target.style.setProperty('max-width','none','important');
      target.style.setProperty('left','0','important');
      const x=target.getBoundingClientRect().left;
      if(Math.abs(x)>1 && Math.abs(x)<vw*.45){
        target.style.setProperty('left',(-x)+'px','important');
      }
    };
    align();
    requestAnimationFrame(align);
    setTimeout(align,90);
    setTimeout(align,360);
    window.addEventListener('resize',align,{passive:true});
    window.addEventListener('orientationchange',align,{passive:true});
    window.addEventListener('load',align,{once:true});
    if(document.fonts?.ready)document.fonts.ready.then(align);
    shadow.querySelectorAll('img').forEach(img=>img.addEventListener('load',align,{once:true}));
  }).catch(err=>{console.error('[100yen-quest] load:',err);root.innerHTML='<p style="padding:24px;font-family:sans-serif">게임을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>'});
})();
