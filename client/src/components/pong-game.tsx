import { useEffect, useRef, useCallback } from "react";

interface PongGameProps {
  isRunning: boolean;
  onGameOver: (score: number) => void;
  onScoreChange: (score: number) => void;
}

export function PongGame({ isRunning, onGameOver, onScoreChange }: PongGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameStateRef = useRef({
    paddle: { x: 0, y: 0, width: 10, height: 60 },
    ball: { x: 0, y: 0, vx: 3, vy: 2, size: 8 },
    score: 0,
    gameOver: false,
  });

  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 300;
  const PADDLE_SPEED = 15;

  const resetGame = useCallback(() => {
    gameStateRef.current = {
      paddle: { 
        x: 20, 
        y: CANVAS_HEIGHT / 2 - 30, 
        width: 10, 
        height: 60 
      },
      ball: { 
        x: CANVAS_WIDTH / 2, 
        y: CANVAS_HEIGHT / 2, 
        vx: 3, 
        vy: 2, 
        size: 8 
      },
      score: 0,
      gameOver: false,
    };
    onScoreChange(0);
  }, [onScoreChange]);

  const drawGame = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.fillStyle = "#0A0A0A";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const game = gameStateRef.current;

    // Draw center line
    ctx.strokeStyle = "#00FF41";
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw player paddle
    ctx.fillStyle = "#00FF41";
    ctx.fillRect(game.paddle.x, game.paddle.y, game.paddle.width, game.paddle.height);

    // Draw AI paddle (right side)
    const aiPaddleX = CANVAS_WIDTH - 30;
    const aiPaddleY = game.ball.y - 30; // AI follows ball
    ctx.fillRect(aiPaddleX, Math.max(0, Math.min(CANVAS_HEIGHT - 60, aiPaddleY)), 10, 60);

    // Draw ball
    ctx.fillStyle = "#FF6B35";
    ctx.beginPath();
    ctx.arc(game.ball.x, game.ball.y, game.ball.size, 0, Math.PI * 2);
    ctx.fill();

    // Draw score
    ctx.fillStyle = "#00FF41";
    ctx.font = "20px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${game.score}`, CANVAS_WIDTH / 4, 30);
    ctx.fillText("CPU", (CANVAS_WIDTH * 3) / 4, 30);

    // Draw game over message
    if (game.gameOver) {
      ctx.fillStyle = "#FF4444";
      ctx.font = "20px monospace";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = "16px monospace";
      ctx.fillText(`Final Score: ${game.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 25);
    }
  };

  const updateGame = useCallback(() => {
    if (!isRunning) return;

    const game = gameStateRef.current;
    if (game.gameOver) return;

    // Move ball
    game.ball.x += game.ball.vx;
    game.ball.y += game.ball.vy;

    // Ball collision with top/bottom walls
    if (game.ball.y <= game.ball.size || game.ball.y >= CANVAS_HEIGHT - game.ball.size) {
      game.ball.vy = -game.ball.vy;
    }

    // Ball collision with player paddle
    if (game.ball.x <= game.paddle.x + game.paddle.width &&
        game.ball.x >= game.paddle.x &&
        game.ball.y >= game.paddle.y &&
        game.ball.y <= game.paddle.y + game.paddle.height) {
      game.ball.vx = -game.ball.vx;
      game.score += 1;
      onScoreChange(game.score);
      
      // Increase speed slightly
      game.ball.vx *= 1.05;
      game.ball.vy *= 1.05;
    }

    // Ball collision with AI paddle
    const aiPaddleX = CANVAS_WIDTH - 30;
    const aiPaddleY = Math.max(0, Math.min(CANVAS_HEIGHT - 60, game.ball.y - 30));
    
    if (game.ball.x >= aiPaddleX &&
        game.ball.x <= aiPaddleX + 10 &&
        game.ball.y >= aiPaddleY &&
        game.ball.y <= aiPaddleY + 60) {
      game.ball.vx = -game.ball.vx;
    }

    // Ball goes off left side - game over
    if (game.ball.x <= 0) {
      game.gameOver = true;
      onGameOver(game.score);
      return;
    }

    // Ball goes off right side - reset position
    if (game.ball.x >= CANVAS_WIDTH) {
      game.ball.x = CANVAS_WIDTH / 2;
      game.ball.y = CANVAS_HEIGHT / 2;
      game.ball.vx = -Math.abs(game.ball.vx);
    }
  }, [isRunning, onGameOver, onScoreChange]);

  const movePaddle = useCallback((direction: number) => {
    const game = gameStateRef.current;
    if (game.gameOver) return;

    const newY = game.paddle.y + (direction * PADDLE_SPEED);
    game.paddle.y = Math.max(0, Math.min(CANVAS_HEIGHT - game.paddle.height, newY));
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      resetGame();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = () => {
      updateGame();
      drawGame(ctx);
    };

    // Initial draw
    drawGame(ctx);

    intervalRef.current = setInterval(gameLoop, 16); // 60 FPS
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, updateGame, resetGame]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isRunning) return;

      // Only prevent default for game controls
      if (["ArrowUp", "ArrowDown", "w", "W", "s", "S"].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          movePaddle(-1);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          movePaddle(1);
          break;
      }
    };

    // Add event listener to capture all key presses
    window.addEventListener("keydown", handleKeyPress, { capture: true });
    return () => window.removeEventListener("keydown", handleKeyPress, { capture: true });
  }, [isRunning, movePaddle]);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="game-canvas"
      />
    </div>
  );
}