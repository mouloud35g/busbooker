
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Edit, Trash } from "lucide-react";

interface Trip {
  id: string;
  departure_city: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
}

const TripManagement = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [formData, setFormData] = useState({
    departure_city: "",
    arrival_city: "",
    departure_time: "",
    arrival_time: "",
    price: "",
    available_seats: "",
  });

  const { data: trips, isLoading } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bus_trips")
        .select("*")
        .order("departure_time", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newTrip: Omit<Trip, "id">) => {
      const { data, error } = await supabase
        .from("bus_trips")
        .insert([newTrip])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      toast.success("Trajet créé avec succès");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erreur lors de la création du trajet: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (trip: Trip) => {
      const { data, error } = await supabase
        .from("bus_trips")
        .update(trip)
        .eq("id", trip.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      toast.success("Trajet mis à jour avec succès");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour du trajet: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("bus_trips")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      toast.success("Trajet supprimé avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression du trajet: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tripData = {
      departure_city: formData.departure_city,
      arrival_city: formData.arrival_city,
      departure_time: formData.departure_time,
      arrival_time: formData.arrival_time,
      price: parseFloat(formData.price),
      available_seats: parseInt(formData.available_seats),
    };

    if (editingTrip) {
      updateMutation.mutate({ ...tripData, id: editingTrip.id });
    } else {
      createMutation.mutate(tripData);
    }
  };

  const resetForm = () => {
    setFormData({
      departure_city: "",
      arrival_city: "",
      departure_time: "",
      arrival_time: "",
      price: "",
      available_seats: "",
    });
    setEditingTrip(null);
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setFormData({
      departure_city: trip.departure_city,
      arrival_city: trip.arrival_city,
      departure_time: new Date(trip.departure_time).toISOString().slice(0, 16),
      arrival_time: new Date(trip.arrival_time).toISOString().slice(0, 16),
      price: trip.price.toString(),
      available_seats: trip.available_seats.toString(),
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Trajets</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
            >
              Ajouter un trajet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTrip ? "Modifier le trajet" : "Ajouter un trajet"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="departure_city">Ville de départ</label>
                <Input
                  id="departure_city"
                  value={formData.departure_city}
                  onChange={(e) =>
                    setFormData({ ...formData, departure_city: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="arrival_city">Ville d'arrivée</label>
                <Input
                  id="arrival_city"
                  value={formData.arrival_city}
                  onChange={(e) =>
                    setFormData({ ...formData, arrival_city: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="departure_time">Heure de départ</label>
                <Input
                  id="departure_time"
                  type="datetime-local"
                  value={formData.departure_time}
                  onChange={(e) =>
                    setFormData({ ...formData, departure_time: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="arrival_time">Heure d'arrivée</label>
                <Input
                  id="arrival_time"
                  type="datetime-local"
                  value={formData.arrival_time}
                  onChange={(e) =>
                    setFormData({ ...formData, arrival_time: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="price">Prix</label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="available_seats">Places disponibles</label>
                <Input
                  id="available_seats"
                  type="number"
                  min="0"
                  value={formData.available_seats}
                  onChange={(e) =>
                    setFormData({ ...formData, available_seats: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingTrip ? "Modifier" : "Ajouter"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Départ</TableHead>
            <TableHead>Arrivée</TableHead>
            <TableHead>Date de départ</TableHead>
            <TableHead>Date d'arrivée</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Places</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trips?.map((trip) => (
            <TableRow key={trip.id}>
              <TableCell>{trip.departure_city}</TableCell>
              <TableCell>{trip.arrival_city}</TableCell>
              <TableCell>
                {new Date(trip.departure_time).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(trip.arrival_time).toLocaleString()}
              </TableCell>
              <TableCell>{trip.price}€</TableCell>
              <TableCell>{trip.available_seats}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(trip)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce trajet ?")) {
                        deleteMutation.mutate(trip.id);
                      }
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TripManagement;
