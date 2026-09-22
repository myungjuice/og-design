import test from 'node:test';
import assert from 'node:assert/strict';
import {myLandScreen} from './render.mjs';
test('my land is a static planning-based main with four milestones and four missions',()=>{
 const html=myLandScreen();
 assert.match(html,/inert/);
 assert.match(html,/aria-current="page"[^>]*>[\s\S]*?마이랜드/);
 assert.deepEqual([...html.matchAll(/data-milestone="(\d+)"/g)].map(m=>Number(m[1])),[7,14,21,30]);
 assert.equal((html.match(/class="og-myland-mission"/g)||[]).length,4);
 for(const label of ['12,400','3장','1,250','회원점 2곳에서 적립하기','오늘 출석하고 티켓 받기','룰렛','퍼즐'])assert.ok(html.includes(label),label);
 assert.ok(!html.includes('최원점'));
 assert.ok(!html.includes('onclick='));
});

import * as screens from './render.mjs';
import {createHash} from 'node:crypto';
test('adding comparison layouts preserves the original main specimen exactly',()=>{
 assert.equal(createHash('sha256').update(myLandScreen()).digest('hex'),'021e90df4d91e106cb91c7610288524b172c0122826e4124ff3be139b6eee307');
});
test('three static variants preserve planning content with distinct priorities',()=>{
 assert.equal(typeof screens.myLandVariant,'function');
 for(const variant of ['plaza','attendance','lounge']){
  const html=screens.myLandVariant(variant);
  assert.match(html,/inert/);
  assert.ok(html.includes('data-variant="'+variant+'"'));
  assert.deepEqual([...html.matchAll(/data-milestone="(\d+)"/g)].map(m=>Number(m[1])),[7,14,21,30]);
  for(const text of ['12,400','3장','1,250','6일 연속','마이랜드 방문하기','룰렛 2회 돌리기','회원점 2곳에서 적립하기','공유인 1명 초대하기','오늘 출석하고 티켓 받기'])assert.ok(html.includes(text),variant+': '+text);
  assert.equal((html.match(/class="og-myland-mission"/g)||[]).length,4);
  if(variant==='lounge')assert.ok(html.indexOf('og-myland-games')<html.indexOf('og-myland-attendance'));
  else assert.ok(html.indexOf('og-myland-attendance')<html.indexOf('og-myland-games'));
 }
});

test('fifth version preserves original section order and adds only the blue header grouping',()=>{
 const html=screens.myLandVariant('blue-header');
 assert.ok(html.includes('data-variant="blue-header"'));
 assert.ok(html.includes('og-myland-blue-header'));
 const order=['og-myland-hero','og-myland-summary','og-myland-attendance','og-myland-games','og-myland-missions'];
 for(let i=1;i<order.length;i++)assert.ok(html.indexOf(order[i])>html.indexOf(order[i-1]));
 for(const name of ['summary','attendance','games','missions']){
  const expression=new RegExp('<(div|section) class="og-myland-'+name+'"[\\s\\S]*?(?=<(?:div|section) class="og-myland-(?:summary|attendance|games|missions)"|</div><nav)');
  const original=myLandScreen().match(expression)?.[0];
  assert.ok(original&&html.includes(original),name+' reused unchanged');
 }
});

test('art candidates keep the fifth screen content and replace all three illustrations',()=>{
 const base=screens.myLandVariant('blue-header');
 for(const variant of ['miniature','relief','paper']){
  const html=screens.myLandVariant(variant);
  assert.ok(html.includes('data-art-style="'+variant+'"'));
  assert.equal((html.match(/class="og-land-illustration /g)||[]).length,3);
  assert.ok(!html.includes('og-myland-calendar-object'));
  assert.ok(!html.includes('og-myland-puzzle'));
  const strip=s=>s.replace(/<svg[\s\S]*?<\/svg>/g,'').replace(/<[^>]*>/g,'');
  for(const value of ['12,400','3장','1,250','오늘 출석하고 티켓 받기','회원점 2곳에서 적립하기'])assert.ok(strip(html).includes(value));
  for(const name of ['summary','attendance','missions']){
   const start=base.indexOf('<'+(name==='summary'?'div':'section')+' class="og-myland-'+name+'"');
   const end=name==='summary'?base.indexOf('<section class="og-myland-attendance"'):name==='attendance'?base.indexOf('<section class="og-myland-games"'):base.indexOf('</div><nav');
   assert.ok(html.includes(base.slice(start,end)),name+' unchanged');
  }
 }
});
