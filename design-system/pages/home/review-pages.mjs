import {escapeHTML as e,icon} from '../../components/core.mjs';
import {appBar} from '../../components/app-shell/render.mjs';
import {iconButton} from '../../components/button/render.mjs';
import {avatar} from '../../components/avatar/render.mjs';
import {reviewCard} from './store-reviews.mjs';

export function reviewListScreen({name='회원점명',category='업종',logo='',items=[],expandedIndex=-1}={}){
 const brand='<div class="og-review-brand">'+(logo?'<img src="'+e(logo)+'" alt="" width="30" height="30">':icon('storefront'))+'<strong>'+e(name)+'</strong><span>'+e(category)+'</span></div>';
 return '<section class="og-review-list-page" inert>'+appBar({title:'포토 리뷰',back:true})+brand+'<div class="og-review-list-body">'+items.map((item,index)=>reviewCard({...item,expandable:true,expanded:index===expandedIndex})).join('')+'</div></section>';
}

export function reviewPhotoScreen({storeName='회원점명',name='회원 닉네임',date='26.9.19 10:30',text='',avatarSrc='',imageSrc='',index=0,total=3,fit='cover',expanded=false}={}){
 const portrait=avatarSrc?'<img src="'+e(avatarSrc)+'" alt="프로필 사진" width="45" height="45">':avatar({size:'small'});
 const header=appBar({title:storeName,back:true,trailingHTML:iconButton({label:fit==='contain'?'사진 채워 보기':'사진 전체 보기',name:fit==='contain'?'fullscreen':'fullscreen_exit'})});
 const arrows=(index>0?iconButton({label:'이전 사진',name:'chevron_left',className:'og-review-photo-prev'}):'')+(index<total-1?iconButton({label:'다음 사진',name:'chevron_right',className:'og-review-photo-next'}):'');
 return '<section class="og-review-photo-page'+(expanded?' is-expanded':'')+'" data-fit="'+(fit==='contain'?'contain':'cover')+'" inert>'+header+'<div class="og-review-photo-body"><div class="og-review-photo-image">'+(imageSrc?'<img src="'+e(imageSrc)+'" alt="리뷰 사진">':'')+arrows+'</div>'+(expanded?'<div class="og-review-photo-shade"></div>':'')+'<div class="og-review-photo-copy"><div class="og-review-photo-author">'+portrait+'<div><strong>'+e(name)+'</strong><time>'+e(date)+'</time></div>'+icon(expanded?'expand_more':'expand_less')+'</div><p>'+e(expanded?text:text.replace(/\n\s*\n/g,'\n'))+'</p></div></div></section>';
}

