
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BusTrip {
  id: string;
  departure_city: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
}

interface PassengerInfo {
  firstName: string;
  lastName: string;
}

const Booking = () => {
  const [passengerCount, setPassengerCount] = useState(1);
  const [phone, setPhone] = useState("");
  const [passengers, setPassengers] = useState<PassengerInfo[]>([{ firstName: "", lastName: "" }]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const trip = location.state?.trip as BusTrip;

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Veuillez vous connecter pour effectuer une réservation");
        navigate("/auth");
        return;
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!trip) {
      navigate("/");
      return;
    }
  }, [trip, navigate]);

  useEffect(() => {
    setPassengers(Array(passengerCount).fill({ firstName: "", lastName: "" }));
  }, [passengerCount]);

  const updatePassenger = (index: number, field: keyof PassengerInfo, value: string) => {
    const newPassengers = [...passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setPassengers(newPassengers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");

      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          trip_id: trip.id,
          user_id: session.user.id,
          passenger_count: passengerCount,
          total_price: trip.price * passengerCount,
          status: "confirmed",
          contact_phone: phone,
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Add passengers
      const { error: passengersError } = await supabase
        .from("passengers")
        .insert(
          passengers.map((p) => ({
            booking_id: booking.id,
            first_name: p.firstName,
            last_name: p.lastName,
          }))
        );

      if (passengersError) throw passengersError;

      toast.success("Réservation confirmée !");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!trip) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Détails du voyage</CardTitle>
            <CardDescription>
              {trip.departure_city} → {trip.arrival_city}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Départ</p>
                <p className="font-medium">
                  {format(new Date(trip.departure_time), "EEEE d MMMM yyyy à HH:mm", { locale: fr })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Arrivée</p>
                <p className="font-medium">
                  {format(new Date(trip.arrival_time), "EEEE d MMMM yyyy à HH:mm", { locale: fr })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="passengerCount" className="block text-sm font-medium text-gray-700">
                  Nombre de passagers
                </label>
                <Input
                  id="passengerCount"
                  type="number"
                  min="1"
                  max={trip.available_seats}
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(Number(e.target.value))}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations des passagers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {passengers.map((passenger, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="font-medium">Passager {index + 1}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Prénom
                      </label>
                      <Input
                        required
                        value={passenger.firstName}
                        onChange={(e) => updatePassenger(index, "firstName", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nom
                      </label>
                      <Input
                        required
                        value={passenger.lastName}
                        onChange={(e) => updatePassenger(index, "lastName", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Prix par passager</span>
                  <span>{trip.price}€</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{trip.price * passengerCount}€</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate(-1)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="w-full bg-sage-600 hover:bg-sage-700"
              disabled={isLoading}
            >
              {isLoading ? "Confirmation en cours..." : "Confirmer la réservation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Booking;
