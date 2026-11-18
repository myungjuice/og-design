import {escapeHTML as e} from '../../design-system/components/core.mjs';
export function participationSteps(items){
 const paths=['<rect x="3" y="6" width="26" height="20" rx="5"/><circle cx="16" cy="16" r="6"/><path d="m10 6 2-3h8l2 3"/>','<path d="M6 17v10h20V17M16 22V4m-6 6 6-6 6 6"/>','<path d="M9 4h14v9a7 7 0 0 1-14 0ZM9 7H4v5a5 5 0 0 0 6 4m13-9h5v5a5 5 0 0 1-6 4M16 20v8m-6 0h12"/>'];
 return `<ol class="og-participation-steps">${items.map(([title,description],i)=>`<li><span class="og-step-art"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[i%3]}</svg><small>${i+1}</small></span><strong>${e(title)}</strong><p>${e(description)}</p></li>`).join('')}</ol>`;
}
export function participationTerms(items){return `<details class="og-participation-terms"><summary>참여 안내<span aria-hidden="true">⌄</span></summary><ul>${items.map(text=>`<li>${e(text)}</li>`).join('')}</ul></details>`;}
export function rankMedals(){return `<div class="og-rank-medals">${['5,000','3,000','1,000'].map((amount,i)=>`<div class="og-rank-medal" data-rank="${i+1}"><span class="og-medal" aria-hidden="true"><i></i><b>${i+1}</b></span><span>${i+1}등</span><strong>${amount} M</strong></div>`).join('')}</div>`;}
