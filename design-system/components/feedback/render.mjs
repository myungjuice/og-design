import {escapeHTML as e,icon,attributes as attrs} from '../core.mjs';
import {button} from '../button/render.mjs';
export function feedback({symbol='info_outline',title='',body='',action,state,busy=false,ids={}}={}) {
 return '<div class="og-feedback"'+attrs({id:ids.root,'data-state':state,'aria-busy':String(busy)})+'><span class="og-feedback-icon"'+attrs({id:ids.icon})+'>'+icon(symbol)+'</span><h3'+attrs({id:ids.title,tabindex:ids.title?'-1':undefined})+'>'+e(title)+'</h3><p'+attrs({id:ids.body})+'>'+e(body)+'</p>'+(action?button({...action,attributes:{id:ids.action,...action.attributes}}):'')+'</div>';
}
export const notice=({tone='info',symbol='info',title='',body=''}={})=>'<div class="og-notice" data-tone="'+e(tone)+'">'+icon(symbol)+'<div><strong>'+e(title)+'</strong><p>'+e(body)+'</p></div></div>';
