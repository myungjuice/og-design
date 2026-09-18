/* Native modal handles background inertness, Escape, and focus containment. */
window.ogAttachSheet=function(dialog){
 let opener,previousOverflow,backdropStart=false;
 const sync=()=>{const v=window.visualViewport;dialog.style.setProperty('--og-sheet-viewport-height',(v?.height??innerHeight)+'px');dialog.style.setProperty('--og-sheet-bottom',Math.max(0,innerHeight-(v?.height??innerHeight)-(v?.offsetTop??0))+'px');};
 const outside=e=>{const r=dialog.getBoundingClientRect();return e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom;};
 dialog.addEventListener('pointerdown',e=>{backdropStart=e.target===dialog&&outside(e);});
 dialog.addEventListener('click',e=>{if(backdropStart&&e.target===dialog&&outside(e))dialog.close('cancel');backdropStart=false;});
 dialog.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const items=[...dialog.querySelectorAll('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled),a[href],[tabindex="0"]')].filter(n=>n.getClientRects().length&&!(n.type==='radio'&&!n.checked));const first=items[0],last=items.at(-1),active=document.activeElement;if(!first)return;if(e.shiftKey&&(active===first||!items.includes(active))){e.preventDefault();last.focus();}else if(!e.shiftKey&&(active===last||!items.includes(active))){e.preventDefault();first.focus();}});
 dialog.querySelectorAll('[data-sheet-close]').forEach(b=>b.addEventListener('click',()=>dialog.close('cancel')));
 dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow??'';window.visualViewport?.removeEventListener('resize',sync);window.visualViewport?.removeEventListener('scroll',sync);window.removeEventListener('resize',sync);opener?.focus({preventScroll:true});});
 return {open(trigger){if(dialog.open)return;opener=trigger;previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';sync();dialog.showModal();dialog.querySelector('[data-sheet-initial]')?.focus({preventScroll:true});dialog.querySelector('.og-sheet-body').scrollTop=0;window.visualViewport?.addEventListener('resize',sync);window.visualViewport?.addEventListener('scroll',sync);window.addEventListener('resize',sync);}};
};
