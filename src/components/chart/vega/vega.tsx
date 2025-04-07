import { useEffect, useRef } from 'react'
import type { AnalyzeResult } from 'types'
import embed, { vega, VisualizationSpec } from 'vega-embed'

type VegaChartProps = Omit<AnalyzeResult, 'chartRendererType' | 'data'> & {
  spec: VisualizationSpec
}

export const VegaChart = ({ spec }: VegaChartProps) => {
  const container = useRef<HTMLDivElement>(null)

  const theme = 'light'

  useEffect(() => {
    if (container.current && spec) {
      embed(container.current, spec).then(({ view }) => {
        // view.change(
        //   'data',
        //   vega
        //     .changeset()
        //     .remove(() => true)
        //     .insert(data),
        // );
        view.run()
        // view.resize();
      })
      // spec.data = {
      //   name: 'data',
      // };
      // embed(container.current, spec, {
      //   width: 368,
      //   actions: false,
      //   config: {
      //     background: 'transparent',
      //   },
      // }).then(({ view }) => {
      //   view.change(
      //     'data',
      //     vega
      //       .changeset()
      //       .remove(() => true)
      //       .insert(data),
      //   );
      //   view.run();
      //   // view.resize();
      // });
    }
  }, [spec, theme])
  return <div ref={container} className="w-full w-[368px] bg-white p-5"></div>
}
