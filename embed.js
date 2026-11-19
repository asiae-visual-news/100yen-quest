
/* 100yen-quest | native iframe + fullbleed correction | v14 */
(() => {
  const script = document.currentScript;
  const target = document.getElementById('yen100-quest');
  if (!script || !target || target.dataset.loaded) return;
  target.dataset.loaded = '1';

  const url = new URL('index.html', script.src);
  const frame = document.createElement('iframe');

  frame.src = url.href;
  frame.title = '100엔 장보기 비주얼뉴스';
  frame.loading = 'eager';
  frame.setAttribute('allow', 'fullscreen');
  frame.setAttribute('scrolling', 'no');

  frame.style.cssText =
    'display:block!important;' +
    'width:100%!important;' +
    'max-width:none!important;' +
    'height:100vh!important;' +
    'height:100dvh!important;' +
    'border:0!important;' +
    'background:#0d1626;';

  target.style.cssText =
    'display:block!important;' +
    'position:relative!important;' +
    'box-sizing:border-box!important;' +
    'width:100vw!important;' +
    'max-width:none!important;' +
    'margin:0!important;' +
    'padding:0!important;' +
    'overflow:visible!important;' +
    'float:none!important;' +
    'clear:both!important;';

  target.appendChild(frame);

  let y = 0;
  let max = 0;

  const send = () => {
    frame.contentWindow?.postMessage(
      {
        type: 'yen100-set-scroll',
        y,
        viewportHeight: frame.clientHeight
      },
      url.origin
    );
  };

  function align() {
    let p = target.parentElement;

    for (
      let n = 0;
      p && p !== document.body && n < 15;
      n++, p = p.parentElement
    ) {
      const s = getComputedStyle(p);

      if (['hidden', 'clip'].includes(s.overflowX)) {
        p.style.setProperty(
          'overflow-x',
          'visible',
          'important'
        );
      }
    }

    target.style.setProperty(
      'left', '0px', 'important'
    );

    target.style.setProperty(
      'width',
      document.documentElement.clientWidth + 'px',
      'important'
    );

    const x = target.getBoundingClientRect().left;

    target.style.setProperty(
      'left',
      (-x) + 'px',
      'important'
    );

    frame.style.setProperty(
      'width', '100%', 'important'
    );
  }

  window.addEventListener('message', e => {
    if (
      e.source !== frame.contentWindow ||
      e.origin !== url.origin
    ) return;

    const d = e.data || {};

    if (d.type === 'yen100-height') {
      max = Math.max(
        0,
        Number(d.height || 0) - frame.clientHeight
      );

      send();

    } else if (d.type === 'yen100-wheel') {
      const delta = Math.max(
        -700,
        Math.min(700, Number(d.deltaY) || 0)
      );

      const next = Math.max(
        0,
        Math.min(max, y + delta)
      );

      const overflow = delta - (next - y);

      y = next;
      send();

      if (overflow) {
        window.scrollBy(0, overflow);
      }
    }
  });

  frame.addEventListener('load', () => {
    frame.contentWindow?.postMessage(
      { type: 'yen100-request-height' },
      url.origin
    );

    send();
  });

  window.addEventListener(
    'resize',
    align,
    { passive: true }
  );

  align();
  requestAnimationFrame(align);
  setTimeout(align, 300);
})();
