/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BIZ_SERVER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
