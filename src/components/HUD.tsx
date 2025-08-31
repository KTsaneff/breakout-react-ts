export default function HUD({score, lives, paused, bricks}: {score: number; lives: number; paused: boolean; bricks: number}){
    return (
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span className="badge">Score: {score}</span>
            <span className="badge">Lives: {lives}</span>
            <span className="badge">Bricks: {bricks}</span>
            {paused && <span className="badge">Paused</span>}
        </div>
    );
}