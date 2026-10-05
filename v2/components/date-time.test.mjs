import test from 'node:test';
import assert from 'node:assert/strict';
const module=await import('./date-time.mjs').catch(()=>({}));
test('date validation rejects rolled-over dates and shifts month across years',()=>{
 assert.equal(typeof module.isDate,'function');assert.equal(typeof module.shiftMonth,'function');
 for(const date of ['2024-02-29','2026-09-30'])assert.equal(module.isDate(date),true);
 for(const date of ['2026-02-29','2026-04-31','2026-13-01','2026-9-1','not-date'])assert.equal(module.isDate(date),false);
 assert.deepEqual(module.shiftMonth(2026,12,1),{year:2027,month:1});assert.deepEqual(module.shiftMonth(2026,1,-1),{year:2025,month:12});
 assert.throws(()=>module.shiftMonth(2026,0,1),RangeError);
});
test('range selection orders reversed endpoints and blocks unavailable spans',()=>{
 assert.equal(typeof module.selectRange,'function');
 assert.deepEqual(module.selectRange({start:null,end:null},'2026-09-25'),{start:'2026-09-25',end:null});
 assert.deepEqual(module.selectRange({start:'2026-09-25',end:null},'2026-10-06'),{start:'2026-09-25',end:'2026-10-06'});
 assert.deepEqual(module.selectRange({start:'2026-09-25',end:null},'2026-09-18'),{start:'2026-09-18',end:'2026-09-25'});
 assert.deepEqual(module.selectRange({start:'2026-09-04',end:'2026-09-18'},'2026-09-25'),{start:'2026-09-25',end:null});
 assert.throws(()=>module.selectRange({start:'2026-09-18',end:null},'2026-09-25',['2026-09-22']),RangeError);
});
test('date picker preserves today, named real days, unavailable dates and applied selection',()=>{
 assert.equal(typeof module.renderDatePicker,'function');
 const html=module.renderDatePicker({id:'date-a',year:2024,month:2,selected:'2024-02-29',today:'2024-02-16',disabled:['2024-02-22']});
 assert.match(html,/data-date="2024-02-29"[^>]*aria-pressed="true"/);assert.match(html,/data-date="2024-02-16"[^>]*aria-current="date"/);
 assert.match(html,/data-date="2024-02-22"[^>]*disabled/);assert.doesNotMatch(html,/aria-selected/);
 assert.match(html,/data-picker-apply/);assert.match(html,/data-picker-summary/);
 assert.throws(()=>module.renderDatePicker({year:2026,month:2,selected:'2026-02-29'}),RangeError);
 assert.throws(()=>module.renderDatePicker({year:2026,month:9,selected:'2026-09-22',disabled:['2026-09-22']}),RangeError);
});
test('time picker keeps native named controls and validates clock values',()=>{
 assert.equal(typeof module.renderTimePicker,'function');
 const html=module.renderTimePicker({id:'time-a',selected:true,period:'오후',hour:'12',minute:'59'});
 assert.equal((html.match(/<select/g)||[]).length,3);assert.match(html,/오후 12:59/);assert.match(html,/data-time-minute/);
 for(const props of [{period:'밤'},{hour:'00'},{hour:'13'},{minute:'60'}])assert.throws(()=>module.renderTimePicker(props),RangeError);
});
