import type { VisualizationSpec } from 'vega-embed';

export const getRectSpec = (params: {
  data: any[];
  fields: { x: string; y: string };
}) => {
  const { x, y } = params.fields;
  const spec: VisualizationSpec = {
    width: 400,
    height: 200,
    padding: 5,
    data: [
      {
        name: 'table',
        values: params.data,
      },
    ],
    signals: [
      {
        name: 'tooltip',
        value: {},
        on: [
          {
            events: 'rect:pointerover',
            update: 'datum',
          },
          {
            events: 'rect:pointerout',
            update: '{}',
          },
        ],
      },
    ],
    scales: [
      {
        name: 'xscale',
        type: 'band',
        domain: {
          data: 'table',
          field: x,
        },
        range: 'width',
        padding: 0.05,
        round: true,
      },
      {
        name: 'yscale',
        domain: {
          data: 'table',
          field: y,
        },
        nice: true,
        range: 'height',
      },
    ],
    axes: [
      {
        orient: 'bottom',
        scale: 'xscale',
      },
      {
        orient: 'left',
        scale: 'yscale',
      },
    ],
    marks: [
      {
        type: 'rect',
        from: {
          data: 'table',
        },
        encode: {
          enter: {
            x: {
              scale: 'xscale',
              field: x,
            },
            width: {
              scale: 'xscale',
              band: 1,
            },
            y: {
              scale: 'yscale',
              field: y,
            },
            y2: {
              scale: 'yscale',
              value: 0,
            },
          },
          update: {
            fill: {
              value: 'steelblue',
            },
          },
          hover: {
            fill: {
              value: 'red',
            },
          },
        },
      },
      {
        type: 'text',
        encode: {
          enter: {
            align: {
              value: 'center',
            },
            baseline: {
              value: 'bottom',
            },
            fill: {
              value: '#333',
            },
          },
          update: {
            x: {
              scale: 'xscale',
              signal: 'tooltip.category',
              band: 0.5,
            },
            y: {
              scale: 'yscale',
              signal: 'tooltip.amount',
              offset: -2,
            },
            text: {
              signal: 'tooltip.amount',
            },
            fillOpacity: [
              {
                test: 'datum === tooltip',
                value: 0,
              },
              {
                value: 1,
              },
            ],
          },
        },
      },
    ],
  };
  return spec;
};
