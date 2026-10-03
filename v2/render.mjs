import {navigationItems,renderSidebar} from './navigation.mjs';
import {renderFoundations} from './design-system/foundations.mjs';
import {renderComponents} from './components/render.mjs';
import {renderMyInfoPreview} from './my-info/render.mjs';
import {renderBarcodePreview} from './barcode/render.mjs';
import {renderHomePreview} from './home/render.mjs';
import {renderSubnavigation,renderReviewPicker} from './subnavigation.mjs';
export function renderWorkspace({pageId}={}) {
 const item=navigationItems.find(item=>item.id===pageId);
 const content=item
  ? `<h1>${item.label}</h1>${renderReviewPicker(pageId)}${pageId==='design-system'?renderFoundations():pageId==='components'?renderComponents():['my-info','barcode','home'].includes(pageId)?`<section id="overview" data-review-screen>${pageId==='my-info'?renderMyInfoPreview():pageId==='barcode'?renderBarcodePreview():renderHomePreview()}</section>`:''}`
  : '<h1>페이지를 찾을 수 없습니다</h1><a href="/v2/design-system/">디자인 시스템으로 돌아가기</a>';
 return `<a class="v2-skip" href="#v2-content">본문으로 이동</a>
 <div class="v2-workspace${pageId==='components'?' v2-component-workspace':''}"><aside class="v2-sidebar"><a class="v2-brand" href="/v2/">3D컨셉 디자인 v2</a>${renderSidebar({activeId:pageId})}<a class="v2-back" href="/">자료 홈으로</a></aside>
 ${renderSubnavigation({pageId,label:item?.label||'하위 메뉴'})}
 <main id="v2-content" tabindex="-1">${content}</main></div>`;
}
