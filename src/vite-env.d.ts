/// <reference types="vite/client" />
/// <reference path="./components/react-charts/types/index.d.ts"/>

interface ImportMetaEnv {
  readonly BIZ_SERVER_URL: string
  readonly MAPBOX_ACCESS_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare interface Window {
  __biz_map: any
  __biz__fetch__: any
}
