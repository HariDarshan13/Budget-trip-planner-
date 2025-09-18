import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthModule from "./pages/AuthModule";
import PreferencesModule from "./pages/PreferencesModule";
import TransportModule from "./pages/TransportModule";
import AccommodationModule from "./pages/AccommodationModule";
import ActivitiesModule from "./pages/ActivitiesModule";
import ItineraryGenerator from "./pages/ItineraryGenerator";
import MapRouteOptimizer from "./pages/MapRouteOptimizer";
import ItineraryOutput from "./pages/ItineraryOutput";
import AdminPanel from "./pages/AdminPanel";
import BudgetModule from "./pages/BudgetModule";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ✅ Main Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/preferences" element={<PreferencesModule />} />
          <Route path="/budget" element={<BudgetModule />} />

          {/* ✅ Extra Routes if needed */}
          <Route path="/auth" element={<AuthModule />} />
          <Route path="/transport" element={<TransportModule />} />
          <Route path="/accommodation" element={<AccommodationModule />} />
          <Route path="/activities" element={<ActivitiesModule />} />
          <Route path="/itinerary-generator" element={<ItineraryGenerator />} />
          <Route path="/map-optimizer" element={<MapRouteOptimizer />} />
          <Route path="/itinerary-output" element={<ItineraryOutput />} />
          <Route path="/admin" element={<AdminPanel />} />

          {/* ✅ Catch-all for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
