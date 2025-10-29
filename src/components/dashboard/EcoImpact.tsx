import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Leaf } from "lucide-react";

const mockMonthlyData = [
  { month: "Jan", co2: 12.3 },
  { month: "Feb", co2: 13.8 },
  { month: "Mar", co2: 14.1 },
  { month: "Apr", co2: 14.53 },
];

const EcoImpact = ({ userId }: { userId: string }) => {
  const [currentImpact, setCurrentImpact] = useState(14.53);

  useEffect(() => {
    fetchEcoImpact();
  }, [userId]);

  const fetchEcoImpact = async () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    const { data } = await supabase
      .from("eco_impact")
      .select("*")
      .eq("user_id", userId)
      .eq("month_year", currentMonth)
      .single();

    if (data) {
      setCurrentImpact(parseFloat(data.co2_absorbed_grams.toString()));
    } else {
      await supabase.from("eco_impact").insert({
        user_id: userId,
        co2_absorbed_grams: 14.53,
        month_year: currentMonth,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Your Eco Impact</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-8 bg-card/80 backdrop-blur-xl border-border glow-green relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent" />
          <div className="relative">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center glow-green">
                <Leaf className="h-10 w-10 text-secondary" />
              </div>
              <div>
                <div className="text-5xl font-bold text-foreground">{currentImpact}g</div>
                <div className="text-sm text-muted-foreground">CO₂ absorbed this month</div>
              </div>
            </div>
            <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/20">
              <p className="text-sm text-foreground">
                That's like planting <span className="font-bold text-secondary">one tree 🌳</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Keep using your TechnoWear garments to reduce your carbon footprint!
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/80 backdrop-blur-xl border-border rounded-2xl">
          <h4 className="text-lg font-semibold mb-4 text-foreground">Monthly CO₂ Absorption Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
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
                dataKey="co2"
                stroke="hsl(var(--secondary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--secondary))", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6 bg-card/80 backdrop-blur-xl border-border glow-blue relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 gradient-shimmer" />
        <div className="relative text-center">
          <h4 className="text-2xl font-bold text-foreground mb-2">Your Smart Choices Make a Difference!</h4>
          <p className="text-muted-foreground">
            Every workout with TechnoWear contributes to a healthier planet. Together, we're making an impact.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default EcoImpact;
