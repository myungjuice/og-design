import {escapeHTML as e} from '../core.mjs';
import {button} from '../button/render.mjs';
export function dialog({title='',body='',bodyHTML,actions=[]}={}) {
 return '<div class="og-dialog-panel"><h3 class="og-dialog-title">'+e(title)+'</h3>'+(bodyHTML===undefined?'<p class="og-dialog-body">'+e(body)+'</p>':bodyHTML)+'<div class="og-dialog-actions">'+actions.map(button).join('')+'</div></div>';
}
