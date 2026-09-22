// One-time review enrollment for this visual revision; preserve later user decisions.
export const surfaceRolloutIds=['home-search','home-category','home-nearby','home-main-menu','home-store-reservation','home-store-waiting','home-store-news','home-store-event','home-store-reviews','home-store-info','home-store-location','home-news-detail','home-event-detail'];
export const surfaceRolloutKey='og-design:surface-rollout:v1';
export function enrollSurfaceRollout(states,alreadyEnrolled){
 if(alreadyEnrolled)return states;
 return {...states,...Object.fromEntries(surfaceRolloutIds.map(id=>['board-'+id,'pending']))};
}
