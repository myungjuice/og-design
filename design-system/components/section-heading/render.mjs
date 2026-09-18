import {escapeHTML as e,attributes as attrs,uid} from '../core.mjs';
import {iconButton,textButton} from '../button/render.mjs';
export function sectionHeading({title='',description='',action='',infoButton=false,id,infoId,helpId,actionId,expanded=false}={}) {
 const resolvedInfo=infoId||uid('heading-info');
 return '<div class="og-section-heading"'+attrs({id})+'><div class="og-heading-copy"><div class="og-heading-title-line"><h3>'+e(title)+'</h3>'+(infoButton?iconButton({label:title+' 안내',info:true,expanded,className:'og-heading-info',attributes:{id:resolvedInfo,'aria-controls':helpId}}):'')+'</div>'+(description?'<p class="og-heading-description">'+e(description)+'</p>':'')+'</div>'+(action?textButton({label:action,className:'og-heading-action',attributes:{id:actionId}}):'')+'</div>';
}
