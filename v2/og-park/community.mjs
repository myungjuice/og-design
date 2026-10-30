import {scene,art,image,parkArt,badge,tabs,action,sectionTitle,empty} from './details-shared.mjs';
import {categoryArtwork} from '../category-artwork.mjs';
// Received category symbols: 23 business types; the overall-category symbol is not an interest.
export const interestCategories=Object.freeze(['한식','중식','일식','양식','아시안/세계음식','분식','치킨','카페/베이커리','샐러드/비건','패스트푸드/도시락','야식/술집/포차','헤어/뷰티','운동/스포츠/레저','의료/건강','반려동물/동물병원','교육/학원','문구/완구/취미','액세서리/잡화','출산/육아','생활서비스','자동차','부동산/인테리어','전문서비스업']);
const selectedCategories=['한식','카페/베이커리','헤어/뷰티'];
function selectionTray(selected){return `<div class="pd-selection-tray" aria-label="선택한 관심 업종">${[0,1,2].map(i=>`<div class="${selected[i]?'filled':''}">${selected[i]?categoryArtwork(selected[i],32)+'<span>'+selected[i]+'</span>':'<span class="pd-slot-plus">+</span><span>선택 '+(i+1)+'</span>'}</div>`).join('')}</div>`;}
export function renderInterestSelection(state='selected'){
 if(!['empty','selected','search'].includes(state))throw new RangeError('Unsupported interest state');
 const selected=state==='empty'?[]:state==='search'?['카페/베이커리']:selectedCategories;
 const categories=state==='search'?interestCategories.filter(name=>name.includes('카페')):interestCategories;
 return scene({title:'관심 업종',className:'pd-interests-screen',body:`<div class="pd-interest-heading">${art('ac0f4.png','pd-interest-art')}<h1>어떤 이야기에<br>관심이 있으세요?</h1><p>좋아하는 업종을 <b>최대 3개</b> 골라주세요.</p></div>${selectionTray(selected)}<div class="pd-search" role="search">${image('/assets/received-icons-20261017/functions/'+encodeURIComponent('검색.svg'))}<span class="${state==='search'?'pd-search-value':''}">${state==='search'?'카페':'관심 업종 검색'}</span></div>${state==='search'?'<p class="pd-note">검색 결과 1개</p>':''}<div class="pd-interest-grid">${categories.map(name=>`<button type="button" inert class="pd-interest-choice" aria-pressed="${selected.includes(name)}">${categoryArtwork(name,42)}<span>${name}</span>${selected.includes(name)?'<i>✓</i>':''}</button>`).join('')}</div>`,footer:`<div class="pd-selection-count"><b>${selected.length} / 3</b><span>언제든지 변경할 수 있어요</span></div>${action('선택 완료',{disabled:!selected.length})}<button type="button" inert class="pd-skip">건너뛰기</button>`});
}
const posts=[
 {character:'bear',name:'특별한 사탕',time:'3시간 전',store:'오정해장국·두정점',member:true,text:'여기 누룽지탕 진짜 진하고 좋아요.\n아직 안 드셔보셨다면 추천해요!',photo:'a7e68.png',likes:24,comments:8},
 {character:'penguin',name:'동네탐험가',time:'6시간 전',store:'미사 손칼국수',member:false,text:'여기 아직 회원점은 아닌데 진짜 맛있어요.\n동네 분들께도 소개하고 싶어요.',photo:null,likes:17,comments:12},
 {character:'raccoon',name:'오늘의 한 끼',time:'8시간 전',store:'오정해장국·두정점',member:true,text:'점심 한 끼 든든하게 먹고 왔어요!',photo:'a7e68.png',likes:38,comments:6}
];
function postCard(post){return `<article class="pd-post"><header><span class="pd-post-avatar"><img src="/v2/my-info/media/${post.character}-cutout-v2.png" alt=""></span><div><strong>${post.name}</strong><span>${post.time}</span></div><button type="button" inert aria-label="게시글 메뉴">···</button></header><div class="pd-store-tag"><span class="pd-location-dot">⌖</span><strong>${post.store}</strong>${badge(post.member?'회원점':'일반 매장',post.member?'brand':'neutral')}</div><p>${post.text.replaceAll('\n','<br>')}</p>${post.photo?image(parkArt+post.photo,'게시글에 첨부한 음식 사진 예시','pd-post-photo'):''}<div class="pd-post-stats"><span>♡ ${post.likes}</span><span>댓글 ${post.comments}</span></div></article>`;}
export function renderCommunityFeed(state='latest'){
 if(!['latest','popular','empty'].includes(state))throw new RangeError('Unsupported community state');
 const items=state==='popular'?[...posts].sort((a,b)=>b.likes-a.likes):posts;
 return scene({title:'커뮤니티',navigation:true,className:'pd-community-screen',body:`<div class="pd-community-heading"><span class="pd-kicker">함께 나누는 동네 이야기</span><h1>오늘, 우리 동네는?</h1><p>관심 업종의 새로운 이야기를 만나보세요.</p></div>${tabs(selectedCategories,'한식')}<div class="pd-feed-filter"><span>우리 동네 5km</span><span>${state==='popular'?'인기순':'최신순'}⌄</span></div>${state==='empty'?empty('아직 이야기가 없어요','이 업종의 첫 번째 이야기를 들려주세요.'):`<div class="pd-post-list">${items.map(postCard).join('')}</div>`}<div class="pd-write-seat">${action('글쓰기')}</div>`});
}
