// Hand-drawn SVG artwork: shared geometry, three explicit material treatments.
// No fonts-as-icons, animation, external image requests or duplicate SVG IDs.
const path=(d,c)=>'<path class="'+c+'" d="'+d+'"/>';
const ticket='M8 0H84Q88 0 88 4V16C78 16 78 30 88 30V42Q88 46 84 46H8Q4 46 4 42V30C14 30 14 16 4 16V4Q4 0 8 0Z';
const piece='M20 26H38C35 17 39 12 45 12S55 17 52 26H68V43C77 40 82 44 82 50S77 60 68 57V74H51C54 65 50 61 44 61S34 65 37 74H20V57C29 60 33 56 33 50S29 40 20 43Z';
const check=path('M0 6L5 11L15 0','art-check');
function calendar(style){
 const paper=style==='paper',relief=style==='relief';
 return '<g transform="'+(paper?'translate(24 20) rotate(-5 50 58)':relief?'translate(22 18)':'translate(23 16) skewY(-5)')+'">'+
 '<rect class="art-edge" x="4" y="7" width="103" height="123" rx="10"/>'+
 (paper?'<rect class="art-pale art-outline" x="-3" y="3" width="103" height="123" rx="7"/>':'')+
 '<rect class="art-white art-outline" width="103" height="123" rx="10"/>'+
 '<path class="art-blue" d="M10 0H93Q103 0 103 10V30H0V10Q0 0 10 0Z"/>'+
 '<text class="art-month" x="51.5" y="21">9월</text>'+
 '<path class="art-ring" d="M23 -5V8M80 -5V8"/>'+
 '<path class="art-seven" d="M34 49H70L46 98"/>'+
 '<path class="art-hairline" d="M16 110H87"/>'+
 (paper?'<path class="art-fold" d="M83 123V104H103Z"/>':'')+'</g>';
}
function ticketGroup(style){
 const transform=style==='paper'?'translate(91 107) rotate(8 46 23)':style==='relief'?'translate(90 102)':'translate(91 102) skewY(-5)';
 return '<g transform="'+transform+'"><g transform="translate(2 4)">'+path(ticket,'art-violet-edge')+'</g>'+path(ticket,'art-ticket art-outline')+
 '<path class="art-perforation" d="M65 6V40"/><text class="art-ticket-type" x="34" y="29">OG</text><g transform="translate(69 20) scale(.65)">'+check+'</g></g>';
}
function hero(style){
 return calendar(style)+ticketGroup(style);
}
function wheel(style){
 const segments=Array.from({length:8},(_,i)=>{
  const a=(i*45-90)*Math.PI/180,b=((i+1)*45-90)*Math.PI/180;
  return path('M50 50L'+(50+32*Math.cos(a)).toFixed(3)+' '+(50+32*Math.sin(a)).toFixed(3)+'A32 32 0 0 1 '+(50+32*Math.cos(b)).toFixed(3)+' '+(50+32*Math.sin(b)).toFixed(3)+'Z',i%2?'art-white':'art-blue');
 }).join('');
 return '<g transform="'+(style==='miniature'?'translate(0 2) skewY(-4)':style==='paper'?'rotate(-8 50 50)':'translate(0 0)')+'"><circle class="art-edge" cx="52" cy="55" r="39"/><circle class="art-white art-outline" cx="50" cy="50" r="39"/>'+segments+
 '<circle class="art-white art-outline" cx="50" cy="50" r="12"/><circle class="art-blue" cx="50" cy="50" r="4"/><path class="art-pointer" d="M44 6H56L50 23Z"/>'+
 (style==='paper'?'<path class="art-hairline" d="M50 18V38M82 50H62M50 82V62M18 50H38"/>':'')+'</g>';
}
function puzzle(style){
 if(style==='paper'){
  return '<g transform="rotate(-8 50 50)"><rect class="art-edge" x="16" y="21" width="72" height="66" rx="3"/><rect class="art-white art-outline" x="12" y="17" width="72" height="66" rx="3"/><path class="art-blue" d="M12 17H47V30C38 27 35 32 35 37S39 46 47 43V50H12Z"/><path class="art-pale" d="M12 50H27C24 59 28 63 33 63S42 59 39 50H47V83H12Z"/><path class="art-perforation" d="M47 50V83M47 50H84"/><path class="art-violet" d="M51 12H84V45H69C72 36 68 32 63 32S54 36 57 45H51V36C42 39 38 35 38 30S42 21 51 24Z"/></g>';
 }
 return '<g transform="'+(style==='miniature'?'translate(0 1) skewY(-4)':'translate(0 0)')+'"><rect class="art-edge" x="14" y="24" width="72" height="60" rx="10"/><rect class="art-white art-outline" x="10" y="19" width="72" height="60" rx="10"/><g transform="translate(-7 5) scale(.82)">'+path(piece,'art-pale')+'</g><g transform="translate(11 -2)"><g transform="translate(2 4)">'+path(piece,'art-violet-edge')+'</g>'+path(piece,'art-violet art-outline')+'</g></g>';
}
export function landIllustration(kind,style){
 if(!['miniature','relief','paper'].includes(style))throw new Error('Unknown artwork style');
 const draw={hero,wheel,puzzle}[kind];if(!draw)throw new Error('Unknown artwork kind');
 return '<svg xmlns="http://www.w3.org/2000/svg" class="og-land-illustration is-'+kind+'" data-art-style="'+style+'" viewBox="'+(kind==='hero'?'0 0 190 166':'0 0 100 100')+'" aria-hidden="true" focusable="false">'+draw(style)+'</svg>';
}

