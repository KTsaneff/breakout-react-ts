import { useEffect, useRef } from "react";
import type { GameState } from "../game/types";

export default function CanvasStage({ state }: { state: GameState}) {
    const ref = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = ref.current!;
        const ctx = canvas.getContext("2d")!;

        const ratio = Math.max(1, Math.floor(window.devicePixelRatio || 1));
        canvas.width = state.width * ratio;
        canvas.height = state.height * ratio;
        canvas.style.width = state.width + "px";
        canvas.style.height = state.height + "px";
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        ctx.clearRect(0,0,state.width, state.height);

        ctx.fillStyle = "#0a0e24";
        ctx.fillRect(0,0, state.width, state. height);

        for(const br of state.level.bricks){
            ctx.fillStyle = br.kind === "steel" ? "#8ea7ff" : "#7cc4ff";
            ctx.globalAlpha = 0.6 + br.hp * 0.12;
            ctx.fillRect(br.x, br.y, br.w, br.h);
            ctx.globalAlpha = 1;
        }

        ctx.fillStyle = "#e6e6f0";
        ctx.fillRect(state.paddle.pos.x, state.paddle.pos.y, state.paddle.w, state.paddle.h);

        ctx.beginPath();
        ctx.arc(state.ball.pos.x, state.ball.pos.y, state.ball.r, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        
    }, [state]);

    return <canvas ref={ref} />;
};