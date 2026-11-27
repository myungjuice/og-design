// 작은 게임 말은 SVG 벡터로 그린 목업용 과일 심볼이다. 최종 게임 에셋은 별도 검토한다.
export function fruit(type,index=0){
 const gradient=`fruit-${type}-${index}`;
 const shapes={
  apple:'<path class="fruit-body" d="M26 22C7 11 6 35 16 46c5 6 9 1 12 1s7 5 12-1c10-12 9-35-10-24Z"/><path class="fruit-leaf" d="M28 21q-1-13 12-12-1 11-12 12Z"/>',
  orange:'<circle class="fruit-body" cx="28" cy="33" r="18"/><path class="fruit-leaf" d="M28 15q3-13 16-7-4 10-16 7Z"/>',
  grape:'<g class="fruit-body"><circle cx="20" cy="23" r="9"/><circle cx="36" cy="23" r="9"/><circle cx="28" cy="35" r="9"/><circle cx="28" cy="46" r="7"/></g><path class="fruit-leaf" d="M28 15q2-12 14-9-2 9-14 9Z"/>',
  pear:'<path class="fruit-body" d="M21 17c0-10 14-10 14 0s14 16 11 26S12 55 10 43 21 27 21 17Z"/><path class="fruit-leaf" d="M28 11q3-9 13-6-4 9-13 6Z"/>'
 };
 return `<svg class="md-fruit ${type}" viewBox="0 0 56 56" role="img" aria-label="${{apple:'사과',orange:'오렌지',grape:'포도',pear:'배'}[type]}"><defs><radialGradient id="${gradient}" cx="30%" cy="23%" r="80%"><stop class="fruit-light" offset="0"/><stop class="fruit-mid" offset=".45"/><stop class="fruit-dark" offset="1"/></radialGradient><linearGradient id="${gradient}-leaf" x2=".8" y2="1"><stop class="leaf-light"/><stop class="leaf-dark" offset="1"/></linearGradient></defs><g fill="url(#${gradient})">${shapes[type].replace('class="fruit-leaf"',`class="fruit-leaf" fill="url(#${gradient}-leaf)"`)}</g><path class="fruit-shine" d="M17 29q-3 4-1 8"/></svg>`;
}
