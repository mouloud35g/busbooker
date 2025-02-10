import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { withAuth } from "@/components/auth/with-auth";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Booking {
	id: string;
	user_id: string;
	trip_id: string;
	passenger_count: number;
	total_price: number;
	status: string;
	contact_phone: string;
	created_at: string;
	profiles: { username: string | null };
	bus_trips: {
		departure_city: string;
		arrival_city: string;
		departure_time: string;
	};
}

const BookingsManagement = () => {
	const [bookings, setBookings] = useState<Booking[]>([]);
	const { toast } = useToast();

	useEffect(() => {
		fetchBookings();
		const subscription = setupRealtimeSubscription();
		return () => {
			subscription.unsubscribe();
		};
	}, []);

	const fetchBookings = async () => {
		try {
			const { data, error } = await supabase
				.from('bookings')
				.select(`
					*,
					profiles (username),
					bus_trips (departure_city, arrival_city, departure_time)
				`)
				.order('created_at', { ascending: false });

			if (error) throw error;
			setBookings(data || []);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to fetch bookings",
				variant: "destructive",
			});
		}
	};

	const setupRealtimeSubscription = () => {
		return supabase
			.channel('bookings_changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'bookings',
				},
				() => fetchBookings()
			)
			.subscribe();
	};

	const updateBookingStatus = async (id: string, newStatus: string) => {
		try {
			const { error } = await supabase
				.from('bookings')
				.update({ status: newStatus })
				.eq('id', id);

			if (error) throw error;

			toast({
				title: "Success",
				description: "Booking status updated successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update booking status",
				variant: "destructive",
			});
		}
	};

	const getStatusBadgeVariant = (status: string) => {
		switch (status) {
			case 'confirmed':
				return 'success';
			case 'pending':
				return 'warning';
			case 'cancelled':
				return 'destructive';
			default:
				return 'secondary';
		}
	};

	return (
		<AdminLayout>
			<div className="container mx-auto p-4">
				<Card>
					<CardHeader>
						<CardTitle>Gestion des Réservations</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Client</TableHead>
									<TableHead>Trajet</TableHead>
									<TableHead>Date de départ</TableHead>
									<TableHead>Passagers</TableHead>
									<TableHead>Prix Total</TableHead>
									<TableHead>Statut</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{bookings.map((booking) => (
									<TableRow key={booking.id}>
										<TableCell>{booking.profiles?.username || 'Anonyme'}</TableCell>
										<TableCell>
											{booking.bus_trips?.departure_city} → {booking.bus_trips?.arrival_city}
										</TableCell>
										<TableCell>
											{format(new Date(booking.bus_trips?.departure_time), "Pp", { locale: fr })}
										</TableCell>
										<TableCell>{booking.passenger_count}</TableCell>
										<TableCell>{booking.total_price} DZD</TableCell>
										<TableCell>
											<Badge variant={getStatusBadgeVariant(booking.status)}>
												{booking.status}
											</Badge>
										</TableCell>
										<TableCell>
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => updateBookingStatus(booking.id, 'confirmed')}
													disabled={booking.status === 'confirmed'}
												>
													Confirmer
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() => updateBookingStatus(booking.id, 'cancelled')}
													disabled={booking.status === 'cancelled'}
												>
													Annuler
												</Button>
											</div>
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

export default withAuth(BookingsManagement, true);