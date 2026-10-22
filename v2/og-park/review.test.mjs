import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {renderParkScreen} from './render.mjs';

test('revised park is a fixed PDF specimen with three visible-layout cards and a static page indicator',()=>{
 const html=renderParkScreen('revised');
 const banner=html.match(/<section class="park-carousel"[\s\S]*?<\/section>/)?.[0]||'';
 assert.equal((banner.match(/data-park-card/g)||[]).length,3);
 assert.match(banner,/01 \| 03/);
 assert.doesNotMatch(banner,/<button|tabindex|aria-roledescription="캐러셀"/);
 assert.doesNotMatch(html,/data-park-event-list|data-park-carousel|data-park-toggle|data-park-all-events/);
});

test('park route shows the unmodified reference beside a separately identified revision',()=>{
 const html=renderWorkspace({pageId:'og-park'});
 assert.match(html,/id="park-comparison"[^>]*data-review-screen/);
 assert.match(html,/data-park-screen="original"/);
 assert.match(html,/data-park-screen="revised"/);
 const original=html.split('data-park-screen="original"')[1]?.split('</template>')[0]||'';
 const revised=html.split('data-park-screen="revised"')[1]?.split('</template>')[0]||'';
 assert.match(original,/data-park-duplicate-event/);
 assert.doesNotMatch(revised,/data-park-duplicate-event/);
 for(const screen of [original,revised]){
  assert.match(screen,/data-park-contest/);
  assert.match(screen,/관심 업종 회원들과 이야기해요/);
  assert.match(screen,/data-figma-navigation/);
 }
 for(const label of ['한식','카페/베이커리','헤어/뷰티'])assert.ok(revised.includes(label),label);
});
