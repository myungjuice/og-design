import test from 'node:test';
import assert from 'node:assert/strict';
const module=await import('./surfaces.mjs').catch(()=>({}));
test('surface variants retain trusted content without becoming interactive',()=>{
 assert.equal(typeof module.renderSurface,'function');
 for(const depth of ['flat','raised','inset']){
  const html=module.renderSurface({depth,contentHTML:'<h3>정보</h3>',id:'a"$&'});
  assert.match(html,/og-surface v2-surface/);assert.ok(html.includes('data-depth="'+depth+'"'));
  assert.match(html,/<h3>정보<\/h3>/);assert.match(html,/id="a&quot;\$&amp;"/);
  assert.doesNotMatch(html,/<button|tabindex|aria-pressed|onclick/);
 }
 assert.throws(()=>module.renderSurface({depth:'glow'}),RangeError);
});
test('divider exposes semantic orientation and inset without decoration',()=>{
 assert.equal(typeof module.renderDivider,'function');
 assert.match(module.renderDivider(),/<hr[^>]+v2-divider/);
 assert.match(module.renderDivider({inset:true}),/data-inset="true"/);
 assert.match(module.renderDivider({vertical:true}),/role="separator" aria-orientation="vertical"/);
 assert.throws(()=>module.renderDivider({inset:'true'}),TypeError);
});
test('surface gallery provides related passive surfaces and divider arrangements',()=>{
 assert.equal(typeof module.renderSurfaceSamples,'function');
 const html=module.renderSurfaceSamples();
 for(const id of ['surfaces','dividers'])assert.ok(html.includes('id="'+id+'"'));
 assert.match(html,/data-depth="inset"/);assert.match(html,/aria-orientation="vertical"/);
});
