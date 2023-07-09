import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import type { QwikMouseEvent } from "@builder.io/qwik";

import { XAxis, YAxis, LabelsXAxis, LabelsYAxis } from "./Axis";
import { VerticalGuides, HorizontalGuides } from "./Guides";
import { getChartDims, definePoints } from "~/utils/chart/structure";
import { Crosshairs, type Coords } from "./Crosshairs";

import { showCrosshairs } from "~/utils/chart/crosshairs";
import type { ChartDims } from "~/utils/chart/structure";

const data = [
  { label: "S", x: 0, y: 0 },
  { label: "M", x: 1, y: 400 },
  { label: "T", x: 2, y: 300 },
  { label: "W", x: 3, y: 100 },
  { label: "TH", x: 4, y: 400 },
  { label: "F", x: 5, y: 500 },
  { label: "F", x: 6, y: -100 },
  { label: "F", x: 7, y: -500 },
  { label: "F", x: 8, y: 420 },
  { label: "F", x: 9, y: 700 },
  { label: "F", x: 10, y: 500 },
  { label: "S", x: 11, y: 550 },
];

export default component$(() => {
  const coords = useSignal<Coords>({ x: 0, y: 0 });
  const svgRef = useSignal<SVGElement>();
  const rafId = useSignal<any>(null);

  const width = 500;
  const height = 300;
  const precision = 2;
  const fontSize = 8;
  const nVerticalGuides = 4;
  const nHorizGuides = 4;

  const chartDims: ChartDims = getChartDims(
    data,
    width,
    height,
    precision,
    fontSize,
    nVerticalGuides,
    nHorizGuides
  );

  const points: string = definePoints(data, chartDims);

  const handleMouseMove = $((event: QwikMouseEvent<Element, MouseEvent>) => {
    showCrosshairs(rafId, svgRef, coords, event);
  });

  return (
    <>
      <div
        style={{ width: "700px", height: "500px", backgroundColor: "#000000" }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ border: "0.5px solid #ccc", backgroundColor: "#EFEFEF" }}
          onMouseMove$={handleMouseMove}
          ref={svgRef}
        >
          <XAxis chartDims={chartDims} />
          <LabelsXAxis chartDims={chartDims} data={data} />
          <LabelsYAxis chartDims={chartDims} />
          <HorizontalGuides chartDims={chartDims} />
          <VerticalGuides chartDims={chartDims} />
          <YAxis chartDims={chartDims} />
          <polyline
            fill="none"
            stroke="#0074d9"
            strokeWidth={1}
            points={points}
          />
          <Crosshairs coords={coords.value} width={width} height={height} />
        </svg>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
