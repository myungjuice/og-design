import {rankMedals} from '../components/content-patterns.mjs';
import {scene,hero,art,image,badge,tabs,action,reward,sectionTitle,steps,terms} from './details-shared.mjs';
const photos='/assets/gasong-contest-20261112/';
const coverPhotos={
 '진행 중':photos+'01-pizza-salad.jpg',
 '심사 중':photos+'05-beef-platter.jpg',
 '종료':photos+'06-coffee.jpg'
};
const interior=photos+'10-cafe-interior.jpg';
const contestTitle='우리 동네 맛집 사진 공모전';
const ownEntry={title:'정성 가득한 한 상',photo:photos+'03-steak.jpg',likes:47};
const entrySamples={
 detail:[ownEntry,
  {title:'한 접시에 담은 정성',photo:photos+'02-sushi.jpg',likes:243},
  {title:'맛있게 나누는 한 입',photo:photos+'04-yukhoe-bites.jpg',likes:95}],
 judging:[ownEntry,
  {title:'함께 나누는 저녁',photo:photos+'05-beef-platter.jpg',likes:126},
  {title:'오늘의 작은 쉼표',photo:photos+'06-coffee.jpg',likes:83}],
 result:[ownEntry,
  {title:'취향이 담긴 공간',photo:photos+'07-tableware.jpg',likes:154},
  {title:'초록빛 쉬어 가는 곳',photo:photos+'09-garden.jpg',likes:108}]
};
function cover({state='진행 중',compact=false}={}){
 return `<section class="pd-contest-cover${compact?' compact':''}">${image(coverPhotos[state],'공모전 대표 사진 예시','pd-contest-photo')}<div class="pd-cover-shade"></div><div class="pd-card-tags">${badge('사진','neutral')}${badge(state,state==='심사 중'?'warning':state==='종료'?'neutral':'brand')}</div><div class="pd-contest-copy"><h1>${contestTitle}</h1><p class="pd-cover-meta"><span>10.01 ~ 10.31</span><span>324명 참여</span></p></div></section>`;
}
function entries(state='detail'){return `<div class="pd-entry-grid">${entrySamples[state].map(entry=>`<article>${image(entry.photo,'공모전 출품 사진 예시')}<strong>${entry.title}</strong><span>♡ ${entry.likes}</span></article>`).join('')}</div>`;}
const prizes=rankMedals;
function contestList(){
 return scene({title:'공모전',navigation:true,body:`${hero('사진 · 영상 · 그림','우리 동네의 매력을<br>함께 나눠요','나만의 순간을 작품으로 남겨보세요.','70193.png','pd-contest-hero')}${tabs(['진행 중','심사 중','종료'],'진행 중')}<div class="pd-contest-list"><article class="pd-contest-list-item">${cover({compact:true})}<div class="pd-contest-list-copy"><strong>사진으로 전하는 우리 동네</strong><p>1등 5,000 M <span>324명 참여</span></p></div></article><article class="pd-secondary-contest"><div>${badge('영상','neutral')}<h3>회원점에서 만난 하루</h3><p>짧은 영상으로 나만의 이야기를 들려주세요.</p><b>1등 5,000 M</b></div>${art('ca749.png','pd-secondary-art')}</article><article class="pd-secondary-contest pd-drawing"><div>${badge('그림','neutral')}<h3>내가 그린 우리 동네</h3><p>그림으로 담아보는 동네의 새로운 모습</p><b>1등 5,000 M</b></div>${art('c528d.png','pd-secondary-art')}</article></div>`});
}
function detail(){return scene({title:'공모전',body:`${cover()}<section class="pd-section">${sectionTitle('마음에 남은 한 장을 공유해요')}<p class="pd-copy">회원점에서 만난 맛있는 순간을 사진으로 담아주세요.</p>${prizes()}</section><section class="pd-section">${sectionTitle('이렇게 참여해요')}${steps([['회원점에서 사진을 찍어요','내가 직접 촬영한 사진을 준비해요.'],['사진과 이야기를 올려요','출품하기에서 작품을 등록해 주세요.'],['결과를 기다려요','심사 일정과 발표는 공모전 안내에서 확인해요.']])}</section><section class="pd-section">${sectionTitle('출품작 둘러보기','전체 보기 ›')}${entries()}</section>${terms(['본인이 직접 만든 작품으로 참여해 주세요.','심사 일정과 수상 기준은 공모전 안내를 확인해 주세요.'])}`,footer:action('출품하기',{submit:true})});}
function judging(){return scene({title:'공모전',body:`${cover({state:'심사 중'})}<section class="pd-own-entry"><div>${badge('내 출품작')}<h3>${ownEntry.title}</h3><p>10.12 출품 · 좋아요 ${ownEntry.likes}</p><strong>✓ 정상 접수되었습니다</strong></div>${image(ownEntry.photo,'내 출품작 예시')}</section><section class="pd-section"><ol class="pd-timeline"><li class="done"><span></span>출품 마감</li><li class="current"><span></span>심사 중</li><li><span></span>결과 발표</li></ol><div class="pd-judging-message"><h2>좋은 작품을 고르고 있어요</h2><p>발표일은 공모전 안내에서 확인해 주세요.</p></div>${prizes()}</section><section class="pd-section">${sectionTitle('출품작 324개','전체 보기 ›')}${entries('judging')}</section>`,footer:action('출품이 마감되었어요',{disabled:true})});}
function result(){return scene({title:'공모전',body:`${cover({state:'종료'})}${prizes()}<section class="pd-winner-message">${art('70193.png','pd-winner-trophy')}<div><span>나의 출품 결과</span><h2>2등 수상!</h2><p>${ownEntry.title} · 좋아요 ${ownEntry.likes}</p></div></section><div class="pd-award-reward">${reward('수상 마일리지','3,000 M')}${badge('지급 완료','success')}</div><section class="pd-section">${sectionTitle('수상작')}<article class="pd-winning-entry">${image(photos+'08-cafe-exterior.jpg','1등 수상작 예시')}<span class="pd-rank">1등</span><div><strong>동네에서 만난 풍경</strong><span>연주 · 좋아요 218</span></div></article><div class="pd-runner-grid">${[2,3].map((rank,i)=>`<article>${image(i?interior:ownEntry.photo,rank+'등 수상작 예시')}<span>${rank}등</span><strong>${i?'동네에서 찾은 쉼터':ownEntry.title}</strong></article>`).join('')}</div></section><section class="pd-section">${sectionTitle('전체 출품작','324개 ›')}${entries('result')}</section>`,footer:action('진행 중인 공모전 보기')});}
export function renderContestScreen(state='list'){
 const renderers={list:contestList,detail,judging,result};if(!Object.hasOwn(renderers,state))throw new RangeError('Unsupported contest state');return renderers[state]();
}
