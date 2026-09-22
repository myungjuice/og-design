import {calendar as renderCalendar,timePicker,rangeCalendar} from '../components/date-time/render.mjs';
{
 const board=document.createElement('section');board.id='date-time';board.className='board';
 const calendar=selected=>renderCalendar({year:2026,month:9,selected:selected?18:null,today:16,disabled:[22,23]}).replace('class="og-calendar"','class="og-calendar" data-picker-panel inert');
 const time=selected=>timePicker({selected}).replace('class="og-time-picker"','class="og-time-picker" data-picker-panel inert');
 const pair=render=>[false,true].map(selected=>'<figure class="picker-example"><figcaption>'+(selected?'선택 후':'선택 전')+'</figcaption>'+render(selected)+'</figure>').join('');
 board.innerHTML='<div class="board-heading"><span>COMPONENTS / DATE & TIME</span><h1>날짜·시간 선택</h1><p>선택한 날짜와 시간을 또렷하게 구분하고, 완료 버튼 위에서 다시 확인합니다.</p></div><section id="date-picker-specimen" class="picker-section"><div class="picker-heading"><h2>날짜 선택</h2><button data-field-prompt="date-picker-specimen">AI 프롬프트</button></div><div class="picker-examples">'+pair(calendar)+'</div><p class="picker-note">16일: 오늘 · 18일: 선택한 날짜 · 22~23일: 선택 불가 예시.<br>오늘은 블루 테두리, 선택한 날짜는 블루 원으로 표시합니다. 선택 불가 날짜는 흐린 글자와 연한 배경으로 구분합니다.</p></section><section id="time-picker-specimen" class="picker-section"><div class="picker-heading"><h2>시간 선택</h2><button data-field-prompt="time-picker-specimen">AI 프롬프트</button></div><div class="picker-examples">'+pair(time)+'</div><p class="picker-note">오전·오후 / 시 / 분을 분리합니다. 선택값은 블루 테두리와 연한 배경으로 강조하고, 아래에 한 번 더 읽기 쉽게 표시합니다.</p></section><h2>표현 기준</h2><ul class="rules-list"><li>요일과 날짜는 일요일부터 7열로 정렬합니다. 숫자는 가운데에 놓고 날짜 칸의 폭을 같게 맞춥니다.</li><li>월 이동 아이콘은 양쪽, 현재 월은 가운데에 배치합니다.</li><li>아직 선택하지 않았다면 완료 버튼을 흐리게 표시합니다. 선택 후에는 블루 버튼으로 강조합니다.</li><li>안쪽 여백 16 · 날짜 강조 원 32 · 모서리 16. 시간 값 영역은 최소 높이 48로 맞춥니다.</li></ul>';
 const rangeSection=document.createElement('section');rangeSection.id='range-picker-specimen';rangeSection.className='picker-section';
 rangeSection.innerHTML='<div class="picker-heading"><h2>기간 선택</h2></div><div class="picker-examples">'+[
 ['시작일 선택',{start:'2026-09-04'}],
 ['기간 선택 완료',{start:'2026-09-04',end:'2026-09-18'}],
 ['다른 달까지 선택 · 9월',{start:'2026-09-25',end:'2026-10-06'}],
 ['다른 달까지 선택 · 10월',{year:2026,month:10,start:'2026-09-25',end:'2026-10-06'}]
 ].map(([label,options])=>'<figure class="picker-example"><figcaption>'+label+'</figcaption>'+rangeCalendar({year:2026,month:9,...options}).replace('class="og-calendar og-range-calendar"','class="og-calendar og-range-calendar" data-picker-panel inert')+'</figure>').join('')+'</div><p class="picker-note">시작일과 종료일은 블루 원, 사이 날짜는 연한 블루 띠로 연결합니다. 월이 달라져도 선택 구간을 이어 표시합니다. 종료일까지 선택하면 기간을 적용할 수 있습니다.</p>';
 board.querySelector('#time-picker-specimen').before(rangeSection);
 document.querySelector('#world').append(board);const nav=document.createElement('button');nav.dataset.board='date-time';nav.textContent='날짜·시간 선택';document.querySelector('aside nav').append(nav);document.querySelector('#board-picker').append(new Option('날짜·시간 선택','date-time'));
}
