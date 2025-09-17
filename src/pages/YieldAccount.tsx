import { useState } from "react";
import { ArrowLeft, TrendingUp, Download, Plus, Settings } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { WithdrawModal } from "@/components/modals/WithdrawModal";
import { DepositModal } from "@/components/modals/DepositModal";
import { useYield } from "@/context/YieldContext";
import { useToast } from "@/hooks/use-toast";

export default function YieldAccount() {
  const { state, withdrawFromYield, depositToYield } = useYield();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const { toast } = useToast();

  const yieldMetrics = [
    { token: "ETH", balance: state.yieldTokens[0].amount, apy: "3.0%" },
    { token: "BTC", balance: state.yieldTokens[1].amount, apy: "2.5%" },
    { token: "USDC", balance: state.yieldTokens[2].amount, apy: "4.0%" },
  ];

  const handleDeposit = (token: string, amount: string) => {
    depositToYield(token, amount);
    toast({
      title: "Deposit Successful",
      description: `${amount} ${token} has been deposited to your Yield Account.`,
    });
  };
  return (
    <div className="flex-1 bg-background">
      <Header title="Yield Account Overview" showActions={false} />
      
      <div className="p-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Yield Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {yieldMetrics.map((metric) => (
            <Card key={metric.token} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="font-medium text-sm">
                      {metric.token === "ETH" ? "⟠" : metric.token === "BTC" ? "₿" : "$"}
                    </span>
                  </div>
                  <span className="font-medium">{metric.token}</span>
                </div>
                <span className="text-sm font-medium text-success bg-success/10 px-2 py-1 rounded">
                  APY {metric.apy}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {metric.balance} {metric.token}
                </p>
                <p className="text-sm text-muted-foreground">Available balance</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Total Interest Earned */}
        <Card className="p-6 mb-8">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Total Interest Earned</p>
              <p className="text-2xl font-bold text-success">$0.00</p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex space-x-4 mb-8">
          <Button 
            className="flex items-center space-x-2"
            onClick={() => setShowDepositModal(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Deposit</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center space-x-2"
            onClick={() => setShowWithdrawModal(true)}
          >
            <Download className="h-4 w-4" />
            <span>Withdraw</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Manage AI Rules</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-4">
              {state.hasAIRule && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">AI Sweep from ETH Wallet</p>
                      <p className="text-sm text-muted-foreground">Sep 18, 2025</p>
                    </div>
                  </div>
                  <span className="font-medium text-success">+1.5 ETH</span>
                </div>
              )}

              {state.hasUSDCRule && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">AI Sweep from USDC Wallet</p>
                      <p className="text-sm text-muted-foreground">Sep 18, 2025</p>
                    </div>
                  </div>
                  <span className="font-medium text-success">+932.90 USDC</span>
                </div>
              )}
              
              {!state.hasAIRule && !state.hasUSDCRule && (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No transactions yet</p>
                  <p className="text-sm">Start depositing to see your yield history</p>
                </div>
              )}
            </div>
          </Card>

          {/* Active AI Rules */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Active AI Rules</h3>
            <div className="space-y-4">
              {state.hasAIRule && (
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs">⟠</div>
                    <span className="font-medium">ETH Auto-Sweep Rule</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Maintain 1.0 ETH in wallet, sweep excess to Yield Account daily
                  </p>
                </div>
              )}

              {state.hasUSDCRule && (
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">$</div>
                    <span className="font-medium">USDC Auto-Sweep Rule</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Maintain 500 USDC in wallet, sweep excess to Yield Account daily
                  </p>
                </div>
              )}
              
              {!state.hasAIRule && !state.hasUSDCRule && (
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No active rules</p>
                  <p className="text-sm">Set up AI rules to automate your yield strategy</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <WithdrawModal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          onWithdraw={withdrawFromYield}
          availableBalance={parseFloat(state.yieldTokens[0].amount)}
        />
      </div>
        <DepositModal
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          onDeposit={handleDeposit}
          ethBalance={state.ethBalance}
          usdcBalance={state.usdcBalance}
        />
    </div>
  );
}