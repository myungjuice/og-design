import {storeInfoSection,locationSheet} from '../../design-system/pages/home/store-info.mjs';
import {publicStoreData} from '../../design-system/pages/home/public-store-data.mjs';
import {icon} from '../../design-system/components/core.mjs';
import {renderHomeStoreContent} from './store.mjs';
import {remainingGallery,setupRemainingGallery} from './remaining-gallery.mjs';
const clock='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>';
const adapt=html=>html.replaceAll(icon('access_time'),()=>clock).replace(/<button\b(?![^>]*\binert\b)/g,'<button inert').replaceAll('<h3>','<h5>').replaceAll('</h3>','</h5>');
const valid=(state,allowed)=>{if(!allowed.includes(state))throw new RangeError('Unsupported information state');};
export function renderHomeStoreInfoScreen({state='registered',data=publicStoreData}={}){
 valid(state,['registered','minimal']);const source=data.info;
 const info=state==='minimal'?{streetAddress:source.streetAddress,detailAddress:source.detailAddress,phone:source.phone}:source;
 return `<div class="v2-home-store-frame v2-home-store-info-frame" data-store-info-state="${state}">${renderHomeStoreContent({store:data.store,selectedSection:2,contentHTML:adapt(storeInfoSection(info)),bodyLabel:'매장 주소와 상세정보'})}</div>`;
}
export function renderHomeStoreLocationScreen({state='registered',data=publicStoreData}={}){
 valid(state,['registered']);const info=renderHomeStoreInfoScreen({data});
 let sheet=adapt(locationSheet(data.location)).replace('class="og-surface og-navigation-sheet"','class="og-surface og-navigation-sheet" role="region" tabindex="0" aria-label="위치찾기 앱 선택"');
 // These are app-selection controls, not new navigation links. Keep original icons.
 sheet=sheet.replaceAll('<div class="og-navigation-provider">','<button type="button" inert class="og-navigation-provider">').replace(/(<span>(?:카카오|네이버|티맵)<\/span>)<\/div>/g,'$1</button>');
 return `<div class="v2-home-store-location-frame" data-store-location-state="${state}"><div class="v2-location-background" inert>${info}</div><div class="og-location-overlay">${sheet}</div></div>`;
}
const styles=['/v2/components/icon-button.css','/v2/components/media.css','/v2/home/store.css','/v2/home/information.css'];
export const renderHomeStoreInfoReview=()=>remainingGallery({id:'store-info',title:'매장 상세정보',copy:'주소·영업시간·연락처 등 등록된 매장 정보를 확인하는 영역입니다. 오시 망원본점의 공개 스냅샷에는 도로명 주소와 영업시간만 등록되어 있어 없는 연락처는 추가하지 않았습니다. 아래 비교는 일부 정보가 없을 때의 배치이며 복사·위치찾기·외부 링크는 실행하지 않습니다.',states:[['registered','등록된 매장 정보'],['minimal','일부 정보만 있는 경우 · 배치 비교']],screen:renderHomeStoreInfoScreen,styles});
export const renderHomeStoreLocationReview=()=>remainingGallery({id:'store-location',title:'위치찾기',copy:'매장명과 지번 주소를 확인하고 길찾기에 사용할 앱을 고르는 시트입니다. 기존 카카오·네이버·티맵 아이콘과 순서를 유지합니다. 별도 지도 화면이 아니며 주소 복사·앱 열기는 실행하지 않습니다.',states:[['registered','길찾기 앱 선택']],screen:renderHomeStoreLocationScreen,styles});
export const setupHomeInformationReview=root=>{for(const id of ['store-info','store-location'])setupRemainingGallery(root,id);};
