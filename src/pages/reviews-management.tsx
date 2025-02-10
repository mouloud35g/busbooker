import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { withAuth } from "@/components/auth/with-auth";
import type { Database } from "@/integrations/supabase/types";

type Review = Database['public']['Tables']['reviews']['Row'];

const ReviewsManagement = () => {
	const [reviews, setReviews] = useState<Review[]>([]);
	const { toast } = useToast();

	useEffect(() => {
		fetchReviews();
		const subscription = setupRealtimeSubscription();
		return () => {
			subscription.unsubscribe();
		};
	}, []);

	const fetchReviews = async () => {
		try {
			const { data, error } = await supabase
				.from('reviews')
				.select(`
					*,
					profiles:user_id (username),
					bus_trips:trip_id (departure_city, arrival_city)
				`)
				.order('created_at', { ascending: false });
			
			if (error) throw error;
			setReviews(data || []);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to fetch reviews",
				variant: "destructive",
			});
		}
	};

	const setupRealtimeSubscription = () => {
		return supabase
			.channel('reviews_changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'reviews',
				},
				() => fetchReviews()
			)
			.subscribe();
	};

	const handleDelete = async (id: string) => {
		try {
			const { error } = await supabase
				.from('reviews')
				.delete()
				.eq('id', id);

			if (error) throw error;

			toast({
				title: "Success",
				description: "Review deleted successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete review",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="container mx-auto p-4">
			<Card>
				<CardHeader>
					<CardTitle>Reviews Management</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>User</TableHead>
								<TableHead>Trip</TableHead>
								<TableHead>Rating</TableHead>
								<TableHead>Comment</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{reviews.map((review) => (
								<TableRow key={review.id}>
									<TableCell>{(review as any).profiles?.username || 'Unknown'}</TableCell>
									<TableCell>
										{(review as any).bus_trips?.departure_city} → {(review as any).bus_trips?.arrival_city}
									</TableCell>
									<TableCell>{review.rating}/5</TableCell>
									<TableCell>{review.comment}</TableCell>
									<TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
									<TableCell>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => handleDelete(review.id)}
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
	);
};

export default withAuth(ReviewsManagement, true);
