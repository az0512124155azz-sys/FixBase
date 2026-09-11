const categories=[
['טלפונים','📱',['Apple','Samsung','Google','Xiaomi','OnePlus','Motorola','Nokia','Huawei','Sony','Nothing']],
['טאבלטים','▣',['Apple','Samsung','Lenovo','Microsoft','Huawei','Xiaomi','Amazon','Google','Asus','TCL']],
['מחשבים ניידים','▰',['Apple','Dell','HP','Lenovo','Asus','Acer','Microsoft','MSI','Razer','Samsung']],
['מחשבים נייחים','▥',['Dell','HP','Lenovo','Asus','Acer','MSI','Intel','Apple','Gigabyte','Custom PC']],
['קונסולות','🎮',['Sony','Microsoft','Nintendo','Valve','Asus','Lenovo']],
['טלוויזיות','▭',['Samsung','LG','Sony','TCL','Hisense','Philips','Panasonic','Xiaomi']],
['מסכים','▱',['Dell','LG','Samsung','Asus','Acer','BenQ','MSI','AOC']],
['מדפסות','▤',['HP','Canon','Epson','Brother','Samsung','Xerox','Lexmark','Ricoh']],
['ראוטרים ורשת','⌁',['TP-Link','Asus','Netgear','D-Link','Linksys','Ubiquiti','Eero','Google']],
['שעונים חכמים','◉',['Apple','Samsung','Google','Garmin','Fitbit','Huawei','Amazfit','Xiaomi']],
['אוזניות ושמע','♫',['Apple','Sony','Bose','Samsung','JBL','Sennheiser','Beats','Anker']],
['מצלמות','◌',['Canon','Nikon','Sony','Fujifilm','Panasonic','GoPro','DJI','Leica']],
['בית חכם','⌂',['Google','Amazon','Apple','Samsung','Philips Hue','Ring','Eufy','Aqara']],
['סטרימרים','▶',['Apple','Google','Amazon','Roku','Nvidia','Xiaomi']],
['רחפנים','✣',['DJI','Autel','Parrot','Skydio','Ryze','Fimi']],
['אביזרי מחשב','⌨',['Logitech','Razer','Corsair','SteelSeries','HyperX','Keychron','Microsoft','Apple']]
];

const issues=[
['לא נדלק','קל'],['לא נטען','קל'],['נכבה לבד','בינוני'],['מתחמם','בינוני'],['איטי מאוד','קל'],['קופא או נתקע','קל'],['מסך שחור','בינוני'],['מסך מהבהב','בינוני'],['אין תמונה','בינוני'],['אין קול','קל'],['Wi-Fi לא מתחבר','קל'],['Bluetooth לא עובד','קל'],['USB לא מזוהה','בינוני'],['עדכון נכשל','בינוני'],['איפוס להגדרות יצרן','קל'],['גיבוי מלא','קל'],['שחזור מגיבוי','בינוני'],['התקנה מחדש של מערכת הפעלה','מתקדם'],['Recovery לא עולה','מתקדם'],['Boot loop','בינוני'],['אחסון מלא','קל'],['סוללה נגמרת מהר','קל'],['החלפת סוללה','מתקדם'],['החלפת מסך','מתקדם'],['החלפת שקע טעינה','מתקדם'],['ניקוי פנימי','בינוני'],['נזק נוזלים — בדיקה ראשונית','בינוני'],['מצלמה לא עובדת','בינוני'],['מיקרופון לא עובד','בינוני'],['רמקול חלש','קל'],['כפתורים לא מגיבים','בינוני'],['לא מזוהה במחשב','בינוני'],['דרייבר חסר','קל'],['BIOS/UEFI לא עולה','מתקדם'],['SSD לא מזוהה','מתקדם'],['שגיאת Boot','מתקדם'],['מערכת קורסת','בינוני'],['אפליקציות קורסות','קל'],['חיבור HDMI לא עובד','בינוני'],['רשת איטית','קל'],['ניתוקים ברשת','קל'],['Factory reset','קל'],['עדכון Firmware','בינוני'],['שחזור Firmware','מתקדם'],['מאוורר רועש','בינוני'],['ניקוי אבק','בינוני'],['החלפת משחה תרמית','מתקדם'],['טמפרטורה גבוהה','בינוני'],['אין גישה לאינטרנט','קל'],['DNS לא עובד','קל'],['איפוס רשת','קל'],['איפוס סיסמה','קל'],['שחזור קבצים','מתקדם'],['העברת נתונים למכשיר חדש','קל'],['הגדרת מכשיר חדש','קל'],['התקנת דרייברים','קל'],['יצירת USB אתחול','בינוני'],['Dual Boot','מתקדם'],['Secure Boot בעייתי','מתקדם'],['TPM לא מזוהה','מתקדם'],['מצב בטוח / Safe Mode','קל'],['בדיקת אחריות לפני פירוק','קל'],['אבחון מלא לפני תיקון','בינוני'],['תחזוקה מונעת שנתית','קל']
];

