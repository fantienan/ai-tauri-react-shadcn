/// <reference types="vite/client" />
/// <reference path="./components/react-charts/types/index.d.ts"/>

interface ImportMetaEnv {
  readonly BIZ_SERVER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
