import {escapeHTML as e} from '../design-system/components/core.mjs';

// 단독 업종 SVG는 기존 수령본, 지도 핀은 11/10 재전달된 최종 I안 원본을 사용한다.
const base='/assets/received-icons-20261022/';
const aliases={'아시안':'아시안/세계음식','술집':'야식/술집/포차','패스트푸드':'패스트푸드/도시락','뷰티':'헤어/뷰티','운동/헬스':'운동/스포츠/레저','레저':'운동/스포츠/레저','운동/서비스/레저':'운동/스포츠/레저'};
export const categoryName=name=>{const value=name.normalize('NFC').replaceAll('-','/');return aliases[value]||value;};
const file=name=>encodeURIComponent(categoryName(name).replaceAll('/','-'));
export const categoryArtworkURL=name=>base+'categories/'+file(name)+'.svg';
export const pinArtworkURL=(name,state='off')=>{
 if(!['on','off'].includes(state))throw new RangeError('Unsupported pin state');
 return '/assets/received-icons-20261110/pins/'+state+'/'+file(name)+'.png';
};
export const categoryArtwork=(name,size=24)=>`<img class="received-icon" data-received-icon="category" src="${categoryArtworkURL(name)}" width="${size}" height="${size}" alt="" aria-hidden="true" decoding="async" data-received-category="${e(categoryName(name))}">`;
export const pinArtwork=(name,state='off',size=40,cls='received-pin-art')=>`<img class="${e(cls)}" data-received-icon="pin-${state}" src="${pinArtworkURL(name,state)}" width="${size}" height="${size}" alt="" aria-hidden="true" decoding="async" data-received-category="${e(categoryName(name))}">`;
