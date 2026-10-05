import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
import {renderNotices} from './notices.mjs';
import {renderAccountSettingsReview} from './account-settings.mjs';
import {renderCharacterMain,renderCharacterSelection} from './character.mjs';

test('character preview distinguishes no selection from each valid selection',()=>{
 const empty=renderCharacterMain();
 assert.match(empty,/프로필 캐릭터를 선택해 주세요/);
 assert.ok(!empty.includes('data-character-art='));
 for(const key of ['bear','penguin','raccoon']){
  const html=renderCharacterMain({selected:key});
  assert.match(html,new RegExp('data-character-value="'+key+'"'));
  assert.match(html,new RegExp('data-character-art="'+key+'"'));
  assert.match(html,/캐릭터 변경하기/);
  assert.equal((html.match(/class="visit-symbol"/g)||[]).length,3);
  const selected=renderCharacterSelection({selected:key});
  assert.equal((selected.match(/aria-checked="true"/g)||[]).length,1);
  assert.match(selected,new RegExp(({bear:'곰을',penguin:'펭귄을',raccoon:'너구리를'})[key]+' 선택했어요'));
 }
 assert.throws(()=>renderCharacterMain({selected:'unknown'}),RangeError);
 assert.throws(()=>renderCharacterSelection({selected:'unknown'}),RangeError);
});

test('character selection is reachable without removing the existing main or enabling parts',()=>{
 const html=renderWorkspace({pageId:'my-info'});
 assert.ok(reviewGroups('my-info').flatMap(g=>g.items).some(i=>i.id==='profile-character'&&!i.pending));
 assert.match(html,/<section id="profile-character"[^>]*data-review-screen/);
 assert.match(html,/캐릭터 미선택/);
 assert.match(html,/data-character-choice="bear"/);
 assert.match(html,/data-character-choice="penguin"/);
 assert.match(html,/data-character-choice="raccoon"/);
 assert.equal((html.match(/data-character-choice=/g)||[]).length,3);
 assert.equal((html.match(/class="my-info-test"/g)||[]).length,1);
 const main=html.split('<section id="overview"')[1].split('</template>')[0];
 assert.equal((main.match(/class="visit-symbol"/g)||[]).length,3);
 assert.ok(!html.includes('펭귄으로 시작하기'));
 assert.ok(reviewGroups('my-info').flatMap(g=>g.items).some(i=>i.pending&&i.label==='캐릭터 파츠 꾸미기'));
});

test('notifications cover earnings, attendance, roulette and notices without inventing settings',()=>{
 const html=renderNotices({selected:1});
 assert.equal((html.match(/class="og-notification-row"/g)||[]).length,4);
 for(const text of ['적립 완료','출석 7일','룰렛 당첨','더블 적립'])assert.ok(html.includes(text),text);
 assert.equal((html.match(/data-read="false"/g)||[]).length,2);
 assert.equal((html.match(/data-read="true"/g)||[]).length,2);
 assert.ok(!renderWorkspace({pageId:'my-info'}).includes('게임 알림'));
 assert.ok(!renderWorkspace({pageId:'my-info'}).includes('룰렛 알림'));
 const custom=renderNotices({selected:1,notifications:[{type:'게임',title:'사용자 예시',body:'내용',date:'',read:true}]});
 assert.equal((custom.match(/class="og-notification-row"/g)||[]).length,1);
 assert.match(custom,/사용자 예시/);
});

test('membership uses the selected certificate across its four states without a separate comparison',()=>{
 const html=renderAccountSettingsReview().split('<section id="membership"')[1].split('<section id="settings"')[0];
 assert.ok(!html.includes('data-membership-comparison'));
 assert.ok(!html.includes('다른 상태 비교'),'membership no longer presents its related states as design candidates');
 assert.equal((html.match(/data-source-state=/g)||[]).length,4);
 assert.equal((html.match(/<template>/g)||[]).length,4);
 const screens=[...html.matchAll(/<template>([\s\S]*?)<\/template>/g)].map(m=>m[1]);
 assert.equal((html.match(/class="[^"]*\bv2-member-certificate\b[^"]*"/g)||[]).length,3,'basic, absent-code and share use the same certificate');
 for(const screen of screens)assert.match(screen,/v2-membership-screen/);
 for(const screen of [screens[0],screens[2],screens[3]])assert.match(screen,/data-membership-character/);
 for(const text of ['OG1234','OG-00012345','맑은 땅콩','2026-05-28','이미지 저장','친구에게 공유'])assert.ok(html.includes(text),text);
 assert.match(html,/공유 QR코드 디자인 예시/);
 assert.ok(!html.includes('Lv.3')&&!html.includes('0.2%'));
});
