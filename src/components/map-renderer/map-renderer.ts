import { MapboxRenderer, type MapboxRendererOptions } from './mapbox'
import { MaplibreRenderer, type MaplibreRendererOptions } from './maplibre'
import { OpenlayersRenderer, OpenlayersRendererOptions } from './openlayers'

export type MapRendererInstance = InstanceType<typeof MapRenderer>

export type MapRendererOptionsWithMapbox = MapboxRendererOptions

export type MapRendererOptionsWithMaplibre = MaplibreRendererOptions

export type MapRendererOptionsWithOpenlayers = OpenlayersRendererOptions

export type MapRendererOptions = {
  dispatch: ({ map }: { map: any }) => void
} & (
  | {
      mapRendererType: 'mapbox'
      mapOptions: MapRendererOptionsWithMapbox
    }
  | {
      mapRendererType: 'maplibre'
      mapOptions: MapRendererOptionsWithMaplibre
    }
  | {
      mapRendererType: 'openlayers'
      mapOptions: MapRendererOptionsWithOpenlayers
    }
)

export class MapRenderer {
  map: any
  constructor({ mapRendererType, mapOptions }: MapRendererOptions) {
    if (mapRendererType === 'mapbox') {
      this.map = new MapboxRenderer(mapOptions)
    } else if (mapRendererType === 'maplibre') {
      this.map = new MaplibreRenderer(mapOptions)
    } else if (mapRendererType === 'openlayers') {
      this.map = new OpenlayersRenderer(mapOptions)
    } else {
      throw new Error('Invalid map renderer type')
    }
  }
}
