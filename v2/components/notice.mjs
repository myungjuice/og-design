import {notice} from '../../design-system/components/feedback/render.mjs';
import {escapeHTML as e,attributes as attrs,icon} from '../../design-system/components/core.mjs';
const tones={
 info:{label:'정보',symbol:'info',shape:'<circle cx="12" cy="12" r="9"/><path d="M12 10v7M12 7v1"/>'},
 warning:{label:'주의',symbol:'warning_amber',shape:'<path d="m12 3 10 18H2L12 3ZM12 9v5M12 17v1"/>'},
 error:{label:'오류',symbol:'error_outline',shape:'<circle cx="12" cy="12" r="9"/><path d="M12 7v7M12 17v1"/>'},
 success:{label:'완료',symbol:'check_circle_outline',shape:'<circle cx="12" cy="12" r="9"/><path d="m7.5 12 3 3 6-6"/>'}
};
export function renderNotice({tone='info',title='',body='',id,live=false}={}){
 if(!Object.hasOwn(tones,tone))throw new RangeError('Unsupported notice tone: '+tone);
 if(!title.trim())throw new TypeError('Notice requires a visible title');
 const {symbol,shape}=tones[tone];
 const visual='<span class="v2-notice-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+shape+'</svg></span>';
 return notice({tone,symbol,title,body})
  .replace('class="og-notice"','class="og-notice v2-notice"'+attrs({id,role:live?(tone==='error'?'alert':'status'):undefined,'aria-atomic':live?'true':undefined}))
  .replace(icon(symbol),visual);
}
const samples=[
 ['info','사진을 확인해 주세요','글자가 선명하게 보이는 사진을 선택해 주세요.'],
 ['warning','변경 내용이 저장되지 않았어요','화면을 나가기 전에 저장해 주세요.'],
 ['error','저장하지 못했어요','입력한 내용은 그대로 남아 있어요. 다시 저장해 주세요.'],
 ['success','저장했어요','변경한 내용을 확인해 주세요.']
];
export function renderNoticeSamples(){
 return '<section class="v2-component-section" id="notices" aria-labelledby="notices-title" hidden><h2 id="notices-title">영역 안 안내</h2><p>관련 내용 가까이에서 상태와 다음 행동을 알려줍니다. 옅은 상태색 표면과 작은 아이콘 받침으로 구분하고, 문구는 선명하게 유지합니다.</p><div class="v2-notice-grid">'+samples.map(([tone,title,body])=>
  '<figure class="v2-component-sample"><figcaption><strong>'+e(tones[tone].label)+'</strong></figcaption>'+renderNotice({tone,title,body})+'</figure>').join('')+
 '</div><ul class="v2-notice-rules"><li>아이콘과 문구로도 상태를 구분합니다. 안내 전체는 버튼이 아닙니다.</li><li>중요한 오류는 해결할 때까지 관련 영역에 유지합니다. 자동으로 사라지거나 화면을 가리지 않습니다.</li><li>완료가 화면에서 충분히 드러나면 완료 안내를 반복하지 않습니다.</li></ul></section>';
}
