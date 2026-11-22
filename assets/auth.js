/* 마음서랍 Google 가입·로그인 (Firebase Authentication)
 * - 처음 로그인하면 자동으로 가입됩니다. 별도 회원가입 양식 없음.
 * - 아래 값은 Firebase 웹 공개 구성값입니다(비밀키 아님). 승인된 도메인에서만 로그인됩니다.
 */
const MaeumAuth = (() => {
  const CFG = {
    apiKey: 'AIzaSyDRR9ZH0RJ79CWTxYnU1DWJRGpYBc-C1OA',
    authDomain: 'maeum-drawer.firebaseapp.com',
    projectId: 'maeum-drawer',
    storageBucket: 'maeum-drawer.firebasestorage.app',
    messagingSenderId: '443334840870',
    appId: '1:443334840870:web:260c86f24ec0166ce84ce7',
  };
  const SDK = '13.4.0';
  let au = null, auth = null, loading = null;

  function load() {
    if (loading) return loading;
    loading = Promise.all([
      import(`https://www.gstatic.com/firebasejs/${SDK}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${SDK}/firebase-auth.js`),
    ]).then(([app, a]) => {
      const fb = app.getApps().find((x) => x.name === 'maeum') || app.initializeApp(CFG, 'maeum');
      au = a; auth = a.getAuth(fb);
      try { auth.languageCode = 'ko'; } catch (e) {}
      return a;
    });
    return loading;
  }

  const MSG = {
    'auth/popup-closed-by-user': '로그인 창이 닫혔어요. 다시 눌러 주세요.',
    'auth/cancelled-popup-request': '로그인 창이 닫혔어요. 다시 눌러 주세요.',
    'auth/network-request-failed': '인터넷 연결을 확인해 주세요.',
    'auth/unauthorized-domain': '이 주소에서는 로그인이 허용되지 않았어요.',
    'auth/too-many-requests': '잠시 후 다시 시도해 주세요.',
  };

  return {
    async onChange(cb) { await load(); au.onAuthStateChanged(auth, cb); },
    async signIn() {
      await load();
      const p = new au.GoogleAuthProvider();
      p.setCustomParameters({ prompt: 'select_account' });
      try { return (await au.signInWithPopup(auth, p)).user; }
      catch (e) {
        if (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment') { await au.signInWithRedirect(auth, p); return null; }
        const err = new Error(MSG[e.code] || `로그인하지 못했어요. (${e.code || e.message})`); err.code = e.code; throw err;
      }
    },
    async signOut() { await load(); await au.signOut(auth); },
    get user() { return auth ? auth.currentUser : null; },
  };
})();
