import React, { createContext, useContext } from "react";
import { useYieldState } from "@/hooks/useYieldState";

// Context value is the full API returned by useYieldState
export type YieldContextValue = ReturnType<typeof useYieldState>;

const YieldContext = createContext<YieldContextValue | undefined>(undefined);

export const YieldProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useYieldState();
  return <YieldContext.Provider value={value}>{children}</YieldContext.Provider>;
};

export const useYield = () => {
  const ctx = useContext(YieldContext);
  if (!ctx) {
    throw new Error("useYield must be used within a YieldProvider");
  }
  return ctx;
};
