import {escapeHTML as e,attributes as attrs} from '../core.mjs';
const arrow='<svg class="og-row-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';
export function listRow({title='',description='',leading='',iconHTML='',value='',interactive=true,attributes={},className=''}={}) {
 return '<'+(interactive?'button type="button"':'div')+' class="og-list-row '+e(className)+'"'+attrs(attributes)+'>'+(leading?'<span class="og-row-'+e(leading)+'" aria-hidden="true">'+iconHTML+'</span>':'')+'<span class="og-row-copy"><span class="og-row-title">'+e(title)+'</span>'+(description?'<span class="og-row-description">'+e(description)+'</span>':'')+'</span>'+(value?'<span class="og-row-value">'+e(value)+'</span>':'')+(interactive?arrow:'')+'</'+(interactive?'button':'div')+'>';
}
