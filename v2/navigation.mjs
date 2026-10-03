export const navigationItems = [
 {id:'design-system',label:'디자인 시스템',href:'/v2/design-system/'},
 {id:'components',label:'공통 컴포넌트',href:'/v2/components/'},
 {id:'home',label:'홈화면',href:'/v2/home/'},
 {id:'my-land',label:'마이랜드',href:'/v2/my-land/'},
 {id:'barcode',label:'바코드',href:'/v2/barcode/'},
 {id:'og-park',label:'오지파크',href:'/v2/og-park/'},
 {id:'my-info',label:'내정보',href:'/v2/my-info/'}
];
export function renderSidebar({activeId}={}) {
 return `<details class="v2-menu" open><summary>메뉴</summary>
 <nav class="v2-primary-nav" aria-label="3D컨셉 디자인 v2">${navigationItems.map(item=>{
  const link=`<a href="${item.href}"${item.id===activeId?' aria-current="page"':''}>${item.label}</a>`;
  return item.id==='components'&&activeId==='components'?`<div>${link}${renderComponentExplorer()}</div>`:link;
 }).join('')}</nav></details>`;
}
import {renderComponentExplorer} from './components/catalog.mjs';
