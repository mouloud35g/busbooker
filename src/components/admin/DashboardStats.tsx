import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Bus, Calendar, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const DashboardStats = () => {
	const [stats, setStats] = useState({
		totalUsers: 0,
		totalTrips: 0,
		totalBookings: 0,
		totalRevenue: 0,
	});

	useEffect(() => {
		fetchStats();
	}, []);

	const fetchStats = async () => {
		try {
			// Fetch total users
			const { count: usersCount } = await supabase
				.from('profiles')
				.select('*', { count: 'exact', head: true });

			// Fetch total trips
			const { count: tripsCount } = await supabase
				.from('bus_trips')
				.select('*', { count: 'exact', head: true });

			// Fetch bookings and revenue
			const { data: bookings } = await supabase
				.from('bookings')
				.select('total_price');

			const totalRevenue = bookings?.reduce((sum, booking) => sum + booking.total_price, 0) || 0;

			setStats({
				totalUsers: usersCount || 0,
				totalTrips: tripsCount || 0,
				totalBookings: bookings?.length || 0,
				totalRevenue,
			});
		} catch (error) {
			console.error('Error fetching stats:', error);
		}
	};

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
					<Users className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.totalUsers}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Voyages Total</CardTitle>
					<Bus className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.totalTrips}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Réservations Total</CardTitle>
					<Calendar className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.totalBookings}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
					<CreditCard className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.totalRevenue} DZD</div>
				</CardContent>
			</Card>
		</div>
	);
};