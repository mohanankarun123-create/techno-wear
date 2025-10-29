import { Card } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockHeartRateData = [
  { time: "6AM", bpm: 65 },
  { time: "9AM", bpm: 72 },
  { time: "12PM", bpm: 78 },
  { time: "3PM", bpm: 75 },
  { time: "6PM", bpm: 82 },
  { time: "9PM", bpm: 68 },
];

const mockStepsData = [
  { day: "Mon", steps: 8234 },
  { day: "Tue", steps: 9876 },
  { day: "Wed", steps: 7543 },
  { day: "Thu", steps: 10234 },
  { day: "Fri", steps: 8765 },
  { day: "Sat", steps: 12456 },
  { day: "Sun", steps: 6789 },
];

const PerformanceCharts = ({ userId }: { userId: string }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Performance Tracking</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border">
          <h4 className="text-lg font-semibold mb-4 text-foreground">Heart Rate Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockHeartRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line 
                type="monotone" 
                dataKey="bpm" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h4 className="text-lg font-semibold mb-4 text-foreground">Weekly Steps</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockStepsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="steps" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-card border-border glow-blue">
          <div className="text-sm text-muted-foreground mb-2">AI Insight</div>
          <div className="text-lg font-semibold text-foreground">Improve Consistency</div>
          <p className="text-sm text-muted-foreground mt-2">
            Your workout schedule varies. Try to maintain 5 sessions per week.
          </p>
        </Card>

        <Card className="p-6 bg-card border-border glow-green">
          <div className="text-sm text-muted-foreground mb-2">AI Insight</div>
          <div className="text-lg font-semibold text-foreground">Optimal Heart Rate</div>
          <p className="text-sm text-muted-foreground mt-2">
            Stay in zone 2 (60-70% max HR) for fat burning during cardio.
          </p>
        </Card>

        <Card className="p-6 bg-card border-border glow-blue">
          <div className="text-sm text-muted-foreground mb-2">AI Insight</div>
          <div className="text-lg font-semibold text-foreground">Hydration Reminder</div>
          <p className="text-sm text-muted-foreground mt-2">
            Your recovery is affected by hydration. Drink 8 glasses daily.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceCharts;
