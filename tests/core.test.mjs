import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSchedule, calculateBand, createCountdown, createStorage, escapeHtml } from '../src/lib/core.js';
import { lessons } from '../src/lessons.js';
import { resources } from '../src/content.js';

test('IELTS averages round at .25 and .75 boundaries without admission predictions', () => {
  assert.equal(calculateBand([6,6,6,7]),6.5);
  assert.equal(calculateBand([6,7,7,7]),7);
  assert.equal(calculateBand([6,6,6,6.5]),6);
  assert.equal(calculateBand([9,9,9,9]),9);
  assert.equal(calculateBand([0,0,0,0]),0);
  assert.throws(()=>calculateBand([6,7,NaN,8]));
  assert.throws(()=>calculateBand([10,7,8,9]));
});

test('every study plan uses exactly the chosen weekly time, including SAT', () => {
  for (const goal of ['IELTS','SAT','YDT','YDS','Speaking','General']) {
    for (const hours of [4,8,14]) {
      const rows=buildSchedule(goal,hours);
      assert.equal(rows.reduce((sum,row)=>sum+row.minutes,0),hours*60);
      assert.equal(rows.length,6);
      assert.ok(rows.every((row)=>row.task.length>20 && Number.isInteger(row.minutes)));
    }
  }
  assert.throws(()=>buildSchedule('unknown',8));
  assert.throws(()=>buildSchedule('SAT',-4));
});

test('countdown handles pause, inactive tabs, completion and restart without negative time', () => {
  let now=0;
  const timer=createCountdown(60,()=>now);
  timer.start(); now=1500;
  assert.equal(timer.read().seconds,59);
  timer.pause(); now=40000;
  assert.equal(timer.read().seconds,59);
  timer.start(); now=999999;
  assert.deepEqual(timer.read(),{seconds:0,running:false,finished:true});
  timer.start();
  assert.equal(timer.read().seconds,0);
  timer.reset(120); timer.start(); now+=1000;
  assert.equal(timer.read().seconds,119);
});

test('blocked, corrupted or wrongly shaped storage never prevents learning', () => {
  const broken=createStorage(()=>{throw new Error('Blocked');});
  assert.deepEqual(broken.read('x',[]),[]);
  assert.equal(broken.write('x',{}),false);
  const memory=new Map([['bad','not json'],['shape','{}']]);
  const local=createStorage(()=>({getItem:key=>memory.get(key)??null,setItem:(key,val)=>memory.set(key,val)}));
  assert.deepEqual(local.read('bad',[]),[]);
  assert.deepEqual(local.read('shape',[],Array.isArray),[]);
  assert.ok(local.write('valid',['a']));
  assert.deepEqual(local.read('valid',[],Array.isArray),['a']);
  assert.equal(escapeHtml('<script>"&'), '&lt;script&gt;&quot;&amp;');
});

test('eight original mini-lessons have unique IDs, valid answers and transfer prompts', () => {
  const all=Object.values(lessons).flat();
  assert.equal(all.length,8);
  assert.equal(new Set(all.map((item)=>item.id)).size,8);
  for (const exam of ['IELTS','SAT']) {
    assert.equal(lessons[exam].length,4);
    assert.equal(new Set(lessons[exam].map((item)=>item.answer)).size,4);
  }
  all.forEach((item)=>{
    assert.ok(item.options[item.answer]);
    assert.ok(item.explanation.length>70);
    assert.ok(item.transfer.length>40);
  });
  assert.equal(resources.length,8);
  assert.equal(resources.find((item)=>item.id==='ielts-check').items.length,12);
});
