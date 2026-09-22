import {button,iconButton,textarea,surface,thumbnail,dialog,textButton} from '../../components/index.mjs';
import {appBar} from '../../components/app-shell/render.mjs';
import {escapeHTML as e,icon,uid} from '../../components/core.mjs';
export function reviewWrite({body='',photos=[],original=null,deletedCount=0,expanded=false,selected=-1,sourceOpen=false,helpOpen=false}={}){
 const changed=original===null?body.length>0||photos.length>0:body!==original.body||deletedCount>0||photos.length!==original.photos.length||photos.some((p,i)=>p.id!==original.photos[i]?.id);
 const id=uid('review-body');
 const heading=(label,action)=>'<div class="og-write-heading"><h3>'+label+'</h3>'+action+'</div>';
 const input=textarea({id,label:'리뷰 내용',value:body,placeholder:'리뷰 내용을 입력해주세요.',maxLength:null,attributes:{rows:expanded?Math.max(5,body.split('\n').length):5,readonly:true}});
 const photoGrid=surface({className:'og-write-images',contentHTML:photos.map((p,i)=>'<div class="og-write-photo'+(i===selected?' is-selected':'')+'">'+thumbnail({src:p.src,alt:'리뷰 이미지 '+(i+1),state:p.src?'ready':'empty'})+(i===selected?iconButton({label:'리뷰 사진 삭제',name:'delete',className:'og-write-delete'}):'')+'</div>').join('')});
 const help=helpOpen?'<div class="og-write-overlay">'+dialog({title:'사진 리뷰 등록 방법',bodyHTML:iconButton({label:'도움말 닫기',name:'close',className:'og-write-help-close'})+'<div class="og-write-help"><h4>'+icon('move_down')+'순서 변경</h4><p>사진을 길게 눌러 옮기면 순서를 바꿀 수 있습니다.</p><h4>'+icon('delete_outline')+'사진삭제</h4><p>사진을 탭하여 확대 화면에서 삭제하실 수 있습니다.</p></div>'})+'</div>':'';
 const source=sourceOpen?'<div class="og-write-overlay is-source">'+surface({className:'og-write-source',contentHTML:textButton({label:'갤러리'})+textButton({label:'카메라'})})+'</div>':'';
 return '<section class="og-review-write" inert aria-label="사진 리뷰 등록">'+appBar({title:'사진 리뷰 등록',back:true,trailingHTML:iconButton({label:'사진 리뷰 등록 방법',name:'help_outline'})})+'<div class="og-write-body">'+heading('리뷰 내용',button({variant:'text',className:'og-write-inline',iconHTML:icon(expanded?'expand_less':'expand_more')+'<span>'+(expanded?'접기':'펼쳐 보기')+'</span>'}))+input+heading('리뷰 이미지',button({variant:'text',className:'og-write-inline',iconHTML:icon('add')+'<span>사진 추가</span>'}))+photoGrid+'</div>'+(changed?'<footer class="og-write-footer">'+button({label:'취소',variant:'secondary'})+button({label:'변경 내용 저장'})+'</footer>':'')+source+help+'</section>';
}
export function reviewWriteBoard({imageSrc=''}={}){
 const photos=[{id:'a',src:imageSrc},{id:'b',src:imageSrc}],body='편하게 이용했어요.';
 const long='편하게 이용했어요.\n\n친구와 함께 방문했습니다.\n\n음식과 매장 사진을 남깁니다.\n\n다음에도 방문하고 싶어요.';
 const states=[['입력 전',{}],['글과 사진을 작성했을 때',{body,photos}],['리뷰 내용을 펼쳤을 때',{body:long,photos,expanded:true}],['사진을 선택했을 때',{body,photos,selected:0}],['기존 리뷰 · 변경 전',{body,photos,original:{body,photos}}],['사진 추가 · 선택 메뉴',{body,photos,sourceOpen:true}],['사진 리뷰 등록 방법',{helpOpen:true}]];
 return states.map(([label,props],i)=>'<section class="'+(i?'history-empty-example':'')+'"><h3 class="history-state-label">'+e(label)+'</h3><div class="screen-page-content"><div class="screen-artboard">'+reviewWrite(props)+'</div>'+(i===0?'<div class="screen-design-notes"><h3>글 다음에 사진</h3><p>리뷰 내용과 이미지 영역을 위아래로 나눴습니다. 펼쳐 보기와 사진 추가는 각 제목 오른쪽에 배치했습니다.</p><h3>사진 선택</h3><p>선택한 사진에만 삭제 아이콘을 표시합니다. 이미지 영역에는 공통 카드의 옅은 그림자를 적용했습니다.</p></div>':'')+'</div></section>').join('');
}
