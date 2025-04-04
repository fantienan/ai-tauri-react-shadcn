import type { G2Spec } from '@antv/g2'
import equal from 'fast-deep-equal'
import { memo } from 'react'
import { G2Chart } from './g2-hart'

interface AnalyzeProps {
  analyzeResults?: G2Spec
}

function PureAnalyze({ analyzeResults }: AnalyzeProps) {
  console.log('analyzeResults', analyzeResults)
  return analyzeResults ? <G2Chart spec={analyzeResults} /> : null
}

export const Analyze = memo(PureAnalyze, (prevProps, nextProps) => {
  if (!equal(prevProps.analyzeResults, nextProps.analyzeResults)) return false
  return true
})
