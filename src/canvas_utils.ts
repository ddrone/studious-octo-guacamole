export function starPath(ctx: CanvasRenderingContext2D, x: number, y: number, outerR: number, innerR: number, segments: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - outerR);

  const halfAngle = Math.PI / segments;
  const angle = halfAngle * 2;

  for (let i = 0; i < segments; i++) {
    const currAngle = -Math.PI / 2 + angle * i;
    const angle1 = currAngle + halfAngle;
    const angle2 = currAngle + angle;
    ctx.lineTo(x + innerR * Math.cos(angle1), y + innerR * Math.sin(angle1));
    ctx.lineTo(x + outerR * Math.cos(angle2), y + outerR * Math.sin(angle2));
  }
}
