import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {renderWorkspace} from './render.mjs';
import {reviewGroups} from './subnavigation.mjs';

test('icon review is reachable and distinguishes source assets from device captures',()=>{
 const html=renderWorkspace({pageId:'icon-review'});
 assert.match(html,/<h1>아이콘 제작 검토<\/h1>/);
 assert.doesNotMatch(html,/실제 앱 캡처 대기|실제 설치 앱 캡처는 미수령/);
 assert.match(html,/현재 앱 원본 아이콘/);
 const sections=[...html.matchAll(/<section id="([^"]+)"[^>]*data-review-screen/g)].map(m=>m[1]);
 assert.deepEqual(sections,['icon-decisions','mileage-compare','icon-additions','capture-guide']);
 assert.deepEqual(reviewGroups('icon-review').flatMap(g=>g.items.map(i=>i.id)),sections);
 const sources=[...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m=>m[1]);
 assert.ok(sources.some(src=>src.endsWith('/mileage_on.svg')));
 assert.ok(sources.some(src=>src.endsWith('/pay_on.svg')));
 assert.ok(sources.some(src=>src.includes('/received-icons-20261022/categories/')));
 for(const src of sources)assert.ok(src.startsWith('/')&&existsSync(new URL('..'+src,import.meta.url)),src+' resolves locally');
});

test('all fourteen supplied captures are available in the gallery in upload order',()=>{
 const html=renderWorkspace({pageId:'icon-review'});
 const gallery=html.match(/<section id="capture-guide"[\s\S]*?<\/section>/)?.[0]||'';
 const captures=[...gallery.matchAll(/data-capture-no="(\d+)"/g)].map(m=>Number(m[1]));
 assert.deepEqual(captures,Array.from({length:14},(_,i)=>i+1));
 assert.match(gallery,/폴드8/);
 assert.match(gallery,/원본 비율/);
 assert.match(gallery,/바코드·회원번호.*가렸/);
 assert.equal([...gallery.matchAll(/class="ir-source-link"/g)].length,14,'every device capture links to a renewal view');
 for(let no=1;no<=14;no++){
  const file=`app-${String(no).padStart(2,'0')}${no===4?'-redacted':''}.png`;
  assert.ok(gallery.includes(file),file+' is visible in the gallery');
 }
});

test('comparison only shows baseline items needing exclusion, reuse or a decision',()=>{
 const html=renderWorkspace({pageId:'icon-review'});
 const ids=[...html.matchAll(/data-baseline-no="(\d+)"/g)].map(m=>Number(m[1])).sort((a,b)=>a-b);
 assert.deepEqual(ids,[1,2,4,10,11,12]);
 assert.match(html,/Q오더.*기능은 유지/);
 assert.match(html,/마이랜드·오지파크 본문.*제외/);
 assert.match(html,/엑셀 파일은 수정하지 않았습니다/);
});

test('baseline review omits retained and received work without changing pending decisions',()=>{
 const html=renderWorkspace({pageId:'icon-review'});
 const actual={};
 for(const [,no,row] of html.matchAll(/<tr data-baseline-no="(\d+)">([\s\S]*?)<\/tr>/g)){
  const label=row.match(/data-status="([^"]+)"/)?.[1];
  (actual[label]??=[]).push(Number(no));
 }
 assert.deepEqual(actual,{
  '제작 제외':[1,2,4,11],
  '제외 검토':[10],
  '카테고리 재사용':[12]
 });
 assert.doesNotMatch(html,/data-status="(?:제작 유지|수령 완료|기존 의뢰 확장)"/);
 const summary=html.match(/<ul class="ir-summary"[\s\S]*?<\/ul>/)?.[0]||'';
 assert.deepEqual([...summary.matchAll(/data-status="([^"]+)"/g)].map(m=>m[1]),['제작 제외','신규 제작','카테고리 재사용','제외 검토']);
 const checkbox=html.match(/<tr data-baseline-no="10">([\s\S]*?)<\/tr>/)?.[1]||'';
 assert.match(checkbox,/기본 컴포넌트/);
 assert.match(checkbox,/제외 확정 전까지.*제작 대상 유지/);
 assert.match(checkbox,/상태 표시/);
 const recent=html.match(/<tr data-baseline-no="12">([\s\S]*?)<\/tr>/)?.[1]||'';
 assert.match(recent,/\/assets\/received-icons-20261022\/categories\//);
 assert.doesNotMatch(recent,/recent-utensils/);
});

test('new commissioning examples only include the four newly requested menu meanings',()=>{
 const html=renderWorkspace({pageId:'icon-review'});
 const additions=html.match(/<section id="icon-additions"[\s\S]*?<\/section>/)?.[0]||'';
 assert.equal([...additions.matchAll(/data-commission="final-artwork-required"/g)].length,4);
 const labels=[...additions.matchAll(/<figcaption><strong>([^<]+)<\/strong>/g)].map(m=>m[1]);
 assert.deepEqual(labels,['이용내역','멤버십','문의하기','내 정보']);
 assert.match(additions,/임시 예시/);
 assert.doesNotMatch(additions,/이미 받은 홈 기능|문의하기 하위 메뉴|기존 의뢰 확장/);
});

test('current app and renewal comparison remains a separate reachable reference view',()=>{
 const html=renderWorkspace({pageId:'icon-review'});
 const comparison=html.match(/<section id="mileage-compare"[\s\S]*?<\/section>/)?.[0]||'';
 assert.ok(comparison,'the original comparison deep link has its own view');
 assert.match(comparison,/현재 앱/);
 assert.match(comparison,/리뉴얼 시안/);
 assert.match(comparison,/renewal-my-info\.png/);
 assert.match(comparison,/mileage_on\.svg/);
 assert.match(comparison,/pay_on\.svg/);
 assert.match(comparison,/mileage-m\.png/);
 assert.deepEqual([...comparison.matchAll(/data-capture-no="(\d+)"/g)].map(m=>Number(m[1])),[1,3,4]);
 assert.match(comparison,/M.*기존 의뢰/);
 assert.equal(reviewGroups('icon-review')[0].id,'icon-decisions','summary remains the default view');
 const summary=html.match(/<section id="icon-decisions"[\s\S]*?<\/section>/)?.[0]||'';
 assert.doesNotMatch(summary,/지도 핀|마커/,'map markers are not added as new requests');
});
