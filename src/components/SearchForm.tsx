
import { useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { SearchResults } from "@/components/SearchResults";
import { toast } from "sonner";

export const SearchForm = () => {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let query = supabase
        .from("bus_trips")
        .select("*")
        .ilike("departure_city", `%${departure}%`)
        .ilike("arrival_city", `%${arrival}%`);

      if (date) {
        const searchDate = new Date(date);
        const nextDay = new Date(searchDate);
        nextDay.setDate(nextDay.getDate() + 1);

        query = query
          .gte("departure_time", searchDate.toISOString())
          .lt("departure_time", nextDay.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      setSearchResults(data || []);
    } catch (error) {
      console.error("Error fetching trips:", error);
      toast.error("Une erreur est survenue lors de la recherche");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="departure" className="block text-sm font-medium text-gray-700">
                Départ
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  id="departure"
                  className="pl-10"
                  placeholder="Ville de départ"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="arrival" className="block text-sm font-medium text-gray-700">
                Arrivée
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  id="arrival"
                  className="pl-10"
                  placeholder="Ville d'arrivée"
                  value={arrival}
                  onChange={(e) => setArrival(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="date"
                id="date"
                className="pl-10"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <Button 
            type="submit"
            className="w-full bg-sage-600 hover:bg-sage-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Recherche en cours..." : "Rechercher"}
          </Button>
        </form>
      </div>
      </div>
      
      {searchResults.length > 0 && (
        <div className="mt-8">
          <SearchResults trips={searchResults} />
        </div>
      )}
    </div>
  );
};