const devices={
Apple:['iPhone 16 Pro Max','iPhone 16 Pro','iPhone 16','iPhone 15 Pro Max','iPhone 15 Pro','iPhone 15','iPhone 14 Pro Max','iPhone 14 Pro','iPhone 14','iPhone 13 Pro Max','iPhone 13 Pro','iPhone 13','iPhone 12 Pro Max','iPhone 12 Pro','iPhone 12','iPhone 11 Pro Max','iPhone 11 Pro','iPhone 11','iPhone XS','iPhone X','iPhone 8','iPad Pro 13','iPad Pro 12.9','iPad Air','MacBook Air M3','MacBook Air M2','MacBook Pro M3','MacBook Pro M2','Apple Watch Series 10','Apple Watch Ultra 2'],
Samsung:['Galaxy S25 Ultra','Galaxy S25+','Galaxy S25','Galaxy S24 Ultra','Galaxy S24+','Galaxy S24','Galaxy S23 Ultra','Galaxy S23+','Galaxy S23','Galaxy S22 Ultra','Galaxy S22','Galaxy S21 Ultra','Galaxy S21','Galaxy Note 20 Ultra','Galaxy A55','Galaxy A54','Galaxy A53','Galaxy Z Fold6','Galaxy Z Flip6','Galaxy Tab S10','Galaxy Watch7'],
Google:['Pixel 9 Pro XL','Pixel 9 Pro','Pixel 9','Pixel 8 Pro','Pixel 8','Pixel 7 Pro','Pixel 7','Pixel 6 Pro','Pixel 6','Pixel Tablet','Pixel Watch 3'],
Xiaomi:['Xiaomi 15 Ultra','Xiaomi 15','Xiaomi 14 Ultra','Xiaomi 14','Xiaomi 13','Redmi Note 14 Pro','Redmi Note 13 Pro','Redmi Note 12 Pro','Poco F6 Pro','Poco X6 Pro'],
Sony:['PlayStation 5 Pro','PlayStation 5 Slim','PlayStation 5','PlayStation 4 Pro','PlayStation 4 Slim','PlayStation 4','Xperia 1 VI','Xperia 5 V','Bravia XR'],
Microsoft:['Xbox Series X','Xbox Series S','Xbox One X','Xbox One S','Surface Pro 11','Surface Laptop 7','Surface Pro 9'],
Nintendo:['Nintendo Switch OLED','Nintendo Switch','Nintendo Switch Lite','Nintendo 3DS'],
Dell:['XPS 13','XPS 15','XPS 17','Inspiron 15','Latitude 7440','Alienware m16'],
HP:['Spectre x360','Envy x360','Pavilion 15','EliteBook 840','Victus 16','LaserJet Pro'],
Lenovo:['ThinkPad X1 Carbon','ThinkPad T14','Yoga 9i','Legion 5','IdeaPad 5','Tab P12'],
Asus:['ROG Zephyrus G14','ROG Strix G16','Zenbook 14','Vivobook 15','ROG Ally'],
Acer:['Swift Go 14','Aspire 5','Nitro 5','Predator Helios 16'],
LG:['OLED C4','OLED C3','OLED G4','UltraGear 27GR95QE'],
Canon:['EOS R5','EOS R6 Mark II','EOS R7','PIXMA G6020'],
Epson:['EcoTank ET-4850','EcoTank ET-2850','WorkForce Pro'],
DJI:['Mini 4 Pro','Air 3','Mavic 3 Pro','Avata 2','Osmo Action 5 Pro'],
Garmin:['Fenix 8','Fenix 7','Venu 3','Forerunner 965'],
OnePlus:['OnePlus 13','OnePlus 12','OnePlus 11','Nord 4'],
Motorola:['Razr 50 Ultra','Edge 50 Pro','Moto G85'],
Huawei:['Pura 70 Ultra','Mate 60 Pro','Watch GT 5'],
Nothing:['Phone (2)','Phone (2a)','Phone (1)']
};

const aliases=[
['אייפון','iPhone'],['גלקסי','Galaxy'],['פלייסטיישן','PlayStation'],['אקסבוקס','Xbox'],['ווינדוס','Windows'],['מקבוק','MacBook'],['פיקסל','Pixel'],['סמסונג','Samsung'],['אפל','Apple']
];

