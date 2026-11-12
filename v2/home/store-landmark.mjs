import {renderHomeStoreScreen} from './store.mjs';
import {renderBadge} from '../components/badges.mjs';
import {setupMedia} from '../components/media.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';

const variants = [
  {id: 'logo', title: 'A안 · 로고 배지형', copy: '같은 로고 위치에 왕관을 얹었습니다.'},
  {id: 'name', title: 'B안 · BEST 네온 라벨', copy: '매장명·업종 옆에 왕관과 BEST를 표시합니다.'}
];
const styles = [
  '/v2/components/icon-button.css',
  '/v2/components/media.css',
  '/v2/components/badges.css',
  '/v2/home/store.css',
  '/v2/home/store-landmark.css'
];
const crown = '<img class="sl-crown" src="/assets/review-20261029/neon-crown-gold.svg" width="24" height="22" alt="" aria-hidden="true">';

function label({compact = false} = {}) {
  if (compact) {
    return '<span class="sl-label">' + renderBadge({label: '랜드마크', tone: 'warning', size: 'compact'}) + '</span>';
  }
  const bestCrown = '<svg class="sl-best-crown" viewBox="0 0 24 22" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 16-1-11 5.5 5L12 2l4.5 8L22 5l-1 11H3Z"/><path d="M3 20h18"/></svg>';
  const badge = renderBadge({label: 'BEST', tone: 'warning', size: 'small'});
  return '<span class="sl-label sl-best-label" data-store-best-label="neon">' + badge.replace('>BEST', '>' + bestCrown + '<span class="sl-best-word">BEST</span>') + '</span>';
}

export function renderStoreLandmarkScreen({state = 'name'} = {}) {
  if (!variants.some(variant => variant.id === state)) throw new RangeError('Unsupported landmark label variant');
  const html = renderHomeStoreScreen().replace('class="v2-home-store-frame"', 'class="v2-home-store-frame sl-store-screen" data-store-landmark="' + state + '"');
  if (state === 'logo') {
    return html
      .replace('<div class="v2-store-logo">', '<div class="sl-logo-group">' + crown + '<div class="v2-store-logo">')
      .replace('</div><div class="og-store-identity-copy">', '</div>' + label({compact: true}) + '</div><div class="og-store-identity-copy">');
  }
  return html.replace(/(<div class="og-store-name">[\s\S]*?)(<\/div>)/, (_, content, end) => content + label() + end);
}

export function renderStoreLandmarkReview() {
  const examples = variants.map(variant => `
    <figure class="sl-example">
      <figcaption><h3>${e(variant.title)}</h3><p>${e(variant.copy)}</p></figcaption>
      <div class="sl-host" data-store-landmark-preview="${variant.id}">
        <template>${styles.map(href => `<link rel="stylesheet" href="${href}">`).join('')}${renderStoreLandmarkScreen({state: variant.id})}</template>
      </div>
    </figure>`).join('');
  return `<link rel="stylesheet" href="/v2/home/store-landmark.css">
    <section id="store-landmark" data-review-screen data-review-status="pending" hidden aria-labelledby="store-landmark-title">
      <h2 id="store-landmark-title">매장 상세 · BEST 라벨</h2>
      <p class="v2-intro">선택한 B안에 왕관과 BEST 네온 라벨을 적용했습니다. 작은 크기의 글자와 빛 번짐을 함께 확인합니다.</p>
      <div class="sl-comparison">${examples}</div>
      <div class="sl-label-inspection">
        <figure class="sl-best-preview"><figcaption>실제 표시 크기</figcaption><div class="sl-best-sample" data-best-label-preview="actual">${label()}</div></figure>
        <figure class="sl-best-preview"><figcaption>라벨 확대</figcaption><div class="sl-best-sample sl-best-enlarged" data-best-label-preview="enlarged">${label()}</div></figure>
      </div>
    </section>`;
}

export function setupStoreLandmarkReview(root) {
  for (const host of root.querySelectorAll('[data-store-landmark-preview]')) {
    if (host.shadowRoot) continue;
    const template = host.querySelector('template');
    const shadow = host.attachShadow({mode: 'open'});
    shadow.append(template.content.cloneNode(true));
    template.remove();
    setupMedia(shadow);
    const screen = shadow.querySelector('.sl-store-screen');
    const resize = () => {
      const scale = Math.min(1, host.clientWidth / 390);
      screen.style.zoom = scale;
      host.style.height = Math.ceil(screen.offsetHeight * scale) + 'px';
    };
    new ResizeObserver(resize).observe(host);
    resize();
  }
}
