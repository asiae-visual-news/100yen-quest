
/* 100yen-quest | Full-width HTML embed */
(() => {
  const script = document.currentScript;
  const target = document.getElementById('yen100-quest');

  if (!script || !target || target.dataset.loaded) return;
  target.dataset.loaded = '1';

  const url = new URL('index.html', script.src).href;

  const frame = document.createElement('iframe');
  frame.src = url;
  frame.title = '100엔 장보기 비주얼뉴스';
  frame.loading = 'eager';
  frame.style.cssText = `
    display:block;
    width:100%;
    height:100%;
    border:0;
    background:#0d1626;
  `;

  target.appendChild(frame);

  target.style.cssText = `
    display:block!important;
    position:relative!important;
    width:100%!important;
    max-width:none!important;
    height:100vh!important;
    min-height:600px!important;
    margin:0!important;
    padding:0!important;
    overflow:hidden!important;
  `;

  function align() {
    const width = document.documentElement.clientWidth;
    target.style.setProperty('width', width + 'px', 'important');
    target.style.setProperty('left', '0px', 'important');

    const x = target.getBoundingClientRect().left;
    target.style.setProperty('left', -x + 'px', 'important');
  }

  align();
  requestAnimationFrame(align);
  window.addEventListener('resize', align);
})();
