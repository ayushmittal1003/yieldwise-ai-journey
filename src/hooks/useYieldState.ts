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
  usdcBalance: string;
  yieldTokens: Token[];
  hasAIRule: boolean;
  hasUSDCRule: boolean;
  expandedYield: boolean;
}

export function useYieldState() {
  const getInitialState = (): YieldState => {
    // Always start fresh for demo purposes
    return {
      isActivated: false,
      showDiscoveryBanner: true,
      ethBalance: "0.00",
      usdcBalance: "1,432.90",
      yieldTokens: [
        { symbol: "ETH", amount: "0.00", icon: "⟠" },
        { symbol: "BTC", amount: "0.00", icon: "₿" },
        { symbol: "USDC", amount: "0.00", icon: "$" },
      ],
      hasAIRule: false,
      hasUSDCRule: false,
      expandedYield: false,
    };
  };

  const [state, setState] = useState<YieldState>(getInitialState);

  const updateState = (newState: YieldState | ((prev: YieldState) => YieldState)) => {
    setState(prev => {
      const updated = typeof newState === 'function' ? newState(prev) : newState;
      return updated;
    });
  };

  const activateYield = () => {
    updateState(prev => ({
      ...prev,
      isActivated: true,
      showDiscoveryBanner: false,
      ethBalance: "2.5", // ETH wallet gets funded but yield account stays at 0.00
    }));
  };

  const dismissBanner = () => {
    updateState(prev => ({ ...prev, showDiscoveryBanner: false }));
  };

  const setAIRule = () => {
    updateState(prev => ({
      ...prev,
      hasAIRule: true,
      ethBalance: "1.0", // Keep 1.0 ETH in wallet
      yieldTokens: [
        { symbol: "ETH", amount: "1.5", icon: "⟠" }, // Sweep 1.5 ETH to yield
        { symbol: "BTC", amount: "0.00", icon: "₿" },
        { symbol: "USDC", amount: prev.yieldTokens[2].amount, icon: "$" }, // Preserve existing USDC yield
      ],
    }));
  };

  const setUSDCRule = () => {
    updateState(prev => {
      const currentUSDC = parseFloat(prev.usdcBalance.replace(",", ""));
      const sweepAmount = Math.max(0, currentUSDC - 500);
      
      return {
        ...prev,
        hasUSDCRule: true,
        usdcBalance: "500.00", // Keep 500 USDC in wallet
        yieldTokens: [
          prev.yieldTokens[0], // Preserve existing ETH yield
          prev.yieldTokens[1], // BTC unchanged  
          { symbol: "USDC", amount: sweepAmount.toFixed(2), icon: "$" }, // Sweep excess USDC to yield
        ],
      };
    });
  };

  const toggleYieldExpansion = () => {
    updateState(prev => ({ ...prev, expandedYield: !prev.expandedYield }));
  };

  const withdrawFromYield = (amount: string) => {
    updateState(prev => {
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

  const depositToYield = (token: string, amount: string) => {
    updateState(prev => {
      const depositAmount = parseFloat(amount);
      
      if (token === "ETH") {
        const currentEthWallet = parseFloat(prev.ethBalance);
        const currentEthYield = parseFloat(prev.yieldTokens[0].amount);
        
        return {
          ...prev,
          ethBalance: Math.max(0, currentEthWallet - depositAmount).toFixed(1),
          yieldTokens: [
            { ...prev.yieldTokens[0], amount: (currentEthYield + depositAmount).toFixed(1) },
            ...prev.yieldTokens.slice(1),
          ],
        };
      } else if (token === "USDC") {
        const currentUsdcWallet = parseFloat(prev.usdcBalance.replace(",", ""));
        const currentUsdcYield = parseFloat(prev.yieldTokens[2].amount);
        
        return {
          ...prev,
          usdcBalance: Math.max(0, currentUsdcWallet - depositAmount).toFixed(2),
          yieldTokens: [
            prev.yieldTokens[0],
            prev.yieldTokens[1],
            { ...prev.yieldTokens[2], amount: (currentUsdcYield + depositAmount).toFixed(2) },
          ],
        };
      }
      
      return prev;
    });
  };

  const transferFunds = (from: string, to: string, token: string, amount: string) => {
    if (from === "wallet" && to === "yield") {
      depositToYield(token, amount);
    } else if (from === "yield" && to === "wallet") {
      if (token === "ETH") {
        withdrawFromYield(amount);
      } else if (token === "USDC") {
        updateState(prev => {
          const withdrawAmount = parseFloat(amount);
          const currentUsdcWallet = parseFloat(prev.usdcBalance.replace(",", ""));
          const currentUsdcYield = parseFloat(prev.yieldTokens[2].amount);
          
          return {
            ...prev,
            usdcBalance: (currentUsdcWallet + withdrawAmount).toFixed(2),
            yieldTokens: [
              prev.yieldTokens[0],
              prev.yieldTokens[1],
              { ...prev.yieldTokens[2], amount: Math.max(0, currentUsdcYield - withdrawAmount).toFixed(2) },
            ],
          };
        });
      }
    }
  };

  return {
    state,
    activateYield,
    dismissBanner,
    setAIRule,
    setUSDCRule,
    toggleYieldExpansion,
    withdrawFromYield,
    depositToYield,
    transferFunds,
  };
}