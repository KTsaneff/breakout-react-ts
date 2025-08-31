import { useEffect } from "react";

export function useGameLoop(tick: (dt: number) => void, running: boolean) {
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();

    const loop = (t: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (t - last) / 1000));
      last = t;
      tick(dt);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [tick, running]);
}
