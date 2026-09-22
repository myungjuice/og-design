import {escapeHTML as e} from '../core.mjs';
import {button} from '../button/render.mjs';
const footer=selected=>'<div class="og-picker-footer">'+button({label:'취소',variant:'secondary'})+button({label:'선택 완료',disabled:!selected})+'</div>';
export function calendar({year,month,selected=null,today=null,disabled=[],range=null,showSummary=true,showActions=true,previousDisabled=false,reserved=null}={}) {
 if(!Number.isInteger(year)||!Number.isInteger(month)||month<1||month>12)throw new RangeError('Invalid calendar month');
 const days=new Date(Date.UTC(year,month,0)).getUTCDate(),offset=new Date(Date.UTC(year,month-1,1)).getUTCDay();
 if(selected!==null&&(!Number.isInteger(selected)||selected<1||selected>days))throw new RangeError('Invalid selected day');
 return '<div class="og-calendar"><div class="og-calendar-header"><button class="og-calendar-nav" type="button" aria-label="이전 달"'+(previousDisabled?' disabled':'')+'>‹</button><strong>'+year+'년 '+month+'월</strong><button class="og-calendar-nav" type="button" aria-label="다음 달">›</button></div><div class="og-calendar-week">'+['일','월','화','수','목','금','토'].map(d=>'<span>'+d+'</span>').join('')+'</div><div class="og-calendar-grid">'+Array.from({length:offset},()=>'<span class="og-calendar-blank"></span>').join('')+Array.from({length:days},(_,i)=>{const d=i+1,date=year+'-'+String(month).padStart(2,'0')+'-'+String(d).padStart(2,'0'),inside=range?.start&&range?.end&&date>=range.start&&date<=range.end,endpoint=range&&(date===range.start||date===range.end);return '<button type="button" class="og-calendar-day"'+(range?' data-range-day="true"'+(inside?' data-in-range="true"':'')+(date===range.start?' data-range-start="true"':'')+(date===range.end?' data-range-end="true"':''):'')+' '+(d===reserved?'data-reserved="true"':'')+' aria-label="'+month+'월 '+d+'일" aria-selected="'+(range?!!endpoint:d===selected)+'" '+(d===today?'aria-current="date"':'')+' '+(disabled.includes(d)?'disabled':'')+'><span>'+d+'</span></button>';}).join('')+'</div>'+(showSummary?'<p class="og-picker-summary">'+(selected?'선택한 날짜 · '+month+'월 '+selected+'일 ('+['일','월','화','수','목','금','토'][new Date(Date.UTC(year,month-1,selected)).getUTCDay()]+')':'날짜를 선택해 주세요.')+'</p>':'')+(showActions?footer(selected):'')+'</div>';
}
export function timePicker({selected=false,period='오전',hour='09',minute='30'}={}) {
 return '<div class="og-time-picker"><div class="og-time-columns">'+[['오전·오후',period],['시',hour],['분',minute]].map(([label,value])=>'<div class="og-time-column"><strong>'+label+'</strong><span class="og-time-value" data-selected="'+selected+'">'+(selected?e(value):'—')+'</span></div>').join('')+'</div><p class="og-picker-summary">'+(selected?'선택한 시간 · '+e(period)+' '+e(hour)+':'+e(minute):'시간을 선택해 주세요.')+'</p>'+footer(selected)+'</div>';
}

export function rangeCalendar({year,month,start=null,end=null,...rest}={}) {
 const valid=date=>typeof date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(date)&&!Number.isNaN(Date.parse(date))&&new Date(date).toISOString().slice(0,10)===date;
 if((start&&!valid(start))||(end&&!valid(end))||(end&&(!start||end<start)))throw new RangeError('Invalid date range');
 const label=date=>date.replaceAll('-','.');
 const summary=end?label(start)+' – '+label(end):start?label(start)+' · 종료일을 선택해 주세요.':'시작일을 선택해 주세요.';
 return calendar({year,month,...rest,range:{start,end}})
 .replace('class="og-calendar"','class="og-calendar og-range-calendar"')
 .replace(/<p class="og-picker-summary">[\s\S]*$/, '<p class="og-picker-summary">'+summary+'</p><div class="og-picker-footer">'+button({label:'취소',variant:'secondary'})+button({label:'기간 적용',disabled:!end})+'</div></div>');
}
