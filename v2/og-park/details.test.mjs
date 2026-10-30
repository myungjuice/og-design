import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';

// Missing detail destinations must fail before implementation, even while old comparison routes work.
test('park detail destinations are available without replacing the approved comparison',()=>{
 const html=renderWorkspace({pageId:'og-park'});
 const ids=['park-events','park-event-detail','park-contests','park-contest-detail','park-contest-judging','park-contest-result','park-community-interests','park-community-feed'];
 const menu=reviewGroups('og-park').flatMap(g=>g.items.map(i=>i.id));
 for(const id of ids){assert.ok(menu.includes(id),id+' menu missing');assert.match(html,new RegExp('id="'+id+'"[^>]*data-review-screen'));}
 assert.match(html,/id="park-latest"/);assert.match(html,/id="park-comparison"/);
});

test('official events separate base accrual and bonus, with three participation methods and closed state',async()=>{
 const {renderOfficialEventList,renderOfficialEventDetail}=await import('./events.mjs');
 assert.match(renderOfficialEventList(),/오지고랜드 공식 이벤트/);
 const automatic=renderOfficialEventDetail('automatic');
 assert.match(automatic,/자동 참여 중/);assert.match(automatic,/기본 적립/);assert.match(automatic,/3%/);assert.match(automatic,/이벤트 보너스/);
 assert.match(renderOfficialEventDetail('draw'),/응모하기/);
 assert.match(renderOfficialEventDetail('visit'),/방문 인증/);
 assert.match(renderOfficialEventDetail('closed'),/이벤트가 종료되었어요/);
 assert.throws(()=>renderOfficialEventDetail('bad'),RangeError);
});

test('contest judging and result never offer an active submission action',async()=>{
 const {renderContestScreen}=await import('./contests.mjs');
 const detail=renderContestScreen('detail'),judging=renderContestScreen('judging'),result=renderContestScreen('result');
 assert.match(detail,/출품하기/);assert.match(judging,/내 출품작/);assert.match(judging,/심사 중/);
 assert.doesNotMatch(judging,/data-action="submit"/);assert.doesNotMatch(result,/data-action="submit"/);
 assert.match(result,/수상작/);assert.match(result,/M/);assert.doesNotMatch(result,/에어팟|AirPods/);
 assert.throws(()=>renderContestScreen('bad'),RangeError);
});

test('interest choices use all received business symbols and show the maximum-three rule',async()=>{
 const {interestCategories,renderInterestSelection,renderCommunityFeed}=await import('./community.mjs');
 assert.equal(interestCategories.length,23);assert.ok(!interestCategories.includes('전체'));
 assert.ok(interestCategories.includes('운동/스포츠/레저'));
 const selected=renderInterestSelection('selected');
 assert.match(selected,/최대 3개/);assert.equal((selected.match(/aria-pressed="true"/g)||[]).length,3);
 assert.match(selected,/건너뛰기/);assert.match(renderInterestSelection('empty'),/0 \/ 3/);
 const feed=renderCommunityFeed('latest');assert.match(feed,/회원점/);assert.match(feed,/일반 매장/);assert.match(feed,/우리 동네 5km/);
 assert.match(renderCommunityFeed('popular'),/인기순/);assert.match(renderCommunityFeed('empty'),/아직 이야기가 없어요/);
});

test('all new review specimens are static, pending, and reference local existing assets',async()=>{
 const {renderParkDetailsReview}=await import('./details.mjs');
 const html=renderParkDetailsReview();
 assert.match(html,/사용자 검토 대기/);assert.match(html,/2026-10-30T15:15:00\+09:00/);
 assert.equal((html.match(/data-park-detail-screen=/g)||[]).length,15);
 for(const [,path] of html.matchAll(/(?:src|href)="(\/[^"#]+)"/g))assert.ok(existsSync(new URL('../..'+decodeURIComponent(path),import.meta.url)),path);
 assert.doesNotMatch(html,/setInterval|autoplay|https?:\/\//);
});

test('my contest entry keeps the same photo and like count in judging, results and entry lists',async()=>{
 const {renderContestScreen}=await import('./contests.mjs');
 const judging=renderContestScreen('judging'),result=renderContestScreen('result');
 const ownPhoto=judging.match(/<section class="pd-own-entry">[\s\S]*?<img[^>]+src="([^"]+)"/)[1];
 const awardPhoto=result.match(/<img[^>]+src="([^"]+)"[^>]*><span>2등<\/span><strong>정성 가득한 한 상/)[1];
 assert.equal(awardPhoto,ownPhoto);
 for(const html of [judging,result])assert.match(html,/<strong>정성 가득한 한 상<\/strong><span>♡ 47<\/span>/);
});
