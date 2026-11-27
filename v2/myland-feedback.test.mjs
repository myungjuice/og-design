import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from './render.mjs';
import {renderMyLandFeedbackScreen,renderMyLandFeedbackReview} from './myland-feedback.mjs';
import {reviewGroups} from './subnavigation.mjs';

test('마이랜드는 v1/v2 비교 없이 확정안에서 시작한다',()=>{
 const groups=reviewGroups('my-land');
 assert.equal(groups[0].id,'myland-feedback');
 const html=renderWorkspace({pageId:'my-land'});
 assert.doesNotMatch(html,/id="myland-design"|data-designer-screen="myland-v[12]"|v1·v2 비교/);
 assert.match(html,/id="myland-feedback" data-review-screen/);
 assert.equal((html.match(/data-myland-feedback-screen=/g)||[]).length,1);
 assert.match(html,/주간 출석 · C안 옐로·오렌지/);
 assert.doesNotMatch(renderMyLandFeedbackReview(),/월간/);
});

test('확정 화면은 새 배경·컬러 게임 아이콘과 게임별 티켓을 보여준다',()=>{
 const weekly=renderMyLandFeedbackScreen();
 for(const html of [weekly]){
  assert.doesNotMatch(html,/사용 가능 M|공유 적립 M|15,000 M|1,250/);
  assert.match(html,/오지빙글/);
  assert.match(html,/오지팡팡/);
  assert.match(html,/<strong>57<\/strong>/);
  assert.equal((html.match(/<strong>57<\/strong>/g)||[]).length,2);
  for(const file of ['backgrounds/winter.jpg','bear/greeting.png','c-roulette.png'])assert.ok(html.includes(file),file);
 }
 assert.doesNotMatch(weekly,/c-puzzle\.png/);
 for(const fruit of ['사과','오렌지','포도','배'])assert.ok(weekly.includes('aria-label="'+fruit+'"'));
 assert.match(weekly,/class="hero-label">마이랜드</);
 assert.match(weekly,/class="week-grid"/);
 for(const label of ['마이랜드','오지빙글','오지팡팡','이번주 미션','출석하기','방문하기','공유하기','내 바코드'])assert.ok(weekly.includes(label),label);
});

test('주간 오늘은 숫자 없는 빈 원이며 날짜 구분점을 붙여 쓴다',()=>{
 const html=renderMyLandFeedbackScreen();
 for(const label of ['일·11','월·12','화·오늘','수·14','목·15','금·16','토·17'])assert.ok(html.includes(label),label);
 assert.match(html,/data-today[^>]*><\/span>/);
 assert.doesNotMatch(html,/calendar-key|reward-check/);
});
