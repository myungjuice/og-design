import {navigationItems,renderSidebar} from './navigation.mjs';
export function renderWorkspace({pageId}={}) {
 const item=navigationItems.find(item=>item.id===pageId);
 const pending=['home','barcode','my-info'].includes(pageId);
 const content=item
  ? `<h1>${item.label}</h1>${pending?'<div class="v2-pending"><p>대표 화면 연결 예정</p><p>공통 컴포넌트 검토 후 이곳으로 옮깁니다.</p><a href="/screens/my-info-3d-test/">현재 3D 시안 보기</a></div>':''}`
  : '<h1>페이지를 찾을 수 없습니다</h1><a href="/v2/design-system/">디자인 시스템으로 돌아가기</a>';
 return `<a class="v2-skip" href="#v2-content">본문으로 이동</a>
 <div class="v2-workspace"><aside class="v2-sidebar"><a class="v2-brand" href="/v2/">3D컨셉 디자인 v2</a>${renderSidebar({activeId:pageId})}<a class="v2-back" href="/">자료 홈으로</a></aside>
 <main id="v2-content" tabindex="-1">${content}</main></div>`;
}
