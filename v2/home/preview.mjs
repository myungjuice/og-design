import {setupScreenPreview} from '../components/screen-preview.mjs';

export function setupHomePreview(root){
 const {screen,showPreview}=setupScreenPreview(root,{onClick(event,screen){
  const category=event.target.closest('[data-category]');
  if(!category)return false;
  for(const button of screen.querySelectorAll('.home-categories [data-category]'))button.setAttribute('aria-pressed',String(button===category));
  return true;
 }});
 screen.querySelector('.home-search-form').addEventListener('submit',event=>{
  event.preventDefault();showPreview('매장 검색');
 });
}
