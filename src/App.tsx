import ScrollToTop from "@/components/ScrollToTop";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const queryClient = new QueryClient();
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Visualization = lazy(() => import("./pages/Index"));
const FinderInterface = lazy(() => import("./pages/FinderInterface"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const Theory = lazy(() => import("./pages/Theory"));
const Guide = lazy(() => import("./pages/Guide"));
const Organiser = lazy(() => import("./pages/Organiser"));
const OrganiserGuide = lazy(() => import("./pages/OrganiserGuide"));
const NpmPackage = lazy(() => import("./pages/NpmPackage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white text-black">Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/visualization" element={<Visualization />} />
            {/* <Route path="/finder" element={<FinderInterface />} /> */}
            {/* <Route path="/roadmap" element={<Roadmap />} /> */}
            {/* <Route path="/theory" element={<Theory />} /> */}
            <Route path="/organiser" element={<Organiser />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/organiser-guide" element={<OrganiserGuide />} />
            <Route path="/npm-package" element={<NpmPackage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
