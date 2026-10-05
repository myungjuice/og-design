import {surface,divider} from '../../design-system/components/surfaces/render.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';
export function renderSurface({contentHTML='',depth='raised',id}={}){
 if(!['flat','raised','inset'].includes(depth))throw new RangeError('Unsupported surface depth');
 return surface({contentHTML,depth,className:'v2-surface',attributes:{id}});
}
export function renderDivider({inset=false,vertical=false}={}){
 if(typeof inset!=='boolean'||typeof vertical!=='boolean')throw new TypeError('Divider options must be boolean');
 return divider({inset,vertical}).replace('class="og-divider"','class="og-divider v2-divider"');
}
export function renderSurfaceSamples(){
 const sample=(title,copy,html)=>'<figure class="v2-component-sample"><figcaption><strong>'+e(title)+'</strong><span>'+e(copy)+'</span></figcaption><div class="v2-surface-stage">'+html+'</div></figure>';
 return '<section class="v2-component-section" id="surfaces" aria-labelledby="surfaces-title" hidden><h2 id="surfaces-title">정보 표면</h2><p>같은 흰 표면이라도 정보의 역할에 따라 깊이를 구분합니다. 표면 자체에는 선택·눌림 효과를 넣지 않습니다.</p><div class="v2-surface-grid">'+[
  ['raised','정보 카드','최근 방문처럼 함께 읽는 정보에 사용합니다.'],['flat','평면 영역','목록·안내는 선과 여백으로 구분합니다.'],['inset','얕은 파임','카드 안의 보조 요약을 조용히 묶습니다.']
 ].map(([depth,title,copy])=>sample(title,copy,renderSurface({depth,contentHTML:'<h3>'+e(title)+'</h3><p>'+e(copy)+'</p>'}))).join('')+'</div><p>안쪽 여백 16px · 모서리 20px · 테두리 1px. 누르는 메뉴는 기존 카드·메뉴 타일에서 따로 확인합니다.</p></section>'+
 '<section class="v2-component-section" id="dividers" aria-labelledby="dividers-title" hidden><h2 id="dividers-title">구분선</h2><p>여백만으로 구분이 어려울 때 사용합니다. 선에는 그림자나 선택 색을 넣지 않습니다.</p><div class="v2-surface-grid">'+
 sample('전체 너비','정보 묶음의 경계를 연결합니다.','<div class="v2-divider-demo"><p>이용 안내</p>'+renderDivider()+'<p>문의하기</p></div>')+
 sample('안쪽 여백','좌우 16px을 띄웁니다.','<div class="v2-divider-demo"><p>공지사항</p>'+renderDivider({inset:true})+'<p>자주 묻는 질문</p></div>')+
 sample('세로 구분','좁은 화면에서는 정보를 쌓고 가로선으로 바꿉니다.','<div class="v2-divider-columns"><div><span>사용 가능</span><strong>15,000 M</strong></div>'+renderDivider({vertical:true})+'<div><span>총 보유</span><strong>16,000 M</strong></div></div>')+'</div></section>';
}
