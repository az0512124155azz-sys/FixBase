const MODEL = 'gemini-3.5-flash';

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function cleanJson(text) {
  const raw = String(text || '').trim().replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
  try { return JSON.parse(raw); } catch (_) {}
  const firstObj = raw.indexOf('{');
  const lastObj = raw.lastIndexOf('}');
  if (firstObj >= 0 && lastObj > firstObj) return JSON.parse(raw.slice(firstObj, lastObj + 1));
  const firstArr = raw.indexOf('[');
  const lastArr = raw.lastIndexOf(']');
  if (firstArr >= 0 && lastArr > firstArr) return JSON.parse(raw.slice(firstArr, lastArr + 1));
  throw new Error('Invalid JSON from Gemini');
}

async function gemini(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    const err = new Error('GEMINI_API_KEY is not configured');
    err.code = 'GEMINI_NOT_CONFIGURED';
    throw err;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 22000);
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.25,
          maxOutputTokens: 2200,
          responseMimeType: 'application/json'
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      const message = data?.error?.message || `Gemini request failed (${response.status})`;
      const err = new Error(message);
      err.code = 'GEMINI_API_ERROR';
      throw err;
    }

    const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
    if (!text) throw new Error('Gemini returned an empty response');
    return cleanJson(text);
  } finally {
    clearTimeout(timeout);
  }
}

function commonRules() {
  return `You are the search engine for FixBase, a Hebrew electronics repair guide site covering consumer electronic devices from 2010 onward.\nReturn ONLY valid JSON. Do not invent exact hardware facts when uncertain. Prefer real product/model names. Distinguish a symptom from a repair action. Write user-facing text in Hebrew, but keep official model names in their original spelling. Never provide instructions for bypassing activation locks, account security, anti-theft protections, or unauthorized access. For swollen batteries, exposed mains voltage, microwave high-voltage circuits, CRTs, refrigerant systems, medical devices, or other high-risk repairs, clearly recommend a qualified technician.`;
}

async function handleSuggest(query) {
  return gemini(`${commonRules()}\n\nMODE: AUTOCOMPLETE\nThe user typed: ${JSON.stringify(query)}\nReturn an object exactly shaped like:\n{"suggestions":[{"text":"...","type":"תקלה|פעולה|מכשיר|מערכת הפעלה","hint":"..."}]}\nGive 5-8 highly likely, concise Google-style completions. Put the closest completion first. Do not add explanations.`);
}

async function handleSearch(query) {
  return gemini(`${commonRules()}\n\nMODE: PROBLEM SEARCH\nUser query: ${JSON.stringify(query)}\nThe user has NOT selected their exact device yet. Interpret what they are trying to fix or do. Return 3-7 useful intents/results, not device-specific instructions yet.\nReturn exactly:\n{"interpreted":"short normalized interpretation","results":[{"title":"...","issue":"canonical issue/action","category":"device category or כללי","description":"one short sentence explaining what this result covers","difficulty":"קל|בינוני|מתקדם|משתנה","estimatedTime":"...","needsDevice":true}]}\nRank by likelihood. If the query already contains a model, still keep needsDevice true so the UI can confirm the exact device.`);
}

async function handleDevices(query, issue) {
  return gemini(`${commonRules()}\n\nMODE: DEVICE PICKER\nThe selected problem/action is: ${JSON.stringify(issue)}\nThe user is searching for their device with: ${JSON.stringify(query)}\nReturn real consumer device models from 2010 onward that best match the typed text. Do not output generic placeholders such as Standard/Pro/Max without a real product family.\nReturn exactly:\n{"devices":[{"brand":"...","model":"exact marketed model name","year":"YYYY or range if needed","category":"...","label":"brand + model","hint":"short disambiguation such as size/generation/model number when useful"}]}\nReturn up to 10 results. If the text is too vague, return likely families/models matching it rather than unrelated devices.`);
}

async function handleGuide(issue, device) {
  return gemini(`${commonRules()}\n\nMODE: DEVICE-SPECIFIC GUIDE\nSelected issue/action: ${JSON.stringify(issue)}\nSelected device: ${JSON.stringify(device)}\nCreate a careful, practical guide for this exact device and issue. If the exact internal layout, screw type, firmware path, or service procedure is uncertain, say what must be verified for the exact variant instead of inventing it. Start with non-destructive diagnostics before disassembly.\nReturn exactly:\n{"title":"...","summary":"2-3 sentences","difficulty":"קל|בינוני|מתקדם","estimatedTime":"...","tools":["..."],"warnings":["..."],"steps":[{"title":"...","details":"..."}],"whenToStop":"...","dataRisk":"none|low|medium|high"}\nGive 5-12 ordered steps. Keep each step practical and reasonably concise.`);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'METHOD_NOT_ALLOWED' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { return send(res, 400, { error: 'INVALID_JSON' }); }
  }
  body = body || {};
  const mode = String(body.mode || 'search');

  try {
    if (mode === 'suggest') {
      const query = String(body.query || '').trim();
      if (query.length < 2) return send(res, 200, { suggestions: [] });
      return send(res, 200, await handleSuggest(query));
    }
    if (mode === 'search') {
      const query = String(body.query || '').trim();
      if (!query) return send(res, 400, { error: 'QUERY_REQUIRED' });
      return send(res, 200, await handleSearch(query));
    }
    if (mode === 'devices') {
      const query = String(body.query || '').trim();
      const issue = String(body.issue || '').trim();
      if (!query || !issue) return send(res, 400, { error: 'QUERY_AND_ISSUE_REQUIRED' });
      return send(res, 200, await handleDevices(query, issue));
    }
    if (mode === 'guide') {
      const issue = String(body.issue || '').trim();
      const device = body.device || {};
      if (!issue || !device.model) return send(res, 400, { error: 'ISSUE_AND_DEVICE_REQUIRED' });
      return send(res, 200, await handleGuide(issue, device));
    }
    return send(res, 400, { error: 'UNKNOWN_MODE' });
  } catch (error) {
    console.error('FixBase Gemini error:', error);
    const status = error.code === 'GEMINI_NOT_CONFIGURED' ? 503 : 502;
    return send(res, status, {
      error: error.code || 'AI_SEARCH_FAILED',
      message: error.code === 'GEMINI_NOT_CONFIGURED'
        ? 'Gemini API is not configured on the server.'
        : 'Gemini search failed. Please try again.'
    });
  }
};
