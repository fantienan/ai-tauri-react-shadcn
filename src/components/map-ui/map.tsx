import { useSyncReference } from '@/hooks/use-sync-reference'
import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'
import { MapRenderer, MapRendererOptions } from '../map-renderer'

export const Map = (props: Pick<MapRendererOptions, 'dispatch'>) => {
  const divRef = useRef<HTMLDivElement>(null)
  const dispatchRef = useSyncReference(props.dispatch)
  useEffect(() => {
    new MapRenderer({
      dispatch: (params) => dispatchRef.current(params),
      mapRendererType: 'mapbox',
      mapOptions: { dispatch: () => {}, container: divRef.current! },
    })
  }, [])
  return <div className={cn('min-h-svh w-full')} ref={divRef} />
}
