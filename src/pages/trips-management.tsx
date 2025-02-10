import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { withAuth } from "@/components/auth/with-auth";
import { AdminLayout } from "@/components/layouts/admin-layout";
import type { Database } from "@/integrations/supabase/types";

type BusTrip = Database['public']['Tables']['bus_trips']['Row'];

const TripsManagement = () => {
	const [trips, setTrips] = useState<BusTrip[]>([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [formData, setFormData] = useState({
		departure_city: "",
		arrival_city: "",
		departure_time: "",
		arrival_time: "",
		price: 0,
		available_seats: 0,
	});
	const { toast } = useToast();

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
				.from('bus_trips')
				.select('*')
				.order('departure_time', { ascending: true });
			
			if (error) throw error;
			setTrips(data || []);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to fetch trips",
				variant: "destructive",
			});
		}
	};

	const setupRealtimeSubscription = () => {
		return supabase
			.channel('bus_trips_changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'bus_trips',
				},
				() => fetchTrips()
			)
			.subscribe();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const { error } = await supabase
				.from('bus_trips')
				.insert([{
					...formData,
					price: Number(formData.price),
					available_seats: Number(formData.available_seats),
				}]);

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
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to create trip",
				variant: "destructive",
			});
		}
	};

	const handleDelete = async (id: string) => {
		try {
			const { error } = await supabase
				.from('bus_trips')
				.delete()
				.eq('id', id);

			if (error) throw error;

			toast({
				title: "Success",
				description: "Trip deleted successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete trip",
				variant: "destructive",
			});
		}
	};

	return (
		<AdminLayout>
			<div className="container mx-auto p-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>Trips Management</CardTitle>
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
										<Label htmlFor="departure_city">Departure City</Label>
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
										<Label htmlFor="arrival_city">Arrival City</Label>
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
										<Label htmlFor="departure_time">Departure Time</Label>
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
										<Label htmlFor="arrival_time">Arrival Time</Label>
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
										<Label htmlFor="price">Price (DZD)</Label>
										<Input
											id="price"
											type="number"
											value={formData.price}
											onChange={(e) =>
												setFormData({ ...formData, price: parseInt(e.target.value) })
											}
											required
										/>
									</div>
									<div>
										<Label htmlFor="seats">Available Seats</Label>
										<Input
											id="seats"
											type="number"
											value={formData.available_seats}
											onChange={(e) =>
												setFormData({ ...formData, available_seats: parseInt(e.target.value) })
											}
											required
										/>
									</div>
									<Button type="submit" className="w-full">
										Create Trip
									</Button>
								</form>
							</DialogContent>
						</Dialog>
					</CardHeader>
					<CardContent>
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
										<TableCell>{new Date(trip.departure_time).toLocaleString()}</TableCell>
										<TableCell>{new Date(trip.arrival_time).toLocaleString()}</TableCell>
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
					</CardContent>
				</Card>
			</div>
		</AdminLayout>
	);
};

export default withAuth(TripsManagement, true);