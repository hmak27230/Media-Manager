import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { Play, Pause, SkipBack, SkipForward, Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAudio } from "@/hooks/use-audio";

interface MediaFile {
  id: number;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: string;
}

interface Mp3PlayerProps {
  onBack: () => void;
  volume: number;
}

export function Mp3Player({ onBack, volume }: Mp3PlayerProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: playlist = [], isLoading } = useQuery<MediaFile[]>({
    queryKey: ["/api/media/audio"],
  });

  const {
    isPlaying,
    currentTime,
    duration,
    progress,
    play,
    pause,
    seek,
    setVolume,
    loadTrack,
  } = useAudio();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiRequest("POST", "/api/media/upload", formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media/audio"] });
      toast({
        title: "Success",
        description: "Audio file uploaded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload audio file",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media/audio"] });
      toast({
        title: "Success",
        description: "Audio file deleted successfully",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("audio/")) {
          uploadMutation.mutate(file);
        }
      });
    }
  };

  const playSong = (index: number) => {
    if (index >= 0 && index < playlist.length) {
      setCurrentSongIndex(index);
      loadTrack(playlist[index].url);
      play();
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      pause();
    } else {
      if (playlist.length > 0 && currentSongIndex < playlist.length) {
        play();
      }
    }
  };

  const changeSong = (direction: number) => {
    if (playlist.length === 0) return;
    let newIndex = currentSongIndex + direction;
    if (newIndex < 0) newIndex = playlist.length - 1;
    if (newIndex >= playlist.length) newIndex = 0;
    playSong(newIndex);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Update volume when prop changes
  React.useEffect(() => {
    setVolume(volume / 100);
  }, [volume, setVolume]);

  // Keyboard controls for MP3 player
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle keys when MP3 player is focused (not in games)
      if (e.target && (e.target as HTMLElement).closest('.game-canvas')) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayback();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          changeSong(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          changeSong(1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (currentTime > 10) seek(currentTime - 10);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (currentTime < duration - 10) seek(currentTime + 10);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [togglePlayback, changeSong, currentTime, duration, seek]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-accent">MP3 PLAYER</h2>
        <Button onClick={onBack} variant="outline">
          ← BACK
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Player Display */}
        <Card className="bg-card border-2 border-primary">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-xl font-bold mb-2">
                {playlist.length > 0 && playlist[currentSongIndex]
                  ? playlist[currentSongIndex].name
                  : "No song selected"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </div>

            <div className="space-y-4">
              <div 
                className="bg-background border border-border p-1 rounded cursor-pointer"
                onClick={(e) => {
                  if (duration > 0) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    seek(percent * duration);
                  }
                }}
              >
                <div
                  className="h-2 bg-primary transition-all rounded"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => changeSong(-1)}
                  disabled={playlist.length === 0}
                  variant="outline"
                  size="sm"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  onClick={togglePlayback}
                  disabled={playlist.length === 0}
                  variant="outline"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button
                  onClick={() => changeSong(1)}
                  disabled={playlist.length === 0}
                  variant="outline"
                  size="sm"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Playlist */}
        <div className="space-y-4">
          <Card className="bg-card border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-accent">UPLOAD MUSIC</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
                disabled={uploadMutation.isPending}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploadMutation.isPending ? "UPLOADING..." : "SELECT AUDIO FILES"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-accent">PLAYLIST</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {isLoading ? (
                  <div className="text-muted-foreground text-sm">Loading playlist...</div>
                ) : playlist.length === 0 ? (
                  <div className="text-muted-foreground text-sm">No songs loaded</div>
                ) : (
                  playlist.map((song, index) => (
                    <div
                      key={song.id}
                      className={`flex justify-between items-center p-2 bg-background border border-border cursor-pointer hover:bg-primary hover:text-primary-foreground ${
                        index === currentSongIndex ? "bg-primary text-primary-foreground" : ""
                      }`}
                      onClick={() => playSong(index)}
                    >
                      <span className="text-sm truncate">{song.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">{index + 1}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMutation.mutate(song.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
