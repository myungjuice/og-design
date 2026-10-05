import {escapeHTML as e} from '../../design-system/components/core.mjs';
import {renderMyInfoTest} from '../../screens/my-info-3d-test/render.mjs';
import {renderAvatar,renderThumbnail,setupMedia} from '../components/media.mjs';

// Authored local specimens only, not HTML returned by a service.
export function extractSourceScreens(boardHTML,rootClass){
 const screens=[],tags=[...boardHTML.matchAll(/<\/?section\b[^>]*>/g)];
 for(let i=0;i<tags.length;i++){
  const tag=tags[i],classes=tag[0].match(/class="([^"]*)"/)?.[1].split(/\s+/)||[];
  if(tag[0].startsWith('</')||!classes.includes(rootClass))continue;
  let depth=1,j=i+1;for(;j<tags.length&&depth;j++)depth+=tags[j][0].startsWith('</')?-1:1;
  if(depth)throw new Error('Unclosed source specimen: '+rootClass);
  const end=tags[j-1];screens.push(boardHTML.slice(tag.index,end.index+end[0].length));i=j-1;
 }
 return screens;
}
const paths={
 arrow_back:'<path d="m15 18-6-6 6-6"/>',chevron_right:'<path d="m9 6 6 6-6 6"/>',expand_more:'<path d="m6 9 6 6 6-6"/>',expand_less:'<path d="m6 15 6-6 6 6"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',add:'<path d="M12 5v14M5 12h14"/>',check:'<path d="m5 12 4 4L19 6"/>',check_box:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m7 12 3 3 7-7"/>',check_box_outline_blank:'<rect x="3" y="3" width="18" height="18" rx="3"/>',
 person:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',groups:'<circle cx="9" cy="8" r="3"/><path d="M2 21v-3a7 7 0 0 1 14 0v3M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 4 5v2"/>',face:'<circle cx="12" cy="12" r="9"/><path d="M7 9h.01M17 9h.01M8 15a5 5 0 0 0 8 0"/>',manage_accounts:'<circle cx="9" cy="7" r="3"/><path d="M2 21v-3a7 7 0 0 1 12-5"/><circle cx="18" cy="17" r="3"/><path d="M18 12v2m0 6v2m-5-5h2m6 0h2"/>',
 content_copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 4V3H3v13h1"/>',delete:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>',edit:'<path d="m16 3 5 5-12 12-6 1 1-6ZM14 5l5 5"/>',photo_camera:'<path d="M3 7h4l2-3h6l2 3h4v14H3Z"/><circle cx="12" cy="13" r="4"/>',backspace:'<path d="M9 4h12v16H9l-7-8Z M12 9l6 6m0-6-6 6"/>',lock_person:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15" r="1"/><path d="M12 16v2"/>',
 call:'<path d="m4 3 4 1 1 5-3 2a18 18 0 0 0 7 7l2-3 5 1 1 4c-1 5-18-2-18-15Z"/>',location_on:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',description:'<path d="M4 2h10l6 6v14H4ZM14 2v6h6M8 12h8M8 16h8"/>',calendar_today:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 11h18"/>',storefront:'<path d="m3 9 2-6h14l2 6M3 9v12h18V9M9 21v-7h6v7"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/>',
 campaign:'<path d="M3 9h5l12-5v16l-12-5H3ZM8 15l2 6h4l-2-5"/>',chat_bubble_outline:'<path d="M3 3h18v14H8l-5 4Z"/>',question_answer:'<path d="M3 3h15v12H8l-5 4ZM8 7h13v13l-4-3"/>',headset_mic:'<path d="M3 14v-3a9 9 0 0 1 18 0v7a3 3 0 0 1-3 3h-5"/><rect x="2" y="11" width="4" height="7" rx="2"/><rect x="18" y="11" width="4" height="7" rx="2"/>',info_outline:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',help_outline:'<circle cx="12" cy="12" r="9"/><path d="M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5M12 17h.01"/>',
 home:'<path d="m2 10 10-8 10 8M5 8v13h14V8M9 21v-8h6v8"/>',notifications_none:'<path d="M6 10a6 6 0 0 1 12 0v5l2 3H4l2-3ZM10 21h4"/>',settings:'<path d="m9 3 1-1h4l1 3 3 1 3 2-1 4 1 3-3 3-3 1-1 3h-4l-1-3-3-1-3-3 1-3-1-4 3-2Z"/><circle cx="12" cy="12" r="3"/>',admin_panel_settings:'<path d="m12 2 9 4v7c0 5-9 9-9 9s-9-4-9-9V6Z"/><path d="m8 12 3 3 5-6"/>',loyalty:'<path d="m3 3 8 0 10 10-8 8L3 11ZM7 7h.01"/>',move_down:'<path d="M12 3v18m-6-6 6 6 6-6M3 3h4M3 7h4"/>',
 more_vert:'<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',qr_code_2:'<path d="M3 3h6v6H3ZM15 3h6v6h-6ZM3 15h6v6H3ZM15 15h3v3h3v3h-6ZM12 3v9h9M3 12h6m3 3v6"/>',park:'<path d="m12 2 7 8h-3l5 7h-7v5h-4v-5H3l5-7H5Z"/>',local_activity:'<path d="M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4Z"/>',receipt_long:'<path d="m5 2 2 2 2-2 3 2 3-2 2 2 2-2v20l-2-2-2 2-3-2-3 2-2-2-2 2ZM9 8h6M9 12h6M9 16h6"/>'
};
// Google Material Icons (Apache-2.0), same filled family as Flutter Icons.visibility[_off].
// Originals: github.com/google/material-design-icons/tree/master/src/action/{visibility,visibility_off}/materialicons
const filledPaths={
 visibility:'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
 visibility_off:'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z'
};
const alias={delete_outline:'delete',edit_note:'edit',rate_review:'edit',event_available:'calendar_today',support_agent:'headset_mic',qr_code_scanner:'qr_code_2'};
function svg(name){
 if(filledPaths[name])return '<svg data-source-icon="'+e(name)+'" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="'+filledPaths[name]+'"/></svg>';
 const content=paths[alias[name]||name];if(!content)throw new Error('Unmapped source icon: '+name);return '<svg data-source-icon="'+e(name)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+content+'</svg>';
}
const profile=()=>renderMyInfoTest({assetBase:'/screens/my-info-3d-test/media/figma/'}).match(/<header class="profile-header">[\s\S]*?<\/header>/)[0];
export function adaptSourceScreen(source){
 let html=source.replace(/^(<section\b[^>]*?)\s+inert(?=[ >])/,'$1').replace(/^<section\b([^>]*class=")([^"]*)"/,'<section$1$2 v2-source-frame"');
 html=html.replace(/<div class="og-history-backdrop"[^>]*>[\s\S]*?<\/div><div class="og-history-scrim">/,()=>'<div class="og-history-backdrop" inert aria-hidden="true">'+profile()+'</div><div class="og-history-scrim">');
 html=html.replace(/<span class="material-icons"[^>]*>([^<]*)<\/span>/g,(_,name)=>svg(name));
 const classes={'og-button':'v2-button','og-icon-button':'v2-icon-button','og-surface':'v2-surface','og-menu-tile':'v2-menu-tile','og-field':'v2-input','og-tabs':'v2-tabs','og-segment':'v2-segment','og-dialog-panel':'v2-dialog-panel','og-dialog-body':'v2-dialog-body','og-dialog-actions':'v2-dialog-actions','og-badge':'v2-badge','og-snackbar':'v2-snackbar'};
 html=html.replace(/class="([^"]*)"/g,(_,value)=>'class="'+value+' '+Object.entries(classes).filter(([name])=>value.split(/\s+/).includes(name)).map(([,name])=>name).join(' ')+'"');
 html=html.replace(/class="((?:og-sheet-body|og-password-content|og-faq-scroll|og-faq-carousel|og-opinion-scroll|og-customer-scroll|og-policies-scroll|og-policy-document|og-photo-body|og-write-body)(?: [^"]*)?)"/g,'class="$1" role="region" aria-label="시안 본문" tabindex="0"');
 // Keep the native select semantics; only its arrow seat belongs to shared input CSS.
 html=html.replace(/<select\b[^>]*>[\s\S]*?<\/select>/g,select=>'<div class="v2-select-control">'+select+'</div>');
 // Native label activation can toggle an inert input; isolate both paths.
 return html.replace(/<(button|input|textarea|select|a|label)(?! inert)\b/g,'<$1 inert');
}
const commonCSS=['button','icon-button','menu-tile','input','tabs','badges','media','surfaces','dialog','snackbar','sheet','help'].map(name=>'/v2/components/'+name+'.css');
export function renderSourceGallery({id,title,intro,states,cssFiles=[],basicComparisonHTML='',extraLabel='다른 상태 비교'}){
 if(!states?.length)throw new Error('Source gallery requires specimens');
 const sample=state=>'<figure class="v2-reservation-review-sample" data-source-state="'+e(state.key)+'" data-source-domain="'+e(id)+'"><figcaption>'+e(state.label)+'</figcaption><div class="v2-source-host" data-source-css="'+e(JSON.stringify(cssFiles))+'"><template>'+adaptSourceScreen(state.html)+'</template></div></figure>';
 return '<section id="'+e(id)+'" data-review-screen aria-labelledby="'+e(id)+'-title" hidden><h2 id="'+e(id)+'-title">'+e(title)+'</h2><p class="v2-intro">'+e(intro)+'</p><div class="v2-reservation-review-grid v2-source-review-grid">'+sample(states[0])+basicComparisonHTML+'</div>'+(states.length>1?'<details class="v2-source-extra v2-reservation-extra"><summary>'+e(extraLabel)+' · '+(states.length-1)+'개</summary><div class="v2-reservation-review-grid v2-source-review-grid">'+states.slice(1).map(sample).join('')+'</div></details>':'')+'<p class="v2-intro">배치와 상태 확인용 예시입니다. 버튼·입력·링크는 실제 서비스에 연결하지 않습니다.</p></section>';
}
const cssCache=new Map();
async function localCSS(path,ancestors=[]){
 const url=new URL(path,location.href);if(url.origin!==location.origin||!/^\/(v2|design-system|screens)\//.test(url.pathname))return '';
 const key=url.href;if(ancestors.includes(key))return '';
 if(!cssCache.has(key))cssCache.set(key,(async()=>{
  const response=await fetch(url);if(!response.ok)throw new Error('Stylesheet unavailable: '+url.pathname);
  let css=await response.text(),imports='';
  for(const match of [...css.matchAll(/@import\s+(?:url\(\s*["']?([^"')]+)["']?\s*\)|["']([^"']+)["'])\s*;/g)]){
   imports+=await localCSS(new URL(match[1]||match[2],url).href,[...ancestors,key]);css=css.replace(match[0],'');
  }
  return imports+css.replace(/:root\b/g,':host');
 })());
 return cssCache.get(key);
}
export function setupSourceGallery(root,id){
 const section=root.querySelector('#'+id);if(!section||section.dataset.sourceGalleryReady)return;
 section.dataset.sourceGalleryReady='true';
 const mount=scope=>{for(const host of scope.querySelectorAll('.v2-source-host')){
  if(host.shadowRoot)continue;
  const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});shadow.append(template.content.cloneNode(true));template.remove();
  const frame=shadow.querySelector('.v2-source-frame');
  for(const field of frame.querySelectorAll('.v2-input'))if(field.querySelector('textarea'))field.classList.add('v2-input-textarea');
  const overlays=[...frame.children].filter(n=>/(?:^|\s)og-\S*-overlay(?:\s|$)/.test(n.className));
  if(overlays.length)for(const child of frame.children)if(!overlays.includes(child)){child.inert=true;child.setAttribute('aria-hidden','true');}
  for(const region of frame.querySelectorAll('.og-sheet-body,.og-password-content,.og-faq-scroll,.og-faq-carousel,.og-opinion-scroll,.og-customer-scroll,.og-policies-scroll,.og-policy-document,.og-photo-body,.og-write-body')){region.tabIndex=0;region.setAttribute('role','region');region.setAttribute('aria-label','시안 본문');}
  for(const avatar of shadow.querySelectorAll('.og-avatar:not([data-v2-media])')){const size=avatar.dataset.size||'medium';avatar.outerHTML=renderAvatar({size,character:true,label:avatar.getAttribute('aria-label')||'프로필'});}
  for(const thumb of shadow.querySelectorAll('.og-thumbnail:not([data-v2-media])')){const img=thumb.querySelector('img');thumb.outerHTML=renderThumbnail({src:img?.getAttribute('src')||'',state:img?'ready':'empty',alt:img?.alt||thumb.getAttribute('aria-label')||'이미지 배치 예시'});}
  setupMedia(shadow);
  (async()=>{
   const paths=JSON.parse(host.dataset.sourceCss),sources=paths.filter(p=>p.startsWith('/design-system/')),domain=paths.filter(p=>!p.startsWith('/design-system/'));
   const style=document.createElement('style');style.textContent=(await Promise.all([...sources,...commonCSS,'/screens/my-info-3d-test/styles.css','/v2/my-info/source-review.css',...domain].map(p=>localCSS(p)))).join('\n');shadow.prepend(style);host.dataset.sourceReady='true';
  })().catch(error=>{host.dataset.sourceReady='error';console.error(error);});
 }};
 mount(section.querySelector('.v2-source-review-grid'));
 for(const details of section.querySelectorAll('.v2-source-extra')){if(details.open)mount(details);details.addEventListener('toggle',()=>{if(details.open)mount(details);});}
}
