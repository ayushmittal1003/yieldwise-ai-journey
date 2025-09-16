import { useState } from "react";

export interface Token {
  symbol: string;
  amount: string;
  icon: string;
}

export interface YieldState {
  isActivated: boolean;
  showDiscoveryBanner: boolean;
  ethBalance: string;
  yieldTokens: Token[];
  hasAIRule: boolean;
  expandedYield: boolean;
}

export function useYieldState() {
  const [state, setState] = useState<YieldState>({
    isActivated: false,
    showDiscoveryBanner: true,
    ethBalance: "0.00",
    yieldTokens: [
      { symbol: "ETH", amount: "0.00", icon: "⟠" },
      { symbol: "BTC", amount: "0.00", icon: "₿" },
      { symbol: "USDC", amount: "0.00", icon: "$" },
    ],
    hasAIRule: false,
    expandedYield: false,
  });

  const activateYield = () => {
    setState(prev => ({
      ...prev,
      isActivated: true,
      showDiscoveryBanner: false,
      ethBalance: "2.5",
    }));
  };

  const dismissBanner = () => {
    setState(prev => ({ ...prev, showDiscoveryBanner: false }));
  };

  const setAIRule = () => {
    setState(prev => ({
      ...prev,
      hasAIRule: true,
      ethBalance: "1.0",
      yieldTokens: [
        { symbol: "ETH", amount: "1.5", icon: "⟠" },
        { symbol: "BTC", amount: "0.00", icon: "₿" },
        { symbol: "USDC", amount: "0.00", icon: "$" },
      ],
    }));
  };

  const toggleYieldExpansion = () => {
    setState(prev => ({ ...prev, expandedYield: !prev.expandedYield }));
  };

  const withdrawFromYield = (amount: string) => {
    setState(prev => {
      const ethYield = parseFloat(prev.yieldTokens[0].amount);
      const ethWallet = parseFloat(prev.ethBalance);
      const withdrawAmount = parseFloat(amount);
      
      return {
        ...prev,
        ethBalance: (ethWallet + withdrawAmount).toFixed(1),
        yieldTokens: [
          { ...prev.yieldTokens[0], amount: (ethYield - withdrawAmount).toFixed(1) },
          ...prev.yieldTokens.slice(1),
        ],
      };
    });
  };

  return {
    state,
    activateYield,
    dismissBanner,
    setAIRule,
    toggleYieldExpansion,
    withdrawFromYield,
  };
}