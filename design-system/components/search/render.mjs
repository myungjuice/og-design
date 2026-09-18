import {escapeHTML as e,attributes as attrs,uid} from '../core.mjs';
import {button} from '../button/render.mjs';
const glass='<svg class="og-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>';
export function searchField({id=uid('search'),label='',value='',placeholder='매장명 또는 업종',hint='',className='',attributes={},submit=false,formId,helpId=id+'-help',clearId,submitId}={}) {
 const input='<div class="og-field-control">'+glass+'<input id="'+e(id)+'" type="search" value="'+e(value)+'" placeholder="'+e(placeholder)+'" aria-describedby="'+e(helpId)+'"'+attrs(attributes)+'>'+(submit?'<button type="button"'+attrs({id:clearId,hidden:!value})+' class="og-field-clear" aria-label="검색어 지우기">×</button>':'')+'</div>';
 return '<'+(submit?'form':'div')+' class="og-field og-search '+e(className)+'"'+(submit?attrs({id:formId,role:'search',novalidate:true}):'')+'><label for="'+e(id)+'">'+e(label)+'</label>'+(submit?'<div class="og-search-row">'+input+button({label:'검색',type:'submit',className:'og-search-submit',attributes:{id:submitId}})+'</div>':input)+'<p class="og-field-help" id="'+e(helpId)+'">'+e(hint)+'</p></'+(submit?'form':'div')+'>';
}
