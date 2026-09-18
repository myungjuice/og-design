import {escapeHTML as e,icon,attributes as attrs} from '../core.mjs';
export const loading=({label='불러오는 중',size}={})=>'<span class="og-loading" role="status"><i class="og-spinner"'+attrs({'data-size':size})+' aria-hidden="true"></i>'+e(label)+'</span>';
export const skeletonRow=({shape='square'}={})=>'<div data-skeleton aria-hidden="true" class="og-loading-row"><span class="og-skeleton" data-shape="'+e(shape)+'"></span><div class="og-loading-copy"><span class="og-skeleton" data-shape="title"></span><span class="og-skeleton" data-shape="text"></span></div></div>';
export function loadingRow({title='',subtitle='',shape='square',symbol='storefront',busy=true,className=''}={}) {
 return '<div class="og-loading-frame '+e(className)+'" aria-busy="'+busy+'" aria-label="'+e(title)+'"><div data-content aria-hidden="'+busy+'" class="og-loading-row"><span class="og-loading-symbol" data-shape="'+e(shape)+'" aria-hidden="true">'+icon(symbol)+'</span><div class="og-loading-copy"><strong>'+e(title)+'</strong><small>'+e(subtitle)+'</small></div></div>'+skeletonRow({shape}).replace('data-skeleton',busy?'data-skeleton':'data-skeleton hidden')+'</div>';
}

export function loadingCard({label='',title='',amount='',caption='',busy=true,className=''}={}) {
 return '<div class="og-loading-frame '+e(className)+'" aria-busy="'+busy+'" aria-label="'+e(label)+'"><div data-content aria-hidden="'+busy+'" class="og-loading-card-body"><small>'+e(title)+'</small><strong>'+e(amount)+'</strong><small>'+e(caption)+'</small></div><div data-skeleton '+(busy?'':'hidden')+' aria-hidden="true" class="og-loading-card-body"><span class="og-skeleton" data-shape="text"></span><span class="og-skeleton" data-shape="amount"></span><span class="og-skeleton" data-shape="text"></span></div></div>';
}
