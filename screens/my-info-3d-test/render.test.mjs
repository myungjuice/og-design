import {test} from 'node:test';
import assert from 'node:assert/strict';

test('standalone screen uses original Figma assets with six distinct sprite regions',async()=>{
 const {renderMyInfoTest}=await import('./render.mjs');
 const html=renderMyInfoTest();
 const images=[...html.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(images.filter(src=>src==='./media/figma/menu-icons.png').length,6);
 assert.equal(images.filter(src=>src==='./media/figma/mileage-m.png').length,1);
 assert.equal(images.filter(src=>src==='./media/figma/recent-utensils.svg').length,3);
 assert.equal(images.filter(src=>src==='./media/figma/review-pencil.svg').length,1);
 const regions=[...html.matchAll(/data-art="([^"]+)" style="--art-left:([^;]+);--art-top:([^"]+)"/g)].map(m=>m.slice(1));
 assert.deepEqual(regions,[['receipt','-2.16%','-7.31%'],['bell','-93.39%','-7.31%'],['membership','-196.02%','-8.56%'],['support','-3.71%','-96.78%'],['settings','-100.34%','-96.47%'],['account','-196.54%','-96.99%']]);
 assert.ok(images.every(src=>src.startsWith('./media/figma/')));
 assert.equal(images.filter(src=>src==='./media/figma/profile-base.png').length,1);
 assert.equal(images.filter(src=>src==='./media/figma/profile-overlay.png').length,1);
 assert.match(html,/aria-label="프로필 캐릭터"/);
 assert.doesNotMatch(html,/프로필 캐릭터 미적용/);
 assert.ok(images.includes('./media/figma/mileage-marker.svg'));
 assert.ok(images.includes('./media/figma/mileage-info.svg'));
 assert.match(html,/공유인 3<\/span> \|/);
});

test('balances remain readable as text rather than being baked into imagery',async()=>{
 const {renderMyInfoTest}=await import('./render.mjs');
 const html=renderMyInfoTest({available:5000,total:6250,shared:1250});
 assert.match(html,/5,000 M/);assert.match(html,/6,250 M/);assert.match(html,/1,250 M/);
 assert.match(html,/role="meter"/);assert.match(html,/aria-valuenow="6250"/);
 assert.doesNotMatch(html,/PAY|보유 페이/);
 assert.doesNotMatch(html,/[\d,]+P/);
 assert.match(html,/<span>0M<\/span>/);
});

test('visit rows expose separate review actions and escape supplied store names',async()=>{
 const {renderMyInfoTest}=await import('./render.mjs');
 const html=renderMyInfoTest({visits:[{name:'<script>unsafe</script>',date:'09.24 목',reviewed:false}]});
 assert.match(html,/&lt;script&gt;unsafe&lt;\/script&gt;/);
 assert.match(html,/aria-label="&lt;script&gt;unsafe&lt;\/script&gt; 후기 작성"/);
 assert.match(html,/data-preview="후기 작성"/);
});

test('graph round caps preserve empty, tiny, and full balances',async()=>{
 const {renderMyInfoTest}=await import('./render.mjs');
 const empty=renderMyInfoTest({available:0,total:0,shared:0});
 assert.match(empty,/class="graph-available" style="--progress:0%;--cap:0px;--fill-min:0px"/);
 assert.match(empty,/class="graph-marker"[^>]+ hidden/);
 const tiny=renderMyInfoTest({available:1,total:1,shared:0});
 assert.match(tiny,/class="graph-available"[^>]+--fill-min:20px/);
 const full=renderMyInfoTest({available:20000,total:20000,shared:0});
 assert.match(full,/class="graph-available" style="--progress:100%/);
 assert.doesNotMatch(full,/class="graph-marker"[^>]+ hidden/);
});

test('barcode navigation keeps its action while displaying the original Figma button',async()=>{
 const {renderMyInfoTest}=await import('./render.mjs');
 const html=renderMyInfoTest();
 const barcode=html.match(/<button class="nav-item nav-barcode"[\s\S]*?<\/button>/)?.[0];
 assert.ok(barcode);
 assert.match(barcode,/data-preview="바코드"/);
 assert.match(barcode,/<img[^>]+src="\.\/media\/figma\/bottom-navigation-source\.png"/);
 assert.doesNotMatch(barcode,/<svg/);
 assert.match(barcode,/<span>바코드<\/span>/);
});

test('test pair keeps my-info intact and places a Naver-backed home alongside it',async()=>{
 const renderer=await import('./render.mjs');
 assert.equal(typeof renderer.renderTestPair,'function','both screens must be available on the existing route');
 const html=renderer.renderTestPair();
 assert.ok(html.indexOf('class="my-info-test"')<html.indexOf('class="home-test"'));
 assert.match(html,/naver-mangwon\.png/);
 assert.match(html,/© NAVER Corp\./);
 assert.match(html,/지도는 네이버 지도 정적 배경/);
 assert.equal((html.match(/class="barcode-art"/g)||[]).length,2);
 const home=html.slice(html.indexOf('class="home-test"'));
 assert.match(home,/aria-label="매장 검색"/);
 assert.match(home,/type="search"/);
 assert.match(home,/aria-label="현 지도 위치 둘러보기"/);
 assert.match(home,/aria-label="현 위치"/);
 assert.match(home,/aria-label="퀵적립"/);
 assert.match(home,/오시 망원본점/);
 assert.match(home,/마이랜드/);assert.match(home,/오지파크/);
 assert.doesNotMatch(home,/회원점명|My OG|핫플|PAY/);
});

test('standalone comparison appends one barcode screen after the existing home',async()=>{
 const {renderTestPair}=await import('./render.mjs');
 const html=renderTestPair();
 assert.equal((html.match(/class="barcode-test"/g)||[]).length,1);
 assert.ok(html.indexOf('class="home-test"')<html.indexOf('class="barcode-test"'));
});

test('my-info and barcode render the same mileage card for the same balances',async()=>{
 const renderer=await import('./render.mjs');
 assert.equal(typeof renderer.renderBarcodeTest,'function');
 const {renderMileageCard}=await import('./mileage-card.mjs');
 const props={available:5000,total:6250,shared:1250};
 const card=renderMileageCard(props);
 assert.ok(renderer.renderMyInfoTest(props).includes(card));
 assert.ok(renderer.renderBarcodeTest(props).includes(card));
});

test('barcode retains earning actions but disables use when the available balance is zero',async()=>{
 const renderer=await import('./render.mjs');
 assert.equal(typeof renderer.renderBarcodeTest,'function');
 const html=renderer.renderBarcodeTest({available:0,total:2400,shared:0});
 const receipt=html.match(/<button\b[^>]+data-preview="영수증 적립"[^>]*>/)?.[0];
 const use=html.match(/<button\b[^>]+data-preview="마일리지 사용"[^>]*>/)?.[0];
 assert.ok(receipt);assert.doesNotMatch(receipt,/disabled/);
 assert.ok(use);assert.match(use,/disabled/);
 assert.match(html,/사용 가능한 마일리지가 없어/);
 assert.match(renderer.renderBarcodeTest(),/실제 회원 정보가 아닌 샘플 바코드/);
 assert.doesNotMatch(renderer.renderBarcodeTest(),/PAY|맑은 땅콩|mobile-status|mobile-home/);
});
test('my-info renderer accepts route-safe assets and the shared v2 balance renderer',async()=>{
 const {renderMyInfoTest}=await import('./render.mjs');
 const {renderMileage}=await import('../../v2/components/mileage.mjs');
 const html=renderMyInfoTest({available:0,total:2400,shared:0,sharedCount:0,assetBase:'/screens/my-info-3d-test/media/figma/',renderBalance:renderMileage});
 assert.match(html,/class="og-surface mileage-card v2-mileage"/);
 assert.match(html,/공유인 0/);assert.match(html,/2,400 M/);
 assert.ok([...html.matchAll(/src="([^"]+)"/g)].every(m=>m[1].startsWith('/screens/my-info-3d-test/media/figma/')));
});
