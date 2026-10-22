import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderWorkspace} from './render.mjs';
import {reviewGroups} from './subnavigation.mjs';
import {renderMyLandDetailScreen} from './myland-details.mjs';

test('결과 화면은 보상 캐릭터만 표시하고 반복 장식 문구를 생략한다',()=>{
 for(const id of ['roulette-result','puzzle-result']){
  const html=renderMyLandDetailScreen(id);
  assert.equal((html.match(/class="md-bear"/g)||[]).length,1);
  assert.doesNotMatch(html,/c-background\.png/);
  assert.doesNotMatch(html,/오늘의 행운 도착|즐거운 도전이었어요/);
 }
 assert.doesNotMatch(renderMyLandDetailScreen('attendance-daily'),/오늘도 반가워요/);
 assert.doesNotMatch(renderMyLandDetailScreen('puzzle-ready'),/60초, 달콤한 도전/);
 assert.match(renderMyLandDetailScreen('attendance-milestone'),/7일 연속 출석/);
});

test('C안 그라데이션 버튼의 글자 대비가 양 끝에서 4.5 이상이다',()=>{
 const css=readFileSync(new URL('./myland-details.css',import.meta.url),'utf8');
 const color=css.match(/--md-brown:(#[\da-f]{6})/)[1];
 const luminance=hex=>hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
 for(const background of ['#ffe18a','#ffb56f'])assert.ok((luminance(background)+.05)/(luminance(color)+.05)>=4.5);
});

test('퍼즐 매치 예시의 강조 칸은 같은 과일 세 개를 보여준다',()=>{
 const html=renderMyLandDetailScreen('puzzle-playing');
 const matched=[...html.matchAll(/class="md-cell matched"><svg[^>]*aria-label="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(matched.length,3);
 assert.equal(new Set(matched).size,1);
});

test('마이랜드 확정안과 세부 상태 12개를 탐색할 수 있다',()=>{
 const groups=reviewGroups('my-land');
 assert.equal(groups[0].id,'myland-feedback');
 const details=groups.slice(1).flatMap(g=>g.items);
 assert.equal(details.length,12);
 const html=renderWorkspace({pageId:'my-land'});
 for(const {id} of details)assert.ok(html.includes(`id="${id}" data-review-screen`),id);
 assert.equal((html.match(/data-myland-detail=/g)||[]).length,12);
});

test('보상 수치의 기획 초안 경계와 보상 종류를 표시한다',()=>{
 const html=renderWorkspace({pageId:'my-land'});
 assert.match(html,/기획서 초안의 예시값/);
 assert.match(html,/7일 연속 출석/);
 assert.match(html,/3장/);
 assert.match(html,/50 M/);
 assert.match(html,/확률 안내/);
 assert.match(html,/50\.6%/);
 assert.match(html,/2,860/);
 assert.match(html,/35 M/);
 for(const label of ['티켓이 부족해요','오늘의 게임을 모두 즐겼어요','이번 달 마일리지를 모두 받았어요'])assert.ok(html.includes(label),label);
});
