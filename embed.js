/* 100yen-quest | iframe-free Shadow DOM embed */
(()=>{
  const script=document.currentScript;
  const base=new URL('.',script.src).href;
  const target=document.getElementById('yen100-quest');
  if(!target){console.error('[100yen-quest] #yen100-quest not found');return;}
  if(target.dataset.yenMounted)return;
  target.dataset.yenMounted='1';
  // Keep the insertion point as a height placeholder in the article.
  // Mount the actual visual under <body> to escape narrow/overflow-hidden article wrappers.
  const inEditor=!!target.closest('[contenteditable="true"],.cke_editable,.fr-element,.note-editable');
  const placeholder=document.createElement('div');
  placeholder.setAttribute('aria-hidden','true');
  placeholder.style.cssText='display:block;width:100%;height:760px;pointer-events:none;';
  target.parentNode.insertBefore(placeholder,target);
  if(!inEditor)document.body.appendChild(target);
  target.style.cssText=inEditor
    ? 'display:block;width:100%;min-height:650px;position:relative;max-width:none;'
    : 'display:block;position:absolute;left:0;top:0;width:100vw;max-width:none;margin:0;z-index:1;';;
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
    // Position the body-level visual exactly where the article placeholder is.
    // Unlike margin-left based bleed, this does not oscillate or clip at article boundaries.
    const align=()=>{
      const height=Math.max(root.getBoundingClientRect().height,root.scrollHeight,650);
      placeholder.style.height=Math.ceil(height)+'px';
      if(inEditor)return;
      const bodyRect=document.body.getBoundingClientRect();
      const slotRect=placeholder.getBoundingClientRect();
      target.style.left=(-bodyRect.left)+'px';
      target.style.top=(slotRect.top-bodyRect.top)+'px';
      target.style.width=document.documentElement.clientWidth+'px';
    };
    align();
    window.addEventListener('resize',align,{passive:true});
    if(window.ResizeObserver)new ResizeObserver(align).observe(root);
    // Font/image layout may settle after initial paint.
    shadow.querySelectorAll('img').forEach(img=>img.addEventListener('load',align,{once:true}));
  }).catch(err=>{console.error('[100yen-quest] load:',err);root.innerHTML='<p style="padding:24px;font-family:sans-serif">게임을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>'});
})();
