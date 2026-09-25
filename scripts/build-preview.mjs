import {mkdirSync,readdirSync,copyFileSync,rmSync,lstatSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join,extname} from 'node:path';

// Publish site pages and shared documents; exclude credentials and development files.
const root=fileURLToPath(new URL('../',import.meta.url));
const output=join(root,'dist');
if(existsSync(output)&&lstatSync(output).isSymbolicLink())throw new Error('Refusing symlink output directory');
rmSync(output,{recursive:true,force:true});mkdirSync(output,{recursive:true});
const allowed=new Set(['.html','.css','.js','.mjs','.svg','.png','.jpg','.jpeg','.webp','.gif','.ico','.woff','.woff2','.ttf','.pdf','.pptx']);
let count=0;
function copy(relative){
 for(const entry of readdirSync(join(root,relative),{withFileTypes:true})){
  if(entry.name.startsWith('.')||entry.name.includes('.test.')||entry.isSymbolicLink())continue;
  const path=join(relative,entry.name);
  if(entry.isDirectory()){copy(path);continue;}
  if(!allowed.has(extname(entry.name)))continue;
  mkdirSync(join(output,relative),{recursive:true});copyFileSync(join(root,path),join(output,path));count++;
 }
}
for(const dir of ['design-system','assets','docs','research','reports','concepts','screens'])copy(dir);
copyFileSync(join(root,'index.html'),join(output,'index.html'));
console.log(`Prepared ${count+1} static files; credentials and development files excluded.`);
