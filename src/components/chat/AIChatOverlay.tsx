import { useState } from "react";
import { Send, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
}

interface AIChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onRuleSet: () => void;
  onUSDCRuleSet: () => void;
  onTransfer: (from: string, to: string, token: string, amount: string) => void;
}

export function AIChatOverlay({ isOpen, onClose, onRuleSet, onUSDCRuleSet, onTransfer }: AIChatOverlayProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your YieldWise Assistant. I can help you:\n\n• Set up auto-sweep rules (e.g., 'Keep 1 ETH, sweep excess to yield')\n• Transfer funds between accounts (e.g., 'Move 0.5 ETH to yield account')\n• Withdraw from yield account (e.g., 'Withdraw 100 USDC to wallet')\n\nWhat would you like to do?",
      isAI: true,
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const parseTransferCommand = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    // Extract amount and token
    const ethMatch = lowerInput.match(/(\d+(?:\.\d+)?)\s*eth/);
    const usdcMatch = lowerInput.match(/(\d+(?:\.\d+)?)\s*usdc/);
    const btcMatch = lowerInput.match(/(\d+(?:\.\d+)?)\s*btc/);
    
    let amount = "";
    let token = "";
    
    if (ethMatch) {
      amount = ethMatch[1];
      token = "ETH";
    } else if (usdcMatch) {
      amount = usdcMatch[1];
      token = "USDC";
    } else if (btcMatch) {
      amount = btcMatch[1];
      token = "BTC";
    }
    
    // Determine direction
    const toYield = lowerInput.includes("yield") && (lowerInput.includes("to") || lowerInput.includes("move") || lowerInput.includes("transfer") || lowerInput.includes("deposit"));
    const fromYield = lowerInput.includes("withdraw") || lowerInput.includes("from yield") || (lowerInput.includes("yield") && lowerInput.includes("wallet"));
    
    if (toYield && amount && token) {
      return { from: "wallet", to: "yield", token, amount };
    } else if (fromYield && amount && token) {
      return { from: "yield", to: "wallet", token, amount };
    }
    
    return null;
  };

  const parseRuleCommand = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    // ETH rule patterns
    if ((lowerInput.includes("eth") && lowerInput.includes("1")) || 
        (lowerInput.includes("keep") && lowerInput.includes("eth")) ||
        (lowerInput.includes("maintain") && lowerInput.includes("eth"))) {
      return "eth-rule";
    }
    
    // USDC rule patterns
    if ((lowerInput.includes("usdc") && lowerInput.includes("500")) ||
        (lowerInput.includes("keep") && lowerInput.includes("usdc")) ||
        (lowerInput.includes("maintain") && lowerInput.includes("usdc"))) {
      return "usdc-rule";
    }
    
    return null;
  };

  const generateResponse = (userInput: string, transferCommand: any, ruleCommand: string | null) => {
    if (transferCommand) {
      const { from, to, token, amount } = transferCommand;
      if (from === "wallet" && to === "yield") {
        return `Perfect! I've moved ${amount} ${token} from your wallet to your Yield Account. You'll start earning yield immediately!`;
      } else if (from === "yield" && to === "wallet") {
        return `Done! I've withdrawn ${amount} ${token} from your Yield Account to your wallet. The funds are now available for use.`;
      }
    }
    
    if (ruleCommand === "eth-rule") {
      return "Excellent! I've set up an auto-sweep rule to maintain 1.0 ETH in your wallet and sweep any excess to your Yield Account daily.";
    }
    
    if (ruleCommand === "usdc-rule") {
      return "Great! I've configured a rule to keep 500 USDC in your wallet and automatically sweep any excess to your Yield Account daily.";
    }
    
    // Provide helpful suggestions
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes("help") || lowerInput.includes("what can you do")) {
      return "I can help you with:\n\n🔄 **Transfers**: 'Move 0.5 ETH to yield account' or 'Withdraw 100 USDC from yield'\n\n⚙️ **Auto Rules**: 'Keep 1 ETH, sweep excess to yield' or 'Maintain 500 USDC, auto-sweep rest'\n\n📊 **Balance Management**: I'll optimize your yields while keeping your preferred amounts available\n\nWhat would you like to do?";
    }
    
    if (lowerInput.includes("balance") || lowerInput.includes("how much")) {
      return "I can see your current balances and help you optimize them. Would you like me to:\n\n• Set up auto-sweep rules?\n• Move specific amounts to your Yield Account?\n• Withdraw funds from your Yield Account?\n\nJust tell me what you'd like to do!";
    }
    
    return "I understand you want to manage your crypto, but I need more specific instructions. Try commands like:\n\n• 'Move 0.5 ETH to yield account'\n• 'Withdraw 100 USDC from yield'\n• 'Keep 1 ETH, sweep excess to yield'\n• 'Maintain 500 USDC, auto-sweep rest'\n\nWhat would you like to do?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isAI: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const transferCommand = parseTransferCommand(userInput);
      const ruleCommand = parseRuleCommand(userInput);
      
      const aiResponseText = generateResponse(userInput, transferCommand, ruleCommand);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isAI: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
      
      // Execute the appropriate action
      setTimeout(() => {
        if (transferCommand) {
          onTransfer(transferCommand.from, transferCommand.to, transferCommand.token, transferCommand.amount);
        } else if (ruleCommand === "eth-rule") {
          onRuleSet();
        } else if (ruleCommand === "usdc-rule") {
          onUSDCRuleSet();
        }
      }, 1000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold">YieldWise AI Assistant</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.isAI ? "justify-start" : "justify-end"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-line",
                  message.isAI
                    ? "bg-muted text-foreground"
                    : "bg-primary text-primary-foreground"
                )}
              >
                {message.text}
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your command... (e.g., 'Move 0.5 ETH to yield account')"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isProcessing}
            />
            <Button onClick={handleSend} disabled={isProcessing || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}