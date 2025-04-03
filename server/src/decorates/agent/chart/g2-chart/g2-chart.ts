import type { G2Spec } from '@antv/g2';

export const getSpec = (spec: Partial<G2Spec>) => {
  return {
    type: 'interval',
    autoFit: true,
    data: [],
    // encode: { x: 'letter', y: 'frequency' },
    ...spec,
  };
};
