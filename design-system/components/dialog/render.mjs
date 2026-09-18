import {escapeHTML as e} from '../core.mjs';
import {button} from '../button/render.mjs';
export function dialog({title='',body='',actions=[]}={}) {
 return '<div class="og-dialog-panel"><h3 class="og-dialog-title">'+e(title)+'</h3><p class="og-dialog-body">'+e(body)+'</p><div class="og-dialog-actions">'+actions.map(button).join('')+'</div></div>';
}
