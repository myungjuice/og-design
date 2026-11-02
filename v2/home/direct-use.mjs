import {escapeHTML as e} from '../../design-system/components/core.mjs';
import {button,iconButton} from '../../design-system/components/button/render.mjs';
import {publicStoreData} from '../../design-system/pages/home/public-store-data.mjs';
import {renderHomeStoreScreen} from './store.mjs';
import {renderThumbnail,setupMedia} from '../components/media.mjs';

// Static review specimens, not transaction forms or server-verified receipts.
const store=publicStoreData.store;
const transaction=Object.freeze({amount:10000,available:190000,held:192000,code:'4368',usedAt:'15:30:05'});
const number=value=>value.toLocaleString('ko-KR');
const bolt='<img src="/assets/material/bolt-rounded.svg" width="20" height="20" alt="" aria-hidden="true">';
const back='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>';
const check='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 12 4 4 8-8"/></svg>';
const action=(label,variant='primary',className='',iconHTML='')=>button({label,variant,className:'v2-button du-action '+className,iconHTML,attributes:{inert:true}});
const summaryRow=(label,value,cls='')=>`<div class="du-summary-row ${cls}"><dt>${e(label)}</dt><dd>${e(value)}</dd></div>`;
function shell(title,body,footer,state=''){
 return `<article class="du-screen" data-du-state="${e(state)}" aria-label="${e(title)} 시안"><header class="du-header">${iconButton({label:'뒤로가기',className:'v2-icon-button du-back',iconHTML:back,attributes:{'data-face':'plain',inert:true}})}<h2>${e(title)}</h2><span></span></header><main class="du-body">${body}</main><footer class="du-footer">${footer}</footer></article>`;
}
function storeIdentity(){
 return `<section class="du-store"><div class="du-store-icon">${renderThumbnail({src:store.logo,alt:store.name+' 로고',fit:'contain',decorative:true})}</div><div><span>마일리지 사용할 매장</span><h3>${e(store.name)}</h3><p>${e(store.address)}</p></div></section>`;
}
export function renderDirectUseEntry({appearance='quick'}={}){
 if(!['quick','capsule'].includes(appearance))throw new RangeError('Unsupported entry appearance');
 const gloss=appearance==='quick'?'<img class="du-entry-gloss" src="/assets/figma-home-20261020/d146b.svg" width="47" height="45" alt="" aria-hidden="true">':'';
 const entry=action('바로사용','primary','du-entry'+(appearance==='quick'?' du-entry-quick':''),bolt+'<span>바로사용</span>'+gloss);
 return renderHomeStoreScreen().replace('class="v2-home-store-frame"','class="v2-home-store-frame du-store-screen"').replace('<div class="og-store-photo">','<div class="og-store-photo">'+entry);
}
export function renderDirectUseAmount(){
 const {amount,available,held}=transaction;
 return shell('바로사용',`${storeIdentity()}<section class="du-intro"><span class="du-eyebrow">마일리지 사용</span><h1>얼마를 사용할까요?</h1><p>결제할 금액에 맞춰 마일리지를 선택해 주세요.</p></section><div class="du-available"><span>사용 가능 마일리지</span><strong>${number(available)} <small>M</small></strong></div><section class="du-wheel-area" aria-label="사용할 금액 선택 예시"><h3>사용할 마일리지</h3><div class="du-wheel" role="img" aria-label="휠 선택 예시: 10,000 M 선택"><div class="du-wheel-fade" aria-hidden="true">—</div><div>5,000 M</div><strong>${number(amount)} <small>M</small></strong><div>15,000 M</div><div class="du-wheel-fade">20,000 M</div></div><p>최소 5,000 M · 5,000 M 단위로 선택</p></section><dl class="du-summary">${summaryRow('보유 마일리지',number(held)+' M')}${summaryRow('사용 가능 마일리지',number(available)+' M')}${summaryRow('사용 후 사용 가능',number(available-amount)+' M','du-summary-total')}</dl><p class="du-location">매장에서 500m 이내에 있을 때 사용할 수 있어요.</p>`,action(number(amount)+' M 사용하기'),'amount');
}
export function renderDirectUseConfirmation(state='active'){
 if(!['active','expired','stale'].includes(state))throw new RangeError('Unsupported confirmation state');
 const expired=state==='expired',stale=state==='stale',normal=state==='active';
 const title=expired?'확인 시간이 지났어요':stale?'최신 상태 확인이 필요해요':'매장에 이 화면을 보여주세요';
 const copy=expired?'확인 화면만 만료되었어요.\n완료된 사용 내역은 그대로 유지돼요.':stale?'연결 상태를 확인해 주세요.\n점주 확인 전 최신 사용 상태 확인이 필요해요.':'마일리지 사용이 완료되었어요.\n남은 시간 안에 점주에게 보여주세요.';
 const status=expired?'확인 시간 만료':stale?'상태 확인 필요':'서버 확인 완료';
 const receipt=`<section class="du-proof" data-proof-state="${state}"><div class="du-proof-status">${normal?check:''}<span>${status}</span></div><p class="du-proof-store">${e(store.name)}</p><div class="du-proof-amount">${number(transaction.amount)} <small>M 사용</small></div><div class="du-motion" aria-hidden="true"><i></i><i></i><i></i><span>${normal?check:expired?'−':'!'}</span></div><span class="du-code-label">확인 번호</span><strong class="du-code">${transaction.code}</strong><div class="du-timer"><span>${expired?'확인 시간 종료':stale?'남은 시간 확인 필요':'남은 확인 시간'}</span><strong>${normal?'2:33':expired?'0:00':'—:—'}</strong></div><div class="du-proof-clock"><span>${stale?'마지막 확인 시각':'현재 시각'}</span><time>${expired?'15:33:05':'15:30:32'}</time></div></section>`;
 return shell('바로사용 확인',`<section class="du-intro du-confirm-intro"><span class="du-eyebrow">${expired?'확인 종료':stale?'연결 상태 확인':'사용 완료'}</span><h1>${title}</h1><p>${e(copy).replaceAll('\n','<br>')}</p></section>${receipt}<dl class="du-summary du-receipt-summary">${summaryRow('사용 일시','2026.11.02 '+transaction.usedAt)}${summaryRow('사용 마일리지',number(transaction.amount)+' M')}${summaryRow('사용 후 사용 가능',number(transaction.available-transaction.amount)+' M')}</dl><p class="du-location">${expired?'이미 사용한 마일리지가 자동으로 반환되지는 않아요.':stale?'상태 확인 전에는 사용을 다시 시도하지 마세요.':'확인 화면은 사용 후 3분 동안 유효해요.'}</p>`,action('확인'),'confirm-'+state);
}
const styles=['/v2/tokens.css','/v2/components/button.css','/v2/components/icon-button.css','/v2/components/media.css','/v2/home/store.css','/v2/home/direct-use.css'];
function specimen(key,label,html){
 return `<figure class="du-review-figure"><figcaption>${e(label)}</figcaption><div class="du-review-host" data-direct-use-screen="${e(key)}"><template>${styles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}${html}</template></div></figure>`;
}
function section(id,title,copy,specimens){
 return `<section id="${id}" hidden data-review-screen data-review-status="pending" data-review-since="2026-11-02T00:00:00+09:00"><h2>${title}</h2><p class="du-review-description"><span>사용자 검토 대기</span> ${copy}</p><div class="du-review-grid">${specimens.map(args=>specimen(...args)).join('')}</div></section>`;
}
export function renderDirectUseReview(){
 return '<link rel="stylesheet" href="/v2/home/direct-use-review.css">'+[
  section('direct-use-entry','바로사용 · 진입 버튼 2안 비교','A안은 캡슐형, B안은 바로적립과 같은 원형·보라색 입체감·광택을 사용한 제안입니다. 두 안 모두 검토용이며, 기존 상세는 매장 메뉴에 보존했습니다.',[['entry-capsule','A안 · 캡슐형',renderDirectUseEntry({appearance:'capsule'})],['entry-after','B안 · 원형',renderDirectUseEntry()]]),
  section('direct-use-amount','바로사용 · 금액 선택','매장명을 먼저 확인하고 휠에서 금액을 선택합니다. 보유 총액과 사용 가능한 금액을 구분했습니다. 금액 선택·사용 버튼은 실행하지 않는 정적 시안입니다.',[['amount','10,000 M 선택 예시',renderDirectUseAmount()]]),
  section('direct-use-confirm','바로사용 · 점주 확인·만료','같은 거래의 정상·만료·연결 지연 상태를 비교합니다. 점주는 사용 완료 사실만 확인하며 별도 승인하지 않습니다. 금액·시간·번호와 보안 모션은 정지된 예시입니다.',[['confirm-active','사용 완료 · 남은 시간 2:33',renderDirectUseConfirmation()],['confirm-expired','3분 경과 · 확인 화면 만료',renderDirectUseConfirmation('expired')],['confirm-stale','연결 지연 · 최신 상태 확인 필요',renderDirectUseConfirmation('stale')]])
 ].join('');
}
export function setupDirectUseReview(root){
 for(const host of root.querySelectorAll('[data-direct-use-screen]')){
  if(host.shadowRoot)continue;
  const template=host.querySelector('template'),shadow=host.attachShadow({mode:'open'});
  shadow.append(template.content.cloneNode(true));template.remove();setupMedia(shadow);
  const screen=shadow.querySelector('.du-screen,.v2-home-store-frame');
  const resize=()=>{const scale=Math.min(1,host.clientWidth/390);screen.style.zoom=scale;host.style.height=Math.ceil(screen.offsetHeight*scale)+'px';};
  new ResizeObserver(resize).observe(host);new ResizeObserver(resize).observe(screen);resize();
 }
}
