import {renderFigmaNavigation} from '../components/figma-navigation.mjs';
const base='/assets/figma-ogpark-20261021/';
const img=(file,cls='',width,height=width)=>`<img src="${file.startsWith('/')?file:base+file}" class="${cls}" alt="" aria-hidden="true" width="${width}" height="${height}" draggable="false">`;
const events=[
 {title:'9월 첫 적립<br>더블 이벤트',art:'b5b7b.png'},
 {title:'포토리뷰 쓰고<br>300 마일리지 받기',art:'c528d.png'},
 {title:'9월 첫 적립<br>더블 이벤트',art:'b5b7b.png'}
];
function sparkles(){return `<div class="park-sparkles" aria-hidden="true">${['073f1.svg','542c7.svg','1bd7e.svg','b674a.svg','cfcaa.svg'].map((file,i)=>img(file,'spark spark-'+i,i===0?27:i===1?19:i===2?15:i===3?27:11)).join('')}</div>`;}
function card(index,revised,feedback=false){
 const title=revised?events[index].title:'9월 첫 적립<br>더블 이벤트';
 const art=feedback&&index===2?'/assets/gasong-feedback-20261023/park-gift.png':revised?events[index].art:'b5b7b.png';
 return `<article class="park-event event-${index}" data-park-card data-position="${index===0?'center':index===1?'next':'previous'}" aria-label="이벤트 ${index+1}" aria-hidden="${index!==0}">
 ${img(art,'park-event-art',196)}${sparkles()}
 <div class="park-tags"><span>공식</span><span>D-12</span></div>
 <div class="park-event-copy"><h4>${title}</h4><small>09.01 ~ 12.31</small></div>
 ${!revised?'<span class="park-original-count">1 | 3</span>':''}</article>`;
}
function banner(revised,feedback=false){return `<section class="park-carousel" aria-label="이벤트 배너 시안">
 <div class="park-banner-window">${[0,1,2].map(i=>card(i,revised,feedback)).join('')}</div>
 ${revised?'<span class="park-banner-count" aria-label="배너 1 / 3">01 | 03 <span aria-hidden="true">+</span></span>':''}</section>`;}
function contest(){return `<section class="park-contest" data-park-contest aria-label="공모전 배너">${img('cb206.png','park-trophy',80)}${img('70193.png','park-trophy',80)}<div><strong>사진 출품하고 1등 상금 도전하자!</strong><div class="park-countdown" aria-label="마감 시간 예시"><span>13</span> : <span>01</span> : <span>38</span> : <span>45</span></div></div>${img('e859d.png','park-camera',60)}${img('ca749.png','park-camera',60)}</section>`;}
function interests(revised){return `<section class="park-interests"><header><h4>내 관심 업종</h4><span>수정하기 ›</span></header><div class="park-category-row">${(revised?['한식','카페/베이커리','헤어/뷰티']:['음식점','카페','미용']).map((label,i)=>`<div class="park-category">${i===0?img('a7e68.png','',111,140):i===1?img('4e2af.png','park-cafe-back',111,140)+img('6bfaa.png','park-cafe-middle',111,140)+img('0366b.png','',111,140):img('f968b.png','',111,140)}<span>${label}${img('135db.svg','park-category-arrow',18)}</span></div>`).join('')}</div></section>`;}
function community(){return `<section class="park-community">${img('822bc.svg','park-community-symbol',22)}<div><h4>커뮤니티 ›</h4><p>관심 업종 회원들과 이야기해요</p></div>${img('ac0f4.png','park-community-art',52)}</section>`;}
export function renderParkScreen(version='revised'){
 const feedback=version==='feedback',revised=version==='revised'||feedback;
 return `<div class="park-screen ${feedback?'revised feedback':version}"><div class="park-clouds">${img('e7ad9.png','',390,140)}</div><div class="park-forest">${img('5e49f.png','',390,140)}</div>
 <header class="park-title"><h3>오지파크</h3>${img('1e15d.svg','park-search',24)}</header>
 ${banner(revised,feedback)}${contest()}
 ${!revised?`<section class="park-duplicate" data-park-duplicate-event><strong>EVENT</strong><h4>포토리뷰 쓰고<br>300 마일리지를 받아보세요!</h4><small>09.01 ~ 12.31</small>${img('c528d.png','',140)}</section>`:''}
 ${interests(revised)}${community()}${renderFigmaNavigation({active:'오지파크'})}</div>`;
}
function frame(version,label){return `<figure class="park-figure"><figcaption><h3>${label}</h3></figcaption><div class="park-host" data-park-screen="${version}"><template><link rel="stylesheet" href="/v2/tokens.css"><link rel="stylesheet" href="/v2/components/figma-navigation.css"><link rel="stylesheet" href="/v2/og-park/screen.css">${version==='feedback'?'<link rel="stylesheet" href="/v2/og-park/feedback.css">':''}${renderParkScreen(version)}</template></div></figure>`;}
export function renderParkReview(){return `<link rel="stylesheet" href="/v2/og-park/review.css"><section id="park-comparison" data-review-screen><h2>기존 시안 ↔ 수정안 ↔ 피드백 반영본</h2><p class="park-review-intro">상단 이벤트 통합 · 하늘 여백 확대 · 중복 배너 삭제. 주황 공모전·관심 업종·커뮤니티·하단 메뉴는 유지했습니다.</p><div class="park-review-grid">${frame('original','기존 시안')}${frame('revised','수정안')}${frame('feedback','가송님 피드백 반영본 · 10/23')}</div><p class="park-review-note">PDF 공유용 고정 시안입니다. 날짜·마감 시간·이벤트 내용은 샘플입니다.</p></section>`;}
export function setupParkReview(root){
 for(const host of root.querySelectorAll('[data-park-screen]')){
  const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});
  shadow.append(template.content.cloneNode(true));template.remove();
  const screen=shadow.querySelector('.park-screen');
  const resize=()=>{const scale=Math.min(1,host.clientWidth/390);screen.style.zoom=scale;host.style.height=(host.dataset.parkScreen==='original'?1021:932)*scale+'px';};
  new ResizeObserver(resize).observe(host);resize();
  // These destinations are not part of this comparison, so no dead interactive controls.
  for(const button of shadow.querySelectorAll('[data-figma-navigation] button')){button.disabled=true;button.tabIndex=-1;}
 }
}
