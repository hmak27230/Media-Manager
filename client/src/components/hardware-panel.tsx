import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface HardwarePanelProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  leds: {
    usb: boolean;
    audio: boolean;
    game: boolean;
  };
  onJoystickInput: (direction: string) => void;
}

export function HardwarePanel({ volume, onVolumeChange, leds, onJoystickInput }: HardwarePanelProps) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const joystickButtons = [
    { direction: "up", symbol: "▲", position: "col-start-2" },
    { direction: "left", symbol: "◄", position: "col-start-1 row-start-2" },
    { direction: "select", symbol: "●", position: "col-start-2 row-start-2 bg-primary text-primary-foreground" },
    { direction: "right", symbol: "►", position: "col-start-3 row-start-2" },
    { direction: "down", symbol: "▼", position: "col-start-2 row-start-3" },
  ];

  return (
    <div className="lg:w-1/4 bg-card border-r-2 border-border p-6 hardware-panel">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-accent">MCB1700 STATUS</h2>
        
        {/* LED Indicators */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm">POWER</span>
            <div className="led-indicator bg-green-500 active animate-pulse-led"></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">USB</span>
            <div className={`led-indicator ${leds.usb ? "bg-green-500 active" : "bg-gray-600"}`}></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">AUDIO</span>
            <div className={`led-indicator ${leds.audio ? "bg-green-500 active" : "bg-gray-600"}`}></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">GAME</span>
            <div className={`led-indicator ${leds.game ? "bg-green-500 active" : "bg-gray-600"}`}></div>
          </div>
        </div>

        {/* Volume Control */}
        <div className="mb-6">
          <label className="block text-sm mb-2 text-accent">VOLUME</label>
          <input
            type="range"
            className="volume-slider w-full"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(parseInt(e.target.value))}
          />
          <div className="flex justify-between text-xs mt-1">
            <span>0</span>
            <span>{volume}</span>
            <span>100</span>
          </div>
        </div>

        {/* Joystick Simulation */}
        <div className="mb-6">
          <h3 className="text-sm mb-3 text-accent">JOYSTICK</h3>
          <div className="grid grid-cols-3 grid-rows-3 gap-2 w-32 mx-auto">
            {joystickButtons.map((btn) => (
              <Button
                key={btn.direction}
                className={`joystick-btn p-2 text-center ${btn.position}`}
                onClick={() => {
                  onJoystickInput(btn.direction);
                  // Simulate keyboard events for game controls
                  const keyMap: { [key: string]: string } = {
                    up: "ArrowUp",
                    down: "ArrowDown",
                    left: "ArrowLeft",
                    right: "ArrowRight",
                    select: "Enter"
                  };
                  
                  if (keyMap[btn.direction]) {
                    const event = new KeyboardEvent('keydown', {
                      key: keyMap[btn.direction],
                      bubbles: true
                    });
                    window.dispatchEvent(event);
                  }
                }}
                variant="outline"
              >
                {btn.symbol}
              </Button>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="text-xs space-y-1 text-muted-foreground">
          <div>MCB1700 v2.1</div>
          <div>ARM Cortex-M3</div>
          <div>72MHz Clock</div>
          <div>512KB Flash</div>
          <div>32KB RAM</div>
          <div>{currentTime}</div>
        </div>
      </div>
    </div>
  );
}
