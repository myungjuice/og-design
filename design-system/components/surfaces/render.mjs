import {escapeHTML as e,attributes as attrs} from '../core.mjs';
export const surface=({contentHTML='',depth,className='',attributes={}}={})=>'<div class="og-surface'+(className?' '+e(className):'')+'"'+attrs({'data-depth':depth,...attributes})+'>'+contentHTML+'</div>';
export const divider=({inset=false,vertical=false}={})=>vertical?'<span class="og-divider" role="separator" aria-orientation="vertical"></span>':'<hr class="og-divider"'+attrs({'data-inset':inset?'true':undefined})+'>';
export const menuTile=({label='',iconHTML='',className='',attributes={}}={})=>'<button type="button" class="og-menu-tile'+(className?' '+e(className):'')+'"'+attrs(attributes)+'>'+iconHTML+'<span>'+e(label)+'</span></button>';
