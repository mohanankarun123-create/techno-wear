import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Bluetooth, QrCode } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Garment {
  id: string;
  name: string;
  type: string;
  is_paired: boolean;
  bluetooth_id?: string;
  qr_code?: string;
}

interface GarmentListProps {
  userId: string;
  onGarmentChange?: () => void;
}

const GarmentList = ({ userId, onGarmentChange }: GarmentListProps) => {
  const [garments, setGarments] = useState<Garment[]>([]);
  const [deleteGarmentId, setDeleteGarmentId] = useState<string | null>(null);

  useEffect(() => {
    fetchGarments();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('garments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'garments',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchGarments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchGarments = async () => {
    const { data, error } = await supabase
      .from("garments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load garments");
    } else {
      setGarments(data || []);
    }
  };

  const handleDeleteGarment = async () => {
    if (!deleteGarmentId) return;

    const { error } = await supabase
      .from("garments")
      .delete()
      .eq("id", deleteGarmentId);

    if (error) {
      toast.error("Failed to remove garment");
    } else {
      toast.success("Garment removed successfully");
      setDeleteGarmentId(null);
      onGarmentChange?.();
    }
  };

  if (garments.length === 0) {
    return (
      <Card className="bg-card/50 border-border">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No garments connected yet. Click "Add Garment" to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {garments.map((garment) => (
          <Card key={garment.id} className="bg-card/50 border-border hover:border-primary/50 transition-all glow-blue">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{garment.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{garment.type}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteGarmentId(garment.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm">
                {garment.bluetooth_id && (
                  <div className="flex items-center gap-1 text-primary">
                    <Bluetooth className="h-4 w-4" />
                    <span className="text-muted-foreground">Bluetooth</span>
                  </div>
                )}
                {garment.qr_code && (
                  <div className="flex items-center gap-1 text-secondary">
                    <QrCode className="h-4 w-4" />
                    <span className="text-muted-foreground">QR Code</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${garment.is_paired ? 'bg-secondary' : 'bg-muted'}`} />
                  <span className="text-xs text-muted-foreground">
                    {garment.is_paired ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteGarmentId} onOpenChange={(open) => !open && setDeleteGarmentId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Garment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this garment from your connected devices. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteGarment}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GarmentList;