let activeCat=''; let currentPage=1; const pageSize=12; let selectedIssue=null; let lastMatches=[];
const count=1142400;
const q=document.getElementById('q'), year=document.getElementById('year'), difficulty=document.getElementById('difficulty');
const side=document.getElementById('side'), cats=document.getElementById('cats'), results=document.getElementById('results'), pager=document.getElementById('pager');
const resultTitle=document.getElementById('resultTitle'), resultSub=document.getElementById('resultSub'), guides=document.getElementById('guides');
const modal=document.getElementById('modal'), article=document.getElementById('article'), guideAside=document.getElementById('guideAside');

document.getElementById('catalogCount').innerHTML=count.toLocaleString('he-IL')+'<small>+</small>';
for(let y=2026;y>=2010;y--)year.insertAdjacentHTML('beforeend',`<option>${y}</option>`);

function normalize(v){let s=(v||'').toLowerCase().trim();for(const [a,b] of aliases)s=s.replaceAll(a.toLowerCase(),b.toLowerCase());return s.replace(/[–—-]/g,' ').replace(/\s+/g,' ')}
function guideTime(d){return d==='קל'?'10–25 דקות':d==='בינוני'?'25–60 דקות':'45–120 דקות'}
function renderSide(){side.innerHTML='<h3>קטגוריות</h3>'+categories.map(c=>`<button class="${activeCat===c[0]?'active':''}" onclick="pickCat('${c[0]}')"><span>${c[0]}</span><span class="n">${Math.round(count/categories.length).toLocaleString()}</span></button>`).join('')+'<hr><button onclick="pickCat(\'\')"><span>כל המכשירים</span><span class="n">'+count.toLocaleString()+'</span></button>'}
function renderCats(){cats.innerHTML=categories.map(c=>`<button class="cat" onclick="pickCat('${c[0]}')"><div class="ico">${c[1]}</div><b>${c[0]}</b><span>עיין במדריכי ${c[0]}</span></button>`).join('')}
function pickCat(name){activeCat=name;currentPage=1;renderSide();searchGuides();guides.scrollIntoView({behavior:'smooth'})}

function buildSuggestions(value){
 const n=normalize(value); if(!n)return [];
 const pool=[];
 issues.forEach(([issue,d])=>pool.push({type:'תקלה',label:issue,sub:d,value:issue}));
 categories.forEach(c=>c[2].forEach(brand=>pool.push({type:'יצרן',label:brand,sub:c[0],value:brand})));
 Object.entries(devices).forEach(([brand,list])=>list.forEach(model=>pool.push({type:'מכשיר',label:model,sub:brand,value:model})));
 ['התקנת Windows 11','התקנת Windows 10','התקנת macOS','התקנת Android מחדש','Factory reset','החלפת סוללה','החלפת מסך','חיבור HDMI לא עובד'].forEach(x=>pool.push({type:'מדריך',label:x,sub:'חיפוש נפוץ',value:x}));
 const words=n.split(' ');
 return pool.map(x=>{const t=normalize(x.label+' '+x.sub);let score=0;if(t.startsWith(n))score+=20;if(t.includes(n))score+=10;for(const w of words)if(t.includes(w))score+=2;return {...x,score}}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.label.length-b.label.length).slice(0,8);
}

function ensureSuggestBox(){
 let box=document.getElementById('suggestBox');
 if(!box){box=document.createElement('div');box.id='suggestBox';box.className='suggest-box';document.querySelector('.searchbox').appendChild(box)}
 return box;
}
function showSuggestions(){
 const box=ensureSuggestBox(), items=buildSuggestions(q.value);
 if(!items.length){box.classList.remove('open');box.innerHTML='';return}
 box.innerHTML=items.map((s,i)=>`<button type="button" data-i="${i}"><span class="suggest-icon">⌕</span><span><b>${highlight(s.label,q.value)}</b><small>${s.type} · ${s.sub}</small></span></button>`).join('');
 box.querySelectorAll('button').forEach((btn,i)=>btn.onclick=()=>{q.value=items[i].value;box.classList.remove('open');searchGuides()});
 box.classList.add('open');
}
function highlight(text,term){const n=term.trim();if(!n)return text;const i=text.toLowerCase().indexOf(n.toLowerCase());if(i<0)return text;return text.slice(0,i)+'<mark>'+text.slice(i,i+n.length)+'</mark>'+text.slice(i+n.length)}

