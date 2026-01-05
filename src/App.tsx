import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import ApplicationForm from "./pages/ApplicationForm";
import ApplicationSuccess from "./pages/ApplicationSuccess";
import Applications from "./pages/Applications";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lowongan" element={<Landing />} />
          <Route path="/job-board" element={<Index />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/application-form" element={<ApplicationForm />} />
          <Route path="/application-success" element={<ApplicationSuccess />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/tentang-kami" element={<About />} />
          <Route path="/kontak-kami" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
