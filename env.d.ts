/// <reference types="vite/client" />

// Describes our custom variables so `import.meta.env.VITE_*` is typed.
// Note: Vite always gives env values as strings ("true", not true).
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_USE_MOCKS: 'true' | 'false'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
