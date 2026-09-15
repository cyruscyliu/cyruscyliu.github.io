import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
const root = resolve(new URL('..', import.meta.url).pathname);
const source = resolve(root, 'src/data/tools.json');
const cache = resolve(root, 'src/data/tools-cache.json');
const tools = JSON.parse(await readFile(source, 'utf8')).tools;
const result = { fetchedAt: new Date().toISOString(), tools: {} };
for (const tool of tools) { try { const r=await fetch(`https://api.github.com/repos/${tool.repo}`,{headers:{Accept:'application/vnd.github+json','User-Agent':'55aa-security-lab-build'}}); if(!r.ok) throw new Error(String(r.status)); const repo=await r.json(); result.tools[tool.repo]={title:repo.name,description:repo.description??''}; } catch(e) { console.warn(`Skipping ${tool.repo}: ${e.message}`); } }
if(Object.keys(result.tools).length){await mkdir(dirname(cache),{recursive:true});await writeFile(cache,JSON.stringify(result,null,2)+'\n');console.log(`Saved ${Object.keys(result.tools).length} GitHub tool records.`);}
