import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Bluetooth, QrCode, Loader2, Check } from "lucide-react";

interface AddGarmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

const AddGarmentDialog = ({ open, onOpenChange, userId }: AddGarmentDialogProps) => {
  const [step, setStep] = useState<"method" | "pairing" | "success">("method");
  const [pairingMethod, setPairingMethod] = useState<"bluetooth" | "qr" | null>(null);
  const [garmentName, setGarmentName] = useState("");
  const [garmentType, setGarmentType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleMethodSelect = (method: "bluetooth" | "qr") => {
    setPairingMethod(method);
    setStep("pairing");
    simulatePairing();
  };

  const simulatePairing = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("success");
    }, 2000);
  };

  const handleComplete = async () => {
    if (!garmentName || !garmentType) {
      toast.error("Please fill in garment details");
      return;
    }

    const { error } = await supabase.from("garments").insert({
      user_id: userId,
      name: garmentName,
      type: garmentType,
      is_paired: true,
      bluetooth_id: pairingMethod === "bluetooth" ? `BT-${Date.now()}` : undefined,
      qr_code: pairingMethod === "qr" ? `QR-${Date.now()}` : undefined,
    });

    if (error) {
      toast.error("Failed to add garment");
    } else {
      toast.success("Garment added successfully!");
      onOpenChange(false);
      resetDialog();
    }
  };

  const resetDialog = () => {
    setStep("method");
    setPairingMethod(null);
    setGarmentName("");
    setGarmentType("");
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) resetDialog();
    }}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Add Garment
          </DialogTitle>
        </DialogHeader>

        {step === "method" && (
          <div className="space-y-4">
            <p className="text-muted-foreground">Choose how to connect your TechnoWear garment:</p>
            
            <Button
              onClick={() => handleMethodSelect("bluetooth")}
              className="w-full h-24 bg-card hover:bg-muted border-2 border-primary glow-blue flex flex-col gap-2"
              variant="outline"
            >
              <Bluetooth className="h-8 w-8 text-primary" />
              <span className="text-foreground font-semibold">Pair via Bluetooth</span>
            </Button>

            <Button
              onClick={() => handleMethodSelect("qr")}
              className="w-full h-24 bg-card hover:bg-muted border-2 border-secondary glow-green flex flex-col gap-2"
              variant="outline"
            >
              <QrCode className="h-8 w-8 text-secondary" />
              <span className="text-foreground font-semibold">Scan QR Code</span>
            </Button>
          </div>
        )}

        {step === "pairing" && (
          <div className="text-center py-8 space-y-4">
            {isLoading ? (
              <>
                <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
                <p className="text-foreground">Connecting to your TechnoWear garment...</p>
                <p className="text-sm text-muted-foreground">
                  {pairingMethod === "bluetooth" ? "Scanning for Bluetooth devices" : "Scanning QR code"}
                </p>
              </>
            ) : null}
          </div>
        )}

        {step === "success" && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Garment Paired Successfully!</h3>
              <p className="text-sm text-muted-foreground">Now let's add some details</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="garmentName">Garment Name</Label>
                <Input
                  id="garmentName"
                  placeholder="e.g., Running Shirt"
                  value={garmentName}
                  onChange={(e) => setGarmentName(e.target.value)}
                  className="bg-muted border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="garmentType">Garment Type</Label>
                <Select value={garmentType} onValueChange={setGarmentType}>
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shirt">Shirt</SelectItem>
                    <SelectItem value="shorts">Shorts</SelectItem>
                    <SelectItem value="jacket">Jacket</SelectItem>
                    <SelectItem value="pants">Pants</SelectItem>
                    <SelectItem value="shoes">Shoes</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleComplete}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-blue"
              >
                Complete Setup
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddGarmentDialog;
