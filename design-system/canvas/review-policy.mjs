// Frozen baseline: work already present when automatic review enrollment was requested.
// Do not add new IDs here. Future boards and completed page placeholders enroll automatically.
const earlierWork=new Set([
 'color','type','space','depth','system','icons','layout','motion','layers',
 'buttons','inputs','selection','tabs-chips','search','badges','avatar','surfaces',
 'list-row','section-heading','progress','loading','feedback','help','quantity',
 'sheet','dialogs','snackbar','date-time','attachments',
 'my-info-main','my-info-mileage','my-info-history','my-info-reservation-detail',
 'my-info-reservation-change','my-info-waiting-detail',
 'mileage-option-a','mileage-option-b','mileage-option-c'
]);
export function reviewState({id,ready=true,initial=false,saved}={}){
 if(saved==='pending'||saved==='done')return saved;
 if(initial||(ready&&!earlierWork.has(id)))return 'pending';
 return undefined;
}
