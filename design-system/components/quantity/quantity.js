/* Local integer quantity; native buttons retain keyboard and disabled behavior. */
window.ogAttachQuantity=function(root){
 const min=Number(root.dataset.min),max=Number(root.dataset.max);let value=Number(root.dataset.value);
 if(![min,max,value].every(Number.isSafeInteger)||min<0||max<min||value<min||value>max)throw new RangeError('Invalid quantity range');
 const minus=root.querySelector('[data-quantity-minus]'),plus=root.querySelector('[data-quantity-plus]'),number=root.querySelector('[data-quantity-value]');
 function render(){const locked=root.getAttribute('aria-disabled')==='true';number.textContent=String(value);root.dataset.value=String(value);minus.disabled=locked||value===min;plus.disabled=locked||value===max;}
 function change(delta,button){if(button.disabled)return;value=Math.max(min,Math.min(max,value+delta));render();if(button.disabled&&document.activeElement===button){const other=button===plus?minus:plus;if(!other.disabled)other.focus({preventScroll:true});}root.dispatchEvent(new CustomEvent('quantitychange',{bubbles:true,detail:{value}}));}
 minus.addEventListener('click',()=>change(-1,minus));plus.addEventListener('click',()=>change(1,plus));render();
};
