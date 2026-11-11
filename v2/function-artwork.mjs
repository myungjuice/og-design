import {escapeHTML as e} from '../design-system/components/core.mjs';

const base = '/assets/received-icons-20261105/functions/';
const files = {
  mileage: 'L31_마일리지.svg', notification: 'L13_알림_A_nav바.svg',
  settings: 'L14_설정.svg', edit: 'L15_내정보수정.svg',
  'verified-on': 'L10_본인인증_ON.svg', 'verified-off': 'L10_본인인증_OFF.svg',
  'favorite-on': 'L17_좋아요_ON.svg', 'favorite-off': 'L17_좋아요_OFF.svg',
  address: 'L18_주소.svg', hours: 'L19_영업시간.svg', phone: 'L20_매장전화번호.svg',
  website: 'L21_매장사이트.svg', 'temporary-holiday': 'L25_임시휴무.svg',
  'regular-holiday': 'L26_정기휴무.svg', closed: 'L27_영업종료.svg',
  instagram: 'L28_인스타그램.svg', facebook: 'L29_페이스북.svg', kakao: 'L30_카카오톡.svg',
  history: 'S15_이용내역.svg', notices: 'L13_알림_B_공지알림.svg',
  membership: 'S16_멤버십.svg', support: 'S17_문의하기.svg', account: 'S18_내정보.svg'
};
export function functionArtworkURL(kind) {
  if (!Object.hasOwn(files, kind)) throw new RangeError('Unsupported function artwork: ' + kind);
  return base + encodeURIComponent(files[kind]);
}
export function functionArtwork(kind, size = 20, className = 'received-icon') {
  return `<img class="${e(className)} received-function-icon" data-received-function="${e(kind)}" src="${functionArtworkURL(kind)}" width="${size}" height="${size}" alt="" aria-hidden="true" decoding="async">`;
}
export function favoriteArtwork() {
  return '<span class="received-favorite-art" aria-hidden="true">' +
    functionArtwork('favorite-off', 20) + functionArtwork('favorite-on', 20) + '</span>';
}

const imageKinds = {
  'header-bell.svg': 'notification', 'header-settings.svg': 'settings',
  'review-pencil.svg': 'edit', 'profile-chevron.svg': 'edit', 'mileage-m.png': 'mileage',
  'contact_address.png': 'address', 'contact_phone.png': 'phone', 'contact_homepage.png': 'website',
  'contact_instagram.png': 'instagram', 'contact_facebook.png': 'facebook', 'contact_kakao.png': 'kakao'
};
const menuKinds = {receipt: 'history', bell: 'notices', membership: 'membership', support: 'support', settings: 'settings', account: 'account'};
const sourceKinds = {
  notifications_none: 'notification', settings: 'settings', edit: 'edit', edit_note: 'edit',
  rate_review: 'edit', call: 'phone', location_on: 'address', receipt_long: 'history',
  campaign: 'notices', question_answer: 'support', support_agent: 'support', manage_accounts: 'account'
};

// Apply at the current v2 boundary, including source-gallery and character previews.
export function applyFunctionIcons(source) {
  let html = source.replace(/<img\b[^>]*src="([^"]+)"[^>]*>/g, (tag, src) => {
    const kind = imageKinds[src.split('/').at(-1)];
    return kind ? tag.replace(src, functionArtworkURL(kind)).replace('<img ', `<img data-received-function="${kind}" `) : tag;
  });
  html = html.replace(/<span class="service-face"><span class="service-art" data-art="([^"]+)"[^>]*>[\s\S]*?<\/span><\/span>/g,
    (original, name) => menuKinds[name] ? '<span class="service-face">' + functionArtwork(menuKinds[name], 40) + '</span>' : original);
  html = html.replace(/<svg\b[^>]*data-source-icon="([^"]+)"[^>]*>[\s\S]*?<\/svg>|<span class="material-icons"[^>]*>([^<]+)<\/span>/g,
    (original, svgName, materialName) => sourceKinds[svgName || materialName] ? functionArtwork(sourceKinds[svgName || materialName]) : original);
  html = html.replace(/(<span class="og-account-status([^\"]*)">)(?:<svg\b[^>]*>[\s\S]*?<\/svg>|<span class="material-icons"[^>]*>[^<]*<\/span>)/g,
    (_, opening, classes) => opening + functionArtwork(classes.includes('is-checked') ? 'verified-on' : 'verified-off'));
  html = html.replace(/<button\b[^>]*class="[^"]*\bog-favorite\b[^"]*"[^>]*>[\s\S]*?<\/button>/g,
    button => button.includes('received-favorite-art') ? button : button.replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/, favoriteArtwork()));
  return html;
}
