// Only for legacy, developer-authored specimen attributes during migration.
export function specimenAttributes(source='') {
 const template=document.createElement('template');
 template.innerHTML='<i '+source+'></i>';
 return Object.fromEntries([...template.content.firstElementChild.attributes].map(a=>[a.name,a.value===''?true:a.value]));
}
