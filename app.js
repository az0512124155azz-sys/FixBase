const q = document.getElementById('q');
const results = document.getElementById('results');
const resultTitle = document.getElementById('resultTitle');
const resultSub = document.getElementById('resultSub');
const guides = document.getElementById('guides');
const modal = document.getElementById('modal');
const article = document.getElementById('article');
const guideAside = document.getElementById('guideAside');

let activeRequest = 0;
let selectedIssue = '';
let selectedDevice = null;
let suggestTimer = null;
let deviceTimer = null;
const suggestionCache = new Map();
const deviceCache = new Map();

const fallbackSuggestions = [
  'לא נטען', 'לא נדלק', 'מסך שחור', 'מתחמם', 'החלפת סוללה',
  'החלפת מסך', 'אין Wi-Fi', 'אין קול', 'התקנת Windows 11',
  'איפוס להגדרות יצרן', 'עדכון Firmware נכשל', 'Boot loop'
];

function escapeHtml(value='') {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}

async function api(payload) {
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'החיפוש נכשל');
    error.code = data.error || 'REQUEST_FAILED';
    throw error;
  }
  return data;
}

function ensureSuggestBox() {
  let box = document.getElementById('suggestBox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'suggestBox';
    box.className = 'suggest-box';
    document.querySelector('.searchbox').appendChild(box);
  }
  return box;
}

function renderSuggestionRows(items, loading=false) {
  const box = ensureSuggestBox();
  if (!items.length && !loading) {
    box.classList.remove('open');
    box.innerHTML = '';
    return;
  }

  const rows = items.map((item, i) => {
    const text = typeof item === 'string' ? item : item.text;
    const type = typeof item === 'string' ? 'חיפוש נפוץ' : (item.type || 'הצעה');
    const hint = typeof item === 'string' ? '' : (item.hint || '');
    return `<button type="button" class="suggest-row" data-index="${i}">
      <span class="suggest-glass">⌕</span>
      <span class="suggest-copy"><b>${escapeHtml(text)}</b><small>${escapeHtml(type)}${hint ? ' · '+escapeHtml(hint) : ''}</small></span>
    </button>`;
  }).join('');

  box.innerHTML = rows + (loading ? '<div class="suggest-loading">Gemini מחפש הצעות…</div>' : '');
  box.classList.add('open');
  box.querySelectorAll('.suggest-row').forEach((button, i) => {
    button.addEventListener('click', () => {
      const item = items[i];
      q.value = typeof item === 'string' ? item : item.text;
      box.classList.remove('open');
      searchGuides();
    });
  });
}

async function requestSuggestions() {
  const value = q.value.trim();
  if (value.length < 2) {
    const common = value ? fallbackSuggestions.filter(x => x.includes(value)).slice(0,6) : fallbackSuggestions.slice(0,6);
    renderSuggestionRows(common);
    return;
  }

  const key = value.toLowerCase();
  if (suggestionCache.has(key)) {
    renderSuggestionRows(suggestionCache.get(key));
    return;
  }

  const local = fallbackSuggestions.filter(x => x.toLowerCase().includes(key)).slice(0,4);
  renderSuggestionRows(local, true);
  const requestId = ++activeRequest;
  try {
    const data = await api({mode:'suggest', query:value});
    if (requestId !== activeRequest) return;
    const items = Array.isArray(data.suggestions) ? data.suggestions.slice(0,8) : [];
    suggestionCache.set(key, items);
    renderSuggestionRows(items.length ? items : local);
  } catch (_) {
    if (requestId === activeRequest) renderSuggestionRows(local.length ? local : fallbackSuggestions.slice(0,6));
  }
}

q.addEventListener('input', () => {
  clearTimeout(suggestTimer);
  suggestTimer = setTimeout(requestSuggestions, 320);
});
q.addEventListener('focus', requestSuggestions);
q.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    ensureSuggestBox().classList.remove('open');
    searchGuides();
  }
});
document.addEventListener('click', e => {
  if (!e.target.closest('.searchbox')) ensureSuggestBox().classList.remove('open');
});

function renderLoading(title='Gemini מחפש…', sub='מנסה להבין בדיוק מה אתה רוצה לתקן') {
  resultTitle.textContent = title;
  resultSub.textContent = sub;
  results.innerHTML = `<div class="ai-loading"><span></span><span></span><span></span></div>`;
}

function renderError(error) {
  const notConfigured = error.code === 'GEMINI_NOT_CONFIGURED';
  resultTitle.textContent = notConfigured ? 'Gemini עדיין לא מחובר לשרת' : 'החיפוש לא הצליח';
  resultSub.textContent = notConfigured
    ? 'צריך להגדיר GEMINI_API_KEY בסביבת האחסון. המפתח לא נשמר בקוד הציבורי.'
    : 'נסה שוב בעוד רגע או נסח את החיפוש בצורה קצרה יותר.';
  results.innerHTML = `<div class="search-error"><b>${notConfigured ? 'חיבור API נדרש' : 'שגיאת חיפוש'}</b><p>${escapeHtml(error.message || '')}</p></div>`;
}

