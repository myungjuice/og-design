import {escapeHTML as e,attributes as attrs} from '../core.mjs';
export const badge=({label='',tone='neutral',size='small'}={})=>'<span class="og-badge" data-tone="'+e(tone)+'" data-size="'+e(size)+'">'+e(label)+'</span>';
export function countBadge({count=0,id}={}) {
 if(!Number.isInteger(count)||count<0)throw new RangeError('Invalid count');
 return '<span class="og-count-badge" role="img"'+attrs({id,hidden:count===0,'aria-label':'읽지 않은 알림 '+count+'개'})+'><span class="og-count-value" aria-hidden="true">'+(count>99?'99+':count)+'</span></span>';
}
export const unreadDot=({visible=true,id,label='읽지 않은 공지 있음'}={})=>'<span class="og-unread-dot" role="img"'+attrs({id,hidden:!visible,'aria-label':label})+'></span>';
