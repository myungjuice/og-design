import {escapeHTML as e,attributes as attrs,uid} from '../core.mjs';
export function tabs({id=uid('tabs'),label='내용 선택',items=[],selected=0,className=''}={}) {
 return '<div class="og-tabs'+(className?' '+e(className):'')+'" role="tablist" aria-label="'+e(label)+'">'+items.map((item,i)=>{
 const data=typeof item==='string'?{label:item}:item;
 return '<button type="button" role="tab" id="'+e(id)+'-tab-'+i+'" aria-controls="'+e(id)+'-panel-'+i+'" aria-selected="'+(i===selected)+'" tabindex="'+(i===selected?0:-1)+'"'+attrs({disabled:data.disabled,class:data.className,...data.attributes})+'>'+e(data.label)+'</button>';
 }).join('')+'</div>';
}
export const tabPanel=({id,index=0,selected=0,contentHTML='',className=''}={})=>'<div id="'+e(id)+'-panel-'+index+'" class="og-tab-panel'+(className?' '+e(className):'')+'" role="tabpanel" aria-labelledby="'+e(id)+'-tab-'+index+'" tabindex="0"'+attrs({hidden:index!==selected})+'>'+contentHTML+'</div>';
export const chip=({label='',selected=false,disabled=false,className='',attributes={}}={})=>'<button type="button" class="og-chip'+(className?' '+e(className):'')+'"'+attrs({'aria-pressed':String(selected),disabled,...attributes})+'>'+e(label)+'</button>';
export const radioChip=({id=uid('chip'),label='',name,checked=false}={})=>'<label class="og-chip-radio"><input id="'+e(id)+'" type="radio"'+attrs({name,checked})+'><span>'+e(label)+'</span></label>';
export function segment({id=uid('segment'),name=id,labelledBy,items=[],selected=0}={}) {
 return '<div class="og-segment" role="radiogroup"'+attrs({'aria-labelledby':labelledBy})+'>'+items.map((item,i)=>'<label><input'+attrs({id:item.id||id+'-'+i,type:'radio',name,checked:i===selected})+'><span>'+e(item.label)+'</span></label>').join('')+'</div>';
}
