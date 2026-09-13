import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','dist');
const config=JSON.parse(fs.readFileSync(path.join(root,'..','site.config.json'),'utf8'));
const expectedBase=config.defaultUrl.replace(/\/+$/,'')+'/';
const html=[]; const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);e.isDirectory()?walk(p):e.name.endsWith('.html')&&html.push(p)}}; walk(root);
const titles=new Map(), descs=new Map(); let errors=[];
if (!fs.existsSync(path.join(root,'sw.js'))) errors.push('missing service worker in dist/');
if (!fs.existsSync(path.join(root,'manifest.webmanifest'))) errors.push('missing web app manifest in dist/');
for(const f of html){const s=fs.readFileSync(f,'utf8'); const rel=path.relative(root,f); const title=s.match(/<title>(.*?)<\/title>/s)?.[1]?.trim(); const desc=s.match(/<meta name="description" content="([^"]*)"/)?.[1];
 if(!title) errors.push(`${rel}: missing title`); else {if(titles.has(title)) errors.push(`${rel}: duplicate title with ${titles.get(title)}`); titles.set(title,rel)}
 if(!desc && rel!=='404.html') errors.push(`${rel}: missing description`); else if(desc){if(descs.has(desc)) errors.push(`${rel}: duplicate description with ${descs.get(desc)}`); descs.set(desc,rel)}
 if(rel!=='404.html' && !s.includes('rel="canonical"')) errors.push(`${rel}: missing canonical`);
 if(rel!=='404.html' && !s.includes('application/ld+json')) errors.push(`${rel}: missing structured data`);
 if(rel!=='404.html' && !s.includes('name="author"')) errors.push(`${rel}: missing author metadata`);
 if(rel!=='404.html' && !s.includes('property="og:site_name"')) errors.push(`${rel}: missing social site metadata`);
 const canonical=s.match(/<link rel="canonical" href="([^"]+)"/i)?.[1]; if(canonical && !canonical.startsWith(expectedBase)) errors.push(`${rel}: canonical is outside ${expectedBase}`);
 if(/@@[A-Z_]+@@/.test(s)) errors.push(`${rel}: unresolved template token`);
 if(rel!=='404.html' && !s.includes('rel="manifest"')) errors.push(`${rel}: missing web app manifest link`);
 const hrefs=[...s.matchAll(/href="([^"]+)"/g)].map(m=>m[1]); for(const h of hrefs){if(/^(https?:|mailto:|#)/.test(h)) continue; const [raw]=h.split('#'); if(!raw) continue; const target=path.resolve(path.dirname(f),raw); if(!fs.existsSync(target)) errors.push(`${rel}: broken href ${h}`);}
}
const robots=fs.readFileSync(path.join(root,'robots.txt'),'utf8'); if(!robots.includes(`Sitemap: ${expectedBase}sitemap.xml`)) errors.push('robots.txt: sitemap does not match configured site URL');
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8'); if(!sitemap.includes(`<loc>${expectedBase}</loc>`)) errors.push('sitemap.xml: homepage URL does not match configured site URL');
console.log(`Audited ${html.length} HTML pages.`); console.log(`Unique titles: ${titles.size}; unique descriptions: ${descs.size}.`); if(errors.length){console.error(errors.join('\n'));process.exit(1)} console.log('SEO + internal-link audit passed.');
