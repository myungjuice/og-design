import test from 'node:test';
import assert from 'node:assert/strict';
import {publicStoreData} from '../../design-system/pages/home/public-store-data.mjs';
let screens={};
try{screens=await import('./store-secondary.mjs');}catch(error){if(error.code!=='ERR_MODULE_NOT_FOUND')throw error;}
const screen=(name,props)=>{assert.equal(typeof screens[name],'function',name+' must render the restored legacy screen');return screens[name](props);};

// These checks catch added share destinations and loss of the existing two choices.
test('store sharing keeps two destinations, original heading and a close control',()=>{
 const html=screen('renderHomeStoreShareScreen');
 assert.match(html,/오지스토어 공유/);assert.match(html,/카카오톡 공유/);assert.match(html,/링크 공유/);
 assert.equal((html.match(/class="v2-store-share-choice"/g)||[]).length,2);
 assert.match(html,/<img src="\/v2\/home\/media\/kakao-share.png"/);
 assert.match(html,/<svg[^>]*data-share-icon="sms"[^>]*fill="currentColor"/);
 assert.doesNotMatch(html,/contact_kakao\.png/);
 assert.match(html,/aria-label="시트 닫기"/);assert.doesNotMatch(html,/링크 복사|인스타그램|다운로드|선택 적용/);
 assert.ok([...html.matchAll(/<button\b[^>]*>/g)].every(([tag])=>/\binert\b/.test(tag)));
});
test('store photo viewer uses registered first and last photos without review-only controls',()=>{
 const first=screen('renderHomeStorePhotoScreen',{state:'first'}),last=screen('renderHomeStorePhotoScreen',{state:'last'});
 assert.match(first,/오시 망원본점/);assert.ok(first.includes(publicStoreData.store.images[0]));
 assert.ok(last.includes(publicStoreData.store.images.at(-1)));assert.match(first,/data-fit="contain"/);
 assert.match(first,/aria-label="뒤로가기"/);assert.doesNotMatch(first,/사진번호|다음 사진|이전 사진|저장|공유|작성자/);
 assert.match(first,/<button[^>]*data-face="flat"/);
 assert.throws(()=>screens.renderHomeStorePhotoScreen({data:{store:{name:'사진 없는 매장',images:[]}}}),RangeError);
});
test('praise target list separates unused eligibility, existing edits and an empty visit history',()=>{
 const data={store:{name:'테스트 매장',logo:''},visitCount:3,reviewCount:1,lastVisit:'3일 전',history:[{date:'2026-09-19 18:30',amount:25000,hasReviewed:false},{date:'2026-09-10 12:00',amount:18000,hasReviewed:true}]};
 const html=screen('renderHomeStorePraiseScreen',{state:'targets',data});
 assert.match(html,/내 리뷰: 1회/);assert.match(html,/3번 방문\. 마지막 방문 3일 전/);assert.match(html,/25,000원 사용/);
 assert.match(html,/>리뷰 작성<\/button>/);assert.match(html,/>수정<\/button>/);
 const empty=screen('renderHomeStorePraiseScreen',{state:'empty',data});
 assert.match(empty,/방문 전/);assert.match(empty,/이 매장에 아직 적립 내역이 없습니다/);assert.doesNotMatch(empty,/25,000원 사용|>리뷰 작성<\/button>|>수정<\/button>/);
});
test('praise saving depends on original versus current selections and retains seven available labels',()=>{
 const data={store:{name:'매장'},groups:[{name:'음식',items:[{id:'a',name:'맛있어요'},{id:'b',name:'신선해요'}]},{name:'공간',items:[{id:'c',name:'편해요'},{id:'d',name:'깔끔해요'},{id:'e',name:'넓어요'},{id:'f',name:'예뻐요'},{id:'g',name:'조용해요'}]}]};
 const props={state:'selection',data};
 const unchanged=screen('renderHomeStorePraiseScreen',{...props,selected:['a'],original:['a']});
 assert.doesNotMatch(unchanged,/개 등록하기|리뷰 수정하기|리뷰 삭제하기/);assert.equal((unchanged.match(/class="og-chip v2-chip/g)||[]).length,7);
 assert.match(unchanged,/음식/);assert.match(unchanged,/공간/);assert.match(unchanged,/최대 5개까지 리뷰 항목을 골라주세요/);
 assert.match(screen('renderHomeStorePraiseScreen',{...props,selected:['a','b'],original:[]}),/2개 등록하기/);
 assert.match(screen('renderHomeStorePraiseScreen',{...props,selected:['b'],original:['a']}),/리뷰 수정하기/);
 assert.match(screen('renderHomeStorePraiseScreen',{...props,selected:[],original:['a']}),/리뷰 삭제하기/);
 assert.throws(()=>screens.renderHomeStorePraiseScreen({...props,selected:['a','b','c','d','e','f']}),RangeError);
});
test('secondary galleries provide deferred specimens and passive controls with escaped public values',()=>{
 for(const [name,id] of [['renderHomeStoreShareReview','store-share'],['renderHomeStorePhotoReview','store-photo'],['renderHomeStorePraiseReview','praise-write']]){
  const html=screen(name);assert.match(html,new RegExp('id="'+id+'"'));assert.match(html,/<template/);assert.match(html,/store-secondary\.css/);
 }
 const data={store:{name:'<store> $&',logo:''},groups:[{name:'<category>',items:[{id:'a',name:'<name>'}]}]};
 const before=JSON.stringify(data),html=screen('renderHomeStorePraiseScreen',{state:'selection',data,selected:['a']});
 assert.match(html,/&lt;category&gt;/);assert.match(html,/&lt;name&gt;/);assert.doesNotMatch(html,/<category>|<name>|material-icons/);
 assert.equal(JSON.stringify(data),before);assert.ok([...html.matchAll(/<button\b[^>]*>/g)].every(([tag])=>/\binert\b/.test(tag)));
});
test('selected praise keeps its shared non-color check cue alongside the original category icon',()=>{
 const html=screen('renderHomeStorePraiseScreen',{state:'selected'});
 assert.equal((html.match(/class="v2-chip-mark v2-chip-check"/g)||[]).length,7);
 assert.equal((html.match(/aria-pressed="true"/g)||[]).length,2);
 assert.match(html,/재료가 신선해요/);assert.match(html,/인테리어가 멋져요/);
});
test('praise limit notice remains readable while its confirm action is passive',()=>{
 const html=screen('renderHomeStorePraiseScreen',{state:'limit'});
 const notice=html.match(/<div class="v2-dialog-static"[^>]*>/)?.[0]||'';
 assert.match(notice,/role="region"/);assert.match(notice,/aria-label="칭찬 선택 제한 안내"/);assert.doesNotMatch(notice,/\binert\b/);
 assert.match(html,/최대 5개까지 선택이 가능합니다\./);assert.ok([...html.matchAll(/<button\b[^>]*>/g)].every(([tag])=>/\binert\b/.test(tag)));
});
