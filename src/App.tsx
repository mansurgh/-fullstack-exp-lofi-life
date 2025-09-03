import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { clearQuranCache } from "./lib/quranApi";

const queryClient = new QueryClient();

// Очищаем кэш при первом запуске приложения
if (typeof window !== 'undefined') {
  const hasClearedCache = localStorage.getItem('quran_cache_cleared');
  if (!hasClearedCache) {
    console.log('🚀 First app launch - clearing Quran cache...');
    clearQuranCache();
    localStorage.setItem('quran_cache_cleared', 'true');
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/room/:roomId" element={<Index />} />
          <Route path="/room/:roomId/clicker" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
