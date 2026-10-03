import test from 'node:test';
import assert from 'node:assert/strict';
import * as components from './render.mjs';
import {sectionHeading} from '../../design-system/components/section-heading/render.mjs';
import {iconButton} from '../../design-system/components/button/render.mjs';
import {renderSubnavigation} from '../subnavigation.mjs';

const render=options=>{
 assert.equal(typeof components.renderSectionHeading,'function','v2 provides the shared section heading');
 return components.renderSectionHeading(options);
};
test('plain section heading preserves real heading semantics without fake controls',()=>{
 const html=render({title:'최근 방문',description:'최근 방문한 매장을 확인하세요.'});
 assert.match(html,/<h3>최근 방문<\/h3>/);
 assert.match(html,/class="og-section-heading v2-section-heading"/);
 assert.match(html,/og-heading-description/);
 assert.doesNotMatch(html,/<button|aria-expanded|data-heading-action/);
});
test('heading and help text escape user-visible content',()=>{
 const html=render({title:'<img onerror=bad>',description:'<script>bad</script>',infoButton:true,helpText:'<b>안내</b>'});
 assert.doesNotMatch(html,/<img|<script|<b>/);
 assert.match(html,/&lt;img onerror=bad&gt;/);assert.match(html,/&lt;b&gt;안내&lt;\/b&gt;/);
});
test('independent information button connects to a unique hidden explanation with a real SVG',()=>{
 const a=render({title:'OG 마일리지',infoButton:true,helpText:'사용 가능한 금액을 확인하세요.'});
 const b=render({title:'OG 마일리지',infoButton:true,helpText:'마일리지 안내입니다.'});
 const controls=a.match(/aria-controls="([^"]+)"/)[1];
 assert.match(a,new RegExp(`id="${controls}"[^>]* hidden`));
 assert.match(a,/aria-expanded="false"/);assert.match(a,/<svg /);
 assert.doesNotMatch(a,/class="material-icons"/);assert.doesNotMatch(b,new RegExp(`id="${controls}"`));
 assert.throws(()=>render({title:'OG 마일리지',infoButton:true}),TypeError);
});
test('action processing and unavailable states block interaction without changing the title',()=>{
 for(const state of ['loading','disabled']){
  const html=render({title:'이용내역',action:'전체보기',state});
  assert.match(html,/<h3>이용내역<\/h3>/);assert.match(html,/<button type="button"[^>]* disabled/);
  assert.match(html,new RegExp(`data-state="${state}"`));
  if(state==='loading')assert.match(html,/aria-busy="true"/);
 }
});
test('action result states have readable feedback and invalid states are rejected',()=>{
 const error=render({title:'이용내역',action:'전체보기',state:'error'});
 const success=render({title:'이용내역',action:'전체보기',state:'success'});
 assert.match(error,/다시 시도/);assert.match(error,/불러오지 못/);
 assert.match(success,/확인 완료/);assert.match(success,/확인했습니다/);
 assert.throws(()=>render({title:'최근 방문',state:'unknown'}),RangeError);
});
test('gallery integrates headings into the existing cards-information group',()=>{
 const html=components.renderComponents();
 assert.match(html,/id="section-heading"/);
 for(const id of ['heading-basic','heading-description','heading-action','heading-information','heading-long'])assert.match(html,new RegExp(`id="${id}"`));
 assert.match(renderSubnavigation({pageId:'components',label:'공통 컴포넌트'}),/href="#section-heading"/);
 assert.equal(sectionHeading({title:'최근 방문'}),'<div class="og-section-heading"><div class="og-heading-copy"><div class="og-heading-title-line"><h3>최근 방문</h3></div></div></div>','legacy markup remains intact');
});
test('legacy heading actions and info icon preserve exact default markup',()=>{
 assert.equal(sectionHeading({title:'최근 방문',description:'방문한 매장을 확인하세요.',action:'전체보기',actionId:'history'}),'<div class="og-section-heading"><div class="og-heading-copy"><div class="og-heading-title-line"><h3>최근 방문</h3></div><p class="og-heading-description">방문한 매장을 확인하세요.</p></div><button type="button" class="og-text-button og-heading-action" id="history">전체보기</button></div>');
 assert.equal(sectionHeading({title:'OG 마일리지',infoButton:true,action:'내역보기',infoId:'info',helpId:'help',actionId:'history'}),'<div class="og-section-heading"><div class="og-heading-copy"><div class="og-heading-title-line"><h3>OG 마일리지</h3><button type="button" class="og-icon-button og-info-button og-heading-info" aria-label="OG 마일리지 안내" aria-expanded="false" id="info" aria-controls="help"><span class="material-icons" aria-hidden="true">info_outline</span></button></div></div><button type="button" class="og-text-button og-heading-action" id="history">내역보기</button></div>');
 assert.equal(iconButton({label:'안내'}),'<button type="button" class="og-icon-button" aria-label="안내"><span class="material-icons" aria-hidden="true">info_outline</span></button>');
});
