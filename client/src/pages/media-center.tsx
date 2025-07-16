import { useState, useEffect } from "react";
import { HardwarePanel } from "@/components/hardware-panel";
import { PhotoGallery } from "@/components/photo-gallery";
import { Mp3Player } from "@/components/mp3-player";
import { GameCenter } from "@/components/game-center";
import { SystemMonitor } from "@/components/system-monitor";
import { useJoystick } from "@/hooks/use-joystick";

type Section = "main" | "gallery" | "player" | "games" | "monitor";

export default function MediaCenter() {
  const [currentSection, setCurrentSection] = useState<Section>("main");
  const [selectedMenuItem, setSelectedMenuItem] = useState(0);
  const [volume, setVolume] = useState(50);
  const [leds, setLeds] = useState({
    usb: false,
    audio: false,
    game: false,
  });

  const menuItems = [
    { id: "gallery", title: "PHOTO GALLERY", icon: "📷", description: "View images (BMP/JPG/PNG)" },
    { id: "player", title: "MP3 PLAYER", icon: "🎵", description: "Stream audio via USB" },
    { id: "games", title: "GAME CENTER", icon: "🎮", description: "Snake, Pong, Tetris & more" },
    { id: "monitor", title: "SYSTEM MONITOR", icon: "📊", description: "View system status" },
  ];

  const handleMenuSelect = (section: Section) => {
    setCurrentSection(section);
    setLeds({
      usb: section === "gallery" || section === "monitor",
      audio: section === "player",
      game: section === "games",
    });
  };

  const handleBack = () => {
    setCurrentSection("main");
    setLeds({ usb: false, audio: false, game: false });
  };

  useJoystick({
    onUp: () => {
      if (currentSection === "main") {
        setSelectedMenuItem(Math.max(0, selectedMenuItem - 1));
      }
    },
    onDown: () => {
      if (currentSection === "main") {
        setSelectedMenuItem(Math.min(menuItems.length - 1, selectedMenuItem + 1));
      }
    },
    onSelect: () => {
      if (currentSection === "main") {
        handleMenuSelect(menuItems[selectedMenuItem].id as Section);
      }
    },
  });

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", { hour12: false });
  };

  // Mouse wheel support for volume control
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.target && (e.target as HTMLElement).closest('.hardware-panel')) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -5 : 5;
        setVolume(prevVolume => Math.max(0, Math.min(100, prevVolume + delta)));
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground">
      <HardwarePanel
        volume={volume}
        onVolumeChange={setVolume}
        leds={leds}
        onJoystickInput={(direction) => {
          // Handle joystick input
          console.log("Joystick:", direction);
        }}
      />

      <div className="flex-1 lcd-screen relative">
        <div className="scan-line"></div>
        
        {/* Header */}
        <div className="bg-card border-b-2 border-border p-4 relative z-10">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-accent animate-flicker">MEDIA CENTER</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm animate-blink">●REC</span>
              <span className="text-sm">{formatTime()}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 relative z-10">
          {currentSection === "main" && (
            <div className="space-y-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 text-accent">SELECT MODE</h2>
                <p className="text-sm text-muted-foreground">Use joystick or arrow keys to navigate</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {menuItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`menu-item p-6 ${index === selectedMenuItem ? "selected animate-glow" : ""}`}
                    onClick={() => handleMenuSelect(item.id as Section)}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">{item.icon}</div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentSection === "gallery" && (
            <PhotoGallery onBack={handleBack} />
          )}

          {currentSection === "player" && (
            <Mp3Player onBack={handleBack} volume={volume} />
          )}

          {currentSection === "games" && (
            <GameCenter onBack={handleBack} />
          )}

          {currentSection === "monitor" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-accent">SYSTEM MONITOR</h2>
                <button onClick={handleBack} className="text-sm text-primary hover:text-accent">
                  ← BACK
                </button>
              </div>
              <SystemMonitor />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
