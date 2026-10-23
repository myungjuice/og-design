import test from 'node:test';
import assert from 'node:assert/strict';
import * as details from './myland-details.mjs';

test('두 출석 화면에만 원본 옆 피드백 비교본을 추가한다',()=>{
 const html=details.renderMyLandDetailsReview();
 assert.equal((html.match(/data-myland-detail=/g)||[]).length,12);
 assert.deepEqual([...html.matchAll(/data-myland-attendance-feedback="([^"]+)"/g)].map(match=>match[1]),['attendance-daily','attendance-milestone']);
 assert.equal((html.match(/가송님 피드백 반영본 · 10\/23/g)||[]).length,2);
 assert.equal((html.match(/href="\/v2\/myland-attendance-feedback.css"/g)||[]).length,2);
 for(const id of ['attendance-daily','attendance-milestone'])assert.match(details.renderMyLandDetailScreen(id),/class="md-bear"/);
});

test('출석 피드백 팝업은 곰 대신 해당 보상 이미지를 중심으로 표시한다',()=>{
 assert.equal(typeof details.renderMyLandAttendanceFeedbackScreen,'function');
 for(const [id,asset,amount,next] of [
  ['attendance-daily','attendance-ticket.png','1장','7일'],
  ['attendance-milestone','attendance-burst.png','3장','14일']
 ]){
  const html=details.renderMyLandAttendanceFeedbackScreen(id);
  const popup=html.slice(html.indexOf('<section class="md-dialog'));
  assert.match(html,/class="md-main-backdrop" inert aria-hidden="true"/);
  assert.ok(popup.includes(`/assets/gasong-feedback-20261023/${asset}`));
  assert.doesNotMatch(popup,/md-bear|bear-cutout/);
  assert.ok(popup.includes(amount));
  assert.ok(popup.includes(next+' 연속'));
  assert.match(popup,/<button[^>]*class="og-button v2-button"[^>]*data-variant="primary"[^>]*data-myland-destination="roulette-ready"/);
  assert.match(popup,/<button[^>]*class="og-button v2-button"[^>]*data-variant="secondary"[^>]*data-myland-destination="myland-feedback"/);
  assert.match(popup,/class="md-attendance-actions"/);
 }
 const daily=details.renderMyLandAttendanceFeedbackScreen('attendance-daily');
 const milestone=details.renderMyLandAttendanceFeedbackScreen('attendance-milestone');
 assert.match(daily,/티켓 3장 \+ 50 M/);
 assert.match(milestone,/50 M/);
 assert.match(milestone,/티켓 5장 \+ 100 M/);
 assert.equal((details.renderMyLandDetailsReview().match(/href="\/v2\/components\/button.css"/g)||[]).length,2);
});

test('출석 외 상태에는 피드백 출석 화면을 생성하지 않는다',()=>{
 assert.equal(typeof details.renderMyLandAttendanceFeedbackScreen,'function');
 assert.throws(()=>details.renderMyLandAttendanceFeedbackScreen('roulette-ready'),RangeError);
});
