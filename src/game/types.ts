export type Vec2 = { 
    x: number; 
    y: number
};

export type Brick = {
    id: string;
    x: number; 
    y: number; 
    w: number; 
    h: number;
    hp: 1 | 2 | 3;
    kind: "normal" | "steel" | "power";
};

export type Level = { 
    rows: number; 
    cols: number; 
    cellW: number; 
    cellH: number; 
    bricks: Brick[] 
};

export type GameState = {
    ball: { pos: Vec2; vel: Vec2; r: number };
    paddle: { pos: Vec2; w: number; h: number; speed: number };
    level: Level;
    lives: number;
    score: number;
    paused: boolean;
    started: boolean;
    ballSpeed: number;
    baseBallSpeed: number;
    maxBallSpeed: number;
    width: number;
    height: number;
};