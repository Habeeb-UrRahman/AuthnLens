
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MinimalLayout from "./components/layout/MinimalLayout"; // Updated Layout
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing"; // Import Pricing
import ImageDetection from "./pages/ImageDetection";
import VideoDetection from "./pages/VideoDetection";
// import FactChecker from "./pages/FactChecker"; // Temporarily disabled if not refactored yet
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* Minimal Dashboard Layout for all app tools */}
          <Route element={<MinimalLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/image" element={<ImageDetection />} />
            <Route path="/video" element={<VideoDetection />} />
            {/* <Route path="/factcheck" element={<FactChecker />} /> */}
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;