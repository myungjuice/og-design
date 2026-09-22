import {myInfo} from '../pages/my-info/render.mjs';
import {mileage,sectionHeading} from '../components/index.mjs';
import {focusBoard} from './canvas.js?v=20260922-touch2';
const summary=mileage({available:15000,total:16000,max:20000,density:'compact'}).split('<div class="og-progress-track"')[0];
const note='<p class="mileage-variant-note"><strong>4,000M</strong> 더 적립하면<br>5,000M를 추가로 사용할 수 있어요.</p>';
const track='<div class="og-progress-track" role="img" aria-label="다음 5,000M 중 1,000M 적립, 20%"><span class="og-progress-fill" data-tone="brand" style="--progress-value:20%"></span></div>';
const variants=[
 {id:'mileage-option-a',title:'A · 전체 금액 + 안내',copy:'전체 보유량을 유지하면서 다음에 사용할 수 있는 금액을 안내합니다.',body:mileage({available:15000,total:16000,max:20000,density:'compact'})+note},
 {id:'mileage-option-b',title:'B · 다음 사용까지',copy:'바는 다음 5,000M까지의 진행도만 보여줍니다. 현재 사용 가능한 금액은 위에서 확인합니다.',body:summary+'<div class="mileage-next"><p class="mileage-next-title">다음 5,000M까지</p>'+track+'<div class="og-progress-caption"><span>1,000M 적립</span><strong>5,000M</strong></div>'+note+'</div>'},
 {id:'mileage-option-c',title:'C · 금액 관계 중심',copy:'그래프 없이 총 보유를 사용 가능 금액과 남은 금액으로 풀어 보여줍니다.',body:'<div class="mileage-breakdown"><p class="mileage-total"><span>총 보유</span><strong>16,000 M</strong></p><dl><div><dt><span class="og-progress-dot" data-tone="brand"></span>사용 가능</dt><dd class="mileage-value-brand">15,000 M</dd></div><div><dt>남은 마일리지</dt><dd>1,000 M</dd></div></dl>'+note+'<p class="mileage-shared"><span>공유 적립</span><strong>—</strong></p></div>'}
];
export const comparisonRegion=document.createElement('section');
comparisonRegion.id='mileage-comparison-region';comparisonRegion.className='system-region';
comparisonRegion.innerHTML='<header class="system-area-heading"><h2>마일리지 비교</h2><p>같은 금액 · 세 가지 표현</p></header>';
document.querySelector('#world').append(comparisonRegion);
export const comparisonPages=variants.map(v=>{
 const page=document.createElement('section');page.className='screen-page mileage-variant-page';page.id=v.id;
 page.innerHTML='<header class="screen-page-heading"><div><h2>'+v.title+'</h2></div></header><p class="mileage-variant-description">'+v.copy+'</p>'+myInfo();
 page.querySelector('.og-my-balance').innerHTML=sectionHeading({title:'마일리지',infoButton:true,action:'내역 보기'})+v.body;
 document.querySelector('#world').append(page);
 const button=document.createElement('button');button.type='button';button.textContent=v.title;button.onclick=()=>focusBoard(v.id);document.querySelector('.screen-nav').append(button);
 const option=document.createElement('option');option.value=v.id;option.textContent=v.title;document.querySelector('#board-picker optgroup:last-child').append(option);
 return page;
});
