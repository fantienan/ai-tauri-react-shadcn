import 'mapbox-gl/dist/mapbox-gl.css'
// import 'maplibre-gl/dist/maplibre-gl.css'
import { logger } from '@/utils'
// import { Map, MapOptions } from 'maplibre-gl'
import { Map, MapOptions } from 'mapbox-gl'
import { interceptRequest } from './utils'

export type MapKitOptions = MapOptions & {
  dispatch: ({ map }: { map: MapKitInstance }) => void
}

export type MapKitInstance = InstanceType<typeof MapKit>

const defaultMapOptions: MapOptions = {
  container: 'map',
  accessToken: import.meta.env.MAPBOX_ACCESS_TOKEN,
  center: [112.32716994959941, 32.8823769011904],
  projection: { name: 'globe' },
  preserveDrawingBuffer: true,
  pitch: 0,
  bearing: 0,
  zoom: 6,
  style: `/map-style/style.json?t=${Date.now()}`,
}

logger('MapKit Options:', defaultMapOptions)
export class MapKit extends Map {
  constructor({ dispatch, ...resetOptions }: MapKitOptions) {
    const options = { ...defaultMapOptions, ...resetOptions }
    interceptRequest(`access_token=${options.accessToken}`)
    super(options)
    this.on('style.load', () => {
      debugger
      //   this.setProjection({ type: 'globe' })
      //   this.resize()
      dispatch({ map: this })
    })

    this.on('error', (e) => {
      logger('MapKit Error:', e)
    })
  }
}
