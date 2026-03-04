// Ambient declarations to satisfy TypeScript for Vite import.meta.env and js-cookie
declare module 'js-cookie';

interface ImportMetaEnv {
  readonly VITE_BASE_URL?: string;
  [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
