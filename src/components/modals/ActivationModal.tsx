import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivate: () => void;
}

export function ActivationModal({ isOpen, onClose, onActivate }: ActivationModalProps) {
  const [agreed, setAgreed] = useState(false);

  const handleActivate = () => {
    onActivate();
    onClose();
    setAgreed(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
              <Check className="h-5 w-5 text-success-foreground" />
            </div>
            <span>Activate Yield Account</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <DialogDescription className="text-base">
            <div className="space-y-2">
              <p>• Automatically earn yield on your idle digital assets.</p>
              <p>• Supports ETH, BTC, USDC, and more.</p>
              <p>• Move assets in/out anytime or let AI optimize automatically.</p>
            </div>
          </DialogDescription>

          <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
            <Checkbox 
              id="terms" 
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
              className="mt-0.5"
            />
            <label htmlFor="terms" className="text-sm cursor-pointer">
              I agree to the Yield Account Terms & Conditions.
            </label>
          </div>

          <div className="flex space-x-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleActivate} 
              disabled={!agreed}
              className="flex-1"
            >
              Activate Yield Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}