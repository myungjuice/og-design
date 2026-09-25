import {escapeHTML as e,attributes as attrs} from '../core.mjs';
export function progress({value=0,label='진행률',id,labelId,loading=false,tone='default'}={}) {
 if(!Number.isFinite(value)||value<0||value>100)throw new RangeError('Progress must be 0–100');
 return '<div class="og-progress-caption"><span>'+e(label)+'</span><strong'+attrs({id:labelId})+'>'+ (loading?'—':value+'%')+'</strong></div><div class="og-progress-track" role="progressbar"'+attrs({id,'aria-label':label,'aria-valuemin':0,'aria-valuemax':100,'aria-valuenow':loading?undefined:value,'aria-busy':loading?'true':undefined})+'><span class="og-progress-fill" data-tone="'+e(tone)+'" style="--progress-value:'+(loading?0:value)+'%"></span></div>';
}

export function mileage({available=0,total=0,max=5000,shared='—',loading=false,density='default',ids={}}={}) {
 if(![available,total,max].every(Number.isFinite)||available<0||available>total||total>max||max<=0)throw new RangeError('Invalid mileage range');
 const amount=n=>loading?'—':n.toLocaleString('en-US')+' M';
 if(density==='payment'){
  const remainder=total%5000,remaining=5000-remainder;
  return '<dl class="og-mileage-payment og-mileage-values"><div><dt>보유 마일리지</dt><dd>'+amount(total)+'</dd></div><div><dt>사용 가능</dt><dd class="og-mileage-available">'+amount(available)+'</dd></div></dl><div class="og-mileage-milestone">'+progress({value:remainder/5000*100,label:'다음 5,000 M까지',loading,tone:'brand'})+'<p>'+(loading?'잔액을 확인하고 있습니다.':amount(remaining)+' 더 모으면 5,000 M 더 사용할 수 있어요.')+'</p></div>';
 }
 return '<dl class="og-mileage-summary og-mileage-values"'+attrs({'data-density':density})+'><div><dt><span class="og-progress-dot" data-tone="brand" aria-hidden="true"></span>사용 가능</dt><dd class="og-mileage-available"'+attrs({id:ids.available})+'>'+amount(available)+'</dd></div><div><dt>보유 마일리지</dt><dd'+attrs({id:ids.total})+'>'+amount(total)+'</dd></div><div><dt>공유 적립</dt><dd>'+e(shared)+'</dd></div></dl><div class="og-progress-track" role="img"'+attrs({id:ids.track,'aria-label':'사용 가능 '+amount(available)+', 추가 보유 '+amount(total-available)+', 보유 마일리지 '+amount(total)+'. 표시 범위 0에서 '+amount(max)+'.','aria-busy':String(loading)})+'><span class="og-progress-fill" data-tone="brand" style="--progress-value:'+(loading?0:available/max*100)+'%"></span><span class="og-progress-held" style="--progress-held:'+(loading?0:(total-available)/max*100)+'%"></span></div><div class="og-progress-caption"><span>0 M</span><strong'+attrs({id:ids.end})+'>'+amount(max)+'</strong></div>';
}
