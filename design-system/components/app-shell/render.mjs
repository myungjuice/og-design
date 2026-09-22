import {escapeHTML as e,icon} from '../core.mjs';
import {iconButton} from '../button/render.mjs';
export function appBar({title='',notification=false,back=false,refresh=false,trailingHTML=''}={}) {
 return '<header class="og-app-bar">'+(back?iconButton({label:'뒤로가기',name:'arrow_back'}):'<span class="og-app-bar-spacer"></span>')+'<h2>'+e(title)+'</h2>'+(trailingHTML|| (refresh?iconButton({label:'새로고침',name:'refresh'}):notification?iconButton({label:'내 알림',name:'notifications_none',className:'og-app-notification'}):'<span class="og-app-bar-spacer"></span>'))+'</header>';
}
export function bottomNavigation({active='내 정보'}={}) {
 const items=[['홈','home'],['마이랜드','local_activity'],['바코드','qr_code_scanner'],['오지파크','park'],['내 정보','person']];
 return '<nav class="og-app-bottom-nav" aria-label="하단 메뉴">'+items.map(([label,name])=>'<button type="button"'+(label===active?' aria-current="page"':'')+(label==='바코드'?' class="og-app-barcode"':'')+'>'+icon(name)+'<span>'+e(label)+'</span></button>').join('')+'</nav>';
}
