/* 100yen-quest | full bleed + single article scroll */
(() => {
  const script = document.currentScript;
  const target = document.getElementById('yen100-quest');
  if (!script || !target || target.dataset.loaded) return;
  target.dataset.loaded = '1';
  const src = new URL('index.html', script.src);
  const origin = src.origin;
  const frame = document.createElement('iframe');
  frame.src = src.href;
  frame.title = '100엔 장보기 비주얼뉴스';
  frame.loading = 'eager';
  frame.setAttribute('allow', 'fullscreen');
  frame.setAttribute('scrolling', 'no');
  frame.style.cssText = 'display:block;position:sticky;top:0;width:100%;height:100vh;height:100dvh;border:0;background:#0d1626;';
  target.style.cssText = 'display:block!important;position:relative!important;box-sizing:border-box!important;width:100vw!important;max-width:none!important;min-width:0!important;margin:0!important;padding:0!important;float:none!important;clear:both!important;overflow:visible!important;';
  target.appendChild(frame);
  let contentHeight = 0;
  let scheduled = false;
  const viewport = () => document.documentElement.clientHeight || window.innerHeight;
  function unlockParents() {
    let p = target.parentElement, n = 0;
    while (p && p !== document.body && n++ < 15) {
      const s = getComputedStyle(p);
      if (['hidden','clip'].includes(s.overflowX) || ['hidden','clip'].includes(s.overflow)) {
        p.style.setProperty('overflow-x', 'visible', 'important');
        if (['hidden','clip'].includes(s.overflowY)) p.style.setProperty('overflow-y', 'visible', 'important');
      }
      p = p.parentElement;
    }
  }
  function align() {
    unlockParents();
    const width = document.documentElement.clientWidth || window.innerWidth;
    target.style.setProperty('left', '0px', 'important');
    target.style.setProperty('width', width + 'px', 'important');
    const x = target.getBoundingClientRect().left;
    if (Math.abs(x) > .5) target.style.setProperty('left', -x + 'px', 'important');
    if (contentHeight) target.style.setProperty('height', Math.max(contentHeight,viewport()) + 'px', 'important');
    sync();
  }
  function sync() {
    if (!frame.contentWindow) return;
    const top = target.getBoundingClientRect().top;
    const max = Math.max(0, contentHeight - viewport());
    const y = Math.min(max, Math.max(0, -top));
    frame.contentWindow.postMessage({type:'yen100-set-scroll', y, viewportHeight:viewport()}, origin);
  }
  function queueSync() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; sync(); });
  }
  window.addEventListener('message', (event) => {
    if (event.source !== frame.contentWindow || event.origin !== origin) return;
    const d = event.data || {};
    if (d.type === 'yen100-height') {
      const h = Number(d.height);
      if (!Number.isFinite(h) || h < 1) return;
      contentHeight = Math.min(h, 200000);
      target.style.setProperty('height', Math.max(contentHeight,viewport()) + 'px', 'important');
      queueSync();
    } else if (d.type === 'yen100-wheel') {
      const delta = Number(d.deltaY);
      if (Number.isFinite(delta)) window.scrollBy(0, Math.max(-1500, Math.min(1500, delta)));
    }
  });
  frame.addEventListener('load', () => {
    frame.contentWindow.postMessage({type:'yen100-request-height'}, origin);
    align();
  });
  window.addEventListener('scroll', queueSync, {passive:true});
  window.addEventListener('resize', align, {passive:true});
  window.addEventListener('orientationchange', align, {passive:true});
  align();
  requestAnimationFrame(align);
  setTimeout(align, 300);
  setTimeout(align, 1000);
})();
