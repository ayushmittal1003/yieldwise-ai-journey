import { Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  showActions?: boolean;
}

export function Header({ title, showActions = true }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-8 py-6 bg-background border-b">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      </div>
      
      {showActions && (
        <div className="flex items-center space-x-4">
          <Button variant="default" size="sm" className="rounded-full">
            Send Money
          </Button>
          <Button variant="default" size="sm" className="rounded-full">
            Collect Money
          </Button>
          <div className="flex items-center space-x-3 ml-6">
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}