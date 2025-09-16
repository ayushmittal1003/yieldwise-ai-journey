import { Sidebar } from "@/components/layout/Sidebar";
import Dashboard from "./Dashboard";

const Index = () => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <Dashboard />
    </div>
  );
};

export default Index;
