import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Target, Check } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

interface Goal {
  id: string;
  title: string;
  target_value: number;
  current_value: number;
  is_completed: boolean;
}

const goalSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  target_value: z.number().int("Must be a whole number").positive("Must be greater than 0").max(1000000, "Value too large")
});

const FitnessGoals = ({ userId }: { userId: string }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");

  useEffect(() => {
    fetchGoals();
  }, [userId]);

  const fetchGoals = async () => {
    const { data } = await supabase
      .from("fitness_goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) {
      setGoals(data);
    } else {
      const defaultGoals = [
        {
          title: "Walk 10,000 Steps Daily",
          target_value: 10000,
          current_value: 4523,
          goal_type: "steps" as const,
        },
        {
          title: "Improve Recovery Score to 85",
          target_value: 85,
          current_value: 78,
          goal_type: "recovery" as const,
        },
        {
          title: "Lower Stress Below 30%",
          target_value: 30,
          current_value: 35,
          goal_type: "stress" as const,
        },
      ];

      for (const goal of defaultGoals) {
        await supabase.from("fitness_goals").insert({
          user_id: userId,
          ...goal,
        });
      }
      fetchGoals();
    }
  };

  const handleAddGoal = async () => {
    try {
      const targetValue = parseInt(newGoalTarget);
      if (isNaN(targetValue)) {
        toast.error("Please enter a valid number");
        return;
      }

      const validatedData = goalSchema.parse({
        title: newGoalTitle,
        target_value: targetValue
      });

      const { error } = await supabase.from("fitness_goals").insert({
        user_id: userId,
        title: validatedData.title,
        target_value: validatedData.target_value,
        current_value: 0,
        goal_type: "custom",
      });

      if (error) {
        toast.error("Failed to add goal");
      } else {
        toast.success("Goal added!");
        setNewGoalTitle("");
        setNewGoalTarget("");
        setIsAdding(false);
        fetchGoals();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Invalid goal data");
      }
    }
  };

  const toggleGoalComplete = async (goalId: string, isCompleted: boolean) => {
    await supabase
      .from("fitness_goals")
      .update({ is_completed: !isCompleted })
      .eq("id", goalId);
    fetchGoals();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Fitness Goals</h3>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {isAdding && (
        <Card className="p-6 bg-card/80 backdrop-blur-xl border-border rounded-2xl">
          <div className="space-y-4">
            <Input
              placeholder="Goal title"
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              className="bg-muted border-border"
            />
            <Input
              placeholder="Target value"
              type="number"
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
              className="bg-muted border-border"
            />
            <Button onClick={handleAddGoal} className="w-full bg-primary hover:bg-primary/90">
              Add Goal
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <Card
            key={goal.id}
            className={`p-6 bg-card/80 backdrop-blur-xl border-border relative overflow-hidden cursor-pointer transition-all rounded-2xl ${
              goal.is_completed ? "opacity-75" : "glow-blue"
            }`}
            onClick={() => toggleGoalComplete(goal.id, goal.is_completed)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <Target className="h-7 w-7 text-primary" />
                {goal.is_completed && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Check className="h-5 w-5 text-secondary-foreground" />
                  </div>
                )}
              </div>
              <div className="text-lg font-semibold text-foreground mb-2">{goal.title}</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progress</span>
                  <span>
                    {goal.current_value} / {goal.target_value}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((goal.current_value / goal.target_value) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FitnessGoals;
