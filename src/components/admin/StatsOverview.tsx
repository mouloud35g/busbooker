
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, BusFront, Calendar, CreditCard, Star, 
  CheckCircle2, Clock, XCircle, UserPlus, Package 
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type AdminStats = {
  total_bookings: number;
  confirmed_bookings: number;
  pending_bookings: number;
  cancelled_bookings: number;
  total_revenue: number;
  total_passengers: number;
  total_users: number;
  admin_users: number;
  new_users_last_week: number;
  total_reviews: number;
  average_rating: number;
  total_trips: number;
  upcoming_trips: number;
  sold_out_trips: number;
}

export const StatsOverview = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_stats');
      if (error) {
        console.error('Error fetching admin stats:', error);
        toast.error("Erreur lors du chargement des statistiques");
        throw error;
      }
      return data as AdminStats;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  if (error) {
    return <div className="text-red-500">Erreur lors du chargement des statistiques</div>;
  }

  if (isLoading || !stats) {
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array(8).fill(0).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chargement...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </CardContent>
        </Card>
      ))}
    </div>;
  }

  const statCards = [
    {
      title: "Réservations totales (30j)",
      value: stats.total_bookings,
      icon: Calendar,
      color: "text-blue-500",
    },
    {
      title: "Réservations confirmées",
      value: stats.confirmed_bookings,
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      title: "Réservations en attente",
      value: stats.pending_bookings,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title: "Réservations annulées",
      value: stats.cancelled_bookings,
      icon: XCircle,
      color: "text-red-500",
    },
    {
      title: "Revenu total (30j)",
      value: `${stats.total_revenue.toLocaleString('fr-FR')} DZD`,
      icon: CreditCard,
      color: "text-emerald-500",
    },
    {
      title: "Passagers totaux (30j)",
      value: stats.total_passengers,
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Utilisateurs totaux",
      value: stats.total_users,
      icon: Users,
      color: "text-indigo-500",
    },
    {
      title: "Nouveaux utilisateurs (7j)",
      value: stats.new_users_last_week,
      icon: UserPlus,
      color: "text-cyan-500",
    },
    {
      title: "Note moyenne (30j)",
      value: `${stats.average_rating}/5`,
      icon: Star,
      color: "text-yellow-500",
    },
    {
      title: "Avis totaux (30j)",
      value: stats.total_reviews,
      icon: Star,
      color: "text-orange-500",
    },
    {
      title: "Voyages à venir",
      value: stats.upcoming_trips,
      icon: BusFront,
      color: "text-blue-500",
    },
    {
      title: "Voyages complets",
      value: stats.sold_out_trips,
      icon: Package,
      color: "text-red-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
