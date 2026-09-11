const form=document.getElementById('searchForm');
const q=document.getElementById('q');
const clearBtn=document.getElementById('clearBtn');
const suggestions=document.getElementById('suggestions');
const resultsSection=document.getElementById('resultsSection');
const results=document.getElementById('results');
const resultTitle=document.getElementById('resultTitle');
const resultMeta=document.getElementById('resultMeta');
const sourceTabs=document.getElementById('sourceTabs');
const guideModal=document.getElementById('guideModal');
const guideBody=document.getElementById('guideBody');
const guideSource=document.getElementById('guideSource');

let allResults=[];
let activeSource='all';
let suggestTimer=null;
let suggestIndex=-1;
let lastSuggestItems=[];
let requestToken=0;
const common=['iPhone battery replacement','Samsung Galaxy screen replacement','PlayStation 5 HDMI repair','MacBook battery replacement','Nintendo Switch joy-con','Dell XPS battery','Pixel screen replacement','iPad charging port','Windows laptop fan','Xbox Series X repair'];

function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function strip(v=''){const d=document.createElement('div');d.innerHTML=String(v);return d.textContent||'';}

async function api(payload){
  const r=await fetch('/api/search',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const data=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(data.message||'Search service unavailable');
  return data;
}

function setClear(){clearBtn.classList.toggle('visible',!!q.value);}
function closeSuggestions(){suggestions.classList.remove('open');suggestIndex=-1;}
function iconFor(item){if(item.source==='ifixit')return '↗';if(item.source==='repairai')return '⌘';if(item.source==='tools')return '⌁';return '⌕';}

function renderSuggestions(items){
  lastSuggestItems=items;suggestIndex=-1;
  if(!items.length){closeSuggestions();return;}
  suggestions.innerHTML=items.map((x,i)=>`<button type="button" class="suggestion-row" data-i="${i}" role="option"><span class="suggestion-icon">${iconFor(x)}</span><span class="suggestion-copy"><b>${esc(x.text)}</b>${x.hint?`<small>${esc(x.hint)}</small>`:''}</span><span class="suggestion-source">${esc(x.sourceLabel||'')}</span></button>`).join('')+`<div class="suggestion-footer">Searches live repair indexes. No AI used.</div>`;
  suggestions.classList.add('open');
  suggestions.querySelectorAll('.suggestion-row').forEach((b,i)=>b.onclick=()=>chooseSuggestion(i));
}

function chooseSuggestion(i){const item=lastSuggestItems[i];if(!item)return;q.value=item.text;setClear();closeSuggestions();performSearch();}

async function loadSuggestions(){
  const value=q.value.trim();setClear();
  if(value.length<2){const v=value.toLowerCase();renderSuggestions(common.filter(x=>!v||x.toLowerCase().includes(v)).slice(0,7).map(text=>({text,hint:'Popular repair search',source:'local',sourceLabel:'Popular'})));return;}
  const token=++requestToken;
  try{const data=await api({mode:'suggest',query:value});if(token!==requestToken)return;const items=Array.isArray(data.suggestions)?data.suggestions:[];renderSuggestions(items.length?items:common.filter(x=>x.toLowerCase().includes(value.toLowerCase())).slice(0,7).map(text=>({text,source:'local',sourceLabel:'Popular'})));}
  catch{if(token===requestToken)renderSuggestions(common.filter(x=>x.toLowerCase().includes(value.toLowerCase())).slice(0,7).map(text=>({text,source:'local',sourceLabel:'Popular'})));}
}

q.addEventListener('input',()=>{clearTimeout(suggestTimer);suggestTimer=setTimeout(loadSuggestions,180);});
q.addEventListener('focus',loadSuggestions);
q.addEventListener('keydown',e=>{
  if(!suggestions.classList.contains('open'))return;
  if(e.key==='ArrowDown'){e.preventDefault();suggestIndex=Math.min(suggestIndex+1,lastSuggestItems.length-1);paintSuggestSelection();}
  if(e.key==='ArrowUp'){e.preventDefault();suggestIndex=Math.max(suggestIndex-1,0);paintSuggestSelection();}
  if(e.key==='Enter'&&suggestIndex>=0){e.preventDefault();chooseSuggestion(suggestIndex);}
  if(e.key==='Escape')closeSuggestions();
});
function paintSuggestSelection(){suggestions.querySelectorAll('.suggestion-row').forEach((el,i)=>el.classList.toggle('active',i===suggestIndex));}
document.addEventListener('click',e=>{if(!e.target.closest('.google-search'))closeSuggestions();});
clearBtn.onclick=()=>{q.value='';setClear();q.focus();loadSuggestions();};
form.addEventListener('submit',e=>{e.preventDefault();closeSuggestions();performSearch();});

document.querySelectorAll('[data-query]').forEach(b=>b.addEventListener('click',()=>{q.value=b.dataset.query;setClear();performSearch();}));
sourceTabs.addEventListener('click',e=>{const b=e.target.closest('button[data-source]');if(!b)return;activeSource=b.dataset.source;sourceTabs.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));renderResults();});

