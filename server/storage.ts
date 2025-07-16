import { mediaFiles, gameScores, type MediaFile, type InsertMediaFile, type GameScore, type InsertGameScore } from "@shared/schema";

export interface IStorage {
  // Media files
  getMediaFiles(type?: string): Promise<MediaFile[]>;
  addMediaFile(file: InsertMediaFile): Promise<MediaFile>;
  deleteMediaFile(id: number): Promise<void>;
  
  // Game scores
  getGameScores(game?: string): Promise<GameScore[]>;
  addGameScore(score: InsertGameScore): Promise<GameScore>;
  getTopScores(game: string, limit: number): Promise<GameScore[]>;
}

export class MemStorage implements IStorage {
  private mediaFiles: Map<number, MediaFile>;
  private gameScores: Map<number, GameScore>;
  private currentMediaId: number;
  private currentScoreId: number;

  constructor() {
    this.mediaFiles = new Map();
    this.gameScores = new Map();
    this.currentMediaId = 1;
    this.currentScoreId = 1;
  }

  async getMediaFiles(type?: string): Promise<MediaFile[]> {
    const files = Array.from(this.mediaFiles.values());
    return type ? files.filter(f => f.type === type) : files;
  }

  async addMediaFile(insertFile: InsertMediaFile): Promise<MediaFile> {
    const id = this.currentMediaId++;
    const file: MediaFile = {
      ...insertFile,
      id,
      uploadedAt: new Date(),
    };
    this.mediaFiles.set(id, file);
    return file;
  }

  async deleteMediaFile(id: number): Promise<void> {
    this.mediaFiles.delete(id);
  }

  async getGameScores(game?: string): Promise<GameScore[]> {
    const scores = Array.from(this.gameScores.values());
    return game ? scores.filter(s => s.game === game) : scores;
  }

  async addGameScore(insertScore: InsertGameScore): Promise<GameScore> {
    const id = this.currentScoreId++;
    const score: GameScore = {
      ...insertScore,
      id,
      achievedAt: new Date(),
    };
    this.gameScores.set(id, score);
    return score;
  }

  async getTopScores(game: string, limit: number): Promise<GameScore[]> {
    const scores = Array.from(this.gameScores.values())
      .filter(s => s.game === game)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    return scores;
  }
}

export const storage = new MemStorage();
