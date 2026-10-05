import test from 'node:test';
import assert from 'node:assert/strict';
import * as components from './render.mjs';
import {avatar,thumbnail} from '../../design-system/components/avatar/render.mjs';
import {reviewGroups} from '../subnavigation.mjs';

test('profile media supports original sizes and the existing designer layers without button semantics',()=>{
 assert.equal(typeof components.renderAvatar,'function');
 for(const size of ['small','medium','large']){
  const html=components.renderAvatar({size,character:true,label:'맑은 땅콩 님 프로필'});
  assert.match(html,new RegExp('data-size="'+size+'"'));
  assert.match(html,/class="og-avatar v2-avatar"/);assert.match(html,/profile-base.png/);assert.match(html,/profile-overlay.png/);
  assert.match(html,/role="img"/);assert.doesNotMatch(html,/<button|tabindex|aria-pressed|material-icons/);
  assert.match(html,/<img[^>]+width="1536"[^>]+height="1024"/);
 }
});
test('profile states retain fallback meaning and never request a missing or explicit fallback image',()=>{
 assert.equal(typeof components.renderAvatar,'function');
 for(const state of ['empty','loading','error']){
  const html=components.renderAvatar({character:true,state,label:'땅콩 프로필'});
  assert.ok(html.includes('data-state="'+state+'"'));assert.doesNotMatch(html,/<img|src=""/);assert.match(html,/<svg/);
  if(state==='loading')assert.match(html,/aria-busy="true"/);else assert.doesNotMatch(html,/aria-busy="true"/);
 }
 const fallback=components.renderAvatar();assert.match(fallback,/data-state="empty"/);assert.match(fallback,/기본 프로필/);
 const html=components.renderAvatar({src:'/photo.png',label:'<사진> & 이름'});
 assert.match(html,/&lt;사진&gt; &amp; 이름/);assert.match(html,/src="\/photo.png"/);
 assert.match(components.renderAvatar({character:true,decorative:true}),/aria-hidden="true"/);
});
test('profile labels and ids preserve literal dollar replacement tokens without breaking attributes',()=>{
 const html=components.renderAvatar({src:'/a.png',label:"가격 $& $$ $' $`",id:'avatar-$&'});
 assert.ok(html.includes('data-media-label="가격 $&amp; $$ $&#39; $`"'));
 assert.ok(html.includes('aria-label="가격 $&amp; $$ $&#39; $`"'));
 assert.ok(html.includes('id="avatar-$&amp;"'));
});
test('thumbnail media keeps ratio and fit with one accessible image meaning and a safe source',()=>{
 assert.equal(typeof components.renderThumbnail,'function');
 for(const [ratio,fit] of [['square','cover'],['wide','cover'],['wide','contain']]){
  const html=components.renderThumbnail({src:'/logo.png?x=1&y=2',alt:'매장 <로고>',ratio,fit});
  assert.match(html,/class="og-thumbnail v2-thumbnail"/);assert.match(html,new RegExp('data-ratio="'+ratio+'"'));
  assert.match(html,new RegExp('data-fit="'+fit+'"'));assert.match(html,/role="img"/);assert.match(html,/aria-label="매장 &lt;로고&gt;"/);
  assert.match(html,/src="\/logo.png\?x=1&amp;y=2"/);assert.match(html,/<img[^>]+alt=""/);
  assert.doesNotMatch(html,/tabindex|aria-pressed|<button/);
 }
});
test('thumbnail absence loading and failure are different named states with no broken image requests',()=>{
 assert.equal(typeof components.renderThumbnail,'function');
 const absent=components.renderThumbnail({alt:'오시 매장'});assert.match(absent,/data-state="empty"/);assert.doesNotMatch(absent,/<img/);
 for(const [state,text] of [['loading','이미지를 불러오는 중'],['empty','이미지 없음'],['error','이미지를 불러오지 못했어요']]){
  const html=components.renderThumbnail({state,src:'/logo.png',alt:'매장 사진',ratio:'wide'});
  assert.match(html,new RegExp('data-state="'+state+'"'));assert.ok(html.includes(text));assert.doesNotMatch(html,/<img/);
 }
 const decorative=components.renderThumbnail({src:'/logo.png',decorative:true});assert.doesNotMatch(decorative,/role="img"|aria-label=/);
});
test('media wrappers reject unsupported states geometry ambiguous profile sources and unsafe URL schemes',()=>{
 assert.equal(typeof components.renderAvatar,'function');assert.equal(typeof components.renderThumbnail,'function');
 for(const props of [{size:'huge'},{state:'disabled'},{character:'yes'},{character:true,src:'/a.png'},{label:' '},{decorative:'true'}])assert.throws(()=>components.renderAvatar(props));
 for(const props of [{ratio:'portrait'},{fit:'fill'},{state:'unknown'},{alt:null},{decorative:'true'}])assert.throws(()=>components.renderThumbnail(props));
 for(const src of ['javascript:alert(1)','data:image/svg+xml,bad','//untrusted.test/a.png','file:///private/a.png',' /a.png','a\\b.png']){
  assert.throws(()=>components.renderAvatar({src}));assert.throws(()=>components.renderThumbnail({src}));
 }
 for(const src of ['/a.png','./a.png','../a.png','https://assets.example.test/a.png'])assert.ok(components.renderThumbnail({src}));
});
test('media gallery groups profile and thumbnail examples with local assets and state previews',()=>{
 const html=components.renderComponents();
 assert.deepEqual(reviewGroups('components').find(g=>g.id==='media')?.items.map(x=>x.id),['avatar','thumbnail']);
 assert.match(html,/id="avatar"/);assert.match(html,/id="thumbnail"/);assert.match(html,/data-media-preview="avatar"/);assert.match(html,/data-media-preview="thumbnail"/);
 assert.match(html,/profile-overlay.png/);assert.match(html,/멤버십 에셋/);assert.match(html,/aria-live="polite"/);
 assert.doesNotMatch(html,/<img[^>]+src="https?:/);
});
test('legacy profile and thumbnail output remain independent of v2',()=>{
 assert.doesNotMatch(avatar(),/v2-/);assert.doesNotMatch(thumbnail({src:'/photo.png'}),/v2-/);
});
test('photo placeholders are opt-in while store thumbnails retain their original fallback',()=>{
 const photo=components.renderThumbnail({alt:'메뉴 사진',placeholder:'photo'});
 assert.match(photo,/data-placeholder="photo"/);assert.match(photo,/메뉴 사진 · 이미지 없음/);assert.doesNotMatch(photo,/<img/);
 assert.doesNotMatch(components.renderThumbnail(),/data-placeholder="photo"/);
 assert.throws(()=>components.renderThumbnail({placeholder:'unknown'}),RangeError);
});
