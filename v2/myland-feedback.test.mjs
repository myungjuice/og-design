import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from './render.mjs';
import {renderMyLandFeedbackScreen,renderMyLandFeedbackReview} from './myland-feedback.mjs';
import {reviewGroups} from './subnavigation.mjs';

test('마이랜드 보조 메뉴에서 기존 이관 시안 뒤에 확정안으로 이동한다',()=>{
 const groups=reviewGroups('my-land');
 assert.deepEqual(groups.map(group=>group.id),['myland-design','myland-feedback']);
 const html=renderWorkspace({pageId:'my-land'});
 assert.match(html,/id="myland-design"/);
 assert.match(html,/id="myland-feedback" data-review-screen/);
 assert.equal((html.match(/data-myland-feedback-screen=/g)||[]).length,1);
 assert.match(html,/주간 출석 · C안 옐로·오렌지/);
 assert.doesNotMatch(renderMyLandFeedbackReview(),/월간/);
});

test('확정 화면은 새 배경·컬러 게임 아이콘과 게임별 티켓을 보여준다',()=>{
 const weekly=renderMyLandFeedbackScreen('weekly');
 for(const html of [weekly]){
  assert.doesNotMatch(html,/사용 가능 M|공유 적립 M|15,000 M|1,250/);
  assert.match(html,/룰렛/);
  assert.match(html,/퍼즐/);
  assert.match(html,/<strong>57<\/strong>/);
  assert.equal((html.match(/<strong>57<\/strong>/g)||[]).length,2);
  for(const file of ['c-background.png','c-roulette.png','c-puzzle.png'])assert.ok(html.includes(file),file);
 }
 assert.match(weekly,/class="week-grid"/);
 for(const label of ['마이랜드','룰렛','퍼즐','이번주 미션','출석하기','방문하기','공유하기','내 바코드'])assert.ok(weekly.includes(label),label);
});

test('주간 오늘은 숫자 없는 빈 원이며 날짜 구분점을 붙여 쓴다',()=>{
 const html=renderMyLandFeedbackScreen('weekly');
 for(const label of ['일·11','월·12','화·오늘','수·14','목·15','금·16','토·17'])assert.ok(html.includes(label),label);
 assert.match(html,/data-today[^>]*><\/span>/);
 assert.doesNotMatch(html,/calendar-key|reward-check/);
});
