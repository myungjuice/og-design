import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {reviewGroups} from '../subnavigation.mjs';

// Catches dropping the category destination or one of its source branches.
test('home categories exposes the open sheet and selected map within the search group',()=>{
 const html=renderWorkspace({pageId:'home'});
 assert.ok(reviewGroups('home').some(group=>group.items.some(item=>item.id==='search')&&group.items.some(item=>item.id==='category'&&!item.pending)));
 assert.deepEqual([...html.matchAll(/data-home-category-state="([^"]+)"/g)].map(m=>m[1]),['open','selected']);
 assert.match(html,/<section id="category"[^>]*data-review-screen/);
 assert.equal((html.match(/data-category-template/g)||[]).length,2);
 assert.doesNotMatch(html,/<details class="v2-home-category-extra"[^>]*\bopen\b/);
});

// Catches missing/reordered choices, invented confirmation, or removing body scrollability.
test('category sheet retains the thirteen original choices without a new confirmation step',()=>{
 const html=renderWorkspace({pageId:'home'});
 const open=html.match(/data-home-category-state="open"([\s\S]*?)<\/template>/)?.[1]||'';
 assert.deepEqual([...open.matchAll(/data-category-id="([^"]+)"/g)].map(m=>m[1]),['CI1000','CI1001','CI1002','CI1003','CI1004','CI1005','CI1011','CI1012','CI1006','CI1007','CI1008','CI1009','CI1010']);
 assert.match(open,/업종 선택/);
 assert.match(open,/class="og-sheet-body"[^>]*role="region"[^>]*tabindex="0"/);
 assert.doesNotMatch(open,/v2-chip-check|>선택 완료<|>확인<|>적용<|material-icons/);
 assert.equal((open.match(/class="og-chip v2-chip"/g)||[]).length,13);
});

// Catches leaving the old fourth chip/whole-list selection after choosing a later category.
test('selected category replaces the fourth chip and shows only the existing cafe fixture',()=>{
 const html=renderWorkspace({pageId:'home'});
 const selected=html.match(/data-home-category-state="selected"([\s\S]*?)<\/template>/)?.[1]||'';
 assert.match(selected,/data-category="카페\/베이커리" aria-pressed="true"/);
 assert.doesNotMatch(selected,/data-category="일식"|v2-home-category-overlay|home-art-dining/);
 assert.match(selected,/밀랍\(MILLAB\)/);
 assert.match(selected,/class="v2-home-cafe-pin"/);
 assert.match(selected,/naver-mangwon\.png/);
 assert.match(selected,/<input readonly inert/);
});
