export function mapCoordinates(
  x: number,
  y: number,
  size: number,
  rotateXDeg: number,
  perspective: number,
) {
  const rad = (rotateXDeg * Math.PI) / 180;

  const yTopLeft = size - y;

  const cx = size / 2;
  const cy = size / 2;

  const px = x - cx;
  const py = yTopLeft - cy;
  const pz = 0;

  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const ry = py * cos - pz * sin;
  const rz = py * sin + pz * cos;

  const scale = perspective / (perspective - rz);

  const sx = px * scale;
  const sy = ry * scale;

  return {
    x: sx + cx,
    y: sy + cy,
  };
}
