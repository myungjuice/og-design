import test from 'node:test';
import assert from 'node:assert/strict';
import {renderMyLandDetailScreen,renderMyLandAttendanceFeedbackScreen,myLandDetailGroups} from './myland-details.mjs';
import {renderOfficialEventList,renderOfficialEventDetail} from './og-park/events.mjs';
import {renderContestScreen} from './og-park/contests.mjs';
import {renderCommunityFeed} from './og-park/community.mjs';
import {reviewWrite} from '../design-system/pages/my-info/review-write.mjs';
import {renderReviewPatterns} from './components/review-patterns.mjs';

test('latest seven-day reward is base one plus bonus one, with no old mileage reward',()=>{
 for(const render of [renderMyLandDetailScreen,renderMyLandAttendanceFeedbackScreen]){
  const milestone=render('attendance-milestone'),daily=render('attendance-daily');
  assert.match(milestone,/1\+1장/);assert.doesNotMatch(milestone,/50 M|milestone-reward\.png/);
  assert.match(daily,/7일 연속[\s\S]*티켓 1\+1장/);
  assert.match(milestone,/14일 연속[\s\S]*티켓 5장 \+ 100 M/);
 }
});
test('removed roulette odds cannot be rendered and ticket shortage leads to member stores',()=>{
 assert.ok(!myLandDetailGroups.flatMap(g=>g.items).some(x=>x.id==='roulette-odds'));
 assert.throws(()=>renderMyLandDetailScreen('roulette-odds'),RangeError);
 assert.doesNotMatch(renderMyLandDetailScreen('roulette-ready'),/md-help|roulette-odds/);
 const empty=renderMyLandDetailScreen('limit-ticket');
 assert.match(empty,/회원점에서 마일리지를 적립하거나 리뷰를 남기면 티켓을 드려요\./);
 assert.match(empty,/href="\/v2\/home\/">가까운 회원점 찾기/);
});
test('event summary removes repeated bonus only, detail benefit remains',()=>{
 assert.doesNotMatch(renderOfficialEventList(),/<b>보너스/);
 assert.match(renderOfficialEventList(),/pd-event-period/);
 assert.match(renderOfficialEventDetail('automatic'),/이벤트 보너스[\s\S]*1,000 M/);
});
test('contest states share medals and photo metadata, participation terms start closed',()=>{
 for(const state of ['detail','judging','result']){
  const html=renderContestScreen(state);
  assert.match(html,/og-rank-medals/);
  assert.match(html,/pd-cover-meta[\s\S]*324명 참여/);
 }
 const detail=renderContestScreen('detail');
 assert.match(detail,/og-participation-steps/);
 assert.match(detail,/<details class="og-participation-terms">/);
});
test('community has five compact posts and accessible local reaction controls',()=>{
 const html=renderCommunityFeed();
 assert.equal((html.match(/class="pd-post"/g)||[]).length,5);
 assert.equal((html.match(/aria-label="좋아요" aria-pressed="false"/g)||[]).length,5);
 assert.doesNotMatch(html,/aria-label="게시글 메뉴">···/);
 assert.match(html,/pd-comments/);
});
test('photo review saving requires photos and accepts at most fifty characters',()=>{
 const save=html=>html.match(/<button[^>]*>변경 내용 저장<\/button>/)?.[0];
 assert.match(save(reviewWrite({body:'좋아요'})),/disabled/);
 assert.doesNotMatch(save(reviewWrite({body:'가'.repeat(50),photos:[{id:'one',src:''}]})),/disabled/);
 assert.match(save(reviewWrite({body:'가'.repeat(51),photos:[{id:'one',src:''}]})),/disabled/);
 assert.match(reviewWrite(),/maxlength="50"/);
});
test('catalog reuses the final map crown, BEST label and participation renderers',()=>{
 const html=renderReviewPatterns();
 assert.match(html,/landmark-wrapped/);assert.match(html,/data-store-best-label="neon"/);
 assert.match(html,/og-participation-steps/);assert.match(html,/마스코트 신규 제작이 포함되지 않습니다/);
});
