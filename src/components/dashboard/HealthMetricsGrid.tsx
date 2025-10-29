import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Heart, Wind, Brain, Moon, Activity, Thermometer, Footprints } from "lucide-react";

interface HealthMetric {
  heart_rate: number;
  breathing_rate: number;
  stress_level: number;
  sleep_quality: number;
  recovery_score: number;
  posture_status: string;
  body_temperature: number;
  steps: number;
}

const HealthMetricsGrid = ({ userId }: { userId: string }) => {
  const [metrics, setMetrics] = useState<HealthMetric | null>(null);

  useEffect(() => {
    fetchLatestMetrics();
    
    const interval = setInterval(() => {
      simulateMetricUpdate();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [userId]);

  const fetchLatestMetrics = async () => {
    const { data } = await supabase
      .from("health_metrics")
      .select("*")
      .eq("user_id", userId)
      .order("recorded_at", { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setMetrics(data);
    } else {
      const mockMetrics = {
        heart_rate: 72,
        breathing_rate: 16,
        stress_level: 35,
        sleep_quality: 85,
        recovery_score: 78,
        posture_status: "good",
        body_temperature: 36.8,
        steps: 4523,
      };
      setMetrics(mockMetrics);
      
      await supabase.from("health_metrics").insert({
        user_id: userId,
        ...mockMetrics,
      });
    }
  };

  const simulateMetricUpdate = () => {
    setMetrics((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        heart_rate: prev.heart_rate + (Math.random() - 0.5) * 3,
        breathing_rate: Math.max(12, Math.min(20, prev.breathing_rate + (Math.random() - 0.5) * 2)),
        steps: prev.steps + Math.floor(Math.random() * 10),
      };
    });
  };

  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6 bg-card/80 backdrop-blur-xl border-border glow-blue relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <Heart className="h-8 w-8 text-primary pulse-ring" />
          </div>
          <div className="text-4xl font-bold text-foreground">
            {Math.round(metrics.heart_rate)}
          </div>
          <div className="text-sm text-muted-foreground">BPM</div>
        </div>
      </Card>

      <Card className="p-6 bg-card/80 backdrop-blur-xl border-border glow-green relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <Wind className="h-8 w-8 text-secondary breathing-wave" />
          </div>
          <div className="text-4xl font-bold text-foreground">
            {Math.round(metrics.breathing_rate)}
          </div>
          <div className="text-sm text-muted-foreground">Breaths/min</div>
        </div>
      </Card>

      <Card className="p-6 bg-card/80 backdrop-blur-xl border-border relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <div className="w-full bg-muted rounded-full h-2 ml-4">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.stress_level}%` }}
              />
            </div>
          </div>
          <div className="text-4xl font-bold text-foreground">{metrics.stress_level}%</div>
          <div className="text-sm text-muted-foreground">Stress Level</div>
        </div>
      </Card>

      <Card className="p-6 bg-card/80 backdrop-blur-xl border-border glow-blue relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <Moon className="h-8 w-8 text-secondary" />
            <svg className="w-12 h-12" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="hsl(var(--secondary))"
                strokeWidth="3"
                strokeDasharray={`${metrics.sleep_quality}, 100`}
              />
            </svg>
          </div>
          <div className="text-4xl font-bold text-foreground">{metrics.sleep_quality}</div>
          <div className="text-sm text-muted-foreground">Sleep Quality</div>
        </div>
      </Card>

      <Card className="p-6 bg-card/80 backdrop-blur-xl border-border relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <Activity className="h-8 w-8 text-primary" />
            <svg className="w-12 h-12" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeDasharray={`${metrics.recovery_score}, 100`}
              />
            </svg>
          </div>
          <div className="text-4xl font-bold text-foreground">{metrics.recovery_score}</div>
          <div className="text-sm text-muted-foreground">Recovery Score</div>
        </div>
      </Card>

      <Card className="p-6 bg-card/80 backdrop-blur-xl border-border glow-green relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <Activity className="h-8 w-8 text-secondary" />
          </div>
          <div className="text-4xl font-bold text-foreground capitalize">
            {metrics.posture_status.replace("_", " ")}
          </div>
          <div className="text-sm text-muted-foreground">Posture Status</div>
        </div>
      </Card>

      <Card className="p-6 bg-card/80 backdrop-blur-xl border-border relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <Thermometer className="h-8 w-8 text-primary" />
          </div>
          <div className="text-4xl font-bold text-foreground">{metrics.body_temperature}°C</div>
          <div className="text-sm text-muted-foreground">Body Temperature</div>
        </div>
      </Card>

      <Card className="p-6 bg-card/80 backdrop-blur-xl border-border glow-blue relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <Footprints className="h-8 w-8 text-secondary" />
          </div>
          <div className="text-4xl font-bold text-foreground">
            {Math.round(metrics.steps).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Steps Today</div>
        </div>
      </Card>
    </div>
  );
};

export default HealthMetricsGrid;
