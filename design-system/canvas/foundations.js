import {colorSpecs,typeSpecs,paletteSpecs} from '../foundations/foundation-specs.js';
const styles=getComputedStyle(document.documentElement);
const value=t=>styles.getPropertyValue(t).trim();
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
// Canvas resolves CSS colors to actual sRGB values, including aliases and OKLCH.
const context=document.createElement('canvas').getContext('2d',{willReadFrequently:true});
function rgb(token){context.clearRect(0,0,1,1);context.fillStyle=value(token);context.fillRect(0,0,1,1);return [...context.getImageData(0,0,1,1).data].slice(0,3);}
function luminance(c){return c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);}
function contrast(a,b){const l=[luminance(a),luminance(b)].sort((a,b)=>b-a);return (l[0]+.05)/(l[1]+.05);}
function hex(c){return '#'+c.map(n=>n.toString(16).padStart(2,'0')).join('');}
for(const spec of colorSpecs){
 const row=el('article','semantic-row');row.dataset.contrastRow='';
 const pair=el('div','pair-specimen',spec.sample);pair.style.color='var('+spec.fg+')';pair.style.background='var('+spec.bg+')';
 if(spec.minimum===3){pair.style.color='var(--app-text-primary)';pair.style.border='2px solid var('+spec.fg+')';}
 const copy=el('div','pair-copy');copy.append(el('h3','',spec.name),el('p','',spec.use));
 const foreground=rgb(spec.fg),background=rgb(spec.bg),ratio=contrast(foreground,background),minimum=spec.minimum||4.5;
 row.dataset.ratio=ratio;row.dataset.minimum=minimum;
 copy.append(el('code','',spec.fg+' '+hex(foreground)),el('code','',spec.bg+' '+hex(background)));
 row.append(pair,copy);document.querySelector('#semantic-pairs').append(row);
}
for(const spec of typeSpecs){
 const row=el('article','type-spec');row.dataset.typeSpec='';
 const heading=el('div','type-meta');heading.append(el('h3','',spec.name),el('span','',parseFloat(value(spec.size))*16+' / '+parseFloat(value(spec.line))*16+' · '+value(spec.weight)));
 const sample=el('div','type-preview',spec.sample);
 sample.style.fontSize='var('+spec.size+')';sample.style.lineHeight='var('+spec.line+')';sample.style.fontWeight='var('+spec.weight+')';sample.style.letterSpacing='var('+spec.tracking+')';
 if(spec.name==='핵심 금액')sample.classList.add('number-gradient');

 row.append(heading,sample,el('p','',spec.use),el('p','rule',spec.rule),el('code','',spec.size+' · '+spec.line),el('code','',spec.weight+' · '+spec.tracking));
 document.querySelector('#type-specs').append(row);
}
const scaleButtons=document.querySelectorAll('[data-text-scale]');
for(const button of scaleButtons)button.addEventListener('click',()=>{
 const scale=Number(button.dataset.textScale);
 const sample=document.querySelector('.reading-sample');sample.style.setProperty('--sample-scale',scale);sample.dataset.enlarged=String(scale>1);
 for(const b of scaleButtons)b.setAttribute('aria-pressed',String(b===button));
 document.querySelector('#text-scale-status').textContent='글자 '+Math.round(scale*100)+'% · 콘텐츠 폭 320px 유지';
});

for(const ramp of paletteSpecs){
 const section=el('section','palette-family');section.dataset.palette=ramp.id;
 const heading=el('div','palette-heading');heading.append(el('h3','',ramp.name),el('p','',ramp.description));
 const grid=el('div','palette-grid');
 for(let i=1;i<=9;i++){
  const name=ramp.id+String(i).padStart(2,'0'),token='--'+name;
  const swatch=el('div','palette-swatch');swatch.dataset.paletteSwatch=name;
  const face=el('div','palette-face');face.style.background='var('+token+')';face.setAttribute('aria-label',name+' '+value(token));
  swatch.append(face,el('strong','',name),el('code','',value(token).toUpperCase()),el('small','',ramp.uses[i-1]));grid.append(swatch);
 }
 section.append(heading,grid);document.querySelector('#palette-scales').append(section);
}

const gradients=[
 ['--app-gradient-brand','Brand / 브랜드','바코드 강조 · 마일리지 게이지'],
 ['--app-gradient-number','Amount / 금액','흰 카드 위 사용 가능 금액'],
 ['--app-gradient-header','Background / 배경','프로필 상단의 밝은 블루 배경'],
 ['--app-gradient-menu','Surface / 표면','메뉴 타일의 밝은 윗면과 미세한 깊이']
];
for(const [token,name,use] of gradients){
 const css=value(token);
 // Split top-level commas only; color functions contain nested parentheses.
 const parts=[];let depth=0,start=0;
 const inner=css.slice(css.indexOf('(')+1,-1);
 for(let i=0;i<inner.length;i++){
  if(inner[i]==='(')depth++;if(inner[i]===')')depth--;
  if(inner[i]===','&&depth===0){parts.push(inner.slice(start,i).trim());start=i+1;}
 }
 parts.push(inner.slice(start).trim());
 const direction=parts.shift();
 const card=el('article','gradient-spec');card.dataset.gradient=token;
 const head=el('div','gradient-spec-head');head.append(el('h3','',name),el('span','',direction.replace('deg','°').replace(' in srgb',' · sRGB')));
 const preview=el('div','gradient-preview');preview.style.background='var('+token+')';preview.setAttribute('aria-label',name+' 미리보기');
 const stops=el('ul','gradient-stops');
 parts.forEach((part,i)=>{
  const match=part.match(/^(.*)\s+([\d.]+)%$/);
  const color=match?match[1]:part;
  const position=match?Number(match[2]):(i===0?0:100);
  context.clearRect(0,0,1,1);context.fillStyle=color;context.fillRect(0,0,1,1);
  const resolved=hex([...context.getImageData(0,0,1,1).data].slice(0,3)).toUpperCase();
  const stop=el('li','');const dot=el('i','');dot.style.background=color;
  stop.append(dot,el('code','',resolved),el('span','',(i===0&&position>0?'0–':'')+position+'%'));stops.append(stop);
 });
 const code=el('pre','');code.append(el('code','','background: '+css+';'));
 const note=el('code','',token);
 card.append(head,preview,el('p','gradient-use',use),stops,note,code);
 document.querySelector('#gradient-specs').append(card);
}
