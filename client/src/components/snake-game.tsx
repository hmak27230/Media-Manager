import { useEffect, useRef, useState, useCallback } from "react";

interface SnakeGameProps {
  isRunning: boolean;
  onGameOver: (score: number) => void;
  onScoreChange: (score: number) => void;
}

interface Position {
  x: number;
  y: number;
}

export function SnakeGame({ isRunning, onGameOver, onScoreChange }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameStateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 15, y: 15 },
    score: 0,
    gameOver: false,
  });

  const GRID_SIZE = 20;
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 300;
  const GRID_WIDTH = Math.floor(CANVAS_WIDTH / GRID_SIZE);
  const GRID_HEIGHT = Math.floor(CANVAS_HEIGHT / GRID_SIZE);

  const resetGame = useCallback(() => {
    gameStateRef.current = {
      snake: [{ x: Math.floor(GRID_WIDTH / 2), y: Math.floor(GRID_HEIGHT / 2) }],
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      food: { x: Math.floor(GRID_WIDTH * 0.7), y: Math.floor(GRID_HEIGHT * 0.7) },
      score: 0,
      gameOver: false,
    };
    onScoreChange(0);
  }, [onScoreChange]);

  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT),
      };
    } while (gameStateRef.current.snake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y
    ));
    return newFood;
  }, []);

  const drawGame = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.fillStyle = "#0A0A0A";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const game = gameStateRef.current;

    // Draw snake
    ctx.fillStyle = "#00FF41";
    game.snake.forEach((segment) => {
      ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    });

    // Draw food
    ctx.fillStyle = "#FF6B35";
    ctx.fillRect(game.food.x * GRID_SIZE, game.food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);

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

    // Update direction from next direction
    game.direction = { ...game.nextDirection };

    // Move snake
    const head = { ...game.snake[0] };
    head.x += game.direction.x;
    head.y += game.direction.y;

    // Check boundaries
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
      game.gameOver = true;
      onGameOver(game.score);
      return;
    }

    // Check self collision
    if (game.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      game.gameOver = true;
      onGameOver(game.score);
      return;
    }

    game.snake.unshift(head);

    // Check food collision
    if (head.x === game.food.x && head.y === game.food.y) {
      game.score += 10;
      onScoreChange(game.score);
      game.food = generateFood();
    } else {
      game.snake.pop();
    }
  }, [isRunning, onGameOver, onScoreChange, generateFood]);

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

    intervalRef.current = setInterval(gameLoop, 150);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, updateGame, resetGame]);

  const changeDirection = useCallback((newDirection: Position) => {
    const game = gameStateRef.current;
    if (game.gameOver) return;

    // Prevent reversing into self
    if (newDirection.x === -game.direction.x && newDirection.y === -game.direction.y) {
      return;
    }

    game.nextDirection = newDirection;
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isRunning) return;

      // Only prevent default for game controls to avoid interfering with other functionality
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "W", "a", "A", "s", "S", "d", "D"].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          changeDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
        case "s":
        case "S":
          changeDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          changeDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
        case "d":
        case "D":
          changeDirection({ x: 1, y: 0 });
          break;
      }
    };

    // Add event listener to the window to capture all key presses
    window.addEventListener("keydown", handleKeyPress, { capture: true });
    return () => window.removeEventListener("keydown", handleKeyPress, { capture: true });
  }, [isRunning, changeDirection]);

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
