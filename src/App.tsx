import { Toaster } from "../src/components/ui/toaster";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Navbar from "../src/components/Layout/Navbar";
import HabitTracker from "../src/components/Habits/HabitTracker";
import CycleTracker from "../src/components/Cycle/CycleTracker";
import BudgetTracker from "../src/components/Budget/BudgetTracker";
import MoodTracker from "../src/components/Mood/MoodTracker";
import JournalPage from "../src/components/Journal/JournalPage";
import SettingsPage from "../src/components/Settings/SettingsPage";

const queryClient = new QueryClient();

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background dotted-bg">
    <Navbar />
    <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {children}
    </main>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/habits" element={<LayoutWrapper><HabitTracker /></LayoutWrapper>} />
          <Route path="/cycle" element={<LayoutWrapper><CycleTracker /></LayoutWrapper>} />
          <Route path="/budget" element={<LayoutWrapper><BudgetTracker /></LayoutWrapper>} />
          <Route path="/mood" element={<LayoutWrapper><MoodTracker /></LayoutWrapper>} />
          <Route path="/journal" element={<LayoutWrapper><JournalPage /></LayoutWrapper>} />
          <Route path="/settings" element={<LayoutWrapper><SettingsPage /></LayoutWrapper>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
