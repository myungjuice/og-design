import {escapeHTML as e,attributes as attrs,uid} from '../core.mjs';
import {iconButton} from '../button/render.mjs';
export const tooltip=({id=uid('tooltip'),message=''}={})=>'<div class="og-tooltip" id="'+e(id)+'" role="tooltip">'+e(message)+'</div>';
export function popover({id=uid('popover'),title='',body='',closeId,attributes={}}={}) {
 return '<div class="og-popover" id="'+e(id)+'" role="dialog" aria-labelledby="'+e(id)+'-title" aria-describedby="'+e(id)+'-copy"'+attrs(attributes)+'><div class="og-popover-header"><h3 id="'+e(id)+'-title">'+e(title)+'</h3>'+iconButton({label:'안내 닫기',name:'close',className:'og-help-close',attributes:{id:closeId,'data-help-close':true}})+'</div><p id="'+e(id)+'-copy">'+e(body)+'</p></div>';
}
