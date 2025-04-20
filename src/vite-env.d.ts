/// <reference types="vite/client" />
/// <reference path="./components/react-charts/types/index.d.ts"/>

interface ImportMetaEnv {
  readonly BIZ_NODE_SERVER_URL: string
  readonly BIZ_MAPBOX_ACCESS_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare interface Window {
  __biz_map: any
  __biz__fetch__: any
  isTauri?: boolean
}
