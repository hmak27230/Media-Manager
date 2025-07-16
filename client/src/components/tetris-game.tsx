import { useEffect, useRef, useCallback, useState } from "react";

interface TetrisGameProps {
  isRunning: boolean;
  onGameOver: (score: number) => void;
  onScoreChange: (score: number) => void;
}

interface Position {
  x: number;
  y: number;
}

interface Piece {
  shape: number[][];
  color: string;
  position: Position;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 20;

// Tetris pieces (tetrominoes)
const PIECES = [
  // I-piece
  {
    shape: [[1, 1, 1, 1]],
    color: "#00ffff",
  },
  // O-piece
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#ffff00",
  },
  // T-piece
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "#800080",
  },
  // S-piece
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "#00ff00",
  },
  // Z-piece
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "#ff0000",
  },
  // J-piece
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: "#0000ff",
  },
  // L-piece
  {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: "#ffa500",
  },
];

export function TetrisGame({ isRunning, onGameOver, onScoreChange }: TetrisGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef({
    board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)),
    currentPiece: null as Piece | null,
    nextPiece: null as Piece | null,
    score: 0,
    lines: 0,
    level: 1,
    dropTime: 0,
    lastTime: 0,
  });

  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);

  const createPiece = useCallback((): Piece => {
    const pieceTemplate = PIECES[Math.floor(Math.random() * PIECES.length)];
    return {
      shape: pieceTemplate.shape,
      color: pieceTemplate.color,
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
    };
  }, []);

  const rotatePiece = useCallback((piece: Piece): Piece => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  }, []);

  const isValidMove = useCallback((piece: Piece, deltaX: number, deltaY: number): boolean => {
    const game = gameRef.current;
    const newX = piece.position.x + deltaX;
    const newY = piece.position.y + deltaY;

    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardX = newX + x;
          const boardY = newY + y;

          if (
            boardX < 0 ||
            boardX >= BOARD_WIDTH ||
            boardY >= BOARD_HEIGHT ||
            (boardY >= 0 && game.board[boardY][boardX])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  const placePiece = useCallback((piece: Piece) => {
    const game = gameRef.current;
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardX = piece.position.x + x;
          const boardY = piece.position.y + y;
          if (boardY >= 0) {
            game.board[boardY][boardX] = piece.color;
          }
        }
      }
    }
  }, []);

  const clearLines = useCallback(() => {
    const game = gameRef.current;
    let linesCleared = 0;

    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (game.board[y].every(cell => cell !== 0)) {
        game.board.splice(y, 1);
        game.board.unshift(Array(BOARD_WIDTH).fill(0));
        linesCleared++;
        y++; // Check the same row again
      }
    }

    if (linesCleared > 0) {
      game.lines += linesCleared;
      game.level = Math.floor(game.lines / 10) + 1;
      
      // Scoring system
      const lineScores = [0, 100, 300, 500, 800];
      game.score += lineScores[linesCleared] * game.level;

      setLines(game.lines);
      setLevel(game.level);
      setScore(game.score);
      onScoreChange(game.score);
    }
  }, [onScoreChange]);

  const spawnNewPiece = useCallback(() => {
    const game = gameRef.current;
    
    if (!game.nextPiece) {
      game.nextPiece = createPiece();
    }

    game.currentPiece = game.nextPiece;
    game.nextPiece = createPiece();

    // Check for game over
    if (game.currentPiece && !isValidMove(game.currentPiece, 0, 0)) {
      onGameOver(game.score);
      return false;
    }

    return true;
  }, [createPiece, isValidMove, onGameOver]);

  const movePiece = useCallback((deltaX: number, deltaY: number) => {
    const game = gameRef.current;
    if (!game.currentPiece) return false;

    if (isValidMove(game.currentPiece, deltaX, deltaY)) {
      game.currentPiece.position.x += deltaX;
      game.currentPiece.position.y += deltaY;
      return true;
    }
    return false;
  }, [isValidMove]);

  const hardDrop = useCallback(() => {
    const game = gameRef.current;
    if (!game.currentPiece) return;

    let dropDistance = 0;
    while (movePiece(0, 1)) {
      dropDistance++;
    }

    // Bonus points for hard drop
    game.score += dropDistance * 2;
    setScore(game.score);
    onScoreChange(game.score);
  }, [movePiece, onScoreChange]);

  const rotatePieceAction = useCallback(() => {
    const game = gameRef.current;
    if (!game.currentPiece) return;

    const rotated = rotatePiece(game.currentPiece);
    if (isValidMove(rotated, 0, 0)) {
      game.currentPiece = rotated;
    }
  }, [rotatePiece, isValidMove]);

  const drawGame = useCallback((ctx: CanvasRenderingContext2D) => {
    const game = gameRef.current;
    
    // Clear canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, BOARD_WIDTH * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE);

    // Draw board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (game.board[y][x]) {
          ctx.fillStyle = game.board[y][x] as string;
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
        }
      }
    }

    // Draw current piece
    if (game.currentPiece) {
      ctx.fillStyle = game.currentPiece.color;
      for (let y = 0; y < game.currentPiece.shape.length; y++) {
        for (let x = 0; x < game.currentPiece.shape[y].length; x++) {
          if (game.currentPiece.shape[y][x]) {
            const drawX = (game.currentPiece.position.x + x) * CELL_SIZE;
            const drawY = (game.currentPiece.position.y + y) * CELL_SIZE;
            ctx.fillRect(drawX, drawY, CELL_SIZE - 1, CELL_SIZE - 1);
          }
        }
      }
    }

    // Draw grid lines
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 1;
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE);
      ctx.stroke();
    }
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(BOARD_WIDTH * CELL_SIZE, y * CELL_SIZE);
      ctx.stroke();
    }
  }, []);

  const gameLoop = useCallback((time: number) => {
    if (!isRunning) return;

    const game = gameRef.current;
    const deltaTime = time - game.lastTime;
    game.lastTime = time;
    game.dropTime += deltaTime;

    const dropInterval = Math.max(50, 1000 - (game.level - 1) * 50);

    if (game.dropTime > dropInterval) {
      if (!movePiece(0, 1)) {
        if (game.currentPiece) {
          placePiece(game.currentPiece);
          clearLines();
          if (!spawnNewPiece()) {
            return; // Game over
          }
        }
      }
      game.dropTime = 0;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        drawGame(ctx);
      }
    }

    requestAnimationFrame(gameLoop);
  }, [isRunning, movePiece, placePiece, clearLines, spawnNewPiece, drawGame]);

  const resetGame = useCallback(() => {
    const game = gameRef.current;
    game.board = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
    game.currentPiece = null;
    game.nextPiece = null;
    game.score = 0;
    game.lines = 0;
    game.level = 1;
    game.dropTime = 0;
    game.lastTime = 0;

    setScore(0);
    setLines(0);
    setLevel(1);
    onScoreChange(0);

    if (isRunning) {
      spawnNewPiece();
    }
  }, [isRunning, spawnNewPiece, onScoreChange]);

  useEffect(() => {
    if (isRunning) {
      resetGame();
      requestAnimationFrame(gameLoop);
    }
  }, [isRunning, resetGame, gameLoop]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isRunning) return;

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "W", "a", "A", "s", "S", "d", "D", " "].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          movePiece(-1, 0);
          break;
        case "ArrowRight":
        case "d":
        case "D":
          movePiece(1, 0);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (movePiece(0, 1)) {
            const game = gameRef.current;
            game.score += 1;
            setScore(game.score);
            onScoreChange(game.score);
          }
          break;
        case "ArrowUp":
        case "w":
        case "W":
          rotatePieceAction();
          break;
        case " ":
          hardDrop();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress, { capture: true });
    return () => window.removeEventListener("keydown", handleKeyPress, { capture: true });
  }, [isRunning, movePiece, rotatePieceAction, hardDrop, onScoreChange]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-8">
        <div className="text-sm space-y-2">
          <div>Score: {score}</div>
          <div>Lines: {lines}</div>
          <div>Level: {level}</div>
        </div>
        <canvas
          ref={canvasRef}
          width={BOARD_WIDTH * CELL_SIZE}
          height={BOARD_HEIGHT * CELL_SIZE}
          className="border border-primary bg-background"
        />
        <div className="text-sm space-y-2">
          <div>Controls:</div>
          <div>←→ Move</div>
          <div>↑ Rotate</div>
          <div>↓ Soft Drop</div>
          <div>Space Hard Drop</div>
        </div>
      </div>
    </div>
  );
}