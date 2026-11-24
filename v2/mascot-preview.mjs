// Review assets from the November 23 design delivery.
const root='/assets/mascot-20261123/';
export const mascotNames=Object.freeze({bear:'곰',penguin:'펭귄',raccoon:'너구리'});

export function mascotBaseSrc(character){
 return root+'base/'+character+'.jpg';
}

export function decemberMascotSrc(character,pose){
 const filename=character==='raccoon'&&pose==='roulette-result'?'greeting':pose;
 return root+'months/12/'+character+'/'+filename+'.jpg';
}
