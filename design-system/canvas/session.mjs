import {resolveCanvas,canvasHref} from './catalog.mjs';
let last;try{last=localStorage.getItem('og-design:last-canvas');}catch{}
export const activeCanvas=resolveCanvas({search:location.search,hash:location.hash,last});
try{localStorage.setItem('og-design:last-canvas',activeCanvas);}catch{}
const url=new URL(location.href);url.searchParams.set('canvas',activeCanvas);history.replaceState(null,'',url);
export function navigateCanvas(id,target=''){location.assign(canvasHref(id,target));}

