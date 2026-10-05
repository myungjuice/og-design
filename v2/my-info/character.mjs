import {renderMyInfoTest} from '../../screens/my-info-3d-test/render.mjs';
import {renderMileage} from '../components/mileage.mjs';

export const characterOptions=Object.freeze([
 {key:'bear',label:'곰',description:'느긋하고 든든한 친구'},
 {key:'penguin',label:'펭귄',description:'부지런하고 야무진 친구'},
 {key:'raccoon',label:'너구리',description:'호기심 많고 재빠른 친구'}
]);
const svg=path=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+path+'</svg>';
const plus=svg('<path d="M12 5v14M5 12h14"/>');
const check=svg('<path d="m5 12 4 4L19 6"/>');
function option(key){const value=characterOptions.find(c=>c.key===key);if(!value)throw new RangeError('Unknown character');return value;}
const selectionMessage=key=>option(key).label+(key==='raccoon'?'를':'을')+' 선택했어요.';
// Background-extracted reference mascots share a transparent, full-body art seat.
export function renderCharacterArt(key,{decorative=false}={}){
 const value=option(key);
 return '<span class="v2-character-art" data-character-art="'+value.key+'" '+(decorative?'aria-hidden="true"':'role="img" aria-label="'+value.label+' 캐릭터"')+'></span>';
}
function avatar(key){
 const label=key?option(key).label+' 캐릭터 변경':'프로필 캐릭터 선택';
 return '<button type="button" class="profile-avatar v2-character-avatar" data-character-open aria-label="'+label+'">'+(key?renderCharacterArt(key,{decorative:true}):plus)+'</button>';
}
export function renderCharacterMain({selected=null}={}){
 if(selected!==null)option(selected);
 let html=renderMyInfoTest({assetBase:'/screens/my-info-3d-test/media/figma/',renderBalance:renderMileage});
 const start=html.indexOf('<span class="profile-avatar"'),end=html.indexOf('<div><h1>',start);
 if(start<0||end<0)throw new Error('Profile avatar boundary changed');
 html=html.slice(0,start)+avatar(selected)+html.slice(end);
 html=html.replace(/<button class="profile-edit"[^>]*>[\s\S]*?<\/button>/,'<button type="button" class="profile-edit" data-character-open>'+(selected?'캐릭터 변경하기':'프로필 캐릭터를 선택해 주세요')+' <span aria-hidden="true">›</span></button>')
  .replace('class="my-info-test"','class="my-info-test v2-character-main" data-character-value="'+(selected||'')+'"');
 // Only local character preview controls work; balances and service actions stay inert.
 return html.replace(/<button(?![^>]*data-character-open)\b/g,'<button inert');
}
export function renderCharacterSelection({selected=null}={}){
 if(selected!==null)option(selected);
 const cards=characterOptions.map((value,i)=>'<button type="button" class="v2-character-choice" role="radio" aria-checked="'+(selected===value.key)+'" tabindex="'+(selected?selected===value.key?0:-1:i===0?0:-1)+'" data-character-choice="'+value.key+'"><span class="v2-character-display" aria-hidden="true">'+renderCharacterArt(value.key,{decorative:true})+'</span><span class="v2-character-copy"><strong>'+value.label+'</strong><span>'+value.description+'</span></span><span class="v2-character-check" aria-hidden="true">'+check+'</span></button>').join('');
 return '<section class="v2-character-screen" aria-label="프로필 캐릭터 선택"><header class="v2-character-header"><button type="button" class="v2-character-back" data-character-return aria-label="내정보 미리보기로 돌아가기">'+svg('<path d="m15 18-6-6 6-6"/>')+'</button><h2>프로필 캐릭터</h2><span aria-hidden="true"></span></header><div class="v2-character-body"><h3>함께할 친구를 골라주세요</h3><p>언제든지 바꿀 수 있어요</p><div class="v2-character-options" role="radiogroup" aria-label="프로필 캐릭터">'+cards+'</div><p class="v2-character-status" role="status" aria-live="polite">'+(selected?selectionMessage(selected):'캐릭터를 누르면 바로 선택돼요.')+'</p></div></section>';
}
const mainCSS=['/screens/my-info-3d-test/styles.css','/v2/components/mileage.css','/v2/my-info/screen.css','/v2/components/bottom-navigation.css','/v2/my-info/character.css'];
const links=paths=>paths.map(path=>'<link rel="stylesheet" href="'+path+'">').join('');
export function renderCharacterReview(){
 return '<section id="profile-character" data-review-screen aria-labelledby="profile-character-title" hidden><h2 id="profile-character-title">프로필 캐릭터</h2><p class="v2-intro">캐릭터를 선택하지 않은 내정보와 곰·펭귄·너구리 선택 화면입니다. 가입 시 선택을 강제하지 않고 내정보에서 선택하거나 변경합니다.</p><div class="v2-reservation-review-grid v2-character-review-grid"><figure class="v2-reservation-review-sample"><figcaption>캐릭터 미선택 · 내정보</figcaption><div class="v2-character-main-host"></div></figure><figure class="v2-reservation-review-sample"><figcaption>캐릭터 선택 · 한 번 탭으로 적용</figcaption><div class="v2-character-selection-host"><template data-character-template>'+links(['/v2/my-info/character.css'])+renderCharacterSelection()+'</template></div></figure></div><p class="v2-intro">선택한 캐릭터는 이 화면의 아바타와 멤버십 회원증에 반영됩니다. 실제 회원정보는 저장하지 않으며 파츠 꾸미기는 포함하지 않습니다.</p></section>';
}
export function setupCharacterReview(root){
 const section=root.querySelector('#profile-character');if(!section||section.dataset.characterReady)return;
 section.dataset.characterReady='true';
 let selected=null;
 const mainHost=section.querySelector('.v2-character-main-host'),choiceHost=section.querySelector('.v2-character-selection-host');
 const main=mainHost.attachShadow({mode:'open'}),choice=choiceHost.attachShadow({mode:'open'});
 main.innerHTML=links(mainCSS)+renderCharacterMain();
 choice.append(choiceHost.querySelector('template').content.cloneNode(true));choiceHost.querySelector('template').remove();
 const choose=key=>{
  const value=option(key);selected=key;
  for(const card of choice.querySelectorAll('[data-character-choice]')){const current=card.dataset.characterChoice===key;card.setAttribute('aria-checked',String(current));card.tabIndex=current?0:-1;}
  choice.querySelector('.v2-character-status').textContent=selectionMessage(value.key);
  const frame=main.querySelector('.v2-character-main');frame.dataset.characterValue=key;
  frame.querySelector('.v2-character-avatar').outerHTML=avatar(key);
  frame.querySelector('.profile-edit').innerHTML='캐릭터 변경하기 <span aria-hidden="true">›</span>';
  root.dispatchEvent(new CustomEvent('v2-character-preview-change',{detail:{selected:key}}));
 };
 choice.addEventListener('click',event=>{const card=event.target.closest('[data-character-choice]');if(card)choose(card.dataset.characterChoice);if(event.target.closest('[data-character-return]'))main.querySelector('.v2-character-avatar').focus();});
 choice.addEventListener('keydown',event=>{
  const card=event.target.closest('[data-character-choice]');if(!card||!['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'].includes(event.key))return;
  event.preventDefault();const i=characterOptions.findIndex(c=>c.key===card.dataset.characterChoice);
  const next=event.key==='Home'?0:event.key==='End'?2:(i+(['ArrowDown','ArrowRight'].includes(event.key)?1:2))%3;
  choose(characterOptions[next].key);choice.querySelector('[data-character-choice="'+selected+'"]').focus({preventScroll:true});
 });
 main.addEventListener('click',event=>{if(event.target.closest('[data-character-open]'))choice.querySelector('[data-character-choice="'+(selected||'bear')+'"]').focus();});
}