async function performSearch(){
  const query=q.value.trim();if(!query){q.focus();loadSuggestions();return;}
  history.replaceState(null,'',`?q=${encodeURIComponent(query)}`);
  resultsSection.hidden=false;resultTitle.textContent=`Results for “${query}”`;resultMeta.textContent='Searching open repair sources…';
  results.innerHTML='<div class="loading-card"><div class="loading-line"><span class="spinner"></span><span>Searching live repair indexes…</span></div></div>';
  resultsSection.scrollIntoView({behavior:'smooth',block:'start'});
  const token=++requestToken;
  try{const data=await api({mode:'search',query});if(token!==requestToken)return;allResults=Array.isArray(data.results)?data.results:[];resultMeta.textContent=`${allResults.length} matches from ${data.sourcesUsed||0} sources`;renderResults();}
  catch(err){if(token!==requestToken)return;allResults=[];resultMeta.textContent='Search failed';results.innerHTML=`<div class="error-card"><b>Couldn’t search the repair indexes.</b><div>${esc(err.message)}</div></div>`;}
}

function renderResults(){
  const items=activeSource==='all'?allResults:allResults.filter(x=>x.source===activeSource);
  if(!items.length){results.innerHTML='<div class="empty-card">No matches in this source. Try a model name plus the repair, for example “iPhone 13 battery”.</div>';return;}
  results.innerHTML=items.map((item,i)=>{
    const img=item.image?`<img src="${esc(item.image)}" alt="" loading="lazy">`:esc((item.sourceLabel||'FX').slice(0,2).toUpperCase());
    return `<article class="result-card" data-key="${esc(item.key||String(i))}"><div class="result-thumb">${img}</div><div class="result-main"><h3>${esc(item.title)}</h3><p>${esc(item.subtitle||item.summary||'')}</p><div class="result-meta"><span class="source-pill ${esc(item.source)}">${esc(item.sourceLabel||item.source)}</span>${item.category?`<span>${esc(item.category)}</span>`:''}${item.type?`<span>· ${esc(item.type)}</span>`:''}</div></div><button class="result-action">${item.openMode==='guide'?'Open guide':'Open'} →</button></article>`;
  }).join('');
  results.querySelectorAll('.result-card').forEach(card=>card.addEventListener('click',()=>{const item=items.find(x=>String(x.key)===card.dataset.key);if(item)openResult(item);}));
}

async function openResult(item){
  if(item.openMode==='guide'&&item.guideId){openModal();guideSource.innerHTML='<span class="source-pill ifixit">iFixit guide</span>';guideBody.innerHTML='<div class="loading-card"><div class="loading-line"><span class="spinner"></span><span>Loading the guide…</span></div></div>';try{const data=await api({mode:'guide',guideId:item.guideId});renderGuide(data);}catch(err){guideBody.innerHTML=`<div class="error-card">${esc(err.message)}</div>`;}return;}
  if(item.openMode==='community'&&item.path){openModal();guideSource.innerHTML='<span class="source-pill repairai">RepairAI-Files</span>';guideBody.innerHTML='<div class="loading-card"><div class="loading-line"><span class="spinner"></span><span>Loading community documentation…</span></div></div>';try{const data=await api({mode:'community',path:item.path});renderCommunity(data);}catch(err){guideBody.innerHTML=`<div class="error-card">${esc(err.message)}</div>`;}return;}
  if(item.url)window.open(item.url,'_blank','noopener,noreferrer');
}

function openModal(){guideModal.classList.add('open');guideModal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
function closeModal(){guideModal.classList.remove('open');guideModal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
document.querySelectorAll('[data-close-modal]').forEach(x=>x.addEventListener('click',closeModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

function renderGuide(g){
  const tools=(g.tools||[]).map(x=>`<li>${esc(x)}</li>`).join('');const parts=(g.parts||[]).map(x=>`<li>${esc(x)}</li>`).join('');
  guideBody.innerHTML=`<h1 id="guideTitle">${esc(g.title||'Repair guide')}</h1><p class="intro">${esc(g.introduction||'')}</p>${(tools||parts)?`<div class="guide-summary-grid">${tools?`<div class="info-box"><b>Tools</b><ul>${tools}</ul></div>`:''}${parts?`<div class="info-box"><b>Parts</b><ul>${parts}</ul></div>`:''}</div>`:''}<div>${(g.steps||[]).map((s,i)=>`<section class="guide-step"><span class="step-num">${i+1}</span><div><h3>${esc(s.title||`Step ${i+1}`)}</h3>${(s.lines||[]).map(line=>`<p>${esc(line)}</p>`).join('')}${s.image?`<img class="guide-image" src="${esc(s.image)}" alt="Step ${i+1}" loading="lazy">`:''}</div></section>`).join('')}</div><div class="source-note">Guide content is provided by <b>iFixit</b> under its applicable license. <a href="${esc(g.url||'https://www.ifixit.com')}" target="_blank" rel="noreferrer">View the original guide ↗</a></div>`;
}

function renderCommunity(d){
  guideBody.innerHTML=`<h1 id="guideTitle">${esc(d.title||'Community repair document')}</h1><p class="intro">Community documentation loaded from the MIT-licensed RepairAI-Files repository.</p><div class="community-markdown">${(d.lines||[]).map(line=>line.startsWith('# ')?`<h2>${esc(line.slice(2))}</h2>`:line.startsWith('## ')?`<h3>${esc(line.slice(3))}</h3>`:line.startsWith('- ')?`<p>• ${esc(line.slice(2))}</p>`:line.trim()?`<p>${esc(line)}</p>`:'').join('')}</div><div class="source-note"><a href="${esc(d.url)}" target="_blank" rel="noreferrer">Open source file on GitHub ↗</a></div>`;
}

const initial=new URLSearchParams(location.search).get('q');if(initial){q.value=initial;setClear();performSearch();}
