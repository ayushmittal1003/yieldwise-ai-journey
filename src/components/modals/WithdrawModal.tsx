import { useState } from "react";
import { Download } from "lucide-react";
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

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (amount: string) => void;
  availableBalance: number;
}

export function WithdrawModal({ isOpen, onClose, onWithdraw, availableBalance }: WithdrawModalProps) {
  const [amount, setAmount] = useState("0.5");
  const [destination, setDestination] = useState("eth-wallet");

  const handleWithdraw = () => {
    onWithdraw(amount);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Download className="h-5 w-5 text-primary-foreground" />
            </div>
            <span>Withdraw Funds</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* From Section */}
          <div>
            <Label htmlFor="from">From</Label>
            <div className="p-3 rounded-lg bg-muted/50 text-sm">
              Yield Account - {availableBalance} ETH available
            </div>
          </div>

          {/* To Section */}
          <div>
            <Label htmlFor="destination">To</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eth-wallet">ETH Wallet</SelectItem>
                <SelectItem value="btc-wallet">BTC Wallet</SelectItem>
                <SelectItem value="usdc-wallet">USDC Wallet</SelectItem>
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
                max={availableBalance}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                ETH
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Max: {availableBalance} ETH
            </p>
          </div>

          <div className="flex space-x-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleWithdraw} 
              className="flex-1"
              disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance}
            >
              Confirm Withdrawal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}