import type { Signal, QwikMouseEvent } from "@builder.io/qwik";

export const showCrosshairs = (
  rafId: Signal,
  svgRef: Signal,
  coords: Signal,
  event: QwikMouseEvent<Element, MouseEvent>
) => {
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
      coords.value = {
        ...coords.value,
        x: mouseX,
        y: mouseY,
      };
    }
  });
};
