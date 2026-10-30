import {renderFigmaNavigation} from '../components/figma-navigation.mjs';
import {renderLatestParkInterests,useLatestParkAssets} from './latest.mjs';
import {renderFeedbackParkInterests} from './feedback-2.mjs';
import {renderGasongParkLower,useGasongParkAssets} from './gasong.mjs';
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
function interests(revised,emphasis=false){return `<section class="park-interests"><header><h4>${emphasis?'<svg class="park-interest-heart" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20S3 14.5 3 8.5C3 3.8 9 2.5 12 7c3-4.5 9-3.2 9 1.5C21 14.5 12 20 12 20Z"/></svg>':''}내 관심 업종</h4><span>수정하기 ›</span></header><div class="park-category-row">${(revised?['한식','카페/베이커리','헤어/뷰티']:['음식점','카페','미용']).map((label,i)=>`<div class="park-category">${i===0?img('a7e68.png','',111,140):i===1?img('4e2af.png','park-cafe-back',111,140)+img('6bfaa.png','park-cafe-middle',111,140)+img('0366b.png','',111,140):img('f968b.png','',111,140)}<span>${label}${img('135db.svg','park-category-arrow',18)}</span></div>`).join('')}</div></section>`;}
function community(){return `<section class="park-community">${img('822bc.svg','park-community-symbol',22)}<div><h4>커뮤니티 ›</h4><p>관심 업종 회원들과 이야기해요</p></div>${img('ac0f4.png','park-community-art',52)}</section>`;}
export function renderParkScreen(version='revised'){
 const gasong=version==='gasong-section'||version==='gasong-photo'||version==='final'||version==='feedback-4';
 const secondFeedback=version==='feedback-2',latest=version==='latest',emphasis=version==='interest',feedback=version==='feedback'||emphasis||latest||secondFeedback||gasong,revised=version==='revised'||feedback;
 const node=['final','feedback-4'].includes(version)?'':gasong?(version==='gasong-section'?'336:3620':'336:3986'):latest?'304:2931':'';
 const html=`<div class="park-screen ${feedback?'revised feedback':version}${emphasis?' interest-emphasis':''}${latest||secondFeedback||gasong?' latest':''}${secondFeedback?' feedback-2':''}${gasong?' '+(['final','feedback-4'].includes(version)?'gasong-section park-final'+(version==='feedback-4'?' park-fourth':''):version):''}"${node?` data-figma-node="${node}"`:''}><div class="park-clouds">${img('e7ad9.png','',390,140)}</div><div class="park-forest">${img('5e49f.png','',390,140)}</div>
 <header class="park-title"><h3>오지파크</h3>${img('1e15d.svg','park-search',24)}</header>
 ${banner(revised,feedback)}${contest()}
 ${!revised?`<section class="park-duplicate" data-park-duplicate-event><strong>EVENT</strong><h4>포토리뷰 쓰고<br>300 마일리지를 받아보세요!</h4><small>09.01 ~ 12.31</small>${img('c528d.png','',140)}</section>`:''}
 ${gasong?renderGasongParkLower(version):(secondFeedback?renderFeedbackParkInterests():latest?renderLatestParkInterests():interests(revised,emphasis))+community()}${renderFigmaNavigation({active:'오지파크'})}</div>`;
 return gasong?useGasongParkAssets(useLatestParkAssets(html)):latest||secondFeedback?useLatestParkAssets(html):html;
}
function frame(version,label){
 const gasong=version.startsWith('gasong-')||['final','feedback-4'].includes(version);
 return `<figure class="park-figure"><figcaption><h3>${label}</h3></figcaption><div class="park-host" data-park-screen="${version}"><template><link rel="stylesheet" href="/v2/tokens.css"><link rel="stylesheet" href="/v2/components/figma-navigation.css"><link rel="stylesheet" href="/v2/og-park/screen.css">${gasong||['feedback','interest','latest','feedback-2'].includes(version)?'<link rel="stylesheet" href="/v2/og-park/feedback.css">':''}${version==='interest'?'<link rel="stylesheet" href="/v2/og-park/interest.css">':''}${gasong||['latest','feedback-2'].includes(version)?'<link rel="stylesheet" href="/v2/og-park/latest.css">':''}${version==='feedback-2'?'<link rel="stylesheet" href="/v2/og-park/feedback-2.css">':''}${gasong?'<link rel="stylesheet" href="/v2/og-park/gasong.css">':''}${renderParkScreen(version)}</template></div></figure>`;
}
export function renderParkReview(){return `<link rel="stylesheet" href="/v2/og-park/review.css"><section id="park-latest" data-review-screen><h2>오지파크 · 4차 피드백 반영</h2><p class="park-review-intro">카드와 글자 크기는 유지하고, PDF 기준으로 박스·제목·사진·업종명 사이 간격을 정리했습니다.</p><div class="park-review-grid park-review-pair">${frame('final','이전 시안 · 관심 업종 3개 전체 표시')}${frame('feedback-4','4차 피드백 반영안 · 안쪽 여백 축소')}</div><p class="park-review-note">매장 수는 예시입니다.</p></section><section id="park-feedback-previous" data-review-screen><h2>이전 비교안 · 2차 피드백</h2><div class="park-review-grid park-review-pair">${frame('gasong-section','1안 · 보라색 섹션 강조')}${frame('gasong-photo','2안 · 사진 확대·커뮤니티 강조')}</div><div class="park-review-grid park-review-pair">${frame('latest','이전 시안 · 관심 업종 4개')}${frame('feedback-2','이전 반영안 · 관심 업종 3개')}</div></section><section id="park-interest-comparison" data-review-screen><h2>이전 비교안 · 관심 업종 강조</h2><p class="park-review-intro">3개 카드와 화면 높이를 유지했던 이전 검토안입니다.</p><div class="park-review-grid park-review-pair">${frame('feedback','이전 PDF 공유 시안')}${frame('interest','관심 업종 강조안 · 10/28')}</div><p class="park-review-note">최신 반영본은 ‘4차 피드백 반영’ 메뉴에서 확인할 수 있습니다.</p></section><section id="park-comparison" data-review-screen><h2>이전 시안 비교</h2><p class="park-review-intro">상단 이벤트 통합 · 하늘 여백 확대 · 중복 배너 삭제 과정을 남긴 비교안입니다.</p><div class="park-review-grid">${frame('original','기존 시안')}${frame('revised','수정안')}${frame('feedback','가송님 피드백 반영본 · 10/23')}</div><p class="park-review-note">PDF 공유용 고정 시안입니다. 날짜·마감 시간·이벤트 내용은 샘플입니다.</p></section>`;}
export function setupParkReview(root){
 for(const host of root.querySelectorAll('[data-park-screen]')){
  const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});
  shadow.append(template.content.cloneNode(true));template.remove();
  const screen=shadow.querySelector('.park-screen');
  const resize=()=>{const scale=Math.min(1,host.clientWidth/390);screen.style.zoom=scale;host.style.height=({original:1021,latest:1165,'feedback-2':1030,'gasong-section':975.193,'gasong-photo':989,final:975,'feedback-4':975}[host.dataset.parkScreen]||932)*scale+'px';};
  new ResizeObserver(resize).observe(host);resize();
  // These destinations are not part of this comparison, so no dead interactive controls.
  for(const button of shadow.querySelectorAll('[data-figma-navigation] button')){button.disabled=true;button.tabIndex=-1;}
 }
}
