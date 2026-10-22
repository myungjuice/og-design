// Passive, code-native overlays. Delivered pin PNGs are never redrawn.
const shapes={
 crown:`<path class="lm-gold" d="M4 7 10 12 16 3 22 12 28 7 25 21H7Z"/><path class="lm-shade" d="m7 17 18-1v5H7Z"/><path class="lm-light" d="m6 9 4 5 6-9-4 11H8Z"/><path class="lm-glint" d="M8 18h16"/><circle class="lm-jewel" cx="16" cy="17" r="1.6"/><circle class="lm-gold" cx="4" cy="6" r="1.5"/><circle class="lm-gold" cx="16" cy="2.5" r="1.5"/><circle class="lm-gold" cx="28" cy="6" r="1.5"/>`,
 medal:`<path class="lm-ribbon" d="m10 12-2 11 6-3 2 3 1-11Zm7 0-1 11 4-3 4 3-2-11Z"/><path class="lm-gold" d="m16 1 3 2 4 1 1 4 2 3-2 3-1 4-4 1-3 2-3-2-4-1-1-4-2-3 2-3 1-4 4-1Z"/><circle class="lm-shade" cx="16" cy="11" r="6.5"/><circle class="lm-jewel" cx="16" cy="10.5" r="5.5"/><path class="lm-light" d="m16 6 1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4Z"/>`,
 laurel:`<path class="lm-branch" d="M14 22Q1 15 7 3M18 22Q31 15 25 3"/><path class="lm-gold" d="M8 7Q1 6 4 1q6 1 4 6Zm-2 6Q0 12 1 7q6 0 5 6Zm2 5Q1 19 1 14q6-2 7 4Zm5 4q-6 4-8 0 4-5 8 0ZM24 7q7-1 4-6-6 1-4 6Zm2 6q6-1 5-6-6 0-5 6Zm-2 5q7 1 7-4-6-2-7 4Zm-5 4q6 4 8 0-4-5-8 0Z"/><path class="lm-light" d="M9 6q1-5 5-4 1 5-5 4Zm14 0q-1-5-5-4-1 5 5 4Z"/>`,
 castle:`<path class="lm-gold" d="M3 8V3h4v3h3V3h4v7h4V3h4v3h3V3h4v19H3Z"/><path class="lm-shade" d="M3 18h26v4H3Zm7-8h3v12h-3Zm12-2h3v14h-3Z"/><path class="lm-light" d="M4 8h3v10H4Zm11 2h3v8h-3Zm11-2h2v10h-2Z"/><path class="lm-jewel" d="M13 22v-5a3 3 0 0 1 6 0v5ZM6 10h2v3H6Zm18 0h2v3h-2Z"/>`
};
export function renderLandmarkPart(style='crown'){
 const shape=shapes[style];if(!shape)return '';
 return `<span class="home-landmark-part home-landmark-${style}" data-home-landmark="${style}" aria-hidden="true"><svg viewBox="0 0 32 24" focusable="false">${shape}</svg></span>`;
}
