import { ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { YieldAccountLink } from "./YieldAccountLink";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Token {
  symbol: string;
  amount: string;
  icon: string;
}

interface CurrencyCardProps {
  icon: React.ReactNode;
  currency: string;
  amount: string;
  showAddButton?: boolean;
  isYieldAccount?: boolean;
  tokens?: Token[];
  expanded?: boolean;
  onExpandToggle?: () => void;
}

export function CurrencyCard({ 
  icon, 
  currency, 
  amount, 
  showAddButton = true,
  isYieldAccount = false,
  tokens = [],
  expanded = false,
  onExpandToggle
}: CurrencyCardProps) {
  // Calculate total yield account value
  const getTotalYieldValue = () => {
    if (!isYieldAccount || tokens.length === 0) return amount;
    
    let total = 0;
    tokens.forEach(token => {
      const tokenAmount = parseFloat(token.amount);
      if (token.symbol === "ETH") {
        total += tokenAmount * 2500; // Approximate ETH price
      } else if (token.symbol === "BTC") {
        total += tokenAmount * 45000; // Approximate BTC price
      } else if (token.symbol === "USDC") {
        total += tokenAmount;
      }
    });
    
    return `$${total.toFixed(2)}`;
  };

  return (
    <Card className="p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon}
          <div>
            <div className="flex items-center space-x-2">
              <p className="font-medium text-foreground">{currency}</p>
              {isYieldAccount && tokens.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onExpandToggle}
                  className="p-1 h-auto"
                >
                  <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
                </Button>
              )}
            </div>
            <p className="text-2xl font-semibold text-foreground">
              {isYieldAccount ? getTotalYieldValue() : amount}
            </p>
          </div>
        </div>
        {showAddButton && (
          <div className="flex items-center space-x-1">
            {isYieldAccount && <YieldAccountLink />}
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        )}
      </div>

      {/* Expanded view for Yield Account tokens */}
      {isYieldAccount && expanded && tokens.length > 0 && (
        <div className="mt-4 pt-4 border-t space-y-2">
          {tokens.map((token, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-medium">{token.icon}</span>
                </div>
                <span className="text-muted-foreground">{token.symbol}</span>
              </div>
              <span className="font-medium">{token.amount}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}