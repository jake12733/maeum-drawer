/*
 * 마음서랍 환경 설정 (환경변수 역할)
 * ------------------------------------------------------------
 * - 이 파일은 공개 저장소에 그대로 올라갑니다. API 키를 여기에 적지 마세요.
 * - API 키는 앱의 [설정 > 마음기록 도우미 연결]에서 입력하면
 *   이 브라우저의 IndexedDB에 AES-GCM으로 암호화되어 보관됩니다.
 * - 서버(사내망·프록시)에 배포할 때는 빌드 단계에서 아래 값을 주입하거나
 *   DARKCODE 게이트웨이(프록시)가 키를 대신 붙이도록 구성하는 것을 권장합니다.
 *
 * DARKCODE_API_MODE
 *   'builtin'   : DARKCODE AI 기본 엔진 (Firebase AI Logic · Gemini, 키 불필요, 브라우저당 하루 80회)
 *   'openai'    : DARKCODE 게이트웨이 / OpenAI 호환 엔드포인트 (POST {endpoint}/chat/completions)
 *   'gemini'    : Google Gemini API 키 직접 연결
 *   'anthropic' : Anthropic Claude API 키 직접 연결
 *   'custom'    : 사용자 정의 엔드포인트 (POST JSON {task, system, messages} → {text})
 */
window.MAEUM_ENV = {
  DARKCODE_API_MODE: 'builtin',
  DARKCODE_API_ENDPOINT: '',
  DARKCODE_MODEL: '',
  // DARKCODE_API_KEY 는 의도적으로 비워 둡니다. (설정창에서 입력)
};
