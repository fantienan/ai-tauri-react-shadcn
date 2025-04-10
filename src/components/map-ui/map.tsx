import { useSyncReference } from '@/hooks/use-sync-reference'
import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'
import { MapKit, MapKitOptions } from '../map-kit'

export const Map = (props: Pick<MapKitOptions, 'dispatch'>) => {
  const divRef = useRef<HTMLDivElement>(null)
  const dispatchRef = useSyncReference(props.dispatch)
  useEffect(() => {
    new MapKit({ container: divRef.current!, dispatch: (params) => dispatchRef.current(params) })
  }, [])
  return <div className={cn('min-h-svh w-full')} ref={divRef} />
}
