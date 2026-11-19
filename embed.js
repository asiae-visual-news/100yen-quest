
/* 100yen-quest | emergency native viewport fallback */
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

  frame.style.cssText =
    'display:block;width:100%;height:100vh;' +
    'height:100dvh;border:0;background:#0d1626;';

  target.style.cssText =
    'display:block;position:relative;width:100vw;' +
    'max-width:none;margin:0;padding:0;overflow:hidden;';

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

  function updateWidth() {
    target.style.left = '0px';
    const x = target.getBoundingClientRect().left;
    target.style.left = (-x) + 'px';
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

  window.addEventListener('resize', updateWidth);
  updateWidth();
})();
