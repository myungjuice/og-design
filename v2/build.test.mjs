import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
test('actual public build includes every v2 route and first home entry without dev files',()=>{
 execFileSync(process.execPath,['scripts/build-preview.mjs'],{cwd:root});
 for(const path of ['index.html','design-system/index.html','home/index.html','my-land/index.html','barcode/index.html','og-park/index.html','my-info/index.html','page.mjs','render.mjs','navigation.mjs','tokens.css','shell.css','design-system/foundations.mjs','design-system/foundations.css','design-system/color-values.mjs','components/index.html','components/render.mjs','components/preview.mjs','components/styles.css'])assert.ok(existsSync(join(root,'dist/v2',path)),path+' is published');
 const home=readFileSync(join(root,'dist/index.html'),'utf8');
 const entries=[...home.matchAll(/<a class="artifact-link"[^>]*href="([^"]+)"[^>]*>[\s\S]*?<strong>([^<]+)<\/strong>/g)].map(x=>[x[1],x[2]]);
 assert.deepEqual(entries.slice(0,2),[['v2/','3D컨셉 디자인 v2'],['design-system/canvas/','디자인 캔버스 열기']]);
 function walk(path){return readdirSync(path,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(join(path,entry.name)):[join(path,entry.name)]);}
 const files=walk(join(root,'dist'));
 assert.ok(files.every(path=>!path.includes('.test.')&&!path.endsWith('.md')&&!path.split('/').some(name=>name.startsWith('.'))),'public build excludes tests, Markdown, dotfiles and credentials');
});
