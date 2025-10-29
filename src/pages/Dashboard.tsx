import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut, Plus } from "lucide-react";
import HealthMetricsGrid from "@/components/dashboard/HealthMetricsGrid";
import PerformanceCharts from "@/components/dashboard/PerformanceCharts";
import FitnessGoals from "@/components/dashboard/FitnessGoals";
import EcoImpact from "@/components/dashboard/EcoImpact";
import AddGarmentDialog from "@/components/dashboard/AddGarmentDialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAddGarmentOpen, setIsAddGarmentOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            TechnoWear
          </h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsAddGarmentOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground glow-blue"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Garment
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-6">Your Health at a Glance</h2>
          <HealthMetricsGrid userId={user.id} />
        </div>

        <PerformanceCharts userId={user.id} />
        
        <FitnessGoals userId={user.id} />
        
        <EcoImpact userId={user.id} />
      </main>

      <AddGarmentDialog 
        open={isAddGarmentOpen} 
        onOpenChange={setIsAddGarmentOpen}
        userId={user.id}
      />
    </div>
  );
};

export default Dashboard;
