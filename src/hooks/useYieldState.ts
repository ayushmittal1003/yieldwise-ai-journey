import { useState } from "react";

export interface Token {
  symbol: string;
  amount: string;
  icon: string;
}

export interface YieldTransaction {
  id: string;
  token: "ETH" | "USDC" | "BTC";
  amount: string; // positive number in token units
  kind: "deposit" | "withdraw" | "sweep"; // action type
  direction: "wallet->yield" | "yield->wallet"; // flow direction
  timestamp: number; // epoch ms
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
  transactions: YieldTransaction[];
}

export function useYieldState() {
  const getInitialState = (): YieldState => {
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
      transactions: [],
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
    updateState(prev => {
      const sweptAmount = 1.5; // demo sweep
      return {
        ...prev,
        hasAIRule: true,
        ethBalance: "1.0", // Keep 1.0 ETH in wallet
        yieldTokens: [
          { symbol: "ETH", amount: sweptAmount.toFixed(1), icon: "⟠" },
          { symbol: "BTC", amount: "0.00", icon: "₿" },
          { symbol: "USDC", amount: prev.yieldTokens[2].amount, icon: "$" },
        ],
        transactions: [
          { id: `tx-${Date.now()}` , token: "ETH", amount: sweptAmount.toFixed(1), kind: "sweep", direction: "wallet->yield", timestamp: Date.now() },
          ...prev.transactions,
        ],
      };
    });
  };

  const setUSDCRule = () => {
    updateState(prev => {
      const currentUSDC = parseFloat(prev.usdcBalance.replace(",", ""));
      const sweepAmount = Math.max(0, currentUSDC - 500);
      const next: YieldState = {
        ...prev,
        hasUSDCRule: true,
        usdcBalance: "500.00",
        yieldTokens: [
          prev.yieldTokens[0],
          prev.yieldTokens[1],
          { symbol: "USDC", amount: sweepAmount.toFixed(2), icon: "$" },
        ],
        transactions: sweepAmount > 0
          ? [{ id: `tx-${Date.now()}`, token: "USDC", amount: sweepAmount.toFixed(2), kind: "sweep", direction: "wallet->yield", timestamp: Date.now() }, ...prev.transactions]
          : prev.transactions,
      };
      return next;
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
        transactions: [
          { id: `tx-${Date.now()}`, token: "ETH", amount: withdrawAmount.toFixed(1), kind: "withdraw", direction: "yield->wallet", timestamp: Date.now() },
          ...prev.transactions,
        ],
      };
    });
  };

  const depositToYield = (token: string, amount: string) => {
    updateState(prev => {
      const depositAmount = parseFloat(amount);
      const now = Date.now();
      
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
          transactions: [
            { id: `tx-${now}`, token: "ETH", amount: depositAmount.toFixed(1), kind: "deposit", direction: "wallet->yield", timestamp: now },
            ...prev.transactions,
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
          transactions: [
            { id: `tx-${now}`, token: "USDC", amount: depositAmount.toFixed(2), kind: "deposit", direction: "wallet->yield", timestamp: now },
            ...prev.transactions,
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
          const now = Date.now();
          
          return {
            ...prev,
            usdcBalance: (currentUsdcWallet + withdrawAmount).toFixed(2),
            yieldTokens: [
              prev.yieldTokens[0],
              prev.yieldTokens[1],
              { ...prev.yieldTokens[2], amount: Math.max(0, currentUsdcYield - withdrawAmount).toFixed(2) },
            ],
            transactions: [
              { id: `tx-${now}`, token: "USDC", amount: withdrawAmount.toFixed(2), kind: "withdraw", direction: "yield->wallet", timestamp: now },
              ...prev.transactions,
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