/* 100yen-quest | iframe-free Shadow DOM embed */
(()=>{
  const script=document.currentScript;
  const base=new URL('.',script.src).href;
  const target=document.getElementById('yen100-quest');
  if(!target){console.error('[100yen-quest] #yen100-quest not found');return;}
  if(target.dataset.yenMounted)return;
  target.dataset.yenMounted='1';
  target.style.cssText='display:block;width:100%;min-height:650px;position:relative;';
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
    // Full-bleed adjustment without modifying the article's global CSS.
    const bleed=()=>{const w=document.documentElement.clientWidth;const rect=target.getBoundingClientRect();target.style.width=w+'px';target.style.marginLeft=(-rect.left)+'px';};
    bleed();window.addEventListener('resize',bleed,{passive:true});
  }).catch(err=>{console.error('[100yen-quest] load:',err);root.innerHTML='<p style="padding:24px;font-family:sans-serif">게임을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>'});
})();
