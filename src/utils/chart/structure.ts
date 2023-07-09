export interface ChartData {
  label: string;
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

export const getChartDims = (
  data: ChartData[],
  width: number,
  height: number,
  precision: number,
  fontSize: number,
  nVerticalGuides: number,
  nHorizGuides: number
) => {
  const maximumXFromData = Math.max(...data.map((e) => e.x)); // points
  const maximumYFromData = Math.max(...data.map((e) => e.y)) + 200;
  const minimumYFromData = Math.min(...data.map((e) => e.y)) - 200;
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
