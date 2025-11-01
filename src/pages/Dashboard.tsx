import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut, Plus, Heart, TrendingUp, Leaf, Shirt } from "lucide-react";
import HealthMetricsGrid from "@/components/dashboard/HealthMetricsGrid";
import PerformanceCharts from "@/components/dashboard/PerformanceCharts";
import FitnessGoals from "@/components/dashboard/FitnessGoals";
import EcoImpact from "@/components/dashboard/EcoImpact";
import AddGarmentDialog from "@/components/dashboard/AddGarmentDialog";
import { DashboardLoading } from "@/components/dashboard/DashboardLoading";

type TabType = "health" | "trends" | "eco";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAddGarmentOpen, setIsAddGarmentOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("health");
  const [garmentCount, setGarmentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchGarmentCount(session.user.id);
        setTimeout(() => setIsLoading(false), 2000);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchGarmentCount = async (userId: string) => {
    const { count } = await supabase
      .from("garments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    
    setGarmentCount(count || 0);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  if (!user) return null;

  if (isLoading) {
    return <DashboardLoading />;
  }

  const tabs = [
    { id: "health" as TabType, icon: Heart, label: "Health", color: "primary" },
    { id: "trends" as TabType, icon: TrendingUp, label: "Trends", color: "secondary" },
    { id: "eco" as TabType, icon: Leaf, label: "Eco Impact", color: "secondary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            TechnoWear
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-2xl glow-blue">
              <Shirt className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">{garmentCount}</span>
              <span className="text-sm text-muted-foreground">Connected</span>
            </div>
            <Button
              onClick={() => setIsAddGarmentOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground glow-blue rounded-2xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Garment
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-2xl"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="container mx-auto px-4 pb-4">
          <div className="flex items-center justify-center gap-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                    isActive ? "scale-110" : "scale-100 opacity-60 hover:opacity-80"
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? tab.color === "primary"
                          ? "bg-primary/20 border-2 border-primary glow-blue"
                          : "bg-secondary/20 border-2 border-secondary glow-green"
                        : "bg-muted border border-border"
                    } ${isActive ? "pulse-ring" : ""}`}
                  >
                    <Icon
                      className={`h-7 w-7 ${
                        isActive
                          ? tab.color === "primary"
                            ? "text-primary"
                            : "text-secondary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          {activeTab === "health" && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold">Your Health at a Glance</h2>
              <HealthMetricsGrid userId={user.id} />
              <FitnessGoals userId={user.id} />
            </div>
          )}

          {activeTab === "trends" && (
            <div className="space-y-8">
              <PerformanceCharts userId={user.id} />
            </div>
          )}

          {activeTab === "eco" && (
            <div className="space-y-8">
              <EcoImpact userId={user.id} />
            </div>
          )}
        </div>
      </main>

      <AddGarmentDialog 
        open={isAddGarmentOpen} 
        onOpenChange={(open) => {
          setIsAddGarmentOpen(open);
          if (!open) fetchGarmentCount(user.id);
        }}
        userId={user.id}
      />
    </div>
  );
};

export default Dashboard;
