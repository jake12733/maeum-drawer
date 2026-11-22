/* 마음서랍 — 사회복지사 서류 보관함 & 업무 비서 */
(() => {
  'use strict';

  /* =========================================================
   * 0. 유틸
   * ========================================================= */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = (p = 'id') => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  const now = () => Date.now();
  const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const dotDate = (t = Date.now()) => { const d = new Date(t); return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`; };

  const ICONS = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    folder: '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>',
    folderPlus: '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/><path d="M12 10v6M9 13h6"/>',
    file: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6"/>',
    fileText: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    unlock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
    settings: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    more: '<circle cx="12" cy="5" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="12" cy="19" r="1.2"/>',
    pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
    trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    chevR: '<path d="m9 18 6-6-6-6"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    listChecks: '<path d="m3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>',
    chart: '<path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/>',
    bulb: '<path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
    move: '<path d="M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1"/><path d="M2 13h10M9 16l3-3-3-3"/>',
    tag: '<path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l8.59-8.59a1 1 0 0 0 0-1.41Z"/><circle cx="7" cy="7" r="1.5"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    archive: '<rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M12 11h4M12 16h4M8 11h.01M8 16h.01"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    printer: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    wand: '<path d="m15 4 5 5M3 21l11-11M14 3l.8 1.8L16.6 5.6l-1.8.8L14 8.2l-.8-1.8-1.8-.8 1.8-.8z"/>',
    sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 3v4M17 5h4"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    pin: '<path d="M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',
    grad: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    sprout: '<path d="M7 20h10M12 20v-8M12 12c0-4-3-6-7-6 0 4 3 6 7 6zM12 12c0-3 2-6 7-6 0 4-3 6-7 6z"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    youtube: '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    tiktok: '<path d="M9 12a4 4 0 1 0 4 4V3c.5 2.5 2.5 4.5 5 5"/>',
    external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>',
  };
  const icon = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  const helperAva = (size = '') => `<span class="helper-ava ${size}"><svg viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M12 20.5c-5.2-3.7-8.5-6.9-8.5-10.4A4.6 4.6 0 0 1 12 7.6a4.6 4.6 0 0 1 8.5 2.5c0 3.5-3.3 6.7-8.5 10.4z"/><path d="M17.8 2.5l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z" opacity=".9"/></svg></span>`;

  const BRAND_SVG = `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M11 17h18v12a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3z" fill="#FAF8F5"/><rect x="9" y="11" width="22" height="6.5" rx="2.2" fill="#FAF8F5"/><path d="M20 29c-3.3-2.4-5.2-4.2-5.2-6.2a2.6 2.6 0 0 1 5.2-.7 2.6 2.6 0 0 1 5.2.7c0 2-1.9 3.8-5.2 6.2z" fill="#E07A5F"/></svg>`;
  const HERO_ART = `<svg class="hero-art" viewBox="0 0 210 150" aria-hidden="true">
    <ellipse cx="112" cy="144" rx="96" ry="6" fill="#3B3226" opacity=".06"/>
    <rect x="70" y="34" width="34" height="34" rx="4" fill="#fff" stroke="#E2DBD1" transform="rotate(-9 87 51)"/>
    <path d="M78 44h18M78 50h14M78 56h16" stroke="#C9D9CD" stroke-width="2.4" stroke-linecap="round" transform="rotate(-9 87 51)"/>
    <rect x="98" y="28" width="36" height="40" rx="4" fill="#FBEDE8" stroke="#F0D6CC" transform="rotate(7 116 48)"/>
    <path d="M106 40h20M106 47h15" stroke="#F0B9A8" stroke-width="2.4" stroke-linecap="round" transform="rotate(7 116 48)"/>
    <rect x="62" y="56" width="98" height="88" rx="13" fill="#5B8A72"/>
    <rect x="70" y="64" width="82" height="34" rx="8" fill="#FAF8F5"/>
    <rect x="70" y="104" width="82" height="32" rx="8" fill="#FAF8F5"/>
    <rect x="99" y="78" width="24" height="6" rx="3" fill="#C9B8A3"/>
    <rect x="99" y="117" width="24" height="6" rx="3" fill="#C9B8A3"/>
    <path d="M176 40c-6.5-4.7-10.5-8.4-10.5-12.4a5.2 5.2 0 0 1 10.5-1.5 5.2 5.2 0 0 1 10.5 1.5c0 4-4 7.7-10.5 12.4z" fill="#E07A5F"/>
    <circle cx="160" cy="18" r="3" fill="#F2C14E"/><circle cx="192" cy="54" r="2.4" fill="#A9C9B3"/>
    <rect x="18" y="114" width="32" height="30" rx="7" fill="#E07A5F"/>
    <path d="M34 114c0-14-10-22-16-30 10 2 17 12 16 30zM34 114c0-18 8-30 18-36-1 14-8 26-18 36zM34 114c-2-10 0-20 2-26 4 8 2 18-2 26z" fill="#4A7C59"/>
  </svg>`;
  const EMPTY_ART = `<svg class="e-art" viewBox="0 0 96 96" aria-hidden="true"><circle cx="48" cy="50" r="40" fill="#F3EEE6"/><path d="M22 36a4 4 0 0 1 4-4h14l5 5h25a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4z" fill="#C9DCCF"/><path d="M22 44h52v25a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4z" fill="#5B8A72"/><path d="M48 66c-4.6-3.3-7.4-5.9-7.4-8.7a3.7 3.7 0 0 1 7.4-1 3.7 3.7 0 0 1 7.4 1c0 2.8-2.8 5.4-7.4 8.7z" fill="#FAF8F5"/></svg>`;

  const CATS = {
    general: { name: '일반서류', desc: '공문, 행정 양식, 자격·경력 증빙, 운영 규정을 보관해요.', icon: 'archive' },
    activity: { name: '활동서류', desc: '상담 일지, 사례관리 기록, 프로그램 기획·결과보고서, 현장 활동지를 모아요.', icon: 'clipboard' },
    edu: { name: '교육', desc: '보수교육, 자격·시험, 직무교육, 슈퍼비전처럼 배우고 성장하는 자료를 모아요.', icon: 'grad', lounge: true },
    info: { name: '정보', desc: '법령·지침, 처우·인건비, 지원사업, 자주 쓰는 사이트 같은 현장 정보를 모아요.', icon: 'info', lounge: true },
    act: { name: '활동', desc: '현장 활동 소식, 자원봉사·지역연계, SNS 홍보, 행사·캠페인을 기록하고 나눠요.', icon: 'sprout', lounge: true },
  };
  const DOC_CATS = ['general', 'activity'];
  const LOUNGE_CATS = ['edu', 'info', 'act'];

  /* =========================================================
   * 1. 상태 & 저장
   * ========================================================= */
  let S = null;
  let route = { view: 'home' };
  let prevRoute = { view: 'home' };
  const ui = { sort: 'updated', aiOpen: false, aiTab: 'search' };
  let saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => Store.saveState(S).catch((e) => toast('저장 중 문제가 생겼어요: ' + e.message, { type: 'warn' })), 120);
  }

  function seed() {
    const t0 = now() - 1000 * 60 * 60 * 24 * 20;
    const st = { version: 1, folders: [], docs: [], checklists: [], settings: { userName: '', pinHash: '', pinSalt: '', autoLockMin: 0 } };
    const mk = (cat, name, parentId = null) => { const f = { id: uid('f'), cat, name, parentId, createdAt: t0 }; st.folders.push(f); return f; };
    Object.entries(SEED_FOLDERS).forEach(([cat, names]) => names.forEach((n) => mk(cat, n)));
    SEED_SUBFOLDERS.forEach((s) => { const p = st.folders.find((f) => f.cat === s.category && f.name === s.parent && !f.parentId); if (p) s.names.forEach((n) => mk(s.category, n, p.id)); });
    const fid = (cat, name) => (st.folders.find((f) => f.cat === cat && f.name === name && !f.parentId) || {}).id || null;
    TEMPLATES.forEach((t, i) => st.docs.push({
      id: uid('d'), kind: 'note', name: t.name, ext: 'txt', mime: 'text/plain', size: new Blob([t.body]).size,
      cat: t.category, folderId: fid(t.category, t.folder), tags: t.tags.slice(), favorite: true, template: true,
      desc: t.desc, tplIcon: t.icon, tplId: t.id, content: t.body, createdAt: t0 + i * 1000, updatedAt: t0 + i * 1000,
    }));
    SEED_NOTES.forEach((n, i) => st.docs.push({
      id: uid('d'), kind: 'note', name: n.name, ext: 'txt', mime: 'text/plain', size: new Blob([n.content]).size,
      cat: n.category, folderId: fid(n.category, n.folder), tags: n.tags.slice(), favorite: !!n.favorite, template: false,
      content: n.content, createdAt: now() - 1000 * 60 * 60 * (30 - i * 20), updatedAt: now() - 1000 * 60 * 60 * (30 - i * 20),
    }));
    SEED_CHECKLISTS.forEach((c) => st.checklists.push({ id: uid('c'), title: c.title, items: c.items.map((text, i) => ({ id: uid('i'), text, done: c.done.includes(i) })) }));
    addLounge(st);
    return st;
  }
  // 데모·예시 자료 정리 (2026-11-22 요청)
  function cleanDemo(st) {
    if (st.demoCleaned) return;
    const demoNames = ['개인정보 보호 업무 체크 (예시)', '초기상담_대상자A (예시)', '활동 소식 작성 예시 (원예교실)'];
    st.docs = st.docs.filter((d) => !(d.kind === 'note' && demoNames.includes(d.name)));
    const cl = st.checklists.find((c) => c.title === '신규 사례관리 대상자 접수');
    if (cl && cl.items.length === 5 && cl.items[0].done && cl.items[1].done && !cl.items.slice(2).some((i) => i.done)) cl.items.forEach((i) => (i.done = false));
    st.docs.forEach((d) => {
      if (d.kind !== 'note' || !d.content) return;
      if (d.tplId === 'tpl-sns-post') d.content = d.content.replace('■ 플랫폼 : □ 인스타그램  □ 틱톡  □ 유튜브(쇼츠)', '■ 플랫폼 : □ 네이버 블로그  □ 인스타그램  □ 기타(        )');
      if (d.name === 'SNS 홍보 전 체크리스트') d.content = d.content.replace('인스타그램·틱톡·유튜브에 활동을 올리기 전에', '네이버 블로그·인스타그램 등 SNS에 활동을 올리기 전에');
    });
    st.demoCleaned = true;
  }
  function cleanAiText(st) {
    if (st.aiTextFixed) return;
    st.docs.forEach((d) => { if (d.kind === 'note' && d.name === 'SNS 홍보 전 체크리스트' && d.content) d.content = d.content.replace('□ 마음기록 도우미 ‘SNS 홍보’로 캡션을 만들고, ‘개인정보 점검’으로 한 번 더 확인했나요?', '□ ‘SNS로 공유’ 창의 개인정보 자동 점검 결과를 확인했나요?'); });
    st.aiTextFixed = true;
  }
  function addLounge(st) {
    if (st.seedLounge || typeof LOUNGE === 'undefined') return;
    const t0 = now() - 1000 * 60 * 60 * 3;
    const ensure = (cat, name) => { let f = st.folders.find((x) => x.cat === cat && x.name === name && !x.parentId); if (!f) { f = { id: uid('f'), cat, name, parentId: null, createdAt: t0 }; st.folders.push(f); } return f.id; };
    Object.entries(LOUNGE.folders).forEach(([cat, names]) => names.forEach((n) => ensure(cat, n)));
    LOUNGE.notes.forEach((n, i) => st.docs.push({ id: uid('d'), kind: 'note', name: n.name, ext: 'txt', mime: 'text/plain', size: new Blob([n.content]).size, cat: n.cat, folderId: ensure(n.cat, n.folder), tags: n.tags.slice(), favorite: !!n.favorite, template: !!n.template, tplIcon: n.tplIcon, tplId: n.tplId, desc: n.desc, content: n.content, createdAt: t0 + i * 1000, updatedAt: t0 + i * 1000 }));
    LOUNGE.links.forEach((l, i) => st.docs.push({ id: uid('d'), kind: 'link', name: l.name, url: l.url, platform: 'web', ext: '', mime: '', size: null, cat: l.cat, folderId: ensure(l.cat, l.folder), tags: l.tags.slice(), favorite: false, template: false, createdAt: t0 + i * 900, updatedAt: t0 + i * 900 }));
    if (LOUNGE.checklist) st.checklists.push({ id: uid('c'), title: LOUNGE.checklist.title, items: LOUNGE.checklist.items.map((text) => ({ id: uid('i'), text, done: false })) });
    st.seedLounge = true;
  }
  function migrate(st) {
    st.folders ||= []; st.docs ||= []; st.checklists ||= [];
    st.settings = Object.assign({ userName: '', pinHash: '', pinSalt: '', autoLockMin: 0 }, st.settings || {});
    st.docs.forEach((d) => { d.tags ||= []; d.folderId ??= null; });
    st.social ||= {};
    if (!Array.isArray(st.social.list)) {
      const oldIg = typeof st.social.instagram === 'string' ? st.social.instagram : '';
      st.social = { list: [{ id: 'naver', type: 'naver', fixed: true }, { id: 'instagram', type: 'instagram', fixed: true, ...(oldIg ? { handle: oldIg } : {}) }] };
    }
    addLounge(st);
    cleanDemo(st);
    cleanAiText(st);
    return st;
  }

  /* ---------- 조회 ---------- */
  const folderById = (id) => S.folders.find((f) => f.id === id);
  const docById = (id) => S.docs.find((d) => d.id === id);
  const kids = (cat, pid) => S.folders.filter((f) => f.cat === cat && (f.parentId || null) === (pid || null)).sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  const docsIn = (cat, fid) => S.docs.filter((d) => d.cat === cat && (d.folderId || null) === (fid || null));
  function descendantIds(fid) { const out = [fid]; S.folders.filter((f) => f.parentId === fid).forEach((c) => out.push(...descendantIds(c.id))); return out; }
  const countDeep = (fid) => { const ids = new Set(descendantIds(fid)); return S.docs.filter((d) => ids.has(d.folderId)).length; };
  function folderPath(fid) { const p = []; let f = folderById(fid); let guard = 0; while (f && guard++ < 50) { p.unshift(f); f = folderById(f.parentId); } return p; }
  const pathLabel = (d) => [CATS[d.cat]?.name, ...folderPath(d.folderId).map((f) => f.name)].filter(Boolean).join(' › ');
  const topFolderByName = (cat, name) => S.folders.find((f) => f.cat === cat && f.name === name && !f.parentId);

  /* ---------- 파일 형식 ---------- */
  const extOf = (name) => { const m = /\.([a-z0-9]{1,6})$/i.exec(name || ''); return m ? m[1].toLowerCase() : ''; };
  function ftype(d) {
    if (d.kind === 'note') return { cls: 'note', label: '' };
    if (d.kind === 'link') return { cls: { youtube: 'yt', instagram: 'ig', tiktok: 'tt', naver: 'nv' }[d.platform] || 'web', label: d.platform === 'naver' ? 'N' : '', icon: { youtube: 'youtube', instagram: 'instagram', tiktok: 'tiktok' }[d.platform] || 'link' };
    const e = d.ext || extOf(d.name);
    if (e === 'pdf') return { cls: 'pdf', label: 'PDF' };
    if (['hwp', 'hwpx'].includes(e)) return { cls: 'hwp', label: 'HWP' };
    if (['doc', 'docx', 'rtf', 'odt'].includes(e)) return { cls: 'doc', label: 'DOC' };
    if (['xls', 'xlsx', 'csv', 'ods'].includes(e)) return { cls: 'xls', label: e === 'csv' ? 'CSV' : 'XLS' };
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'heic'].includes(e) || (d.mime || '').startsWith('image/')) return { cls: 'img', label: 'IMG' };
    if (['txt', 'md'].includes(e)) return { cls: 'note', label: 'TXT' };
    return { cls: 'etc', label: (e || 'FILE').toUpperCase().slice(0, 4) };
  }
  const ftypeBadge = (d) => { const t = ftype(d); return `<span class="ftype ${t.cls}">${t.label || icon(t.icon || 'fileText')}</span>`; };
  const fmtSize = (n) => (n == null ? '-' : n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB` : `${(n / 1048576).toFixed(1)} MB`);
  function fmtDate(t) {
    const d = new Date(t); const diff = (now() - t) / 1000;
    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    if (t >= today.getTime()) return `오늘 ${hm}`;
    if (t >= today.getTime() - 86400000) return `어제 ${hm}`;
    return dotDate(t);
  }

  /* =========================================================
   * 2. 공통 UI: 토스트 / 모달 / 메뉴 / 확인창
   * ========================================================= */
  function toast(msg, { type = 'ok', action, ms = 3200 } = {}) {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `${icon(type === 'ok' ? 'check' : 'heart')}<span>${esc(msg)}</span>`;
    if (action) { const b = document.createElement('button'); b.textContent = action.label; b.onclick = () => { action.fn(); el.remove(); }; el.appendChild(b); }
    $('#toastRoot').appendChild(el);
    setTimeout(() => { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, action ? ms + 2500 : ms);
  }

  const modals = [];
  let zTop = 60;
  const bringFront = (el) => { el.style.zIndex = String(++zTop); };
  function openModal({ title, sub = '', body = '', foot = '', size = '', onClose, headExtra = '', bodyClass = '' }) {
    const back = document.createElement('div');
    back.className = 'modal-back';
    back.innerHTML = `<div class="modal ${size}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <div class="modal-head">${headExtra}<div style="flex:1;min-width:0"><h3>${esc(title)}</h3>${sub ? `<p>${sub}</p>` : ''}</div><button class="icon-btn sm" data-close aria-label="닫기">${icon('x')}</button></div>
      <div class="modal-body ${bodyClass}">${body}</div>${foot ? `<div class="modal-foot">${foot}</div>` : ''}</div>`;
    const m = { el: back, onClose, close: async (force) => {
      if (!force && m.beforeClose && !(await m.beforeClose())) return;
      back.remove(); const i = modals.indexOf(m); if (i >= 0) modals.splice(i, 1); m.onClose && m.onClose();
    } };
    back.addEventListener('mousedown', (e) => { m._downOnBack = e.target === back; });
    back.addEventListener('click', (e) => { if (e.target === back && m._downOnBack) m.close(); if (e.target.closest('[data-close]')) m.close(); });
    $('#modalRoot').appendChild(back);
    bringFront(back);
    modals.push(m);
    setTimeout(() => { const f = back.querySelector('[autofocus], .modal-body input:not([type=hidden]), .modal-body textarea'); f && f.focus(); }, 30);
    return m;
  }
  function confirmBox(msg, { title = '확인해 주세요', ok = '확인', danger = false, cancel = '취소' } = {}) {
    return new Promise((resolve) => {
      let done = false;
      const m = openModal({ title, body: `<p style="margin:0;color:#4F5558;white-space:pre-line">${esc(msg)}</p>`,
        foot: `<button class="btn ghost" data-close>${esc(cancel)}</button><button class="btn ${danger ? 'danger' : 'primary'}" data-ok autofocus>${esc(ok)}</button>`,
        onClose: () => { if (!done) resolve(false); } });
      m.el.querySelector('[data-ok]').onclick = () => { done = true; resolve(true); m.close(true); };
      setTimeout(() => m.el.querySelector('[data-ok]').focus(), 40);
    });
  }
  function promptBox(title, { label = '', value = '', placeholder = '', ok = '확인', sub = '' } = {}) {
    return new Promise((resolve) => {
      let done = false;
      const m = openModal({ title, sub, body: `<label class="field"><span>${esc(label)}</span><input class="input" id="pbInput" value="${esc(value)}" placeholder="${esc(placeholder)}" maxlength="60" /></label>`,
        foot: `<button class="btn ghost" data-close>취소</button><button class="btn primary" data-ok>${esc(ok)}</button>`,
        onClose: () => { if (!done) resolve(null); } });
      const inp = m.el.querySelector('#pbInput');
      const submit = () => { const v = inp.value.trim(); if (!v) { inp.focus(); inp.classList.add('shake'); setTimeout(() => inp.classList.remove('shake'), 400); return; } done = true; resolve(v); m.close(true); };
      m.el.querySelector('[data-ok]').onclick = submit;
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.isComposing) submit(); });
      setTimeout(() => { inp.focus(); inp.select(); }, 40);
    });
  }

  let openMenuEl = null;
  function closeMenu() { if (openMenuEl) { openMenuEl.remove(); openMenuEl = null; } }
  function openMenu(anchor, items) {
    closeMenu();
    const m = document.createElement('div');
    m.className = 'menu';
    items.forEach((it) => {
      if (it === '-') { m.appendChild(document.createElement('hr')); return; }
      const b = document.createElement('button');
      if (it.danger) b.className = 'danger';
      b.innerHTML = `${icon(it.icon || 'chevR')}<span>${esc(it.label)}</span>`;
      b.onclick = (e) => { e.stopPropagation(); closeMenu(); it.fn(); };
      m.appendChild(b);
    });
    document.body.appendChild(m);
    const r = anchor.getBoundingClientRect();
    const mw = m.offsetWidth, mh = m.offsetHeight;
    let left = r.right - mw; if (left < 8) left = Math.min(r.left, innerWidth - mw - 8);
    let top = r.bottom + 6; if (top + mh > innerHeight - 8) top = Math.max(8, r.top - mh - 6);
    m.style.left = `${left}px`; m.style.top = `${top}px`;
    openMenuEl = m;
  }
  document.addEventListener('mousedown', (e) => { if (openMenuEl && !openMenuEl.contains(e.target)) closeMenu(); });

  /* ---------- 폴더 선택 옵션 ---------- */
  function folderOptions(cat, fid) {
    let h = '';
    for (const c of Object.keys(CATS)) {
      h += `<optgroup label="${CATS[c].name}"><option value="${c}:" ${c === cat && !fid ? 'selected' : ''}>${CATS[c].name} (맨 위)</option>`;
      const walk = (pid, depth) => kids(c, pid).forEach((f) => { h += `<option value="${c}:${f.id}" ${f.id === fid ? 'selected' : ''}>${'\u3000'.repeat(depth)}└ ${esc(f.name)}</option>`; walk(f.id, depth + 1); });
      walk(null, 1);
      h += '</optgroup>';
    }
    return h;
  }
  const parseLoc = (v) => { const [cat, id] = String(v).split(':'); return { cat, folderId: id || null }; };
  function currentLoc() {
    if (route.view === 'folder') return { cat: route.cat, folderId: route.folderId || null };
    return null;
  }
  function pickFolder(title, { cat = 'activity', folderId = null, ok = '여기에 보관하기', sub = '' } = {}) {
    return new Promise((resolve) => {
      let done = false;
      const m = openModal({ title, sub, body: `<label class="field"><span>보관할 위치</span><select class="select" id="pfSel">${folderOptions(cat, folderId)}</select></label>`,
        foot: `<button class="btn ghost" data-close>취소</button><button class="btn primary" data-ok>${esc(ok)}</button>`, onClose: () => { if (!done) resolve(null); } });
      m.el.querySelector('[data-ok]').onclick = () => { done = true; resolve(parseLoc(m.el.querySelector('#pfSel').value)); m.close(true); };
    });
  }

  /* =========================================================
   * 3. 라우팅
   * ========================================================= */
  function toHash(r) {
    switch (r.view) {
      case 'folder': return `#/f/${r.cat}${r.folderId ? '/' + r.folderId : ''}`;
      case 'fav': return '#/favorites';
      case 'recent': return '#/recent';
      case 'templates': return '#/templates';
      case 'checklist': return '#/checklist';
      case 'social': return '#/social';
      case 'search': return `#/search?q=${encodeURIComponent(r.q || '')}`;
      default: return '#/home';
    }
  }
  function parseHash() {
    const h = location.hash.replace(/^#\/?/, '');
    if (h.startsWith('search')) return { view: 'search', q: decodeURIComponent((h.split('?q=')[1] || '')) };
    const [p, a, b] = h.split('/');
    if (p === 'f' && CATS[a]) return { view: 'folder', cat: a, folderId: b || null };
    if (p === 'favorites') return { view: 'fav' };
    if (p === 'recent') return { view: 'recent' };
    if (p === 'templates') return { view: 'templates' };
    if (p === 'checklist') return { view: 'checklist' };
    if (p === 'social') return { view: 'social' };
    return { view: 'home' };
  }
  function go(r, replace = false) {
    if (r.view !== 'search' && route.view !== 'search') prevRoute = route;
    const h = toHash(r);
    document.body.classList.remove('nav-open');
    if (replace || h === location.hash) { history.replaceState(null, '', h); route = r; renderAll(); }
    else location.hash = h;
  }
  window.addEventListener('hashchange', () => { route = parseHash(); if (route.view !== 'search') $('#searchInput').value = ''; renderAll(); $('#main').scrollIntoView({ block: 'start' }); });

  /* =========================================================
   * 4. 사이드바
   * ========================================================= */
  function renderSidebar() {
    const favCount = S.docs.filter((d) => d.favorite).length;
    const tplCount = S.docs.filter((d) => d.template).length;
    const clDone = S.checklists.reduce((a, c) => a + c.items.filter((i) => i.done).length, 0);
    const clAll = S.checklists.reduce((a, c) => a + c.items.length, 0);
    const curPath = route.view === 'folder' ? folderPath(route.folderId).map((f) => f.id) : [];
    const tree = (cat, pid) => {
      const fs = kids(cat, pid);
      if (!fs.length) return '';
      return `<div class="tree">${fs.map((f) => {
        const active = route.view === 'folder' && route.folderId === f.id;
        const open = curPath.includes(f.id);
        return `<button class="tree-item ${active ? 'active' : ''}" data-act="go-folder" data-cat="${cat}" data-id="${f.id}">${icon('folder', 'sm')}<span>${esc(f.name)}</span></button>${open ? tree(cat, f.id) : ''}`;
      }).join('')}</div>`;
    };
    const nav = (view, ico, label, count) => `<button class="nav-item ${route.view === view ? 'active' : ''}" data-act="go" data-view="${view}">${icon(ico)}<span>${label}</span>${count != null ? `<span class="count">${count}</span>` : ''}</button>`;
    const catItem = (cat) => {
      const active = route.view === 'folder' && route.cat === cat && !route.folderId;
      const n = S.docs.filter((d) => d.cat === cat).length;
      return `<div class="cat-row"><button class="nav-item ${active ? 'active' : ''}" data-act="go-folder" data-cat="${cat}"><span class="cat-ico ${cat}">${icon(CATS[cat].icon, 'sm')}</span><span>${CATS[cat].name}</span><span class="count">${n}</span></button><button class="cat-add" data-act="cat-new-folder" data-cat="${cat}" title="${CATS[cat].name}에 새 폴더" aria-label="${CATS[cat].name}에 새 폴더">${icon('folderPlus', 'sm')}</button></div>${tree(cat, null)}`;
    };
    $('#sidebar').innerHTML = `
      <button class="brand" data-act="go" data-view="home" aria-label="마음기록 홈"><img class="brand-logo" src="assets/logo-maeum-128.png" alt="마음기록 로고" width="46" height="46" /><span><b>마음기록</b><small class="brand-en">Case Management and Activity System</small></span></button>
      ${nav('home', 'home', '오늘의 서랍')}
      ${nav('fav', 'star', '즐겨찾기', favCount)}
      ${nav('recent', 'clock', '최근 문서')}
      ${nav('templates', 'layout', '양식 템플릿', tplCount)}
      ${nav('checklist', 'listChecks', '구비 서류 체크', `${clDone}/${clAll}`)}
      ${nav('social', 'share', 'SNS 연동', socialCount() ? `${socialCount()}개 연결` : null)}
      <div class="nav-label"><span>서류 보관함</span></div>
      ${catItem('general')}
      ${catItem('activity')}
      <div class="nav-label"><span>사회복지사 라운지</span></div>
      ${catItem('edu')}
      ${catItem('info')}
      ${catItem('act')}
      <div class="side-card">
        <h4>${helperAva()} 마음기록 도우미</h4>
        <p>궁금한 건 인터넷에서 찾아 알려 드리고, 홍보용 사진도 만들어 드려요.</p>
        <button class="btn accent sm block" data-act="ai-open" data-tab="search">${icon('sparkle', 'sm')} 도우미 부르기</button>
      </div>
      <div class="side-foot">
        <button class="nav-item" data-act="settings">${icon('settings')}<span>설정 · 백업</span></button>
        <button class="nav-item" data-act="lock">${icon('lock')}<span>화면 잠금</span><span class="count">Alt+L</span></button>
        <div class="storage-note">${Store.memoryOnly ? '이 브라우저는 저장소를 쓸 수 없어 창을 닫으면 내용이 사라져요. 백업을 꼭 받아 주세요.' : '모든 서류는 이 기기의 브라우저 안에만 보관돼요.'}</div>
      </div>`;
    $$('.helper-ava', $('#sidebar .side-card h4')).forEach((a) => { a.style.width = '22px'; a.style.height = '22px'; });
  }

  /* =========================================================
   * 5. 본문 화면
   * ========================================================= */
  function renderAll() { renderSidebar(); renderMain(); }
  function renderMain() {
    const main = $('#main');
    if (route.view === 'folder') {
      if (route.folderId && !folderById(route.folderId)) { route = { view: 'folder', cat: route.cat, folderId: null }; history.replaceState(null, '', toHash(route)); }
      main.innerHTML = viewFolder();
    } else if (route.view === 'fav') main.innerHTML = viewList('즐겨찾기', '자주 쓰는 양식과 문서를 고정해 두었어요.', 'star', S.docs.filter((d) => d.favorite));
    else if (route.view === 'recent') main.innerHTML = viewList('최근 문서', '최근에 만들거나 고친 순서예요.', 'clock', S.docs.slice().sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 40), { noSort: true });
    else if (route.view === 'templates') main.innerHTML = viewTemplates();
    else if (route.view === 'checklist') main.innerHTML = viewChecklist();
    else if (route.view === 'social') { main.innerHTML = viewSocial(); afterSocialRender(); }
    else if (route.view === 'search') main.innerHTML = viewSearch(route.q || '');
    else main.innerHTML = viewHome();
  }

  function greeting() {
    const h = new Date().getHours();
    const name = S.settings.userName ? `${esc(S.settings.userName)} 선생님` : '선생님';
    if (h < 11) return [`좋은 아침이에요, ${name}`, '오늘의 기록을 차곡차곡 정리해 볼까요?'];
    if (h < 17) return [`오늘 오후도 힘내세요, ${name}`, '현장의 이야기를 잊기 전에 살짝 적어 두면 좋아요.'];
    return [`오늘 하루도 수고 많으셨어요, ${name}`, '궁금한 건 마음기록 도우미에게 물어보며 가볍게 마무리해요.'];
  }

  function viewHome() {
    const [g1, g2] = greeting();
    const weekAgo = now() - 7 * 86400000;
    const stats = [
      { ico: 'archive', bg: '#EEF2F8', fg: '#4F6B8F', n: S.docs.filter((d) => d.cat === 'general').length, l: '일반서류', act: 'data-act="go-folder" data-cat="general"' },
      { ico: 'clipboard', bg: '#FBEDE8', fg: '#C9654B', n: S.docs.filter((d) => d.cat === 'activity').length, l: '활동서류', act: 'data-act="go-folder" data-cat="activity"' },
      { ico: 'star', bg: '#FFF4DA', fg: '#C98E1E', n: S.docs.filter((d) => d.favorite).length, l: '즐겨찾기', act: 'data-act="go" data-view="fav"' },
      { ico: 'pencil', bg: '#E9F1EB', fg: '#4A7C59', n: S.docs.filter((d) => d.updatedAt > weekAgo).length, l: '이번 주 기록', act: 'data-act="go" data-view="recent"' },
    ];
    const recent = S.docs.slice().sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 6);
    const tools = [
      ['search', 'search', '검색해서 알려줘', '궁금한 제도·일정·지침을 인터넷에서 찾아 출처와 함께 알려 드려요.'],
      ['image', 'image', '사진 만들기', '홍보물·게시물에 쓸 이미지를 원하는 분위기로 만들어 드려요.'],
    ];
    const favTpl = S.docs.filter((d) => d.template && d.favorite).slice(0, 6);
    return `
      <section class="hero">
        <h1>${g1}</h1>
        <p>${g2}</p>
        <div class="hero-actions">
          <button class="btn primary" data-act="new-note">${icon('pencil')} 새 기록 작성</button>
          <button class="btn" data-act="upload">${icon('upload')} 파일 올리기</button>
          <button class="btn" data-act="from-template">${icon('layout')} 양식으로 시작</button>
        </div>
        ${HERO_ART}
      </section>
      <div class="stats">${stats.map((s) => `<button class="card stat" ${s.act}><span class="s-ico" style="background:${s.bg};color:${s.fg}">${icon(s.ico)}</span><span><b>${s.n}</b><small>${s.l}</small></span></button>`).join('')}</div>
      ${loungeSection()}
      <div class="grid-2 section">
        <div>
          <div class="section-head"><h3>${icon('clock')} 최근 문서</h3><button class="link-btn" data-act="go" data-view="recent">전체 보기 ${icon('chevR', 'sm')}</button></div>
          ${recent.length ? docList(recent, { showPath: true, compact: true }) : emptyBox('아직 보관된 서류가 없어요', '첫 기록을 남기거나 파일을 끌어다 놓아 보세요.')}
        </div>
        <div>
          <div class="section-head"><h3>${helperAva()} 마음기록 도우미</h3><span class="sub">AI 초안은 꼭 검토 후 사용해요</span></div>
          <div class="tool-grid">${tools.map(([tab, ico, t, d]) => `<button class="tool-card" data-act="ai-open" data-tab="${tab}"><span class="t-ico">${icon(ico)}</span><span><b>${t}</b><small>${d}</small></span></button>`).join('')}</div>
        </div>
      </div>
      <div class="grid-2 section">
        <div>
          <div class="section-head"><h3>${icon('layout')} 자주 쓰는 양식</h3><button class="link-btn" data-act="go" data-view="templates">양식 모두 보기 ${icon('chevR', 'sm')}</button></div>
          <div class="tool-grid">${favTpl.map((d) => `<button class="tool-card" data-act="use-template" data-id="${d.id}"><span class="t-ico" style="background:var(--primary-soft);color:var(--primary)">${icon(d.tplIcon || 'fileText')}</span><span><b>${esc(d.name.replace(/^\[양식\]\s*/, ''))}</b><small>${esc(d.desc || '이 양식으로 새 문서를 만들어요.')}</small></span></button>`).join('') || '<p class="cell-muted">즐겨찾기한 양식이 없어요.</p>'}</div>
        </div>
        <div>
          <div class="section-head"><h3>${icon('listChecks')} 구비 서류 체크리스트</h3><button class="link-btn" data-act="go" data-view="checklist">관리하기 ${icon('chevR', 'sm')}</button></div>
          ${S.checklists.slice(0, 2).map((c) => checklistCard(c, true)).join('') || emptyBox('체크리스트가 없어요', '사업별 필수 서류를 체크해 보세요.')}
        </div>
      </div>`;
  }

  function examDday() {
    if (typeof LOUNGE === 'undefined') return null;
    const d = Math.ceil((new Date(LOUNGE.examDate + 'T00:00:00+09:00') - new Date(todayStr() + 'T00:00:00+09:00')) / 86400000);
    return d >= 0 ? d : null;
  }
  function loungeSection() {
    const dd = examDday();
    const card = (cat, extra) => {
      const docs = S.docs.filter((d) => d.cat === cat).sort((a, b) => b.updatedAt - a.updatedAt);
      return `<div class="card lounge-card ${cat}">
        <button class="lounge-top" data-act="go-folder" data-cat="${cat}"><span class="cat-ico ${cat}">${icon(CATS[cat].icon)}</span><span style="flex:1;min-width:0"><b>${CATS[cat].name}</b><small>${kids(cat, null).length}개 폴더 · 자료 ${docs.length}개</small></span>${icon('chevR', 'sm')}</button>
        ${extra || ''}
        <div class="lounge-list">${docs.slice(0, 3).map((d) => `<button data-act="doc-open" data-id="${d.id}">${ftypeBadge(d)}<span>${esc(d.name)}</span></button>`).join('') || '<p class="cell-muted">아직 자료가 없어요.</p>'}</div>
        <div class="lounge-foot"><button class="btn ghost sm" data-act="cat-new-folder" data-cat="${cat}">${icon('folderPlus', 'sm')} 새 폴더</button><button class="btn ghost sm" data-act="add-link" data-cat="${cat}">${icon('link', 'sm')} 링크 추가</button></div>
      </div>`;
    };
    const sc = socialCount();
    return `<section class="section">
      <div class="section-head"><h3>${icon('heart')} 사회복지사 라운지</h3><span class="sub">교육 · 정보 · 활동을 한곳에서</span></div>
      <div class="lounge-grid">
        ${card('edu', dd != null ? `<button class="dday" data-act="go-folder" data-cat="edu">${icon('calendar', 'sm')} 사회복지사 1급 시험 <b>D-${dd}</b> <span>2027.1.16(토)</span></button>` : '')}
        ${card('info', '<div class="mini-note">2026 인건비 가이드라인: 기본급 3.5% 인상 · 유급병가 신설</div>')}
        ${card('act', `<button class="dday sns" data-act="go" data-view="social">${icon('share', 'sm')} ${sc ? `SNS ${sc}곳 연결됨` : '네이버 블로그 · 인스타그램 연결하기'}</button>`)}
      </div></section>`;
  }

  function emptyBox(title, msg, btns = '') {
    return `<div class="card empty">${EMPTY_ART}<b>${title}</b><p>${msg}</p>${btns}</div>`;
  }

  function crumbs(cat, fid) {
    const parts = [`<button data-act="go-folder" data-cat="${cat}" class="${fid ? '' : 'cur'}">${CATS[cat].name}</button>`];
    const p = folderPath(fid);
    p.forEach((f, i) => parts.push(`<span class="sep">${icon('chevR', 'sm')}</span><button data-act="go-folder" data-cat="${cat}" data-id="${f.id}" class="${i === p.length - 1 ? 'cur' : ''}">${esc(f.name)}</button>`));
    return `<nav class="crumbs" aria-label="현재 위치">${icon('home', 'sm')}${parts.join('')}</nav>`;
  }

  function sortDocs(list) {
    const a = list.slice();
    if (ui.sort === 'name') a.sort((x, y) => x.name.localeCompare(y.name, 'ko'));
    else if (ui.sort === 'type') a.sort((x, y) => ftype(x).cls.localeCompare(ftype(y).cls) || x.name.localeCompare(y.name, 'ko'));
    else a.sort((x, y) => y.updatedAt - x.updatedAt);
    return a;
  }
  const sortSelect = () => `<select class="sort-select" data-change="sort" aria-label="정렬"><option value="updated" ${ui.sort === 'updated' ? 'selected' : ''}>최근 수정순</option><option value="name" ${ui.sort === 'name' ? 'selected' : ''}>이름순</option><option value="type" ${ui.sort === 'type' ? 'selected' : ''}>종류순</option></select>`;

  function viewFolder() {
    const { cat, folderId } = route;
    const f = folderById(folderId);
    const subs = kids(cat, folderId);
    const docs = sortDocs(docsIn(cat, folderId));
    const title = f ? f.name : CATS[cat].name;
    const desc = f ? `${CATS[cat].name} 안의 폴더예요. 하위 폴더 ${subs.length}개 · 문서 ${docs.length}개` : CATS[cat].desc;
    return `
      <div class="page-head">
        <div>
          ${crumbs(cat, folderId)}
          <h2>${f ? icon('folder', 'lg') : `<span class="cat-ico ${cat}">${icon(CATS[cat].icon)}</span>`} ${esc(title)}
            ${f ? `<button class="icon-btn sm" data-act="folder-menu" data-id="${f.id}" aria-label="폴더 메뉴">${icon('more')}</button>` : ''}</h2>
          <p>${esc(desc)}</p>
        </div>
        <div class="toolbar">
          <button class="btn" data-act="new-folder">${icon('folderPlus')}<span class="lbl">새 폴더</span></button>
          <button class="btn" data-act="from-template">${icon('layout')}<span class="lbl">양식으로 작성</span></button>
          <button class="btn" data-act="new-note">${icon('pencil')}<span class="lbl">새 문서</span></button>
          <button class="btn" data-act="add-link">${icon('link')}<span class="lbl">링크·SNS</span></button>
          <button class="btn primary" data-act="upload">${icon('upload')}<span class="lbl">파일 올리기</span></button>
        </div>
      </div>
      ${cat === 'act' ? snsStrip() : ''}
      <section>
        <div class="section-head"><h3>폴더 <span class="sub">${subs.length}개</span></h3></div>
        <div class="folder-grid">
          ${subs.map((s) => `<div class="folder-card ${cat}" role="button" tabindex="0" data-act="go-folder" data-cat="${cat}" data-id="${s.id}">
              <span class="f-ico">${icon('folder', 'lg')}</span>
              <span class="f-txt"><b>${esc(s.name)}</b><small>문서 ${countDeep(s.id)}개${kids(cat, s.id).length ? ` · 폴더 ${kids(cat, s.id).length}개` : ''}</small></span>
              <button class="icon-btn sm" data-act="folder-menu" data-id="${s.id}" aria-label="${esc(s.name)} 폴더 메뉴">${icon('more')}</button>
            </div>`).join('')}
          <button class="folder-card new" data-act="new-folder">${icon('plus')} 새 폴더 만들기</button>
        </div>
      </section>
      <section class="section">
        <div class="section-head"><h3>문서 <span class="sub">${docs.length}개</span></h3>${docs.length > 1 ? sortSelect() : ''}</div>
        ${docs.length ? docList(docs) : emptyBox('이 폴더는 아직 비어 있어요', '파일을 이곳으로 끌어다 놓거나, 새 문서를 작성해 보세요.',
          `<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn primary sm" data-act="upload">${icon('upload', 'sm')} 파일 올리기</button><button class="btn sm" data-act="new-note">${icon('pencil', 'sm')} 새 문서 작성</button></div>`)}
      </section>`;
  }

  function hl(text, q) {
    const s = esc(text);
    if (!q) return s;
    const toks = q.split(/\s+/).filter(Boolean).map((t) => esc(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (!toks.length) return s;
    return s.replace(new RegExp(`(${toks.join('|')})`, 'gi'), '<mark>$1</mark>');
  }

  function docList(docs, { showPath = false, q = '', compact = false } = {}) {
    return `<div class="card doc-list">
      ${compact ? '' : `<div class="doc-head"><span>이름</span><span class="c-tags">태그</span><span class="c-date">수정일</span><span class="c-size">크기</span><span></span></div>`}
      ${docs.map((d) => `<div class="doc-row" data-act="doc-open" data-id="${d.id}" ${compact ? 'style="grid-template-columns:minmax(0,1fr) auto"' : ''}>
        <div class="doc-name">${ftypeBadge(d)}<div class="d-txt"><b>${hl(d.name, q)}</b>
          <div class="meta">${showPath || q ? `<span>${hl(pathLabel(d), q)}</span>` : `<span>${d.kind === 'note' ? (d.template ? '양식' : '직접 작성한 기록') : d.kind === 'link' ? esc(platformLabel(d)) : esc((d.ext || '').toUpperCase() + ' 파일')}</span>`}${compact ? `<span>· ${fmtDate(d.updatedAt)}</span>` : ''}${d.template && !compact ? '<span class="tag tpl">양식</span>' : ''}${q && d.tags.length ? `<span>· ${d.tags.map((t) => '#' + hl(t, q)).join(' ')}</span>` : ''}</div></div></div>
        ${compact ? '' : `<div class="tags c-tags">${d.tags.slice(0, 3).map((t) => `<span class="tag">#${esc(t)}</span>`).join('')}</div>
        <div class="cell-muted c-date">${fmtDate(d.updatedAt)}</div>
        <div class="cell-muted c-size">${fmtSize(d.size)}</div>`}
        <div class="row-actions">
          <button class="icon-btn sm star-btn ${d.favorite ? 'on' : ''}" data-act="doc-star" data-id="${d.id}" title="${d.favorite ? '즐겨찾기 해제' : '즐겨찾기'}" aria-label="즐겨찾기">${icon('star')}</button>
          ${compact ? '' : `<button class="icon-btn sm hide-sm" data-act="doc-download" data-id="${d.id}" title="내려받기" aria-label="내려받기">${icon('download')}</button>`}
          <button class="icon-btn sm" data-act="doc-menu" data-id="${d.id}" title="더 보기" aria-label="더 보기">${icon('more')}</button>
        </div>
      </div>`).join('')}
    </div>`;
  }

  function viewList(title, desc, ico, docs, { noSort = false } = {}) {
    const list = noSort ? docs : sortDocs(docs);
    return `<div class="page-head"><div><h2>${icon(ico, 'lg')} ${title}</h2><p>${desc}</p></div>${!noSort && list.length > 1 ? sortSelect() : ''}</div>
      ${list.length ? docList(list, { showPath: true }) : emptyBox('아직 비어 있어요', ico === 'star' ? '문서 옆 별 아이콘을 누르면 이곳에 고정돼요.' : '문서를 만들면 이곳에 나타나요.')}`;
  }

  function searchMatch(q) {
    const toks = q.toLowerCase().split(/\s+/).filter(Boolean);
    const docs = S.docs.filter((d) => {
      const hay = [d.name, d.tags.join(' '), pathLabel(d)].join(' ').toLowerCase();
      return toks.every((t) => hay.includes(t.replace(/^#/, '')));
    });
    const folders = S.folders.filter((f) => toks.every((t) => f.name.toLowerCase().includes(t)));
    return { docs: docs.sort((a, b) => b.updatedAt - a.updatedAt), folders };
  }
  function viewSearch(q) {
    const { docs, folders } = searchMatch(q);
    return `<div class="page-head"><div><h2>${icon('search', 'lg')} ‘${esc(q)}’ 찾아보기</h2><p>제목 · 폴더명 · 태그에서 찾았어요. 폴더 ${folders.length}개, 문서 ${docs.length}개</p></div></div>
      ${folders.length ? `<section><div class="section-head"><h3>폴더</h3></div><div class="folder-grid">${folders.map((s) => `<div class="folder-card ${s.cat}" role="button" tabindex="0" data-act="go-folder" data-cat="${s.cat}" data-id="${s.id}"><span class="f-ico">${icon('folder', 'lg')}</span><span class="f-txt"><b>${hl(s.name, q)}</b><small>${esc([CATS[s.cat].name, ...folderPath(s.parentId).map((x) => x.name)].join(' › '))}</small></span></div>`).join('')}</div></section>` : ''}
      <section class="section">${docs.length ? `<div class="section-head"><h3>문서</h3></div>${docList(docs, { q })}` : emptyBox('찾는 문서가 없어요', '다른 낱말이나 태그(예: 상담, 공문)로 찾아볼까요?')}</section>`;
  }

  function viewTemplates() {
    const tpls = S.docs.filter((d) => d.template);
    return `<div class="page-head"><div><h2>${icon('layout', 'lg')} 양식 템플릿</h2><p>자주 쓰는 양식으로 새 문서를 바로 만들어요. 필요한 양식은 ‘양식 추가하기’에 적으면 AI가 만들어 드려요.</p></div>
      <div class="toolbar"><button class="btn primary" data-act="tpl-new">${icon('plus')} 양식 추가하기</button></div></div>
      <div class="tool-grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">
      ${tpls.map((d) => `<div class="card" style="padding:18px;display:flex;flex-direction:column;gap:12px">
          <div style="display:flex;gap:12px;align-items:flex-start"><span class="t-ico" style="width:42px;height:42px;border-radius:12px;background:${d.cat === 'activity' ? 'var(--accent-soft)' : '#EEF2F8'};color:${d.cat === 'activity' ? 'var(--accent-dark)' : '#4F6B8F'};display:grid;place-items:center;flex:none">${icon(d.tplIcon || 'fileText')}</span>
          <div style="min-width:0;flex:1"><b style="display:block">${esc(d.name)}</b><small class="cell-muted" style="white-space:normal">${esc(d.desc || pathLabel(d))}</small></div>
          <button class="icon-btn sm star-btn ${d.favorite ? 'on' : ''}" data-act="doc-star" data-id="${d.id}" aria-label="즐겨찾기">${icon('star')}</button></div>
          <div style="display:flex;gap:8px;margin-top:auto"><button class="btn primary sm" data-act="use-template" data-id="${d.id}">${icon('pencil', 'sm')} 이 양식으로 작성</button><button class="btn sm" data-act="doc-open" data-id="${d.id}">${icon('eye', 'sm')} 미리보기</button></div>
        </div>`).join('')}
      <button class="card tpl-add" data-act="tpl-new">${icon('sparkle', 'lg')}<b>양식 추가하기</b><small>양식 종류와 특징을 적으면 AI가 빈 양식을 만들어 드려요</small></button>
      </div>`;
  }

  /* ---------- 체크리스트 ---------- */
  function checklistCard(c, compact = false) {
    const done = c.items.filter((i) => i.done).length;
    const pct = c.items.length ? Math.round((done / c.items.length) * 100) : 0;
    return `<div class="card check-card" data-cl="${c.id}">
      <div class="check-top"><b>${esc(c.title)}</b><span class="cell-muted">${done}/${c.items.length}${pct === 100 ? ' · 모두 갖췄어요!' : ''}</span>
        ${compact ? '' : `<button class="icon-btn sm" data-act="cl-menu" data-id="${c.id}" aria-label="체크리스트 메뉴">${icon('more')}</button>`}</div>
      <div class="progress ${pct === 100 ? 'done' : ''}"><i style="width:${pct}%"></i></div>
      ${c.items.map((it) => `<div class="check-item"><label><input type="checkbox" data-change="cl-toggle" data-cl="${c.id}" data-item="${it.id}" ${it.done ? 'checked' : ''} /><span>${esc(it.text)}</span></label>
        ${compact ? '' : `<button class="icon-btn sm" data-act="cl-del-item" data-cl="${c.id}" data-item="${it.id}" aria-label="항목 삭제">${icon('x', 'sm')}</button>`}</div>`).join('')}
      ${compact ? '' : `<form class="check-add" data-submit="cl-add" data-cl="${c.id}"><input class="input" name="t" placeholder="필수 서류를 추가해 볼까요? 예) 통장 사본" style="height:38px" /><button class="btn soft sm" type="submit">${icon('plus', 'sm')} 추가</button></form>`}
    </div>`;
  }
  function viewChecklist() {
    return `<div class="page-head"><div><h2>${icon('listChecks', 'lg')} 구비 서류 체크리스트</h2><p>사업별·활동별로 꼭 챙겨야 할 서류를 체크해요. 빠진 서류 없이 마감까지 든든하게!</p></div>
      <div class="toolbar"><button class="btn primary" data-act="cl-new">${icon('plus')} 새 체크리스트</button></div></div>
      <div class="tool-grid" style="grid-template-columns:repeat(auto-fill,minmax(340px,1fr));align-items:start">${S.checklists.map((c) => checklistCard(c)).join('')}</div>
      ${S.checklists.length ? '' : emptyBox('체크리스트가 없어요', '사업이나 활동 이름으로 새 체크리스트를 만들어 보세요.')}`;
  }

  /* =========================================================
   * 6. 폴더 동작
   * ========================================================= */
  async function newFolder(cat, parentId) {
    const name = await promptBox('새 폴더 만들기', { label: '폴더 이름', placeholder: '예) 2026 하반기 프로그램', ok: '만들기', sub: `${[CATS[cat].name, ...folderPath(parentId).map((f) => f.name)].join(' › ')} 안에 만들어요.` });
    if (!name) return;
    if (kids(cat, parentId).some((f) => f.name === name)) { toast('같은 이름의 폴더가 이미 있어요.', { type: 'warn' }); return; }
    S.folders.push({ id: uid('f'), cat, name, parentId: parentId || null, createdAt: now() });
    save(); renderAll(); toast(`‘${name}’ 폴더를 만들었어요.`);
  }
  async function renameFolder(id) {
    const f = folderById(id); if (!f) return;
    const name = await promptBox('폴더 이름 바꾸기', { label: '새 이름', value: f.name, ok: '바꾸기' });
    if (!name || name === f.name) return;
    if (kids(f.cat, f.parentId).some((x) => x.name === name && x.id !== id)) { toast('같은 이름의 폴더가 이미 있어요.', { type: 'warn' }); return; }
    f.name = name; save(); renderAll(); toast('폴더 이름을 바꿨어요.');
  }
  async function deleteFolder(id) {
    const f = folderById(id); if (!f) return;
    const ids = descendantIds(id);
    const docs = S.docs.filter((d) => ids.includes(d.folderId));
    const ok = await confirmBox(`‘${f.name}’ 폴더를 삭제할까요?\n하위 폴더 ${ids.length - 1}개와 문서 ${docs.length}개가 함께 삭제되고, 되돌릴 수 없어요.`, { title: '폴더 삭제', ok: '삭제하기', danger: true });
    if (!ok) return;
    S.folders = S.folders.filter((x) => !ids.includes(x.id));
    S.docs = S.docs.filter((d) => !ids.includes(d.folderId));
    docs.forEach((d) => d.kind === 'file' && Store.delBlob(d.id));
    save();
    if (route.view === 'folder' && ids.includes(route.folderId)) go({ view: 'folder', cat: f.cat, folderId: f.parentId || null });
    else renderAll();
    toast('폴더를 삭제했어요.');
  }

  /* =========================================================
   * 7. 문서 동작
   * ========================================================= */
  async function handleFiles(files, loc) {
    files = [...files].filter((f) => f && f.size >= 0);
    if (!files.length) return;
    if (!loc) loc = currentLoc() || (await pickFolder(`파일 ${files.length}개 보관하기`, { cat: 'general', sub: '어느 서랍에 넣어 둘까요?' }));
    if (!loc) return;
    let ok = 0;
    for (const file of files) {
      if (file.size > 100 * 1024 * 1024) { toast(`${file.name}: 100MB가 넘는 파일은 올릴 수 없어요.`, { type: 'warn' }); continue; }
      const d = { id: uid('d'), kind: 'file', name: file.name, ext: extOf(file.name), mime: file.type || '', size: file.size, cat: loc.cat, folderId: loc.folderId, tags: [], favorite: false, template: false, createdAt: now(), updatedAt: now() };
      try { await Store.putBlob(d.id, file); S.docs.push(d); ok++; }
      catch (e) { toast(`${file.name} 보관 실패: ${e.message}`, { type: 'warn' }); }
    }
    save(); renderAll();
    if (ok) toast(`${ok}개 파일을 ${[CATS[loc.cat].name, ...folderPath(loc.folderId).map((f) => f.name)].pop()}에 보관했어요.`, { action: route.view === 'folder' && route.cat === loc.cat && route.folderId === loc.folderId ? null : { label: '가 보기', fn: () => go({ view: 'folder', ...loc }) } });
  }
  function triggerUpload() { $('#fileInput').value = ''; $('#fileInput').click(); }

  function toggleStar(id) {
    const d = docById(id); if (!d) return;
    d.favorite = !d.favorite; save(); renderAll();
    toast(d.favorite ? '즐겨찾기에 고정했어요.' : '즐겨찾기에서 뺐어요.');
  }

  function downloadBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }
  const safeName = (s) => String(s).replace(/[\\/:*?"<>|]+/g, '_').trim() || '문서';
  function noteAsDoc(d) {
    const html = `\ufeff<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${esc(d.name)}</title><style>body{font-family:'맑은 고딕','Malgun Gothic',sans-serif;font-size:11pt;line-height:1.75}</style></head><body>${esc(d.content || '').replace(/\n/g, '<br>').replace(/ {2}/g, ' &nbsp;')}</body></html>`;
    return new Blob([html], { type: 'application/msword' });
  }
  async function downloadDoc(id, fmt, anchorEl) {
    const d = docById(id); if (!d) return;
    if (d.kind === 'link') { openExternal(d.url); return; }
    if (d.kind === 'note') {
      if (!fmt) {
        const anchor = (anchorEl && anchorEl.isConnected && anchorEl) || (document.activeElement && document.activeElement.closest('button')) || document.body;
        openMenu(anchor, [
          { label: '한글·워드에서 열기 (.doc)', icon: 'fileText', fn: () => downloadDoc(id, 'doc') },
          { label: '텍스트 파일 (.txt)', icon: 'file', fn: () => downloadDoc(id, 'txt') },
          { label: '인쇄 / PDF로 저장', icon: 'printer', fn: () => printText(d.name, d.content) },
        ]);
        return;
      }
      if (fmt === 'doc') downloadBlob(noteAsDoc(d), safeName(d.name) + '.doc');
      else downloadBlob(new Blob(['\ufeff' + (d.content || '')], { type: 'text/plain;charset=utf-8' }), safeName(d.name) + '.txt');
      toast('내려받기를 시작했어요.');
      return;
    }
    const blob = await Store.getBlob(d.id);
    if (!blob) { toast('파일 원본을 찾을 수 없어요.', { type: 'warn' }); return; }
    downloadBlob(blob, d.name); toast('내려받기를 시작했어요.');
  }
  function printText(title, text) {
    const ifr = document.createElement('iframe');
    ifr.style.cssText = 'position:fixed;width:0;height:0;border:0;right:0;bottom:0';
    document.body.appendChild(ifr);
    ifr.contentDocument.open();
    ifr.contentDocument.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>body{font-family:'Pretendard','Malgun Gothic',sans-serif;font-size:11pt;line-height:1.8;padding:18mm;white-space:pre-wrap;color:#222}</style></head><body>${esc(text || '')}</body></html>`);
    ifr.contentDocument.close();
    setTimeout(() => { ifr.contentWindow.focus(); ifr.contentWindow.print(); setTimeout(() => ifr.remove(), 1500); }, 200);
  }

  async function deleteDoc(id) {
    const d = docById(id); if (!d) return false;
    const ok = await confirmBox(`‘${d.name}’ 문서를 삭제할까요?\n삭제한 문서는 되돌릴 수 없어요.`, { title: '문서 삭제', ok: '삭제하기', danger: true });
    if (!ok) return false;
    S.docs = S.docs.filter((x) => x.id !== id);
    if (d.kind === 'file') Store.delBlob(id);
    save(); renderAll(); toast('문서를 삭제했어요.');
    return true;
  }
  async function moveDoc(id) {
    const d = docById(id); if (!d) return;
    const loc = await pickFolder('다른 폴더로 옮기기', { cat: d.cat, folderId: d.folderId, ok: '옮기기', sub: esc(d.name) });
    if (!loc) return;
    d.cat = loc.cat; d.folderId = loc.folderId; d.updatedAt = now(); save(); renderAll();
    toast('문서를 옮겼어요.', { action: { label: '가 보기', fn: () => go({ view: 'folder', ...loc }) } });
  }
  function editMeta(id) {
    const d = docById(id); if (!d) return;
    const m = openModal({ title: '이름 · 태그 수정', body: `
      <label class="field"><span>문서 이름</span><input class="input" id="emName" value="${esc(d.name)}" maxlength="80" /></label>
      <label class="field"><span>태그</span><input class="input" id="emTags" value="${esc(d.tags.join(', '))}" placeholder="쉼표로 구분 예) 상담, 초기상담" /><small>태그로 검색하면 금방 찾을 수 있어요.</small></label>
      ${d.kind === 'note' ? `<label class="field"><span>한 줄 설명 (양식 카드에 보여요)</span><input class="input" id="emDesc" value="${esc(d.desc || '')}" maxlength="60" /></label>` : ''}`,
      foot: `<button class="btn ghost" data-close>취소</button><button class="btn primary" data-ok>저장하기</button>` });
    m.el.querySelector('[data-ok]').onclick = () => {
      const name = m.el.querySelector('#emName').value.trim();
      if (!name) { m.el.querySelector('#emName').focus(); return; }
      d.name = name; d.tags = parseTags(m.el.querySelector('#emTags').value);
      const desc = m.el.querySelector('#emDesc'); if (desc) d.desc = desc.value.trim();
      d.updatedAt = now(); save(); renderAll(); m.close(true); toast('저장했어요.');
    };
  }
  const parseTags = (s) => [...new Set(String(s).split(/[,#\n]/).map((t) => t.trim()).filter(Boolean))].slice(0, 12);

  function docMenu(anchor, id) {
    const d = docById(id); if (!d) return;
    const items = [
      { label: '미리보기', icon: 'eye', fn: () => openPreview(id) },
      d.kind === 'note' && { label: '편집하기', icon: 'pencil', fn: () => openEditor({ doc: d }) },
      d.template && { label: '이 양식으로 새 문서', icon: 'layout', fn: () => useTemplate(id) },
      { label: '이름 · 태그 수정', icon: 'tag', fn: () => editMeta(id) },
      { label: '다른 폴더로 옮기기', icon: 'move', fn: () => moveDoc(id) },
      { label: d.favorite ? '즐겨찾기 해제' : '즐겨찾기 고정', icon: 'star', fn: () => toggleStar(id) },
      d.kind === 'note' && { label: d.template ? '양식 지정 해제' : '내 양식으로 지정', icon: 'pin', fn: () => { d.template = !d.template; if (d.template) { d.favorite = true; d.tplIcon ||= 'fileText'; } save(); renderAll(); toast(d.template ? '양식 템플릿에 추가했어요.' : '양식 지정을 해제했어요.'); } },
      d.kind === 'link' ? { label: '새 탭에서 열기', icon: 'external', fn: () => openExternal(d.url) } : { label: '내려받기', icon: 'download', fn: () => downloadDoc(id, null, anchor) },
      (d.kind === 'note' || d.kind === 'link' || ftype(d).cls === 'img') && { label: 'SNS로 공유', icon: 'share', fn: () => openShare({ docId: id, title: d.name }) },
      '-',
      { label: '삭제', icon: 'trash', danger: true, fn: () => deleteDoc(id) },
    ].filter(Boolean);
    openMenu(anchor, items);
  }
  function folderMenu(anchor, id) {
    const f = folderById(id); if (!f) return;
    openMenu(anchor, [
      { label: '열기', icon: 'folder', fn: () => go({ view: 'folder', cat: f.cat, folderId: f.id }) },
      { label: '이 안에 새 폴더', icon: 'folderPlus', fn: () => newFolder(f.cat, f.id) },
      { label: '이름 바꾸기', icon: 'pencil', fn: () => renameFolder(id) },
      '-',
      { label: '폴더 삭제', icon: 'trash', danger: true, fn: () => deleteFolder(id) },
    ]);
  }

  /* ---------- 문서 텍스트 추출 (도우미 불러오기용) ---------- */
  const LIBS = {
    mammoth: ['https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js', 'mammoth'],
    xlsx: ['https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js', 'XLSX'],
  };
  const libCache = {};
  function loadLib(name) {
    if (libCache[name]) return libCache[name];
    const [src, glob] = LIBS[name];
    libCache[name] = new Promise((res, rej) => {
      if (window[glob]) return res(window[glob]);
      const s = document.createElement('script'); s.src = src; s.async = true;
      s.onload = () => res(window[glob]); s.onerror = () => { delete libCache[name]; rej(new Error('미리보기 도구를 불러오지 못했어요. 인터넷 연결을 확인해 주세요.')); };
      document.head.appendChild(s);
    });
    return libCache[name];
  }
  const textExt = ['txt', 'md', 'csv'];
  const canExtract = (d) => d.kind === 'note' || textExt.includes(d.ext) || ['docx', 'xlsx', 'xls'].includes(d.ext);
  async function getDocText(d) {
    if (d.kind === 'note') return d.content || '';
    const blob = await Store.getBlob(d.id);
    if (!blob) return null;
    if (textExt.includes(d.ext)) return blob.text();
    if (d.ext === 'docx') { const mm = await loadLib('mammoth'); const r = await mm.extractRawText({ arrayBuffer: await blob.arrayBuffer() }); return r.value; }
    if (['xlsx', 'xls'].includes(d.ext)) { const X = await loadLib('xlsx'); const wb = X.read(await blob.arrayBuffer(), { type: 'array' }); return wb.SheetNames.slice(0, 3).map((n) => `[${n}]\n` + X.utils.sheet_to_csv(wb.Sheets[n])).join('\n\n'); }
    return null;
  }
  async function sendDocToAI(id, tab) {
    const d = docById(id); if (!d) return;
    if (!canExtract(d)) { toast('이 형식은 글자를 바로 읽을 수 없어요. 내용을 복사해 도우미 창에 붙여 넣어 주세요.', { type: 'warn', ms: 4500 }); openAI(tab, { fields: { title: d.name } }); return; }
    try {
      const text = await getDocText(d);
      if (!text || !text.trim()) { toast('문서에서 읽을 수 있는 글자가 없어요.', { type: 'warn' }); return; }
      openAI(tab, { fields: { text: text.slice(0, 30000), title: d.name, srcId: d.id }, autorun: true });
    } catch (e) { toast(e.message, { type: 'warn' }); }
  }

  /* =========================================================
   * 7-2. 링크 · SNS 연동 (인스타그램 · 틱톡 · 유튜브)
   * ========================================================= */
  // YouTube Data API v3 브라우저 키 — 이 사이트 주소(jake12733.github.io)와 YouTube Data API에만 쓰이도록 제한됨
  const YT_KEY = 'AIzaSyBwfNJtkvtfp9lCQ1b_z6CtfGaNR2lcrTM';
  const PLAT = {
    youtube: { name: '유튜브', icon: 'youtube', color: '#E5372E' },
    instagram: { name: '인스타그램', icon: 'instagram', color: '#D62976' },
    tiktok: { name: '틱톡', icon: 'tiktok', color: '#111' },
    naver: { name: '네이버 블로그', icon: 'link', color: '#03C75A' },
    web: { name: '웹 링크', icon: 'link', color: '#3A6EA5' },
  };
  function parseSocial(raw) {
    let u; try { u = new URL(/^https?:\/\//i.test(raw) ? raw.trim() : 'https://' + raw.trim()); } catch (e) { return null; }
    const h = u.hostname.replace(/^www\.|^m\./, '');
    let m;
    if (h === 'youtu.be' && (m = /^\/([\w-]{11})/.exec(u.pathname))) return { platform: 'youtube', id: m[1], url: u.href, embed: `https://www.youtube-nocookie.com/embed/${m[1]}`, ratio: '16/9' };
    if (/(^|\.)youtube\.com$/.test(h)) {
      const v = u.searchParams.get('v') || ((m = /^\/(?:shorts|embed|live)\/([\w-]{11})/.exec(u.pathname)) && m[1]);
      if (v) return { platform: 'youtube', id: v, url: u.href, embed: `https://www.youtube-nocookie.com/embed/${v}`, ratio: /shorts/.test(u.pathname) ? '9/16' : '16/9' };
      return { platform: 'youtube', url: u.href, channel: true };
    }
    if (/(^|\.)blog\.naver\.com$/.test(h)) return { platform: 'naver', url: u.href, profile: !/\/\d{6,}/.test(u.pathname + u.search) };
    if (/(^|\.)instagram\.com$/.test(h)) {
      if ((m = /^\/(p|reel|reels|tv)\/([\w-]+)/.exec(u.pathname))) { const t = m[1] === 'reels' ? 'reel' : m[1]; return { platform: 'instagram', id: m[2], url: `https://www.instagram.com/${t}/${m[2]}/`, embed: `https://www.instagram.com/${t}/${m[2]}/embed/captioned/`, ratio: '4/5.6' }; }
      return { platform: 'instagram', url: u.href, profile: true };
    }
    if (/(^|\.)tiktok\.com$/.test(h)) {
      if ((m = /\/video\/(\d+)/.exec(u.pathname))) return { platform: 'tiktok', id: m[1], url: u.href, embed: `https://www.tiktok.com/embed/v2/${m[1]}`, ratio: '9/17' };
      return { platform: 'tiktok', url: u.href, profile: true };
    }
    return { platform: 'web', url: u.href };
  }
  const platformLabel = (d) => { const p = PLAT[d.platform] || PLAT.web; let host = ''; try { host = new URL(d.url).hostname.replace(/^www\./, ''); } catch (e) {} return d.platform && d.platform !== 'web' ? `${p.name} 게시물` : host || '웹 링크'; };
  const openExternal = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  async function ytApi(path, params) {
    const u = new URL('https://www.googleapis.com/youtube/v3/' + path);
    Object.entries({ ...params, key: YT_KEY }).forEach(([k, v]) => u.searchParams.set(k, v));
    const r = await fetch(u); const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error?.message || `YouTube 응답 오류 (${r.status})`);
    return j;
  }
  async function ytResolveChannel(input) {
    const s = String(input).trim(); let m; let params;
    if ((m = /(UC[\w-]{22})/.exec(s))) params = { id: m[1] };
    else if ((m = /@([^/?#\s]+)/.exec(s))) params = { forHandle: '@' + decodeURIComponent(m[1]) };
    else params = { forHandle: '@' + s.replace(/^@/, '') };
    const j = await ytApi('channels', { part: 'snippet,statistics,contentDetails', ...params });
    if (!j.items || !j.items.length) throw new Error('채널을 찾지 못했어요. @핸들이나 채널 주소를 다시 확인해 주세요.');
    const c = j.items[0];
    return { channelId: c.id, title: c.snippet.title, thumb: c.snippet.thumbnails?.default?.url || '', handle: c.snippet.customUrl || '', subs: c.statistics?.hiddenSubscriberCount ? null : Number(c.statistics?.subscriberCount || 0), videos: Number(c.statistics?.videoCount || 0), uploads: c.contentDetails?.relatedPlaylists?.uploads || '' };
  }
  async function ytLatest(uploads, n = 6) {
    const j = await ytApi('playlistItems', { part: 'snippet,contentDetails', playlistId: uploads, maxResults: n });
    return (j.items || []).map((i) => ({ id: i.contentDetails.videoId, title: i.snippet.title, thumb: i.snippet.thumbnails?.medium?.url || i.snippet.thumbnails?.default?.url || '', date: i.contentDetails.videoPublishedAt || i.snippet.publishedAt }));
  }
  async function autoTitle(info) {
    try {
      if (info.platform === 'youtube' && info.id) { const j = await ytApi('videos', { part: 'snippet', id: info.id }); return j.items?.[0]?.snippet?.title || ''; }
      if (info.platform === 'tiktok' && info.id) { const r = await fetch('https://www.tiktok.com/oembed?url=' + encodeURIComponent(info.url)); if (r.ok) { const j = await r.json(); return j.title || ''; } }
    } catch (e) {}
    return '';
  }

  function openAddLink({ cat, folderId, url = '', name = '' } = {}) {
    const cur = currentLoc();
    const snsF = (topFolderByName('act', 'SNS 홍보') || {}).id || null;
    const loc = cat ? { cat, folderId: folderId ?? (cur && cur.cat === cat ? cur.folderId : (cat === 'act' ? snsF : null)) } : (cur || { cat: 'act', folderId: (topFolderByName('act', 'SNS 홍보') || {}).id || null });
    const m = openModal({ title: '링크 · SNS 게시물 추가', sub: '유튜브 · 인스타그램 · 틱톡 주소는 화면 안에서 바로 재생돼요.', body: `
      <label class="field"><span>주소 (URL)</span><input class="input" id="alUrl" value="${esc(url)}" placeholder="예) https://www.youtube.com/watch?v=… / https://www.instagram.com/p/… / https://www.tiktok.com/@…/video/…" /><small id="alHint">주소를 붙여 넣으면 종류를 알아서 알아봐요.</small></label>
      <label class="field"><span>제목</span><input class="input" id="alName" value="${esc(name)}" placeholder="비워 두면 자동으로 채워요" maxlength="90" /></label>
      <div class="row-2"><label class="field"><span>보관할 위치</span><select class="select" id="alLoc">${folderOptions(loc.cat, loc.folderId)}</select></label>
      <label class="field"><span>태그</span><input class="input" id="alTags" placeholder="예) 홍보, 원예교실" /></label></div>`,
      foot: `<button class="btn ghost" data-close>취소</button><button class="btn primary" data-ok>${icon('save', 'sm')} 추가하기</button>` });
    const $u = m.el.querySelector('#alUrl'), $n = m.el.querySelector('#alName'), $h = m.el.querySelector('#alHint');
    let info = null; let titleTimer = 0;
    const detect = () => {
      info = $u.value.trim() ? parseSocial($u.value) : null;
      if (!info) { $h.textContent = $u.value.trim() ? '주소 형식을 확인해 주세요.' : '주소를 붙여 넣으면 종류를 알아서 알아봐요.'; return; }
      const p = PLAT[info.platform];
      $h.innerHTML = `<span style="color:${p.color};font-weight:700">${p.name}</span> ${info.embed ? '· 화면 안에서 바로 볼 수 있어요' : info.profile || info.channel ? '· 프로필/채널 링크로 저장돼요 (SNS 연동 메뉴에서 채널을 연결하면 더 좋아요)' : '· 새 탭에서 열리는 링크로 저장돼요'}`;
      clearTimeout(titleTimer);
      if (!$n.value.trim()) titleTimer = setTimeout(async () => { const t = await autoTitle(info); if (t && !$n.value.trim()) $n.value = t; }, 350);
    };
    $u.addEventListener('input', detect); if (url) detect();
    m.el.querySelector('[data-ok]').onclick = () => {
      detect();
      if (!info) { $u.focus(); $u.classList.add('shake'); setTimeout(() => $u.classList.remove('shake'), 400); return; }
      const l = parseLoc(m.el.querySelector('#alLoc').value);
      let host = ''; try { host = new URL(info.url).hostname.replace(/^www\./, ''); } catch (e) {}
      const d = { id: uid('d'), kind: 'link', url: info.url, platform: info.platform, embed: info.embed || '', ratio: info.ratio || '', name: $n.value.trim() || `${PLAT[info.platform].name} ${info.platform === 'web' ? host : '게시물'}`, ext: '', mime: '', size: null, cat: l.cat, folderId: l.folderId, tags: parseTags(m.el.querySelector('#alTags').value), favorite: false, template: false, createdAt: now(), updatedAt: now() };
      S.docs.push(d); save(); renderAll(); m.close(true);
      toast('링크를 보관했어요.', { action: { label: '열어 보기', fn: () => openPreview(d.id) } });
    };
  }

  /* ---------- SNS 계정 (기본: 네이버 블로그 · 인스타그램 / 'SNS 추가하기'로 확장) ---------- */
  const SNS_TYPES = {
    naver: { name: '네이버 블로그', badge: 'N', color: '#03C75A', ph: '블로그 아이디 또는 주소 (예: blog.naver.com/아이디)', re: /blog\.naver\.com\/(?:PostList\.naver\?blogId=)?([\w-]+)/i, profile: (h) => 'https://blog.naver.com/' + h, write: (h) => (h ? 'https://blog.naver.com/' + h + '/postwrite' : 'https://blog.naver.com/'), writeLabel: '글쓰기' },
    instagram: { name: '인스타그램', icon: 'instagram', color: '#D62976', ph: '@계정 또는 프로필 주소', re: /instagram\.com\/([\w.]+)/i, profile: (h) => 'https://www.instagram.com/' + h + '/', write: () => 'https://www.instagram.com/', writeLabel: '게시하기' },
    youtube: { name: '유튜브', icon: 'youtube', color: '#E5372E', ph: '@핸들 또는 채널 주소', re: /youtube\.com\/@([^/?#]+)/i, profile: (h) => 'https://www.youtube.com/@' + h, write: () => 'https://www.youtube.com/upload', writeLabel: '영상 올리기' },
    tiktok: { name: '틱톡', icon: 'tiktok', color: '#111', ph: '@계정 또는 프로필 주소', re: /tiktok\.com\/@([\w.]+)/i, profile: (h) => 'https://www.tiktok.com/@' + h, write: () => 'https://www.tiktok.com/upload', writeLabel: '영상 올리기' },
    facebook: { name: '페이스북', badge: 'f', color: '#1877F2', ph: '페이지 아이디 또는 주소', re: /facebook\.com\/([\w.]+)/i, profile: (h) => 'https://www.facebook.com/' + h, write: () => 'https://www.facebook.com/', writeLabel: '게시하기' },
    threads: { name: '스레드', badge: '@', color: '#111', ph: '@계정 또는 프로필 주소', re: /threads\.(?:net|com)\/@([\w.]+)/i, profile: (h) => 'https://www.threads.net/@' + h, write: () => 'https://www.threads.net/', writeLabel: '게시하기' },
    x: { name: 'X (트위터)', badge: 'X', color: '#111', ph: '@계정 또는 프로필 주소', re: /(?:x|twitter)\.com\/(\w+)/i, profile: (h) => 'https://x.com/' + h, write: () => 'https://x.com/compose/post', writeLabel: '게시하기' },
    kakao: { name: '카카오톡 채널', badge: 'K', color: '#FEE500', fg: '#3A1D1D', ph: '채널 주소 (예: pf.kakao.com/_abcd)', re: /pf\.kakao\.com\/([\w]+)/i, profile: (h) => 'https://pf.kakao.com/' + h, write: () => 'https://center-pf.kakao.com/', writeLabel: '소식 작성' },
    band: { name: '네이버 밴드', badge: 'B', color: '#2DB400', ph: '밴드 주소 (예: band.us/band/12345678)', re: /band\.us\/band\/(\d+)/i, profile: (h) => 'https://band.us/band/' + h, write: (h) => (h ? 'https://band.us/band/' + h : 'https://band.us/'), writeLabel: '글쓰기' },
    custom: { name: '기타 SNS', icon: 'link', color: '#3A6EA5', ph: '프로필·채널 주소 (https://…)' },
  };
  const ADDABLE = ['youtube', 'tiktok', 'facebook', 'threads', 'x', 'kakao', 'band', 'custom'];
  const snsList = () => ((S && S.social && S.social.list) || []);
  const snsName = (e) => e.name || SNS_TYPES[e.type].name;
  const snsOn = (e) => !!(e.handle || e.url);
  const snsProfile = (e) => e.url || (SNS_TYPES[e.type].profile && e.handle ? SNS_TYPES[e.type].profile(e.handle) : '');
  const snsWrite = (e) => { const T = SNS_TYPES[e.type]; return T.write ? T.write(e.handle || '') : (e.url || ''); };
  const snsBadge = (type, cls = '') => { const T = SNS_TYPES[type] || SNS_TYPES.custom; return '<span class="sns-badge ' + cls + '" style="background:' + T.color + ';color:' + (T.fg || '#fff') + '">' + (T.badge ? '<b>' + T.badge + '</b>' : icon(T.icon)) + '</span>'; };
  function parseHandle(type, v) {
    v = String(v || '').trim(); const T = SNS_TYPES[type];
    if (type === 'custom') { const info = parseSocial(v); return info ? { url: info.url } : null; }
    const m = T.re && T.re.exec(v);
    let h = m ? m[1] : v.replace(/^@/, '').replace(/^https?:\/\/[^/]+\/?/i, '').replace(/[/?#].*$/, '');
    try { h = decodeURIComponent(h); } catch (e) {}
    if (!h || /\s/.test(h) || h.length > 60) return null;
    return { handle: h };
  }
  const socialCount = () => snsList().filter(snsOn).length;

  function snsStrip() {
    const chips = snsList().map((e) => '<button class="sns-chip ' + (snsOn(e) ? 'on' : '') + '" data-act="go" data-view="social">' + snsBadge(e.type, 'xs') + ' ' + esc(snsOn(e) ? snsName(e) + (e.handle ? ' · ' + e.handle : '') : snsName(e) + ' 연결') + '</button>').join('');
    return '<div class="sns-strip card"><span class="sns-strip-t">' + icon('share', 'sm') + ' 연동된 SNS</span>' + chips +
      '<button class="sns-chip" data-act="sns-add">' + icon('plus', 'sm') + ' SNS 추가</button>' +
      '</div>';
  }

  function snsCard(e) {
    const T = SNS_TYPES[e.type] || SNS_TYPES.custom;
    const head = '<div class="social-head">' + snsBadge(e.type) + '<b>' + esc(snsName(e)) + '</b>' + (snsOn(e) ? '<span class="tag" style="background:#E9F1EB;color:#3B6548">연결됨</span>' : '<span class="tag">연결 전</span>') +
      (e.fixed ? '' : '<button class="icon-btn sm" data-act="sns-remove" data-id="' + e.id + '" title="이 SNS 빼기" aria-label="이 SNS 빼기">' + icon('trash', 'sm') + '</button>') + '</div>';
    if (!snsOn(e)) {
      return '<div class="card social-card">' + head + '<form class="social-form" data-submit="social-connect" data-id="' + e.id + '"><input class="input" name="v" placeholder="' + esc(T.ph || '') + '" autocomplete="off" /><button class="btn primary" type="submit">연결</button></form>' +
        (e.type === 'naver' ? '<p class="social-note">블로그 주소 끝의 아이디만 넣어도 돼요. 예) blog.naver.com/<b>아이디</b></p>' : '') + '</div>';
    }
    const prof = snsProfile(e), write = snsWrite(e);
    const notes = {
      naver: '블로그에 올린 글 주소를 ‘게시물 가져오기’로 넣으면 활동 폴더에 차곡차곡 보관돼요. ‘글쓰기’를 누르면 블로그 글쓰기 화면이 열려요.',
      instagram: '게시물·릴스 주소를 ‘게시물 가져오기’로 넣으면 보관함에서 바로 볼 수 있어요. 앱에서 바로 올리기는 Meta 비즈니스 앱 심사가 필요해서, 캡션 복사 후 인스타그램 창을 여는 방식이에요.',
    };
    const at = ['instagram', 'tiktok', 'threads', 'x'].includes(e.type) ? '@' : '';
    return '<div class="card social-card">' + head +
      '<div class="social-profile">' + snsBadge(e.type, 'lg') + '<div style="flex:1;min-width:0"><b>' + esc(e.handle ? at + e.handle : snsName(e)) + '</b><small>' + esc(prof.replace(/^https?:\/\/(www\.)?/, '')) + '</small></div></div>' +
      '<div class="social-actions">' + (prof ? '<button class="btn sm" data-act="ext" data-url="' + esc(prof) + '">' + icon('external', 'sm') + ' 열기</button>' : '') +
      (write ? '<button class="btn sm" data-act="sns-write" data-id="' + e.id + '">' + icon('pencil', 'sm') + ' ' + esc(T.writeLabel || '게시하기') + '</button>' : '') +
      '<button class="btn sm" data-act="add-link" data-cat="act">' + icon('link', 'sm') + ' 게시물 가져오기</button>' +
      '<button class="btn ghost sm" data-act="social-off" data-id="' + e.id + '">연결 해제</button></div>' +
      (notes[e.type] ? '<p class="social-note">' + notes[e.type] + '</p>' : '') + '</div>';
  }

  function viewSocial() {
    return '<div class="page-head"><div><h2>' + icon('share', 'lg') + ' SNS 연동</h2><p>기관 네이버 블로그 · 인스타그램을 연결하고, 필요한 SNS는 ‘SNS 추가하기’로 더 넣을 수 있어요.</p></div>' +
      '<div class="toolbar"><button class="btn" data-act="sns-add">' + icon('plus') + '<span class="lbl">SNS 추가하기</span></button><button class="btn" data-act="add-link" data-cat="act">' + icon('link') + '<span class="lbl">게시물 가져오기</span></button><button class="btn accent" data-act="ai-open" data-tab="image">' + icon('image') + '<span class="lbl">홍보 사진 만들기</span></button></div></div>' +
      '<div class="social-grid">' + snsList().map(snsCard).join('') +
      '<button class="card social-card social-add" data-act="sns-add">' + icon('plus', 'lg') + '<b>SNS 추가하기</b><small>유튜브 · 틱톡 · 페이스북 · 스레드 · X · 카카오톡 채널 · 밴드 · 기타</small></button></div>' +
      '<div class="card social-flow"><b>' + icon('heart', 'sm') + ' 이렇게 쓰면 편해요</b><ol>' +
      '<li>활동 기록이나 사진에서 <b>SNS로 공유</b>를 눌러요. 홍보용 이미지가 필요하면 <b>마음기록 도우미 → 사진 만들기</b>로 만들 수 있어요.</li>' +
      '<li>공유 창에서 개인정보를 한 번 더 점검하고, 글을 복사한 뒤 블로그 글쓰기 · 인스타그램 화면을 열어 드려요. 휴대폰에서는 사진까지 앱으로 넘어가요.</li>' +
      '<li>올린 글 주소를 <b>게시물 가져오기</b>로 붙여 넣으면 ‘활동’ 폴더에 차곡차곡 쌓여요.</li></ol></div>';
  }
  function afterSocialRender() {}

  function socialConnect(id, v) {
    const e = snsList().find((x) => x.id === id); if (!e) return;
    if (!String(v || '').trim()) { toast('아이디나 주소를 입력해 주세요.', { type: 'warn' }); return; }
    const r = parseHandle(e.type, v);
    if (!r) { toast('아이디나 주소 형식을 확인해 주세요.', { type: 'warn' }); return; }
    Object.assign(e, r); save(); renderAll(); toast(snsName(e) + '을(를) 연결했어요.');
  }
  function openSnsAdd() {
    let type = 'youtube';
    const m = openModal({ title: 'SNS 추가하기', sub: '기관에서 쓰는 SNS를 골라 연결해 주세요.', size: 'mid', body:
      '<div class="sns-pick">' + ADDABLE.map((k) => '<button type="button" class="sns-pick-btn" data-type="' + k + '">' + snsBadge(k) + '<span>' + SNS_TYPES[k].name + '</span></button>').join('') + '</div>' +
      '<label class="field" id="saNameWrap" hidden><span>SNS 이름</span><input class="input" id="saName" placeholder="예) 티스토리 블로그, 네이버 카페" maxlength="20" /></label>' +
      '<label class="field"><span id="saLabel">계정 또는 주소</span><input class="input" id="saVal" autocomplete="off" /></label>',
      foot: '<button class="btn ghost" data-close>취소</button><button class="btn primary" data-ok>' + icon('plus', 'sm') + ' 추가하기</button>' });
    const sync = () => {
      m.el.querySelectorAll('.sns-pick-btn').forEach((b) => b.classList.toggle('on', b.dataset.type === type));
      m.el.querySelector('#saNameWrap').hidden = type !== 'custom';
      m.el.querySelector('#saVal').placeholder = SNS_TYPES[type].ph || '';
      m.el.querySelector('#saLabel').textContent = type === 'custom' ? '프로필 · 채널 주소' : SNS_TYPES[type].name + ' 계정 또는 주소';
    };
    sync();
    m.el.querySelector('.sns-pick').addEventListener('click', (ev) => { const b = ev.target.closest('[data-type]'); if (b) { type = b.dataset.type; sync(); m.el.querySelector(type === 'custom' ? '#saName' : '#saVal').focus(); } });
    m.el.querySelector('[data-ok]').onclick = () => {
      const val = m.el.querySelector('#saVal').value;
      const name = m.el.querySelector('#saName').value.trim();
      if (type === 'custom' && !name) { toast('SNS 이름을 적어 주세요.', { type: 'warn' }); m.el.querySelector('#saName').focus(); return; }
      const r = parseHandle(type, val);
      if (!r) { toast('계정이나 주소 형식을 확인해 주세요.', { type: 'warn' }); m.el.querySelector('#saVal').focus(); return; }
      S.social.list.push({ id: uid('sns'), type, name: type === 'custom' ? name : '', ...r });
      save(); m.close(true); go({ view: 'social' }); toast((type === 'custom' ? name : SNS_TYPES[type].name) + '을(를) 추가했어요.');
    };
  }

  /* ---------- SNS로 공유 ---------- */
  async function openShare({ title = '', text = '', docId = null } = {}) {
    const d = docId && docById(docId);
    let file = null;
    if (d && d.kind === 'file' && ftype(d).cls === 'img') { const b = await Store.getBlob(d.id); if (b) file = new File([b], d.name, { type: b.type || d.mime || 'image/png' }); }
    if (d && d.kind === 'note' && !text) text = d.content || '';
    if (d && d.kind === 'link' && !text) text = d.url;
    const canNative = !!navigator.share;
    const canFiles = !!(file && navigator.canShare && navigator.canShare({ files: [file] }));
    const targets = snsList().filter((e) => e.fixed || snsOn(e));
    const m = openModal({ title: 'SNS로 공유하기', sub: '글을 복사하고 올리기 화면을 열어 드려요.', size: 'mid', body:
      (file ? '<div class="share-file">' + icon('image', 'sm') + ' 첨부 사진 : <b>' + esc(d.name) + '</b>' + (canFiles ? '' : ' <span class="cell-muted">(PC에서는 사진을 직접 선택해 올려 주세요)</span>') + '</div>' : '') +
      '<label class="field"><span>글 · 캡션</span><textarea class="textarea" id="shText" style="min-height:200px">' + esc(text) + '</textarea></label><div id="shPii"></div>' +
      '<div class="share-grid">' + targets.map((e) => '<button class="share-btn" data-sh="' + e.id + '">' + snsBadge(e.type, 'sm') + '<b>' + esc(snsName(e)) + '</b><small>' + esc(e.handle ? e.handle : snsOn(e) ? '연결됨' : '복사 후 열기') + '</small></button>').join('') +
      (canNative ? '<button class="share-btn" data-sh="native">' + snsBadge('custom', 'sm') + '<b>휴대폰 앱으로</b><small>' + (canFiles ? '사진 + 글 함께' : '글 공유') + '</small></button>' : '') +
      '<button class="share-btn add" data-sh="add">' + icon('plus') + '<b>SNS 추가</b><small>다른 SNS 연결</small></button></div>',
      foot: '<button class="btn ghost" data-close>닫기</button><button class="btn" data-sh="copy">' + icon('copy', 'sm') + ' 글만 복사</button>' });
    const $t = m.el.querySelector('#shText');
    const piiCheck = () => {
      const hits = PII.scan($t.value).filter((h) => !h.info);
      m.el.querySelector('#shPii').innerHTML = hits.length
        ? '<div class="err-box" style="margin:0 0 12px">' + icon('shield', 'sm') + ' 글에 개인정보로 보이는 내용이 ' + hits.length + '곳 있어요: ' + esc([...new Set(hits.map((h) => h.kind))].join(', ')) + ' <button class="btn sm" data-sh="mask" style="margin-left:6px">가명 처리하기</button></div>'
        : '<div class="ok-box" style="margin:0 0 12px">' + icon('check', 'sm') + ' 글에서 눈에 띄는 개인정보는 없어요. 사진 속 얼굴·이름표도 한 번 더 확인해 주세요.</div>';
    };
    piiCheck(); $t.addEventListener('input', () => { clearTimeout($t._t); $t._t = setTimeout(piiCheck, 300); });
    const copy = async () => { try { await navigator.clipboard.writeText($t.value); } catch (e) { $t.select(); document.execCommand('copy'); } };
    m.el.addEventListener('click', async (ev) => {
      const b = ev.target.closest('[data-sh]'); if (!b) return;
      const a = b.dataset.sh;
      if (a === 'mask') { $t.value = PII.pseudonymize($t.value, PII.scan($t.value), 'alias'); piiCheck(); return; }
      if (a === 'copy') { await copy(); toast('글을 복사했어요.'); return; }
      if (a === 'add') { m.close(true); openSnsAdd(); return; }
      if (a === 'ai') { m.close(true); openAI('sns', { fields: { text: $t.value.slice(0, 4000), title: d ? d.name : title } }); return; }
      if (a === 'native') {
        try { await navigator.share(canFiles ? { files: [file], text: $t.value, title } : { text: $t.value, title }); toast('공유 창을 열었어요.'); }
        catch (err) { if (err.name !== 'AbortError') toast('공유하지 못했어요: ' + err.message, { type: 'warn' }); }
        return;
      }
      const e = snsList().find((x) => x.id === a); if (!e) return;
      await copy(); openExternal(snsWrite(e) || snsProfile(e));
      toast('글을 복사했어요. 열린 ' + snsName(e) + ' 화면에서 붙여 넣어 주세요.', { ms: 4500 });
    });
  }

  /* =========================================================
   * 8. 미리보기
   * ========================================================= */
  async function openPreview(id) {
    const d = docById(id); if (!d) return;
    const urls = [];
    const tags = d.tags.map((t) => `<span class="tag">#${esc(t)}</span>`).join(' ');
    const m = openModal({
      title: d.name, size: 'wide', bodyClass: 'preview-body',
      headExtra: ftypeBadge(d),
      body: `<div class="meta-strip"><span>${icon('folder', 'sm')} ${esc(pathLabel(d))}</span>${d.kind === 'link' ? '' : `<span>${fmtSize(d.size)}</span>`}<span>수정 ${fmtDate(d.updatedAt)}</span>${tags ? `<span>${tags}</span>` : ''}</div><div id="pvArea" style="flex:1;display:flex;flex-direction:column;min-height:0;overflow:auto"><div class="no-preview"><div class="thinking"><i></i><i></i><i></i> 문서를 펼치는 중이에요…</div></div></div>`,
      foot: `<div class="left"><button class="btn ghost sm" data-pv="delete">${icon('trash', 'sm')} 삭제</button><button class="btn ghost sm" data-pv="move">${icon('move', 'sm')} 옮기기</button><button class="btn ghost sm" data-pv="meta">${icon('tag', 'sm')} 이름·태그</button></div>
        <button class="btn sm star-btn ${d.favorite ? 'on' : ''}" data-pv="star">${icon('star', 'sm')} ${d.favorite ? '고정됨' : '즐겨찾기'}</button>
        
        <button class="btn sm" data-pv="download">${icon(d.kind === 'link' ? 'external' : 'download', 'sm')} ${d.kind === 'link' ? '새 탭에서 열기' : '내려받기'}</button>
        ${d.kind === 'note' || d.kind === 'link' || ftype(d).cls === 'img' ? `<button class="btn sm" data-pv="share">${icon('share', 'sm')} SNS 공유</button>` : ''}
        ${d.template ? `<button class="btn accent sm" data-pv="use">${icon('layout', 'sm')} 이 양식으로 작성</button>` : ''}
        ${d.kind === 'note' ? `<button class="btn primary sm" data-pv="edit">${icon('pencil', 'sm')} 편집하기</button>` : ''}`,
      onClose: () => urls.forEach((u) => URL.revokeObjectURL(u)),
    });
    m.el.querySelector('.modal-foot').addEventListener('click', async (e) => {
      const b = e.target.closest('[data-pv]'); if (!b) return;
      const a = b.dataset.pv;
      if (a === 'delete') { if (await deleteDoc(id)) m.close(true); }
      if (a === 'move') { m.close(true); moveDoc(id); }
      if (a === 'meta') { m.close(true); editMeta(id); }
      if (a === 'star') { toggleStar(id); b.classList.toggle('on', d.favorite); b.innerHTML = `${icon('star', 'sm')} ${d.favorite ? '고정됨' : '즐겨찾기'}`; }
      if (a === 'ai') { sendDocToAI(id, 'summary'); }
      if (a === 'download') downloadDoc(id, null, b);
      if (a === 'use') { m.close(true); useTemplate(id); }
      if (a === 'share') { openShare({ docId: id, title: d.name }); }
      if (a === 'edit') { m.close(true); openEditor({ doc: d }); }
    });
    const area = m.el.querySelector('#pvArea');
    const noPrev = (title, msg) => `<div class="no-preview">${EMPTY_ART}<b>${title}</b><p>${msg}</p><button class="btn primary sm" data-pv2="dl">${icon('download', 'sm')} 내려받아 열기</button></div>`;
    try {
      if (d.kind === 'note') { area.innerHTML = `<div class="paper">${linkify(esc(d.content || ''))}</div>`; return; }
      if (d.kind === 'link') {
        const info = parseSocial(d.url) || {};
        const p = PLAT[d.platform] || PLAT.web;
        area.innerHTML = info.embed ? `<div class="embed-wrap"><div class="embed-box ${d.platform}" style="aspect-ratio:${info.ratio || '16/9'}"><iframe src="${esc(info.embed)}" title="${esc(d.name)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div><a class="btn sm" href="${esc(d.url)}" target="_blank" rel="noopener">${icon('external', 'sm')} ${p.name}에서 보기</a></div>`
          : `<div class="no-preview"><span class="social-ico ${d.platform === 'web' ? 'web' : d.platform}" style="margin:0 auto">${icon(p.icon, 'lg')}</span><b>${esc(d.name)}</b><p style="word-break:break-all">${esc(d.url)}</p><a class="btn primary sm" href="${esc(d.url)}" target="_blank" rel="noopener">${icon('external', 'sm')} 새 탭에서 열기</a></div>`;
        return;
      }
      const blob = await Store.getBlob(d.id);
      if (!blob) { area.innerHTML = noPrev('파일 원본을 찾을 수 없어요', '브라우저 저장소가 지워졌을 수 있어요.'); return; }
      const t = ftype(d).cls;
      if (t === 'img') { const u = URL.createObjectURL(blob); urls.push(u); area.innerHTML = `<div class="preview-img"><img src="${u}" alt="${esc(d.name)}" /></div>`; }
      else if (d.ext === 'pdf') { const u = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' })); urls.push(u); area.innerHTML = `<iframe src="${u}#view=FitH" title="${esc(d.name)}"></iframe>`; }
      else if (textExt.includes(d.ext) && d.ext !== 'csv') { area.innerHTML = `<div class="paper">${esc(await blob.text())}</div>`; }
      else if (d.ext === 'docx') {
        const mm = await loadLib('mammoth');
        const r = await mm.convertToHtml({ arrayBuffer: await blob.arrayBuffer() });
        const tmp = document.createElement('div'); tmp.innerHTML = r.value;
        tmp.querySelectorAll('script,iframe,object,embed,style,link').forEach((n) => n.remove());
        tmp.querySelectorAll('*').forEach((n) => [...n.attributes].forEach((at) => { if (/^on/i.test(at.name) || (at.name === 'href' && /^\s*javascript:/i.test(at.value))) n.removeAttribute(at.name); }));
        area.innerHTML = `<div class="paper html">${tmp.innerHTML || '<p>(내용이 비어 있어요)</p>'}</div>`;
      } else if (['xlsx', 'xls', 'csv', 'ods'].includes(d.ext)) {
        const X = await loadLib('xlsx');
        const wb = d.ext === 'csv' ? X.read(await blob.text(), { type: 'string', raw: true }) : X.read(await blob.arrayBuffer(), { type: 'array' });
        const show = (name) => {
          const html = X.utils.sheet_to_html(wb.Sheets[name], { header: '', footer: '' });
          area.innerHTML = `<div class="sheet-tabs">${wb.SheetNames.map((n) => `<button class="btn sm ${n === name ? 'soft' : 'ghost'}" data-sheet="${esc(n)}">${esc(n)}</button>`).join('')}</div><div class="sheet-wrap">${html}</div>`;
          area.querySelectorAll('[data-sheet]').forEach((b) => (b.onclick = () => show(b.dataset.sheet)));
        };
        show(wb.SheetNames[0]);
      } else if (['hwp', 'hwpx'].includes(d.ext)) area.innerHTML = noPrev('한글(HWP) 파일은 브라우저에서 바로 볼 수 없어요', '내려받아 한컴오피스 한글이나 한컴독스에서 열어 주세요.');
      else area.innerHTML = noPrev('이 형식은 미리보기를 지원하지 않아요', '내려받아서 알맞은 프로그램으로 열어 주세요.');
    } catch (e) { area.innerHTML = noPrev('미리보기를 열지 못했어요', esc(e.message)); }
    area.addEventListener('click', (e) => { if (e.target.closest('[data-pv2="dl"]')) downloadDoc(id); });
  }

  /* =========================================================
   * 9. 에디터 (웹에서 직접 작성)
   * ========================================================= */
  let activeEditor = null;
  function useTemplate(id) {
    const t = docById(id); if (!t) return;
    const cur = currentLoc();
    let loc = cur;
    if (!loc) {
      const map = { 'tpl-counsel': '상담 일지', 'tpl-result': '프로그램 기획·결과보고', 'tpl-plan': '프로그램 기획·결과보고', 'tpl-visit': '현장 활동지', 'tpl-case': '사례관리 기록', 'tpl-official': '공문 (수신·발신)' };
      const f = map[t.tplId] && topFolderByName(t.cat, map[t.tplId]);
      loc = f ? { cat: f.cat, folderId: f.id } : { cat: t.cat, folderId: t.folderId };
    }
    openEditor({ preset: { name: `${t.name.replace(/^\[양식\]\s*/, '')}_${dotDate()}`, content: t.content, tags: t.tags.filter((x) => x !== '양식'), ...loc } });
  }
  function pickTemplate() {
    const tpls = S.docs.filter((d) => d.template);
    const m = openModal({ title: '어떤 양식으로 시작할까요?', sub: '고르면 바로 작성 화면이 열려요.', size: 'mid',
      foot: `<button class="btn ghost" data-close>닫기</button><button class="btn primary" data-tplnew>${icon('plus', 'sm')} 양식 추가하기</button>`,
      body: `<div class="tool-grid">${tpls.map((d) => `<button class="tool-card" data-tpl="${d.id}"><span class="t-ico">${icon(d.tplIcon || 'fileText')}</span><span><b>${esc(d.name.replace(/^\[양식\]\s*/, ''))}</b><small>${esc(d.desc || pathLabel(d))}</small></span></button>`).join('')}</div>` });
    m.el.querySelector('.modal-body').addEventListener('click', (e) => { const b = e.target.closest('[data-tpl]'); if (b) { m.close(true); useTemplate(b.dataset.tpl); } });
    m.el.querySelector('[data-tplnew]').onclick = () => { m.close(true); openTemplateMaker(); };
  }

  /* ---------- 양식 추가하기 (AI가 양식 생성) ---------- */
  function openTemplateMaker() {
    const cur = currentLoc();
    const defF = topFolderByName('activity', '양식 모음');
    const loc = cur || { cat: 'activity', folderId: defF ? defF.id : null };
    const m = openModal({ title: '양식 추가하기', sub: '양식 종류와 특징을 적어 주시면 AI가 빈 양식을 만들어 드려요.', size: 'wide', bodyClass: 'tpl-maker-body', body: `
      <div class="tpl-maker">
        <div class="tpl-left">
          <label class="field"><span>양식 종류</span><input class="input" id="tmKind" placeholder="예) 자원봉사자 활동 일지, 후원물품 접수증, 가정방문 체크리스트" maxlength="60" /></label>
          <label class="field"><span>양식 특징 · 요청사항 (프롬프트)</span><textarea class="textarea" id="tmFeat" style="min-height:150px" placeholder="예) 봉사자 서명란과 담당자 확인란 넣어 줘. 활동시간 합계 칸, 안전교육 이수 체크박스 포함. A4 한 장 분량으로."></textarea></label>
          <div class="seg" id="tmChips">${['서명·결재란 포함', '체크박스 위주', '표 형식으로', 'A4 한 장 분량', '개인정보 동의 문구 포함', '노인·장애인 등 대상자 맞춤'].map((c) => '<button type="button" data-chip="' + c + '">+ ' + c + '</button>').join('')}</div>
          <label class="field" style="margin-top:14px"><span>보관할 위치</span><select class="select" id="tmLoc">${folderOptions(loc.cat, loc.folderId)}</select></label>
          <button class="btn accent block" id="tmRun">${icon('sparkle', 'sm')} AI로 양식 만들기</button>
          <p class="cell-muted" style="font-size:12px;margin:8px 0 0">만들어진 양식은 오른쪽에서 바로 고친 뒤 저장할 수 있어요.</p>
        </div>
        <div class="tpl-right">
          <input class="editor-title" id="tmName" placeholder="[양식] 이름이 여기에 나타나요" maxlength="60" />
          <input class="input" id="tmDesc" placeholder="한 줄 설명" maxlength="60" style="height:38px;font-size:13.5px" />
          <textarea class="editor-text" id="tmBody" placeholder="왼쪽에 양식 종류와 특징을 적고 ‘AI로 양식 만들기’를 눌러 주세요."></textarea>
        </div>
      </div>`,
      foot: `<button class="btn ghost" data-close>닫기</button><button class="btn primary" id="tmSave" disabled>${icon('save', 'sm')} 양식으로 저장</button>` });
    const E = (id) => m.el.querySelector('#' + id);
    let ctrl = null; let busy = false;
    m.el.querySelector('#tmChips').addEventListener('click', (e) => { const b = e.target.closest('[data-chip]'); if (!b) return; const t = E('tmFeat'); t.value = (t.value.trim() ? t.value.trim() + ' ' : '') + b.dataset.chip + '.'; b.classList.add('on'); t.focus(); });
    const syncSave = () => { E('tmSave').disabled = busy || !E('tmBody').value.trim(); };
    E('tmBody').addEventListener('input', syncSave);
    E('tmRun').onclick = async () => {
      const kind = E('tmKind').value.trim(), feat = E('tmFeat').value.trim();
      if (!kind && !feat) { toast('양식 종류나 특징을 먼저 적어 주세요.', { type: 'warn' }); E('tmKind').focus(); return; }
      busy = true; syncSave();
      E('tmRun').disabled = true; E('tmRun').innerHTML = '<span class="thinking" style="gap:6px"><i></i><i></i><i></i></span> 양식을 만들고 있어요…';
      E('tmBody').value = '';
      try {
        const r = await MaeumAI.template({ kind, features: feat, onToken: (p, all) => { const sep = all.indexOf('---'); E('tmBody').value = sep >= 0 ? all.slice(sep + 3).replace(/^\s+/, '') : all; E('tmBody').scrollTop = E('tmBody').scrollHeight; } });
        E('tmName').value = r.name; E('tmDesc').value = r.desc; E('tmBody').value = r.body;
        toast('양식을 만들었어요. 확인하고 저장해 주세요.');
      } catch (e) { toast(e.message || String(e), { type: 'warn', ms: 5000 }); }
      busy = false; syncSave();
      E('tmRun').disabled = false; E('tmRun').innerHTML = icon('refresh', 'sm') + ' 다시 만들기';
    };
    m.beforeClose = async () => !E('tmBody').value.trim() || m.saved || confirmBox('만든 양식을 저장하지 않았어요. 그래도 닫을까요?', { ok: '닫기', cancel: '계속 보기' });
    E('tmSave').onclick = () => {
      const body = E('tmBody').value.trim(); if (!body) return;
      let name = E('tmName').value.trim() || '[양식] ' + (E('tmKind').value.trim() || '새 양식');
      if (!/^\[양식\]/.test(name)) name = '[양식] ' + name;
      const l = parseLoc(E('tmLoc').value);
      const d = { id: uid('d'), kind: 'note', name, ext: 'txt', mime: 'text/plain', content: body, size: new Blob([body]).size, cat: l.cat, folderId: l.folderId, tags: ['양식', 'AI생성'], favorite: true, template: true, tplIcon: 'sparkle', desc: E('tmDesc').value.trim() || (E('tmKind').value.trim() + ' 양식'), createdAt: now(), updatedAt: now() };
      S.docs.push(d); save(); m.saved = true; m.close(true);
      if (route.view === 'templates') renderAll(); else go({ view: 'templates' });
      toast('양식 템플릿에 추가했어요.', { action: { label: '이 양식으로 작성', fn: () => useTemplate(d.id) } });
    };
    setTimeout(() => E('tmKind').focus(), 50);
  }

  function openEditor({ doc = null, preset = {} } = {}) {
    const isNew = !doc;
    const loc = doc ? { cat: doc.cat, folderId: doc.folderId } : { cat: preset.cat || currentLoc()?.cat || 'activity', folderId: preset.folderId ?? currentLoc()?.folderId ?? null };
    const tpls = S.docs.filter((d) => d.template);
    const m = openModal({
      title: isNew ? '새 기록 작성' : '기록 편집', size: 'wide', bodyClass: 'preview-body',
      body: `<div class="editor">
        <div class="editor-main">
          <input class="editor-title" id="edTitle" placeholder="제목을 입력해 주세요" value="${esc(doc ? doc.name : preset.name || '')}" maxlength="80" />
          <div class="row-2"><select class="select" id="edLoc" aria-label="보관 위치">${folderOptions(loc.cat, loc.folderId)}</select>
            <input class="input" id="edTags" placeholder="태그 (쉼표로 구분) 예) 상담, 초기상담" value="${esc((doc ? doc.tags : preset.tags || []).join(', '))}" /></div>
          <textarea class="editor-text" id="edText" placeholder="오늘의 기록을 차곡차곡 적어 볼까요?\n키워드만 적고 오른쪽 ‘상담 일지로 정리’를 눌러도 좋아요.">${esc(doc ? doc.content : preset.content || '')}</textarea>
          <div class="word-count" id="edCount"></div>
        </div>
        <div class="editor-side">
          <h5>양식 불러오기</h5>
          <select class="select" id="edTpl" style="height:38px;font-size:13px;margin-bottom:16px"><option value="">양식 선택…</option>${tpls.map((t) => `<option value="${t.id}">${esc(t.name.replace(/^\[양식\]\s*/, ''))}</option>`).join('')}</select>
          <h5>내보내기</h5>
          <button class="side-tool" data-ed="doc">${icon('fileText', 'sm')} 한글·워드용 (.doc)</button>
          <button class="side-tool" data-ed="txt">${icon('file', 'sm')} 텍스트 (.txt)</button>
          <button class="side-tool" data-ed="print">${icon('printer', 'sm')} 인쇄 / PDF</button>
        </div>
      </div>`,
      foot: `<div class="left"><span class="word-count">Ctrl + S 로 저장할 수 있어요</span></div><button class="btn ghost" data-close>닫기</button><button class="btn primary" data-ed="save">${icon('save', 'sm')} 저장하기</button>`,
      onClose: () => { activeEditor = null; updateAIInsertButtons(); },
    });
    const $t = m.el.querySelector('#edTitle'), $x = m.el.querySelector('#edText'), $c = m.el.querySelector('#edCount');
    const initial = JSON.stringify([$t.value, $x.value, m.el.querySelector('#edTags').value, m.el.querySelector('#edLoc').value]);
    const isDirty = () => JSON.stringify([$t.value, $x.value, m.el.querySelector('#edTags').value, m.el.querySelector('#edLoc').value]) !== initial && !m.saved;
    const count = () => { $c.textContent = `${$x.value.length.toLocaleString()}자 · ${isNew && !m.docId ? '아직 저장 전이에요' : '저장된 문서'}`; };
    count(); $x.addEventListener('input', count);
    m.beforeClose = async () => !isDirty() || confirmBox('저장하지 않은 내용이 있어요. 그래도 닫을까요?', { ok: '닫기', cancel: '계속 쓰기' });
    let target = doc;
    const doSave = () => {
      const name = $t.value.trim() || `제목 없는 기록_${dotDate()}`;
      const l = parseLoc(m.el.querySelector('#edLoc').value);
      const content = $x.value;
      if (!target) {
        target = { id: uid('d'), kind: 'note', name, ext: 'txt', mime: 'text/plain', cat: l.cat, folderId: l.folderId, tags: [], favorite: false, template: false, createdAt: now() };
        S.docs.push(target); m.docId = target.id;
      }
      Object.assign(target, { name, content, cat: l.cat, folderId: l.folderId, tags: parseTags(m.el.querySelector('#edTags').value), size: new Blob([content]).size, updatedAt: now() });
      save(); renderAll(); m.saved = true; m.close(true);
      toast(`‘${name}’을(를) 저장했어요.`, route.view === 'folder' && route.cat === l.cat && route.folderId === l.folderId ? {} : { action: { label: '가 보기', fn: () => go({ view: 'folder', ...l }) } });
    };
    m.el.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); doSave(); } });
    m.el.querySelector('#edTpl').addEventListener('change', async (e) => {
      const t = docById(e.target.value); e.target.value = ''; if (!t) return;
      if ($x.value.trim()) {
        const replace = await confirmBox('지금 적힌 내용을 양식으로 바꿀까요?\n‘아래에 붙이기’를 고르면 기존 내용은 그대로 둬요.', { ok: '양식으로 바꾸기', cancel: '아래에 붙이기' });
        $x.value = replace ? t.content : `${$x.value}\n\n${t.content}`;
      } else $x.value = t.content;
      if (!$t.value.trim()) $t.value = `${t.name.replace(/^\[양식\]\s*/, '')}_${dotDate()}`;
      count();
    });
    m.el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-ed]'); if (!b) return;
      const a = b.dataset.ed;
      const text = $x.value.trim();
      const fake = { name: $t.value.trim() || '기록', content: $x.value };
      if (a === 'save') return doSave();
      if (a === 'doc') return downloadBlob(noteAsDoc(fake), safeName(fake.name) + '.doc');
      if (a === 'txt') return downloadBlob(new Blob(['\ufeff' + fake.content], { type: 'text/plain;charset=utf-8' }), safeName(fake.name) + '.txt');
      if (a === 'print') return printText(fake.name, fake.content);
      if (!text) { toast('먼저 본문에 내용을 적어 주세요.', { type: 'warn' }); $x.focus(); return; }
      if (a === 'memo') openAI('memo', { fields: { memo: text }, autorun: true });
      if (a === 'polish') openAI('summary', { fields: { text, title: fake.name, style: 'polish' }, autorun: true });
      if (a === 'summary') openAI('summary', { fields: { text, title: fake.name, style: 'brief' }, autorun: true });
      if (a === 'privacy') openAI('privacy', { fields: { text, title: fake.name }, autorun: false, quickScan: true });
    });
    activeEditor = { textarea: $x, count, modal: m };
    updateAIInsertButtons();
    setTimeout(() => (doc || preset.content ? $x : $t).focus(), 50);
  }

  /* =========================================================
   * 10. 개인정보 점검 (기기 안에서 1차 탐지)
   * ========================================================= */
  const PII = (() => {
    const SURN = new Set('김이박최정강조윤장임한오서신권황안송류유전홍고문양손배백허남심노하곽성차주우구민진나지엄채원천방공현함변염여추도소석선설마길연위표명기반왕금옥육인맹제모탁국어은편용예봉경사부'.split(''));
    const STOP = new Set(('이번 이웃 정기 정서 장보기 조금 한부모 오늘 신청 고민 문제 주민 전화 가족 기관 수급 선생 사회 대상 보호 어머 아버 할머 할아 이모 고모 삼촌 형님 동생 언니 오빠 누나 자녀 아들 손자 손녀 부모 남편 아내 부인 사장 과장 팀장 관장 부장 실장 원장 주임 대리 담임 교수 의사 간호 환자 고객 손님 이용자 회원 참여자 장애 노인 아동 청소년 학생 주무관 동장 통장 반장 이장 공무원 복지사 상담 상담사 강사 봉사자 후원자 선배 후배 친구 이분 저분 그분 여러분 모두 우리 전체 신규 기존 정규 임시 방문 유선 도움 성인 우선 고령 주변 지역 마을 동네 기초 차상위 주거 고립 안부 정신 신체 건강 경제 교육 문화 여가 이후 이전 당일 금일 지난 다음 이상 이하 부친 모친 조부 조모 배우자 형제 자매 이용 진행 한분 한명 두분 세분 각자 본인 당사자 가명 성함 어르 대상자 보호자 사례 사례관리 담당 담당자 직원 강사님 기사 민원 신청인 주인 집주인 사모 이사장 원생 반원 조원 회장 총무 지원 지원자 신입 전문 조카 사촌 손주 사위 장모 장인 시어 시아 방문객 교장 교감 원감 소장 국장 차장 계장 주사 서기 박사 석사 도사 신부 수녀 목사 신랑 아드 따님 모녀 부녀 부자 모자 노부 노모 전담 주치 구청 시청 동사 경찰 소방 간호사 요양 보호사 생활 관리 관리사 기관장 대표 대표님').split(' '));
    const SIDO = '(?:서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)(?:특별시|광역시|특별자치시|특별자치도|도|시)?';
    const rules = [
      { kind: '주민등록번호', lv: 'high', re: /(?<!\d)\d{6}\s?-\s?[1-8]\d{6}(?!\d)/g, mask: (m) => m.replace(/^(\d{6}\s?-\s?[1-8])\d{6}$/, '$1******') },
      { kind: '휴대전화', lv: 'high', re: /(?<!\d)01[016789][-.\s]?\d{3,4}[-.\s]?\d{4}(?!\d)/g, mask: (m) => m.replace(/^(01\d)([-.\s]?)\d{3,4}([-.\s]?)(\d{4})$/, '$1$2****$3$4') },
      { kind: '전화번호', lv: 'mid', re: /(?<!\d)0(?:2|[3-6][1-5]|70)[-.)\s]\s?\d{3,4}[-.\s]\d{4}(?!\d)/g, mask: (m) => m.replace(/(\d{3,4})([-.\s])(\d{4})$/, '****$2$3') },
      { kind: '이메일', lv: 'mid', re: /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, mask: (m) => m.replace(/^([^@]{1,2})[^@]*/, '$1***') },
      { kind: '계좌번호', lv: 'high', re: /(?<![\d-])\d{2,6}-\d{2,6}-\d{2,8}(?:-\d{1,3})?(?![\d-])/g, test: (m) => m.replace(/\D/g, '').length >= 10 && !/^01[016789]/.test(m), mask: (m) => m.replace(/\d/g, '*') },
      { kind: '주소', lv: 'high', re: new RegExp(`${SIDO}(?:\\s+[가-힣]{1,6}(?:시|군|구))+(?:\\s+[가-힣0-9]{1,12}(?:동|읍|면|리|로|길|가))*(?:\\s*\\d+(?:-\\d+)?(?:번지|번길)?)?(?:\\s*,?\\s*[가-힣A-Za-z]*\\s*\\d+동)?(?:\\s*\\d+호)?`, 'g'), mask: (m) => m.split(/\s+/).slice(0, 2).join(' ') + ' ○○○' },
      { kind: '주소', lv: 'high', re: /(?<![가-힣])[가-힣0-9]{2,12}(?:로|길)\s?\d+(?:번길\s?\d+)?(?:-\d+)?(?:\s*,?\s*\d+동)?(?:\s*\d+호)?(?=[\s,.)\]]|$)/g, mask: () => '○○로 ○○' },
      { kind: '동·호수', lv: 'mid', re: /(?<!\d)\d{1,4}동\s?\d{1,4}호/g, mask: () => '○○동 ○○호' },
      { kind: '생년월일', lv: 'mid', re: /(?:생년월일|출생|생일)\s*[:：]?\s*((?:19|20)?\d{2}\s?[.\-/년]\s?\d{1,2}\s?[.\-/월]\s?\d{1,2}일?)/g, group: 1, mask: (m) => m.replace(/\d/g, '○') },
    ];
    const SENSITIVE = /(우울증|조현병|치매|정신과|정신질환|장애\s?\d급|장애등급|중증장애|기초생활수급|수급자|차상위|HIV|알코올\s?의존|자살\s?(?:시도|사고|위험)|자해|가정폭력|성폭력|아동학대|노인학대|학대|전과|채무|신용불량|파산|이혼|임신)/g;

    function names(text) {
      const found = new Map();
      const add = (n) => { if (!n || STOP.has(n) || STOP.has(n.slice(0, 2))) return; found.set(n, (found.get(n) || 0)); };
      let m;
      const lab = /(?:성\s?명|이\s?름|성함|대상자|보호자|클라이언트|내담자|신청인|의뢰인|아동명)\s*[:：]\s*([가-힣]{2,4})(?![가-힣])/g;
      while ((m = lab.exec(text))) add(m[1]);
      const suf = /(?<![가-힣])([가-힣]{2,4})(?=\s?(?:님|씨|어르신|할머니|할아버지|아동|학생|대상자|보호자|어머니|아버지|군(?![가-힣])|양(?![가-힣])))/g;
      while ((m = suf.exec(text))) {
        const n = m[1];
        if (n.length === 4 && !/^(남궁|황보|제갈|선우|독고|사공|서문)/.test(n)) continue;
        if (!SURN.has(n[0])) continue;
        add(n);
      }
      return [...found.keys()];
    }

    function scan(text) {
      const hits = [];
      const taken = [];
      const overlaps = (s, e) => taken.some(([a, b]) => s < b && e > a);
      for (const r of rules) {
        r.re.lastIndex = 0; let m;
        while ((m = r.re.exec(text))) {
          if (!m[0]) { r.re.lastIndex++; continue; }
          let str = m[0], start = m.index;
          if (r.group) { str = m[r.group]; start = m.index + m[0].lastIndexOf(str); }
          str = str.replace(/[\s,]+$/, '');
          const end = start + str.length;
          if (r.test && !r.test(str)) continue;
          if (overlaps(start, end)) continue;
          taken.push([start, end]);
          hits.push({ kind: r.kind, lv: r.lv, text: str, start, end, rep: r.mask(str) });
        }
      }
      const ns = names(text);
      ns.forEach((n) => {
        let i = 0;
        while ((i = text.indexOf(n, i)) >= 0) {
          const before = text[i - 1];
          const e = i + n.length;
          if (!(before && /[가-힣]/.test(before)) && !overlaps(i, e)) { taken.push([i, e]); hits.push({ kind: '성명', lv: 'high', text: n, start: i, end: e, rep: null, name: n }); }
          i = e;
        }
      });
      SENSITIVE.lastIndex = 0; let m;
      while ((m = SENSITIVE.exec(text))) hits.push({ kind: '민감정보', lv: 'low', text: m[0], start: m.index, end: m.index + m[0].length, rep: null, info: true });
      return hits.sort((a, b) => a.start - b.start);
    }
    function group(hits) {
      const g = new Map();
      hits.forEach((h) => { const k = h.kind + '|' + h.text; if (!g.has(k)) g.set(k, { ...h, count: 0 }); g.get(k).count++; });
      const order = { high: 0, mid: 1, low: 2 };
      return [...g.values()].sort((a, b) => order[a.lv] - order[b.lv]);
    }
    function pseudonymize(text, hits, style = 'alias') {
      const alias = new Map(); const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const nameRep = (n) => {
        if (style === 'mask') return n[0] + '○'.repeat(n.length - 1);
        if (!alias.has(n)) alias.set(n, `대상자${letters[alias.size] || alias.size + 1}`);
        return alias.get(n);
      };
      let out = ''; let pos = 0;
      hits.filter((h) => !h.info).sort((a, b) => a.start - b.start).forEach((h) => {
        if (h.start < pos) return;
        out += text.slice(pos, h.start) + (h.name ? nameRep(h.name) : h.rep);
        pos = h.end;
      });
      return out + text.slice(pos);
    }
    const summary = (hits) => group(hits).map((g) => `- ${g.kind}: ${g.text} (${g.count}회)`).join('\n');
    return { scan, group, pseudonymize, summary };
  })();

  /* =========================================================
   * 11. 마음기록 도우미 패널
   * ========================================================= */
  const AI_TABS = [
    { id: 'search', label: '검색해서 알려줘', icon: 'search' },
    { id: 'image', label: '사진 만들기', icon: 'image' },
  ];
  const AIS = {};
  ['search', 'image', 'memo', 'report', 'summary', 'privacy', 'sns', 'chat'].forEach((id) => (AIS[id] = { fields: {}, result: '', status: 'idle', error: '', ctrl: null }));
  AIS.search.history = [];
  AIS.image.fields = { style: '따뜻한 일러스트', ratio: '1:1' };
  AIS.image.items = [];
  AIS.memo.fields = { date: todayStr(), type: '초기상담' };
  AIS.summary.fields = { style: 'brief' };
  AIS.privacy.fields = { mask: 'alias' };
  AIS.sns.fields = { platform: 'all', tone: '따뜻하고 다정하게' };
  AIS.chat.history = [];

  function openAI(tab = ui.aiTab, { fields, autorun = false, quickScan = false } = {}) {
    ui.aiOpen = true; ui.aiTab = tab;
    if (fields) {
      if (tab === 'summary' || tab === 'privacy') { AIS[tab].result = ''; AIS[tab].status = 'idle'; AIS[tab].local = null; }
      Object.assign(AIS[tab].fields, fields);
    }
    document.body.classList.add('ai-open'); $('#aiPanel').setAttribute('aria-hidden', 'false'); bringFront($('#aiPanel'));
    renderAI();
    if (autorun) runAI(tab);
    else if (quickScan) quickScanPII();
  }
  function closeAI() { ui.aiOpen = false; document.body.classList.remove('ai-open'); $('#aiPanel').setAttribute('aria-hidden', 'true'); }

  function engineStatus() {
    const s = MaeumAI.getSettings();
    const def = MaeumAI.MODES[s.mode];
    return { label: MaeumAI.engineLabel(), needKey: def.needsKey && !aiKeyKnown[s.mode], mode: s.mode };
  }
  const aiKeyKnown = {};
  async function refreshKeyKnown() { for (const k of Object.keys(MaeumAI.MODES)) aiKeyKnown[k] = await MaeumAI.hasKey(k); }

  function renderAI() {
    const st = engineStatus();
    const usage = st.mode === 'builtin' ? `오늘 ${MaeumAI.usage()}/${MaeumAI.dailyCap}회 사용` : '';
    $('#aiPanel').innerHTML = `
      <div class="ai-head">${helperAva()}<div style="flex:1;min-width:0"><b>마음기록 도우미</b><small><span class="dot ${st.needKey ? 'off' : ''}"></span>${st.needKey ? '연결 키가 필요해요 · 설정에서 입력' : '언제든 편하게 맡겨 주세요'}</small></div>
        <button class="icon-btn sm" data-act="settings" title="도우미 연결 설정" aria-label="도우미 연결 설정">${icon('settings')}</button>
        <button class="icon-btn sm" data-act="ai-close" aria-label="도우미 닫기">${icon('x')}</button></div>
      <div class="ai-tabs" role="tablist">${AI_TABS.map((t) => `<button class="ai-tab ${ui.aiTab === t.id ? 'on' : ''}" role="tab" data-act="ai-tab" data-tab="${t.id}">${icon(t.icon, 'sm')}${t.label}</button>`).join('')}</div>
      <div class="ai-body" id="aiBody">${aiTabBody(ui.aiTab)}</div>
      <div class="ai-foot"><span>AI 답변과 이미지는 꼭 확인한 뒤 사용해 주세요.</span><span id="aiUsage">${usage}</span></div>`;
    updateAIInsertButtons();
  }
  function renderAIBody() { if (!ui.aiOpen) return; const b = $('#aiBody'); if (!b) return; const y = b.scrollTop; b.innerHTML = aiTabBody(ui.aiTab); b.scrollTop = y; updateAIInsertButtons(); const u = $('#aiUsage'); if (u && engineStatus().mode === 'builtin') u.textContent = `오늘 ${MaeumAI.usage()}/${MaeumAI.dailyCap}회 사용`; }

  const fv = (tab, k) => esc(AIS[tab].fields[k] ?? '');
  const seg = (tab, key, opts) => `<div class="seg">${opts.map(([v, l]) => `<button type="button" class="${(AIS[tab].fields[key] ?? '') === v ? 'on' : ''}" data-act="ai-seg" data-f="${key}" data-v="${esc(v)}">${l}</button>`).join('')}</div>`;
  function loadDocSelect(tab, target) {
    const docs = S.docs.filter((d) => canExtract(d) && !d.template).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 60);
    return `<div class="load-doc"><select class="select" data-change="ai-load" data-target="${target}" aria-label="보관함 문서 불러오기"><option value="">보관함 문서에서 불러오기…</option>${docs.map((d) => `<option value="${d.id}">${esc(d.name)} · ${esc(CATS[d.cat].name)}</option>`).join('')}</select></div>`;
  }

  /* ---------- 검색해서 알려줘 ---------- */
  function citeLinks(html, sources) {
    if (!sources || !sources.length) return html;
    return html.replace(/\[(\d+(?:\s*,\s*\d+)*)\]/g, (m, nums) => nums.split(/\s*,\s*/).map((n) => { const s = sources[+n - 1]; return s ? '<a class="cite" href="' + esc(s.uri) + '" target="_blank" rel="noopener" title="' + esc(s.title) + '">' + n + '</a>' : ''; }).join(''));
  }
  const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return u; } };
  function searchBody() {
    const h = AIS.search.history;
    const busy = AIS.search.status === 'loading';
    const intro = h.length ? '' : '<div class="ai-intro"><b>궁금한 걸 편하게 물어보세요.</b> 인터넷에서 찾아 읽어 본 뒤, 출처 번호와 함께 알려 드려요. 제도·일정·금액은 공식 사이트를 먼저 살펴요.</div>' +
      '<div class="suggests">' + ['2027년 사회복지사 1급 시험 일정 알려줘', '올해 사회복지시설 인건비 가이드라인 바뀐 점', '노인맞춤돌봄서비스 대상 기준이 뭐야?', '사회복지사 보수교육 면제·유예 조건'].map((q) => '<button data-act="search-suggest" data-q="' + esc(q) + '">' + esc(q) + '</button>').join('') + '</div>';
    const thread = h.map((m, i) => {
      if (m.role === 'user') return '<div class="bubble me">' + esc(m.content) + '</div>';
      const body = m.content ? citeLinks(md(m.content), m.sources || []) : '<div class="thinking"><i></i><i></i><i></i> ' + esc(m.status || '인터넷에서 찾고 있어요…') + '</div>';
      const src = !m.streaming && m.sources && m.sources.length ? '<div class="sources"><b>' + icon('search', 'sm') + ' 찾아본 자료</b>' + m.sources.map((s, k) => '<a href="' + esc(s.uri) + '" target="_blank" rel="noopener"><span class="n">' + (k + 1) + '</span><span class="t">' + esc(s.title) + '</span><span class="d">' + esc(hostOf(s.uri)) + '</span></a>').join('') + '</div>' : '';
      const note = !m.streaming && m.content && m.searched === false ? '<div class="cell-muted" style="font-size:12px;margin-top:8px">인터넷 검색 결과를 가져오지 못해 알고 있는 범위에서 답했어요. 공식 사이트에서 한 번 더 확인해 주세요.</div>' : '';
      const tools = !m.streaming && m.content ? '<div style="display:flex;gap:4px;margin-top:8px;flex-wrap:wrap"><button class="btn ghost sm" data-act="search-copy" data-i="' + i + '">' + icon('copy', 'sm') + ' 복사</button><button class="btn ghost sm" data-act="search-save" data-i="' + i + '">' + icon('save', 'sm') + ' 문서로 저장</button></div>' : '';
      return '<div class="bubble ai"><div class="md' + (m.streaming && m.content ? ' typing' : '') + '"' + (m.streaming ? ' id="searchStream"' : '') + '>' + body + '</div>' + note + src + tools + (m.error ? '<div class="err-box">' + esc(m.error) + '</div>' : '') + '</div>';
    }).join('');
    return intro + '<div class="chat">' + thread + '</div>' +
      '<form class="chat-input" data-submit="search-send"><textarea class="textarea" name="q" rows="1" placeholder="무엇이든 물어보세요. 인터넷에서 찾아 드릴게요" data-f="draft">' + fv('search', 'draft') + '</textarea>' +
      (busy ? '<button class="btn" type="button" disabled>' + icon('search', 'sm') + '</button>' : '<button class="btn accent" type="submit" aria-label="검색해서 묻기">' + icon('send', 'sm') + '</button>') + '</form>' +
      (h.length && !busy ? '<div style="text-align:center;margin-top:8px"><button class="btn ghost sm" data-act="search-clear">' + icon('refresh', 'sm') + ' 새 질문 시작</button></div>' : '');
  }
  async function runSearch(q) {
    q = String(q || '').trim(); if (!q) return;
    const st = AIS.search; if (st.status === 'loading') return;
    const history = [];
    st.history.filter((m) => m.content && !m.error).slice(-6).forEach((m) => history.push({ role: m.role, content: m.content }));
    st.history.push({ role: 'user', content: q });
    const msg = { role: 'assistant', content: '', streaming: true, status: '인터넷에서 찾고 있어요…', sources: [] };
    st.history.push(msg); st.fields.draft = ''; st.status = 'loading';
    renderAIBody(); const b = $('#aiBody'); b && (b.scrollTop = b.scrollHeight);
    try {
      const r = await MaeumAI.search({ question: q, history, onStatus: (t) => { msg.status = t; if (!msg.content) renderAIBody(); }, onToken: (p, all) => { msg.content = all; paintStream('search'); } });
      msg.content = r.text; msg.sources = r.sources; msg.searched = r.searched;
    } catch (e) { msg.error = e.message || String(e); }
    msg.streaming = false; st.status = 'idle';
    if (!msg.content && !msg.error) msg.error = '답을 받지 못했어요. 다시 물어봐 주세요.';
    renderAIBody(); const b2 = $('#aiBody'); b2 && (b2.scrollTop = b2.scrollHeight);
  }
  const searchPlain = (m) => plainForSave(m.content) + (m.sources && m.sources.length ? '\n\n[출처]\n' + m.sources.map((s, k) => (k + 1) + '. ' + s.title + ' - ' + s.uri).join('\n') : '');

  /* ---------- 사진 만들기 ---------- */
  function imageBody() {
    const st = AIS.image; const busy = st.status === 'loading';
    const items = st.items.map((it, i) => '<div class="img-card"><img src="' + it.url + '" alt="' + esc(it.prompt) + '" /><p>' + esc(it.prompt) + '</p><div class="img-acts"><button class="btn ghost sm" data-act="img-dl" data-i="' + i + '">' + icon('download', 'sm') + ' 내려받기</button><button class="btn ghost sm" data-act="img-save" data-i="' + i + '">' + icon('save', 'sm') + ' 보관함에 저장</button><button class="btn ghost sm" data-act="img-share" data-i="' + i + '">' + icon('share', 'sm') + ' SNS로 공유</button></div></div>').join('');
    return '<div class="ai-intro"><b>어떤 사진이 필요한지 적어 주세요.</b> 홍보물 · 블로그 · 인스타그램에 쓸 이미지를 만들어 드려요. 한국어로 편하게 적으면 돼요.</div>' +
      '<label class="field"><span>만들고 싶은 장면</span><textarea class="textarea" data-f="prompt" style="min-height:110px" placeholder="예) 복지관 프로그램실에서 어르신들이 허브 화분을 가꾸며 웃는 장면">' + fv('image', 'prompt') + '</textarea></label>' +
      '<div class="field"><span>스타일</span>' + seg('image', 'style', [['실제 사진처럼, 자연광', '사진처럼'], ['따뜻한 일러스트', '일러스트'], ['부드러운 수채화', '수채화'], ['깔끔한 홍보 포스터 디자인', '포스터']]) + '</div>' +
      '<div class="field"><span>비율</span>' + seg('image', 'ratio', [['1:1', '정사각 1:1'], ['16:9', '가로 16:9'], ['3:4', '세로 3:4'], ['9:16', '스토리 9:16']]) + '</div>' +
      '<div class="ai-actions">' + (busy ? '<button class="btn" disabled><span class="thinking" style="gap:6px"><i></i><i></i><i></i></span> 그리는 중…</button>' : '<button class="btn accent" data-act="img-run">' + icon('image', 'sm') + ' 사진 만들기</button>') + '<span class="cell-muted" style="font-size:12px">보통 10~40초 걸려요</span></div>' +
      (st.error ? '<div class="err-box">' + esc(st.error) + '</div>' : '') +
      '<div class="img-list">' + (busy ? '<div class="img-card loading"><div class="thinking"><i></i><i></i><i></i> 사진을 그리고 있어요…</div></div>' : '') + items + '</div>' +
      '<p class="social-note" style="margin-top:14px">무료 이미지 생성 서비스를 써서 사진 오른쪽 아래에 작은 표시가 들어가요. 실제 인물·현장 사진으로 오해되지 않도록 게시할 때 ‘AI로 만든 이미지’라고 밝혀 주세요.</p>';
  }
  async function runImage() {
    const st = AIS.image; const prompt = String(st.fields.prompt || '').trim();
    if (!prompt) { toast('만들고 싶은 장면을 먼저 적어 주세요.', { type: 'warn' }); const el = $('#aiBody [data-f="prompt"]'); el && el.focus(); return; }
    if (st.status === 'loading') return;
    st.status = 'loading'; st.error = ''; renderAIBody();
    try {
      const r = await MaeumAI.image({ prompt, style: st.fields.style, ratio: st.fields.ratio });
      st.items.unshift({ blob: r.blob, url: URL.createObjectURL(r.blob), prompt, at: now() });
    } catch (e) { st.error = e.message || String(e); }
    st.status = 'idle'; renderAIBody();
  }
  async function saveImageItem(i, thenShare) {
    const it = AIS.image.items[i]; if (!it) return null;
    const f = topFolderByName('act', 'SNS 홍보') || topFolderByName('act', '현장 활동 소식');
    const loc = thenShare ? { cat: 'act', folderId: f ? f.id : null } : await pickFolder('사진 보관하기', { cat: 'act', folderId: f ? f.id : null, sub: '어느 폴더에 넣어 둘까요?' });
    if (!loc) return null;
    if (it.docId && docById(it.docId)) return it.docId;
    const ext = (it.blob.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
    const d = { id: uid('d'), kind: 'file', name: 'AI사진_' + dotDate() + '_' + String(AIS.image.items.length - i).padStart(2, '0') + '.' + ext, ext, mime: it.blob.type, size: it.blob.size, cat: loc.cat, folderId: loc.folderId, tags: ['AI이미지'], favorite: false, template: false, desc: it.prompt, createdAt: now(), updatedAt: now() };
    await Store.putBlob(d.id, it.blob); S.docs.push(d); save(); renderSidebar(); if (route.view === 'folder') renderMain();
    it.docId = d.id;
    if (!thenShare) toast('보관함에 저장했어요.', { action: { label: '열어 보기', fn: () => openPreview(d.id) } });
    return d.id;
  }

  function aiTabBody(tab) {
    if (tab === 'search') return searchBody();
    if (tab === 'image') return imageBody();
    const st = AIS[tab];
    const running = st.status === 'loading' || st.status === 'streaming';
    const runBtn = (label) => running
      ? `<button class="btn" data-act="ai-stop">${icon('stop', 'sm')} 멈추기</button>`
      : `<button class="btn accent" data-act="ai-run" data-tab="${tab}">${icon('sparkle', 'sm')} ${label}</button>`;
    if (tab === 'memo') return `
      <div class="ai-intro"><b>거친 메모도 괜찮아요.</b> 현장에서 적은 키워드나 받아 적은 말을 넣으면 사실·진술·의견을 나눠 상담 일지 형식으로 정리해 드릴게요.</div>
      <div class="row-2"><label class="field"><span>상담일자</span><input class="input" type="date" data-f="date" value="${fv(tab, 'date')}" /></label>
      <label class="field"><span>대상자 표기 (가명)</span><input class="input" data-f="client" value="${fv(tab, 'client')}" placeholder="예) 대상자A" /></label></div>
      <div class="field"><span>상담 유형</span>${seg(tab, 'type', [['초기상담', '초기'], ['정기상담', '정기'], ['위기상담', '위기'], ['전화상담', '전화'], ['가정방문', '방문']])}</div>
      <label class="field"><span>현장 메모</span>${loadDocSelect(tab, 'memo')}<textarea class="textarea" data-f="memo" placeholder="예) 무릎 통증 심해짐, 외출 줄어듦 / 장보기 어려움 호소 / 냉장고 비어 있음 / 딸과 연락 월 1회 / 밑반찬 지원 희망 / 2주 후 재방문">${fv(tab, 'memo')}</textarea></label>
      <div class="ai-actions">${runBtn('상담 일지로 정리하기')}<button class="btn ghost sm" data-act="ai-clear" data-tab="${tab}">지우기</button></div>
      ${resultBox(tab)}`;
    if (tab === 'report') return `
      <div class="ai-intro"><b>프로그램 개요만 알려 주세요.</b> 사업 개요부터 성과·평가·향후 계획까지 결과보고서 초안을 잡아 드려요. 모르는 숫자는 [확인 필요]로 비워 둘게요.</div>
      <label class="field"><span>프로그램명</span><input class="input" data-f="title" value="${fv(tab, 'title')}" placeholder="예) 어르신 마음건강 원예교실" /></label>
      <div class="row-2"><label class="field"><span>일시 · 장소</span><input class="input" data-f="when" value="${fv(tab, 'when')}" placeholder="예) 11.4~11.25 매주 화, 2층 프로그램실" /></label>
      <label class="field"><span>대상 · 참여 인원</span><input class="input" data-f="target" value="${fv(tab, 'target')}" placeholder="예) 독거 어르신 12명" /></label></div>
      <label class="field"><span>목적 · 목표</span><input class="input" data-f="goal" value="${fv(tab, 'goal')}" placeholder="예) 정서 안정, 사회적 관계 형성" /></label>
      <label class="field"><span>진행 내용</span>${loadDocSelect(tab, 'content')}<textarea class="textarea" data-f="content" placeholder="회기별 활동, 진행 방식 등을 자유롭게 적어 주세요.">${fv(tab, 'content')}</textarea></label>
      <label class="field"><span>성과 · 특이사항 · 만족도</span><textarea class="textarea" data-f="result" style="min-height:80px" placeholder="예) 평균 출석률 90%, 만족도 4.6점, 참여자 간 안부 전화 모임 생김">${fv(tab, 'result')}</textarea></label>
      <div class="ai-actions">${runBtn('결과보고서 초안 만들기')}<button class="btn ghost sm" data-act="ai-clear" data-tab="${tab}">지우기</button></div>
      ${resultBox(tab)}`;
    if (tab === 'summary') return `
      <div class="ai-intro"><b>긴 공문·회의록도 한눈에.</b> 핵심만 추리거나, 해야 할 일과 기한만 표로 뽑거나, 기록 문체로 다듬어 드려요.</div>
      <div class="field"><span>정리 방식</span>${seg(tab, 'style', [['brief', '핵심 3줄'], ['detail', '개조식 상세'], ['todo', '할 일·기한 추출'], ['polish', '문장 다듬기']])}</div>
      <label class="field"><span>문서 제목</span><input class="input" data-f="title" value="${fv(tab, 'title')}" placeholder="예) 2026년 노인맞춤돌봄 운영 안내 공문" /></label>
      <label class="field"><span>본문</span>${loadDocSelect(tab, 'text')}<textarea class="textarea" data-f="text" style="min-height:180px" placeholder="문서 내용을 붙여 넣거나 위에서 보관함 문서를 불러오세요. (PDF·HWP는 내용을 복사해 붙여 넣어 주세요)">${fv(tab, 'text')}</textarea></label>
      <div class="ai-actions">${runBtn(AIS.summary.fields.style === 'polish' ? '문장 다듬기' : '요약하기')}<button class="btn ghost sm" data-act="ai-clear" data-tab="${tab}">지우기</button></div>
      ${resultBox(tab)}`;
    if (tab === 'privacy') return `
      <div class="ai-intro"><b>공유 전에 한 번 더.</b> 이름·연락처·주소·주민번호 같은 개인정보를 먼저 <b>이 기기 안에서</b> 찾아 드리고, 원하시면 도우미가 꼼꼼히 다시 살펴 가명 처리 초안을 만들어 드려요.</div>
      <label class="field"><span>점검할 기록</span>${loadDocSelect(tab, 'text')}<textarea class="textarea" data-f="text" style="min-height:170px" placeholder="예) 홍길동 어르신(010-1234-5678)은 서울시 마포구 성산동 12-3에 거주하며…">${fv(tab, 'text')}</textarea></label>
      <div class="field"><span>가명 처리 방식</span>${seg(tab, 'mask', [['alias', '대상자A·B로 바꾸기'], ['mask', '홍○○처럼 가리기']])}</div>
      <div class="ai-actions"><button class="btn primary" data-act="pii-scan">${icon('shield', 'sm')} 빠른 점검 (기기 안에서)</button>${runBtn('도우미에게 꼼꼼히 맡기기')}</div>
      ${piiLocalBox()}
      ${resultBox(tab)}`;
    if (tab === 'sns') return `
      <div class="ai-intro"><b>활동을 SNS 홍보글로.</b> 네이버 블로그 글과 인스타그램 캡션을 한 번에 만들어요. 추가한 SNS용 글도 고를 수 있어요. 실명·연락처는 자동으로 빼고 써요.</div>
      <div class="field"><span>플랫폼</span>${seg(tab, 'platform', [['all', '블로그 + 인스타'], ['naver', '네이버 블로그'], ['instagram', '인스타그램']].concat(snsList().filter((e) => !e.fixed).map((e) => ['x:' + snsName(e), esc(snsName(e))])))}</div>
      <label class="field"><span>활동명</span><input class="input" data-f="title" value="${fv(tab, 'title')}" placeholder="예) 초록 화요일 원예교실" /></label>
      <label class="field"><span>활동 내용</span>${loadDocSelect(tab, 'text')}<textarea class="textarea" data-f="text" placeholder="누가, 언제, 무엇을 했고 어떤 변화가 있었는지 편하게 적어 주세요.">${fv(tab, 'text')}</textarea></label>
      <div class="field"><span>분위기</span>${seg(tab, 'tone', [['따뜻하고 다정하게', '따뜻하게'], ['밝고 경쾌하게', '경쾌하게'], ['신뢰감 있게 정보 중심으로', '정보 중심'], ['감동적인 이야기 형식으로', '이야기형']])}</div>
      <label class="field"><span>기관·계정명 (선택)</span><input class="input" data-f="org" value="${fv(tab, 'org')}" placeholder="예) 마음복지관 @maeum_welfare" /></label>
      <div class="ai-actions">${runBtn('홍보글 만들기')}<button class="btn ghost sm" data-act="ai-clear" data-tab="${tab}">지우기</button></div>
      ${resultBox(tab)}`;
    if (tab === 'chat') {
      const h = AIS.chat.history;
      return `${h.length ? '' : `<div class="ai-intro"><b>무엇이든 편하게 물어보세요.</b> 기록 문체, 공문 작성, 사례 개입 아이디어처럼 업무 고민을 함께 나눠요.</div>
        <div class="suggests">${['사례기록에서 피해야 할 표현을 알려 주세요', '가정방문 때 확인할 안전 항목을 정리해 주세요', '후원 물품 요청 공문 초안을 써 주세요', '슈퍼비전 때 정리하면 좋은 질문 목록'].map((q) => `<button data-act="chat-suggest" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>`}
        <div class="chat">${h.map((m, i) => m.role === 'user' ? `<div class="bubble me">${esc(m.content)}</div>` : `<div class="bubble ai"><div class="md ${m.streaming ? 'typing' : ''}" ${m.streaming ? 'id="chatStream"' : ''}>${m.content ? md(m.content) : '<div class="thinking"><i></i><i></i><i></i> 생각을 정리하고 있어요…</div>'}</div>${!m.streaming && m.content ? `<div style="display:flex;gap:4px;margin-top:8px"><button class="btn ghost sm" data-act="chat-copy" data-i="${i}">${icon('copy', 'sm')} 복사</button><button class="btn ghost sm" data-act="chat-save" data-i="${i}">${icon('save', 'sm')} 문서로 저장</button></div>` : ''}${m.error ? `<div class="err-box">${esc(m.error)}</div>` : ''}</div>`).join('')}</div>
        <form class="chat-input" data-submit="chat-send"><textarea class="textarea" name="q" rows="1" placeholder="마음기록 도우미에게 물어보기…" data-f="draft">${fv('chat', 'draft')}</textarea>
          ${AIS.chat.status === 'streaming' || AIS.chat.status === 'loading' ? `<button class="btn" type="button" data-act="ai-stop">${icon('stop', 'sm')}</button>` : `<button class="btn accent" type="submit" aria-label="보내기">${icon('send', 'sm')}</button>`}</form>
        ${h.length ? `<div style="text-align:center;margin-top:8px"><button class="btn ghost sm" data-act="chat-clear">${icon('refresh', 'sm')} 새 대화 시작</button></div>` : ''}`;
    }
    return '';
  }

  function resultBox(tab) {
    const st = AIS[tab];
    if (st.status === 'idle') return '';
    if (st.status === 'loading') return `<div class="result"><div class="result-body"><div class="thinking"><i></i><i></i><i></i> 마음기록 도우미가 차근차근 정리하고 있어요…</div></div></div>`;
    if (st.status === 'error') return `<div class="err-box">${esc(st.error)}<div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap"><button class="btn sm" data-act="ai-run" data-tab="${tab}">${icon('refresh', 'sm')} 다시 시도</button><button class="btn ghost sm" data-act="settings">연결 설정 열기</button></div></div>`;
    const streaming = st.status === 'streaming';
    return `<div class="result" id="aiResult-${tab}">
      <div class="result-head">${icon('sparkle', 'sm')} ${st.localOnly ? '가명 처리본 (기기 안에서 처리)' : '정리된 초안'}<span class="sp"></span>${streaming ? `<button class="btn ghost sm" data-act="ai-stop">${icon('stop', 'sm')} 멈추기</button>` : ''}</div>
      <div class="result-body md ${streaming ? 'typing' : ''}">${st.localOnly ? `<div style="white-space:pre-wrap">${esc(st.result)}</div>` : md(st.result)}</div>
      ${streaming ? '' : `<div class="result-foot">
        <button class="btn soft sm" data-act="ai-save" data-tab="${tab}">${icon('save', 'sm')} 문서로 저장</button>
        <button class="btn sm" data-act="ai-copy" data-tab="${tab}">${icon('copy', 'sm')} 복사</button>
        <button class="btn sm" data-act="ai-to-editor" data-tab="${tab}">${icon('pencil', 'sm')} 편집기로 열기</button>
        ${tab === 'sns' ? `<button class="btn accent sm" data-act="ai-share" data-tab="${tab}">${icon('share', 'sm')} SNS로 공유</button>` : ''}
        <button class="btn sm ed-insert" data-act="ai-insert" data-tab="${tab}" hidden>${icon('fileText', 'sm')} 작성 중인 문서에 넣기</button>
        ${st.localOnly ? '' : `<button class="btn ghost sm" data-act="ai-run" data-tab="${tab}">${icon('refresh', 'sm')} 다시 만들기</button>`}
      </div>`}
    </div>`;
  }
  function updateAIInsertButtons() { $$('.ed-insert').forEach((b) => (b.hidden = !activeEditor)); }

  function piiLocalBox() {
    const L = AIS.privacy.local;
    if (!L) return '';
    if (!L.groups.length) return `<div class="ok-box">${icon('check', 'sm')} 자동 탐지로는 눈에 띄는 개인정보가 없어요. 그래도 별명·학교·직장처럼 사람을 알아볼 수 있는 정보가 있는지 한 번 더 살펴 주세요.</div>`;
    const lvLabel = { high: '높음', mid: '중간', low: '참고' };
    return `<div class="findings"><div class="findings-head">${icon('shield', 'sm')} 기기 안에서 찾은 항목 ${L.groups.length}종 · ${L.hits.length}곳</div>
      ${L.groups.map((g) => `<div class="finding"><span class="kind lv-${g.lv}">${esc(g.kind)}</span><code title="${esc(g.text)}">${esc(g.text)}${g.count > 1 ? ` · ${g.count}회` : ''}</code><span class="lv lv-${g.lv}" style="font-size:12px;font-weight:700">${lvLabel[g.lv]}</span></div>`).join('')}
      <div style="padding:10px 12px;display:flex;gap:6px;flex-wrap:wrap;background:#FDFCFA"><button class="btn soft sm" data-act="pii-mask">${icon('wand', 'sm')} 가명 처리본 만들기</button><span class="cell-muted" style="align-self:center;font-size:12px">민감정보(건강·수급 등)는 표시만 하고 바꾸지 않아요.</span></div></div>`;
  }
  function quickScanPII() {
    const text = AIS.privacy.fields.text || '';
    if (!text.trim()) { toast('점검할 기록을 먼저 넣어 주세요.', { type: 'warn' }); return; }
    const hits = PII.scan(text);
    AIS.privacy.local = { hits, groups: PII.group(hits) };
    renderAIBody();
  }
  function maskPII() {
    const text = AIS.privacy.fields.text || '';
    const L = AIS.privacy.local || { hits: PII.scan(text) };
    const st = AIS.privacy;
    st.result = PII.pseudonymize(text, L.hits, st.fields.mask || 'alias');
    st.status = 'done'; st.localOnly = true;
    renderAIBody();
    setTimeout(() => { const r = $('#aiResult-privacy'); r && r.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
  }

  let streamRaf = 0;
  function paintStream(tab) {
    if (streamRaf) return;
    streamRaf = requestAnimationFrame(() => {
      streamRaf = 0;
      if (!ui.aiOpen || ui.aiTab !== tab) return;
      if (tab === 'search') { const el = $('#searchStream'); const last = AIS.search.history[AIS.search.history.length - 1]; if (el && last) el.innerHTML = citeLinks(md(last.content), last.sources || []); }
      else if (tab === 'chat') { const el = $('#chatStream'); const last = AIS.chat.history[AIS.chat.history.length - 1]; if (el && last) el.innerHTML = md(last.content); }
      else { const el = $(`#aiResult-${tab} .result-body`); if (el) el.innerHTML = md(AIS[tab].result); }
      const b = $('#aiBody'); if (b && b.scrollHeight - b.scrollTop - b.clientHeight < 160) b.scrollTop = b.scrollHeight;
    });
  }

  const REQUIRED = { memo: ['memo', '정리할 현장 메모를 먼저 적어 주세요.'], report: ['content', '진행 내용을 조금이라도 적어 주세요.'], summary: ['text', '요약할 문서 내용을 넣어 주세요.'], privacy: ['text', '점검할 기록을 먼저 넣어 주세요.'], sns: ['text', '활동 내용을 조금이라도 적어 주세요.'] };
  async function runAI(tab) {
    const st = AIS[tab];
    const req = REQUIRED[tab];
    if (req && !String(st.fields[req[0]] || '').trim() && !(tab === 'report' && st.fields.title)) {
      toast(req[1], { type: 'warn' }); const el = $(`#aiBody [data-f="${req[0]}"]`); el && el.focus(); return;
    }
    st.ctrl && st.ctrl.abort();
    const ctrl = new AbortController(); st.ctrl = ctrl;
    st.status = 'loading'; st.result = ''; st.error = ''; st.localOnly = false;
    renderAIBody();
    setTimeout(() => { const r = $('#aiBody .result'); r && r.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 30);
    let task = tab; const fields = { ...st.fields };
    if (tab === 'summary' && fields.style === 'polish') task = 'polish';
    if (tab === 'privacy') { const hits = PII.scan(fields.text); st.local = { hits, groups: PII.group(hits) }; fields.localFindings = PII.summary(hits); }
    if (tab === 'memo') fields.worker = S.settings.userName || '';
    if (tab === 'sns' && String(fields.platform || '').startsWith('x:')) fields.platformName = fields.platform.slice(2);
    try {
      await MaeumAI.run({ task, fields, signal: ctrl.signal, onToken: (piece, all) => {
        st.result = all;
        if (st.status !== 'streaming') { st.status = 'streaming'; renderAIBody(); } else paintStream(tab);
      } });
      st.status = st.result.trim() ? 'done' : 'error';
      if (!st.result.trim()) st.error = '도우미가 빈 답을 보냈어요. 다시 시도해 주세요.';
    } catch (e) {
      if (e.name === 'AbortError') st.status = st.result ? 'done' : 'idle';
      else { st.status = 'error'; st.error = e.message || String(e); }
    }
    if (st.ctrl === ctrl) st.ctrl = null;
    renderAIBody();
  }
  async function chatSend(q) {
    q = (q || '').trim(); if (!q) return;
    const C = AIS.chat;
    if (C.status === 'loading' || C.status === 'streaming') return;
    const history = C.history.filter((m) => m.content && !m.error).map((m) => ({ role: m.role, content: m.content })).slice(-10);
    C.history.push({ role: 'user', content: q });
    const msg = { role: 'assistant', content: '', streaming: true };
    C.history.push(msg); C.fields.draft = ''; C.status = 'loading';
    renderAIBody(); const b = $('#aiBody'); b && (b.scrollTop = b.scrollHeight);
    const ctrl = new AbortController(); C.ctrl = ctrl;
    try {
      await MaeumAI.run({ task: 'chat', fields: { text: q }, history, signal: ctrl.signal, onToken: (p, all) => { msg.content = all; C.status = 'streaming'; paintStream('chat'); } });
    } catch (e) { if (e.name !== 'AbortError') msg.error = e.message; }
    msg.streaming = false; C.status = 'idle'; C.ctrl = null;
    if (!msg.content && !msg.error) msg.error = '답을 받지 못했어요. 다시 시도해 주세요.';
    renderAIBody(); const b2 = $('#aiBody'); b2 && (b2.scrollTop = b2.scrollHeight);
  }

  function aiSaveDefaults(tab) {
    const f = AIS[tab].fields;
    const fold = (cat, name) => { const x = topFolderByName(cat, name); return { cat, folderId: x ? x.id : null }; };
    if (tab === 'memo') return { name: `상담일지_${f.client || '대상자'}_${(f.date || todayStr()).replace(/-/g, '.')}`, ...fold('activity', '상담 일지'), tags: ['상담', f.type || '상담일지'].filter(Boolean) };
    if (tab === 'report') return { name: `결과보고서_${f.title || '프로그램'}`, ...fold('activity', '프로그램 기획·결과보고'), tags: ['프로그램', '결과보고'] };
    if (tab === 'sns') return { name: `SNS 홍보글_${f.title || '활동'}_${dotDate()}`, ...fold('act', 'SNS 홍보'), tags: ['SNS', '홍보'] };
    if (tab === 'privacy') return { name: `가명처리_${f.title || '사례기록'}_${dotDate()}`, ...fold('activity', '사례관리 기록'), tags: ['가명처리'] };
    if (tab === 'summary') {
      const src = f.srcId && docById(f.srcId);
      const loc = src ? { cat: src.cat, folderId: src.folderId } : { cat: 'general', folderId: null };
      return { name: `${f.style === 'polish' ? '다듬은 기록' : '요약'}_${f.title || '문서'}`.slice(0, 70), ...loc, tags: [f.style === 'polish' ? '다듬기' : '요약'] };
    }
    return { name: `도우미 답변_${dotDate()}`, cat: 'general', folderId: null, tags: ['도우미'] };
  }
  function saveAIText(text, defs) {
    const m = openModal({ title: '문서로 저장하기', sub: '저장 후에도 언제든 편집할 수 있어요.', body: `
      <label class="field"><span>문서 이름</span><input class="input" id="asName" value="${esc(defs.name)}" maxlength="80" /></label>
      <label class="field"><span>보관할 위치</span><select class="select" id="asLoc">${folderOptions(defs.cat, defs.folderId)}</select></label>
      <label class="field"><span>태그</span><input class="input" id="asTags" value="${esc((defs.tags || []).join(', '))}" /></label>`,
      foot: `<button class="btn ghost" data-close>취소</button><button class="btn primary" data-ok>${icon('save', 'sm')} 저장하기</button>` });
    m.el.querySelector('[data-ok]').onclick = () => {
      const l = parseLoc(m.el.querySelector('#asLoc').value);
      const d = { id: uid('d'), kind: 'note', name: m.el.querySelector('#asName').value.trim() || defs.name, ext: 'txt', mime: 'text/plain', content: text, size: new Blob([text]).size, cat: l.cat, folderId: l.folderId, tags: parseTags(m.el.querySelector('#asTags').value), favorite: false, template: false, createdAt: now(), updatedAt: now() };
      S.docs.push(d); save(); renderAll(); m.close(true);
      toast('보관함에 저장했어요.', { action: { label: '열어 보기', fn: () => openPreview(d.id) } });
    };
  }
  const plainForSave = (s) => String(s).replace(/\*\*(.+?)\*\*/g, '$1').replace(/^#{1,4}\s*/gm, '').replace(/\n{3,}/g, '\n\n').trim();
  async function copyText(t) {
    try { await navigator.clipboard.writeText(t); toast('복사했어요. 원하는 곳에 붙여 넣어 주세요.'); }
    catch (e) { const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); toast('복사했어요.'); }
  }

  // 이미 이스케이프된 문자열의 URL만 링크로 바꿈
  const linkify = (s) => s.replace(/(https?:\/\/[^\s<>&]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');

  /* ---------- 미니 마크다운 (안전: 먼저 이스케이프) ---------- */
  function md(src) {
    const lines = esc(src || '').split('\n');
    let html = ''; let list = null; let table = [];
    const inline = (s) => s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>');
    const flushList = () => { if (list) { html += `</${list}>`; list = null; } };
    const flushTable = () => {
      if (!table.length) return;
      const rows = table.filter((r) => !/^\s*\|?[\s:|-]+\|?\s*$/.test(r)).map((r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => inline(c.trim())));
      if (rows.length) html += `<table><thead><tr>${rows[0].map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.slice(1).map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
      table = [];
    };
    for (const raw of lines) {
      const line = raw.replace(/\s+$/, '');
      if (/^\s*\|.*\|\s*$/.test(line)) { flushList(); table.push(line); continue; }
      flushTable();
      let m;
      if ((m = /^\s*####\s+(.*)/.exec(line))) { flushList(); html += `<h4>${inline(m[1])}</h4>`; }
      else if ((m = /^\s*###\s+(.*)/.exec(line))) { flushList(); html += `<h3>${inline(m[1])}</h3>`; }
      else if ((m = /^\s*#{1,2}\s+(.*)/.exec(line))) { flushList(); html += `<h2>${inline(m[1])}</h2>`; }
      else if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) { flushList(); html += '<hr>'; }
      else if ((m = /^\s*[-*•]\s+(.*)/.exec(line))) { if (list !== 'ul') { flushList(); html += '<ul>'; list = 'ul'; } html += `<li>${inline(m[1])}</li>`; }
      else if ((m = /^\s*(\d+)[.)]\s+(.*)/.exec(line))) { if (list !== 'ol') { flushList(); html += '<ol>'; list = 'ol'; } html += `<li>${inline(m[2])}</li>`; }
      else if (!line.trim()) { flushList(); }
      else { flushList(); html += `<p>${inline(line)}</p>`; }
    }
    flushList(); flushTable();
    return html;
  }

  /* =========================================================
   * 12. 설정 · 백업
   * ========================================================= */
  async function sha256(s) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join(''); }

  async function openSettings() {
    await refreshKeyKnown();
    const s = MaeumAI.getSettings();
    const modeOpts = Object.entries(MaeumAI.MODES).map(([k, v]) => `<option value="${k}" ${k === s.mode ? 'selected' : ''}>${v.label}</option>`).join('');
    const m = openModal({ title: '설정 · 백업', size: 'mid', body: `
      <div class="section-head"><h3>${icon('heart')} 내 정보</h3></div>
      ${currentUser ? `<div class="account-row">${currentUser.photoURL ? `<img src="${esc(currentUser.photoURL)}" alt="" referrerpolicy="no-referrer" />` : ''}<div style="flex:1;min-width:0"><b>${esc(currentUser.displayName || '')}</b><small>${esc(currentUser.email || '')} · Google 계정으로 로그인됨</small></div><button class="btn ghost sm" id="stLogout">${icon('logout', 'sm')} 로그아웃</button></div>` : ''}
      <label class="field"><span>부르는 이름</span><input class="input" id="stName" value="${esc(S.settings.userName)}" placeholder="예) 김민지 (홈 화면 인사와 상담자란에 쓰여요)" maxlength="20" /></label>

      <div class="section-head section"><h3>${helperAva()} 마음기록 도우미 연결</h3></div>
      <label class="field"><span>연결 방식</span><select class="select" id="stMode">${modeOpts}</select><small id="stModeHint"></small></label>
      <label class="field" id="stEpWrap"><span>엔드포인트 주소</span><input class="input" id="stEp" value="${esc(s.endpoint)}" placeholder="" /></label>
      <label class="field" id="stKeyWrap"><span>연결 키 (API Key)</span><input class="input" id="stKey" type="password" autocomplete="off" placeholder="" /><small>키는 이 브라우저 안에 암호화되어 보관되고, 화면이나 다른 곳에 다시 표시되지 않아요.</small></label>
      <label class="field" id="stModelWrap"><span>모델 (선택)</span><input class="input" id="stModel" value="${esc(s.model)}" placeholder="" /></label>
      <div class="ai-actions" style="margin-bottom:6px"><button class="btn soft sm" id="stTest">${icon('sparkle', 'sm')} 연결 확인</button><button class="btn ghost sm" id="stKeyDel">저장된 키 지우기</button><span id="stTestOut" class="cell-muted" style="white-space:normal"></span></div>

      <div class="section-head section"><h3>${icon('lock')} 개인정보 보호 모드</h3></div>
      <div class="row-2"><label class="field"><span>잠금 PIN (숫자 4~8자리)</span><input class="input" id="stPin" type="password" inputmode="numeric" maxlength="8" placeholder="${S.settings.pinHash ? '설정됨 · 바꾸려면 새로 입력' : '비워 두면 버튼만 눌러 열려요'}" /></label>
      <label class="field"><span>자동 잠금</span><select class="select" id="stAuto">${[[0, '사용 안 함'], [3, '3분 동안 움직임 없으면'], [5, '5분'], [10, '10분'], [30, '30분']].map(([v, l]) => `<option value="${v}" ${Number(S.settings.autoLockMin) === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label></div>
      ${S.settings.pinHash ? `<button class="btn ghost sm" id="stPinDel" style="margin-top:-6px">PIN 해제하기</button>` : ''}

      <div class="section-head section"><h3>${icon('database')} 데이터 백업</h3></div>
      <p class="cell-muted" style="white-space:normal;margin:0 0 10px">서류는 이 기기의 브라우저(IndexedDB)에 보관돼요. 브라우저 기록을 지우면 사라질 수 있으니 가끔 백업 파일을 받아 두세요.</p>
      <div class="ai-actions"><button class="btn sm" id="stExport">${icon('download', 'sm')} 백업 파일 받기</button><button class="btn sm" id="stImport">${icon('upload', 'sm')} 백업 불러오기</button><button class="btn ghost sm" id="stReset" style="color:var(--danger)">${icon('trash', 'sm')} 모두 초기화</button></div>
      <input type="file" id="stImportFile" accept="application/json,.json" hidden />`,
      foot: `<button class="btn ghost" data-close>닫기</button><button class="btn primary" id="stSave">${icon('save', 'sm')} 저장하기</button>` });
    const E = (id) => m.el.querySelector('#' + id);
    const sync = () => {
      const mode = E('stMode').value; const def = MaeumAI.MODES[mode];
      E('stEpWrap').hidden = !def.needsEndpoint;
      E('stKeyWrap').hidden = !(def.needsKey || mode === 'custom');
      E('stModelWrap').hidden = mode === 'custom';
      E('stEp').placeholder = def.endpointHint || '';
      E('stModel').placeholder = def.defaultModel ? `기본값: ${def.defaultModel}` : '';
      E('stKey').placeholder = aiKeyKnown[mode] ? '저장됨 · 바꾸려면 새로 입력' : (mode === 'custom' ? '필요할 때만 입력 (Bearer)' : '키를 붙여 넣어 주세요');
      E('stKeyDel').hidden = !aiKeyKnown[mode];
      E('stModeHint').textContent = {
        builtin: '키 없이 바로 쓸 수 있는 기본 연결이에요. 이 브라우저에서 하루 80회까지 사용할 수 있어요.',
        openai: '기관 게이트웨이나 OpenAI 호환 주소(…/v1)를 넣어 주세요. /chat/completions 로 요청해요.',
        gemini: 'Google AI Studio에서 발급한 키로 직접 연결해요.',
        anthropic: 'Anthropic 콘솔에서 발급한 키로 직접 연결해요.',
        custom: '{ task, system, messages } JSON을 POST로 보내고 { text } 응답을 받아요.',
      }[mode];
    };
    sync(); E('stMode').addEventListener('change', sync);
    const applyAI = async () => {
      const mode = E('stMode').value;
      MaeumAI.saveSettings({ mode, endpoint: E('stEp').value.trim(), model: E('stModel').value.trim() });
      const k = E('stKey').value.trim();
      if (k) { await MaeumAI.setKey(mode, k); E('stKey').value = ''; aiKeyKnown[mode] = true; }
    };
    E('stTest').onclick = async () => {
      await applyAI(); sync();
      E('stTestOut').textContent = '확인하는 중이에요…';
      try { const r = await MaeumAI.test(); E('stTestOut').innerHTML = `<span style="color:var(--primary-dark);font-weight:600">${icon('check', 'sm')} 연결되었어요</span> ${esc(r.slice(0, 40))}`; }
      catch (e) { E('stTestOut').innerHTML = `<span style="color:var(--danger)">${esc(e.message)}</span>`; }
      if (ui.aiOpen) renderAI();
    };
    E('stKeyDel').onclick = async () => { const mode = E('stMode').value; await MaeumAI.setKey(mode, ''); aiKeyKnown[mode] = false; sync(); toast('저장된 키를 지웠어요.'); };
    if (E('stPinDel')) E('stPinDel').onclick = () => { S.settings.pinHash = ''; S.settings.pinSalt = ''; save(); E('stPinDel').remove(); E('stPin').placeholder = '비워 두면 버튼만 눌러 열려요'; toast('PIN을 해제했어요.'); };
    E('stSave').onclick = async () => {
      const pin = E('stPin').value.trim();
      if (pin && !/^\d{4,8}$/.test(pin)) { toast('PIN은 숫자 4~8자리로 정해 주세요.', { type: 'warn' }); E('stPin').focus(); return; }
      S.settings.userName = E('stName').value.trim();
      S.settings.autoLockMin = Number(E('stAuto').value);
      if (pin) { S.settings.pinSalt = uid('s'); S.settings.pinHash = await sha256(S.settings.pinSalt + pin); }
      await applyAI();
      save(); setupIdle(); renderAll(); if (ui.aiOpen) renderAI();
      m.close(true); toast('설정을 저장했어요.');
    };
    if (E('stLogout')) E('stLogout').onclick = () => { m.close(true); signOutFlow(); };
    E('stExport').onclick = () => exportBackup();
    E('stImport').onclick = () => E('stImportFile').click();
    E('stImportFile').onchange = (e) => { const f = e.target.files[0]; if (f) importBackup(f, m); };
    E('stReset').onclick = async () => {
      if (!(await confirmBox('모든 폴더·문서·체크리스트·설정을 지우고 처음 상태로 돌아갈까요?\n백업하지 않은 내용은 되돌릴 수 없어요.', { title: '모두 초기화', ok: '초기화하기', danger: true }))) return;
      await Store.clearAll(); localStorage.removeItem('maeum.ai.settings'); localStorage.removeItem('maeum.locked');
      S = migrate(seed()); await Store.saveState(S); m.close(true); go({ view: 'home' }); toast('처음 상태로 돌아왔어요.');
    };
  }
  const blobToDataURL = (b) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(r.error); r.readAsDataURL(b); });
  async function exportBackup() {
    toast('백업 파일을 준비하고 있어요…');
    const blobs = {};
    for (const d of S.docs.filter((x) => x.kind === 'file')) { const b = await Store.getBlob(d.id); if (b) blobs[d.id] = await blobToDataURL(b); }
    const data = { app: 'maeum-drawer', version: 1, exportedAt: new Date().toISOString(), state: S, blobs };
    downloadBlob(new Blob([JSON.stringify(data)], { type: 'application/json' }), `마음서랍_백업_${dotDate()}.json`);
  }
  async function importBackup(file, modal) {
    try {
      const data = JSON.parse(await file.text());
      if (data.app !== 'maeum-drawer' || !data.state) throw new Error('마음서랍 백업 파일이 아니에요.');
      if (!(await confirmBox(`${data.exportedAt ? dotDate(Date.parse(data.exportedAt)) + ' 백업으로' : '이 백업으로'} 지금 내용을 바꿀까요?\n현재 서류는 백업 내용으로 덮어써져요.`, { ok: '불러오기' }))) return;
      for (const [id, url] of Object.entries(data.blobs || {})) { const b = await (await fetch(url)).blob(); await Store.putBlob(id, b); }
      S = migrate(data.state); await Store.saveState(S);
      modal && modal.close(true); go({ view: 'home' }); toast('백업을 불러왔어요.');
    } catch (e) { toast('불러오지 못했어요: ' + e.message, { type: 'warn', ms: 5000 }); }
  }

  /* =========================================================
   * 13. 화면 잠금 (개인정보 보호 모드)
   * ========================================================= */
  let clockTimer = null;
  function lock() {
    if (!S || !booted) return;
    const ls = $('#lockScreen');
    if (!ls.hidden) return;
    closeMenu();
    localStorage.setItem('maeum.locked', '1');
    const hasPin = !!S.settings.pinHash;
    ls.innerHTML = `<div class="lock-box">
      <div class="lock-clock" id="lkClock"></div><div class="lock-date" id="lkDate"></div>
      <div class="lock-card">
        <div class="l-ico">${icon('lock', 'lg')}</div>
        <b>잠시 자리를 비웠어요</b>
        <p>화면 속 기록은 안전하게 가려 두었어요.<br/>돌아오시면 ${hasPin ? 'PIN을 입력해 주세요.' : '아래 버튼을 눌러 주세요.'}</p>
        ${hasPin ? `<form id="lkForm"><input class="input pin-input" id="lkPin" type="password" inputmode="numeric" maxlength="8" autocomplete="off" placeholder="••••" aria-label="잠금 PIN" /><button class="btn primary block" type="submit">${icon('unlock', 'sm')} 잠금 풀기</button></form><p id="lkMsg" style="margin:10px 0 0;font-size:13px;color:var(--danger)"></p>`
          : `<button class="btn primary block" id="lkOpen">${icon('unlock', 'sm')} 돌아왔어요, 화면 열기</button><p style="margin:12px 0 0;font-size:12.5px">설정에서 잠금 PIN을 정하면 더 안전해요.</p>`}
      </div></div>`;
    ls.hidden = false;
    $('#app').inert = true; $('#modalRoot').inert = true;
    const tick = () => { const d = new Date(); $('#lkClock').textContent = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; $('#lkDate').textContent = d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' }); };
    tick(); clearInterval(clockTimer); clockTimer = setInterval(tick, 1000 * 15);
    if (hasPin) {
      const pin = $('#lkPin'); setTimeout(() => pin.focus(), 60);
      $('#lkForm').onsubmit = async (e) => {
        e.preventDefault();
        if ((await sha256(S.settings.pinSalt + pin.value)) === S.settings.pinHash) unlock();
        else { pin.value = ''; $('#lkMsg').textContent = 'PIN이 맞지 않아요. 다시 입력해 주세요.'; const c = $('.lock-card'); c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); pin.focus(); }
      };
    } else { $('#lkOpen').onclick = unlock; setTimeout(() => $('#lkOpen').focus(), 60); }
  }
  function unlock() {
    const ls = $('#lockScreen'); ls.hidden = true; ls.innerHTML = '';
    clearInterval(clockTimer); localStorage.removeItem('maeum.locked');
    $('#app').inert = false; $('#modalRoot').inert = false;
    resetIdle(); toast('다시 오신 걸 환영해요.');
  }
  let idleTimer = null;
  function resetIdle() {
    clearTimeout(idleTimer);
    const min = Number(S && S.settings.autoLockMin) || 0;
    if (min > 0 && $('#lockScreen').hidden) idleTimer = setTimeout(lock, min * 60000);
  }
  function setupIdle() { resetIdle(); }
  ['mousemove', 'keydown', 'mousedown', 'touchstart', 'wheel'].forEach((ev) => window.addEventListener(ev, () => { if (idleTimer) resetIdle(); }, { passive: true }));

  /* =========================================================
   * 14. 이벤트 위임
   * ========================================================= */
  const ACTIONS = {
    go: (el) => go({ view: el.dataset.view }),
    'go-folder': (el) => go({ view: 'folder', cat: el.dataset.cat, folderId: el.dataset.id || null }),
    'cat-new-folder': (el) => newFolder(el.dataset.cat, null),
    'add-link': (el) => openAddLink({ cat: el.dataset.cat }),
    'new-folder': () => { const l = currentLoc(); if (l) newFolder(l.cat, l.folderId); else newFolder('activity', null); },
    'folder-menu': (el) => folderMenu(el, el.dataset.id),
    upload: () => triggerUpload(),
    'new-note': () => openEditor({}),
    'from-template': () => pickTemplate(),
    'use-template': (el) => useTemplate(el.dataset.id),
    'doc-open': (el) => openPreview(el.dataset.id),
    'doc-star': (el) => toggleStar(el.dataset.id),
    'doc-download': (el) => downloadDoc(el.dataset.id, null, el),
    'doc-menu': (el) => docMenu(el, el.dataset.id),
    'ai-open': (el) => openAI(el.dataset.tab || ui.aiTab),
    'ai-close': () => closeAI(),
    'ai-tab': (el) => { ui.aiTab = el.dataset.tab; renderAI(); },
    'ai-seg': (el) => { AIS[ui.aiTab].fields[el.dataset.f] = el.dataset.v; renderAIBody(); },
    'ai-run': (el) => runAI(el.dataset.tab || ui.aiTab),
    'ai-stop': () => { const st = AIS[ui.aiTab]; st.ctrl && st.ctrl.abort(); },
    'ai-clear': (el) => { const t = el.dataset.tab; const keep = t === 'memo' ? { date: todayStr(), type: AIS.memo.fields.type } : t === 'summary' ? { style: AIS.summary.fields.style } : t === 'sns' ? { platform: AIS.sns.fields.platform, tone: AIS.sns.fields.tone, org: AIS.sns.fields.org } : {}; AIS[t].fields = keep; AIS[t].result = ''; AIS[t].status = 'idle'; renderAIBody(); },
    'ai-copy': (el) => copyText(plainForSave(AIS[el.dataset.tab].result)),
    'ai-save': (el) => saveAIText(plainForSave(AIS[el.dataset.tab].result), aiSaveDefaults(el.dataset.tab)),
    'ai-to-editor': (el) => { const d = aiSaveDefaults(el.dataset.tab); openEditor({ preset: { name: d.name, content: plainForSave(AIS[el.dataset.tab].result), tags: d.tags, cat: d.cat, folderId: d.folderId } }); if (innerWidth < 1100) closeAI(); },
    'ai-insert': async (el) => {
      if (!activeEditor) return;
      const text = plainForSave(AIS[el.dataset.tab].result);
      const ta = activeEditor.textarea;
      if (ta.value.trim()) { const rep = await confirmBox('작성 중인 본문을 도우미 결과로 바꿀까요?\n‘아래에 붙이기’를 고르면 기존 내용 뒤에 덧붙여요.', { ok: '본문 바꾸기', cancel: '아래에 붙이기' }); ta.value = rep ? text : `${ta.value}\n\n${text}`; }
      else ta.value = text;
      activeEditor.count(); toast('작성 중인 문서에 넣었어요.');
      if (innerWidth < 1100) closeAI();
    },
    'ai-share': (el) => openShare({ text: plainForSave(AIS[el.dataset.tab].result), title: AIS[el.dataset.tab].fields.title || '' }),
    'search-suggest': (el) => runSearch(el.dataset.q),
    'search-copy': (el) => copyText(searchPlain(AIS.search.history[+el.dataset.i])),
    'search-save': (el) => { const m = AIS.search.history[+el.dataset.i]; const q = AIS.search.history[+el.dataset.i - 1]; const f = topFolderByName('info', '유용한 사이트'); saveAIText(searchPlain(m), { name: '검색 정리_' + (q ? q.content.slice(0, 30) : dotDate()), cat: 'info', folderId: f ? f.id : null, tags: ['검색', '정보'] }); },
    'search-clear': () => { AIS.search.history = []; renderAIBody(); },
    'img-run': () => runImage(),
    'img-dl': (el) => { const it = AIS.image.items[+el.dataset.i]; if (it) downloadBlob(it.blob, 'AI사진_' + dotDate() + '.' + ((it.blob.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg'))); },
    'img-save': (el) => saveImageItem(+el.dataset.i, false),
    'img-share': async (el) => { const id = await saveImageItem(+el.dataset.i, true); if (id) openShare({ docId: id, title: 'AI 이미지' }); },
    'tpl-new': () => openTemplateMaker(),
    'pii-scan': () => quickScanPII(),
    'pii-mask': () => maskPII(),
    'chat-suggest': (el) => chatSend(el.dataset.q),
    'chat-copy': (el) => copyText(plainForSave(AIS.chat.history[+el.dataset.i].content)),
    'chat-save': (el) => saveAIText(plainForSave(AIS.chat.history[+el.dataset.i].content), aiSaveDefaults('chat')),
    'chat-clear': () => { AIS.chat.history = []; renderAIBody(); },
    'cl-new': async () => { const t = await promptBox('새 체크리스트', { label: '사업 또는 활동 이름', placeholder: '예) 2026 공동모금회 배분사업 신청', ok: '만들기' }); if (!t) return; S.checklists.push({ id: uid('c'), title: t, items: [] }); save(); renderAll(); setTimeout(() => { const i = $(`[data-cl="${S.checklists[S.checklists.length - 1].id}"] input[name=t]`); i && i.focus(); }, 30); },
    'cl-del-item': (el) => { const c = S.checklists.find((x) => x.id === el.dataset.cl); if (!c) return; c.items = c.items.filter((i) => i.id !== el.dataset.item); save(); renderAll(); },
    'cl-menu': (el) => {
      const c = S.checklists.find((x) => x.id === el.dataset.id); if (!c) return;
      openMenu(el, [
        { label: '이름 바꾸기', icon: 'pencil', fn: async () => { const t = await promptBox('체크리스트 이름', { label: '이름', value: c.title, ok: '바꾸기' }); if (t) { c.title = t; save(); renderAll(); } } },
        { label: '체크 모두 해제 (다음 회차용)', icon: 'refresh', fn: () => { c.items.forEach((i) => (i.done = false)); save(); renderAll(); toast('새 회차를 위해 체크를 비웠어요.'); } },
        '-',
        { label: '체크리스트 삭제', icon: 'trash', danger: true, fn: async () => { if (await confirmBox(`‘${c.title}’ 체크리스트를 삭제할까요?`, { ok: '삭제하기', danger: true })) { S.checklists = S.checklists.filter((x) => x !== c); save(); renderAll(); } } },
      ]);
    },
    settings: () => openSettings(),
    lock: () => lock(),
    ext: (el) => openExternal(el.dataset.url),
    'share-open': () => openShare({}),
    'social-off': async (el) => { const e = snsList().find((x) => x.id === el.dataset.id); if (!e) return; if (!(await confirmBox(`${snsName(e)} 연결을 해제할까요?\n보관함에 저장한 게시물은 그대로 남아요.`, { ok: '해제하기' }))) return; delete e.handle; delete e.url; save(); renderAll(); toast('연결을 해제했어요.'); },
    'sns-add': () => openSnsAdd(),
    'sns-remove': async (el) => { const e = snsList().find((x) => x.id === el.dataset.id); if (!e || e.fixed) return; if (!(await confirmBox(`${snsName(e)}을(를) SNS 목록에서 뺄까요?`, { ok: '빼기', danger: true }))) return; S.social.list = S.social.list.filter((x) => x !== e); save(); renderAll(); toast('목록에서 뺐어요.'); },
    'sns-write': (el) => { const e = snsList().find((x) => x.id === el.dataset.id); if (e) openExternal(snsWrite(e)); },
    'yt-refresh': () => afterSocialRender(true),
    'yt-play': (el) => { const m = openModal({ title: el.dataset.title, size: 'mid', body: `<div class="embed-box youtube" style="aspect-ratio:16/9"><iframe src="https://www.youtube-nocookie.com/embed/${esc(el.dataset.id)}?autoplay=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>`, foot: `<button class="btn ghost" data-close>닫기</button><button class="btn primary" data-ok>${icon('save', 'sm')} 보관함에 저장</button>` }); m.el.querySelector('[data-ok]').onclick = () => { saveYt(el.dataset.id, el.dataset.title); m.close(true); }; },
    'yt-save': (el) => saveYt(el.dataset.id, el.dataset.title),
    account: (el) => accountMenu(el),
  };
  function saveYt(id, title) {
    const f = topFolderByName('act', 'SNS 홍보');
    if (S.docs.some((d) => d.kind === 'link' && d.platform === 'youtube' && (d.url || '').includes(id))) { toast('이미 보관함에 있는 영상이에요.'); return; }
    const info = parseSocial('https://www.youtube.com/watch?v=' + id);
    S.docs.push({ id: uid('d'), kind: 'link', url: info.url, platform: 'youtube', embed: info.embed, ratio: '16/9', name: title || '유튜브 영상', ext: '', mime: '', size: null, cat: 'act', folderId: f ? f.id : null, tags: ['유튜브', '기관채널'], favorite: false, template: false, createdAt: now(), updatedAt: now() });
    save(); renderSidebar(); toast('활동 › SNS 홍보 폴더에 저장했어요.');
  }
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el || el.closest('#lockScreen')) return;
    const fn = ACTIONS[el.dataset.act];
    if (fn) { e.preventDefault(); fn(el, e); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches('.folder-card[role=button]')) { e.preventDefault(); e.target.click(); }
  });
  document.addEventListener('change', (e) => {
    const el = e.target.closest('[data-change]'); if (!el) return;
    const a = el.dataset.change;
    if (a === 'sort') { ui.sort = el.value; renderMain(); }
    if (a === 'cl-toggle') {
      const c = S.checklists.find((x) => x.id === el.dataset.cl); const it = c && c.items.find((i) => i.id === el.dataset.item);
      if (it) { it.done = el.checked; save(); const done = c.items.every((i) => i.done); renderAll(); if (done && el.checked) toast(`‘${c.title}’ 서류를 모두 갖췄어요. 수고 많으셨어요!`); }
    }
    if (a === 'ai-load') {
      const d = docById(el.value); if (!d) return;
      const tab = ui.aiTab; const target = el.dataset.target;
      getDocText(d).then((t) => {
        if (t == null) { toast('이 문서의 글자를 읽을 수 없어요.', { type: 'warn' }); return; }
        AIS[tab].fields[target] = t.slice(0, 30000);
        if (tab === 'summary' || tab === 'privacy') { AIS[tab].fields.title = d.name; AIS[tab].fields.srcId = d.id; AIS[tab].local = null; }
        renderAIBody(); toast(`‘${d.name}’을(를) 불러왔어요.`);
      }).catch((err) => toast(err.message, { type: 'warn' }));
    }
  });
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('[data-submit]'); if (!f) return;
    e.preventDefault();
    if (f.dataset.submit === 'cl-add') {
      const c = S.checklists.find((x) => x.id === f.dataset.cl); const v = f.t.value.trim(); if (!c || !v) return;
      c.items.push({ id: uid('i'), text: v, done: false }); save(); renderAll();
      setTimeout(() => { const i = $(`[data-cl="${c.id}"] input[name=t]`); i && i.focus(); }, 20);
    }
    if (f.dataset.submit === 'chat-send') chatSend(f.q.value);
    if (f.dataset.submit === 'search-send') runSearch(f.q.value);
    if (f.dataset.submit === 'social-connect') socialConnect(f.dataset.id, f.v.value);
  });
  // 도우미 입력값 보존
  $('#aiPanel').addEventListener('input', (e) => {
    const k = e.target.dataset.f; if (!k) return;
    AIS[ui.aiTab].fields[k] = e.target.value;
    if (ui.aiTab === 'privacy' && k === 'text') AIS.privacy.local = null;
  });
  $('#aiPanel').addEventListener('keydown', (e) => {
    if (e.target.name === 'q' && e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); if (ui.aiTab === 'search') runSearch(e.target.value); else chatSend(e.target.value); }
    if (e.target.dataset.f === 'prompt' && ui.aiTab === 'image' && e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); runImage(); }
  });

  // 검색
  $('#searchInput').addEventListener('input', (e) => {
    const q = e.target.value.trim();
    if (q) go({ view: 'search', q }, route.view === 'search');
    else if (route.view === 'search') go(prevRoute.view === 'search' ? { view: 'home' } : prevRoute, true);
  });
  $('#searchInput').addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.target.value = ''; e.target.dispatchEvent(new Event('input')); e.target.blur(); } });

  // 단축키
  window.addEventListener('keydown', (e) => {
    if (!$('#lockScreen').hidden) return;
    if (e.altKey && (e.key === 'l' || e.key === 'L' || e.code === 'KeyL')) { e.preventDefault(); lock(); return; }
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if (e.key === '/' && !typing && !modals.length) { e.preventDefault(); $('#searchInput').focus(); return; }
    if (e.key === 'Escape') {
      if (openMenuEl) { closeMenu(); return; }
      if (ui.aiOpen && $('#aiPanel').contains(document.activeElement)) { closeAI(); return; }
      if (modals.length) { modals[modals.length - 1].close(); return; }
      if (document.body.classList.contains('nav-open')) { document.body.classList.remove('nav-open'); return; }
      if (ui.aiOpen && !typing) closeAI();
    }
  });

  // 업로드 & 드래그
  $('#fileInput').addEventListener('change', (e) => handleFiles(e.target.files));
  let dragDepth = 0;
  const hasFiles = (e) => [...(e.dataTransfer?.types || [])].includes('Files');
  window.addEventListener('dragenter', (e) => { if (!hasFiles(e) || !$('#lockScreen').hidden) return; e.preventDefault(); dragDepth++; $('#dropHint').hidden = false; });
  window.addEventListener('dragover', (e) => { if (hasFiles(e)) e.preventDefault(); });
  window.addEventListener('dragleave', (e) => { if (!hasFiles(e)) return; dragDepth = Math.max(0, dragDepth - 1); if (!dragDepth) $('#dropHint').hidden = true; });
  window.addEventListener('drop', (e) => { if (!hasFiles(e)) return; e.preventDefault(); dragDepth = 0; $('#dropHint').hidden = true; if ($('#lockScreen').hidden) handleFiles(e.dataTransfer.files); });

  // 모바일 메뉴
  $('#menuBtn').addEventListener('click', () => document.body.classList.toggle('nav-open'));
  $('#scrim').addEventListener('click', () => { document.body.classList.remove('nav-open'); if (innerWidth <= 900) closeAI(); });
  $('#aiToggle').addEventListener('click', () => (ui.aiOpen ? closeAI() : openAI()));
  $('#lockBtn').addEventListener('click', () => lock());
  window.addEventListener('beforeunload', (e) => { if (S) Store.saveState(S); if (activeEditor && activeEditor.modal && !activeEditor.modal.saved && activeEditor.textarea.value.trim()) { e.preventDefault(); e.returnValue = ''; } });

  /* =========================================================
   * 15. 시작
   * ========================================================= */
  /* ---------- Google 가입 · 로그인 ---------- */
  let currentUser = null; let booted = false;
  const G_LOGO = '<svg viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
  function showGate(mode, msg = '') {
    const g = $('#authGate'); g.hidden = false;
    $('#app').inert = true;
    if (mode === 'loading') { g.innerHTML = `<div class="auth-card loading"><span class="brand-mark big">${BRAND_SVG}</span><div class="thinking" style="justify-content:center;margin-top:18px"><i></i><i></i><i></i> 마음서랍을 여는 중이에요…</div></div>`; return; }
    g.innerHTML = `<div class="auth-card">
      <span class="brand-mark big">${BRAND_SVG}</span>
      <h1>마음서랍</h1>
      <p class="auth-sub">사회복지사를 위한 따뜻한 서류함 &amp; 업무 비서</p>
      <ul class="auth-feats">
        <li>${icon('folder', 'sm')} 일반·활동 서류를 폴더로 차곡차곡</li>
        <li>${icon('sparkle', 'sm')} 마음기록 도우미가 인터넷 검색 답변과 홍보용 사진을</li>
        <li>${icon('heart', 'sm')} 교육 · 정보 · 활동 라운지와 네이버 블로그 · 인스타그램 연동</li>
      </ul>
      <button class="g-btn" id="gSignIn">${G_LOGO}<span>Google로 3초 만에 시작하기</span></button>
      <small class="auth-hint">처음이면 이 버튼 하나로 가입이 끝나요. 따로 적을 양식은 없어요.</small>
      <p class="auth-err" id="gErr">${esc(msg)}</p>
      <div class="auth-foot">${icon('shield', 'sm')} 서류는 내 기기 브라우저에만 저장되고, Google 계정은 본인 확인에만 사용해요.</div>
    </div>`;
    $('#gSignIn').onclick = async () => {
      const b = $('#gSignIn'); b.disabled = true; b.querySelector('span').textContent = 'Google 창에서 계정을 골라 주세요…';
      try { await MaeumAuth.signIn(); }
      catch (e) { $('#gErr').textContent = e.message; b.disabled = false; b.querySelector('span').textContent = 'Google로 3초 만에 시작하기'; }
    };
  }
  function hideGate() { const g = $('#authGate'); g.hidden = true; g.innerHTML = ''; $('#app').inert = false; }
  function renderUserChip() {
    const u = currentUser; const c = $('#userChip'); if (!c || !u) return;
    const nm = u.displayName || u.email || '나';
    c.innerHTML = u.photoURL ? `<img src="${esc(u.photoURL)}" alt="" referrerpolicy="no-referrer" />` : `<span>${esc(nm.slice(0, 1))}</span>`;
    c.title = `${nm} (${u.email || ''})`;
  }
  function accountMenu(el) {
    const u = currentUser || {};
    openMenu(el, [
      { label: `${u.displayName || '내 계정'} · ${u.email || ''}`, icon: 'heart', fn: () => openSettings() },
      { label: '설정 · 백업', icon: 'settings', fn: () => openSettings() },
      { label: 'SNS 연동', icon: 'share', fn: () => go({ view: 'social' }) },
      '-',
      { label: '로그아웃', icon: 'logout', danger: true, fn: signOutFlow },
    ]);
  }
  async function signOutFlow() {
    if (!(await confirmBox('로그아웃할까요?\n이 기기에 저장된 서류는 그대로 남아 있고, 다시 로그인하면 이어서 볼 수 있어요.', { ok: '로그아웃' }))) return;
    if (S) await Store.saveState(S);
    await MaeumAuth.signOut();
    location.reload();
  }
  async function boot(user) {
    currentUser = user;
    Store.use('maeum-drawer-u-' + user.uid);
    const moved = await Store.migrateLegacy();
    let st = null;
    try { st = await Store.loadState(); } catch (e) { console.warn(e); }
    S = migrate(st || seed());
    if (!S.settings.userName && user.displayName) S.settings.userName = user.displayName;
    await Store.saveState(S);
    await refreshKeyKnown();
    route = parseHash();
    if (route.view === 'search') $('#searchInput').value = route.q || '';
    renderAll(); renderUserChip(); hideGate(); booted = true;
    if (localStorage.getItem('maeum.locked') === '1' && S.settings.pinHash) lock();
    else localStorage.removeItem('maeum.locked');
    setupIdle();
    if (!st) toast(`환영해요, ${S.settings.userName || '선생님'}! 마음서랍이 준비됐어요.`, { ms: 4000 });
    if (moved) toast('이전에 쓰던 서류를 이 계정으로 옮겨 왔어요.', { ms: 4500 });
  }
  async function init() {
    $('#menuBtn').innerHTML = icon('menu');
    $('.search-ico').innerHTML = icon('search');
    $('#aiToggle').innerHTML = `${helperAva()}<span class="lbl">마음기록 도우미</span>`;
    $('#lockBtn').innerHTML = icon('lock');
    $('#dropIco').innerHTML = icon('upload');
    showGate('loading');
    const fail = setTimeout(() => { if (!booted && !$('#gSignIn')) showGate('signin', '로그인 서비스를 불러오는 데 시간이 걸리고 있어요. 잠시 후 다시 눌러 주세요.'); }, 12000);
    try {
      await MaeumAuth.onChange(async (user) => {
        clearTimeout(fail);
        if (!user) { if (booted) location.reload(); else showGate('signin'); return; }
        if (booted && currentUser && currentUser.uid === user.uid) return;
        if (booted) { location.reload(); return; }
        try { await boot(user); } catch (e) { console.error(e); showGate('signin', '불러오는 중 문제가 생겼어요: ' + e.message); }
      });
    } catch (e) { clearTimeout(fail); showGate('signin', '로그인 서비스를 불러오지 못했어요. 인터넷 연결을 확인해 주세요.'); }
  }
  init();
})();
