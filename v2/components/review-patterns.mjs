import {participationSteps,participationTerms,rankMedals} from './content-patterns.mjs';
import {renderFinalLandmarkPin} from '../home/landmark-final.mjs';
import {renderStoreBestLabel} from '../home/store-landmark.mjs';
import {pinArtworkURL} from '../category-artwork.mjs';
import {postCard,setupCommunityFeed} from '../og-park/community.mjs';
const section=(id,title,body)=>`<section class="v2-component-section" id="${id}" hidden><h2>${title}</h2>${body}</section>`;
export function renderReviewPatterns(){return [
 section('map-markers','지도 핀 · 선택과 랜드마크',`<p>선택 시 핀과 장식이 함께 1.4배 커집니다. 확정된 네온 왕관을 재사용합니다.</p><div class="v2-marker-samples">${[false,true].map(on=>`<figure><img src="${pinArtworkURL('반려동물/동물병원',on?'on':'off')}" width="${on?60:60/1.4}" alt="${on?'선택':'미선택'} 지도 핀"><figcaption>${on?'선택 · 1.4배':'미선택'}</figcaption></figure><figure>${renderFinalLandmarkPin(on,{wrapped:true})}<figcaption>랜드마크 · ${on?'선택':'미선택'}</figcaption></figure>`).join('')}<figure><span class="v2-favorite-pin"><img src="${pinArtworkURL('반려동물/동물병원','off')}" width="43" alt="즐겨찾기 지도 핀"><b aria-label="즐겨찾기">♥</b></span><figcaption>즐겨찾기 배지</figcaption></figure></div>`),
 section('best-label','BEST 네온 라벨',`<div class="v2-pattern-stage">${renderStoreBestLabel()}<p>매장명과 업종 옆에 쓰는 공통 라벨입니다.</p></div>`),
 section('content-patterns','참여 단계 · 메달 · 접힘 안내',`<div class="v2-pattern-stage">${rankMedals()}${participationSteps([['사진 촬영','회원점에서 촬영해요.'],['작품 출품','사진과 이야기를 올려요.'],['결과 확인','발표를 기다려요.']])}${participationTerms(['직접 촬영한 작품으로 참여해 주세요.','일정과 수상 기준은 공모전 안내를 확인해 주세요.'])}</div>`),
 section('community-row','커뮤니티 목록 행',`<p>한 목록 안에 구분선을 사용합니다. 좋아요는 주황빨강, 댓글은 회색을 유지합니다. 길게 누르거나 메뉴 키로 게시글 메뉴를 열 수 있습니다.</p><div class="v2-pattern-stage pd-post-list">${[false,true].map((_,i)=>postCard({character:i?'penguin':'bear',name:i?'동네탐험가':'특별한 사탕',time:'3시간 전',store:'동네 카페',member:true,text:'우리 동네에서 발견한 좋은 공간을 소개해요.',photo:null,likes:12,comments:3})).join('')}</div>`),
 section('mascot-rules','마스코트 사용 규칙','<p>내정보에서 선택한 곰·펭귄·너구리를 다른 화면에도 일관되게 표시합니다. 캐릭터 선택 화면과 기존 에셋을 기준으로 사용하며, 추가 동작 이미지 제작은 별도 협의 대상입니다. 이번 수정에는 마스코트 신규 제작이 포함되지 않습니다.</p>'+'<p>출석 완료 · 연속 보상 · 오지빙글 결과 · 오지팡팡 결과 · 게임 배경에 같은 캐릭터를 사용합니다.</p>')
 ].join('');}
export const setupReviewPatterns=setupCommunityFeed;
