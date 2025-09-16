import { MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AIFloatingButtonProps {
  onClick: () => void;
  className?: string;
}

export function AIFloatingButton({ onClick, className }: AIFloatingButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={cn(
        "fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg animate-float",
        "bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700",
        "transform transition-all duration-300 hover:scale-105",
        className
      )}
    >
      <div className="relative">
        <MessageCircle className="h-6 w-6" />
        <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
      </div>
    </Button>
  );
}