import {escapeHTML as e,attributes as attrs,icon} from '../core.mjs';
const close = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>';
export function button({label='',type='button',variant='primary',size,state,className='',disabled=false,busy=false,iconHTML='',attributes={}}={}) {
 return '<button type="'+e(type)+'" class="og-button'+(className?' '+e(className):'')+'" data-variant="'+e(variant)+'"'+attrs({'data-size':size,'data-state':state,disabled,'aria-busy':busy?'true':undefined,...attributes})+'>'+ (iconHTML || (variant==='icon'?close:e(label)))+'</button>';
}
export function iconButton({label, name='info_outline',info=false,expanded,className='',attributes={}}={}) {
 return '<button type="button" class="og-icon-button'+(info?' og-info-button':'')+(className?' '+e(className):'')+'"'+attrs({'aria-label':label,'aria-expanded':expanded===undefined?undefined:String(expanded),...attributes})+'>'+icon(name)+'</button>';
}
export function textButton({label='',className='',disabled=false,attributes={}}={}) {
 return '<button type="button" class="og-text-button'+(className?' '+e(className):'')+'"'+attrs({disabled,...attributes})+'>'+e(label)+'</button>';
}
export function favorite({selected=false,label='즐겨찾기',...props}={}) {
 return button({...props,label,variant:'icon',className:'og-favorite',iconHTML:heart,attributes:{'aria-pressed':String(selected),'aria-label':label,...props.attributes}});
}
