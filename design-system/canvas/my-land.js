import {myLandScreen,myLandVariant} from '../pages/my-land/render.mjs?v=20260920-art-options';
import {focusBoard} from './canvas.js?v=20260919-partitions';
const world=document.querySelector('#world');
export const myLandRegion=document.createElement('section');
myLandRegion.className='system-region';myLandRegion.id='my-land-region';
myLandRegion.innerHTML='<header class="system-area-heading"><h2>마이랜드</h2></header>';world.append(myLandRegion);
const page=document.createElement('section');page.id='my-land-main';page.className='screen-page';page.dataset.family='my-land';
page.innerHTML='<header class="screen-page-heading"><div><span>LAND-01 · 메인 시안</span><h2>마이랜드</h2></div></header><div class="screen-page-content"><div class="screen-artboard">'+myLandScreen()+'</div><div class="screen-design-notes"><h3>출석에서 시작하는 마이랜드</h3><p>입체 달력과 OG티켓을 상단에 배치했습니다. 넓은 배경은 밝게 유지하고, 물체의 두께와 그림자로 입체감을 표현했습니다.</p><h3>출석에 시선 집중</h3><p>요약은 세 칸으로 간결하게, 달력은 넓게 배치했습니다. 출석 버튼은 선명한 블루로 강조합니다.</p><h3>게임과 미션 구분</h3><p>룰렛·퍼즐은 그림이 있는 진입 영역, 미션은 가볍게 읽히는 목록으로 구분했습니다.</p></div></div>';
world.append(page);export const myLandPages=[page];
const variants=[
 ['plaza','B · 작은 광장형','상단의 작은 입체 공간','달력·티켓과 아치를 하나의 작은 광장처럼 배치했습니다. 출석과 게임에 들어오기 전, 마이랜드의 공간감을 먼저 보여줍니다.'],
 ['attendance','C · 출석 집중형','오늘의 출석부터','출석 버튼을 달력 위로 옮기고 월간 달력을 첫 화면의 중심으로 삼았습니다. 잔액과 게임은 아래로 이어집니다.'],
 ['lounge','D · 게임 라운지형','룰렛·퍼즐을 먼저','티켓을 상단의 대표 오브젝트로 쓰고 게임 진입 영역을 크게 배치했습니다. 요약·출석·미션은 아래에서 차례로 확인합니다.']
,
 ['blue-header','5번 · 상단 블루형','1번 구성에 상단 블루','1번의 구성·크기·순서를 유지하고 제목과 입체 달력 영역만 내 정보와 같은 푸른 배경으로 묶었습니다. 아래는 기존의 밝은 회청색 바탕입니다.'],
 ['miniature','6번 · 정교한 미니어처','얇은 두께, 같은 시점','달력과 절취형 티켓, 바늘이 있는 룰렛, 맞물리는 퍼즐을 같은 얇은 두께와 조명으로 맞췄습니다.'],
 ['relief','7번 · 낮은 양각형','정면으로 정돈한 입체감','기울임을 없애고 얕은 가장자리로만 깊이를 표현했습니다. 블루 중심의 단정한 그래픽 세트입니다.'],
 ['paper','8번 · 종이 조형형','접고 겹친 종이 형태','달력의 접힌 모서리, 티켓의 절취선, 겹쳐진 퍼즐 조각으로 종이 재질을 표현했습니다.']
];
for(const [variant,title,heading,description] of variants){
 const comparison=document.createElement('section');comparison.id='my-land-'+variant;comparison.className='screen-page';comparison.dataset.family='my-land';
 comparison.innerHTML='<header class="screen-page-heading"><div><span>마이랜드 · 비교 시안</span><h2>'+title+'</h2></div></header><div class="screen-page-content"><div class="screen-artboard">'+myLandVariant(variant)+'</div><div class="screen-design-notes"><h3>'+heading+'</h3><p>'+description+'</p><h3>비교 포인트</h3><p>같은 잔액·티켓·출석·게임·미션으로 구성했습니다. 첫 시선이 향하는 곳과 입체감의 강도를 비교해주세요.</p></div></div>';
 world.append(comparison);myLandPages.push(comparison);
}
const nav=document.createElement('nav');nav.className='screen-nav';nav.setAttribute('aria-label','마이랜드 페이지 이동');nav.innerHTML=myLandPages.map((p,i)=>'<button type="button" data-target="'+p.id+'">'+(i===0?'A · 기존 메인':variants[i-1][1])+'</button>').join('');nav.querySelectorAll('button').forEach(b=>b.onclick=()=>focusBoard(b.dataset.target));document.querySelector('aside').append(nav);
const group=document.createElement('optgroup');group.label='마이랜드';group.innerHTML=myLandPages.map((p,i)=>'<option value="'+p.id+'">'+(i===0?'A · 기존 메인':variants[i-1][1])+'</option>').join('');document.querySelector('#board-picker').append(group);
