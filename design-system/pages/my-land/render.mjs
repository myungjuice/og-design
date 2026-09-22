import {landIllustration} from './artwork.mjs';
import {icon} from '../../components/core.mjs';
import {appBar,bottomNavigation} from '../../components/app-shell/render.mjs';
import {button} from '../../components/button/render.mjs';
import {sectionHeading} from '../../components/section-heading/render.mjs';

// Planning slide 5 (printed 04). Balances and mission progress are its specimen values.
function myLandParts(){
 const milestones=[7,14,21,30];
 const days=Array.from({length:35},(_,i)=>{const day=i+1;if(day>30)return '<span class="og-myland-day is-blank"></span>';const gift=milestones.includes(day);return '<span class="og-myland-day'+(day<7?' is-attended':'')+(day===7?' is-today':'')+'"'+(gift?' data-milestone="'+day+'"':'')+'><span>'+day+'</span>'+(gift?icon('card_giftcard'):day<7?icon('check'):'')+'</span>';}).join('');
 const missions=[['마이랜드 방문하기',true],['룰렛 2회 돌리기',true],['회원점 2곳에서 적립하기',false],['공유인 1명 초대하기',false]];
 const hero='<section class="og-myland-hero" aria-label="출석과 OG티켓"><div class="og-myland-hero-copy"><span>9월 출석 체크</span><h3>OG티켓</h3><p>6일 연속</p></div><div class="og-myland-art" aria-hidden="true"><div class="og-myland-plinth"></div><div class="og-myland-calendar-object"><i></i><i></i><span>9월</span><strong>7</strong><b>'+icon('check')+'</b></div><div class="og-myland-ticket-object">'+icon('local_activity')+'<strong>OG</strong><span>TICKET</span></div></div></section>';
 const summary='<div class="og-myland-summary"><div><span>사용 가능 M</span><strong>12,400</strong></div><div><span>티켓</span><strong>3장</strong></div><div><span>공유 적립 M</span><strong>1,250</strong><small>공유인 3명</small></div></div>';
 const attendance='<section class="og-myland-attendance">'+sectionHeading({title:'9월 출석 체크'})+'<div class="og-myland-weekdays" aria-hidden="true">'+['일','월','화','수','목','금','토'].map(d=>'<span>'+d+'</span>').join('')+'</div><div class="og-myland-calendar" aria-label="1일부터 6일까지 출석, 7일 선택. 보상일 7일, 14일, 21일, 30일">'+days+'</div>'+button({label:'오늘 출석하고 티켓 받기',className:'og-myland-checkin'})+'</section>';
 const games='<section class="og-myland-games" aria-label="미니게임"><div class="og-myland-game is-roulette"><div><h3>룰렛</h3><p>1티켓</p></div><div class="og-myland-wheel" aria-hidden="true"><span>OG</span></div>'+icon('arrow_forward')+'</div><div class="og-myland-game is-puzzle"><div><h3>퍼즐</h3><p>1티켓</p></div><div class="og-myland-puzzle" aria-hidden="true">'+icon('extension')+'</div>'+icon('arrow_forward')+'</div></section>';
 const missionsHTML='<section class="og-myland-missions">'+sectionHeading({title:'이번 주 미션'})+'<span class="og-myland-mission-count">2 / 4</span><div class="og-myland-progress" role="img" aria-label="이번 주 미션 4개 중 2개 완료"><span></span></div><ul>'+missions.map(([label,done],i)=>'<li class="og-myland-mission">'+icon(done?'check_circle':'radio_button_unchecked')+'<span'+(done?' class="is-complete"':'')+'>'+label+'</span>'+(i===2?'<strong>+3티켓</strong>':'')+'</li>').join('')+'</ul></section>';
 return {hero,summary,attendance,games,missions:missionsHTML};
}

export function myLandScreen(){
 const p=myLandParts();
 return '<article class="og-myland" inert aria-label="마이랜드 메인 디자인 시안">'+appBar({title:'마이랜드',notification:true})+'<div class="og-myland-scroll">'+p.hero+p.summary+p.attendance+p.games+p.missions+'</div>'+bottomNavigation({active:'마이랜드'})+'</article>';
}
export function myLandVariant(variant){
 if(['miniature','relief','paper'].includes(variant)){
  const p=myLandParts();
  const hero=p.hero.replace(/<div class="og-myland-art"[\s\S]*<\/section>$/, '<div class="og-myland-art">'+landIllustration('hero',variant)+'</div></section>');
  const games=p.games.replace(/<div class="og-myland-wheel"[\s\S]*?<\/div>/,landIllustration('wheel',variant)).replace(/<div class="og-myland-puzzle"[\s\S]*?<\/div>/,landIllustration('puzzle',variant));
  return '<article class="og-myland og-myland-variant og-myland-art-candidate" data-variant="'+variant+'" data-art-style="'+variant+'" inert aria-label="마이랜드 그래픽 비교 시안"><div class="og-myland-blue-header">'+appBar({title:'마이랜드',notification:true})+hero+'</div><div class="og-myland-scroll">'+p.summary+p.attendance+games+p.missions+'</div>'+bottomNavigation({active:'마이랜드'})+'</article>';
 }
 if(variant==='blue-header'){
  const p=myLandParts();
  return '<article class="og-myland og-myland-variant" data-variant="blue-header" inert aria-label="마이랜드 상단 블루 비교 시안"><div class="og-myland-blue-header">'+appBar({title:'마이랜드',notification:true})+p.hero+'</div><div class="og-myland-scroll">'+p.summary+p.attendance+p.games+p.missions+'</div>'+bottomNavigation({active:'마이랜드'})+'</article>';
 }
 if(!['plaza','attendance','lounge'].includes(variant))return myLandScreen();
 const p=myLandParts();
 const scenery='<div class="og-myland-scenery" aria-hidden="true"><div class="og-myland-arch"><span>OG</span></div><div class="og-myland-tree is-left"></div><div class="og-myland-tree is-right"></div><div class="og-myland-path"></div></div>';
 const hero=variant==='plaza'?'<div class="og-myland-plaza-stage">'+scenery+p.hero+'</div>':p.hero;
 const content=variant==='attendance'?hero+p.attendance+p.summary+p.games+p.missions:variant==='lounge'?hero+p.games+p.summary+p.attendance+p.missions:hero+p.summary+p.attendance+p.games+p.missions;
 return '<article class="og-myland og-myland-variant" data-variant="'+variant+'" inert aria-label="마이랜드 메인 비교 시안">'+appBar({title:'마이랜드',notification:true})+'<div class="og-myland-scroll">'+content+'</div>'+bottomNavigation({active:'마이랜드'})+'</article>';
}
