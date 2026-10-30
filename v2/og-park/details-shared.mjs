import {escapeHTML as e} from '../../design-system/components/core.mjs';
import {button} from '../../design-system/components/button/render.mjs';
import {renderBadge} from '../components/badges.mjs';
import {renderFigmaNavigation} from '../components/figma-navigation.mjs';
export {e};
export const parkArt='/assets/figma-ogpark-20261028/';
export const image=(src,alt='',cls='')=>`<img class="${e(cls)}" src="${e(src)}" alt="${e(alt)}" draggable="false">`;
export const art=(file,cls='')=>image(parkArt+file,'',cls);
export const badge=(label,tone='brand')=>renderBadge({label,tone});
export const action=(label,{disabled=false,secondary=false,submit=false}={})=>button({label,disabled,variant:secondary?'secondary':'primary',className:'v2-button pd-action',attributes:{inert:true,...(submit?{'data-action':'submit'}:{})}});
export const tabs=(items,selected)=>`<div class="pd-tabs" aria-label="목록 분류">${items.map(label=>`<button type="button" inert aria-pressed="${label===selected}">${e(label)}</button>`).join('')}</div>`;
export const pills=(items,selected)=>`<div class="pd-pills">${items.map(label=>`<button type="button" inert aria-pressed="${label===selected}">${e(label)}</button>`).join('')}</div>`;
export function scene({title,body,footer='',navigation=false,className=''}){
 return `<article class="pd-screen ${e(className)}${navigation?' pd-with-nav':''}" aria-label="${e(title)} 시안"><header class="pd-header"><button type="button" inert class="pd-back" aria-label="뒤로가기">‹</button><h2>${e(title)}</h2><span class="pd-header-spacer"></span></header><main class="pd-body">${body}</main>${footer?`<footer class="pd-footer">${footer}</footer>`:''}${navigation?renderFigmaNavigation({active:'오지파크'}).replace('<nav ','<nav inert '):''}</article>`;
}
export const hero=(eyebrow,title,description,file='b5b7b.png',cls='')=>`<section class="pd-hero ${e(cls)}"><div>${badge(eyebrow)}<h1>${title}</h1><p>${description}</p></div>${art(file,'pd-hero-art')}</section>`;
export function reward(label,value){return `<div class="pd-reward"><span>${e(label)}</span><strong>${e(value)}</strong></div>`;}
export const sectionTitle=(title,trailing='')=>`<div class="pd-section-title"><h3>${e(title)}</h3>${trailing?`<span>${e(trailing)}</span>`:''}</div>`;
export function steps(items){return `<ol class="pd-steps">${items.map(([title,description],i)=>`<li><span>${i+1}</span><div><strong>${e(title)}</strong><p>${e(description)}</p></div></li>`).join('')}</ol>`;}
export function terms(items){return `<section class="pd-terms"><h3>참여 안내</h3><ul>${items.map(text=>`<li>${e(text)}</li>`).join('')}</ul></section>`;}
export const empty=(title,text)=>`<section class="pd-empty">${art('ac0f4.png','pd-empty-art')}<h3>${e(title)}</h3><p>${e(text)}</p></section>`;
export const reviewTimestamp='2026-10-30T15:15:00+09:00';
export const detailStyles=['/v2/tokens.css','/v2/components/button.css','/v2/components/badges.css','/v2/components/figma-navigation.css','/v2/og-park/details.css'];
export function specimen(key,label,html){
 return `<figure class="pd-review-figure"><figcaption>${e(label)}</figcaption><div class="pd-review-host" data-park-detail-screen="${e(key)}"><template>${detailStyles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')}${html}</template></div></figure>`;
}
export function reviewSection(id,title,description,samples){
 return `<section id="${e(id)}" data-review-screen data-review-status="pending" data-review-since="${reviewTimestamp}" hidden><h2>${e(title)}</h2><p class="pd-review-description"><span class="pd-review-status">사용자 검토 대기</span> ${e(description)}</p><div class="pd-review-grid">${samples.map(([key,label,html])=>specimen(key,label,html)).join('')}</div></section>`;
}
