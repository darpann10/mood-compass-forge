import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MoodProvider } from "@/contexts/MoodContext";
import Layout from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import MoodEntry from "./pages/MoodEntry";
import Journal from "./pages/Journal";
import Analytics from "./pages/Analytics";
import Quotes from "./pages/Quotes";
import AuthPage from "./components/auth/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MoodProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="mood" element={<MoodEntry />} />
              <Route path="journal" element={<Journal />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="quotes" element={<Quotes />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MoodProvider>
  </QueryClientProvider>
);

export default App;
