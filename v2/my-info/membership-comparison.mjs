import {renderCharacterArt} from './character.mjs';
import {button} from '../../design-system/components/button/render.mjs';
import {bottomSheet} from '../../design-system/components/sheet/render.mjs';
import {escapeHTML as e,uid} from '../../design-system/components/core.mjs';
import {renderMyInfoTest} from '../../screens/my-info-3d-test/render.mjs';
const svg=path=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+path+'</svg>';
const copy=svg('<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 4V3H3v13h1"/>');
// The selected certificate is reused by every membership state. Original board
// fixtures retain the absent-code, registration-only and share-open conditions.
export function renderMembershipScreen({code='OG1234',referral='',count=3,shareOpen=false,memberNumber='OG-00012345',nickname='맑은 땅콩',joined='2026-05-28',view='all',character='bear'}={}){
 const referralId=uid('v2-membership-referral-code');
 const codeRow=code?'<div class="v2-member-code-row"><span class="v2-member-qr" role="img" aria-label="공유 QR코드 디자인 예시">'+svg('<path d="M3 3h6v6H3ZM15 3h6v6h-6ZM3 15h6v6H3ZM15 15h3v3h3v3h-6ZM12 3v9h9M3 12h6m3 3v6"/>')+'</span><div><span>내 공유 코드</span><strong>'+e(code)+'</strong></div><button type="button" inert class="v2-member-copy-code" aria-label="내 공유 코드 복사">'+copy+'</button></div>':'<div class="v2-member-no-code"><h3>내 공유 코드</h3><p>1번 이상 적립을 하면 내 공유 코드가 생깁니다.</p></div>';
 const certificate='<article class="v2-member-certificate" aria-label="멤버십 인증서"><div class="v2-member-brand">OGGO LAND <span>MEMBERSHIP</span></div><div class="v2-member-identity"><div class="v2-member-copy"><p>멤버십 인증서</p><h3>'+e(nickname)+'</h3><dl><div><dt>회원번호</dt><dd>'+e(memberNumber)+'</dd></div><div><dt>가입일</dt><dd>'+e(joined)+'</dd></div><div><dt>내가 초대한 공유인</dt><dd>'+Number(count).toLocaleString('ko-KR')+'명</dd></div></dl></div><div class="v2-member-portrait" data-membership-character>'+renderCharacterArt(character)+'</div></div>'+codeRow+'</article>';
 const actions='<div class="v2-member-actions">'+button({label:'이미지 저장',variant:'secondary',className:'v2-button'})+button({label:'친구에게 공유',className:'v2-button'})+'</div><div class="v2-member-link"><span>초대 링크</span><button type="button" inert aria-label="공유 링크 복사">'+copy+'</button></div>';
 const referralHTML='<section class="v2-member-referral" data-registered="'+Boolean(referral)+'"><h3>'+(referral?'나를 초대한 공유인의 공유코드':'나를 초대한 공유인 등록')+'</h3><label for="'+referralId+'">공유인 코드</label><div><input id="'+referralId+'" inert type="text" value="'+e(referral)+'" placeholder="공유인 코드" autocomplete="off"'+(referral?' disabled':'')+'>'+(referral?'':'<button type="button" inert aria-label="공유인 코드 입력">'+svg('<path d="m16 3 5 5-12 12-6 1 1-6ZM14 5l5 5"/>')+'</button>')+'</div></section>';
 const share=shareOpen&&code?'<div class="og-membership-overlay">'+bottomSheet({title:'친구에게 오지고랜드 공유하기',bodyHTML:'<div class="v2-member-share-channels">'+button({label:'카카오톡 공유',variant:'secondary',className:'v2-button'})+button({label:'링크 공유',variant:'secondary',className:'v2-button'})+'</div>',actions:[]}).replace('class="og-sheet-panel"','class="og-sheet-panel v2-sheet-panel"')+'</div>':'';
 const profile=renderMyInfoTest({assetBase:'/screens/my-info-3d-test/media/figma/'}).match(/<header class="profile-header">[\s\S]*?<\/header>/)[0];
 const screen='<section class="v2-membership-screen og-membership" aria-label="멤버십"><div class="og-history-backdrop" inert aria-hidden="true">'+profile+'</div><div class="og-history-scrim" aria-hidden="true"></div><section class="v2-member-sheet" aria-label="멤버십 바텀시트"><header class="v2-member-header"><h2>멤버십</h2><button type="button" inert aria-label="멤버십 닫기">'+svg('<path d="m6 6 12 12M18 6 6 18"/>')+'</button></header><div class="v2-member-body" role="region" aria-label="멤버십 내용" tabindex="0">'+(view==='registration'?'':certificate+(code?actions:''))+referralHTML+'</div><footer class="v2-member-footer">'+button({label:'저장하기',className:'v2-button'})+'</footer></section>'+share+'</section>';
 return screen.replace(/<button(?! inert)\b/g,'<button inert');
}
export function setupMembershipCharacters(root){
 const section=root.querySelector('#membership');if(!section||section.dataset.membershipCharactersReady)return;
 section.dataset.membershipCharactersReady='true';
 let selected='bear';
 const update=()=>{for(const host of section.querySelectorAll('.v2-source-host')){const target=host.shadowRoot?.querySelector('[data-membership-character]');if(target)target.innerHTML=renderCharacterArt(selected);}};
 root.addEventListener('v2-character-preview-change',event=>{selected=event.detail.selected;update();});
 // Extra states mount only when expanded. Apply the selected character to new
 // mounts as well, without waking or re-rendering unrelated review screens.
 for(const details of section.querySelectorAll('.v2-source-extra'))details.addEventListener('toggle',()=>{if(details.open)update();});
 update();
}
