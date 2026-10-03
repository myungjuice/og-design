import {renderMileageCard} from '../../screens/my-info-3d-test/mileage-card.mjs';
import {stateComparison} from './catalog.mjs';

// Shared markup and Figma assets; appearance is scoped in mileage.css.
export function renderMileage({available=15000,total=16000,shared=1250,sharedCount=3,...range}={}){
 for(const value of [available,total,shared,sharedCount]){
  if(!Number.isSafeInteger(value)||value<0)throw new RangeError('마일리지와 공유인 수는 0 이상의 정수여야 합니다.');
 }
 if(available>total)throw new RangeError('사용 가능 마일리지는 총 보유 마일리지를 넘을 수 없습니다.');
 return renderMileageCard({...range,available,total,shared,sharedCount,
  assetBase:'/screens/my-info-3d-test/media/figma/',className:'v2-mileage'});
}
export function renderMileageSamples(){
 const cases=[
  ['기본 잔액','사용 가능 15,000 M · 총 보유 16,000 M',{available:15000,total:16000,shared:1250,sharedCount:3}],
  ['사용 가능 금액 없음','총 보유 잔액은 있지만 사용 가능 금액은 0 M',{available:0,total:2400,shared:0,sharedCount:0}],
  ['잔액 0','두 진행 구간과 원형 표시점을 숨김',{available:0,total:0,shared:0,sharedCount:0}],
  ['진행바 상한','끝점에서도 원형 표시점이 바 안에 머무름',{available:20000,total:20000,shared:0,sharedCount:0}]
 ];
 const sample=([title,description,props])=>`<figure class="v2-component-sample"><figcaption><strong>${title}</strong><span>${description}</span></figcaption>${renderMileage(props)}</figure>`;
 return `<section class="v2-component-section" id="mileage" aria-labelledby="mileage-title" hidden><h2 id="mileage-title">마일리지 카드·진행바</h2>
 <p>내정보·바코드와 같은 렌더러와 Figma M 에셋을 사용합니다. 아래 금액은 검토용 예시입니다. 진행바는 드래그하지 않는 표시용입니다.</p>
 <div class="v2-mileage-grid">${sample(cases[0])}</div>
 ${stateComparison(`<div class="v2-mileage-grid">${cases.slice(1).map(sample).join('')}</div>`,'잔액별 비교')}
 <p class="v2-mileage-note">밝은 구간·흰 원: 사용 가능 마일리지 / 짙은 보라 구간: 총 보유 마일리지 / 배경 구간: 표시 범위의 나머지. 눈금 범위는 기존 시안을 유지하며, 사용 가능 금액의 계산 규칙이나 잔액 한도를 정하는 값은 아닙니다.</p>
 <p class="v2-mileage-feedback" role="status" aria-live="polite">안내·내역보기 버튼은 검토용입니다. 실제 회원 내역을 조회하지 않습니다.</p></section>`;
}
