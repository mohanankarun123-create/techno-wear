import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { OTPVerification } from "@/components/auth/OTPVerification";

const authSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  password: z.string().min(6, "Password must be at least 6 characters").max(72, "Password too long"),
  fullName: z.string().trim().min(1, "Name is required").max(100, "Name too long").optional()
});

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = authSchema.parse({
        email,
        password,
        fullName: isSignUp ? fullName : undefined
      });

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: validatedData.email,
          password: validatedData.password,
          options: {
            data: {
              full_name: validatedData.fullName,
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        
        if (error) throw error;
        setPendingEmail(validatedData.email);
        setShowOTP(true);
        toast.success("Check your email for the verification code!");
      } else {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
          email: validatedData.email,
          password: validatedData.password,
        });
        
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      toast.info("Connecting securely...");
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      toast.info("Connecting securely...");
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  if (showOTP) {
    return (
      <OTPVerification
        email={pendingEmail}
        onVerified={() => {
          setShowOTP(false);
          navigate("/dashboard");
        }}
        onCancel={() => {
          setShowOTP(false);
          setPendingEmail("");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 gradient-shimmer opacity-20" />
      
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome to TechnoWear
            </h1>
            <p className="text-muted-foreground">
              Connect to the Future of Fitness
            </p>
            <p className="text-sm text-muted-foreground">
              Smart clothing that cares for you — and the planet.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border glow-blue">
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={isSignUp}
                    className="bg-muted border-border"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-muted border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-muted border-border"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-blue"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isSignUp ? (
                  "Sign Up"
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-4">
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1 border-border hover:bg-muted rounded-2xl"
              onClick={handleAppleSignIn}
              disabled={isLoading}
            >
              {isLoading ? "Connecting securely..." : "Continue with Apple"}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-border hover:bg-muted rounded-2xl"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? "Connecting securely..." : "Continue with Google"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
