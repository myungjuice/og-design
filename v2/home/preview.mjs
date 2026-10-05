import {setupScreenPreview} from '../components/screen-preview.mjs';
import {setupHomeSearchReview} from './search.mjs';
import {setupHomeCategoryReview} from './category.mjs';
import {setupHomeNearbyReview} from './nearby.mjs';
import {setupHomeStoreReview} from './store.mjs';
import {setupHomeMainMenuReview} from './main-menu.mjs';
import {setupHomeFullMenuReview} from './full-menu.mjs';
import {setupHomeMenuDetailReview} from './menu-detail.mjs';
import {setupHomeStoreReservationReview} from './store-reservation.mjs';
import {setupHomeStoreWaitingReview} from './store-waiting.mjs';
import {setupHomeStoreNewsReview} from './store-news.mjs';
import {setupHomeStoreEventReview} from './store-event.mjs';
import {setupHomeNewsListReview} from './news-list.mjs';
import {setupHomeNewsDetailReview} from './news-detail.mjs';
import {setupHomeEventListReview} from './event-list.mjs';
import {setupHomeEventDetailReview} from './event-detail.mjs';
import {setupHomeReviewsReview} from './reviews.mjs';
import {setupHomeInformationReview} from './information.mjs';
import {setupHomeStoreShareReview,setupHomeStorePhotoReview,setupHomeStorePraiseReview} from './store-secondary.mjs';

export function setupHomePreview(root){
 const {screen,showPreview}=setupScreenPreview(root,{onClick(event,screen){
  const category=event.target.closest('[data-category]');
  if(!category)return false;
  for(const button of screen.querySelectorAll('.home-categories [data-category]'))button.setAttribute('aria-pressed',String(button===category));
  return true;
 }});
 // Keep the original controls/assets; only v2 separates More from the scroll rail.
 const categories=screen.querySelector('.home-categories');
 const more=categories.querySelector('.home-category-more');
 const categoryRow=categories.ownerDocument.createElement('div');
 categoryRow.className='v2-home-category-row';
 categories.before(categoryRow);categoryRow.append(categories,more);
 // Reveal the whole focused chip, not just its partially visible edge.
 categories.addEventListener('focusin',event=>{
  const category=event.target.closest('[data-category]');
  if(!category)return;
  const item=category.getBoundingClientRect(),rail=categories.getBoundingClientRect();
  const offset=item.left<rail.left?item.left-rail.left:item.right>rail.right?item.right-rail.right:0;
  if(offset)categories.scrollBy({left:offset,behavior:'instant'});
 });
 screen.querySelector('.home-search-form').addEventListener('submit',event=>{
  event.preventDefault();showPreview('매장 검색');
 });
 setupHomeSearchReview(root);
 setupHomeCategoryReview(root);
 setupHomeNearbyReview(root);
 setupHomeStoreReview(root);
 setupHomeMainMenuReview(root);
 setupHomeFullMenuReview(root);
 setupHomeMenuDetailReview(root);
 setupHomeStoreReservationReview(root);
 setupHomeStoreWaitingReview(root);
 setupHomeStoreNewsReview(root);
 setupHomeStoreEventReview(root);
 setupHomeNewsListReview(root);
 setupHomeNewsDetailReview(root);
 setupHomeEventListReview(root);
 setupHomeEventDetailReview(root);
 setupHomeReviewsReview(root);
 setupHomeInformationReview(root);
 setupHomeStoreShareReview(root);
 setupHomeStorePhotoReview(root);
 setupHomeStorePraiseReview(root);
}
