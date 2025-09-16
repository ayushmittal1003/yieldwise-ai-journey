import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DiscoveryBannerProps {
  onActivate: () => void;
  onDismiss: () => void;
}

export function DiscoveryBanner({ onActivate, onDismiss }: DiscoveryBannerProps) {
  return (
    <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">
              ✨ Introducing Yield Account: Earn yield on your idle crypto assets. Activate now!
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={onActivate} size="sm" className="rounded-full">
            Activate
          </Button>
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}