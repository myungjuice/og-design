// Canvas sample art resolves the existing palette. Never read another board's DOM.
export function storeImage() {
 const styles=getComputedStyle(document.documentElement),color=t=>styles.getPropertyValue(t).trim();
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240"><rect width="320" height="240" fill="${color('--primary01')}"/><g transform="translate(112 72) scale(4)" fill="none" stroke="${color('--app-action')}" stroke-width="1.4" stroke-linejoin="round"><path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10q2 4 4 0 2 4 5 0 3 4 5 0 2 4 4 0M9 20v-6h6v6"/></g></svg>`;
 const src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
 return src;
}
