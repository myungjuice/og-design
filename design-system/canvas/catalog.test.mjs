import test from 'node:test';
import assert from 'node:assert/strict';
test('catalog partitions every board once and maps nested review targets',async()=>{
 const {canvases,boards,canvasFor}=await import('./catalog.mjs');
 assert.deepEqual(canvases.map(c=>c.id),['foundations','components','explore','store','my-info','my-land']);
 assert.equal(new Set(boards.map(b=>b.id)).size,boards.length);
 assert.equal(boards.length,85);
 assert.equal(canvasFor('my-land-main'),'my-land');
 for(const id of ['my-land-plaza','my-land-attendance','my-land-lounge','my-land-blue-header','my-land-miniature','my-land-relief','my-land-paper'])assert.equal(canvasFor(id),'my-land');
 assert.equal(canvasFor('home-search'),'explore');
 assert.equal(canvasFor('home-store-info'),'store');
 assert.equal(canvasFor('review-reservation-date'),'my-info');
 assert.equal(canvasFor('mileage-option-a'),'my-info');
});
test('deep links win, valid selection persists, unknown inputs fall back safely',async()=>{
 const {resolveCanvas,canvasHref,viewStorageKey}=await import('./catalog.mjs');
 assert.equal(resolveCanvas({search:'?canvas=components',hash:'#home-store-info'}),'store');
 assert.equal(resolveCanvas({search:'?canvas=components'}),'components');
 assert.equal(resolveCanvas({search:'?canvas=unknown',last:'explore'}),'explore');
 assert.equal(resolveCanvas({last:'nonsense'}),'foundations');
 assert.equal(canvasHref('store','home-store-info'),'?canvas=store#home-store-info');
 assert.notEqual(viewStorageKey('store'),viewStorageKey('my-info'));
});
