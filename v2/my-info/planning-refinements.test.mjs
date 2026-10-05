import test from 'node:test';
import assert from 'node:assert/strict';
import {renderMileageHistoryReview} from './mileage.mjs';
import {renderAccountSettingsReview} from './account-settings.mjs';
import {renderSupportPagesReview} from './support-pages.mjs';
import {reviewGroups} from '../subnavigation.mjs';

const gallery=(html,id)=>html.split('<section id="'+id+'"')[1]?.split('<section id="')[0]||'';
const states=html=>[...html.matchAll(/<template(?: [^>]*)?>([\s\S]*?)<\/template>/g)].map(m=>m[1]);

test('monthly mileage comparison retains the existing history and exposes all planning information',()=>{
 const html=renderMileageHistoryReview(),monthly=gallery(html,'mileage-monthly');
 assert.equal(states(gallery(html,'mileage-history')).length,4,'original specimens remain');
 assert.ok(monthly,'additional monthly comparison');
 for(const text of ['2026년 9월','이전 달','다음 달','유형 필터','적립','사용','게임','공유','+2,840 M','-5,000 M','+320 M','오형제황제누룽지탕','룰렛 당첨','윤*환님 적립','잔액'])assert.ok(monthly.includes(text),text);
 assert.ok(reviewGroups('my-info').flatMap(g=>g.items).some(i=>i.id==='mileage-monthly'&&!i.pending));
});

test('account gains a static nickname editor and shares the membership join date',()=>{
 const html=gallery(renderAccountSettingsReview(),'account');
 assert.ok(html.includes('data-source-state="nickname"'));
 assert.ok(html.includes('aria-label="닉네임 수정"'));
 const editor=states(html).at(-1);
 assert.ok(editor.includes('닉네임 수정'));
 assert.ok(editor.includes('og-account-overlay'));
 assert.ok(editor.includes('value="맑은 땅콩"'));
 for(const state of states(html)){
  assert.ok(!state.includes('2024-05-20'));
  for(const tag of state.matchAll(/<(?:button|input)\b[^>]*>/g))assert.match(tag[0],/\binert\b/);
 }
 assert.ok(states(html)[0].includes('2026-05-28'));
});

test('membership is a sheet over dimmed MyInfo in every related state',()=>{
 for(const state of states(gallery(renderAccountSettingsReview(),'membership'))){
  assert.ok(state.includes('v2-member-sheet'));
  assert.ok(state.includes('og-history-backdrop'));
  assert.ok(state.includes('og-history-scrim'));
 }
});

test('support adds the legacy optional permissions notice and corrects Kakao wording',()=>{
 const html=gallery(renderSupportPagesReview(),'support');
 assert.ok(html.includes('data-source-state="access"'));
 const notice=states(html).at(-1);
 for(const text of ['접근 권한 안내','카메라/갤러리','위치','알림','선택','사진 첨부','지도 조회','적립·사용','해당 기능','다른 기능'])assert.ok(notice.includes(text),text);
 assert.ok(html.includes('카카오톡 앱으로 이동'));
 assert.ok(!html.includes('카카로'));
});

test('night opt-in confirmation keeps the setting off until consent and stays static',()=>{
 const html=gallery(renderAccountSettingsReview(),'settings');
 assert.ok(html.includes('data-source-state="night"'),'night confirmation specimen');
 const night=states(html).at(-1);
 for(const text of ['야간 알림을 받으시겠어요?','21:00~08:00','취소','동의하기','og-settings-overlay'])assert.ok(night.includes(text),text);
 const switchLabel=[...night.matchAll(/<label\b[\s\S]*?<\/label>/g)].map(m=>m[0]).find(label=>label.includes('야간 알림'));
 assert.ok(switchLabel);
 assert.doesNotMatch(switchLabel,/<input\b[^>]*checked/,'consent preview has not enabled night setting');
 for(const tag of night.matchAll(/<(?:button|input)\b[^>]*>/g))assert.match(tag[0],/\binert\b/);
});

test('removing the duplicated services view preserves the actual four-tab usage view',async()=>{
 const {renderWorkspace}=await import('../render.mjs');
 const html=renderWorkspace({pageId:'my-info'});
 assert.doesNotMatch(html,/<section id="services"|href="#services"|data-review-group="services"/);
 assert.match(html,/<section id="use-history"/);
 for(const label of ['예약','웨이팅','Q오더','리뷰'])assert.ok(html.includes(label));
});
