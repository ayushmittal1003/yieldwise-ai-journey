import { useState } from "react";
import { Leaf } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { CurrencyCard } from "@/components/dashboard/CurrencyCard";
import { DiscoveryBanner } from "@/components/dashboard/DiscoveryBanner";
import { AIFloatingButton } from "@/components/dashboard/AIFloatingButton";
import { ActivationModal } from "@/components/modals/ActivationModal";
import { AIChatOverlay } from "@/components/chat/AIChatOverlay";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { useYield } from "@/context/YieldContext";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { state, activateYield, dismissBanner, setAIRule, setUSDCRule, toggleYieldExpansion, transferFunds } = useYield();
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const { toast } = useToast();

  const handleActivation = () => {
    activateYield();
    toast({
      title: "✅ Yield Account activated!",
      description: "You can now start earning yield on your crypto assets.",
    });
  };

  const handleAIRuleSet = () => {
    setAIRule();
    setShowAIChat(false);
    toast({
      title: "AI Rule Set Successfully",
      description: "ETH over 1.0 will be swept to your Yield Account daily.",
    });
  };

  const handleUSDCRuleSet = () => {
    setUSDCRule();
    setShowAIChat(false);
    toast({
      title: "USDC Rule Set Successfully", 
      description: "USDC over 500 will be swept to your Yield Account daily.",
    });
  };

  const handleTransfer = (from: string, to: string, token: string, amount: string) => {
    transferFunds(from, to, token, amount);
    
    const direction = from === "wallet" ? "to" : "from";
    const account = from === "wallet" ? "Yield Account" : "wallet";
    
    toast({
      title: "Transfer Successful",
      description: `${amount} ${token} transferred ${direction} ${account}.`,
    });
  };
  return (
    <div className="flex-1 bg-background">
      <Header title="Dashboard" />
      
      <div className="p-8">
        {/* Discovery Banner */}
        {state.showDiscoveryBanner && (
          <DiscoveryBanner 
            onActivate={() => setShowActivationModal(true)}
            onDismiss={dismissBanner}
          />
        )}

        {/* Total Balance */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-3xl font-bold">$23,809.00</p>
            </div>
            <button className="text-sm text-muted-foreground hover:text-foreground">
              View All Balances
            </button>
          </div>
        </div>

        {/* Currency Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <CurrencyCard
            icon={<div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">€</div>}
            currency="EUR"
            amount="1,432.90"
          />
          
          <CurrencyCard
            icon={<div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">$</div>}
            currency="USD"
            amount="1,432.90"
          />
          
          <CurrencyCard
            icon={<div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">$</div>}
            currency="USDC"
            amount={state.usdcBalance}
          />

          <CurrencyCard
            icon={<div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white">⟠</div>}
            currency="ETH"
            amount={`${state.ethBalance} ETH`}
          />

          {/* Yield Account Card - Only show if activated */}
          {state.isActivated && (
            <CurrencyCard
              icon={
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                  <Leaf className="h-4 w-4 text-white" />
                </div>
              }
              currency="Yield Account"
              amount="$0.00"
              isYieldAccount={true}
              tokens={state.yieldTokens}
              expanded={state.expandedYield}
              onExpandToggle={toggleYieldExpansion}
              showAddButton={true}
            />
          )}
        </div>

        {/* Recent Transactions */}
        <TransactionList hasAIRule={state.hasAIRule} hasUSDCRule={state.hasUSDCRule} />

        {/* AI Floating Button */}
        <AIFloatingButton onClick={() => setShowAIChat(true)} />

        {/* Modals */}
        <ActivationModal
          isOpen={showActivationModal}
          onClose={() => setShowActivationModal(false)}
          onActivate={handleActivation}
        />

        <AIChatOverlay
          isOpen={showAIChat}
          onClose={() => setShowAIChat(false)}
          onRuleSet={handleAIRuleSet}
          onUSDCRuleSet={handleUSDCRuleSet}
          onTransfer={handleTransfer}
        />
      </div>
    </div>
  );
}