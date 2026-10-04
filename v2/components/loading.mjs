import {loading,skeletonRow} from '../../design-system/components/loading/render.mjs';
import {surface} from '../../design-system/components/surfaces/render.mjs';
import {escapeHTML as e,attributes as attrs,uid} from '../../design-system/components/core.mjs';
import {renderListRow} from './list-row.mjs';
import {renderMileage} from './mileage.mjs';

export function renderLoading({label='불러오는 중',size='regular',live=false}={}){
 if(!label.trim())throw new TypeError('Loading requires a visible label');
 if(!['regular','small'].includes(size))throw new RangeError('Unsupported loading size');
 const markup=loading({label,size:size==='small'?'small':undefined}).replace('class="og-loading"','class="og-loading v2-loading"');
 return live?markup:markup.replace(' role="status"','');
}
// HTML slots are trusted component markup, never user-authored HTML.
export function renderLoadingFrame({label='',contentHTML='',skeletonHTML='',busy=true,id=uid('v2-loading'),className=''}={}){
 if(!label.trim())throw new TypeError('Loading frame requires a descriptive label');
 if(typeof busy!=='boolean')throw new TypeError('Loading busy state must be boolean');
 return '<div class="og-loading-frame v2-loading-frame'+(className?' '+e(className):'')+'"'+attrs({id,'aria-label':label,'aria-busy':String(busy)})+'><div data-content aria-hidden="'+busy+'"'+attrs({inert:busy})+'>'+contentHTML+'</div><div data-skeleton aria-hidden="true"'+attrs({hidden:!busy,inert:true})+'>'+skeletonHTML+'</div></div>';
}
export function renderLoadingRow({kind='list',title,subtitle,busy=true}={}){
 if(!['profile','list'].includes(kind))throw new RangeError('Unsupported loading row kind');
 const profile=kind==='profile';
 title??=profile?'맑은 땅콩 님':'스시산원 반주헌';subtitle??=profile?'프로필 캐릭터 선택':'최근 방문 · 09.24 목';
 const contentHTML=renderListRow({title,description:subtitle,art:profile?'account':'receipt',interactive:false});
 const skeletonHTML=skeletonRow({shape:profile?'circle':'square'}).replace('data-skeleton aria-hidden="true" ','');
 return surface({className:'v2-list-card',contentHTML:renderLoadingFrame({label:profile?'프로필 요약':'방문 내역',contentHTML,skeletonHTML,busy,className:'v2-loading-row'})});
}
export function renderLoadingMileage({busy=true,balance={}}={}){
 const card=renderMileage(balance),boundary=card.indexOf('>'),contentHTML=card.slice(boundary+1,-6);
 // Keep the exact shared card's typography and wrapping as the sizing source.
 // Only its visual content is masked; no independent mileage layout or fake 0 M.
 const skeletonHTML=contentHTML.replace(/<img class="m-coin"[^>]*>/,'<span class="m-coin og-skeleton" aria-hidden="true"></span>');
 return card.slice(0,boundary+1)+renderLoadingFrame({label:'OG 마일리지',contentHTML:contentHTML.replace(/<button /g,'<button disabled '),skeletonHTML,busy,className:'v2-loading-mileage'})+'</div>';
}
export function renderLoadingSamples(){
 const samples=[['profile','프로필 요약',renderLoadingRow({kind:'profile'})],['list','방문 내역',renderLoadingRow()],['mileage','마일리지 카드',renderLoadingMileage()]];
 return '<section class="v2-component-section" id="loading" aria-labelledby="loading-title" hidden><h2 id="loading-title">로딩·스켈레톤</h2><p>내용을 불러오는 동안에도 들어올 자리를 유지합니다. 바깥 카드의 3D 재질은 그대로 두고, 임시 면은 평면으로 표현합니다.</p>'+
 '<div class="v2-loading-indicators"><figure class="v2-component-sample"><figcaption><strong>기본 · 24px</strong></figcaption>'+renderLoading()+'</figure><figure class="v2-component-sample"><figcaption><strong>작은 표시 · 16px</strong></figcaption>'+renderLoading({label:'처리 중',size:'small'})+'</figure></div>'+
 '<label class="v2-loading-tools">표시 상태<select data-loading-state><option value="loading">불러오는 중</option><option value="ready">내용 표시</option></select></label><p class="v2-loading-status" data-loading-status role="status" aria-live="polite" aria-atomic="true"></p>'+
 '<div class="v2-loading-grid">'+samples.map(([kind,label,html])=>'<figure class="v2-component-sample" data-loading-example="'+kind+'"><figcaption><strong>'+label+'</strong></figcaption>'+html+'</figure>').join('')+'</div>'+
 '<ul class="v2-loading-rules"><li>모양이 정해진 카드·목록은 스켈레톤으로, 짧은 처리 상태는 작은 로딩 표시로 안내합니다.</li><li>불러오는 중에는 금액이나 진행률을 0으로 표시하지 않습니다. 실제 내용을 기다리는 상태와 구분합니다.</li><li>회색 면에는 그림자나 입체 효과를 넣지 않습니다. 움직임 줄이기 설정에서는 정지합니다.</li><li>내용 표시 상태는 크기 비교용입니다. 마일리지 영역은 기존 공통 카드와 같은 렌더러·에셋이며 버튼은 연결하지 않습니다.</li></ul></section>';
}
export function setupLoadingSamples(root){
 const section=root.querySelector('#loading'),select=section?.querySelector('[data-loading-state]');
 if(!select||select.dataset.ready)return;select.dataset.ready='true';
 select.addEventListener('change',()=>{
  const busy=select.value==='loading';
  for(const frame of section.querySelectorAll('.v2-loading-frame')){
   frame.setAttribute('aria-busy',String(busy));
   const content=frame.querySelector(':scope>[data-content]'),skeleton=frame.querySelector(':scope>[data-skeleton]');
   content.setAttribute('aria-hidden',String(busy));content.inert=busy;skeleton.hidden=!busy;
  }
  section.querySelector('[data-loading-status]').textContent=busy?'내용을 불러오는 중입니다.':'내용 예시를 표시했습니다.';
 });
}
