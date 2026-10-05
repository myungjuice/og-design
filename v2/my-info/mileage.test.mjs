import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';

test('mileage review is reachable as one related group with three state previews',()=>{
 const html=renderWorkspace({pageId:'my-info'});
 assert.match(html,/<section id="mileage-history"[^>]*data-review-screen/);
 assert.deepEqual([...html.matchAll(/data-mileage-state="([^"]+)"/g)].map(m=>m[1]),['basic','empty','period']);
 const group=reviewGroups('my-info').find(g=>g.id==='mileage-history');
 assert.ok(group,'mileage has its own ready group');
 assert.deepEqual(group.items.map(i=>[i.id,!!i.pending]),[['mileage-history',false],['mileage-monthly',false]]);
 assert.equal((html.match(/class="my-info-test"/g)||[]).length,1,'main representative is not duplicated behind every sheet');
});

test('mileage preserves signed records, balance and period options using v2 controls',async()=>{
 const module=await import('./mileage.mjs').catch(()=>({}));
 assert.equal(typeof module.renderMileageHistory,'function','mileage renderer exists');
 const html=module.renderMileageHistory({id:'record-example',entries:[{date:'2026-09-18',title:'<가게>',amount:'-1,000 M'},{date:'2026-09-17',title:'',amount:'+5,000 M'}]});
 assert.match(html,/&lt;가게&gt;/);assert.doesNotMatch(html,/<가게>/);
 assert.match(html,/지급 정보 없음/);assert.match(html,/-1,000 M/);assert.match(html,/\+5,000 M/);
 for(const label of ['1개월','3개월','6개월','직접입력'])assert.match(html,new RegExp(label));
 assert.match(html,/15,000 M/);assert.match(html,/v2-sheet-panel/);assert.match(html,/v2-chip/);assert.match(html,/v2-list-row/);
 assert.match(html,/data-record-direction="earned"/);assert.match(html,/data-record-direction="spent"/);
 assert.doesNotMatch(html,/type="range"|fetch\(|og-calendar/);
});

test('empty and period previews preserve context and unique identifiers',async()=>{
 const module=await import('./mileage.mjs').catch(()=>({}));
 assert.equal(typeof module.renderMileageHistory,'function');
 const empty=module.renderMileageHistory({id:'no-records',empty:true});
 assert.match(empty,/조회한 기간의 내역이 없습니다/);assert.match(empty,/15,000 M/);
 assert.doesNotMatch(empty,/data-record-direction=/);
 const period=module.renderMileageHistory({id:'custom-period',periodOpen:true});
 assert.match(period,/조회 기간 선택/);assert.match(period,/v2-calendar/);
 assert.match(period,/2026-09-04/);assert.match(period,/2026-09-18/);
 assert.doesNotMatch(period,/data-picker-disabled="\[(?!\])/,'no borrowed reservation blackout dates');
 const html=renderWorkspace({pageId:'my-info'});
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length,'all templates have distinct IDs');
});

test('mileage allows reading the body while service controls and modal backgrounds stay inert',async()=>{
 const {renderMileageHistory}=await import('./mileage.mjs');
 for(const periodOpen of [false,true]){
  const html=renderMileageHistory({id:'reading-'+periodOpen,periodOpen});
  assert.doesNotMatch(html,/<div class="v2-mileage-history-frame" inert/,'frame must not block reading');
  assert.match(html,/<div class="v2-mileage-backdrop" inert aria-hidden="true"/);
  const buttons=[...html.matchAll(/<button\b[^>]*>/g)];
  assert.ok(buttons.length>0);assert.ok(buttons.every(([tag])=>/\binert\b/.test(tag)),'service controls remain static');
  assert.match(html,/class="og-sheet-body"[^>]*role="region"[^>]*tabindex="0"/,'body is keyboard-readable');
  if(periodOpen)assert.match(html,/<div class="v2-sheet-static" inert aria-hidden="true"/,'period overlay blocks the underlying sheet');
  else assert.doesNotMatch(html,/<div class="v2-sheet-static" inert/,'base sheet must not block its scrollable body');
 }
});
