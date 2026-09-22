import {homeScreen} from './render.mjs';
import {storeScreen} from './store.mjs';
export function subtleProposal(kind,imageSrc=''){
 const home=kind==='home';
 const screen=home?homeScreen():storeScreen({images:[imageSrc,imageSrc],logo:imageSrc,menu:true,reserve:true,wait:true,news:true,event:true});
 return '<section id="review-'+kind+'-depth-subtle" class="depth-proposal-section"><h3>새 비교안 B · '+(home?'홈 지도':'매장 상세')+' · 얕은 입체감</h3><div class="screen-page-content"><div class="screen-artboard og-depth-subtle">'+screen+'</div><div class="screen-design-notes"><h3>'+(home?'받침 없이 가볍게':'흰 화면 위의 얕은 깊이')+'</h3><p>'+(home?'검색창과 버튼을 지도 위에 각각 배치했습니다. 밝은 윗면과 얇은 아래쪽 그림자만 더했습니다.':'매장 정보와 소개는 원래 위치에 두었습니다. 큰 카드로 감싸지 않고 사진 표면과 탐색 영역에만 깊이를 더했습니다.')+'</p><button type="button" data-home-prompt data-depth-prompt="'+kind+'" data-depth-subtle>AI 프롬프트</button></div></div></section><h3 class="depth-original-label">이전 비교안 A · 블루 배경</h3>';
}
