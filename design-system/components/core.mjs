// Pure markup helpers. HTML slots are developer-owned markup, never user text.
let sequence = 0;
export const uid = (prefix='og') => prefix+'-'+(++sequence);
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function attributes(values={}) {
 return Object.entries(values).map(([key,value])=>{
  if(!/^[a-z][\w:-]*$/i.test(key) || /^on/i.test(key) || key==='style') throw new TypeError('Unsupported attribute: '+key);
  if(value===undefined||value===null)return '';
  const booleanAttribute=/^(disabled|checked|selected|hidden|inert|required|readonly|multiple|autofocus|novalidate|formnovalidate|open|reversed|download|controls|loop|muted|autoplay)$/i.test(key);
  if(typeof value==='boolean'&&booleanAttribute)return value?' '+key:'';
  return ' '+key+'="'+escapeHTML(value)+'"';
 }).join('');
}
export const icon = name => '<span class="material-icons" aria-hidden="true">'+escapeHTML(name)+'</span>';
