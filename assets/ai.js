/* 마음기록 도우미 — DARKCODE AI API 어댑터
 * ------------------------------------------------------------
 * 화면에는 '마음기록 도우미'로만 노출하고, 실제 호출은 DARKCODE AI API 구성을 그대로 사용합니다.
 *  - builtin   : DARKCODE 기본 엔진 (Firebase AI Logic · Gemini). 키 없이 동작, 브라우저당 하루 80회
 *  - openai    : DARKCODE 게이트웨이 / OpenAI 호환 /chat/completions (스트리밍)
 *  - gemini    : Google Gemini API (스트리밍)
 *  - anthropic : Anthropic Messages API (스트리밍)
 *  - custom    : 사용자 정의 엔드포인트 POST {task, system, messages} → {text|output|content|answer}
 * 설정 우선순위: config.js(window.MAEUM_ENV) < 설정창 저장값. API 키는 Store.Vault(암호화)에만 보관합니다.
 */
const MaeumAI = (() => {
  /* DARKCODE AI 기본 엔진 (공개 웹 구성값 — 비밀키 아님, App Check로 도메인 보호) */
  const DARKCODE_BUILTIN = {
    apiKey: 'AIzaSyD1G6lSAy_eZc1OSmWH3O_LdTHsoqYL61s',
    projectId: 'gen-lang-client-0643590356',
    appId: '1:471038977855:web:69f94a97a5d92421a0558a',
    authDomain: 'gen-lang-client-0643590356.firebaseapp.com',
    recaptchaSiteKey: '6LfjwyAuAAAAAPgeZpZq1XBa_dWix4ajJDP_cxLN',
    sdk: '13.4.0',
    model: 'gemini-3.5-flash-lite',
    dailyCap: 80,
  };

  const MODES = {
    builtin: { label: '기본 엔진 (키 없이 바로 사용)', needsKey: false, needsEndpoint: false, defaultModel: DARKCODE_BUILTIN.model },
    openai: { label: '업무 비서 게이트웨이 (OpenAI 호환)', needsKey: true, needsEndpoint: true, defaultModel: 'gpt-4o-mini', endpointHint: 'https://your-gateway.example.com/v1' },
    gemini: { label: 'Gemini API 키 직접 연결', needsKey: true, needsEndpoint: false, defaultModel: 'gemini-2.5-flash' },
    anthropic: { label: 'Claude API 키 직접 연결', needsKey: true, needsEndpoint: false, defaultModel: 'claude-sonnet-4-5' },
    custom: { label: '사용자 정의 엔드포인트 (JSON)', needsKey: false, needsEndpoint: true, defaultModel: '', endpointHint: 'https://example.com/api/assistant' },
  };

  /* ---------- 페르소나 (시스템 프롬프트) ---------- */
  const PERSONA = `당신은 '마음기록 도우미'입니다. 현장 사회복지사의 행정·기록 업무를 곁에서 돕는 세심하고 따뜻한 동료 비서입니다.

[태도]
- 바쁜 현장 사회복지사의 수고를 존중하고, 공감적이면서도 전문적으로 응대합니다.
- 사용자와 대화할 때는 정중한 존댓말(~해요/~습니다)을 씁니다.

[기록·문서 작성 원칙]
- 사례기록·상담일지는 객관적인 사실 중심으로, 간결한 개조식 문체(~함, ~임, ~하였음)로 작성합니다.
- 공문·보고서는 행정 문서 문체(~하고자 합니다, ~바랍니다)와 번호 체계(1. 가. 1) 가))를 따릅니다.
- 관찰 사실(클라이언트 진술, 관찰 내용)과 사회복지사의 의견·사정(평가)을 구분해서 씁니다. 클라이언트 진술은 따옴표로 인용합니다.
- 입력에 없는 사실, 수치, 날짜, 이름을 지어내지 않습니다. 빠진 정보는 [확인 필요]로 표시합니다.
- 낙인·비하 표현을 피하고 강점관점과 인권 감수성을 반영한 용어를 씁니다. (예: '결손가정' 대신 '한부모가정')
- 의학적 진단·법률 판단은 단정하지 않고, 필요하면 전문가 연계·확인을 권고합니다.
- 개인정보는 최소한으로 다룹니다. 실명·연락처·주소가 보이면 결과물에서는 가명(예: 대상자A)으로 바꾸고 마지막에 짧게 알려 드립니다.

[출력 형식]
- 한국어로 답합니다. 제목은 '## ', 소제목은 '### ', 목록은 '- '를 사용하고, 필요할 때만 표(| |)를 씁니다.
- 결과물 앞뒤에 불필요한 인사말이나 장황한 설명을 붙이지 않습니다. 마지막에 '확인해 주세요' 항목이 있으면 1~3줄로만 덧붙입니다.`;

  /* ---------- 실무 기능별 프롬프트 ---------- */
  const TASKS = {
    memo: {
      name: '상담 메모 정리',
      build: (f) => `아래 현장 메모를 체계적인 '상담 일지'로 정리해 주세요.

[기본 정보]
- 상담일자: ${f.date || '[확인 필요]'}
- 상담 유형: ${f.type || '[확인 필요]'}
- 대상자 표기: ${f.client || '대상자A (가명)'}
- 상담자: ${f.worker || '[확인 필요]'}

[현장 메모]
${f.memo}

[작성 형식]
## 상담 일지
### 1. 기본 정보 (표: 상담일자 / 상담 유형 / 대상자 / 상담자 / 상담 장소)
### 2. 상담 내용 (주호소, 대상자 진술, 관찰 내용을 구분해 개조식으로)
### 3. 사회복지사 의견 및 사정 (욕구·강점·위험요인)
### 4. 개입 내용 및 향후 계획 (실행 주체·시기 포함)
### 5. 특이사항 및 확인 필요 사항`,
    },
    report: {
      name: '활동 보고서 초안',
      build: (f) => `아래 정보를 바탕으로 '프로그램 활동 결과보고서' 초안을 작성해 주세요.

- 프로그램명: ${f.title || '[확인 필요]'}
- 일시·장소: ${f.when || '[확인 필요]'}
- 대상 및 참여 인원: ${f.target || '[확인 필요]'}
- 목적·목표: ${f.goal || '[확인 필요]'}
- 진행 내용: ${f.content || '[확인 필요]'}
- 성과·특이사항·만족도: ${f.result || '[확인 필요]'}

[작성 형식]
## 프로그램 활동 결과보고서
### 1. 사업 개요 (표: 프로그램명 / 일시 / 장소 / 대상 / 참여 인원 / 담당자)
### 2. 추진 목적 및 목표
### 3. 세부 진행 내용 (회기 또는 단계별)
### 4. 추진 결과 및 성과 (양적 성과 / 질적 성과)
### 5. 참여자 반응 및 만족도
### 6. 평가 및 개선 방안
### 7. 향후 계획
입력에 없는 수치는 만들지 말고 [확인 필요]로 남겨 주세요.`,
    },
    summary: {
      name: '문서 요약',
      build: (f) => {
        const style = {
          brief: '핵심 내용 3줄 요약 + 꼭 기억할 숫자·날짜',
          detail: '개조식 상세 요약 (배경 / 주요 내용 / 결정 사항 / 후속 조치)',
          todo: '해야 할 일과 기한, 담당, 제출 서류만 표로 추출',
        }[f.style] || '핵심 요약';
        return `다음 문서를 '${style}' 형식으로 정리해 주세요. 문서 제목: ${f.title || '(제목 없음)'}

[문서 본문]
${f.text}

[작성 형식]
## 요약: (문서 제목)
### 핵심 내용
### 주요 일정·기한 (있을 때만)
### 해야 할 일 (있을 때만, 담당·기한 포함)
원문에 없는 내용은 추가하지 마세요.`;
      },
    },
    privacy: {
      name: '개인정보 점검',
      build: (f) => `아래 사례 기록을 외부 공유(사례회의·보고·슈퍼비전) 전에 개인정보 관점에서 점검해 주세요.
${f.localFindings ? `\n[자동 1차 탐지 결과 — 참고용]\n${f.localFindings}\n` : ''}
[점검할 기록]
${f.text}

[작성 형식]
## 개인정보 점검 결과
### 1. 발견된 개인정보 (표: 구분 / 원문 표현 / 위험도(높음·중간·낮음) / 권장 처리)
   - 구분 예: 성명, 주민등록번호, 연락처, 주소, 학교·직장, 가족관계, 건강·장애·수급 등 민감정보, 특정 가능 정보
### 2. 가명 처리 초안
   - 성명은 대상자A·B, 가족은 '모(母)', '자녀1' 형식, 연락처·주소·번호는 ○ 또는 * 로 가려 전체 본문을 다시 작성
### 3. 공유 전 확인 사항 (동의 여부, 최소 공유 원칙 등 2~3줄)`,
    },
    polish: {
      name: '문장 다듬기',
      build: (f) => `다음 기록을 사례기록·행정 문서에 맞는 객관적이고 깔끔한 문체로 다듬어 주세요. 내용은 바꾸지 말고, 사실과 의견을 구분해 주세요.

${f.text}`,
    },
    sns: {
      name: 'SNS 홍보글',
      build: (f) => {
        const want = f.platform || 'all';
        const parts = [];
        if (want === 'all' || want === 'instagram') parts.push(`## 인스타그램 게시글
- 첫 줄: 스크롤을 멈추게 하는 한 문장
- 본문: 300~600자, 짧은 문단과 줄바꿈, 이모지는 2~4개만
- 해시태그: 10~15개 (#사회복지 포함, 지역·활동 태그)`);
        if (want === 'all' || want === 'tiktok') parts.push(`## 틱톡·쇼츠 영상 대본 (15~30초)
- 표: 장면(초) / 화면 / 자막 / 내레이션
- 끝에 영상 설명 한 줄 + 해시태그 5개`);
        if (want === 'all' || want === 'youtube') parts.push(`## 유튜브 제목·설명
- 제목 후보 3개 (40자 이내)
- 설명 3~5줄 + 태그 8개`);
        return `아래 복지관 활동을 SNS에 올릴 홍보 콘텐츠로 만들어 주세요.

- 활동명: ${f.title || '[확인 필요]'}
- 활동 내용: ${f.text || '[확인 필요]'}
- 분위기: ${f.tone || '따뜻하고 다정하게'}
- 기관·계정명: ${f.org || '(없음)'}

[원칙]
- 실명·연락처·주소·학교명 등 개인정보를 쓰지 말고 '참여자', '어르신' 등으로 표현합니다.
- 동정을 유발하는 시혜적 표현 대신 참여자의 강점과 주체성을 보여 줍니다.
- 입력에 없는 수치나 사실은 만들지 않습니다.
- 게시글 본문은 SNS 말투(부드러운 해요체)로 씁니다.

[작성 형식]
${parts.join('\n\n')}

## 게시 전 확인
- 촬영·게시 동의, 얼굴·실명 노출, 위치 정보 등 2~3줄`;
      },
    },
    chat: { name: '자유 대화', build: (f) => f.text },
  };

  /* ---------- 설정 ---------- */
  const SETTINGS_KEY = 'maeum.ai.settings';
  function getSettings() {
    const env = window.MAEUM_ENV || {};
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); } catch (e) {}
    const mode = saved.mode || env.DARKCODE_API_MODE || 'builtin';
    return {
      mode: MODES[mode] ? mode : 'builtin',
      endpoint: saved.endpoint ?? env.DARKCODE_API_ENDPOINT ?? '',
      model: saved.model ?? env.DARKCODE_MODEL ?? '',
      temperature: saved.temperature ?? 0.4,
    };
  }
  function saveSettings(s) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ mode: s.mode, endpoint: s.endpoint || '', model: s.model || '', temperature: s.temperature ?? 0.4 }));
  }
  async function getKey(mode) { return (await Store.Vault.get('ai-key-' + mode)) || (window.MAEUM_ENV || {}).DARKCODE_API_KEY || ''; }
  async function setKey(mode, key) { await Store.Vault.set('ai-key-' + mode, key || ''); }
  async function hasKey(mode) { return Store.Vault.has('ai-key-' + mode); }

  /* ---------- 하루 사용량 (기본 엔진) ---------- */
  const today = () => new Date().toISOString().slice(0, 10);
  function usage() {
    try { const u = JSON.parse(localStorage.getItem('maeum.ai.usage') || '{}'); return u.d === today() ? u.n : 0; } catch (e) { return 0; }
  }
  function bump() { localStorage.setItem('maeum.ai.usage', JSON.stringify({ d: today(), n: usage() + 1 })); }

  /* ---------- 오류 ---------- */
  class AIError extends Error { constructor(msg, status) { super(msg); this.status = status; } }
  async function readError(res) {
    let raw = '';
    try { raw = await res.text(); } catch (e) {}
    let msg = raw;
    try { const j = JSON.parse(raw); msg = j.error?.message || j.message || j.error || raw; } catch (e) {}
    const s = res.status;
    if (s === 401 || s === 403) return new AIError('연결 키를 확인해 주세요. (인증 실패 ' + s + ')', s);
    if (s === 429) return new AIError('요청이 잠시 몰렸어요. 1분 정도 뒤에 다시 시도해 주세요.', s);
    if (s === 404) return new AIError('엔드포인트 주소나 모델 이름을 다시 확인해 주세요. (404)', s);
    return new AIError(`도우미 연결 중 문제가 생겼어요. (${s}) ${String(msg).slice(0, 160)}`, s);
  }

  /* ---------- 스트리밍 ---------- */
  async function* sseLines(res) {
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i).replace(/\r$/, '');
        buf = buf.slice(i + 1);
        if (line.startsWith('data:')) yield line.slice(5).trim();
      }
    }
    const rest = buf.trim();
    if (rest.startsWith('data:')) yield rest.slice(5).trim();
  }
  async function streamParse(res, extract, onToken) {
    let out = '';
    for await (const data of sseLines(res)) {
      if (!data || data === '[DONE]') continue;
      let j; try { j = JSON.parse(data); } catch (e) { continue; }
      if (j.error) throw new AIError(j.error.message || '응답 처리 중 오류가 발생했어요.');
      const piece = extract(j);
      if (piece) { out += piece; onToken && onToken(piece, out); }
    }
    return out;
  }

  /* ---------- App Check (기본 엔진) ---------- */
  let appCheckGetter = null;
  async function appCheckToken() {
    if (!appCheckGetter) {
      const C = DARKCODE_BUILTIN;
      const [{ initializeApp, getApps }, ac] = await Promise.all([
        import(`https://www.gstatic.com/firebasejs/${C.sdk}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${C.sdk}/firebase-app-check.js`),
      ]);
      const app = getApps().find((a) => a.name === 'darkcode') || initializeApp({ apiKey: C.apiKey, projectId: C.projectId, appId: C.appId, authDomain: C.authDomain }, 'darkcode');
      const inst = ac.initializeAppCheck(app, { provider: new ac.ReCaptchaEnterpriseProvider(C.recaptchaSiteKey), isTokenAutoRefreshEnabled: true });
      appCheckGetter = async () => (await ac.getToken(inst, false)).token;
    }
    return appCheckGetter();
  }

  const toGemini = (msgs) => msgs.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));

  /* ---------- 엔진별 호출 ---------- */
  async function callEngine({ system, messages, onToken, signal, task }) {
    const s = getSettings();
    const mode = s.mode;
    const def = MODES[mode];
    const model = s.model || def.defaultModel;
    const temperature = Number(s.temperature) || 0.4;
    const key = def.needsKey || mode === 'custom' ? await getKey(mode) : '';
    if (def.needsKey && !key) throw new AIError('설정에서 연결 키를 먼저 입력해 주세요.');
    if (def.needsEndpoint && !s.endpoint) throw new AIError('설정에서 엔드포인트 주소를 먼저 입력해 주세요.');

    const doFetch = async (url, init) => {
      try { return await fetch(url, { ...init, signal }); }
      catch (e) {
        if (e.name === 'AbortError') throw e;
        throw new AIError('도우미 서버에 연결하지 못했어요. 인터넷 연결 또는 엔드포인트(CORS 허용 여부)를 확인해 주세요.');
      }
    };

    if (mode === 'builtin' || mode === 'gemini') {
      let url; const headers = { 'Content-Type': 'application/json' };
      if (mode === 'builtin') {
        const C = DARKCODE_BUILTIN;
        if (usage() >= C.dailyCap) throw new AIError(`오늘 기본 엔진 사용량(${C.dailyCap}회)을 모두 썼어요. 내일 다시 쓰거나 설정에서 다른 연결을 추가해 주세요.`, 429);
        url = `https://firebasevertexai.googleapis.com/v1beta/projects/${C.projectId}/models/${model}:streamGenerateContent?alt=sse`;
        headers['x-goog-api-key'] = C.apiKey;
        headers['X-Firebase-AppId'] = C.appId;
        try { const tk = await appCheckToken(); if (tk) headers['X-Firebase-AppCheck'] = tk; } catch (e) { console.warn('appcheck', e); }
      } else {
        url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`;
        headers['x-goog-api-key'] = key;
      }
      const body = { contents: toGemini(messages), systemInstruction: { parts: [{ text: system }] }, generationConfig: { temperature, maxOutputTokens: 8192 } };
      const res = await doFetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
      if (!res.ok) throw await readError(res);
      if (mode === 'builtin') bump();
      return streamParse(res, (j) => (j.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join(''), onToken);
    }

    if (mode === 'openai') {
      const base = s.endpoint.replace(/\/+$/, '').replace(/\/chat\/completions$/, '');
      const msgs = [{ role: 'system', content: system }].concat(messages);
      const res = await doFetch(`${base}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({ model, messages: msgs, stream: true, temperature }),
      });
      if (!res.ok) throw await readError(res);
      return streamParse(res, (j) => j.choices?.[0]?.delta?.content || '', onToken);
    }

    if (mode === 'anthropic') {
      const res = await doFetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify({ model, system, messages, max_tokens: 4096, temperature, stream: true }),
      });
      if (!res.ok) throw await readError(res);
      return streamParse(res, (j) => (j.type === 'content_block_delta' ? j.delta?.text || '' : ''), onToken);
    }

    if (mode === 'custom') {
      const headers = { 'Content-Type': 'application/json' };
      if (key) headers.Authorization = `Bearer ${key}`;
      const res = await doFetch(s.endpoint, { method: 'POST', headers, body: JSON.stringify({ task, system, messages, model: model || undefined }) });
      if (!res.ok) throw await readError(res);
      const ct = res.headers.get('content-type') || '';
      let text;
      if (ct.includes('application/json')) {
        const j = await res.json();
        text = j.text || j.output || j.content || j.answer || j.result || j.choices?.[0]?.message?.content || JSON.stringify(j);
      } else text = await res.text();
      onToken && onToken(text, text);
      return text;
    }
    throw new AIError('알 수 없는 연결 방식이에요.');
  }

  /* ---------- 공개 API ---------- */
  async function run({ task = 'chat', fields = {}, history = [], onToken, signal }) {
    const t = TASKS[task] || TASKS.chat;
    const userText = t.build(fields);
    const messages = history.concat([{ role: 'user', content: userText }]);
    return callEngine({ system: PERSONA, messages, onToken, signal, task });
  }
  async function test() {
    const out = await callEngine({ system: PERSONA, messages: [{ role: 'user', content: '연결 확인입니다. "연결되었어요" 한 문장만 답해 주세요.' }], task: 'test' });
    return out.trim();
  }
  function engineLabel() {
    const s = getSettings();
    return MODES[s.mode].label.replace(/ \(.*\)$/, '');
  }

  return { MODES, TASKS, PERSONA, getSettings, saveSettings, getKey, setKey, hasKey, run, test, usage, engineLabel, dailyCap: DARKCODE_BUILTIN.dailyCap };
})();
