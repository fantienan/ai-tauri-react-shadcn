import { UIArtifact } from '@/components/artifact'
import { useCallback, useMemo } from 'react'
import useSWR from 'swr'

export const initialArtifactData: UIArtifact = {
  kind: 'text',
  title: '',
  status: 'idle',
  isVisible: false,
  boundingBox: {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  },
}

export const useArtifact = () => {
  const { data: localArtifact, mutate: setLocalArtifact } = useSWR<UIArtifact>('artifact', null, {
    fallbackData: initialArtifactData,
  })
  const artifact = useMemo(() => {
    if (!localArtifact) return initialArtifactData
    return localArtifact
  }, [localArtifact])

  const setArtifact = useCallback(
    (updaterFn: UIArtifact | ((currentArtifact: UIArtifact) => UIArtifact)) => {
      setLocalArtifact((currentArtifact) => {
        const artifactToUpdate = currentArtifact || initialArtifactData

        if (typeof updaterFn === 'function') {
          return updaterFn(artifactToUpdate)
        }

        return updaterFn
      })
    },
    [setLocalArtifact],
  )
  const { data: localArtifactMetadata, mutate: setLocalArtifactMetadata } = useSWR<any>(null, null, {
    fallbackData: null,
  })
  return useMemo(
    () => ({
      artifact,
      setArtifact,
      metadata: localArtifactMetadata,
      setMetadata: setLocalArtifactMetadata,
    }),
    [artifact, setArtifact, localArtifactMetadata, setLocalArtifactMetadata],
  )
}
