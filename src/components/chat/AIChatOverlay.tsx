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
}

export function AIChatOverlay({ isOpen, onClose, onRuleSet }: AIChatOverlayProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your YieldWise Assistant. How can I help manage your crypto?",
      isAI: true,
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState("Maintain 1 ETH in my wallet and sweep excess daily to Yield Account.");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isAI: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Done! I'll sweep any ETH over 1.0 into your Yield Account at end of each day.",
        isAI: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
      
      // Trigger rule set after a brief delay
      setTimeout(() => {
        onRuleSet();
      }, 1500);
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
                  "max-w-[80%] rounded-lg px-3 py-2 text-sm",
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
              placeholder="Type your message..."
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