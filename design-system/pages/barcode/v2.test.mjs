import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {barcodeBoard} from './render.mjs';
test('V2 adds only one basic screen and leaves original board unchanged',async()=>{
 const {barcodeV2Board}=await import('./v2.mjs');
 const html=barcodeV2Board();
 assert.equal((html.match(/class="og-barcode-screen /g)||[]).length,1);
 for(const label of ['12,400 M','10,000 M','영수증 적립','마일리지 사용'])assert.ok(html.includes(label));
 assert.ok(html.includes('og-barcode-v2'));
 assert.equal(execFileSync(process.execPath,['--input-type=module','-e',"import {barcodeBoard} from './design-system/pages/barcode/render.mjs';import {createHash} from 'node:crypto';console.log(createHash('sha256').update(barcodeBoard()).digest('hex'))"],{encoding:'utf8'}).trim(),'0483d5c5d48b73085b8e887216d021c8204aa96bdf95e0c07d86d5384667ff97');
});
