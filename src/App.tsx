import { useCallback, useEffect, useState } from "react";
import CanvasStage from "./components/CanvasStage";
import HUD from "./components/HUD";
import type { GameState, Level } from "./game/types";
import { tickBall, hitBricks, clampPaddle, resetBall } from "./game/physics";
import { useGameLoop } from "./hooks/useGameLoop";
import { useKeyboard } from "./hooks/useKeyboard";

const W = 800, H = 600;

function makeLevel(): Level {
  const cols = 10, rows = 6;
  const cellW = 72, cellH = 24;
  const offsetX = (W - cols * cellW) / 2;
  const offsetY = 60;
  const bricks = [] as Level["bricks"];

  let id = 0;

  for(let r = 0; r < rows; r++){
    for(let c = 0; c < cols; c++){
      bricks.push({
        id: String(id++),
        x: offsetX + c * cellW,
        y: offsetY + r * cellH,
        w: cellW - 6,
        h: cellH - 6,
        hp: ((r % 3) + 1) as 1 | 2 | 3,
        kind: r % 2 === 0 ? "normal" : "steel",
      });
    }
  }
  return { rows, cols, cellW, cellH, bricks};
}

export default function App(){
  const keys = useKeyboard();
  const [state, setState] = useState<GameState>(() => ({
    ball: { pos: { x: W / 2, y: H - 120 }, vel: {x: 110, y: -170 }, r: 8},
    paddle: { pos: {x: W / 2 - 60, y: H - 60}, w: 120, h: 14, speed: 920},
    level: makeLevel(),
    lives: 3,
    score: 0,
    paused: false,
    started: false,
    ballSpeed: 120,
    baseBallSpeed: 120,
    maxBallSpeed: 520,
    width: W,
    height: H,
  }));

  const tick = useCallback((dt: number) => {
    setState((s) => {
      if(!s.started || s.paused){
        return s;
      }

      let dx = 0;
      if(keys["ArrowLeft"] || keys["a"]){
        dx -= 1;
      }
      if(keys["ArrowRight"] || keys["d"]){
        dx += 1;
      }
      const nx = s.paddle.pos.x + dx * s.paddle.speed * dt;

      const next = { ...s, paddle: {... s.paddle, pos: { ...s.paddle.pos, x: nx} } } as GameState;
      clampPaddle(next);

      tickBall(next, dt);
      const broke = hitBricks(next);
      if(broke){
        next.score += 10;
      }

      if(next.ball.pos.y - next.ball.r > next.height) {
        const lives = next.lives - 1;
        if(lives <= 0){
          return { ...next, lives: 0, paused: true} as GameState;
        }
        resetBall(next);
        next.lives = lives;
      }

      if(next.level.bricks.length === 0){
        next.paused = true;
      }

      return next;
    });
  }, [keys]);

  useGameLoop(tick, true);

  useEffect(() => {
    if(keys[" "] || keys["Space"]){
      setState((s) => {
        if(!s.started){
          return { ... s, started: true, paused: false};
        }
        if(s.paused){
          return { ...s, paused: false};
        }
        return s;
      });
    }
  }, [keys]);

  return (
    <div className="wrapper">
      <div className="card">
        <div className="header">
          <h1>Breakout • React + TypeScript</h1>
          <div className="controls">
            <span className="badge">Move: ←/→ or A/D</span>
            {!state.started ? (
              <button onClick={() => setState(s => ({ ...s, started: true, paused: false }))}>
                Start
              </button>
            ) : (
              <button onClick={() => setState(s => ({ ...s, paused: !s.paused }))}>
                {state.paused ? "Resume" : "Pause"}
              </button>
            )}
            <button
              onClick={() => {
                setState(s => ({
                  ...s,
                  started: false,
                  paused: false,
                  lives: 3,
                  score: 0,
                  level: makeLevel(),
                  ball: { pos: { x: W / 2, y: H - 120 }, vel: { x: 180, y: -260 }, r: 8 },
                  paddle: { ...s.paddle, pos: { x: W / 2 - s.paddle.w / 2, y: H - 60 } },
                }));
              }}
            >
              Reset
            </button>
          </div>
        </div>
        <div className="canvas-wrap">
          <HUD score={state.score} lives={state.lives} paused={state.paused} bricks={state.level.bricks.length} />
          <CanvasStage state={state} />
          <div className="help">Tip: Use Run/Pause/Reset to test the loop. Add bricks/HP and editor next step.</div>
        </div>
      </div>
    </div>
  );
}