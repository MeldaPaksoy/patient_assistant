import "./global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Sayfalar
import Index from "./pages/Index";
import AIChat from "./pages/AIChat";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Resources from "./pages/Resources";
import { Header } from "./components/Header";
import { ChatBot } from "./components/ChatBot";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const showChatBot = location.pathname !== '/ai-chat' && location.pathname !== '/chat';

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/ai-chat" element={<AIChat />} />
        <Route path="/chat" element={<AIChat />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showChatBot && <ChatBot />}
      <Toaster />
      <Sonner />
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <AppContent />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
