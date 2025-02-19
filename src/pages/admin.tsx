
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { withAuth } from "@/components/auth/with-auth";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { StatsOverview } from "@/components/admin/StatsOverview";
import { RecentBookingsChart } from "@/components/admin/RecentBookingsChart";

const AdminPage = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold">Tableau de Bord</h1>
        
        <StatsOverview />
        
        <RecentBookingsChart />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Voyages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Gérer les voyages et les horaires</p>
              <Link to="/admin/trips">
                <Button className="w-full">Accéder</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestion des Compagnies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Gérer les compagnies de bus</p>
              <Link to="/admin/bus-companies">
                <Button className="w-full">Accéder</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestion des Réservations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Gérer les réservations des clients</p>
              <Link to="/admin/bookings">
                <Button className="w-full">Accéder</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestion des Paiements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Gérer les paiements et voir les rapports financiers</p>
              <Link to="/admin/payments">
                <Button className="w-full">Accéder</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestion des Avis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Gérer les avis des clients</p>
              <Link to="/admin/reviews">
                <Button className="w-full">Accéder</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestion des Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Gérer les comptes utilisateurs</p>
              <Link to="/admin/users">
                <Button className="w-full">Accéder</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAuth(AdminPage, true);
