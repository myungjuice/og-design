import {renderMyInfoTest} from './render.mjs';
document.querySelector('#app').innerHTML=renderMyInfoTest();
const dialog=document.querySelector('#preview-dialog');
document.querySelector('#app').addEventListener('click',event=>{
 const target=event.target.closest('[data-preview]');
 if(!target)return;
 const action=target.dataset.preview;
 document.querySelector('#preview-title').textContent=action;
 document.querySelector('#preview-copy').textContent=action==='마일리지 안내'?'사용 가능 마일리지와 총 보유 마일리지를 함께 보여주는 디자인 예시입니다. 금액과 방문 내역은 시안용 데이터입니다.':'현재는 내 정보 디자인을 확인하는 테스트 페이지입니다. '+action+' 기능은 실제 서비스에 연결되지 않았습니다.';
 dialog.showModal();
});
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
