
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { DataTable, DataTableHead, DataTableRow, DataTableCell } from "@/components/DataTable";
import { Star, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { withAuth } from "@/components/auth/with-auth";
import { AdminLayout } from "@/components/layouts/admin-layout";
import type { Database } from "@/integrations/supabase/types";

type Review = Database['public']['Tables']['reviews']['Row'] & {
  profiles?: { username: string | null };
  bus_trips?: { departure_city: string; arrival_city: string };
};

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
    const subscription = setupRealtimeSubscription();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (username),
          bus_trips:trip_id (departure_city, arrival_city)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les avis",
        variant: "destructive",
      });
    }
  };

  const setupRealtimeSubscription = () => {
    return supabase
      .channel('reviews_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
        },
        () => fetchReviews()
      )
      .subscribe();
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Avis supprimé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'avis",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Gestion des Avis</h1>
        <DataTable>
          <thead>
            <DataTableRow>
              <DataTableHead>Utilisateur</DataTableHead>
              <DataTableHead>Voyage</DataTableHead>
              <DataTableHead>Note</DataTableHead>
              <DataTableHead>Commentaire</DataTableHead>
              <DataTableHead>Date</DataTableHead>
              <DataTableHead>Actions</DataTableHead>
            </DataTableRow>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <DataTableRow key={review.id}>
                <DataTableCell>{review.profiles?.username || 'Utilisateur inconnu'}</DataTableCell>
                <DataTableCell>
                  {review.bus_trips?.departure_city} → {review.bus_trips?.arrival_city}
                </DataTableCell>
                <DataTableCell className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{review.rating}/5</span>
                </DataTableCell>
                <DataTableCell>{review.comment}</DataTableCell>
                <DataTableCell>{new Date(review.created_at).toLocaleDateString('fr-FR')}</DataTableCell>
                <DataTableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(review.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Supprimer
                  </Button>
                </DataTableCell>
              </DataTableRow>
            ))}
          </tbody>
        </DataTable>
      </div>
    </AdminLayout>
  );
};

export default withAuth(ReviewsManagement, true);
