import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaFile {
  id: number;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: string;
}

interface PhotoGalleryProps {
  onBack: () => void;
}

export function PhotoGallery({ onBack }: PhotoGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: images = [], isLoading } = useQuery<MediaFile[]>({
    queryKey: ["/api/media/image"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiRequest("POST", "/api/media/upload", formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media/image"] });
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media/image"] });
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          uploadMutation.mutate(file);
        }
      });
    }
  };

  const changeImage = (direction: number) => {
    if (images.length === 0) return;
    let newIndex = currentImageIndex + direction;
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;
    setCurrentImageIndex(newIndex);
  };

  // Keyboard controls for photo gallery
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle keys when photo gallery is active (not in games)
      if (e.target && (e.target as HTMLElement).closest('.game-canvas')) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          changeImage(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          changeImage(1);
          break;
        case 'Delete':
          e.preventDefault();
          if (images.length > 0) {
            deleteMutation.mutate(images[currentImageIndex].id);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [changeImage, currentImageIndex, images, deleteMutation]);

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-accent">PHOTO GALLERY</h2>
        <Button onClick={onBack} variant="outline">
          ← BACK
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Display */}
        <Card className="bg-card border-2 border-primary">
          <CardContent className="p-4">
            <div className="aspect-square bg-background border border-border flex items-center justify-center mb-4">
              {images.length > 0 && images[currentImageIndex] ? (
                <img
                  src={images[currentImageIndex].url}
                  alt={images[currentImageIndex].name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-muted-foreground">No image selected</span>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <Button
                onClick={() => changeImage(-1)}
                disabled={images.length === 0}
                variant="outline"
                size="sm"
              >
                ◄ PREV
              </Button>
              <span className="text-sm text-muted-foreground">
                {images.length > 0 ? `${currentImageIndex + 1}/${images.length}` : "0/0"}
              </span>
              <Button
                onClick={() => changeImage(1)}
                disabled={images.length === 0}
                variant="outline"
                size="sm"
              >
                NEXT ►
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Image Controls */}
        <div className="space-y-4">
          <Card className="bg-card border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-accent">UPLOAD IMAGES</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
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
                {uploadMutation.isPending ? "UPLOADING..." : "SELECT FILES"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-accent">IMAGE LIST</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {isLoading ? (
                  <div className="text-muted-foreground text-sm">Loading images...</div>
                ) : images.length === 0 ? (
                  <div className="text-muted-foreground text-sm">No images loaded</div>
                ) : (
                  images.map((image, index) => (
                    <div
                      key={image.id}
                      className={`flex justify-between items-center p-2 bg-background border border-border cursor-pointer hover:bg-primary hover:text-primary-foreground ${
                        index === currentImageIndex ? "bg-primary text-primary-foreground" : ""
                      }`}
                      onClick={() => selectImage(index)}
                    >
                      <span className="text-sm truncate">{image.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">{index + 1}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMutation.mutate(image.id);
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
