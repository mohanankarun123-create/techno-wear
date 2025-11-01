import { Heart, Bluetooth, Leaf } from "lucide-react";

export const DashboardLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 gradient-shimmer opacity-20" />
      
      <div className="relative z-10 text-center space-y-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Syncing your garments and vitals...
        </h2>
        
        <div className="flex justify-center items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center glow-blue animate-pulse">
              <Heart className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <div className="w-16 h-1 bg-primary/30 rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-[shimmer_2s_ease-in-out_infinite]" style={{ width: '50%' }} />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center glow-blue animate-pulse">
              <Bluetooth className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <div className="w-16 h-1 bg-primary/30 rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-[shimmer_2s_ease-in-out_infinite]" style={{ width: '50%', animationDelay: '0.3s' }} />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2" style={{ animationDelay: '0.4s' }}>
            <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center glow-green animate-pulse">
              <Leaf className="h-8 w-8 text-secondary animate-pulse" />
            </div>
            <div className="w-16 h-1 bg-secondary/30 rounded-full overflow-hidden">
              <div className="h-full bg-secondary animate-[shimmer_2s_ease-in-out_infinite]" style={{ width: '50%', animationDelay: '0.6s' }} />
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mt-8">
          <div className="h-2 w-64 bg-muted rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-primary to-secondary animate-[shimmer_1.5s_ease-in-out_infinite] rounded-full" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
