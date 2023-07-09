import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import type { QwikMouseEvent } from "@builder.io/qwik";

import {
  getChartDims,
  definePoints,
  getCoords,
  type ChartDims,
} from "~/utils/chart/chart-helpers";

import { XAxis, YAxis, LabelsXAxis, LabelsYAxis } from "./Axis";
import { VerticalGuides, HorizontalGuides } from "./Guides";
import { Crosshairs } from "./Crosshairs";

export interface Coords {
  x: number;
  y: number;
}

const data = [
  { x: 0, y: 0 },
  { x: 1, y: 400 },
  { x: 2, y: 300 },
  { x: 3, y: 100 },
  { x: 4, y: -100 },
  { x: 5, y: -150 },
  { x: 6, y: 400 },
  { x: 7, y: 700 },
];

export default component$(() => {
  const coords = useSignal<Coords>({ x: 0, y: 0 });
  const svgRef = useSignal<SVGElement>();
  const rafId = useSignal<any>(null);

  const width = 500;
  const height = 300;

  const chartDims: ChartDims = getChartDims(data, width, height);

  const points: string = definePoints(data, chartDims);

  const handleMouseMove = $((event: QwikMouseEvent<Element, MouseEvent>) => {
    getCoords(rafId, svgRef, event, ([x, y]) => {
      coords.value = {
        ...coords.value,
        x,
        y,
      };
    });
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
