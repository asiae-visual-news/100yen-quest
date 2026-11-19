
/* 100yen-quest | Full-bleed embed */
(() => {
  const script = document.currentScript;
  const target = document.getElementById('yen100-quest');

  if (!script || !target || target.dataset.loaded) return;
  target.dataset.loaded = '1';

  const frame = document.createElement('iframe');
  frame.src = new URL('index.html', script.src).href;
  frame.title = '100엔 장보기 비주얼뉴스';
  frame.loading = 'eager';
  frame.setAttribute('allow', 'fullscreen');
  frame.style.cssText = `
    display:block;
    width:100%;
    height:100%;
    border:0;
    background:#0d1626;
  `;

  target.style.cssText = `
    display:block!important;
    position:relative!important;
    box-sizing:border-box!important;
    max-width:none!important;
    min-width:0!important;
    width:100vw!important;
    height:100vh!important;
    min-height:600px!important;
    margin:0!important;
    padding:0!important;
    float:none!important;
    clear:both!important;
    overflow:hidden!important;
  `;

  target.appendChild(frame);

  // Remove clipping from article containers.
  function unlockParents() {
    let parent = target.parentElement;
    let count = 0;

    while (parent && parent !== document.body && count++ < 15) {
      const style = getComputedStyle(parent);

      if (
        ['hidden', 'clip'].includes(style.overflowX) ||
        ['hidden', 'clip'].includes(style.overflow)
      ) {
        parent.style.setProperty(
          'overflow-x', 'visible', 'important'
        );

        if (['hidden', 'clip'].includes(style.overflowY)) {
          parent.style.setProperty(
            'overflow-y', 'visible', 'important'
          );
        }
      }

      parent = parent.parentElement;
    }
  }

  // Align to the viewport, not the article column.
  function alignFullBleed() {
    const vw = document.documentElement.clientWidth
      || window.innerWidth;

    if (!vw) return;

    unlockParents();

    target.style.setProperty(
      'width', vw + 'px', 'important'
    );
    target.style.setProperty(
      'max-width', 'none', 'important'
    );
    target.style.setProperty(
      'left', '0px', 'important'
    );

    const x = target.getBoundingClientRect().left;

    if (Math.abs(x) > 0.5) {
      target.style.setProperty(
        'left', (-x) + 'px', 'important'
      );
    }
  }

  alignFullBleed();
  requestAnimationFrame(alignFullBleed);
  setTimeout(alignFullBleed, 150);
  setTimeout(alignFullBleed, 600);

  window.addEventListener('resize', alignFullBleed);
  window.addEventListener('orientationchange', alignFullBleed);

// Let the article continue scrolling when the iframe
// reaches its first or last scene.
window.addEventListener('message', (event) => {
  if (event.source !== frame.contentWindow) return;
  if (event.origin !== new URL(frame.src).origin) return;

  const data = event.data;
  if (!data || data.type !== 'yen100-scroll-edge') return;

  window.scrollBy({
    top: Number(data.deltaY) || 0,
    left: 0,
    behavior: 'instant'
  });
});
})();
