import {escapeHTML as e,attributes as attrs,uid} from '../core.mjs';
import {button,iconButton} from '../button/render.mjs';
export function sheetContent({id=uid('sheet'),title='',bodyHTML='',action='닫기',actionAttributes={},headerAttributes={},bodyWrapped=true}={}) {
 return '<div class="og-sheet-header"><h2 id="'+e(id)+'-title" tabindex="-1"'+attrs(headerAttributes)+'>'+e(title)+'</h2>'+iconButton({label:'시트 닫기',name:'close',className:'og-sheet-close',attributes:{'data-sheet-close':true}})+'</div>'+(bodyWrapped?'<div class="og-sheet-body">'+bodyHTML+'</div>':bodyHTML)+'<div class="og-sheet-footer">'+button({label:action,attributes:actionAttributes})+'</div>';
}
export const bottomSheet=({size,...props}={})=>'<div class="og-sheet-panel"'+attrs({'data-size':size})+'>'+sheetContent(props)+'</div>';
