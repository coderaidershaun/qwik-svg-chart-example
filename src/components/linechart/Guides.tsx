import { component$, Fragment } from "@builder.io/qwik";
import { ChartDims } from "~/utils/chart/chart-helpers";

type Props = {
  chartDims: ChartDims;
};

export const VerticalGuides = component$(({ chartDims }: Props) => {
  const guideCount = chartDims.nVerticalGuides || chartDims.dataLen - 1;

  const startY = chartDims.padding;
  const endY = chartDims.height - chartDims.padding;

  return (
    <>
      {new Array(guideCount).fill(0).map((_, index) => {
        const ratio = (index + 1) / guideCount;

        const xCoordinate =
          chartDims.padding + ratio * (chartDims.width - chartDims.padding * 2);

        return (
          <Fragment key={index}>
            <polyline
              fill="none"
              stroke="#dbdbdb"
              strokeWidth=".5"
              points={`${xCoordinate},${startY} ${xCoordinate},${endY}`}
            />
          </Fragment>
        );
      })}
      ;
    </>
  );
});

export const HorizontalGuides = component$(({ chartDims }: Props) => {
  const startX = chartDims.padding;
  const endX = chartDims.width - chartDims.padding;

  return (
    <>
      {new Array(chartDims.nHorizGuides).fill(0).map((_, index) => {
        const ratio = (index + 1) / chartDims.nHorizGuides;

        const yCoordinate =
          chartDims.chartHeight -
          chartDims.chartHeight * ratio +
          chartDims.padding;

        return (
          <Fragment key={index}>
            <polyline
              fill="none"
              stroke={"#dbdbdb"}
              strokeWidth=".5"
              points={`${startX},${yCoordinate} ${endX},${yCoordinate}`}
            />
          </Fragment>
        );
      })}
      ;
    </>
  );
});
