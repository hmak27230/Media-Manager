import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Cpu, HardDrive, Zap } from "lucide-react";

export function SystemMonitor() {
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate system metrics
      setCpuUsage(Math.random() * 100);
      setMemoryUsage(Math.random() * 80 + 20);
      setTemperature(Math.random() * 20 + 45);
      setUptime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-card border-2 border-primary">
      <CardHeader>
        <CardTitle className="text-accent flex items-center gap-2">
          <Activity className="w-4 h-4" />
          SYSTEM MONITOR
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3" />
              <span className="text-sm">CPU</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-background border border-border">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${cpuUsage}%` }}
                />
              </div>
              <span className="text-xs w-8">{Math.round(cpuUsage)}%</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <HardDrive className="w-3 h-3" />
              <span className="text-sm">RAM</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-background border border-border">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${memoryUsage}%` }}
                />
              </div>
              <span className="text-xs w-8">{Math.round(memoryUsage)}%</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3" />
              <span className="text-sm">TEMP</span>
            </div>
            <span className="text-xs">{Math.round(temperature)}°C</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">UPTIME</span>
            <span className="text-xs font-mono">{formatUptime(uptime)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}