function scoreIssue(issue,query){
 const hay=normalize(issue); const n=normalize(query); if(!n)return 1;
 let score=0; if(hay===n)score+=100;if(hay.startsWith(n))score+=40;if(hay.includes(n))score+=25;
 n.split(' ').forEach(w=>{if(w.length>1&&hay.includes(w))score+=8}); return score;
}
function searchGuides(){
 ensureSuggestBox().classList.remove('open');
 const query=q.value.trim(), yv=year.value, dv=difficulty.value;
 let arr=issues.map(([issue,diff])=>({issue,diff,score:scoreIssue(issue,query)})).filter(x=>(!dv||x.diff===dv)&&(!query||x.score>0));
 if(query&&!arr.length){
   const n=normalize(query); const deviceHit=[];
   Object.entries(devices).forEach(([brand,list])=>list.forEach(model=>{if(normalize(brand+' '+model).includes(n)||n.includes(normalize(model)))deviceHit.push(model)}));
   if(deviceHit.length)arr=issues.slice(0,24).map(([issue,diff])=>({issue,diff,score:1}));
 }
 arr.sort((a,b)=>b.score-a.score);
 lastMatches=arr; currentPage=1;
 resultTitle.textContent=query?`תוצאות עבור “${query}”`:(activeCat||'מדריכים אחרונים');
 resultSub.textContent=arr.length?`${arr.length} סוגי מדריכים נמצאו. בחר מדריך ולאחר מכן את המכשיר המדויק שלך.`:'לא נמצאה התאמה. נסה לכתוב תקלה כמו “לא נטען”, “מסך שחור” או “החלפת סוללה”.';
 renderResults(); guides.scrollIntoView({behavior:'smooth',block:'start'});
}
function renderResults(){
 const start=(currentPage-1)*pageSize, items=lastMatches.slice(start,start+pageSize);
 results.innerHTML=items.length?items.map((g,i)=>`<article class="guide" onclick="startDeviceFlow(${start+i})"><div class="thumb">🛠</div><div><h3>${g.issue}</h3><p>מדריך ${g.diff} · בשלב הבא תבחר את המכשיר המדויק שלך</p></div><div class="meta"><b>${g.diff}</b><span>${guideTime(g.diff)}</span><br><span class="badge">בחר מכשיר ←</span></div></article>`).join(''):'<div class="empty">לא נמצאו תוצאות. נסה ניסוח קצר יותר או בחר קטגוריה.</div>';
 const pages=Math.ceil(lastMatches.length/pageSize);pager.innerHTML=pages>1?Array.from({length:Math.min(pages,6)},(_,i)=>`<button class="${currentPage===i+1?'active':''}" onclick="goPage(${i+1})">${i+1}</button>`).join(''):'';
}
function goPage(p){currentPage=p;renderResults()}

