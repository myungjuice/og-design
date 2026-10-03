import {surface} from '../../design-system/components/surfaces/render.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';
const number=value=>new Intl.NumberFormat('ko-KR').format(value);
// One render path and one CSS class: My Info and Barcode never fork card appearance.
export function renderMileageCard({available=15000,total=16000,shared=1250,sharedCount=3,assetBase='./media/figma/',className='',rangeMin=total>=10000?10000:0,rangeMax=20000}={}){
 const min=rangeMin,max=rangeMax;
 if(!Number.isFinite(min)||!Number.isFinite(max)||min<0||max<=min)throw new RangeError('마일리지 표시 범위를 확인하세요.');
 const figmaIcon=(name,width,height=width)=>'<img src="'+e(assetBase+name+'.svg')+'" width="'+width+'" height="'+height+'" alt="" decoding="async">';
 const position=value=>Math.max(0,Math.min(100,(value-min)/(max-min)*100));
 const balance=surface({className:'mileage-card'+(className?' '+className:''),attributes:{'aria-label':'OG 마일리지'},contentHTML:
  '<div class="mileage-top"><img class="m-coin" src="'+e(assetBase+'mileage-m.png')+'" width="48" height="48" alt="" decoding="async"><div class="mileage-title"><div><span>사용 가능한 OG 마일리지</span><button type="button" class="mileage-info" data-preview="마일리지 안내" aria-label="마일리지 안내">'+figmaIcon('mileage-info',10)+'</button></div><strong>'+number(available)+' M</strong></div><button type="button" class="mileage-history" data-preview="마일리지 내역">내역보기 '+figmaIcon('mileage-chevron',14)+'</button></div>'+
  '<div class="mileage-graph" role="meter" aria-label="총 보유 마일리지" aria-valuemin="'+min+'" aria-valuemax="'+max+'" aria-valuenow="'+Math.max(min,Math.min(total,max))+'" aria-valuetext="'+number(total)+' M"><span class="graph-held" style="--progress:'+position(total)+'%;--cap:'+(total>min?3:0)+'px"></span><span class="graph-available" style="--progress:'+position(available)+'%;--cap:'+(available>min?9:0)+'px;--fill-min:'+(available>min?20:0)+'px"></span><span class="graph-marker" style="--progress:'+position(available)+'%"'+(available<=min?' hidden':'')+'>'+figmaIcon('mileage-marker',20)+'</span></div><div class="graph-labels" aria-hidden="true"><span>'+number(min)+'M</span><span>'+number((min+max)/2)+'M</span><span>'+number(max)+'M</span></div>'+
  '<div class="mileage-breakdown"><span class="mileage-divider" aria-hidden="true">'+figmaIcon('mileage-divider',310,1)+'</span><dl class="mileage-rows"><div><dt>총 보유 마일리지</dt><dd>'+number(total)+' M</dd></div><div><dt>공유 적립</dt><dd><span>공유인 '+number(sharedCount)+'</span> |'+number(shared)+' M</dd></div></dl></div>'});
 return balance;
}
