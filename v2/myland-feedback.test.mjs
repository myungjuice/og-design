import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from './render.mjs';
import {renderMyLandFeedbackScreen} from './myland-feedback.mjs';
import {reviewGroups} from './subnavigation.mjs';

test('마이랜드 보조 메뉴에서 기존 이관 시안 뒤에 피드백 비교안으로 이동한다',()=>{
 const groups=reviewGroups('my-land');
 assert.deepEqual(groups.map(group=>group.id),['myland-design','myland-feedback']);
 const html=renderWorkspace({pageId:'my-land'});
 assert.match(html,/id="myland-design"/);
 assert.match(html,/id="myland-feedback" data-review-screen/);
 assert.equal((html.match(/data-myland-feedback-screen=/g)||[]).length,2);
});

test('피드백 화면은 요약 영역 없이 게임별 티켓과 주간·월간 출석을 보여준다',()=>{
 const weekly=renderMyLandFeedbackScreen('weekly');
 const monthly=renderMyLandFeedbackScreen('monthly');
 for(const html of [weekly,monthly]){
  assert.doesNotMatch(html,/사용 가능 M|공유 적립 M|15,000 M|1,250/);
  assert.match(html,/룰렛/);
  assert.match(html,/퍼즐/);
  assert.match(html,/<strong>57<\/strong>/);
  assert.match(html,/<strong>14<\/strong>/);
  assert.match(html,/fc001\.png/);
 }
 assert.match(weekly,/class="week-grid"/);
 assert.match(monthly,/class="month-grid"/);
});
