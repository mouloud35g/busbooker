
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock, CreditCard, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface BusTrip {
  id: string;
  departure_city: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
}

interface SearchResultsProps {
  trips: BusTrip[];
}

export const SearchResults = ({ trips }: SearchResultsProps) => {
  const [sortBy, setSortBy] = useState<"price" | "duration" | "departure">("price");
  const navigate = useNavigate();

  const sortTrips = (trips: BusTrip[]) => {
    return [...trips].sort((a, b) => {
      switch (sortBy) {
        case "price":
          return Number(a.price) - Number(b.price);
        case "duration":
          return (
            new Date(a.arrival_time).getTime() -
            new Date(a.departure_time).getTime() -
            (new Date(b.arrival_time).getTime() -
              new Date(b.departure_time).getTime())
          );
        case "departure":
          return (
            new Date(a.departure_time).getTime() -
            new Date(b.departure_time).getTime()
          );
        default:
          return 0;
      }
    });
  };

  const calculateDuration = (departure: string, arrival: string) => {
    const durationInMinutes =
      (new Date(arrival).getTime() - new Date(departure).getTime()) / (1000 * 60);
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = Math.round(durationInMinutes % 60);
    return `${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`;
  };

  const handleBooking = (trip: BusTrip) => {
    navigate("/booking", { state: { trip } });
  };

  const sortedTrips = sortTrips(trips);

  if (trips.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun trajet disponible pour cette recherche
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={sortBy} onValueChange={(value: "price" | "duration" | "departure") => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Prix</SelectItem>
            <SelectItem value="duration">Durée</SelectItem>
            <SelectItem value="departure">Heure de départ</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4">
        {sortedTrips.map((trip) => (
          <Card key={trip.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <span>
                  {trip.departure_city} → {trip.arrival_city}
                </span>
                <span className="text-xl font-bold text-sage-600">
                  {trip.price}€
                </span>
              </CardTitle>
              <CardDescription>
                {format(new Date(trip.departure_time), "EEEE d MMMM", {
                  locale: fr,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div className="text-sm">
                    <div className="font-medium">
                      {format(new Date(trip.departure_time), "HH:mm")}
                    </div>
                    <div className="text-gray-500">Départ</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div className="text-sm">
                    <div className="font-medium">
                      {format(new Date(trip.arrival_time), "HH:mm")}
                    </div>
                    <div className="text-gray-500">Arrivée</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div className="text-sm">
                    <div className="font-medium">{trip.available_seats}</div>
                    <div className="text-gray-500">Places</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Durée : {calculateDuration(trip.departure_time, trip.arrival_time)}</span>
                </div>
                <Button 
                  onClick={() => handleBooking(trip)}
                  className="bg-sage-600 hover:bg-sage-700"
                >
                  Réserver
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
