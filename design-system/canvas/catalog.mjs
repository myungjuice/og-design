import {myInfoPages} from '../pages/my-info/manifest.mjs';
export const canvases=[['foundations','기본 스타일'],['components','공통 컴포넌트'],['explore','홈·매장 탐색'],['store','매장 상세'],['my-info','내 정보'],['barcode','바코드'],['my-land','마이랜드']].map(([id,title])=>({id,title}));
const rows=(canvas,data)=>data.map(([id,title])=>({id,title,canvas,ready:true}));
export const homeBoards=rows('explore',[['home-main','홈 지도'],['home-search','매장 검색·검색 결과'],['home-category','업종 선택'],['home-nearby','근처 보기']]).concat(rows('store',[['home-store','매장 상세'],['home-main-menu','주요 메뉴'],['home-full-menu','전체 메뉴'],['home-menu-detail','메뉴 상세'],['home-store-reservation','매장 예약'],['home-store-waiting','매장 웨이팅'],['home-store-news','매장 소식'],['home-store-event','매장 이벤트'],['home-news-list','소식 전체 목록'],['home-news-detail','소식 상세'],['home-event-list','이벤트 전체 목록'],['home-event-detail','이벤트 상세'],['home-store-reviews','매장 리뷰'],['home-review-list','포토 리뷰 전체 목록'],['home-review-photo','리뷰 사진 상세'],['home-store-info','매장 상세정보'],['home-store-location','위치찾기']]));
export const boards=[
 ...rows('barcode',[['barcode-main','바코드 · 마일리지 사용'],['barcode-v2','바코드 V2 · 기본 상태']]),
 ...rows('foundations',[['color','컬러'],['type','타이포그래피'],['space','간격과 크기'],['depth','표면과 입체감'],['system','토큰 사용 기준'],['icons','아이콘'],['layout','레이아웃'],['motion','상태와 모션'],['layers','겹침 순서']]),
 ...rows('components',[['buttons','버튼'],['inputs','입력'],['selection','선택 요소'],['tabs-chips','탭·칩'],['search','검색창'],['badges','배지·상태'],['avatar','프로필·썸네일'],['surfaces','카드·구분선'],['list-row','목록'],['section-heading','섹션 제목'],['progress','진행 표시'],['loading','로딩'],['feedback','피드백'],['help','툴팁·팝오버'],['quantity','수량 선택'],['sheet','바텀시트'],['dialogs','다이얼로그'],['snackbar','스낵바'],['date-time','날짜·시간 선택'],['attachments','이미지 보기·첨부']]),
 ...rows('my-land',[['my-land-main','마이랜드 메인'],['my-land-plaza','B · 작은 광장형'],['my-land-attendance','C · 출석 집중형'],['my-land-lounge','D · 게임 라운지형'],['my-land-blue-header','5번 · 상단 블루형'],['my-land-miniature','6번 · 정교한 미니어처'],['my-land-relief','7번 · 낮은 양각형'],['my-land-paper','8번 · 종이 조형형']]),
 ...homeBoards,...myInfoPages.map(b=>({...b,canvas:'my-info'})),
 ...rows('my-info',[['mileage-option-a','마일리지 비교안 A'],['mileage-option-b','마일리지 비교안 B'],['mileage-option-c','마일리지 비교안 C']])
];
export function canvasFor(id){if(id==='review-surface-explore')return 'explore';if(id==='review-surface-store')return 'store';if(id==='review-home-depth-subtle')return 'explore';if(id==='review-store-depth-subtle')return 'store';if(id==='review-home-depth-proposal')return 'explore';if(id==='review-store-depth-proposal')return 'store';if(id?.startsWith('review-'))return 'my-info';return boards.find(b=>b.id===id)?.canvas;}
export function resolveCanvas({search='',hash='',last}={}){
 const target=canvasFor(hash.replace(/^#/,'')),query=new URLSearchParams(search).get('canvas');
 return target||[query,last].find(id=>canvases.some(c=>c.id===id))||'foundations';
}
export const canvasHref=(id,target='')=>'?canvas='+encodeURIComponent(id)+(target?'#'+encodeURIComponent(target):'');
export const viewStorageKey=id=>'og-design:canvas-view:v2:'+id;
