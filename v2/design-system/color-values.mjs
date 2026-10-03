// Resolve the actual swatch (including CSS variables / OKLCH) to displayable sRGB.
export function updateColorValues(root){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=1;
 const ctx=canvas.getContext('2d',{colorSpace:'srgb'});
 for(const output of root.querySelectorAll('[data-color-token]')){
  const swatch=output.closest('.v2-color-row').querySelector('.v2-swatch');
  ctx.clearRect(0,0,1,1);
  ctx.fillStyle=getComputedStyle(swatch).backgroundColor;
  ctx.fillRect(0,0,1,1);
  const [r,g,b]=ctx.getImageData(0,0,1,1).data;
  output.textContent=`RGB(${r}, ${g}, ${b})`;
 }
}
export function setupColorValues(root){
 updateColorValues(root);
 const observer=new MutationObserver(()=>updateColorValues(root));
 observer.observe(document.documentElement,{attributes:true,attributeFilter:['style','class']});
 return ()=>observer.disconnect();
}
