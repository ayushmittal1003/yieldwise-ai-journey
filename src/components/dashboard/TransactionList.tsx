import { ArrowDownCircle, ArrowUpCircle, TrendingUp, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TransactionListProps {
  hasAIRule: boolean;
}

const baseTransactions = [
  {
    id: "1",
    icon: <ArrowDownCircle className="h-5 w-5 text-green-600" />,
    name: "John Doe",
    type: "Collect • Tue",
    amount: "+ 20,000.00 GBP",
    status: "Success",
  },
  {
    id: "2", 
    icon: <ArrowUpCircle className="h-5 w-5 text-blue-600" />,
    name: "John Doe",
    type: "Send • Tue",
    amount: "- 20,000.00 GBP",
    status: "Success",
  },
  {
    id: "3",
    icon: <ArrowDownCircle className="h-5 w-5 text-green-600" />,
    name: "John Doe",
    type: "Collect • Tue",
    amount: "+ 20,000.00 GBP", 
    status: "Success",
  },
  {
    id: "4",
    icon: <Plus className="h-5 w-5 text-blue-600" />,
    name: "EUR Account",
    type: "Add • Tue",
    amount: "+ 20,000.00 GBP",
    status: "Success",
  },
  {
    id: "5",
    icon: <ArrowDownCircle className="h-5 w-5 text-green-600" />,
    name: "John Doe", 
    type: "Received • Tue",
    amount: "+ 20,000.00 GBP",
    status: "Success",
  },
];

export function TransactionList({ hasAIRule }: TransactionListProps) {
  const aiTransaction = {
    id: "ai-sweep",
    icon: <TrendingUp className="h-5 w-5 text-purple-600" />,
    name: "AI Sweep to Yield",
    type: "Auto-sweep • Today",
    amount: "+ 1.5 ETH",
    status: "Success",
  };

  const transactions = hasAIRule ? [aiTransaction, ...baseTransactions] : baseTransactions;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <button className="text-sm text-muted-foreground hover:text-foreground">
          View All
        </button>
      </div>

      <Card className="divide-y">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <div className="flex items-center space-x-3">
              {transaction.icon}
              <div>
                <p className="font-medium text-foreground">{transaction.name}</p>
                <p className="text-sm text-muted-foreground">{transaction.type}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground">{transaction.amount}</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">{transaction.status}</span>
              </div>
            </div>
          </div>
        ))}
      </Card>

      {/* Payment Status Section */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Payment Status</h3>
          <button className="text-sm text-muted-foreground hover:text-foreground">
            View All
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Pre-funding Initiated</span>
            </div>
            <span className="text-muted-foreground">2 May 2022, 7:27 pm ET</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Fiat Received</span>
            </div>
            <span className="text-muted-foreground">2 May 2022, 7:27 pm ET</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Pre-funding Success</span>
            </div>
            <span className="text-muted-foreground">2 May 2022, 7:27 pm ET</span>
          </div>
        </div>
      </Card>
    </div>
  );
}