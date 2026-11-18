const artwork = new Map([
 ['인테리어가 멋져요', 'G14'],
 ['단체모임 하기 좋아요', 'F09'],
 ['주차하기 편해요', 'G04'],
 ['직원이 친절해요', 'G01'],
 ['집밥 같은 맛이에요', 'KR01'],
 ['반찬이 알차요', 'KR02']
]);

export function joybarIcon(item, fallback) {
 const code = artwork.get(item.name);
 return code
  ? `<img class="v2-joybar-icon" src="/assets/joybar-20261112/${code}.svg" width="18" height="18" alt="">`
  : fallback;
}
