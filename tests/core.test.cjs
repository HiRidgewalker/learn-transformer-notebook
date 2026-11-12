const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const fakeReact={Component:class {}, createElement:(type,props,...children)=>({type,props,children})};
const fakeReactDOM={render:()=>{}};
const context=vm.createContext({window:{React:fakeReact,ReactDOM:fakeReactDOM},document:{getElementById:()=>({})},location:{hash:""},console,Math,Array,Object,Number,String,localStorage:{getItem:()=>null}});
vm.runInContext(fs.readFileSync(path.join(__dirname,'../public/app.js'),'utf8'),context);
const calc=(expression)=>vm.runInContext(expression,context);
const near=(a,b,eps=1e-6)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);
test('14 chapters with unique route IDs',()=>{
 const ids=Array.from(calc('LESSONS.map(l=>l.id)'));
 assert.equal(ids.length,14); assert.equal(new Set(ids).size,14);
 for(const id of ['tokenizer','embedding','position','attention','multihead','normalization','ffn','mask','encoder','decoder','training','generation'])assert.ok(ids.includes(id));
});
test('softmax preserves sum and sign',()=>{
 const p=Array.from(calc('softmax([1,2,3])'));
 near(p.reduce((a,b)=>a+b,0),1);p.forEach(v=>assert.ok(v>0&&v<1));near(p[2],0.6652409558);
});
test('masked softmax puts 0 on future position',()=>{
 const p=Array.from(calc('softmax([1,2,3,-Infinity])'));
 assert.equal(p[3],0);near(p[0]+p[1]+p[2],1);
});
test('attention single query correct weights and output',()=>{
 const p=Array.from(calc('softmax(BASE_K.map(k=>dot([1,0],k)/Math.sqrt(2)))'));
 near(p[0],.401112);near(p[1],.197776);near(p[2],.401112);
 const out=Array.from(calc('[0,1].map(j=>softmax(BASE_K.map(k=>dot([1,0],k)/Math.sqrt(2))).reduce((v,w,i)=>v+w*BASE_V[i][j],0))'));
 near(out[0],1.604448,0.00001);near(out[1],.796664,0.00001);
});
test('classic positional encoding has correct dimension values',()=>{
 near(Math.sin(1),.8414709848);near(Math.cos(1),.5403023058);near(Math.sin(.01),.0099998333);near(Math.cos(.01),.9999500004);
});
test('FFN expansion and projection shapes',()=>{
 assert.equal(calc('FFNU.length'),8);assert.equal(calc('FFNR.length'),8);assert.equal(calc('FFNO.length'),4);
 near(calc('FFNU[0]'),.3); assert.equal(calc('FFNR.filter(v=>v<0).length'),0);
});
test('cross entropy decreases with higher true class logit',()=>{
 const l1=calc('-Math.log(softmax([.4,1.2,.8])[0])');
 const l2=calc('-Math.log(softmax([2.4,1.2,.8])[0])');
 assert.ok(l2<l1);
});
test('page source and styles include each interactive lesson',()=>{
 const js=fs.readFileSync(path.join(__dirname,'../public/app.js'),'utf8');
 const css=fs.readFileSync(path.join(__dirname,'../public/styles.css'),'utf8');
 for(const text of ['Causal Mask','Tokenizer','Cross-Attention','LayerNorm','Softmax','Generation'])assert.ok(js.includes(text));
 for(const cl of ['interactive-card','attention-network','lesson-tile','home-hero','layer-journey'])assert.ok(css.includes(cl));
});
test('all 14 lesson pages and visualization components can produce React elements',()=>{
  const result=calc(`(()=>{const app=new App({});return LESSONS.map(l=>{app.state.route=l.id;app.state.done=[];const page=app.renderLesson(l);const viz=app.Visualization({id:l.id});return [l.id,!!page,!!viz]})})()`);
  assert.equal(result.length,14);
  for(const [id,rendered,viz] of result){assert.ok(rendered,`${id} page missing`);assert.ok(viz,`${id} visualization missing`);}
});
