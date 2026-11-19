# 100엔 장보기 QUEST

GitHub Pages용 비주얼뉴스. `index.html`은 독립 페이지이며, `embed.js`는 iframe 없이 Shadow DOM으로 기사 본문에 삽입합니다.

기사 삽입 코드:

```html
<div id="yen100-quest"></div>
<script src="https://peunmi03kr.github.io/100yen-quest/embed.js"></script>
```

GitHub Settings → Pages → Deploy from a branch → main / (root).

주의: 기사 편집기에서 외부 스크립트가 허용되어야 합니다.
