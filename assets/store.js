/* 마음서랍 저장소 모듈
 * - state  : 폴더·문서 메타데이터·체크리스트·설정 (IndexedDB 'kv')
 * - blobs  : 업로드한 파일 원본 (IndexedDB 'blobs')
 * - vault  : API 키 등 비밀값 (AES-GCM 암호화, 추출 불가 CryptoKey)
 * IndexedDB를 쓸 수 없는 환경(사파리 사생활 보호 모드 등)에서는 메모리로 자동 대체합니다.
 * 추후 서버 DB로 바꿀 때는 이 파일의 Store 인터페이스(get/put/del)만 교체하면 됩니다.
 */
const Store = (() => {
  const DB_NAME = 'maeum-drawer';
  const DB_VER = 1;
  let dbp = null;
  const mem = { kv: new Map(), blobs: new Map(), vault: new Map() };
  let memoryOnly = false;

  function open() {
    if (dbp) return dbp;
    dbp = new Promise((resolve) => {
      let settled = false;
      const finish = (db) => { if (settled) { if (db) db.close(); return; } settled = true; resolve(db); };
      // 다른 탭이 데이터베이스를 붙잡고 있어 열리지 않으면 4초 뒤 메모리 모드로 계속합니다.
      setTimeout(() => { if (!settled) { memoryOnly = true; finish(null); } }, 4000);
      try {
        const req = indexedDB.open(DB_NAME, DB_VER);
        req.onupgradeneeded = () => {
          const db = req.result;
          ['kv', 'blobs', 'vault'].forEach((s) => { if (!db.objectStoreNames.contains(s)) db.createObjectStore(s); });
        };
        req.onsuccess = () => {
          const db = req.result;
          // 다른 탭에서 초기화·업그레이드할 때 연결을 양보합니다.
          db.onversionchange = () => { db.close(); dbp = null; };
          finish(db);
        };
        req.onerror = () => { memoryOnly = true; finish(null); };
      } catch (e) { memoryOnly = true; finish(null); }
    });
    return dbp;
  }

  async function tx(store, mode, fn) {
    const db = await open();
    if (!db) return fn(null, mem[store]);
    return new Promise((resolve, reject) => {
      const t = db.transaction(store, mode);
      const os = t.objectStore(store);
      let out;
      Promise.resolve(fn(os)).then((r) => { out = r; });
      t.oncomplete = () => resolve(out);
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error);
    });
  }
  const reqP = (r) => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });

  async function get(store, key) {
    const db = await open();
    if (!db) return mem[store].get(key);
    const t = db.transaction(store, 'readonly');
    return reqP(t.objectStore(store).get(key));
  }
  async function put(store, key, val) {
    const db = await open();
    if (!db) { mem[store].set(key, val); return; }
    const t = db.transaction(store, 'readwrite');
    await reqP(t.objectStore(store).put(val, key));
  }
  async function del(store, key) {
    const db = await open();
    if (!db) { mem[store].delete(key); return; }
    const t = db.transaction(store, 'readwrite');
    await reqP(t.objectStore(store).delete(key));
  }
  async function clearAll() {
    const db = await open();
    if (!db) { Object.values(mem).forEach((m) => m.clear()); return; }
    for (const s of ['kv', 'blobs', 'vault']) {
      const t = db.transaction(s, 'readwrite');
      await reqP(t.objectStore(s).clear());
    }
  }

  /* ---------- Vault (비밀값 암호화 보관) ---------- */
  async function vaultKey() {
    let k = await get('vault', '__key');
    if (!k) {
      k = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
      await put('vault', '__key', k);
    }
    return k;
  }
  const Vault = {
    async set(name, value) {
      if (!value) { await del('vault', name); return; }
      const key = await vaultKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(value));
      await put('vault', name, { iv, data });
    },
    async get(name) {
      const rec = await get('vault', name);
      if (!rec) return '';
      try {
        const key = await vaultKey();
        const buf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: rec.iv }, key, rec.data);
        return new TextDecoder().decode(buf);
      } catch (e) { return ''; }
    },
    async has(name) { return !!(await get('vault', name)); },
    del: (name) => del('vault', name),
  };

  return {
    open, get, put, del, clearAll, Vault,
    get memoryOnly() { return memoryOnly; },
    loadState: () => get('kv', 'state'),
    saveState: (s) => put('kv', 'state', s),
    putBlob: (id, blob) => put('blobs', id, blob),
    getBlob: (id) => get('blobs', id),
    delBlob: (id) => del('blobs', id),
  };
})();
