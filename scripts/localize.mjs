import { parse, serialize } from 'parse5';
import { localizedHref } from '../src/lib/i18n-core.js';
import catalog from '../src/locales/tr.js';

const get = (node, name) => node.attrs?.find((attr) => attr.name === name)?.value;
const set = (node, name, value) => {
  const found=node.attrs?.find((attr)=>attr.name===name);
  if (found) found.value=value;
  else (node.attrs ||= []).push({name,value});
};
export const walk = (node, visit) => { visit(node); (node.childNodes || []).forEach((child)=>walk(child,visit)); };
const text = (node) => node.nodeName==='#text' ? node.value : (node.childNodes||[]).map(text).join('');
const normalize = (value) => value.trim().replace(/\s+/g,' ');
const ignored = (node) => node && (get(node,'data-practice')!==undefined || ['script','style','svg'].includes(node.tagName) || ignored(node.parentNode));
const translatable = ['aria-label','placeholder','alt'];

export const collectMessages = (html) => {
  const result=new Set();
  walk(parse(html,{scriptingEnabled:false}),(node)=>{
    if (ignored(node)) return;
    if (node.nodeName==='#text' && normalize(node.value)) result.add(normalize(node.value));
    for (const attr of node.attrs||[]) {
      if ((translatable.includes(attr.name) || (attr.name==='content' && ['description','og:title','og:description'].includes(get(node,'name') || get(node,'property')))) && attr.value.trim()) result.add(normalize(attr.value));
    }
  });
  return [...result];
};

export const localizePage = (html, page, locale) => {
  const tree=parse(html,{scriptingEnabled:false});
  const missing=new Set();
  const convert=(source)=>{
    const key=normalize(source);
    if (!key) return source;
    if (!Object.hasOwn(catalog,key)) { missing.add(key); return source; }
    return source.replace(source.trim(),catalog[key]);
  };
  walk(tree,(node)=>{
    // Make option identifiers independent of the translated label.
    if (node.tagName==='option' && get(node,'value')===undefined) set(node,'value',text(node));
    if (node.tagName==='html') set(node,'lang',locale);
    if (node.tagName==='body') set(node,'data-locale',locale);
    if (get(node,'data-locale') && node.tagName==='a') set(node,'aria-current',get(node,'data-locale')===locale?'true':'false');
    if (node.tagName==='main' && page==='ydt-yds') set(node,'lang','tr');
    if (get(node,'data-practice')!==undefined) set(node,'lang','en');
    else if (get(node,'lang')==='en' && locale==='tr' && !get(node,'data-locale')) set(node,'lang','tr');
    if (locale!=='tr' || ignored(node)) return;
    if (node.nodeName==='#text') node.value=convert(node.value);
    for (const attr of node.attrs||[]) {
      if (translatable.includes(attr.name) || (attr.name==='content' && ['description','og:title','og:description'].includes(get(node,'name') || get(node,'property')))) attr.value=convert(attr.value);
      if (attr.name==='href' && !get(node,'data-locale') && get(node,'rel')!=='alternate') attr.value=localizedHref(attr.value,locale);
    }
  });
  if (missing.size) throw new Error('Missing Turkish messages:\n'+[...missing].map(value=>JSON.stringify(value)).join('\n'));
  return serialize(tree);
};
