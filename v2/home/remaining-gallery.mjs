import {escapeHTML as e} from '../../design-system/components/core.mjs';
import {setupMedia} from '../components/media.mjs';

export function remainingGallery({id,title,copy,states,screen,styles}){
 const example=([state,label])=>`<figure class="v2-home-search-example"><figcaption><h3>${e(label)}</h3></figcaption><div class="v2-home-search-host v2-home-${id}-host"><template data-${id}-template>${styles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}${screen({state})}</template></div></figure>`;
 return `<section id="${id}" data-review-screen hidden aria-labelledby="${id}-title"><h2 id="${id}-title">${e(title)}</h2><p class="v2-intro">${e(copy)}</p>${example(states[0])}${states.length>1?`<details class="v2-home-search-extra"><summary>다른 상태 비교 · ${states.length-1}개</summary><div class="v2-home-search-grid">${states.slice(1).map(example).join('')}</div></details>`:''}</section>`;
}
export function setupRemainingGallery(root,id){
 const section=root.querySelector('#'+id);if(!section)return;const extra=section.querySelector('details');
 const mount=hosts=>{for(const host of hosts){if(host.shadowRoot)continue;const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});shadow.append(template.content.cloneNode(true));template.remove();setupMedia(shadow);}};
 const activate=()=>{if(section.hidden)return;mount([section.querySelector('.v2-home-'+id+'-host')]);if(extra?.open)mount(extra.querySelectorAll('.v2-home-'+id+'-host'));};
 new MutationObserver(activate).observe(section,{attributes:true,attributeFilter:['hidden']});extra?.addEventListener('toggle',activate);activate();
}
