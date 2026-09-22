import test from 'node:test';
import assert from 'node:assert/strict';
test('news list has no two-row cap and keeps corrected empty text',async()=>{
 const {newsListScreen}=await import('./news-pages.mjs');
 const html=newsListScreen({items:[1,2,3].map(i=>({title:'소식'+i,date:'9.19(토)'}))});
 assert.equal((html.match(/class="og-update-row"/g)||[]).length,3);
 assert.match(html,/우리 가게 소식/);
 const empty=newsListScreen({items:[]});assert.match(empty,/등록된 데이터가 없어요/);assert.doesNotMatch(empty,/등톡|og-update-row/);
});
test('news detail keeps date/title/body/image order and escapes content',async()=>{
 const {newsDetailScreen,newsPagesBoard}=await import('./news-pages.mjs');
 const html=newsDetailScreen({title:'<제목>',contents:'첫째\n둘째',imageSrc:'sample.png'});
 assert.match(html,/&lt;제목&gt;/);assert.ok(html.indexOf('등록일 :')<html.indexOf('&lt;제목&gt;'));
 assert.ok(html.indexOf('첫째')<html.indexOf('sample.png'));assert.match(html,/첫째\n둘째/);
 assert.doesNotMatch(newsDetailScreen(),/<img|공유|댓글/);
 assert.equal((newsPagesBoard('list').match(/class="screen-artboard"/g)||[]).length,2);
 assert.equal((newsPagesBoard('detail').match(/class="screen-artboard"/g)||[]).length,2);
});