async function searchGuides() {
  const query = q.value.trim();
  if (!query) {
    q.focus();
    renderSuggestionRows(fallbackSuggestions.slice(0,8));
    return;
  }

  ensureSuggestBox().classList.remove('open');
  renderLoading();
  guides.scrollIntoView({behavior:'smooth', block:'start'});
  const requestId = ++activeRequest;

  try {
    const data = await api({mode:'search', query});
    if (requestId !== activeRequest) return;
    const items = Array.isArray(data.results) ? data.results : [];
    resultTitle.textContent = data.interpreted ? `הבנתי: ${data.interpreted}` : `תוצאות עבור “${query}”`;
    resultSub.textContent = 'בחר את התוצאה שמתארת את מה שאתה רוצה לעשות. אחר כך נחפש את המכשיר המדויק שלך.';

    if (!items.length) {
      results.innerHTML = '<div class="empty">Gemini לא מצא כוונה מספיק ברורה. נסה לכתוב מה המכשיר עושה, למשל “לא נטען” או “מסך שחור”.</div>';
      return;
    }

    results.innerHTML = items.map((item, i) => `<button class="intent-card" type="button" data-index="${i}">
      <span class="intent-icon">${iconFor(item.category, item.issue)}</span>
      <span class="intent-main"><strong>${escapeHtml(item.title || item.issue)}</strong><small>${escapeHtml(item.description || '')}</small><em>${escapeHtml(item.category || 'כללי')}</em></span>
      <span class="intent-meta"><b>${escapeHtml(item.difficulty || 'משתנה')}</b><small>${escapeHtml(item.estimatedTime || '')}</small><span>בחר מכשיר ←</span></span>
    </button>`).join('');

    results.querySelectorAll('.intent-card').forEach((button, i) => {
      button.addEventListener('click', () => openDevicePicker(items[i]));
    });
  } catch (error) {
    if (requestId === activeRequest) renderError(error);
  }
}

function iconFor(category='', issue='') {
  const t = `${category} ${issue}`.toLowerCase();
  if (t.includes('טלפון') || t.includes('iphone') || t.includes('android')) return '📱';
  if (t.includes('מחשב') || t.includes('windows') || t.includes('mac')) return '💻';
  if (t.includes('קונסול') || t.includes('playstation') || t.includes('xbox')) return '🎮';
  if (t.includes('טלוויז')) return '📺';
  if (t.includes('מדפסת')) return '🖨️';
  if (t.includes('רשת') || t.includes('wifi')) return '📡';
  if (t.includes('סוללה') || t.includes('טעינה')) return '🔋';
  if (t.includes('מסך')) return '▣';
  return '🔧';
}

function openDevicePicker(item) {
  selectedIssue = item.issue || item.title || q.value.trim();
  selectedDevice = null;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.panel').classList.add('device-panel');
  article.innerHTML = `<div class="device-step">
    <span class="step-kicker">שלב 2 מתוך 3</span>
    <h1>איזה מכשיר יש לך?</h1>
    <p>בחר את הדגם המדויק כדי שלא תקבל הוראות שמתאימות למכשיר אחר.</p>
    <div class="selected-problem">הבעיה שבחרת: <b>${escapeHtml(selectedIssue)}</b></div>
    <div class="device-searchbox">
      <span>⌕</span>
      <input id="deviceQ" autocomplete="off" placeholder="לדוגמה: iPhone 13 Pro, Galaxy S23 Ultra, Dell XPS 13…">
    </div>
    <div id="deviceStatus" class="device-status">התחל להקליד שם יצרן או דגם.</div>
    <div id="deviceResults" class="device-results"></div>
  </div>`;
  guideAside.innerHTML = `<div class="asidecard"><h4>למה צריך דגם מדויק?</h4><p>ברגים, סוללות, מסכים, תפריטי Recovery וגרסאות Firmware משתנים בין דגמים.</p></div>`;

  const input = document.getElementById('deviceQ');
  input.focus();
  input.addEventListener('input', () => {
    clearTimeout(deviceTimer);
    deviceTimer = setTimeout(() => searchDevices(input.value), 330);
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') searchDevices(input.value);
  });
}

