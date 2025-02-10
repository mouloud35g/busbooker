
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootLayout } from "@/components/layouts/root-layout";
import Index from "./pages/index";
import Auth from "./pages/auth";
import Booking from "./pages/booking";
import Profile from "./pages/profile";
import Admin from "./pages/admin";
import About from "./pages/about";
import Contact from "./pages/contact";
import FAQ from "./pages/faq";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
import BusCompanyManagement from "./pages/bus-company-management";
import ReviewsManagement from "./pages/reviews-management";
import NotificationsManagement from "./pages/notifications-management";
import UsersManagement from "./pages/users-management";
import TripsManagement from "./pages/trips-management";
import BookingsManagement from "./pages/bookings-management";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <RootLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            {/* Admin routes */}
            <Route path="/admin/trips" element={<TripsManagement />} />
            <Route path="/admin/bus-companies" element={<BusCompanyManagement />} />
            <Route path="/admin/bookings" element={<BookingsManagement />} />
            <Route path="/admin/reviews" element={<ReviewsManagement />} />
            <Route path="/admin/notifications" element={<NotificationsManagement />} />
            <Route path="/admin/users" element={<UsersManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RootLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
