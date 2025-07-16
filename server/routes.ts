import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { insertMediaFileSchema, insertGameScoreSchema } from "@shared/schema";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get media files
  app.get("/api/media/:type?", async (req, res) => {
    try {
      const { type } = req.params;
      const files = await storage.getMediaFiles(type);
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media files" });
    }
  });

  // Upload media file
  app.post("/api/media/upload", upload.single("file"), async (req: MulterRequest, res) => {
    try {
      console.log("Upload request received:", req.file ? "File present" : "No file");
      
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      console.log("File details:", {
        name: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });

      const fileType = req.file.mimetype.startsWith("image/") ? "image" : "audio";
      const base64Data = req.file.buffer.toString("base64");
      const dataUri = `data:${req.file.mimetype};base64,${base64Data}`;

      const mediaFile = await storage.addMediaFile({
        name: req.file.originalname,
        type: fileType,
        url: dataUri,
        size: req.file.size,
      });

      console.log("File stored successfully:", mediaFile.id);
      res.json(mediaFile);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Delete media file
  app.delete("/api/media/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMediaFile(id);
      res.json({ message: "File deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // Get game scores
  app.get("/api/scores/:game?", async (req, res) => {
    try {
      const { game } = req.params;
      const scores = await storage.getGameScores(game);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scores" });
    }
  });

  // Add game score
  app.post("/api/scores", async (req, res) => {
    try {
      const scoreData = insertGameScoreSchema.parse(req.body);
      const score = await storage.addGameScore(scoreData);
      res.json(score);
    } catch (error) {
      res.status(400).json({ message: "Invalid score data" });
    }
  });

  // Get top scores for a game
  app.get("/api/scores/top/:game/:limit", async (req, res) => {
    try {
      const { game, limit } = req.params;
      const scores = await storage.getTopScores(game, parseInt(limit));
      res.json(scores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top scores" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
