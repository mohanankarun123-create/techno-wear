import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LearnMoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LearnMoreDialog = ({ open, onOpenChange }: LearnMoreDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card/95 backdrop-blur-xl border-2 border-primary/30 glow-blue">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            About TechnoWear
          </DialogTitle>
          <DialogDescription className="sr-only">
            Learn more about TechnoWear's revolutionary smart clothing technology
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 text-foreground leading-relaxed">
            <p>
              <strong className="text-primary">TechnoWear</strong> is a revolutionary smart clothing brand that fuses technology, sustainability, and comfort. Each shirt is crafted from a soft, breathable cotton-hemp blend enhanced with TiO₂ (titanium dioxide) fibers — giving it self-cleaning, anti-odor, and UV-protection properties.
            </p>
            <p>
              Inside, the shirt features embedded smart sensors that connect to the <strong className="text-secondary">TechnoWear AI App</strong> via Bluetooth. The app tracks your posture, movement, heart rate, stress levels, and sleep quality, giving you real-time insights to improve your health and performance.
            </p>
            <p className="text-lg font-semibold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              With TechnoWear, you're not just wearing a shirt — you're wearing the future of smart, sustainable fashion.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
