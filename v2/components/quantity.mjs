import {quantity} from '../../design-system/components/quantity/render.mjs';
import {escapeHTML as e,icon as legacyIcon,uid,attributes as attrs} from '../../design-system/components/core.mjs';
import {stateComparison} from './catalog.mjs';
function valid(value,min,max){
 if(!Number.isSafeInteger(value)||!Number.isSafeInteger(min)||min<0||value<min||max!==null&&(!Number.isSafeInteger(max)||max<min||value>max))throw new RangeError('Invalid quantity range');
}
export function changeQuantity(value,delta,min=1,max=5){
 valid(value,min,max);if(![-1,1].includes(delta))throw new RangeError('Quantity changes one item at a time');
 if(max===null&&value===Number.MAX_SAFE_INTEGER&&delta===1)throw new RangeError('Quantity exceeds a safe integer');
 return Math.max(min,Math.min(max??Number.MAX_SAFE_INTEGER,value+delta));
}
const symbol=plus=>'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14'+(plus?'M12 5v14':'')+'"/></svg>';
const messages={disabled:'현재는 수량을 변경할 수 없습니다.',loading:'수량 변경을 처리하는 중입니다.',error:'수량을 변경하지 못했습니다. 현재 수량을 확인하고 다시 조절해 주세요.',success:'변경된 수량입니다.'};
export function renderQuantity({id=uid('v2-quantity'),value=1,min=1,max=5,locked=false,state='default',label='주문 수량'}={}){
 valid(value,min,max);if(!['default','active','disabled','loading','error','success'].includes(state))throw new RangeError('Unsupported quantity state');
 if(typeof label!=='string'||!label.trim()||typeof locked!=='boolean')throw new TypeError('Quantity needs a name and a boolean lock');
 const unavailable=locked||['disabled','loading'].includes(state),message=messages[state]||(locked?messages.disabled:''),reason=id+'-reason';
 const html=quantity({id,value,min,max,locked:unavailable,label,descriptionId:message?reason:'',state:state==='active'?'is-pressed':''})
  .replace('class="og-quantity"',()=> 'class="og-quantity v2-quantity"'+attrs({'data-state':state,'aria-busy':state==='loading'?'true':undefined}))
  .replace(legacyIcon('remove'),symbol(false)).replace(legacyIcon('add'),symbol(true))
  .replace(/<button[^>]*data-quantity-plus[^>]*>/,tag=>value===Number.MAX_SAFE_INTEGER&&!tag.includes(' disabled')?tag.slice(0,-1)+' disabled>':tag);
 return html+(message?'<p class="v2-quantity-message" id="'+e(reason)+'" data-state="'+state+'">'+e(message)+'</p>':'');
}
export function renderQuantitySamples(){
 const sample=(title,props)=>'<figure class="v2-component-sample"><figcaption><strong>'+e(title)+'</strong></figcaption><div class="v2-quantity-stage" inert>'+renderQuantity(props)+'</div></figure>';
 return '<section class="v2-component-section" id="quantity" aria-labelledby="quantity-title" hidden><h2 id="quantity-title">수량 조절</h2><p>현재 수량을 가운데에 두고 한 개씩 조절합니다. 하나의 밝은 프레임 안에서 누른 버튼에만 얕은 눌림을 줍니다.</p><div class="v2-quantity-stage" data-quantity-live>'+renderQuantity({id:'v2-quantity-live'})+'<p>1–5개는 원본 검토 예시이며 실제 주문 제한이 아닙니다.</p></div>'+stateComparison('<div class="v2-quantity-grid">'+[
 ['최소 수량',{value:1}],['최대 수량',{value:5}],['두 자리 수량',{value:99,max:99}],['누르는 중',{value:2,state:'active'}],['변경 불가',{value:2,state:'disabled'}],['처리 중',{value:2,state:'loading'}],['변경 실패',{value:2,state:'error'}],['변경 완료',{value:3,state:'success'}]
 ].map(([title,props])=>sample(title,props)).join('')+'</div>')+'<p>버튼 48px · 아이콘 20px. 숫자는 직접 입력하지 않으며 최소 수량에서 상품을 삭제하지 않습니다. 실제 주문·수량 저장은 하지 않습니다.</p></section>';
}
export function setupQuantitySamples(root){
 for(const node of root.querySelectorAll('.v2-quantity')){
  if(node.closest('[inert]')||node.dataset.quantityReady)continue;node.dataset.quantityReady='true';
  const min=Number(node.dataset.min),max=node.hasAttribute('data-max')?Number(node.dataset.max):null;
  node.addEventListener('click',event=>{
   const button=event.target.closest('[data-quantity-minus],[data-quantity-plus]');if(!button||button.disabled||node.getAttribute('aria-disabled')==='true')return;
   const value=changeQuantity(Number(node.dataset.value),button.hasAttribute('data-quantity-minus')?-1:1,min,max);
   node.dataset.value=String(value);node.querySelector('[data-quantity-value]').textContent=String(value);
   const minus=node.querySelector('[data-quantity-minus]'),plus=node.querySelector('[data-quantity-plus]');minus.disabled=value===min;plus.disabled=value===max||value===Number.MAX_SAFE_INTEGER;
   if(button.disabled&&node.ownerDocument.activeElement===button){const other=button===plus?minus:plus;if(!other.disabled)other.focus({preventScroll:true});}
   node.dispatchEvent(new CustomEvent('quantitychange',{bubbles:true,detail:{value}}));
  });
 }
}
