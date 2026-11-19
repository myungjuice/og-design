export function specimenBoard(id, rows) {
 return `<div class="guide-board" data-board="${id}">${rows.map(({title, samples}) =>
  `<section class="guide-family"><h3>${title}</h3><div class="guide-variants">
   ${samples.map(([label, control]) => `<figure><div class="guide-control" inert>${control}</div><figcaption>${label}</figcaption></figure>`).join('')}
  </div></section>`).join('')}</div>`;
}

// Column groups describe the sizes or surfaces implemented by this app.
export function specimenMatrix({id, title, columns, rows, render}) {
 const groups = columns.map(({group, forms}) =>
  `<th scope="colgroup" colspan="${forms.length}">${group}</th>`).join('');
 const forms = columns.flatMap(column => column.forms);
 return `<div class="guide-matrix" data-board="${id}" role="region" aria-label="${title}" tabindex="0">
 <table aria-label="${title}">
 <colgroup span="1"></colgroup>${columns.map(c=>`<colgroup span="${c.forms.length}"></colgroup>`).join('')}
 <thead><tr><th scope="col" rowspan="2">상태</th>${groups}</tr>
 <tr>${forms.map(([label])=>`<th scope="col">${label}</th>`).join('')}</tr></thead>
 <tbody>${rows.map(([state,label])=>`<tr data-guide-state="${state}"><th scope="row">${label}</th>
 ${forms.map(([,form])=>`<td><div inert>${render(form,state)}</div></td>`).join('')}</tr>`).join('')}</tbody>
 </table></div>`;
}
