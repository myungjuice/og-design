import {icon} from './icons.mjs';
import {homeArt} from './home-art.mjs';
const navigation=[['홈','home'],['마이랜드','compass'],['바코드','scan'],['오지파크','star'],['내 정보','user']];
const barcodeArt='<span class="barcode-art" aria-hidden="true"><img src="./media/figma/bottom-navigation-source.png" width="851" height="1847" alt="" decoding="async"></span>';
export function renderBottomNavigation({active='내 정보',home=false}={}){
 return '<nav class="bottom-navigation" aria-label="주 메뉴">'+navigation.map(([label,name])=>'<button class="nav-item'+(name==='scan'?' nav-barcode':'')+(label===active?' is-selected':'')+'" data-preview="'+label+'"'+(label===active?' aria-current="page"':'')+'><span class="nav-face">'+(name==='scan'?barcodeArt:home?homeArt(name,{width:26}):icon(name,{size:26,dimensional:true}))+'</span><span>'+label+'</span></button>').join('')+'</nav>';
}
