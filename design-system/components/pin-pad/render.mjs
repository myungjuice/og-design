import {button} from '../button/render.mjs';
import {escapeHTML as e,icon} from '../core.mjs';
// Display-only PIN specimen. Never store or handle real credentials here.
export function pinPad({entered=0,lastDigit=''}={}){
 if(!Number.isInteger(entered)||entered<0||entered>6)throw new RangeError('PIN count must be 0–6');
 if(entered&& !/^[0-9]$/.test(lastDigit))throw new TypeError('One specimen digit required');
 const marks=entered?Array.from({length:entered-1},()=>'<span class="og-pin-dot" aria-hidden="true"></span>').join('')+'<span aria-hidden="true">'+e(lastDigit)+'</span>':'';
 const keys=['1','2','3','4','5','6','7','8','9','clear','0','backspace'];
 return '<div class="og-pin-pad"><div class="og-pin-display" role="img" aria-label="'+entered+'자리 입력됨">'+marks+'</div><div class="og-pin-keys">'+keys.map(key=>button({label:key,variant:'secondary',className:'og-pin-key',iconHTML:key==='clear'?icon('close'):key==='backspace'?icon('backspace'):'',attributes:{'data-pin-key':key,'aria-label':key==='clear'?'전체 지우기':key==='backspace'?'한 자리 지우기':key}})).join('')+'</div></div>';
}
