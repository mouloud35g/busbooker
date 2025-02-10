
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Booking {
  id: string;
  user_id: string;
  trip_id: string;
  status: string;
  passenger_count: number;
  total_price: number;
  created_at: string;
  contact_phone: string;
  profiles: {
    username: string | null;
  };
  bus_trips: {
    departure_city: string;
    arrival_city: string;
    departure_time: string;
  };
}

const BookingManagement = () => {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["bookings", statusFilter, dateFilter],
    queryFn: async () => {
      let query = supabase
        .from("bookings")
        .select(`
          *,
          profiles:user_id (username),
          bus_trips!inner (
            departure_city,
            arrival_city,
            departure_time
          )
        `)
        .order("created_at", { ascending: false });

      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }

      if (dateFilter) {
        const date = new Date(dateFilter);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        query = query.gte("created_at", date.toISOString())
          .lt("created_at", nextDate.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestion des Réservations</h2>

      <div className="flex gap-4 mb-6">
        <div className="w-64">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les statuts</SelectItem>
              <SelectItem value="confirmed">Confirmé</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-64">
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            placeholder="Filtrer par date"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Trajet</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Passagers</TableHead>
            <TableHead>Prix Total</TableHead>
            <TableHead>Date de réservation</TableHead>
            <TableHead>Contact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings?.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                {booking.bus_trips.departure_city} → {booking.bus_trips.arrival_city}
                <br />
                <span className="text-sm text-gray-500">
                  {new Date(booking.bus_trips.departure_time).toLocaleString()}
                </span>
              </TableCell>
              <TableCell>{booking.profiles.username || "Anonyme"}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  booking.status === "confirmed" ? "bg-green-100 text-green-800" :
                  booking.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {booking.status}
                </span>
              </TableCell>
              <TableCell>{booking.passenger_count}</TableCell>
              <TableCell>{booking.total_price}€</TableCell>
              <TableCell>
                {new Date(booking.created_at).toLocaleString()}
              </TableCell>
              <TableCell>{booking.contact_phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookingManagement;
