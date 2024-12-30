import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Routes, Route } from "react-router-dom";
import { WelcomeMascot } from "@/components/welcome/WelcomeMascot";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Test from "./pages/Test";
import TestIndonesian from "./pages/TestIndonesian";
import TestEnglish from "./pages/TestEnglish";
import Results from "./pages/Results";
import Forum from "./pages/Forum";
import CreatePost from "./pages/CreatePost";
import News from "./pages/News";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Subscription from "./pages/Subscription";
import Payment from "./pages/Payment";
import ForgotPassword from "./pages/ForgotPassword";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Rapor from "./pages/Rapor";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth/:type" element={<Auth />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/test" element={<Test />} />
              <Route path="/test-id" element={<TestIndonesian />} />
              <Route path="/test-en" element={<TestEnglish />} />
              <Route path="/results" element={<Results />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/news" element={<News />} />
              <Route path="/search" element={<Search />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/payment/:planType" element={<Payment />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/rapor" element={<Rapor />} />
            </Routes>
            <WelcomeMascot />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;