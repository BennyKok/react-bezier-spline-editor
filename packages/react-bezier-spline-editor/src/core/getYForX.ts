import type { Point } from './Point';

export function getYForX(points: Point[], xInput: number) {
  if (points.length < 4 || (points.length - 1) % 3 !== 0) {
    throw new Error(
      'Points array must contain 1 + 3n points for cubic Bézier curves.',
    );
  }

  for (let i = 0; i < points.length - 3; i += 3) {
    const [P0, P1, P2, P3] = [
      points[i],
      points[i + 1],
      points[i + 2],
      points[i + 3],
    ];
    if (xInput >= P0.x && xInput <= P3.x) {
      let tGuess = 0.5;
      for (let j = 0; j < 30; j++) {
        const t = 1 - tGuess;
        const C0 = { x: t * P0.x + tGuess * P1.x, y: t * P0.y + tGuess * P1.y };
        const C1 = { x: t * P1.x + tGuess * P2.x, y: t * P1.y + tGuess * P2.y };
        const C2 = { x: t * P2.x + tGuess * P3.x, y: t * P2.y + tGuess * P3.y };
        const B0 = { x: t * C0.x + tGuess * C1.x, y: t * C0.y + tGuess * C1.y };
        const B1 = { x: t * C1.x + tGuess * C2.x, y: t * C1.y + tGuess * C2.y };
        const xGuess = t * B0.x + tGuess * B1.x;
        const dxdt =
          3 * t * t * (P1.x - P0.x) +
          6 * t * tGuess * (P2.x - P1.x) +
          3 * tGuess * tGuess * (P3.x - P2.x);
        if (Math.abs(dxdt) < 0.0001) break;
        tGuess -= (xGuess - xInput) / dxdt;
      }
      return (
        (1 - tGuess) ** 3 * P0.y +
        3 * (1 - tGuess) ** 2 * tGuess * P1.y +
        3 * (1 - tGuess) * tGuess ** 2 * P2.y +
        tGuess ** 3 * P3.y
      );
    }
  }
  // throw new Error("xInput is out of the range of the provided points.");
  return 0;
}
