import {myInfo} from '../pages/my-info/render.mjs';
import {homeScreen} from '../pages/home/render.mjs';
import {storeScreen} from '../pages/home/store.mjs';
import {storeImage} from './specimen-media.mjs';
import {focusBoard} from './canvas.js?v=20260919-partitions';

// Reuse the screen renderers; only the preview's surface treatment differs.
export function createSurfaceExample(canvas){
 const spec={
  'my-info':['내 정보','연한 블루 바탕 · 흰 카드','서로 다른 정보를 카드로 묶고, 연한 배경으로 카드 사이를 구분합니다. 프로필에는 블루를 남기고 메뉴에는 얇은 밑면을 더했습니다.',()=>myInfo(),'my-info-main'],
  explore:['홈·매장 탐색','지도 바탕 · 떠 있는 조작부','지도는 그대로 두고 검색창과 버튼만 살짝 띄웠습니다. 조작부 전체를 감싸는 파란 받침은 없습니다.',()=>homeScreen(),'home-main'],
  store:['매장 상세','흰 바탕 · 사진과 탐색에 얕은 깊이','매장 정보와 소개는 흰 바탕에서 이어집니다. 사진과 탐색 영역에만 얕은 그림자를 두고, 내용을 큰 카드로 다시 감싸지 않았습니다.',()=>storeScreen({images:[storeImage(),storeImage()],logo:storeImage(),menu:true,reserve:true,wait:true,news:true,event:true}),'home-store']
 }[canvas];
 if(!spec)return null;
 const [title,subtitle,copy,render,source]=spec;
 const page=document.createElement('section');
 page.id='review-surface-'+canvas;page.className='screen-page proposal-page surface-example';page.dataset.family='home';page.dataset.source=source;
 page.innerHTML='<header class="screen-page-heading"><div><span>배경과 입체감 · 새 비교 예시</span><h2>'+title+'</h2></div></header><div class="screen-page-content"><div class="screen-artboard og-surface-example '+(canvas==='my-info'?'':'og-depth-subtle')+'">'+render()+'</div><div class="screen-design-notes"><h3>'+subtitle+'</h3><p>'+copy+'</p><h3>공통으로 맞춘 부분</h3><p>밝은 윗면, 얇은 테두리, 짧고 부드러운 그림자를 사용했습니다. 화면의 역할에 따라 배경만 다르게 적용했습니다.</p></div></div>';
 const originalPrompt=document.querySelector('#'+source+' > .screen-page-heading button');
 if(originalPrompt){const prompt=originalPrompt.cloneNode(true);prompt.onclick=()=>originalPrompt.click();page.querySelector('.screen-page-heading').append(prompt);}
 document.querySelector('#world').append(page);
 const link=document.createElement('button');link.type='button';link.dataset.screenLink=page.id;link.textContent='새 비교 예시 · '+title;link.onclick=()=>focusBoard(page.id);document.querySelector('aside nav').prepend(link);
 const option=document.createElement('option');option.value=page.id;option.textContent=link.textContent;document.querySelector('#board-picker').prepend(option);
 return page;
}
