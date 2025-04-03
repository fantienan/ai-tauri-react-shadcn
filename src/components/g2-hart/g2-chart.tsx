import { Chart, type G2Spec } from '@antv/g2';
import classNames from 'classnames';
import { memo, useEffect, useRef } from 'react';

export interface ChartViewProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  spec: G2Spec;
}

const InternalG2Chart: React.FC<ChartViewProps> = ({
  prefixCls = 'g2chart',
  className,
  style,
  spec,
  ...restProps
}) => {
  const compClassName = classNames(`${prefixCls}`, className);
  const chartRef = useRef<HTMLDivElement>(null);

  const height = style?.height || 200;
  const width = style?.width || '100%';
  console.log('spec', spec);
  useEffect(() => {
    if (chartRef.current && spec) {
      const chart = new Chart({
        container: chartRef.current,
        autoFit: true,
        height: 200,
      });
      chart.options(spec);
      chart.render();
    }
  }, [spec]);

  return (
    <div
      {...restProps}
      className={compClassName}
      ref={chartRef}
      style={{ width, height, margin: 'auto' }}
    />
  );
};

export const G2Chart = memo(InternalG2Chart, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.spec) === JSON.stringify(nextProps.spec);
});
