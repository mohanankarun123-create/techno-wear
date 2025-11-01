import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface OTPVerificationProps {
  email: string;
  onVerified: () => void;
  onCancel: () => void;
}

export const OTPVerification = ({ email, onVerified, onCancel }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setIsVerifying(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) throw error;
      
      toast.success("Email verified successfully!");
      onVerified();
    } catch (error: any) {
      toast.error(error.message || "Invalid verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 gradient-shimmer opacity-20" />
      
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Verify Your Email
            </h1>
            <p className="text-muted-foreground">
              We've sent a 6-digit code to
            </p>
            <p className="text-foreground font-semibold">{email}</p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border glow-blue">
            <div className="space-y-6">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  className="gap-2"
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="w-12 h-14 text-2xl bg-muted border-border rounded-xl glow-blue" />
                    <InputOTPSlot index={1} className="w-12 h-14 text-2xl bg-muted border-border rounded-xl glow-blue" />
                    <InputOTPSlot index={2} className="w-12 h-14 text-2xl bg-muted border-border rounded-xl glow-blue" />
                    <InputOTPSlot index={3} className="w-12 h-14 text-2xl bg-muted border-border rounded-xl glow-blue" />
                    <InputOTPSlot index={4} className="w-12 h-14 text-2xl bg-muted border-border rounded-xl glow-blue" />
                    <InputOTPSlot index={5} className="w-12 h-14 text-2xl bg-muted border-border rounded-xl glow-blue" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                onClick={handleVerify}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-blue text-lg h-12"
                disabled={isVerifying || otp.length !== 6}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>

              <Button
                onClick={onCancel}
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
