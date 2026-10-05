import {storeScreen,storeNavigation} from '../../design-system/pages/home/store.mjs';
import {publicStoreData} from '../../design-system/pages/home/public-store-data.mjs';
import {iconButton} from '../../design-system/components/button/render.mjs';
import {escapeHTML as e,icon as sourceIcon} from '../../design-system/components/core.mjs';
import {renderIconButton} from '../components/icon-button.mjs';
import {renderThumbnail,setupMedia} from '../components/media.mjs';

const line=path=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
const art={back:line('m14 5-7 7 7 7'),location:line('M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0ZM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z'),share:line('M12 16V3m-4 4 4-4 4 4M7 11H4v10h16V11h-3'),star:line('m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z')};
const states=[
 ['basic','기본 첫 화면','오시 망원본점의 공개 로고·사진·소개를 사용합니다. 영업 상태와 제공 서비스는 배치용 예시이며 실시간 정보가 아닙니다.',{menu:true,reserve:true,wait:true,news:true,event:true}],
 ['limited','메뉴·예약·웨이팅·소식이 없는 매장','동일 매장을 사용해 제공 항목이 적은 상태를 비교합니다. 실제 제공 여부를 뜻하지 않습니다.',{menu:false,reserve:false,wait:false,news:false,event:false}],
 ['no-photo','사진이 없는 매장','동일 매장의 사진을 숨긴 상태 예시입니다. 사진 수 표시는 생략합니다.',{reserve:true}],
 ['promotion-expanded','소개를 펼친 상태','공개 소개의 전체 본문과 접기 표시를 비교합니다. 실제 펼침 동작은 연결하지 않습니다.',{menu:true},{promotionExpanded:true}],
 ['bookmarked','찜이 선택된 상태','동일 매장에 찜 선택 표시를 적용한 예시입니다. 실제 저장된 찜 정보가 아닙니다.',{menu:true},{bookmarked:true}],
 ...[
  ['closed','영업 종료','close','영업 종료',''],
  ['break-time','브레이크 타임','breakTime','브레이크 타임','17:00에 영업 시작'],
  ['before-open','영업 전','notOpen','영업 전','12:00에 영업 시작'],
  ['opening-soon','곧 영업 시작','openPreparing','곧 영업 시작','12:00에 영업 시작'],
  ['temporary-holiday','임시 휴일','tempHoliday','임시 휴일',''],
  ['regular-holiday','정기 휴일','regularHoliday','정기 휴일',''],
  ['holiday','공휴일','holiday','공휴일','']
 ].map(([id,title,runtimeStatus,label,sublabel])=>[id,title+' · 사진 상태','원본 RuntimeValidater의 label/sublabel과 사진 위 안내를 비교하는 정적 예시입니다. 이 매장의 실제 현재 상태·휴무·브레이크 시간을 뜻하지 않습니다.',{menu:true},{runtimeStatus:{runtimeStatus,label,sublabel,isOpen:false}}])
];
const control=(label,kind)=>iconButton({label,iconHTML:art[kind],className:'v2-icon-button',attributes:{'data-face':'raised',inert:true}});
const holidayStatuses=new Set(['tempHoliday','regularHoliday','holiday']);
const closedStatuses=new Set([...holidayStatuses,'close','notOpen','openPreparing','breakTime']);
// Source: shop_contents.dart _closedInfo/buildShopImages. These are supplied
// RuntimeValidater specimens, never a fresh calculation of current shop hours.
function heroStatus(status){
 if(!status||status.isOpen!==false||!closedStatuses.has(status.runtimeStatus))return '';
 const holiday=holidayStatuses.has(status.runtimeStatus),label=status.label||'영업 종료';
 const glyph=holiday?line('M4 5h16v15H4ZM8 3v4m8-4v4M4 10h16m-6 3-4 4m0-4 4 4'):line('M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z');
 return `<div class="v2-store-hero-status" data-hero-status="${e(status.runtimeStatus)}">${glyph}<strong>${e(label)}</strong><span>${holiday?'오늘은 쉬어가요':'지금은 영업 시간이 아니에요'}</span></div>`;
}
export function renderHomeStoreScreen({state='basic'}={}){
 const config=states.find(([id])=>id===state);if(!config)throw new RangeError('Unsupported store state');
 const store=publicStoreData.store,images=state==='no-photo'?[]:state==='limited'?store.images.slice(0,1):store.images;
 const props=config[4]||{};
 return `<div class="v2-home-store-frame" data-store-state="${state}" aria-label="${e(config[1])}">${renderHomeStoreContent({store:{...store,bookmarked:props.bookmarked??store.bookmarked},info:publicStoreData.info,images,availability:config[3],...props})}</div>`;
}
// Shared store identity/action/section shell; callers supply a source body section.
export function renderHomeStoreContent({store=publicStoreData.store,info=store===publicStoreData.store?publicStoreData.info:null,images=store.images||[],availability={},contentHTML,selectedSection=0,bodyLabel='매장 사진과 소개',promotionExpanded=false,runtimeStatus=null}={}){
 const sections=storeNavigation(availability);
 const address=[info?.streetAddress||store.address,info?.detailAddress].filter(value=>typeof value==='string'&&value.trim()).map(value=>value.trim()).join(' ');
 const statusHTML=heroStatus(runtimeStatus);
 const navigation=`<nav class="v2-store-sections" aria-label="매장 내용 이동" aria-description="${e(sections.join(' · '))}" tabindex="0">${sections.map((label,index)=>`<button type="button" inert${index===selectedSection?' aria-current="location"':''}>${e(label)}</button>`).join('')}</nav>`;
 let html=storeScreen({...store,...availability,address,images,contentHTML,selectedSection,...(runtimeStatus?{status:runtimeStatus.label,subStatus:runtimeStatus.sublabel||''}:{})})
  .replace('class="og-store" inert','class="og-store"')
  .replace(/<header class="og-store-toolbar">[\s\S]*?<\/header>/,()=>`<header class="og-store-toolbar">${control('뒤로가기','back')}<div>${control('길찾기','location')}${control('공유','share')}${renderIconButton({kind:'favorite',face:'raised',label:'찜',selected:store.bookmarked===true,attributes:{inert:true}})}</div></header>`)
  .replace(/<div class="og-tabs[^>]*>[\s\S]*?<\/div>/,navigation)
  .replace(/<img class="og-store-logo"[^>]*>/,`<div class="v2-store-logo">${renderThumbnail({src:store.logo,alt:store.name+' 로고',fit:'contain',decorative:true})}</div>`)
  .replace(/<div class="og-thumbnail"[\s\S]*?<\/div>/,()=>renderThumbnail({src:images[0]||'https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/ogapp/no_image.png',alt:store.name+(images.length?' 매장 사진':' · 사진 없음 표시'),ratio:'wide'})+statusHTML)
  .replace('<div class="og-store-photo">',()=>`<div class="og-store-photo"${statusHTML?' data-store-hero-closed="true"':''}>`)
  .replace(/<section class="og-store-promotion">([\s\S]*?)<\/section>/,(_,content)=>`<section class="og-store-promotion" data-promotion-expanded="${promotionExpanded}">${content}${store.description?`<button type="button" class="v2-store-promotion-affordance" inert aria-label="매장 소개 ${promotionExpanded?'접기':'펼치기'}" aria-expanded="${promotionExpanded}">${promotionExpanded?'':'<span>더 보기</span>'}${line(promotionExpanded?'m6 15 6-6 6 6':'m6 9 6 6 6-6')}</button>`:''}</section>`)
  .replace(sourceIcon('star'),art.star)
  .replace('class="og-store-body"',()=>`class="og-store-body" role="region" tabindex="0" aria-label="${e(bodyLabel)}"`)
  .replace('<h2>','<h4>').replace('</h2>','</h4>')
  .replace('<h3>','<h4>').replace('</h3>','</h4>');
 return html;
}
const styles=['/v2/components/icon-button.css','/v2/components/media.css','/v2/home/store.css'];
function example([state,title,copy]){
 return `<figure class="v2-home-search-example"><figcaption><h3>${e(title)}</h3><p>${e(copy)}</p></figcaption><div class="v2-home-search-host v2-home-store-host"><template data-store-template>${styles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}${renderHomeStoreScreen({state})}</template></div></figure>`;
}
export function renderHomeStoreReview(){
 return `<section id="store" data-review-screen hidden aria-labelledby="store-title"><h2 id="store-title">매장 상세 첫 화면</h2><p class="v2-intro">매장명·주소·영업 상태를 확인하고 사진과 소개를 살펴보는 화면입니다. 길찾기·공유·찜·메뉴 이동·사진 넘기기·소개 펼침은 실행하지 않는 시안입니다.</p>${example(states[0])}<details class="v2-home-search-extra v2-home-store-extra"><summary>다른 상태 비교 · ${states.length-1}개</summary><div class="v2-home-search-grid">${states.slice(1).map(example).join('')}</div></details></section>`;
}
export function setupHomeStoreReview(root){
 const section=root.querySelector('#store');if(!section)return;
 const extra=section.querySelector('details');
 const mount=hosts=>{
  for(const host of hosts){
   if(host.shadowRoot)continue;
   const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});
   shadow.append(template.content.cloneNode(true));template.remove();setupMedia(shadow);
  }
 };
 const activate=()=>{if(section.hidden)return;mount([section.querySelector('.v2-home-store-host')]);if(extra.open)mount(extra.querySelectorAll('.v2-home-store-host'));};
 new MutationObserver(activate).observe(section,{attributes:true,attributeFilter:['hidden']});
 extra.addEventListener('toggle',activate);activate();
}
