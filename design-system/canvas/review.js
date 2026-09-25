import {boards,canvases,canvasFor} from './catalog.mjs';
import {activeCanvas,navigateCanvas} from './session.mjs';
import {focusReview} from './canvas.js?v=20260922-touch2';
import {reviewNotes} from './review-notes.mjs?v=20260925-barcode';
import {reviewState} from './review-policy.mjs';
import {escapeHTML as e} from '../components/core.mjs';
import {enrollSurfaceRollout,surfaceRolloutKey} from './surface-rollout.mjs';
const storageKey='og-design:review-status:v1';
const initial=[
 ['reservation-date','예약일 선택','예약 변경'],
 ['reservation-time','시간 선택','예약 변경'],
 ['reservation-empty','예약 가능한 시간이 없을 때','예약 변경'],
 ['reservation-people','예약 인원','예약 변경'],
 ['waiting-people','웨이팅 인원 변경','웨이팅 현황'],
 ['waiting-cancel','웨이팅 취소 확인','웨이팅 현황']
];
export function initializeReview(){
 const entries=initial.map(([key,title,group])=>({id:'review-'+key,key,title,group,ready:true,canvas:canvasFor('review-'+key),node:document.getElementById('review-'+key),initial:true}));
 for(const board of boards)entries.push({...board,key:'board-'+board.id,group:canvases.find(c=>c.id===board.canvas).title,node:document.getElementById(board.id)});
 const items=entries;let states={};
 try{const stored=JSON.parse(localStorage.getItem(storageKey));if(stored&&typeof stored==='object'&&!Array.isArray(stored))states=stored;}catch{}
 for(const key of ['surface-my-info','surface-explore','surface-store','home-depth-subtle','store-depth-subtle','home-depth-proposal','store-depth-proposal'])delete states[key];
 let rolloutEnrolled=false;try{rolloutEnrolled=localStorage.getItem(surfaceRolloutKey)==='done';}catch{}
 states=enrollSurfaceRollout(states,rolloutEnrolled);
 let polishEnrolled=false;try{polishEnrolled=localStorage.getItem('og-design:detail-polish:v1')==='done';}catch{}
 if(!polishEnrolled)for(const id of ['home-store','home-menu-detail','home-review-photo'])states['board-'+id]='pending';
 let mappingEnrolled=false;try{mappingEnrolled=localStorage.getItem('og-design:all-state-data:v1')==='done';}catch{}
 if(!mappingEnrolled)for(const id of ['home-menu-detail','home-store-reservation','home-store-waiting','home-store-news','home-store-event','home-news-list','home-news-detail','home-event-list','home-event-detail','home-store-reviews','home-review-list','home-review-photo'])states['board-'+id]='pending';
 let servicesEnrolled=false;try{servicesEnrolled=localStorage.getItem('og-design:public-services:v1')==='done';}catch{}
 if(!servicesEnrolled)for(const id of ['home-store-reservation','home-store-waiting'])states['board-'+id]='pending';
 let reviewsEnrolled=false;try{reviewsEnrolled=localStorage.getItem('og-design:public-reviews:v1')==='done';}catch{}
 if(!reviewsEnrolled)for(const id of ['home-store-reviews','home-review-list','home-review-photo'])states['board-'+id]='pending';
 let postsEnrolled=false;try{postsEnrolled=localStorage.getItem('og-design:public-posts:v1')==='done';}catch{}
 if(!postsEnrolled)for(const id of ['home-store-news','home-store-event','home-news-list','home-news-detail','home-event-list','home-event-detail'])states['board-'+id]='pending';
 let mapEnrolled=false;try{mapEnrolled=localStorage.getItem('og-design:naver-map:v1')==='done';}catch{}
 if(!mapEnrolled)for(const id of ['home-main','home-search','home-category','home-nearby'])states['board-'+id]='pending';
 let contentEnrolled=false;try{contentEnrolled=localStorage.getItem('og-design:public-content:v1')==='done';}catch{}
 if(!contentEnrolled)for(const id of ['home-store','home-main-menu','home-full-menu','home-menu-detail','home-store-info','home-store-location'])states['board-'+id]='pending';
 for(const item of items){const state=reviewState({id:item.id,ready:item.ready,initial:item.initial||Boolean(reviewNotes[item.key]?.length),saved:states[item.key]});if(state)states[item.key]=state;else delete states[item.key];}
 const noteHTML=key=>reviewNotes[key]?.length?'<div class="canvas-review-note"><strong>검토 메모</strong><ul>'+reviewNotes[key].map(note=>'<li>'+e(note)+'</li>').join('')+'</ul></div>':'';
 const trigger=document.querySelector('#review-toggle');
 const panel=document.createElement('dialog');panel.id='review-panel';panel.setAttribute('aria-labelledby','review-title');
 panel.innerHTML='<header><h2 id="review-title">검토할 항목</h2><button type="button" data-review-close aria-label="검토 목록 닫기">닫기</button></header><div class="review-tabs"><button type="button" data-review-tab="pending">검토 대기</button><button type="button" data-review-tab="done">검토 완료</button></div><div id="review-list"></div><p id="review-status" role="status"></p>';
 document.body.append(panel);let tab='pending';
 for(const item of items){
  if(!item.node)continue;
  const controls=document.createElement('div');controls.className='canvas-review-controls';controls.setAttribute('role','group');controls.setAttribute('aria-label',item.title+' 검토 상태');
  controls.innerHTML='<button type="button" data-review-set="pending">검토 항목</button><button type="button" data-review-set="done">검토 완료</button>';
  controls.onclick=event=>{const button=event.target.closest('[data-review-set]');if(button)setState(item.key,button.dataset.reviewSet)};
  item.node.prepend(controls);item.controls=controls;
  if(reviewNotes[item.key]?.length)controls.insertAdjacentHTML('afterend',noteHTML(item.key));
 }
 function save(){try{localStorage.setItem('og-design:detail-polish:v1','done');localStorage.setItem(storageKey,JSON.stringify(states));localStorage.setItem(surfaceRolloutKey,'done');localStorage.setItem('og-design:all-state-data:v1','done');localStorage.setItem('og-design:public-services:v1','done');localStorage.setItem('og-design:public-reviews:v1','done');localStorage.setItem('og-design:public-posts:v1','done');localStorage.setItem('og-design:naver-map:v1','done');localStorage.setItem('og-design:public-content:v1','done');panel.querySelector('#review-status').textContent='';}catch{panel.querySelector('#review-status').textContent='이 브라우저에서는 검토 상태를 저장할 수 없습니다.'}}
 function setState(key,value){states[key]=value;save();render()}
 function render(){
  const pending=items.filter(i=>states[i.key]==='pending'),done=items.filter(i=>states[i.key]==='done');
  trigger.textContent='검토할 항목 · '+pending.length;trigger.disabled=false;
  for(const item of items){
   if(!item.node)continue;
   item.controls.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(states[item.key]===b.dataset.reviewSet)));
   item.node.querySelectorAll(':scope > .history-state-label .og-badge,:scope > .screen-page-content > .screen-artboard > .history-state-label .og-badge').forEach(n=>{if(n.textContent==='New')n.hidden=states[item.key]==='done'});
  }
  panel.querySelectorAll('[data-review-tab]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.reviewTab===tab));b.textContent=(b.dataset.reviewTab==='pending'?'검토 대기 · '+pending.length:'검토 완료 · '+done.length)});
  const visible=tab==='pending'?pending:done;
  const groups=[...new Set(visible.map(i=>i.group))];
  panel.querySelector('#review-list').innerHTML=groups.length?groups.map(group=>'<section><h3>'+e(group)+'</h3>'+visible.filter(i=>i.group===group).map(i=>'<div class="review-row" data-review-row><button type="button" data-review-go="'+e(i.key)+'">'+e(i.title)+(!i.ready?' <span>작업 예정</span>':'')+'</button><button type="button" '+(tab==='pending'?'data-review-complete':'data-review-reopen')+'="'+e(i.key)+'">'+(tab==='pending'?'검토 완료':'다시 검토')+'</button>'+noteHTML(i.key)+'</div>').join('')+'</section>').join(''):'<p class="review-empty">'+(tab==='pending'?'검토할 항목이 없습니다.':'검토 완료한 항목이 없습니다.')+'</p>';
 }
 trigger.onclick=()=>{tab='pending';render();panel.showModal()};
 panel.addEventListener('close',()=>trigger.focus({preventScroll:true}));
 panel.onclick=event=>{
  const b=event.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-review-close'))panel.close();
  if(b.dataset.reviewTab){tab=b.dataset.reviewTab;render()}
  if(b.dataset.reviewGo){const item=items.find(i=>i.key===b.dataset.reviewGo);panel.close();item.canvas===activeCanvas?focusReview(item.id):navigateCanvas(item.canvas,item.id)}
  if(b.dataset.reviewComplete){setState(b.dataset.reviewComplete,'done');panel.querySelector('[data-review-tab="pending"]').focus()}
  if(b.dataset.reviewReopen){setState(b.dataset.reviewReopen,'pending');panel.querySelector('[data-review-tab="done"]').focus()}
 };
 save();render();
}
