import {escapeHTML as e,attributes as attrs,icon} from '../core.mjs';
const store='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10q2 4 4 0 2 4 5 0 3 4 5 0 2 4 4 0M9 20v-6h6v6"/></svg>';
export const avatar=({size='medium',label='기본 프로필'}={})=>'<span class="og-avatar" data-size="'+e(size)+'" role="img" aria-label="'+e(label)+'">'+icon('face')+'</span>';
export const thumbnail=({src='',alt='',state='ready',attributes={}}={})=>'<div class="og-thumbnail" data-state="'+e(state)+'"'+attrs(attributes)+'><img src="'+e(src)+'" alt="'+e(alt)+'"><span class="og-media-fallback">'+store+'<span>이미지 없음</span></span></div>';
