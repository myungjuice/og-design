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
