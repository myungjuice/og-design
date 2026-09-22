import {appBar} from '../../components/app-shell/render.mjs';
import {surface} from '../../components/surfaces/render.mjs';
import {listRow} from '../../components/list-row/render.mjs';
import {escapeHTML as e} from '../../components/core.mjs';
// Neutral specimen text: FAQ categories, questions and answers are supplied by the legacy API.
const categories=['분류 1','분류 2','분류 3','분류 4'];
const top=Array.from({length:4},(_,i)=>({category:categories[i],title:'자주 찾는 질문 제목 '+(i+1),body:'선택한 도움말의 답변 내용입니다.\n긴 답변은 문단을 나누어 표시합니다.'}));
const items=Array.from({length:3},(_,i)=>({title:'선택한 분류의 질문 제목 '+(i+1),body:'질문에 대한 답변 내용입니다.\n내용이 길어지면 아래로 이어서 표시합니다.'}));
const paragraphs=value=>String(value).split('\n').map(p=>'<p>'+e(p)+'</p>').join('');
export function faq({top:best=top,categories:groups=categories,items:questions=items,bestIndex=-1,categoryIndex=-1,itemIndex=-1}={}){
 const selectedCategory=categoryIndex>=0&&categoryIndex<groups.length&&groups[categoryIndex]!=='';
 const selectedBest=!selectedCategory&&bestIndex>=0&&bestIndex<best.length?best[bestIndex]:null;
 const tiles=best.map((q,i)=>surface({className:'og-faq-best-card'+(selectedBest&&i===bestIndex?' is-selected':''),contentHTML:'<button type="button" aria-expanded="'+Boolean(selectedBest&&i===bestIndex)+'"><strong>'+String(i+1).padStart(2,'0')+'.</strong><span>#'+e(q.category)+'</span><span>'+e(q.title)+'</span></button>'})).join('');
 const answer=selectedBest?surface({className:'og-faq-best-answer',contentHTML:'<strong>'+String(bestIndex+1).padStart(2,'0')+'.</strong><p class="og-faq-tag">#'+e(selectedBest.category)+'</p><h3>'+e(selectedBest.title)+'</h3><div class="og-faq-copy">'+paragraphs(selectedBest.body)+'</div>'}):'';
 const padded=groups.length%2?[...groups,'']:groups;
 const grid=padded.map((name,i)=>name?'<button type="button" aria-pressed="'+Boolean(selectedCategory&&i===categoryIndex)+'">'+e(name)+'</button>':'<span class="og-faq-category-blank" aria-hidden="true"></span>').join('');
 const rows=selectedCategory?'<div class="og-faq-questions">'+questions.map((q,i)=>'<section class="og-faq-item">'+listRow({title:q.title,leading:'icon',iconHTML:'Q.',className:'og-faq-question',attributes:{'aria-expanded':i===itemIndex}})+(i===itemIndex?'<div class="og-faq-answer"><strong>A.</strong><div>'+paragraphs(q.body)+'</div></div>':'')+'</section>').join('')+'</div>':'';
 return '<section class="og-faq" inert aria-label="자주 묻는 질문">'+appBar({title:'자주 묻는 질문',back:true})+'<div class="og-faq-scroll"><section class="og-faq-best"><h3>자주 찾는 도움말</h3><div class="og-faq-carousel">'+tiles+'</div>'+(best.length>1?'<div class="og-faq-dots" aria-hidden="true">'+Array.from({length:best.length-1},(_,i)=>'<span'+(i===0?' class="is-current"':'')+'></span>').join('')+'</div>':'')+answer+'</section><div class="og-faq-categories">'+grid+'</div>'+rows+'</div></section>';
}
export function faqBoard(){
 const states=[['기본 상태',{}],['도움말을 선택했을 때',{bestIndex:0}],['카테고리를 선택했을 때',{categoryIndex:0}],['답변을 펼쳤을 때',{categoryIndex:0,itemIndex:0}]];
 return states.map(([label,props],i)=>'<section class="'+(i?'history-empty-example':'')+'"><h3 class="history-state-label">'+label+'</h3><div class="screen-page-content"><div class="screen-artboard">'+faq(props)+'</div>'+(i===0?'<div class="screen-design-notes"><h3>도움말과 질문 목록</h3><p>도움말 카드는 가로로, 카테고리는 두 열로 배치했습니다. 선택한 항목만 블루로 강조했습니다.</p><h3>읽기 편한 답변</h3><p>질문은 화이트, 펼쳐진 답변은 연한 블루로 구분했습니다. 카드에만 은은한 입체감을 주었습니다.</p></div>':'')+'</div></section>').join('');
}
