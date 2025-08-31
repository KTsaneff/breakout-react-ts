import type { GameState, Brick } from "./types";

export function clampPaddle(s: GameState) {
  const p = s.paddle;
  p.pos.x = Math.max(0, Math.min(s.width - p.w, p.pos.x));
}

export function tickBall(s: GameState, dt: number) {
  const b = s.ball;
  b.pos.x += b.vel.x * dt;
  b.pos.y += b.vel.y * dt;

  const eps = 0.25;
  if (b.pos.x - b.r < 0) {
    b.pos.x = b.r + eps;
    b.vel.x *= -1;
  }
  if (b.pos.x + b.r > s.width) {
    b.pos.x = s.width - b.r - eps;
    b.vel.x *= -1;
  }
  if (b.pos.y - b.r < 0) {
    b.pos.y = b.r + eps;
    b.vel.y *= -1;
  }

  const p = s.paddle;
  if (circleRect(b.pos.x, b.pos.y, b.r, p.pos.x, p.pos.y, p.w, p.h)) {
    b.pos.y = p.pos.y - b.r - eps;
    b.vel.y = -Math.abs(b.vel.y);

    const hit = (b.pos.x - (p.pos.x + p.w / 2)) / (p.w / 2);
    b.vel.x += hit * 140;
  }
}

export function resetBall(s: GameState) {
  s.ball.pos.x = s.width / 2;
  s.ball.pos.y = s.height - 120;
  const dirX = Math.random() > 0.5 ? 1 : -1;
  s.ball.vel.x = 110 * 0.6 * dirX;
  s.ball.vel.y = -170;             
}

export function hitBricks(s: GameState) {
  const b = s.ball;
  let changed = false;
  const keep: Brick[] = [];

  for (const br of s.level.bricks) {
    if (!circleRect(b.pos.x, b.pos.y, b.r, br.x, br.y, br.w, br.h)) {
      keep.push(br);
      continue;
    }
    changed = true;

    const cx = clamp(b.pos.x, br.x, br.x + br.w);
    const cy = clamp(b.pos.y, br.y, br.y + br.h);
    const dx = b.pos.x - cx;
    const dy = b.pos.y - cy;
    if (Math.abs(dx) > Math.abs(dy)) {
      b.vel.x *= -1;
    } else {
      b.vel.y *= -1;
    }

    const hp = (br.hp - 1) as 0 | 1 | 2;
    if (hp > 0) keep.push({ ...br, hp: hp as 1 | 2 | 3 });
  }

  s.level.bricks = keep;
  return changed;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function circleRect(
  cx: number, cy: number, r: number,
  rx: number, ry: number, rw: number, rh: number
) {
  const x = clamp(cx, rx, rx + rw);
  const y = clamp(cy, ry, ry + rh);
  const dx = cx - x, dy = cy - y;
  return dx * dx + dy * dy <= r * r;
}
