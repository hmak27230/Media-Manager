import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SnakeGame } from "./snake-game";
import { PongGame } from "./pong-game";
import { TetrisGame } from "./tetris-game";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Trophy } from "lucide-react";

interface GameCenterProps {
  onBack: () => void;
}

type GameType = "snake" | "pong" | "tetris" | null;

export function GameCenter({ onBack }: GameCenterProps) {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: topScores = [] } = useQuery({
    queryKey: ["/api/scores/top", selectedGame, "5"],
    enabled: !!selectedGame,
  });

  const games = [
    { id: "snake", name: "🐍 SNAKE", available: true },
    { id: "pong", name: "🏓 PONG", available: true },
    { id: "tetris", name: "🧩 TETRIS", available: true },
  ];

  const saveScoreMutation = useMutation({
    mutationFn: async (score: number) => {
      await apiRequest("POST", "/api/scores", {
        game: selectedGame,
        score: score,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scores"] });
      toast({
        title: "Score Saved",
        description: `High score of ${gameScore} saved!`,
      });
    },
  });

  const startGame = (gameType: GameType) => {
    setSelectedGame(gameType);
    setGameScore(0);
    setGameRunning(true);
  };

  const resetGame = () => {
    setGameRunning(false);
    setGameScore(0);
  };

  const handleGameOver = (finalScore: number) => {
    setGameRunning(false);
    setGameScore(finalScore);
    if (finalScore > 0) {
      saveScoreMutation.mutate(finalScore);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-accent">GAME CENTER</h2>
        <Button onClick={onBack} variant="outline">
          ← BACK
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Game Selection */}
        <Card className="bg-card border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-accent">SELECT GAME</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {games.map((game) => (
                <Button
                  key={game.id}
                  onClick={() => game.available && startGame(game.id as GameType)}
                  disabled={!game.available}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {game.name}
                  {!game.available && (
                    <span className="ml-2 text-xs text-muted-foreground">(Coming Soon)</span>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* High Scores */}
        <Card className="bg-card border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-accent flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              HIGH SCORES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedGame ? (
                topScores.length > 0 ? (
                  topScores.map((score: any, index: number) => (
                    <div key={score.id} className="flex justify-between items-center p-2 bg-background border border-border">
                      <span className="text-sm">#{index + 1}</span>
                      <span className="text-sm font-bold">{score.score}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground text-sm">No scores yet</div>
                )
              ) : (
                <div className="text-muted-foreground text-sm">Select a game to view scores</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Game Display */}
        <Card className="lg:col-span-2 bg-card border-2 border-primary">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-accent">
                {selectedGame ? selectedGame.toUpperCase() : "SELECT A GAME"}
              </CardTitle>
              <div className="flex items-center space-x-4">
                <span className="text-sm">SCORE: {gameScore}</span>
                <Button
                  onClick={resetGame}
                  disabled={!selectedGame}
                  variant="outline"
                  size="sm"
                >
                  RESET
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {selectedGame === "snake" ? (
                <SnakeGame
                  isRunning={gameRunning}
                  onGameOver={handleGameOver}
                  onScoreChange={setGameScore}
                />
              ) : selectedGame === "pong" ? (
                <PongGame
                  isRunning={gameRunning}
                  onGameOver={handleGameOver}
                  onScoreChange={setGameScore}
                />
              ) : selectedGame === "tetris" ? (
                <TetrisGame
                  isRunning={gameRunning}
                  onGameOver={handleGameOver}
                  onScoreChange={setGameScore}
                />
              ) : (
                <div className="game-canvas w-full h-64 flex items-center justify-center">
                  <div className="text-center">
                    <h4 className="text-xl font-bold mb-4 text-accent">GAME INSTRUCTIONS</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use arrow keys or WASD to control
                    </p>
                    <p className="text-sm">Select a game to start playing</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
