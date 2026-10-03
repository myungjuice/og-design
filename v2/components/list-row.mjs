import {listRow} from '../../design-system/components/list-row/render.mjs';
import {surface,divider} from '../../design-system/components/surfaces/render.mjs';
import {menuArt} from '../../screens/my-info-3d-test/render.mjs';
import {stateComparison} from './catalog.mjs';

const states=['default','active','disabled','loading','error','success'];
const descriptions={disabled:'현재 이용할 수 없는 메뉴입니다.',loading:'내역을 불러오는 중입니다.',error:'불러오지 못했습니다. 눌러 다시 확인하세요.',success:'내역을 불러왔습니다.'};
export function renderListRow({title='',description='',value='',interactive=true,state='default',art='',attributes={}}={}){
 if(!states.includes(state))throw new RangeError('Unsupported list state: '+state);
 if(art&&!['receipt','bell','membership','support','settings','account'].includes(art))throw new RangeError('Unsupported list art: '+art);
 return listRow({title,description:description||(interactive?descriptions[state]:'')||'',value,interactive,
  leading:art?'icon':'',iconHTML:art?menuArt(art,'/screens/my-info-3d-test/media/figma/'):'',className:'v2-list-row',
  attributes:{...attributes,'data-state':state,'data-preview-row':interactive?title:undefined,
   disabled:interactive&&['disabled','loading'].includes(state),'aria-busy':interactive&&state==='loading'?'true':undefined}});
}
const card=rows=>surface({className:'v2-list-card',contentHTML:rows.join(divider())});
const sample=(id,title,description,rows)=>`<figure class="v2-component-sample" id="${id}"><figcaption><strong>${title}</strong><span>${description}</span></figcaption>${card(rows)}</figure>`;
export function renderListRowSamples(){
 return `<section class="v2-component-section" id="list-row" aria-labelledby="list-row-title" hidden><h2 id="list-row-title">목록 행</h2><p>카드의 가장자리와 3D 아이콘으로 깊이를 표현합니다. 각 행의 글자·금액·이동 표시는 평면으로 유지합니다.</p>
 <div class="v2-list-grid">
 ${sample('list-row-basic','기본형·설명형','제목과 안내를 읽고 다음 메뉴로 이동하는 목록',[
  renderListRow({title:'공지사항'}),renderListRow({title:'자주 묻는 질문',description:'서비스 이용 중 궁금한 내용을 확인하세요.'})])}
 ${sample('list-row-icons','아이콘형','내정보와 같은 3D 에셋을 사용합니다.',[
  renderListRow({title:'이용내역',description:'적립·사용 내역 확인',art:'receipt'}),renderListRow({title:'공지·알림',art:'bell'})])}
 ${sample('list-row-information','우측 정보형','조회 정보에는 이동 화살표와 눌림 효과가 없습니다.',[
  renderListRow({title:'총 보유 마일리지',value:'16,000 M',interactive:false}),renderListRow({title:'앱 버전',value:'1.0.0',interactive:false})])}
 ${sample('list-row-long','긴 내용','매장명과 금액이 길면 정보를 생략하지 않고 줄바꿈합니다. 검토용 예시입니다.',[
  renderListRow({title:'오지고랜드 베이커리와 커피 서울숲직영점',description:'마일리지 적립 내역',value:'+1,000 M',interactive:false})])}
 </div>
 ${stateComparison(`<p class="v2-list-note">처리 중·오류·성공은 내역을 불러오는 상황의 예시입니다. 실제 조회는 하지 않습니다.</p>
 <div class="v2-list-grid">${states.map((state,index)=>sample('list-row-state-'+state,['기본','누르는 중','비활성','처리 중','오류','성공'][index],'',[
  renderListRow({title:'이용내역',state,art:'receipt'})])).join('')}</div>`)}
 <p class="v2-list-feedback" role="status" aria-live="polite">목록을 누르면 동작 위치를 확인할 수 있습니다. 실제 화면으로 이동하지 않습니다.</p></section>`;
}
