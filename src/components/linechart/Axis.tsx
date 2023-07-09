import { component$, type FunctionComponent } from "@builder.io/qwik";
import type { ChartData, ChartDims } from "~/utils/chart/chart-helpers";

interface AxisProps {
  points: string;
}

type Props = {
  data?: ChartData[];
  chartDims: ChartDims;
};

const Axis: FunctionComponent<AxisProps> = ({ points }) => (
  <polyline fill="none" stroke="#ccc" strokeWidth=".5" points={points} />
);

export const XAxis = component$(({ chartDims }: Props) => {
  return (
    <Axis
      points={`${chartDims.padding},${chartDims.height - chartDims.padding} ${
        chartDims.width - chartDims.padding
      },${chartDims.height - chartDims.padding}`}
    />
  );
});

export const YAxis = component$(({ chartDims }: Props) => {
  return (
    <Axis
      points={`${chartDims.padding},${chartDims.padding} ${chartDims.padding},${
        chartDims.height - chartDims.padding
      }`}
    />
  );
});

export const LabelsXAxis = component$(({ data, chartDims }: Props) => {
  const y = chartDims.height - chartDims.padding + chartDims.fontSize * 2;

  return (
    <>
      {data?.map((element: ChartData, index: number) => {
        const x =
          (element.x / chartDims.maximumXFromData) * chartDims.chartWidth +
          chartDims.padding -
          chartDims.fontSize / 2;
        return (
          <text
            key={index}
            x={x}
            y={y}
            style={{
              fill: "#808080",
              fontSize: chartDims.fontSize,
              fontFamily: "Helvetica",
            }}
          >
            {element.x}
          </text>
        );
      })}
      ;
    </>
  );
});

export const LabelsYAxis = component$(({ chartDims }: Props) => {
  const PARTS = chartDims.nHorizGuides;

  return (
    <>
      {new Array(PARTS + 1).fill(0).map((_, index) => {
        const x = chartDims.fontSize;
        const ratio = (PARTS - index) / chartDims.nHorizGuides;

        const yCoordinate =
          chartDims.chartHeight * ratio +
          chartDims.padding +
          chartDims.fontSize / 2;

        const labelValue =
          chartDims.paddedMaximumYFromData -
          (chartDims.paddedMaximumYFromData -
            chartDims.paddedMinimumYFromData) *
            ratio;

        return (
          <text
            key={index}
            x={x}
            y={yCoordinate}
            style={{
              fill: "#808080",
              fontSize: chartDims.fontSize,
              fontFamily: "Helvetica",
            }}
          >
            {labelValue.toFixed(chartDims.precision)}
          </text>
        );
      })}
      ;
    </>
  );
});