async function searchDevices(value) {
  const query = String(value || '').trim();
  const status = document.getElementById('deviceStatus');
  const list = document.getElementById('deviceResults');
  if (!status || !list) return;

  if (query.length < 2) {
    status.textContent = 'כתוב לפחות 2 תווים.';
    list.innerHTML = '';
    return;
  }

  const cacheKey = `${selectedIssue}|${query.toLowerCase()}`;
  status.innerHTML = '<span class="mini-spinner"></span> Gemini מחפש דגמים אמיתיים…';
  list.innerHTML = '';

  try {
    let items;
    if (deviceCache.has(cacheKey)) {
      items = deviceCache.get(cacheKey);
    } else {
      const data = await api({mode:'devices', query, issue:selectedIssue});
      items = Array.isArray(data.devices) ? data.devices.slice(0,10) : [];
      deviceCache.set(cacheKey, items);
    }

    status.textContent = items.length ? `${items.length} התאמות` : 'לא נמצאו דגמים. נסה שם יצרן + דגם.';
    list.innerHTML = items.map((device, i) => `<button class="device-result" type="button" data-index="${i}">
      <span class="device-brand">${escapeHtml((device.brand || '?').slice(0,2).toUpperCase())}</span>
      <span><b>${escapeHtml(device.label || `${device.brand || ''} ${device.model || ''}`)}</b><small>${escapeHtml(device.category || '')}${device.year ? ' · '+escapeHtml(device.year) : ''}${device.hint ? ' · '+escapeHtml(device.hint) : ''}</small></span>
      <span class="device-choose">זה המכשיר שלי ←</span>
    </button>`).join('');

    list.querySelectorAll('.device-result').forEach((button, i) => {
      button.addEventListener('click', () => loadGuide(items[i]));
    });
  } catch (error) {
    status.textContent = error.code === 'GEMINI_NOT_CONFIGURED' ? 'Gemini לא מחובר לשרת.' : 'לא הצלחתי לחפש מכשירים כרגע.';
    list.innerHTML = '';
  }
}

async function loadGuide(device) {
  selectedDevice = device;
  article.innerHTML = `<div class="guide-loading"><span class="step-kicker">שלב 3 מתוך 3</span><h1>בונה מדריך ל־${escapeHtml(device.label || device.model)}</h1><p>Gemini מתאים את הבדיקות והשלבים למכשיר שבחרת.</p><div class="ai-loading"><span></span><span></span><span></span></div></div>`;
  guideAside.innerHTML = '';

  try {
    const guide = await api({mode:'guide', issue:selectedIssue, device});
    renderGuide(guide, device);
  } catch (error) {
    article.innerHTML = `<div class="search-error"><b>לא הצלחתי ליצור את המדריך</b><p>${escapeHtml(error.message || 'נסה שוב.')}</p><button onclick="closeGuide()">סגור</button></div>`;
  }
}

function renderGuide(guide, device) {
  const warnings = Array.isArray(guide.warnings) ? guide.warnings : [];
  const steps = Array.isArray(guide.steps) ? guide.steps : [];
  const tools = Array.isArray(guide.tools) ? guide.tools : [];

  article.innerHTML = `
    <span class="step-kicker">מדריך מותאם למכשיר</span>
    <h1>${escapeHtml(guide.title || `${selectedIssue} — ${device.label || device.model}`)}</h1>
    <p class="guide-summary">${escapeHtml(guide.summary || '')}</p>
    ${warnings.length ? `<div class="warning"><b>לפני שמתחילים</b>${warnings.map(x=>`<p>${escapeHtml(x)}</p>`).join('')}</div>` : ''}
    <div class="steps">${steps.map(step => `<div class="step"><b>${escapeHtml(step.title || '')}</b><p>${escapeHtml(step.details || '')}</p></div>`).join('')}</div>
    ${guide.whenToStop ? `<div class="stop-card"><b>מתי לעצור</b><p>${escapeHtml(guide.whenToStop)}</p></div>` : ''}`;

  guideAside.innerHTML = `
    <div class="asidecard"><h4>המכשיר</h4><b>${escapeHtml(device.label || device.model)}</b><p>${escapeHtml(device.year || '')}</p></div>
    <div class="asidecard"><h4>פרטי מדריך</h4><p><b>רמה:</b> ${escapeHtml(guide.difficulty || '')}</p><p><b>זמן:</b> ${escapeHtml(guide.estimatedTime || '')}</p><p><b>סיכון לנתונים:</b> ${escapeHtml(guide.dataRisk || '')}</p></div>
    ${tools.length ? `<div class="asidecard"><h4>כלים</h4><ul>${tools.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></div>` : ''}`;
}

function closeGuide() {
  modal.classList.remove('open');
  modal.querySelector('.panel').classList.remove('device-panel');
  document.body.style.overflow = '';
}

function quick(value) {
  q.value = value;
  searchGuides();
}

function focusSearch() {
  q.focus();
  q.scrollIntoView({behavior:'smooth', block:'center'});
}

window.searchGuides = searchGuides;
window.quick = quick;
window.focusSearch = focusSearch;
window.closeGuide = closeGuide;

results.innerHTML = `
  <div class="welcome-search">
    <h3>איך זה עובד?</h3>
    <div class="flow-row"><span>1</span><p><b>חפש בעיה או פעולה</b><small>לדוגמה: “לא נטען”, “החלפת מסך”, “התקנת Windows”.</small></p></div>
    <div class="flow-row"><span>2</span><p><b>בחר את המכשיר המדויק</b><small>Gemini יחפש יצרן ודגם אמיתי.</small></p></div>
    <div class="flow-row"><span>3</span><p><b>קבל מדריך מותאם</b><small>רק אחרי שהמכשיר אושר.</small></p></div>
  </div>`;
