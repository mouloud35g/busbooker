import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";

export const RecentBookingsChart = () => {
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		fetchRecentBookings();
	}, []);

	const fetchRecentBookings = async () => {
		try {
			const endDate = new Date();
			const startDate = subDays(endDate, 7);

			const { data: bookings } = await supabase
				.from('bookings')
				.select('created_at, total_price')
				.gte('created_at', startDate.toISOString())
				.lte('created_at', endDate.toISOString())
				.order('created_at');

			// Grouper les réservations par jour
			const dailyData = bookings?.reduce((acc: any, booking: any) => {
				const date = format(new Date(booking.created_at), 'yyyy-MM-dd');
				if (!acc[date]) {
					acc[date] = {
						date,
						total: 0,
						count: 0,
					};
				}
				acc[date].total += booking.total_price;
				acc[date].count += 1;
				return acc;
			}, {});

			// Convertir en tableau et trier par date
			const chartData = Object.values(dailyData || {}).sort((a: any, b: any) => 
				new Date(a.date).getTime() - new Date(b.date).getTime()
			);

			setData(chartData);
		} catch (error) {
			console.error('Error fetching recent bookings:', error);
		}
	};

	return (
		<Card className="col-span-4">
			<CardHeader>
				<CardTitle>Réservations des 7 derniers jours</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-[200px]">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={data}>
							<XAxis 
								dataKey="date" 
								tickFormatter={(date) => format(new Date(date), 'dd/MM', { locale: fr })}
							/>
							<YAxis />
							<Tooltip 
								labelFormatter={(date) => format(new Date(date), 'dd MMMM yyyy', { locale: fr })}
								formatter={(value: number) => [`${value} DZD`, 'Total']}
							/>
							<Line 
								type="monotone" 
								dataKey="total" 
								stroke="#10b981" 
								strokeWidth={2} 
								dot={false}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
};