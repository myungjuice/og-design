import {myInfo} from '../pages/my-info/render.mjs';
import {sectionHeading,button,mileage} from '../components/index.mjs';
import {focusBoard} from './canvas.js?v=20260922-touch2';

function money(value){return value.toLocaleString('ko-KR')+' M'}

function featuredBalance({available=15000,total=16000,max=20000,shared=0}={}){
 const source=document.createElement('div');
 source.innerHTML=mileage({available,total,max,shared:money(shared),density:'compact'});
 const track=source.querySelector('.og-progress-track').outerHTML;
 const caption=source.querySelector('.og-progress-caption').outerHTML;
 return '<div class="og-feedback-balance-top"><span class="og-feedback-coin" aria-hidden="true">M</span><div class="og-feedback-balance-main">'+
  sectionHeading({title:'사용 가능한 OG 마일리지',infoButton:true,action:'내역 보기'})+
  '<strong class="og-feedback-available">'+money(available)+'</strong></div></div>'+
  '<div class="og-feedback-balance-progress">'+track+caption+'</div>'+
  '<dl class="og-feedback-balance-details"><div><dt>총 보유 마일리지</dt><dd>'+money(total)+'</dd></div><div><dt>공유 적립</dt><dd>'+money(shared)+'</dd></div></dl>';
}

const variants=[
 {id:'my-info-mileage-feedback',title:'마일리지 · 디자이너 피드백안',note:'기존 3분할 요약 대신 사용 가능 금액을 먼저 읽고, 총 보유·공유 적립은 아래에서 확인합니다. 게이지는 기존과 같이 0~20,000 M입니다.',apply(screen){screen.querySelector('.og-my-balance').innerHTML=featuredBalance()}},
 {id:'my-info-review-feedback',title:'최근 방문 · 후기 버튼 수정안',note:'상단 내 리뷰는 가벼운 텍스트 링크로 두고, 매장별 후기 작성만 버튼으로 올렸습니다. 마일리지 영역은 원본 그대로입니다.',apply(screen){const action=screen.querySelector('.og-my-visit .og-text-button');action.outerHTML=button({label:'후기 작성',variant:'secondary',className:'og-feedback-review-button'})}}
];

export function createMyInfoFeedbackPages(){
 const pages=[];
 for(const variant of variants){
  const page=document.createElement('section');page.id=variant.id;page.className='screen-page my-info-feedback-page';page.dataset.family='my-info-feedback';
  page.innerHTML='<header class="screen-page-heading"><div><span>내 정보 · 피드백 비교안</span><h2>'+variant.title+'</h2></div></header><p class="my-info-feedback-note">'+variant.note+'</p><div class="screen-artboard">'+myInfo()+'</div>';
  variant.apply(page.querySelector('.og-my-info'));
  document.querySelector('#world').append(page);pages.push(page);
  const link=document.createElement('button');link.type='button';link.dataset.screenLink=variant.id;link.textContent=variant.title;link.onclick=()=>focusBoard(variant.id);document.querySelector('.screen-nav').append(link);
  const option=document.createElement('option');option.value=variant.id;option.textContent=variant.title;document.querySelector('#board-picker optgroup:last-child').append(option);
 }
 return pages;
}
