import test from 'node:test';
import assert from 'node:assert/strict';
import * as components from './render.mjs';
import {tooltip,popover} from '../../design-system/components/help/render.mjs';
import {reviewGroups} from '../subnavigation.mjs';
test('help reuses escaped original markup with non-modal dialog and short tooltip semantics',()=>{
 assert.equal(typeof components.renderHelp,'function');
 const html=components.renderHelp({id:'help"id',title:'<안내>',body:'<설명>'});
 assert.match(html,/og-popover v2-help-panel/);assert.match(html,/role="dialog"/);
 assert.match(html,/aria-labelledby="help&quot;id-title"/);assert.match(html,/&lt;설명&gt;/);
 assert.doesNotMatch(html,/aria-modal|material-icons/);
 const tip=components.renderHelp({kind:'tooltip',id:'tip',body:'<짧은 설명>',live:true});
 assert.match(tip,/role="tooltip"/);assert.match(tip,/popover="auto"/);assert.doesNotMatch(tip,/<button/);
 assert.throws(()=>components.renderHelp({kind:'invalid',body:'설명'}),RangeError);
 assert.throws(()=>components.renderHelp({body:' '}),TypeError);
 assert.throws(()=>components.renderHelp({title:' ',body:'설명'}),TypeError);
});
test('help gallery includes static and tap examples in the existing feedback group',()=>{
 const html=components.renderComponents().match(/<section[^>]*id="help"[\s\S]*?<\/section>/)?.[0];
 assert.ok(html,'help is in the actual gallery');
 assert.match(html,/data-help-trigger="popover"/);assert.match(html,/data-help-trigger="tooltip"/);
 assert.match(html,/aria-haspopup="dialog"/);assert.match(html,/class="v2-help-stage" inert/);
 assert.ok(reviewGroups('components').find(g=>g.id==='feedback').items.some(i=>i.id==='help'));
});
test('original help renderers remain unchanged',()=>{
 assert.equal(tooltip({id:'tip',message:'안내'}),'<div class="og-tooltip" id="tip" role="tooltip">안내</div>');
 assert.match(popover({id:'pop',title:'안내',body:'설명'}),/class="og-popover" id="pop" role="dialog"/);
 assert.doesNotMatch(popover({id:'pop'}),/v2-help/);
});
