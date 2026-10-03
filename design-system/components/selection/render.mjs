import {escapeHTML as e,attributes as attrs,uid} from '../core.mjs';
export function choice({id=uid('choice'),label='',type='checkbox',checked=false,disabled=false,className='',name='',description='',descriptionId,controlHTML='',attributes={}}={}) {
 return '<label class="og-choice '+e(className)+'" for="'+e(id)+'"><input id="'+e(id)+'" type="'+e(type)+'"'+attrs({name:name||undefined,checked,disabled,...attributes})+'>'+controlHTML+'<span class="og-choice-copy">'+e(label)+(description?'<small'+attrs({id:descriptionId})+'>'+e(description)+'</small>':'')+'</span></label>';
}
export const checkbox = props => choice({...props,type:'checkbox'});
export const radio = props => choice({...props,type:'radio'});
export function toggle({id=uid('switch'),label='',checked=false,disabled=false,className='',description='',descriptionId,controlHTML='',attributes={}}={}) {
 return '<label class="og-choice og-switch '+e(className)+'" for="'+e(id)+'"><span class="og-choice-copy">'+e(label)+(description?'<small'+attrs({id:descriptionId})+'>'+e(description)+'</small>':'')+'</span><input id="'+e(id)+'" type="checkbox" role="switch"'+attrs({checked,disabled,...attributes})+'>'+controlHTML+'</label>';
}