const sampleText='회원이 작성한 리뷰 내용입니다.\n매장을 이용한 경험과 사진을 함께 남겼습니다.\n방문하며 느낀 점을 적었습니다.\n\n사진에 담긴 메뉴에 대한 내용입니다.\n함께 방문한 날의 이야기가 이어집니다.';
export function reviewPagesBoard(kind,{imageSrc='',publicData}={}){
 const items=[{text:sampleText,images:imageSrc?[imageSrc,imageSrc,imageSrc]:[]},{name:'다른 회원 닉네임',date:'2026. 9. 18',text:'사진 없이 작성한 리뷰 내용입니다.'},{name:'회원 닉네임',date:'2026. 9. 17',text:'이전에 작성한 리뷰 내용입니다.',images:imageSrc?[imageSrc]:[]}];
 if(publicData)items.splice(0,items.length,...publicData.items);
 const firstPhoto=publicData?.items.find(item=>item.images.length);
 const photoProps=firstPhoto?{...firstPhoto,date:firstPhoto.photoDate,storeName:publicData.store.name,imageSrc:firstPhoto.images[0],total:publicData.items.reduce((n,item)=>n+item.images.length,0)}:{};
 const states=kind==='list'?[['기본 목록',reviewListScreen({items,...publicData?.store})],['리뷰 본문을 펼쳤을 때',reviewListScreen({items,expandedIndex:0,...publicData?.store})]]:[['기본 · 사진 채워 보기',reviewPhotoScreen({imageSrc,text:sampleText,...photoProps})],['리뷰 본문을 펼쳤을 때',reviewPhotoScreen({imageSrc,text:sampleText,...photoProps,expanded:true})],['사진 전체 보기',reviewPhotoScreen({imageSrc,text:sampleText,...photoProps,fit:'contain'})]];
 if(publicData){states.forEach(state=>state[0]='배치 예시 · '+state[0]);const photos=publicData.items.flatMap(item=>item.images.map(imageSrc=>({...item,imageSrc})));const first=photos[0];if(kind==='list'||first)states.unshift([publicData.store.name+' · 등록된 리뷰',kind==='list'?reviewListScreen({...publicData.store,items:publicData.items}):reviewPhotoScreen({...first,storeName:publicData.store.name,date:first.photoDate,total:photos.length})]);}
 return '<div class="screen-page-content"><div>'+states.map(([title,html])=>'<section class="screen-state-example"><h3>'+title+'</h3><div class="screen-artboard">'+html+'</div></section>').join('')+'</div><div class="screen-design-notes">'+(kind==='list'?'<h3>리뷰 목록</h3><p>작성자와 날짜를 한 줄에 맞추고, 사진과 본문을 아래에 배치합니다.</p><h3>본문 펼침</h3><p>긴 리뷰는 세 줄로 줄여 보여주고, 펼친 상태에서는 문단을 그대로 보여줍니다.</p>':'<h3>사진에 집중</h3><p>어두운 배경 위에 사진을 크게 보여줍니다. 본문을 펼치면 뒤쪽 사진을 어둡게 처리합니다.</p><h3>사진 비율</h3><p>채워 보기는 사진 영역을 채우고, 전체 보기는 잘리는 부분 없이 원본 비율로 보여줍니다.</p>')+'</div></div>';
}
export const reviewPagesPrompt='기존 매장 포토 리뷰 전체 목록과 사진 상세에 캡처와 CSS의 스타일만 적용하세요. 목록은 lib/0_pages/01_home/store_review.dart의 StoreReview: 포토 리뷰 헤더, 항상 매장 로고(없으면 storefront)·brandName·categoryName, 전체 리뷰 목록입니다. 작성자 아바타25·닉네임·yyyy. M. d 날짜, 선택적120px 사진 가로목록, 기본 빈 문단 압축3줄/펼침 원문을 유지합니다. 더보기/접기는 짧은 글에도 기존대로 표시하고 한 번에 한 항목만 펼칩니다. 기존 collapsed softWrap:false도 확인하세요. 작성버튼·별점·필터·좋아요를 추가하지 않습니다. 목록 사진은 선택 index, 행은0번 사진으로 ReviewPicturePage(showAllPictures:true)를 열고 전체 리뷰의 사진을 순서대로 탐색합니다. 사진 상세는 lib/0_pages/01_home/shop_panel_items/review_picture_page.dart: 어두운 배경, 매장명·뒤로·fullscreen 아이콘, 기본 BoxFit.cover/전환시contain, 이미지 하단 좌우 화살표(첫/끝에서는 해당 방향 숨김), 하단150px 작성자45·닉네임·yy.M.d HH:mm 날짜·본문입니다. 본문 펼침시 어두운 오버레이와 원문, 접힘시 하단 페이드를 유지합니다. 핀치 최대4배, 스와이프·본문 펼침은 앱 기존동작을 유지하되 정적시안에서는 구현하지 않습니다. 매장 본문에서 진입하면 showAllPictures:false로 해당 리뷰 사진만 탐색합니다. 사진번호·저장·공유를 임의 추가하지 않습니다. 기존 reviewCard/appBar/iconButton/avatar와 OG토큰 재사용. 렌더러 design-system/pages/home/review-pages.mjs, CSS review-pages.css 및 store-reviews.css. 목록/API의 추가페이지 연결, 사진없는 행 선택은 검토메모 참고. 예시 내용은 배치용이며 실서비스 리뷰가 아닙니다.';
