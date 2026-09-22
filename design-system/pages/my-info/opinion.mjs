import {appBar} from '../../components/app-shell/render.mjs';
import {textField,textarea} from '../../components/input/render.mjs';
import {button,iconButton} from '../../components/button/render.mjs';
import {segment} from '../../components/tabs-chips/render.mjs';
import {attachmentItem} from '../../components/attachments/render.mjs';
import {badge} from '../../components/badges/render.mjs';
import {feedback} from '../../components/feedback/render.mjs';
import {escapeHTML as e,uid} from '../../components/core.mjs';
const types=['회원점 정보','앱 사용','마일리지/포인트','OG 페이','OG 박스','기타'];
const terms=[
 '・고객의 소리 민원 처리를 위해 고객님의 연락처로 고객센터(또는 매장)에서 연락드릴 수 있습니다.',
 '・관계 법령에 저촉되거나 사회통념 등에 어긋나는 내용(예: 개인정보 보안, 불충분한 증거/귀책 사유에 대한 개인 음해성/음란성 비방, 의도적인 업무방해 등) 또는 광고성 게시물은 별도의 사전 통보 없이 답변이 되지 않을 수 있으며, 등록된 의견은 처리가 시작되면 수정이 불가하오니 이 점 양지하여 주시기 바랍니다.',
 '・공정거래위원회에서 고사한 소비자분쟁해결기준에 의거 소비자 피해에 대한 교환/환불 처리 해드립니다.'
];
const required=label=>e(label)+'<span class="og-opinion-required" aria-label="필수">●</span>';
const clear=label=>iconButton({label:label+' 지우기',name:'close',className:'og-field-clear'});
const photosHTML=(photos,remove)=>photos.length?'<div class="og-opinion-photos">'+photos.slice(0,2).map(src=>attachmentItem({src,alt:'첨부 이미지 예시',remove})).join('')+'</div>':'';
const records=[
 {title:'작성한 문의 제목',body:'보내신 문의 내용이 표시되는 영역입니다.',status:'요청',date:'26.09.18 10:00:00',photos:[]},
 {title:'작성한 문의 제목',body:'보내신 문의 내용이 표시되는 영역입니다.',status:'확인중',date:'26.09.17 10:00:00',answerTitle:'답변 제목',answerBody:'등록된 답변 내용이 표시되는 영역입니다.',answerDate:'26.09.18 11:00:00',photos:[]},
 {title:'작성한 문의 제목',body:'보내신 문의 내용이 표시되는 영역입니다.',status:'완료',date:'26.09.16 10:00:00',answerTitle:'답변 제목',answerBody:'등록된 답변 내용이 표시되는 영역입니다.',answerDate:'26.09.17 11:00:00',photos:[]}
];
function answerRows(rows,expanded){
 if(!rows.length)return feedback({symbol:'question_answer',title:'현재 문의 중인 내용이 없습니다.'});
 return '<div class="og-opinion-records">'+rows.map((r,i)=>'<section class="og-opinion-record"><button type="button" class="og-opinion-record-heading" aria-expanded="'+(i===expanded)+'"><span class="og-opinion-record-title"><strong>R.</strong><span>'+e(r.title)+'</span></span>'+badge({label:r.status,tone:r.status==='요청'?'neutral':r.status==='확인중'?'success':'info'})+'<time>'+e(r.date)+'</time></button>'+(i===expanded?'<div class="og-opinion-request-body"><p>'+e(r.body)+'</p>'+photosHTML(r.photos||[],false)+'</div><div class="og-opinion-answer">'+(r.status==='요청'?'<div class="og-opinion-processing"><strong>처리 중입니다.</strong><p>조금만 기다려주세요.</p></div><p>문의하신 내용이 정상적으로 접수되었습니다.</p><p>문의하신 사항에 대해 정확히 확인한 후에 빠르게 답변을 드리도록 하겠습니다.</p>':'<h3><span>A.</span> '+e(r.answerTitle||'')+'</h3><time>'+e(r.answerDate||'')+'</time><p>'+e(r.answerBody||'')+'</p>')+'</div>':'')+'</section>').join('')+'</div>';
}
export function opinion({tab=0,category=-1,title='',body='',photos=[],records:rows=records,expanded=-1}={}){
 const id=uid('opinion');
 const form='<div class="og-opinion-form"><div class="og-field"><label for="'+id+'-category">'+required('분류')+'</label><select id="'+id+'-category"><option value=""'+(category===-1?' selected':'')+'>카테고리를 선택해주세요</option>'+types.map((t,i)=>'<option'+(category===i?' selected':'')+'>'+e(t)+'</option>').join('')+'</select></div>'+textField({labelHTML:required('제목'),value:title,placeholder:'제목을 입력해주세요',trailingHTML:title?clear('제목'):''})+textarea({labelHTML:required('내용'),value:body,placeholder:'내용을 입력해주세요',maxLength:null,trailingHTML:body?clear('내용'):''})+'<div class="og-opinion-attach">'+button({label:'+ 사진첨부',variant:'secondary'})+'<p>첨부파일은 최대 2개, 10MB까지 등록 가능합니다.</p></div>'+photosHTML(photos,true)+'<div class="og-opinion-terms">'+terms.map(t=>'<p>'+e(t)+'</p>').join('')+'</div></div>';
 const valid=category>=0&&category<types.length&&title.trim()&&body.trim();
 return '<section class="og-opinion" inert aria-label="의견보내기">'+appBar({title:'의견보내기',back:true})+'<div class="og-opinion-tabs">'+segment({items:[{label:'문의하기'},{label:'답변보기'}],selected:tab})+'</div><div class="og-opinion-scroll">'+(tab===0?form:answerRows(rows,expanded))+'</div>'+(tab===0&&valid?'<footer class="og-opinion-submit">'+button({label:'의견보내기'})+'</footer>':'')+'</section>';
}
export function opinionBoard({imageSrc=''}={}){
 const filled={category:1,title:'의견 제목',body:'보내실 의견을 작성한 예시입니다.'};
 const states=[['입력 전',{}],['입력 완료',filled],['사진을 첨부했을 때',{...filled,photos:imageSrc?[imageSrc,imageSrc]:[]}],['답변 목록',{tab:1}],['답변을 펼쳤을 때',{tab:1,expanded:2}],['처리 중인 문의를 펼쳤을 때',{tab:1,expanded:0}],['문의 내역이 없을 때',{tab:1,records:[]}]];
 return states.map(([label,props],i)=>'<section class="'+(i?'history-empty-example':'')+'"><h3 class="history-state-label">'+label+'</h3><div class="screen-page-content"><div class="screen-artboard">'+opinion(props)+'</div>'+(i===0?'<div class="screen-design-notes"><h3>입력 흐름</h3><p>분류·제목·내용을 위에서 아래로 배치했습니다. 입력칸은 화이트로, 안내문은 연한 블루로 구분했습니다.</p><h3>작성과 답변</h3><p>상단 선택 영역으로 두 화면을 나누고, 답변은 문의 내용 아래에 이어서 표시했습니다.</p></div>':'')+'</div></section>').join('');
}
