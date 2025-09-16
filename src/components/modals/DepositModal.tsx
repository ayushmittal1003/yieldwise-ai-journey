import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (token: string, amount: string) => void;
  ethBalance: string;
  usdcBalance: string;
}

export function DepositModal({ isOpen, onClose, onDeposit, ethBalance, usdcBalance }: DepositModalProps) {
  const [amount, setAmount] = useState("0.5");
  const [selectedToken, setSelectedToken] = useState("ETH");

  const getMaxBalance = () => {
    if (selectedToken === "ETH") {
      return parseFloat(ethBalance);
    } else if (selectedToken === "USDC") {
      return parseFloat(usdcBalance.replace(",", ""));
    }
    return 0;
  };

  const handleDeposit = () => {
    onDeposit(selectedToken, amount);
    onClose();
    setAmount("0.5");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
              <Plus className="h-5 w-5 text-success-foreground" />
            </div>
            <span>Deposit to Yield Account</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Token Selection */}
          <div>
            <Label htmlFor="token">Select Token</Label>
            <Select value={selectedToken} onValueChange={setSelectedToken}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ETH">ETH - {ethBalance} available</SelectItem>
                <SelectItem value="USDC">USDC - {usdcBalance} available</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount Section */}
          <div>
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.1"
                min="0"
                max={getMaxBalance()}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {selectedToken}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Max: {getMaxBalance()} {selectedToken}
            </p>
          </div>

          {/* To Section */}
          <div>
            <Label htmlFor="destination">To</Label>
            <div className="p-3 rounded-lg bg-muted/50 text-sm">
              Yield Account - Start earning {selectedToken === "ETH" ? "3.0%" : "4.0%"} APY
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleDeposit} 
              className="flex-1"
              disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > getMaxBalance()}
            >
              Confirm Deposit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}