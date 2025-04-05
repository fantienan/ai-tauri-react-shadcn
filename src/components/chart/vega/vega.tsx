import { useEffect, useRef } from 'react'
import embed, { vega, VisualizationSpec } from 'vega-embed'

type VegaChartProps = {
  spec: VisualizationSpec
}

export const VegaChart: React.FC<VegaChartProps> = ({ spec }) => {
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
