import {avatar,thumbnail} from '../../design-system/components/avatar/render.mjs';
import {escapeHTML as e,attributes as attrs,icon as legacyIcon} from '../../design-system/components/core.mjs';
import {icon} from '../../screens/my-info-3d-test/icons.mjs';
import {stateComparison} from './catalog.mjs';

const assetBase='/screens/my-info-3d-test/media/';
const states=['ready','loading','empty','error'];
const captions={ready:'이미지 표시',loading:'이미지를 불러오는 중',empty:'이미지 없음',error:'이미지를 불러오지 못했어요'};
function validate({src,state,label,decorative}){
 if(typeof src!=='string'||src!==src.trim()||/[\\\u0000-\u001f\u007f]/.test(src)||src.startsWith('//')||/^[a-z][a-z\d+.-]*:/i.test(src)&&!/^https?:\/\/[^/]+\//i.test(src))throw new TypeError('Use a relative image path or an HTTP(S) URL');
 if(!states.includes(state))throw new RangeError('Unsupported media state: '+state);
 if(typeof label!=='string'||!label.trim())throw new TypeError('Media requires a descriptive label');
 if(typeof decorative!=='boolean')throw new TypeError('Decorative media flag must be boolean');
}
const meaning=(label,state,kind)=>state==='ready'?label:label+' · '+(kind==='avatar'&&state!=='loading'?'기본 프로필 · ':'')+captions[state];
function mediaAttributes({label,state,kind,decorative,id,watch}){
 return {'data-v2-media':kind,'data-media-label':label,'data-media-watch':String(watch),id,
  role:decorative?undefined:'img','aria-label':decorative?undefined:meaning(label,state,kind),
  'aria-hidden':decorative?'true':undefined,'aria-busy':state==='loading'?'true':undefined};
}
const image=(src,width,height)=>'<img data-media-image src="'+e(src)+'" width="'+width+'" height="'+height+'" alt="" aria-hidden="true" decoding="async">';
export function renderAvatar({size='medium',src='',label='프로필',state='ready',character=false,decorative=false,id}={}){
 validate({src,state,label,decorative});
 if(!['small','medium','large'].includes(size))throw new RangeError('Unsupported profile size: '+size);
 if(typeof character!=='boolean'||character&&src)throw new TypeError('Choose either designer character layers or an image source');
 const resolved=state==='ready'&&!src&&!character?'empty':state;
 const art=resolved==='ready'?(character?'<span class="v2-avatar-image v2-avatar-base">'+image(assetBase+'figma/profile-base.png',1536,1024)+'</span><span class="v2-avatar-image v2-avatar-overlay">'+image(assetBase+'figma/profile-overlay.png',324,573)+'</span>':'<span class="v2-avatar-image">'+image(src,64,64)+'</span>'):'';
 const accessible=mediaAttributes({label,state:resolved,kind:'avatar',decorative,id,watch:!!art});
 // Reuse the original avatar shell, replacing only its font-dependent fallback.
 return avatar({size,label:meaning(label,resolved,'avatar')})
  .replace('class="og-avatar"',()=> 'class="og-avatar v2-avatar" data-state="'+resolved+'"'+attrs(accessible))
  .replace(/ role="img" aria-label="[^"]*"(?=>)/,'')
  .replace(legacyIcon('face'),()=>art+'<span class="v2-avatar-fallback" aria-hidden="true">'+icon('user',{size:24})+'</span>');
}
export function renderThumbnail({src='',alt='매장 이미지',state='ready',ratio='square',fit='cover',placeholder='store',decorative=false,id}={}){
 validate({src,state,label:alt,decorative});
 if(!['square','wide'].includes(ratio))throw new RangeError('Unsupported thumbnail ratio: '+ratio);
 if(!['cover','contain'].includes(fit))throw new RangeError('Unsupported image fit: '+fit);
 if(!['store','photo'].includes(placeholder))throw new RangeError('Unsupported thumbnail placeholder: '+placeholder);
 const resolved=state==='ready'&&!src?'empty':state;
 const art=resolved==='ready'?image(src,ratio==='wide'?320:64,ratio==='wide'?180:64):'';
 return thumbnail({src:'',alt:'',state:resolved,attributes:{...mediaAttributes({label:alt,state:resolved,kind:'thumbnail',decorative,id,watch:!!art}),'data-ratio':ratio,'data-fit':fit}})
  .replace('class="og-thumbnail"','class="og-thumbnail v2-thumbnail"')
  .replace(/<img[^>]*>/,()=>art)
  .replace('class="og-media-fallback"','class="og-media-fallback" aria-hidden="true"')
  .replace(/(<span class="og-media-fallback"[^>]*>)<svg[\s\S]*?<\/svg>/, (markup,start)=>placeholder==='photo'?start+'<svg data-placeholder="photo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3h11a2 2 0 0 1 2 2v11M16 21H5a2 2 0 0 1-2-2V8M3 3l18 18M3 17l5-5m6 2 2-2 5 5"/><circle cx="16" cy="8" r="1"/></svg>':markup)
  .replace('<span>이미지 없음</span>',()=>'<span>'+e(captions[resolved])+'</span>');
}
function setMediaState(node,state){
 node.dataset.state=state;
 if(node.getAttribute('aria-hidden')!=='true')node.setAttribute('aria-label',meaning(node.dataset.mediaLabel,state,node.dataset.v2Media));
 if(state==='loading')node.setAttribute('aria-busy','true');else node.removeAttribute('aria-busy');
 const fallback=node.querySelector('.og-media-fallback>span');if(fallback)fallback.textContent=captions[state];
}
export function setupMedia(root){
 for(const node of root.querySelectorAll('[data-v2-media][data-media-watch="true"]')){
  if(node.dataset.mediaBound==='true')continue;node.dataset.mediaBound='true';
  const images=[...node.querySelectorAll('[data-media-image]')];
  const check=()=>{
   if(images.some(img=>img.complete&&!img.naturalWidth)){setMediaState(node,'error');return;}
   if(images.every(img=>img.complete&&img.naturalWidth))setMediaState(node,'ready');
   else setMediaState(node,'loading');
  };
  for(const img of images){img.addEventListener('load',check);img.addEventListener('error',()=>setMediaState(node,'error'));}
  check();
 }
}
const stage=html=>'<div class="v2-media-stage">'+html+'</div>';
const sample=(title,html,copy='')=>'<figure class="v2-component-sample"><figcaption><strong>'+e(title)+'</strong>'+(copy?'<span>'+e(copy)+'</span>':'')+'</figcaption>'+stage(html)+'</figure>';
const thumbSource=assetBase+'membership.png';
const previewImage=(kind,state)=>kind==='avatar'?renderAvatar({character:true,size:'large',label:'프로필 캐릭터',state}):renderThumbnail({src:thumbSource,alt:'멤버십 에셋',ratio:'wide',fit:'contain',state});
const preview=kind=>stage('<div data-media-preview="'+kind+'"><label class="v2-media-controls" for="v2-'+kind+'-state">'+(kind==='avatar'?'프로필':'썸네일')+' 표시 상태<select id="v2-'+kind+'-state" data-media-state>'+states.map(state=>'<option value="'+state+'">'+({ready:'이미지 표시',loading:'불러오는 중',empty:'이미지 없음',error:'불러오기 실패'})[state]+'</option>').join('')+'</select></label><div class="v2-media-preview-slot" data-media-slot>'+previewImage(kind,'ready')+'</div><p class="v2-media-message" data-media-message role="status" aria-live="polite" aria-atomic="true"></p></div>');
export function renderMediaSamples(){
 return `<section class="v2-component-section" id="avatar" aria-labelledby="avatar-title" hidden><h2 id="avatar-title">프로필 이미지</h2><p>원형 프레임으로 사람을 구분합니다. 기존 디자이너 캐릭터의 두 이미지 레이어와 비율을 유지하고 테두리에만 얕은 입체감을 줍니다.</p>
 ${sample('목록·프로필 크기', '<div class="v2-avatar-sizes">'+[['small','32px · 작은 목록'],['medium','48px · 기본 목록'],['large','64px · 프로필']].map(([size,copy])=>'<div>'+renderAvatar({size,character:true,label:'프로필 캐릭터'})+'<span>'+copy+'</span></div>').join('')+'</div><div class="v2-media-context">'+renderAvatar({size:'large',character:true,decorative:true})+'<div><strong>맑은 땅콩 님</strong><p>이름과 이미지 사이 16px</p></div></div>')}
 ${stateComparison('<div class="v2-media-grid">'+states.slice(1).map(state=>sample(({loading:'불러오는 중',empty:'이미지 없음 · 기본 프로필',error:'불러오기 실패 · 기본 프로필'})[state],renderAvatar({state,size:'large',character:true,label:'프로필 캐릭터'}))).join('')+'</div>','이미지 상태 비교')}
 <h3 class="v2-media-preview-title">표시 바꿔보기</h3>${preview('avatar')}
 <p>프로필 자체는 버튼이 아닙니다. 이름 옆 중복 이미지는 장식으로 제외하고, 누르는 프로필은 별도 버튼 안에 넣어 48px 이상의 터치 영역을 확보합니다. 캐릭터 선택·수정·저장은 연결하지 않습니다.</p></section>
 <section class="v2-component-section" id="thumbnail" aria-labelledby="thumbnail-title" hidden><h2 id="thumbnail-title">썸네일</h2><p>매장·콘텐츠는 둥근 사각형으로 구분합니다. 사진은 평면으로 두고 프레임 가장자리에만 얕은 재질을 적용합니다.</p>
 <div class="v2-media-grid">
 ${sample('정사각형 · 64 × 64', '<div class="v2-media-context">'+renderThumbnail({src:thumbSource,alt:'멤버십 에셋',fit:'contain',decorative:true})+'<div><strong>멤버십 에셋</strong><p>크기·비율 비교용이며 매장 사진이 아닙니다.</p></div></div>')}
 ${sample('영역 채우기 · 16:9',renderThumbnail({src:thumbSource,alt:'멤버십 에셋 · 영역 채우기',ratio:'wide'}),'가운데를 기준으로 가장자리를 잘라 맞춥니다.')}
 ${sample('전체 보이기 · 16:9',renderThumbnail({src:thumbSource,alt:'멤버십 에셋 · 전체 보이기',ratio:'wide',fit:'contain'}),'로고·에셋이 잘리면 안 되는 경우 사용합니다.')}
 </div>
 ${stateComparison('<div class="v2-media-grid">'+states.slice(1).map(state=>sample(({loading:'불러오는 중',empty:'이미지 없음',error:'불러오기 실패'})[state],renderThumbnail({state,alt:'매장 이미지',ratio:'wide'}))).join('')+'</div>','이미지 상태 비교')}
 <h3 class="v2-media-preview-title">표시 바꿔보기</h3>${preview('thumbnail')}
 <p>모서리 12px·테두리 1px. 상태가 바뀌어도 크기와 비율은 유지하고, 빈 이미지 주소를 요청하거나 이미지 자체에 선택·눌림 효과를 넣지 않습니다. 기존 화면의 이미지와 배치는 변경하지 않습니다.</p></section>`;
}
export function setupMediaSamples(root){
 setupMedia(root);
 for(const widget of root.querySelectorAll('[data-media-preview]')){
  if(widget.dataset.mediaPreviewReady==='true')continue;widget.dataset.mediaPreviewReady='true';
  widget.querySelector('[data-media-state]').addEventListener('change',event=>{
   const state=event.target.value;if(!states.includes(state))return;
   const slot=widget.querySelector('[data-media-slot]');slot.innerHTML=previewImage(widget.dataset.mediaPreview,state);setupMedia(slot);
   widget.querySelector('[data-media-message]').textContent=captions[state]+' · 크기와 비율은 유지합니다.';
  });
 }
}
