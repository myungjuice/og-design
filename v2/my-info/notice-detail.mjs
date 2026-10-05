import {noticeDetail,noticeDetailBoard} from '../../design-system/pages/my-info/notice-detail.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';

const back='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
function adaptDetail(source){
 // Source owns authored body markup and the modified-date condition.
 // Only service controls are inert; the article remains keyboard-scrollable.
 return source.replace('class="og-notice-detail" inert','class="v2-notice-detail-frame"')
  .replace(/<span class="material-icons"[^>]*>[\s\S]*?<\/span>/,()=>back)
  .replace('class="og-icon-button','class="v2-icon-button og-icon-button')
  .replace('class="og-notice-article"','class="og-notice-article" role="region" aria-label="공지 본문 · 정적 시안" tabindex="0"')
  .replace(/<button(?! inert)\b/g,'<button inert').replace(/<a(?! inert)\b/g,'<a inert');
}
// bodyHTML follows the original renderer's authored-specimen-only contract.
export function renderNoticeDetail(options={}){return adaptDetail(noticeDetail(options));}
const cssFiles=['/v2/components/icon-button.css','/v2/my-info/notice-detail.css'];
const sample=(key,label,source)=>'<figure class="v2-reservation-review-sample" data-notice-detail-state="'+key+'"><figcaption>'+e(label)+'</figcaption><div class="v2-notice-detail-host"><template>'+cssFiles.map(href=>'<link rel="stylesheet" href="'+href+'">').join('')+adaptDetail(source)+'</template></div></figure>';
export function renderNoticeDetailReview(){
 const states=[...noticeDetailBoard().matchAll(/<section class="og-notice-detail"[\s\S]*?<\/article><\/section>/g)].map(match=>match[0]);
 if(states.length!==3)throw new Error('Notice detail source specimens changed');
 return '<section id="notice-detail" data-review-screen aria-labelledby="notice-detail-title" hidden><h2 id="notice-detail-title">공지 상세</h2><p class="v2-intro">공지 제목과 작성·수정 날짜, 본문을 확인하는 화면입니다.</p><div class="v2-reservation-review-grid v2-notice-detail-grid">'+sample('basic','기본 상태',states[0])+'</div><details class="v2-notice-detail-extra v2-reservation-extra"><summary>수정일 · 긴 제목과 본문</summary><div class="v2-reservation-review-grid v2-notice-detail-grid">'+sample('modified','수정일이 있는 공지',states[1])+sample('long','긴 제목과 본문',states[2])+'</div></details><p class="v2-intro">제목·날짜·본문은 배치 확인용 예시입니다. 뒤로가기와 본문 링크는 실행되지 않습니다.</p></section>';
}
export function setupNoticeDetailReview(root){
 const section=root.querySelector('#notice-detail');if(!section||section.dataset.reviewReady)return;
 const mount=scope=>{for(const host of scope.querySelectorAll('.v2-notice-detail-host')){
  if(host.shadowRoot)continue;
  const template=host.querySelector('template');host.attachShadow({mode:'open'}).append(template.content.cloneNode(true));template.remove();
 }};
 section.dataset.reviewReady='true';mount(section.querySelector('.v2-notice-detail-grid'));
 for(const details of section.querySelectorAll('.v2-notice-detail-extra')){if(details.open)mount(details);details.addEventListener('toggle',()=>{if(details.open)mount(details);});}
}
