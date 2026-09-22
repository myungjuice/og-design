import {bottomSheet,menuTile,dialog} from '../../components/index.mjs';
import {icon} from '../../components/core.mjs';
import {myInfo} from './render.mjs';
const destinations=[['자주 묻는 질문','help_outline',false],['1:1 문의하기','chat_bubble_outline',true],['의견보내기','edit_note',true],['고객 센터','headset_mic',false],['약관 및 정책','description',false],['접근 권한 안내','admin_panel_settings',false]];
export function support({loggedIn=true,confirmOpen=false}={}){
 const body='<div class="og-support-grid">'+destinations.filter(([, ,membersOnly])=>loggedIn||!membersOnly).map(([label,name])=>menuTile({label,iconHTML:icon(name)})).join('')+'</div>';
 const confirmation=confirmOpen&&loggedIn?'<div class="og-support-overlay">'+dialog({title:'1:1 상담 문의',body:'1:1 상담 문의는 카카오 채널을 통해서 진행됩니다.\n\n카카로 앱으로 이동하시겠습니까?',actions:[{label:'취소',variant:'secondary'},{label:'확인'}]})+'</div>':'';
 return '<section class="og-history-screen og-support" inert aria-label="문의하기"><div class="og-history-backdrop" aria-hidden="true">'+myInfo()+'</div><div class="og-history-scrim"></div>'+bottomSheet({title:'문의하기',bodyHTML:body})+confirmation+'</section>';
}
export function supportBoard(){
 return [['기본 상태',{}],['로그인하지 않았을 때',{loggedIn:false}],['1:1 상담 문의 · 이동 확인',{confirmOpen:true}]].map(([title,props],i)=>'<section class="'+(i?'history-empty-example':'')+'"><h3 class="history-state-label">'+title+'</h3><div class="screen-page-content"><div class="screen-artboard">'+support(props)+'</div>'+(i===0?'<div class="screen-design-notes"><h3>메뉴를 한눈에</h3><p>여섯 메뉴를 2열로 배치했습니다. 긴 이름도 잘리지 않도록 타일 너비를 확보했습니다.</p><h3>같은 메뉴 타일</h3><p>내 정보에서 사용하는 타일을 재사용했습니다. 블루 아이콘과 밝은 윗면, 옅은 그림자를 유지했습니다.</p></div>':'')+'</div></section>').join('');
}
