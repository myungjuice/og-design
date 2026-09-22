import {escapeHTML as e,attributes as attrs,uid} from '../core.mjs';
export function textField({id=uid('field'),label='',labelHTML='',value='',placeholder='',hint='',attributes={},state='',className='',slot='',type='text',trailingHTML='',helpAttributes={}}={}) {
 return '<div class="og-field '+e(className)+'"'+attrs({'data-state':state||undefined})+'><label for="'+e(id)+'">'+(labelHTML||e(label))+'</label><div class="og-field-control"><input id="'+e(id)+'" type="'+e(type)+'" value="'+e(value)+'" placeholder="'+e(placeholder)+'" aria-describedby="'+e(id)+'-help"'+attrs(attributes)+'>'+(slot?'<span class="og-field-slot" aria-hidden="true">'+e(slot)+'</span>':'')+trailingHTML+'</div><p id="'+e(id)+'-help" class="og-field-help"'+attrs(helpAttributes)+'>'+e(hint)+'</p></div>';
}
export function textarea({id=uid('textarea'),label='',labelHTML='',value='',placeholder='',maxLength=200,hint,helpId=id+'-help',countId=id+'-count',attributes={},trailingHTML=''}={}) {
 const limited=maxLength!==null;
 return '<div class="og-field"><label for="'+e(id)+'">'+(labelHTML||e(label))+'</label><div class="og-field-control"><textarea id="'+e(id)+'"'+attrs({maxlength:limited?maxLength:undefined,'aria-describedby':helpId+(limited?' '+countId:''),placeholder,...attributes})+'>'+e(value)+'</textarea>'+trailingHTML+'</div><div class="og-field-footer"><p id="'+e(helpId)+'" class="og-field-help">'+e(hint===undefined?(limited?'최대 '+maxLength+'자':''):hint)+'</p>'+(limited?'<span id="'+e(countId)+'" class="og-field-count">'+String(value).length+' / '+e(maxLength)+'</span>':'')+'</div></div>';
}

export function passwordField({id=uid('password'),visible=false,toggleId=id+'-toggle',attributes={},...props}={}) {
 return textField({...props,id,type:visible?'text':'password',attributes:{class:'og-password-input',...attributes},trailingHTML:'<button type="button" class="og-password-toggle"'+attrs({id:toggleId,'aria-label':'비밀번호 '+(visible?'숨기기':'표시'),'aria-pressed':String(visible),'aria-controls':id})+'>'+(visible?'숨기기':'표시')+'</button>'});
}
