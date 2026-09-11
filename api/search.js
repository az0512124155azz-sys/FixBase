const IFIXIT='https://www.ifixit.com/api/2.0';
const REPAIRAI_INDEX='https://raw.githubusercontent.com/kazemcodes/RepairAi-files/main/index.json';
const REPAIRAI_RAW='https://raw.githubusercontent.com/kazemcodes/RepairAi-files/main/';
const REPAIRAI_GITHUB='https://github.com/kazemcodes/RepairAi-files/blob/main/';
let repairCache={at:0,items:[]};

function send(res,status,body){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','public, s-maxage=120, stale-while-revalidate=600');res.end(JSON.stringify(body));}
function textOnly(v=''){return String(v).replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();}
async function getJson(url){const c=new AbortController();const t=setTimeout(()=>c.abort(),12000);try{const r=await fetch(url,{headers:{'User-Agent':'FixBase/1.0'},signal:c.signal});if(!r.ok)throw new Error(`Upstream request failed (${r.status})`);return await r.json();}finally{clearTimeout(t)}}
async function getText(url){const c=new AbortController();const t=setTimeout(()=>c.abort(),12000);try{const r=await fetch(url,{headers:{'User-Agent':'FixBase/1.0'},signal:c.signal});if(!r.ok)throw new Error(`Upstream request failed (${r.status})`);return await r.text();}finally{clearTimeout(t)}}

function ifixitResult(x,i){
  const isGuide=x.dataType==='guide'||Number.isFinite(x.guideid);
  const isDevice=x.dataType==='wiki'||x.namespace==='CATEGORY'||(!isGuide&&x.wikiid);
  return {
    key:`ifixit-${isGuide?x.guideid:(x.wikiid||i)}`,
    source:'ifixit',sourceLabel:'iFixit',
    type:isGuide?'Guide':(isDevice?'Device':'Result'),
    title:x.title||x.display_title||x.subject||'iFixit result',
    subtitle:textOnly(x.summary||x.text||x.category||''),
    category:x.category||'',
    image:x.image?.thumbnail||x.image?.mini||x.image?.standard||'',
    url:x.url||'',
    guideId:isGuide?x.guideid:null,
    openMode:isGuide?'guide':'link'
  };
}

async function getRepairItems(){
  if(Date.now()-repairCache.at<10*60*1000&&repairCache.items.length)return repairCache.items;
  try{
    const data=await getJson(REPAIRAI_INDEX);
    const groups=['schematics','solutions','guides','files'];const out=[];
    for(const group of groups){for(const x of (Array.isArray(data[group])?data[group]:[])){
      const path=typeof x==='string'?x:(x.path||x.file||'');if(!path)continue;
      out.push({path,type:group.replace(/s$/,''),index:typeof x==='string'?'':(x.index||x.title||x.description||'')});
    }}
    if(!out.length&&Array.isArray(data))for(const x of data){if(x?.path)out.push({path:x.path,type:x.type||'document',index:x.index||''});}
    repairCache={at:Date.now(),items:out};return out;
  }catch{return repairCache.items||[];}
}

function scoreText(query,text){const q=query.toLowerCase().trim();const t=text.toLowerCase();if(!q)return 0;let s=t.includes(q)?50:0;for(const w of q.split(/\s+/).filter(Boolean)){if(t.includes(w))s+=6;if(t.startsWith(w))s+=3;}return s;}
function communityTitle(path,index){if(index)return textOnly(index).slice(0,120);return path.split('/').pop().replace(/\.md$/i,'').replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());}
async function searchCommunity(query,limit=8){const items=await getRepairItems();return items.map(x=>({...x,score:scoreText(query,`${x.path} ${x.index}`)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,limit).map((x,i)=>({key:`repairai-${i}-${x.path}`,source:'repairai',sourceLabel:'RepairAI-Files',type:x.type||'Document',title:communityTitle(x.path,x.index),subtitle:x.path,category:x.path.split('/')[0]||'Community docs',image:'',url:REPAIRAI_GITHUB+x.path,path:x.path,openMode:'community'}));}

function toolResults(query){const q=query.toLowerCase();if(!/(board|boardview|schematic|pcb|diode|voltage|microsolder|logic board|motherboard)/.test(q))return[];return[
  {key:'tool-openboarddata',source:'tools',sourceLabel:'OpenBoardData',type:'Board data',title:'OpenBoardData — known-good board measurements',subtitle:'Community voltage, diode-mode and resistance measurements for board-level diagnosis.',category:'Board repair',url:'https://github.com/warnerbryce/OpenBoardData',openMode:'link'},
  {key:'tool-boardripper',source:'tools',sourceLabel:'BoardRipper',type:'Open-source tool',title:'BoardRipper — browser boardview viewer',subtitle:'Open boardview files and schematics side-by-side in a web-based repair workspace.',category:'Board repair',url:'https://github.com/AlexeyInwerp/BoardRipper',openMode:'link'}
];}

async function ifixitSuggest(query,doctypes='guide,device,category'){try{const data=await getJson(`${IFIXIT}/suggest/${encodeURIComponent(query)}?doctypes=${encodeURIComponent(doctypes)}`);return Array.isArray(data?.results)?data.results:[];}catch{return[];}}

async function handleSuggest(query){
  const [ifixit,community]=await Promise.all([ifixitSuggest(query),searchCommunity(query,3)]);
  const seen=new Set();const out=[];
  for(const x of ifixit.slice(0,7)){const text=x.title||x.display_title||x.subject;if(!text||seen.has(text.toLowerCase()))continue;seen.add(text.toLowerCase());out.push({text,hint:x.dataType==='guide'?(x.category||'Repair guide'):(x.summary||'Device').slice(0,90),source:'ifixit',sourceLabel:'iFixit'});}
  for(const x of community){if(seen.has(x.title.toLowerCase()))continue;seen.add(x.title.toLowerCase());out.push({text:x.title,hint:x.subtitle,source:'repairai',sourceLabel:'Community'});}
  const popular=['battery replacement','screen replacement','charging port repair','HDMI repair','fan replacement','thermal paste','SSD replacement','Wi-Fi repair'];
  for(const p of popular){if(out.length>=9)break;if(p.includes(query.toLowerCase())&&!seen.has(p)){out.push({text:p,hint:'Popular repair search',source:'local',sourceLabel:'Popular'});}}
  return {suggestions:out.slice(0,9)};
}

async function handleSearch(query){
  const [ifixitRaw,community]=await Promise.all([ifixitSuggest(query,'guide,device,category,question'),searchCommunity(query,10)]);
  const ifixit=ifixitRaw.map(ifixitResult).slice(0,18);
  const tools=toolResults(query);
  const merged=[...ifixit,...community,...tools];
  const seen=new Set();const results=[];
  for(const x of merged){const k=(x.source+'|'+x.title).toLowerCase();if(seen.has(k))continue;seen.add(k);results.push(x);}
  return {query,results:results.slice(0,28),sourcesUsed:new Set(results.map(x=>x.source)).size};
}

function stepImage(step){const media=step?.media?.data||step?.media||[];if(Array.isArray(media)){for(const m of media){const u=m?.image?.standard||m?.image?.medium||m?.standard||m?.medium;if(u)return u;}}return step?.image?.standard||step?.image?.medium||'';}
async function handleGuide(id){
  if(!/^\d+$/.test(String(id)))throw new Error('Invalid guide id');
  const g=await getJson(`${IFIXIT}/guides/${id}`);
  return {
    title:g.title||[g.category,g.subject,g.type].filter(Boolean).join(' '),
    introduction:textOnly(g.introduction_raw||g.introduction||g.introduction_rendered||''),
    difficulty:g.difficulty||'',time:g.time_required||'',
    tools:(g.tools||[]).map(x=>x.name||x.title).filter(Boolean),
    parts:(g.parts||[]).map(x=>x.name||x.title).filter(Boolean),
    steps:(g.steps||[]).map((s,i)=>({title:textOnly(s.title||`Step ${i+1}`),lines:(s.lines||[]).map(l=>textOnly(l.text||l)).filter(Boolean),image:stepImage(s)})),
    url:g.url||`https://www.ifixit.com/Guide/${id}`
  };
}

async function handleCommunity(path){
  const p=String(path||'');if(!p||p.includes('..')||! /^[a-zA-Z0-9_./-]+$/.test(p)||!p.endsWith('.md'))throw new Error('Invalid community document path');
  const text=await getText(REPAIRAI_RAW+p);const lines=text.split(/\r?\n/).slice(0,500);
  const first=lines.find(x=>x.startsWith('# '));return {title:first?first.slice(2):communityTitle(p,''),lines,url:REPAIRAI_GITHUB+p};
}

module.exports=async function handler(req,res){
  if(req.method!=='POST')return send(res,405,{error:'METHOD_NOT_ALLOWED',message:'Use POST'});
  let body=req.body;if(typeof body==='string'){try{body=JSON.parse(body)}catch{return send(res,400,{error:'INVALID_JSON',message:'Invalid JSON'})}}body=body||{};
  try{
    const mode=String(body.mode||'search');
    if(mode==='suggest'){const query=String(body.query||'').trim();return send(res,200,query.length<2?{suggestions:[]}:await handleSuggest(query));}
    if(mode==='search'){const query=String(body.query||'').trim();if(!query)return send(res,400,{error:'QUERY_REQUIRED',message:'Enter a search query'});return send(res,200,await handleSearch(query));}
    if(mode==='guide')return send(res,200,await handleGuide(body.guideId));
    if(mode==='community')return send(res,200,await handleCommunity(body.path));
    return send(res,400,{error:'UNKNOWN_MODE',message:'Unknown search mode'});
  }catch(err){console.error('FixBase search error',err);return send(res,502,{error:'SEARCH_FAILED',message:err?.name==='AbortError'?'A repair source timed out. Try again.':(err?.message||'Search failed')});}
};
