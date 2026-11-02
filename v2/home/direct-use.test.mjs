import test from 'node:test';
import assert from 'node:assert/strict';
import {renderHomeStoreScreen} from './store.mjs';
import {renderDirectUseEntry,renderDirectUseAmount,renderDirectUseConfirmation,renderDirectUseReview} from './direct-use.mjs';
import {reviewGroups} from '../subnavigation.mjs';
import {renderWorkspace} from '../render.mjs';
test('direct use is additive; original store has no entry and new entry is inside photo',()=>{
 const old=renderHomeStoreScreen(),next=renderDirectUseEntry();
 assert.doesNotMatch(old,/du-entry/);
 assert.match(next,/<div class="og-store-photo">\s*<button[^>]*du-entry/);
 assert.match(next,/og-store-count/);
 assert.match(next,/바로사용/);
});
test('wheel and summary distinguish current available, total held and available after use',()=>{
 const html=renderDirectUseAmount();
 for(const text of ['오시 망원본점','5,000','10,000','15,000','190,000','192,000','180,000','사용 후 사용 가능','5,000 M 단위','10,000 M 사용하기'])assert.ok(html.includes(text),text);
 assert.match(html,/v2-button/);assert.match(html,/inert/);
 assert.doesNotMatch(html,/일일 한도|승인 요청/);
});
test('proof expiry and stale states cannot create another use or falsely verify the transaction',()=>{
 const normal=renderDirectUseConfirmation('active'),expired=renderDirectUseConfirmation('expired'),stale=renderDirectUseConfirmation('stale');
 for(const html of [normal,expired,stale])for(const text of ['4368','10,000','15:30:05','180,000'])assert.ok(html.includes(text),text);
 assert.match(normal,/2:33/);assert.match(normal,/서버 확인 완료/);
 assert.match(expired,/확인 시간이 지났어요/);assert.match(expired,/15:33:05/);assert.match(expired,/사용 내역은 그대로 유지/);
 assert.doesNotMatch(expired,/다시 사용|재결제|승인 요청/);
 assert.doesNotMatch(stale,/서버 확인 완료/);assert.match(stale,/최신 상태 확인이 필요해요/);
});
test('new review routes are reachable while original routes remain and all are pending',()=>{
 const ids=['direct-use-entry','direct-use-amount','direct-use-confirm'];
 const groups=reviewGroups('home'),html=renderDirectUseReview(),workspace=renderWorkspace({pageId:'home'});
 for(const id of ids){assert.ok(groups.some(g=>g.items.some(i=>i.id===id)));assert.ok(workspace.includes('id="'+id+'"'));}
 assert.equal((html.match(/data-review-status="pending"/g)||[]).length,3);
 assert.ok(groups.some(g=>g.items.some(i=>i.id==='store')));
 assert.match(html,/기존 상세/);
});
test('entry reuses the actual rounded Material symbol and headers use the shared icon control',()=>{
 assert.match(renderDirectUseEntry(),/assets\/material\/bolt-rounded\.svg/);
 assert.match(renderDirectUseAmount(),/class="og-icon-button v2-icon-button du-back"/);
 const summary=renderDirectUseAmount().match(/<dl class="du-summary">([\s\S]*?)<\/dl>/)?.[1]||'';
 assert.match(summary,/사용 가능 마일리지<\/dt><dd>190,000 M/);
 assert.match(summary,/사용 후 사용 가능<\/dt><dd>180,000 M/);
});
test('quick-family comparison reuses gloss while keeping earn artwork and capsule separate',()=>{
 const next=renderDirectUseEntry(),previous=renderDirectUseEntry({appearance:'capsule'}),review=renderDirectUseReview();
 assert.match(next,/du-entry-quick/);
 assert.match(next,/figma-home-20261020\/d146b\.svg/);
 assert.doesNotMatch(next,/ae1d9\.svg|바로적립<\/span>/);
 assert.doesNotMatch(previous,/du-entry-quick|d146b\.svg/);
 assert.match(review,/entry-capsule/);
});
test('entry review shows exactly two button choices and keeps the original detail in its existing route',()=>{
 const html=renderDirectUseReview(),entry=html.slice(html.indexOf('id="direct-use-entry"'),html.indexOf('id="direct-use-amount"'));
 assert.equal((entry.match(/data-direct-use-screen=/g)||[]).length,2);
 assert.match(entry,/A안 · 캡슐형/);assert.match(entry,/B안 · 원형/);
 assert.doesNotMatch(entry,/entry-before/);
 assert.match(renderWorkspace({pageId:'home'}),/<section id="store"/);
});
