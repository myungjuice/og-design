import test from 'node:test';
import assert from 'node:assert/strict';
const module=await import('./attachments.mjs').catch(()=>({}));
test('attachments distinguish explicit preview states without native file upload',()=>{
 assert.equal(typeof module.renderAttachments,'function');
 const empty=module.renderAttachments({id:'att'});assert.match(empty,/data-attachment-add/);assert.doesNotMatch(empty,/<img|type="file"/);
 const ready=module.renderAttachments({state:'ready',src:'/assets/a.png',alt:'예시 "$&'});assert.match(ready,/data-attachment-remove/);assert.match(ready,/width="96" height="96"/);assert.match(ready,/예시 &quot;\$&amp;/);
 const uploading=module.renderAttachments({state:'uploading',src:'/a.png',progress:40});assert.match(uploading,/role="progressbar"/);assert.match(uploading,/aria-valuenow="40"/);assert.match(uploading,/data-attachment-cancel/);assert.doesNotMatch(uploading,/data-attachment-remove/);
 assert.match(module.renderAttachments({state:'error',src:'/a.png'}),/data-attachment-retry/);
 for(const props of [{state:'ready'},{state:'unknown'},{progress:101},{state:'ready',src:'javascript:alert(1)'}])assert.throws(()=>module.renderAttachments(props));
});
test('viewer preserves original dark shell, aspect ratio, named modal and actual failure content',()=>{
 assert.equal(typeof module.renderImageViewer,'function');
 const html=module.renderImageViewer({id:'viewer',src:'/a.png',alt:'멤버십',modal:true});
 assert.match(html,/<dialog[^>]*aria-label="멤버십 이미지 보기"/);assert.match(html,/og-image-viewer v2-image-viewer/);
 assert.match(html,/data-viewer-zoom/);assert.match(html,/data-viewer-close/);assert.match(html,/width="1280" height="1280"/);
 assert.doesNotMatch(html,/material-icons/);
 const error=module.renderImageViewer({mode:'error'});assert.match(error,/다시 시도/);assert.doesNotMatch(error,/<img/);
 assert.throws(()=>module.renderImageViewer({src:'//untrusted.test/a.png'}),TypeError);
});
