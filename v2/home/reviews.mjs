import {praiseSection,reviewsSection} from '../../design-system/pages/home/store-reviews.mjs';
import {reviewListScreen,reviewPhotoScreen} from '../../design-system/pages/home/review-pages.mjs';
import {publicReviewsData} from '../../design-system/pages/home/public-reviews-data.mjs';
import {avatar,thumbnail} from '../../design-system/components/avatar/render.mjs';
import {escapeHTML as e,icon} from '../../design-system/components/core.mjs';
import {renderAvatar,renderThumbnail} from '../components/media.mjs';
import {renderHomeStoreContent} from './store.mjs';
import {remainingGallery,setupRemainingGallery} from './remaining-gallery.mjs';

const line=path=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
const art={arrow_back:line('m14 5-7 7 7 7'),chevron_right:line('m9 5 7 7-7 7'),chevron_left:line('m15 5-7 7 7 7'),expand_more:line('m5 9 7 7 7-7'),expand_less:line('m5 15 7-7 7 7'),fullscreen:line('M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5'),fullscreen_exit:line('M3 8h5V3m8 0v5h5M8 21v-5H3m13 5v-5h5'),eco:line('M20 4C8 2 2 9 6 16c7 6 14-2 14-12ZM5 20 16 9'),home:line('m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7'),group:line('M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 21v-3a7 7 0 0 1 14 0v3m0-17a3 3 0 0 1 0 6m3 4a7 7 0 0 1 3 7'),local_parking:line('M7 21V3h6a5 5 0 0 1 0 10H7'),sentiment_satisfied:line('M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM8 9h.01M16 9h.01M8 14q4 5 8 0'),food_bank:line('m3 10 9-7 9 7M5 10v11h14V10M9 11v4m-2-4v2q0 2 2 2v4m7-8v8m0-8q-3 3 0 5'),reviews:line('M4 3h16v14H9l-5 4V3ZM8 7h8m-8 4h6'),thumb_up:line('M8 10 12 3q4 0 2 7h6v3l-3 8H8V10ZM3 10h5v11H3Z')};
const states={
 'store-reviews':[['registered','등록된 칭찬·리뷰'],['expanded','칭찬 전체 · 최대 7개'],['empty-eligible','리뷰 없음 · 작성 가능'],['empty-ineligible','리뷰 없음 · 작성 불가']],
 'review-list':[['registered','포토 리뷰 전체 목록'],['expanded','두 번째 리뷰 본문 펼침']],
 'review-photo':[['registered','첫 사진 · 채워 보기'],['expanded','긴 리뷰 본문 펼침 · 배치 비교'],['contain','사진 전체 보기'],['last','마지막 사진']]
};
function valid(id,state){if(!states[id].some(([key])=>key===state))throw new RangeError('Unsupported '+id+' state');}
// Reuse source composition, but bind every passive image/control to v2 materials.
function adapt(html,items=[]){
 html=html.replaceAll(avatar({size:'small'}),()=>renderAvatar({size:'small',decorative:true}));
 for(const item of items){
  if(item.avatarSrc)html=html.replaceAll(`<img src="${e(item.avatarSrc)}" alt="프로필 사진" width="25" height="25">`,()=>renderAvatar({size:'small',src:item.avatarSrc,decorative:true})).replaceAll(`<img src="${e(item.avatarSrc)}" alt="프로필 사진" width="45" height="45">`,()=>renderAvatar({size:'small',src:item.avatarSrc,decorative:true}));
  for(const src of item.images||[])html=html.replaceAll(thumbnail({src,alt:'리뷰 사진'}),()=>renderThumbnail({src,alt:'리뷰 사진'}));
 }
 for(const [name,svg] of Object.entries(art))html=html.replaceAll(icon(name),()=>svg);
 return html.replace(/<button\b(?![^>]*\binert\b)/g,'<button inert').replaceAll('<h3>','<h5>').replaceAll('</h3>','</h5>');
}
export function renderHomeStoreReviewsScreen({state='registered',data=publicReviewsData}={}){
 valid('store-reviews',state);const empty=state.startsWith('empty'),canReview=state!=='empty-ineligible';
 const content='<div class="og-store-reviews">'+praiseSection({items:empty?[]:data.praise,canReview,expanded:state==='expanded'})+reviewsSection({items:empty?[]:data.items,canReview})+'</div>';
 const body=adapt(content,data.items);
 return `<div class="v2-home-store-frame v2-home-store-reviews-frame" data-store-reviews-state="${state}">${renderHomeStoreContent({store:data.store,selectedSection:1,contentHTML:body,bodyLabel:'매장 칭찬과 리뷰'})}</div>`;
}
export function renderHomeReviewListScreen({state='registered',data=publicReviewsData}={}){
 valid('review-list',state);
 let html=reviewListScreen({...data.store,items:data.items,expandedIndex:state==='expanded'?1:-1})
  .replace('class="og-review-list-page" inert','class="og-review-list-page"')
  .replace('<h2>','<h4>').replace('</h2>','</h4>')
  .replace('class="og-review-list-body"','class="og-review-list-body" role="region" tabindex="0" aria-label="포토 리뷰 목록"');
 const brand=renderThumbnail({src:data.store.logo||'',alt:data.store.name+' 로고',fit:'contain',decorative:true});
 html=data.store.logo?html.replace(`<img src="${e(data.store.logo)}" alt="" width="30" height="30">`,()=>brand):html.replace(icon('storefront'),()=>brand);
 return `<div class="v2-home-review-list-frame" data-review-list-state="${state}">${adapt(html,data.items)}</div>`;
}
export function renderHomeReviewPhotoScreen({state='registered',data=publicReviewsData}={}){
 valid('review-photo',state);const photos=data.items.flatMap(item=>(item.images||[]).map(imageSrc=>({...item,imageSrc})));
 // Empty-photo entry is an existing app issue: never manufacture a photo or author.
 if(!photos.length)throw new RangeError('Photo detail requires a registered review photo');
 const index=state==='last'?photos.length-1:state==='expanded'?Math.min(1,photos.length-1):0;
 const record=photos[index],fit=state==='contain'?'contain':'cover';
 let html=reviewPhotoScreen({...record,date:record.photoDate,storeName:data.store.name,index,total:photos.length,fit,expanded:state==='expanded'})
  .replace(/ inert(?=>)/,'').replace('<h2>','<h4>').replace('</h2>','</h4>')
  .replace(`<img src="${e(record.imageSrc)}" alt="리뷰 사진">`,()=>renderThumbnail({src:record.imageSrc,alt:'리뷰 사진',ratio:'wide',fit}))
  .replace('class="og-review-photo-copy"','class="og-review-photo-copy" role="region" tabindex="0" aria-label="사진 작성자와 리뷰 본문"');
 return `<div class="v2-home-review-photo-frame" data-review-photo-state="${state}">${adapt(html,data.items)}</div>`;
}
const styles=['/v2/components/icon-button.css','/v2/components/media.css','/v2/home/store.css','/v2/home/reviews.css'];
export const renderHomeStoreReviewsReview=()=>remainingGallery({id:'store-reviews',title:'매장 리뷰',copy:'매장에서 받은 칭찬과 최근 리뷰를 확인하는 영역입니다. 오형제황제누룽지탕의 익명화된 공개 리뷰 스냅샷을 사용합니다. 아래 펼침·빈 리뷰는 배치 비교이며 실제 리뷰 상태가 아닙니다. 작성·더 보기·사진 이동은 실행하지 않습니다.',states:states['store-reviews'],screen:renderHomeStoreReviewsScreen,styles});
export const renderHomeReviewListReview=()=>remainingGallery({id:'review-list',title:'포토 리뷰 전체 목록',copy:'매장에 등록된 포토 리뷰를 작성자·날짜·사진·본문 순서로 읽는 화면입니다. 익명화된 기존 리뷰를 사용하며 두 번째 리뷰의 펼친 배치도 비교합니다. 더보기·접기·사진 열기는 실행하지 않습니다.',states:states['review-list'],screen:renderHomeReviewListScreen,styles});
export const renderHomeReviewPhotoReview=()=>remainingGallery({id:'review-photo',title:'리뷰 사진 상세',copy:'사진을 크게 보면서 작성자와 리뷰를 함께 읽는 화면입니다. 기존 리뷰 사진 3장 중 첫 사진·마지막 사진과 채워 보기·전체 보기·본문 펼침을 비교합니다. 사진 전환·핀치 확대·본문 펼침은 실행하지 않습니다.',states:states['review-photo'],screen:renderHomeReviewPhotoScreen,styles});
export const setupHomeReviewsReview=root=>{for(const id of Object.keys(states))setupRemainingGallery(root,id);};
