import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function YieldAccountLink() {
  return (
    <Link to="/yield-account">
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-muted-foreground hover:text-foreground h-auto p-1"
      >
        <TrendingUp className="h-4 w-4" />
      </Button>
    </Link>
  );
}