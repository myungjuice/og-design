// Review assets from the November 24 design delivery.
const root='/assets/mascot-20261124/';
export const winterBackgroundSrc=root+'backgrounds/winter.jpg';
export const mascotNames=Object.freeze({bear:'베리',penguin:'피노',raccoon:'너그'});

export function mascotBaseSrc(character){
 return root+'base/'+character+'.png';
}

export function decemberMascotSrc(character,pose){
 return root+'months/12/'+character+'/'+pose+'.png';
}

const selectionKey='og-design:december-character';
export function previewCharacter(){
 try{
  const key=sessionStorage.getItem(selectionKey);
  return Object.hasOwn(mascotNames,key)?key:null;
 }catch{return null;}
}
export function showHangingCharacter(key){
 document.documentElement.style.setProperty('--hanging-mascot','url("'+decemberMascotSrc(key,'profile-hanging')+'")');
}
export function selectPreviewCharacter(key){
 showHangingCharacter(key);
 try{sessionStorage.setItem(selectionKey,key);}catch{/* The current page still previews the selection. */}
}

export function renderDecemberPicker(id){
 const options=Object.entries(mascotNames).map(([key,label])=>`<option value="${key}">${label}</option>`).join('');
 return `<label class="md-mascot-control">12월 캐릭터 <select data-mascot-preview="${id}">${options}</select></label>`;
}

export function setupDecemberPicker(host){
 const mascot=host.shadowRoot.querySelector('[data-december-pose]');
 if(!mascot)return;
 const picker=host.closest('[data-review-screen]').querySelector('[data-mascot-preview]');
 picker.addEventListener('change',()=>{
  const character=picker.value;
  mascot.src=decemberMascotSrc(character,mascot.dataset.decemberPose);
  mascot.alt='12월 '+mascotNames[character]+' 캐릭터';
 });
}
