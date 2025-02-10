import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { supabase } from "@/integrations/supabase/client";
import { withAuth } from "@/components/auth/with-auth";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Trip {
	id: string;
	departure_city: string;
	arrival_city: string;
	departure_time: string;
	arrival_time: string;
	price: number;
	available_seats: number;
}

const TripsManagement = () => {
	const [trips, setTrips] = useState<Trip[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { toast } = useToast();
	const [formData, setFormData] = useState({
		departure_city: "",
		arrival_city: "",
		departure_time: "",
		arrival_time: "",
		price: 0,
		available_seats: 0,
	});

	useEffect(() => {
		fetchTrips();
		const subscription = setupRealtimeSubscription();
		return () => {
			subscription.unsubscribe();
		};
	}, []);

	const fetchTrips = async () => {
		try {
			const { data, error } = await supabase
				.from("bus_trips")
				.select("*")
				.order("departure_time", { ascending: true });

			if (error) throw error;
			setTrips(data || []);
		} catch (error: any) {
			toast({
				title: "Error",
				description: "Failed to fetch trips: " + error.message,
				variant: "destructive",
			});
		}
	};

	const setupRealtimeSubscription = () => {
		return supabase
			.channel("bus_trips_changes")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "bus_trips",
				},
				() => fetchTrips()
			)
			.subscribe();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const { error } = await supabase.from("bus_trips").insert([formData]);

			if (error) throw error;

			toast({
				title: "Success",
				description: "Trip created successfully",
			});
			setIsDialogOpen(false);
			setFormData({
				departure_city: "",
				arrival_city: "",
				departure_time: "",
				arrival_time: "",
				price: 0,
				available_seats: 0,
			});
		} catch (error: any) {
			toast({
				title: "Error",
				description: "Failed to create trip: " + error.message,
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		try {
			const { error } = await supabase.from("bus_trips").delete().eq("id", id);

			if (error) throw error;

			toast({
				title: "Success",
				description: "Trip deleted successfully",
			});
		} catch (error: any) {
			toast({
				title: "Error",
				description: "Failed to delete trip: " + error.message,
				variant: "destructive",
			});
		}
	};


	return (
		<AdminLayout>
			<div className="container mx-auto p-4">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold">Trip Management</h1>
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button>Add New Trip</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add New Trip</DialogTitle>
							</DialogHeader>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<Label>Departure City</Label>
									<Input
										value={formData.departure_city}
										onChange={(e) =>
											setFormData({ ...formData, departure_city: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<Label>Arrival City</Label>
									<Input
										value={formData.arrival_city}
										onChange={(e) =>
											setFormData({ ...formData, arrival_city: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<Label>Departure Time</Label>
									<Input
										type="datetime-local"
										value={formData.departure_time}
										onChange={(e) =>
											setFormData({ ...formData, departure_time: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<Label>Arrival Time</Label>
									<Input
										type="datetime-local"
										value={formData.arrival_time}
										onChange={(e) =>
											setFormData({ ...formData, arrival_time: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<Label>Price (DZD)</Label>
									<Input
										type="number"
										value={formData.price}
										onChange={(e) =>
											setFormData({ ...formData, price: Number(e.target.value) })
										}
										required
									/>
								</div>
								<div>
									<Label>Available Seats</Label>
									<Input
										type="number"
										value={formData.available_seats}
										onChange={(e) =>
											setFormData({
												...formData,
												available_seats: Number(e.target.value),
											})
										}
										required
									/>
								</div>
								<Button type="submit" disabled={isLoading}>
									{isLoading ? "Creating..." : "Create Trip"}
								</Button>
							</form>
						</DialogContent>
					</Dialog>
				</div>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Departure</TableHead>
							<TableHead>Arrival</TableHead>
							<TableHead>Departure Time</TableHead>
							<TableHead>Arrival Time</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Available Seats</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{trips.map((trip) => (
							<TableRow key={trip.id}>
								<TableCell>{trip.departure_city}</TableCell>
								<TableCell>{trip.arrival_city}</TableCell>
								<TableCell>
									{format(new Date(trip.departure_time), "Pp", { locale: fr })}
								</TableCell>
								<TableCell>
									{format(new Date(trip.arrival_time), "Pp", { locale: fr })}
								</TableCell>
								<TableCell>{trip.price} DZD</TableCell>
								<TableCell>{trip.available_seats}</TableCell>
								<TableCell>
									<Button
										variant="destructive"
										size="sm"
										onClick={() => handleDelete(trip.id)}
									>
										Delete
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</AdminLayout>
	);
};

export default withAuth(TripsManagement, true);
