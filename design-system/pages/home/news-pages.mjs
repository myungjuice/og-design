import {escapeHTML as e} from '../../components/core.mjs';
import {appBar} from '../../components/app-shell/render.mjs';
import {surface} from '../../components/surfaces/render.mjs';
import {thumbnail} from '../../components/avatar/render.mjs';
import {updateItem} from './store-updates.mjs';
const emptyImage='https://og-familystore-image.s3.ap-northeast-2.amazonaws.com/ogapp/empty_event.png';
export function newsListScreen({items=[]}={}){
 const contents=items.length?items.map(item=>updateItem('news',item)).join(''):'<div class="og-news-empty"><img src="'+emptyImage+'" alt="" width="150" height="150"><p>등록된 데이터가 없어요.</p></div>';
 return '<div class="og-news-page" inert>'+appBar({title:'우리 가게 소식',back:true})+'<div class="og-news-page-body">'+surface({className:'og-news-list',contentHTML:contents})+'</div></div>';
}
export function newsDetailScreen(props={}){return readingScreen(props);}
export function readingScreen({appTitle='매장 소식',period='',title='회원점 소식 제목',contents='회원점에서 전하는 소식입니다.\n\n소식의 자세한 내용을 안내합니다.',registered='2026.9.19 10.30',imageSrc=''}={}){
 return '<div class="og-news-page og-reading-page" inert>'+appBar({title:appTitle,back:true})+'<div class="og-news-page-body">'+surface({className:'og-news-article'+(period?' has-period':''),contentHTML:'<p class="og-news-registered">등록일 : '+e(registered)+'</p><h3>'+e(title)+'</h3>'+(period?'<p class="og-reading-period">'+e(period)+'</p>':'')+'<div class="og-news-contents">'+e(contents)+'</div>'+(imageSrc?thumbnail({src:imageSrc,alt:title+' 첨부 이미지'}):'')})+'</div></div>';
}
export function newsPagesBoard(kind,{imageSrc='',publicData}={}){
 const items=[{title:'회원점 소식 제목',date:'오늘. 9.19(토)',image:imageSrc},{title:'사진 없이 등록한 소식 제목',date:'어제. 9.18(금)'},{title:'이전 소식 제목',date:'9.12(토)',image:imageSrc}];
 const record=publicData?.news[0];
 if(record)items.splice(0,items.length,...publicData.news);
 const examples=kind==='list'?[['소식이 있을 때',newsListScreen({items})],['소식이 없을 때',newsListScreen()]]:[['사진이 있는 소식',newsDetailScreen(record?{...record,imageSrc:record.image}:{imageSrc})],['사진이 없는 소식',newsDetailScreen(record?{...record,imageSrc:''}:{})]];
 if(publicData?.news.length){const post=publicData.news[0];examples.forEach(example=>example[0]='배치 예시 · '+example[0]);examples.unshift([publicData.store.name+' · 등록된 소식',kind==='list'?newsListScreen({items:publicData.news}):newsDetailScreen({...post,imageSrc:post.image})]);}
 return '<div class="screen-page-content"><div>'+examples.map(([title,html])=>'<section class="screen-state-example"><h3>'+title+'</h3><div class="screen-artboard">'+html+'</div></section>').join('')+'</div><div class="screen-design-notes">'+(kind==='list'?'<h3>소식 목록</h3><p>등록일과 제목을 왼쪽에, 사진을 오른쪽에 배치합니다. 사진이 없으면 글 영역을 넓힙니다.</p><h3>빈 목록</h3><p>안내 이미지와 문구를 목록 가운데에 배치합니다.</p>':'<h3>소식 읽기</h3><p>등록일은 오른쪽, 제목은 가운데에 배치하고 구분선 아래에 본문을 보여줍니다.</p><h3>첨부 이미지</h3><p>본문 다음에 원본 비율을 유지한 이미지를 배치합니다.</p>')+'</div></div>';
}
export const newsPagesPrompt='기존 매장 소식 전체목록/상세를 캡처와 CSS로 구현하세요. lib/0_pages/01_home/store_news.dart와 store_news_detail.dart 기준 기능·문구 유지, 스타일만 변경입니다. 일반 사용자 목록 제목은 우리 가게 소식이며 isPreview=false입니다. isPreview=true의 매장 소식 목록 제목/브랜드 로고·이름 분기는 기존대로 유지하지만 이번 시안에는 별도상태로 포함하지 않았습니다. 목록은 newsList 전체이며 상세본문의2개제한을 적용하지 않습니다. 날짜는 formatNamedDateWithDay(registerDate) 그대로 오늘. M.d(요일)/어제. M.d(요일) 등입니다. 제목과 선택적80x80사진, 행선택 StoreNewsDetail(news)를 유지합니다. 빈목록은 기존 emptyEventsUrl의 empty_event.png 150x150와 등록된 데이터가 없어요. 문구입니다. 원래 등톡된 데이터가 없어요. 오타만 사용자 승인으로 수정했습니다. 상세 제목은 매장 소식, 등록일 : yyyy.M.d HH.mm 오른쪽, 제목 가운데, 구분선, 본문, 있을 때만 하단 전체너비 사진 순서입니다. 사진비율을 유지하고 본문줄바꿈을 보존하세요. 댓글·공유·좋아요·검색·정렬·작성버튼을 추가하지 않습니다. 목록 로드/API/오류알림/상세이동은 기존로직 유지이며 캔버스에 실제동작을 구현하지 않습니다. updateItem/appBar/surface/thumbnail 및 OG토큰을 재사용합니다. 렌더러 design-system/pages/home/news-pages.mjs, CSS news-pages.css. 샘플문구·날짜·사진은 예시입니다.';
