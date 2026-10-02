// Code-native icons: one consistent stroke family, with dimensional nav variants.
const shapes={
 bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"/><path d="M10 21h4"/>',
 settings:'<path d="m10 2-.6 2.4-2.2 1.3-2.4-.6-2 3.4 1.8 1.8v2.6l-1.8 1.8 2 3.4 2.4-.6 2.2 1.3.6 2.4h4l.6-2.4 2.2-1.3 2.4.6 2-3.4-1.8-1.8v-2.6l1.8-1.8-2-3.4-2.4.6-2.2-1.3L14 2Z"/><circle cx="12" cy="11.4" r="3.1"/>',
 chevron:'<path d="m9 5 7 7-7 7"/>',
 pencil:'<path d="m4 16-1 5 5-1L20 8a2.8 2.8 0 0 0-4-4L4 16Z"/><path d="m14 6 4 4M4 16l4 4"/>',
 utensils:'<path d="M5 3v6c0 2 4 2 4 0V3M7 3v18M17 3c-4 3-4 9 0 9V3Zm0 9v9"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v.1"/>',
 scan:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M7 8v8m3-10v12m4-10v8m3-10v12"/>',
 home:'<path d="m2 11 10-9 10 9-3 1v9h-5v-6h-4v6H5v-9Z"/>',
 compass:'<circle cx="12" cy="12" r="9"/><path d="m16.5 7.5-2.7 6.3-6.3 2.7 2.7-6.3Z"/>',
 star:'<path d="m12 2 3.1 6.2 6.9 1-5 4.8 1.2 6.8L12 17.6l-6.2 3.2L7 14 2 9.2l6.9-1Z"/>',
};
export function icon(name,{size=24,dimensional=false}={}){
 const fill=dimensional&&['home','star'].includes(name)?'url(#'+name+'-face)':'none';
 const defs=dimensional?'<defs><linearGradient id="'+name+'-face" x1="0" y1="0" x2="1" y2="1"><stop stop-color="var(--icon-lit)"/><stop offset="1" stop-color="var(--icon-shade)"/></linearGradient></defs>':'';
 const bust=dimensional&&name==='user'?'<circle cx="12" cy="7" r="4.2" fill="url(#user-face)"/><path d="M3 21c.5-7 3.6-10 9-10s8.5 3 9 10Z" fill="url(#user-face)"/>':shapes[name];
 return '<svg class="ui-icon'+(dimensional?' nav-icon':'')+'" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="'+fill+'" stroke="'+(dimensional?'var(--icon-stroke)':'currentColor')+'" stroke-width="'+(dimensional?'1.5':'1.65')+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+defs+bust+'</svg>';
}
export function mileageCoin(){return '<svg class="m-coin" width="52" height="52" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="coin-edge" x2="1" y2="1"><stop stop-color="var(--coin-rim-light)"/><stop offset="1" stop-color="var(--coin-rim-dark)"/></linearGradient><linearGradient id="coin-face" x2="1" y2="1"><stop stop-color="var(--coin-face-light)"/><stop offset="1" stop-color="var(--coin-face-dark)"/></linearGradient></defs><circle cx="32" cy="33" r="29" fill="url(#coin-edge)"/><circle cx="31" cy="30" r="23" fill="url(#coin-face)"/><text x="31" y="42" text-anchor="middle" fill="var(--coin-letter)" font-size="34" font-weight="800">M</text></svg>'}
