import { component$, useSignal } from "@builder.io/qwik";

export interface Coords {
  x: number;
  y: number;
}

type Props = {
  coords: Coords;
  width: number;
  height: number;
};

export const Crosshairs = component$(({ coords, width, height }: Props) => {
  return (
    <>
      <line x1={coords.x} y1="0" x2={coords.x} y2={height} stroke="black" />
      <line x1="0" y1={coords.y} x2={width} y2={coords.y} stroke="black" />
    </>
  );
});
