import {escapeHTML as e,icon} from '../../components/core.mjs';
import {sectionHeading} from '../../components/section-heading/render.mjs';
import {textButton} from '../../components/button/render.mjs';
import {avatar,thumbnail} from '../../components/avatar/render.mjs';
import {surface} from '../../components/surfaces/render.mjs';
import {storeScreen} from './store.mjs';
export function praiseSection({items=[],canReview=true,expanded=false}={}){
 const max=Math.max(0,...items.map(i=>i.count));
 return '<section class="og-store-praise">'+sectionHeading({title:'칭찬해요',action:canReview?'리뷰 작성':''})+items.slice(0,expanded?7:5).map(i=>'<div class="og-praise-row"><span class="og-praise-fill" style="--praise-ratio:'+(max?i.count/max:0)+';--praise-opacity:'+(max?.05+i.count/max*.25:.05)+'"'+(!max?' hidden':'')+'></span>'+icon(i.icon||'thumb_up')+'<span class="og-praise-name">'+e(i.name)+'</span><strong>'+e(i.count)+'</strong></div>').join('')+(items.length>5?'<div class="og-store-review-more">'+textButton({label:expanded?'줄이기':'더 보기'})+icon(expanded?'expand_less':'expand_more')+'</div>':'')+'</section>';
}
export function reviewCard({name='회원 닉네임',date='2026. 9. 19',text='',images=[],avatarSrc='',expandable=false,expanded=false}={}){
 return surface({className:'og-store-review-card'+(expanded?' is-expanded':''),contentHTML:'<div class="og-store-review-author">'+(avatarSrc?'<img src="'+e(avatarSrc)+'" alt="프로필 사진" width="25" height="25">':avatar({size:'small'}))+'<strong>'+e(name)+'</strong><time>'+e(date)+'</time></div>'+(images.length?'<div class="og-store-review-images">'+images.map(src=>thumbnail({src,alt:'리뷰 사진'})).join('')+'</div>':'')+'<p class="og-store-review-text">'+e(expanded?text:text.replace(/\n\s*\n/g,'\n'))+'</p>'+(expandable?'<div class="og-review-expand">'+textButton({label:expanded?'접기':'더보기'})+'</div>':'')});
}
export function reviewsSection({items=[],canReview=true}={}){
 const filled=items.length>0;
 return '<section class="og-store-review-section">'+sectionHeading({title:'리뷰',action:filled?'리뷰 작성':''})+(filled?items.slice(0,2).map(reviewCard).join('')+'<div class="og-store-review-more">'+textButton({label:'더 보기'})+icon('chevron_right')+'</div>':'<div class="og-store-review-empty"><p>'+icon('reviews')+'<span>아직 리뷰가 없어요.</span></p><p>'+(canReview?'이 매장의 첫 번째 리뷰어가 되어 주세요':'이 매장을 방문하고,<br>첫 번째 리뷰어가 되어 주세요')+'</p>'+(canReview?textButton({label:'리뷰 작성'}):'')+'</div>')+'</section>';
}
export function storeReviewsScreen({state='default',imageSrc='',publicData}={}){
 const empty=state.startsWith('empty'),canReview=state!=='empty-ineligible';
 const praise=empty?[]:publicData?publicData.praise:[12,9,7,5,3,2,1].map((count,i)=>({name:'칭찬 항목 '+(i+1),count,icon:'thumb_up'}));
 const items=empty?[]:publicData?publicData.items:[{name:'회원 닉네임',text:'회원이 작성한 리뷰 내용입니다.\n매장을 이용한 경험을 남겼습니다.',images:imageSrc?[imageSrc,imageSrc,imageSrc]:[]},{name:'다른 회원 닉네임',date:'2026. 9. 18',text:'사진 없이 작성한 리뷰 내용입니다.'}];
 return storeScreen({...publicData?.store,selectedSection:1,contentHTML:'<div class="og-store-reviews">'+praiseSection({items:praise,canReview,expanded:state==='expanded'})+reviewsSection({items,canReview})+'</div>'});
}
export function storeReviewsBoard({imageSrc='',publicData}={}){
 const registered=publicData?'<section class="screen-state-example"><h3>'+e(publicData.store.name)+' · 등록된 리뷰</h3><div class="screen-artboard">'+storeScreen({...publicData.store,selectedSection:1,contentHTML:'<div class="og-store-reviews">'+praiseSection({items:publicData.praise})+reviewsSection({items:publicData.items})+'</div>'})+'</div></section><h3>상태별 배치 예시</h3>':'';
 return '<div class="screen-page-content"><div>'+registered+[['default','기본 · 칭찬 5개'],['expanded','칭찬을 펼쳤을 때 · 최대 7개'],['empty-eligible','리뷰 없음 · 작성 가능'],['empty-ineligible','리뷰 없음 · 작성 불가']].map(([state,title])=>'<section class="screen-state-example"><h3>'+title+'</h3><div class="screen-artboard">'+storeReviewsScreen({state,imageSrc,publicData})+'</div></section>').join('')+'</div><div class="screen-design-notes"><h3>칭찬과 리뷰</h3><p>칭찬 집계 아래에 사진과 글 리뷰를 배치합니다.</p><h3>막대 길이</h3><p>가장 많이 받은 칭찬을 기준으로 길이를 비교하고, 횟수는 오른쪽에 맞춥니다.</p><h3>리뷰 사진</h3><p>사진은 가로로 나열하고 본문은 세 줄까지 보여줍니다.</p></div></div>';
}
export const storeReviewsPrompt='기존 매장 리뷰 본문을 캡처와 CSS로 스타일만 적용하세요. lib/0_pages/01_home/shop_panel_items/shop_contents.dart의 _getReview/_getMultiPhotoReviewItemList/_getReviewItem 및 lib/1_widgets/joybar_widget.dart 기준입니다. 칭찬해요는 원래joybarList 순서, 기본5개/펼침최대7개, 항목수가5초과일때 더 보기/줄이기를 유지합니다. 막대는 최대count 기준이며 원래15px기본길이+비율*(가용너비-40-15), opacity .05+비율*.25입니다. 전체0이면 막대길이0. 아이콘/색/항목명은 JoybarModel 원본을 유지하세요. 캔버스 칭찬항목/숫자/아이콘은 비교예시이며 새키워드가 아닙니다. PDF의 칩화/상위3개 강조는 미적용입니다. 칭찬 작성은 canReview와콜백있을때, 로그인확인후 JoybarAvailablePage입니다. 리뷰는 최대2개, 사진프로필 또는기존아바타, 닉네임, yyyy. M. d 날짜, 있을때120x120가로사진, 빈줄압축본문3줄을 유지합니다. 본문에 별점/좋아요/신고를 추가하지 않습니다. 사진선택은 기존 _goReviewPicture, 더 보기는 StoreReview, 리뷰 작성은 MultiPhotoAvailablePage입니다. 리뷰가있을때 작성버튼은 기존대로canReview검사없이 표시합니다. 없으면 아직 리뷰가 없어요.와 canReview분기문구/버튼을 유지합니다. 실제펼침/이동/작성은 정적캔버스에 구현하지 않습니다. 공통 storeScreen/sectionHeading/surface/avatar/thumbnail/textButton/icon 및 OG토큰, reviewCard를 재사용하세요. 렌더러 design-system/pages/home/store-reviews.mjs, CSS store-reviews.css. 시안은 본문영역이며 앞뒤 섹션을 제거하지 않습니다.';
