import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspace} from '../render.mjs';
import {renderParkReview,renderParkScreen} from './render.mjs';
import {existsSync,statSync} from 'node:fs';

test('latest park is the supplied four-category Figma frame, separate from the previous three-card PDF',()=>{
 const html=renderParkScreen('latest');
 assert.match(html,/data-figma-node="304:2931"/);
 assert.equal((html.match(/class="park-interest-card"/g)||[]).length,4);
 for(const [label,count] of [['한식','357'],['카페/베이커리','163'],['헤어/뷰티','15'],['부동산/인테리어','4']])assert.ok(html.includes(`aria-label="${label} · 매장 ${count}개"`));
 assert.doesNotMatch(html,/interest-emphasis|park-interest-heart|data-park-duplicate-event/);
 assert.equal((html.match(/data-park-card/g)||[]).length,3);
 for(const [,path] of html.matchAll(/src="(\/assets\/[^\"]+)"/g)){
  const file=new URL('../..'+path,import.meta.url);
  assert.ok(existsSync(file),path);assert.ok(statSync(file).size>0,path);
 }
 assert.equal((renderParkScreen('feedback').match(/class="park-category"/g)||[]).length,3);
 assert.match(renderParkReview(),/id="park-latest" data-review-screen/);
});

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

test('feedback park replaces only the previous card artwork and keeps the revised lower sections',()=>{
 const html=renderParkScreen('feedback');
 const cards=[...html.matchAll(/<article class="park-event[\s\S]*?<\/article>/g)].map(match=>match[0]);
 assert.equal(cards.length,3);
 assert.match(cards.find(card=>card.includes('data-position="previous"')),/src="\/assets\/gasong-feedback-20261023\/park-gift.png"/);
 assert.match(cards.find(card=>card.includes('data-position="center"')),/src="\/assets\/figma-ogpark-20261021\/b5b7b.png"/);
 assert.match(cards.find(card=>card.includes('data-position="next"')),/src="\/assets\/figma-ogpark-20261021\/c528d.png"/);
 assert.doesNotMatch(html,/data-park-duplicate-event/);
 assert.equal(html.slice(html.indexOf('<section class="park-contest"')),renderParkScreen('revised').slice(renderParkScreen('revised').indexOf('<section class="park-contest"')));
});

test('park comparison adds an isolated feedback specimen while preserving both earlier specimens',()=>{
 const html=renderParkReview();
 const earlierComparison=html.slice(html.indexOf('<section id="park-comparison"'));
 assert.equal((earlierComparison.match(/data-park-screen=/g)||[]).length,3);
 assert.match(html,/id="park-interest-comparison"/);
 const emphasis=html.split('data-park-screen="interest"')[1]?.split('</template>')[0]||'';
 assert.match(emphasis,/href="\/v2\/og-park\/interest.css"/);
 assert.equal((emphasis.match(/class="park-category"/g)||[]).length,3);
 assert.match(html,/가송님 피드백 반영본 · 10\/23/);
 const feedback=html.split('data-park-screen="feedback"')[1]?.split('</template>')[0]||'';
 assert.match(feedback,/href="\/v2\/og-park\/feedback.css"/);
 for(const version of ['original','revised']){
  const earlier=html.split(`data-park-screen="${version}"`)[1]?.split('</template>')[0]||'';
  assert.doesNotMatch(earlier,/feedback.css|park-gift.png/);
 }
});