function ensureDeviceModal(){
 let el=document.getElementById('deviceModal'); if(el)return el;
 el=document.createElement('div');el.id='deviceModal';el.className='modal device-modal';el.innerHTML=`<div class="panel device-panel"><div class="panelhead"><div><span class="eyebrow">שלב 2 מתוך 2</span><h2>איזה מכשיר יש לך?</h2><p id="deviceForIssue"></p></div><button class="x" onclick="closeDevicePicker()">×</button></div><div class="device-picker-body"><div class="device-search"><input id="deviceSearch" placeholder="חפש יצרן או דגם, לדוגמה: Galaxy S24 Ultra"><span>⌕</span></div><div class="device-filters"><select id="brandSelect"><option value="">כל היצרנים</option></select><select id="deviceYear"><option value="">כל השנים</option></select></div><div id="deviceResults" class="device-results"></div></div></div>`;document.body.appendChild(el);
 const brands=[...new Set(Object.keys(devices))].sort();brandSelect.innerHTML+brands.map(b=>`<option>${b}</option>`).join('');for(let y=2026;y>=2010;y--)deviceYear.insertAdjacentHTML('beforeend',`<option>${y}</option>`);
 deviceSearch.addEventListener('input',renderDeviceResults);brandSelect.addEventListener('change',renderDeviceResults);deviceYear.addEventListener('change',renderDeviceResults);return el;
}
function startDeviceFlow(index){selectedIssue=lastMatches[index];const el=ensureDeviceModal();document.getElementById('deviceForIssue').textContent=`בחר את הדגם המדויק עבור המדריך: ${selectedIssue.issue}`;document.getElementById('deviceSearch').value='';document.getElementById('brandSelect').value='';document.getElementById('deviceYear').value=year.value||'';renderDeviceResults();el.classList.add('open');document.body.style.overflow='hidden';setTimeout(()=>document.getElementById('deviceSearch').focus(),80)}
function closeDevicePicker(){document.getElementById('deviceModal')?.classList.remove('open');document.body.style.overflow=''}
function renderDeviceResults(){
 const term=normalize(document.getElementById('deviceSearch').value), brandFilter=document.getElementById('brandSelect').value, y=document.getElementById('deviceYear').value;
 let rows=[];Object.entries(devices).forEach(([brand,list])=>{if(brandFilter&&brand!==brandFilter)return;list.forEach(model=>{const hay=normalize(brand+' '+model);if(term&&!hay.includes(term)&&!term.split(' ').every(w=>hay.includes(w)))return;rows.push({brand,model,year:y||guessYear(model)})})});
 rows=rows.slice(0,60);document.getElementById('deviceResults').innerHTML=rows.length?rows.map((d,i)=>`<button class="device-row" onclick="selectDevice('${esc(d.brand)}','${esc(d.model)}','${d.year}')"><span class="device-logo">${d.brand.charAt(0)}</span><span><b>${d.model}</b><small>${d.brand} · ${d.year||'שנה לא צוינה'}</small></span><span class="choose">בחר ←</span></button>`).join(''):'<div class="empty">לא מצאנו את הדגם. נסה לכתוב רק חלק משם הדגם או לבחור יצרן.</div>';
}
function guessYear(model){const map=[['16',2024],['15',2023],['14',2022],['13',2021],['12',2020],['11',2019],['S25',2025],['S24',2024],['S23',2023],['S22',2022],['S21',2021],['Pixel 9',2024],['Pixel 8',2023],['Pixel 7',2022],['PlayStation 5',2020],['Series X',2020]];for(const [k,y] of map)if(model.includes(k))return y;return 2024}
function esc(v){return v.replace(/'/g,"\\'")}
function selectDevice(brand,model,yr){closeDevicePicker();openGuide({brand,model,year:yr,issue:selectedIssue.issue,diff:selectedIssue.diff})}

function openGuide(g){
 article.innerHTML=`<h1>${g.issue} — ${g.model}</h1><div class="sub">${g.brand} · ${g.model} · ${g.year} · מדריך ${g.diff}</div><div class="warning"><b>לפני שמתחילים:</b> גבה מידע חשוב. אם יש סוללה נפוחה, ריח חריג, עשן, נזק מים משמעותי או מתח רשת — אל תמשיך בפירוק עצמאי.</div><div class="steps"><div class="step"><b>אמת את הדגם</b>בדוק בהגדרות או על תווית המכשיר שהדגם הוא ${g.model}. מדריכי פירוק וחלקים יכולים להשתנות בין גרסאות.</div><div class="step"><b>בצע בדיקה בסיסית</b>הפעל מחדש, נתק אביזרים חיצוניים ובדוק כבלים, מטען, שקע או חיבור אחר הרלוונטי לתקלה.</div><div class="step"><b>בודד את מקור התקלה</b>בדוק אם “${g.issue}” נובע מתוכנה, הגדרה, ספק כוח, חיבור או רכיב פיזי לפני החלפת חלקים.</div><div class="step"><b>נסה פתרון תוכנה בטוח</b>עדכן תוכנה/קושחה רק ממקור רשמי. הימנע מאיפוס או התקנה מחדש לפני גיבוי.</div><div class="step"><b>בדוק את התוצאה</b>חזור על הפעולה שגרמה לתקלה. אם הבעיה ממשיכה, עבור למדריך שירות מדויק לדגם לפני פירוק.</div></div>`;
 guideAside.innerHTML=`<div class="asidecard"><h4>פרטי המכשיר</h4><ul><li>${g.brand}</li><li>${g.model}</li><li>${g.year}</li></ul></div><div class="asidecard"><h4>פרטי המדריך</h4><ul><li>קושי: ${g.diff}</li><li>זמן: ${guideTime(g.diff)}</li><li>בעיה: ${g.issue}</li></ul></div>`;
 modal.classList.add('open');document.body.style.overflow='hidden';
}
function closeGuide(){modal.classList.remove('open');document.body.style.overflow=''}
function quick(v){q.value=v;showSuggestions();searchGuides()}
function focusSearch(){q.focus();showSuggestions()}

q.addEventListener('input',showSuggestions);
q.addEventListener('focus',showSuggestions);
q.addEventListener('keydown',e=>{if(e.key==='Enter')searchGuides();if(e.key==='Escape')ensureSuggestBox().classList.remove('open')});
document.addEventListener('click',e=>{if(!e.target.closest('.searchbox'))ensureSuggestBox().classList.remove('open')});

renderSide();renderCats();lastMatches=issues.slice(0,24).map(([issue,diff])=>({issue,diff,score:1}));renderResults();
