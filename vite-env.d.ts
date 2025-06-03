/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_API_URL: string;
  readonly VITE_STORE_NAME: string;
  readonly VITE_DEFAULT_LANGUAGE: string;
  readonly VITE_DEBUG: string;
  readonly NODE_ENV: string;
  // يمكن إضافة متغيرات أخرى هنا
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
