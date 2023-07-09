import type { Signal, QwikMouseEvent } from "@builder.io/qwik";

export interface ChartData {
  x: number;
  y: number;
}

export interface ChartDims {
  width: number; // total viewBox
  height: number; // total viewBox
  maximumXFromData: number;
  padding: number;
  paddedYRange: number;
  paddedMinimumYFromData: number;
  paddedMaximumYFromData: number;
  chartWidth: number;
  chartHeight: number;
  dataLen: number;
  precision: number;
  fontSize: number;
  nVerticalGuides: number;
  nHorizGuides: number;
}

const calculatePrecision = (num: number): number => {
  return num < 1 ? 5 : num < 2 ? 2 : 0;
};

export const getChartDims = (
  data: ChartData[],
  width: number,
  height: number
) => {
  const fontSize = 8;
  const nVerticalGuides = Math.ceil(width / 80);
  const nHorizGuides = Math.ceil(height / 80);

  const buffRatio = 0.1;
  const maxY = Math.max(...data.map((e) => e.y));
  const buffer = Math.ceil(maxY * buffRatio);

  const precision = calculatePrecision(Math.abs(maxY));

  const maximumXFromData = Math.max(...data.map((e) => e.x)); // points
  const maximumYFromData = maxY + buffer;
  const minimumYFromData = Math.min(...data.map((e) => e.y)) - buffer;
  const yRange = maximumYFromData - minimumYFromData;

  const digits =
    parseFloat(maximumYFromData.toString()).toFixed(precision).length + 1;

  const padding = (fontSize + digits) * 3; // points
  const chartWidth = width - padding * 2; // points
  const chartHeight = height - padding * 2; // points

  const yPaddingFactor = 0.1; // points
  const paddedYRange = yRange * (1 + yPaddingFactor); // points
  const extraYPadding = (yRange * yPaddingFactor) / 2;

  const paddedMaximumYFromData = maximumYFromData + extraYPadding; // LabelsYAxis
  const paddedMinimumYFromData = minimumYFromData - extraYPadding; // points

  const dataLen = data.length; // Guides

  const chartDims: ChartDims = {
    width,
    height,
    maximumXFromData,
    padding,
    paddedYRange,
    paddedMinimumYFromData,
    paddedMaximumYFromData,
    chartWidth,
    chartHeight,
    dataLen,
    precision,
    fontSize,
    nVerticalGuides, // labels, guides
    nHorizGuides, // labels, guides
  };

  return chartDims;
};

export const definePoints = (data: ChartData[], chartDims: ChartDims) => {
  const points = data
    .map((element) => {
      const x =
        (element.x / chartDims.maximumXFromData) * chartDims.chartWidth +
        chartDims.padding;
      const y =
        chartDims.chartHeight -
        ((element.y - chartDims.paddedMinimumYFromData) /
          chartDims.paddedYRange) *
          chartDims.chartHeight +
        chartDims.padding;
      return `${x},${y}`;
    })
    .join(" ");
  return points;
};

export const getCoords = (
  rafId: Signal,
  svgRef: Signal,
  event: QwikMouseEvent<Element, MouseEvent>,
  callback: (coords: [number, number]) => void
): void => {
  // Cancel the previous RAF if it hasn't run yet
  if (rafId.value !== null) {
    cancelAnimationFrame(rafId.value);
  }

  // Create new Request Animation Frame
  // Note: RAF used for smoothness of animation
  rafId.value = requestAnimationFrame(() => {
    const svg = svgRef.value as SVGSVGElement;
    if (svg) {
      const svgRect = svg.getBoundingClientRect();
      const scaleX = svg.viewBox?.baseVal.width / svgRect.width;
      const scaleY = svg.viewBox?.baseVal.height / svgRect.height;

      // Calculate the mouse position relative to the SVG
      let mouseX = (event.clientX - svgRect.left) * scaleX;
      let mouseY = (event.clientY - svgRect.top) * scaleY;
      callback([mouseX, mouseY]);
    }
  });
};
