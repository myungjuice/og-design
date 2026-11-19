import {functionArtwork} from '../function-artwork.mjs';
import {escapeHTML as e} from '../../design-system/components/core.mjs';
const holidayStatuses=new Set(['tempHoliday','regularHoliday','holiday']);
const closedStatuses=new Set([...holidayStatuses,'close','notOpen','openPreparing','breakTime']);
// Source: shop_contents.dart _closedInfo/buildShopImages. These are supplied
// RuntimeValidater specimens, never a fresh calculation of current shop hours.
export function heroStatus(status,description){
 if(!status||status.isOpen!==false||!closedStatuses.has(status.runtimeStatus))return '';
 const holiday=holidayStatuses.has(status.runtimeStatus),label=status.label||'영업 종료';
 const kind=({tempHoliday:'temporary-holiday',regularHoliday:'regular-holiday',holiday:'regular-holiday',close:'closed'})[status.runtimeStatus]||'hours';
 const glyph=functionArtwork(kind,24);
 return `<div class="v2-store-hero-status" data-hero-status="${e(status.runtimeStatus)}">${glyph}<strong>${e(label)}</strong><span>${e(description??(holiday?'오늘은 쉬어가요':'지금은 영업 시간이 아니에요'))}</span></div>`;
}
