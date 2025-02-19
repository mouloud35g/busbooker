
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/bus-companies", label: "Compagnies" },
    { href: "/admin/reviews", label: "Avis" },
    { href: "/admin/notifications", label: "Notifications" },
    { href: "/admin/trips", label: "Voyages" },
    { href: "/admin/bookings", label: "Réservations" },
    { href: "/admin/users", label: "Utilisateurs" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="flex space-x-6 overflow-x-auto py-4 px-4 bg-white border-b">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium transition-colors",
              location.pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-primary hover:bg-primary/10"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <main className="container mx-auto py-6">
        {children}
      </main>
    </div>
  );
}
