import {homeScreen} from './render.mjs';
import {storeScreen} from './store.mjs';
export function depthProposal(kind,imageSrc=''){
 const home=kind==='home';
 const screen=home?homeScreen():storeScreen({images:[imageSrc,imageSrc],logo:imageSrc,menu:true,reserve:true,wait:true,news:true,event:true});
 return '<section id="review-'+kind+'-depth-proposal" class="depth-proposal-section"><h3>개선안 · '+(home?'홈 지도':'매장 상세')+'</h3><div class="screen-page-content"><div class="screen-artboard og-depth-proposal">'+screen+'</div><div class="screen-design-notes"><h3>'+(home?'지도 위에 얹힌 조작부':'밝은 배경과 흰 표면')+'</h3><p>'+(home?'검색창과 필터를 밝은 블루 받침 위에 정돈했습니다. 버튼은 밝은 윗면과 얇은 하단 경계로 두께를 표현합니다. 지도와 기존 핀은 유지했습니다.':'매장 소개와 본문을 밝은 블루 배경 위에 올렸습니다. 흰 표면의 밝은 윗면과 부드러운 그림자로 깊이를 맞췄습니다.')+'</p><button type="button" data-home-prompt data-depth-prompt="'+kind+'">AI 프롬프트</button></div></div></section><h3 class="depth-original-label">기존 시안</h3>';
}

