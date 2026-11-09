import {renderHomeStoreScreen} from './store.mjs';
import {renderBadge} from '../components/badges.mjs';
import {setupMedia} from '../components/media.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';

const variants = [
  {id: 'logo', title: 'A안 · 로고 배지형', copy: '로고 위 왕관과 아래 라벨을 하나로 묶었습니다.'},
  {id: 'name', title: 'B안 · 매장명 옆 라벨형', copy: '매장명을 읽을 때 랜드마크 여부를 함께 확인합니다.'},
  {id: 'above', title: 'C안 · 매장명 위 라벨형', copy: '매장명 위에 별도 줄을 두어 라벨을 강조합니다.'}
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
  const badge = renderBadge({label: '랜드마크', tone: 'warning', size: compact ? 'compact' : 'small'});
  return '<span class="sl-label">' + (compact ? badge : badge.replace('>랜드마크', '>' + crown + '랜드마크')) + '</span>';
}

export function renderStoreLandmarkScreen({state = 'name'} = {}) {
  if (!variants.some(variant => variant.id === state)) throw new RangeError('Unsupported landmark label variant');
  const html = renderHomeStoreScreen().replace('class="v2-home-store-frame"', 'class="v2-home-store-frame sl-store-screen" data-store-landmark="' + state + '"');
  if (state === 'logo') {
    return html
      .replace('<div class="v2-store-logo">', '<div class="sl-logo-group">' + crown + '<div class="v2-store-logo">')
      .replace('</div><div class="og-store-identity-copy">', '</div>' + label({compact: true}) + '</div><div class="og-store-identity-copy">');
  }
  if (state === 'name') return html.replace('</h4>', '</h4>' + label());
  return html.replace('<div class="og-store-name">', label() + '<div class="og-store-name">');
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
      <h2 id="store-landmark-title">매장 상세 · 랜드마크 라벨 비교</h2>
      <p class="v2-intro">랜드마크 지정 매장의 표시 예시입니다. 같은 매장 정보로 세 가지 위치를 비교합니다. 라벨 문구와 배치는 검토용 제안입니다.</p>
      <div class="sl-comparison">${examples}</div>
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
