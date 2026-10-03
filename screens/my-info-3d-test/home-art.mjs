// Figma 35:39 is one original image fill. These windows use its 390px reference
// coordinates; the local PNG is unchanged. No screenshot or generated replacement.
const regions={
 search:[32,69,28,28],location:[331,67,29,31],
 utensils:[24,123,24,26],rice:[104,123,24,26],dumpling:[181,123,24,26],sushi:[257,123,24,26],
 dining:[231,178,22,29],coffee:[227,270,21,21],current:[162,381,39,51],
 target:[338,608,28,29],quick:[340,663,24,25],
 home:[35,764,30,29],compass:[111,765,29,27],star:[251,765,29,27],user:[327,765,29,27],
};
export function homeArt(name,{width=24,height}={}){
 const [x,y,w,h]=regions[name];
 const scale=width/w;
 return '<span class="home-art home-art-'+name+'" aria-hidden="true" style="width:'+width+'px;height:'+(height??h*scale)+'px;--sprite-width:'+390*scale+'px;--sprite-left:'+(-x*scale)+'px;--sprite-top:'+(-y*scale)+'px"><img src="./media/figma/bottom-navigation-source.png" width="851" height="1847" alt="" decoding="async" draggable="false"></span>';
}
