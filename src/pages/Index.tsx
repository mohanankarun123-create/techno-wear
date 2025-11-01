import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Heart, Leaf } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 gradient-shimmer opacity-10" />
      
      <div className="relative z-10">
        <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            TechnoWear
          </h1>
          <Button
            onClick={() => navigate("/auth")}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Sign In
          </Button>
        </nav>

        <main className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold leading-tight">
                Connect to the{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Future of Fitness
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Smart clothing that cares for you — and the planet. Track your health metrics in real-time
                with TechnoWear's revolutionary smart garments.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/auth")}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground glow-blue text-lg px-8"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground text-lg px-8"
              >
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
              <div className="p-6 bg-card rounded-2xl border border-border glow-blue relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <div className="relative">
                  <Activity className="h-12 w-12 text-primary mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Real-Time Metrics</h3>
                  <p className="text-muted-foreground">
                    Track heart rate, breathing, stress levels, and more with precision sensors.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-card rounded-2xl border border-border glow-green relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent" />
                <div className="relative">
                  <Heart className="h-12 w-12 text-secondary mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-foreground mb-2">AI-Powered Insights</h3>
                  <p className="text-muted-foreground">
                    Get personalized recommendations to optimize your performance and recovery.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-card rounded-2xl border border-border glow-blue relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <div className="relative">
                  <Leaf className="h-12 w-12 text-primary mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Eco-Conscious</h3>
                  <p className="text-muted-foreground">
                    See your environmental impact and contribute to a healthier planet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
