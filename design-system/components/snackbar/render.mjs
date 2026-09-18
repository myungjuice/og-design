import {escapeHTML as e} from '../core.mjs';
export const snackbar=({message='',action=''}={})=>'<div class="og-snackbar"><p class="og-snackbar-message">'+e(message)+'</p>'+(action?'<button type="button" class="og-snackbar-action">'+e(action)+'</button>':'')+'</div>';
