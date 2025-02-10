import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { withAuth } from "@/components/auth/with-auth";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Notification = Database['public']['Tables']['notifications']['Row'];

const NotificationsManagement = () => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		message: "",
		type: "system" as const,
		user_id: "",
	});
	const { toast } = useToast();

	useEffect(() => {
		fetchNotifications();
		const subscription = setupRealtimeSubscription();
		return () => {
			subscription.unsubscribe();
		};
	}, []);

	const fetchNotifications = async () => {
		try {
			const { data, error } = await supabase
				.from('notifications')
				.select(`
					*,
					profiles:user_id (username)
				`)
				.order('created_at', { ascending: false });
			
			if (error) throw error;
			setNotifications(data || []);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to fetch notifications",
				variant: "destructive",
			});
		}
	};

	const setupRealtimeSubscription = () => {
		return supabase
			.channel('notifications_changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'notifications',
				},
				() => fetchNotifications()
			)
			.subscribe();

	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const { error } = await supabase
				.from('notifications')
				.insert([formData]);

			if (error) throw error;

			toast({
				title: "Success",
				description: "Notification created successfully",
			});
			
			setIsDialogOpen(false);
			setFormData({
				title: "",
				message: "",
				type: "system",
				user_id: "",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to create notification",
				variant: "destructive",
			});
		}

	};

	const handleDelete = async (id: string) => {
		try {
			const { error } = await supabase
				.from('notifications')
				.delete()
				.eq('id', id);

			if (error) throw error;

			toast({
				title: "Success",
				description: "Notification deleted successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete notification",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="container mx-auto p-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Notifications Management</CardTitle>
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button>Create Notification</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Create New Notification</DialogTitle>
							</DialogHeader>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<Label htmlFor="title">Title</Label>
									<Input
										id="title"
										value={formData.title}
										onChange={(e) =>
											setFormData({ ...formData, title: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="message">Message</Label>
									<Textarea
										id="message"
										value={formData.message}
										onChange={(e) =>
											setFormData({ ...formData, message: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="type">Type</Label>
									<Select
										value={formData.type}
										onValueChange={(value: "booking" | "system" | "update") =>
											setFormData({ ...formData, type: value })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="system">System</SelectItem>
											<SelectItem value="booking">Booking</SelectItem>
											<SelectItem value="update">Update</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label htmlFor="userId">User ID (optional)</Label>
									<Input
										id="userId"
										value={formData.user_id}
										onChange={(e) =>
											setFormData({ ...formData, user_id: e.target.value })
										}
									/>
								</div>
								<Button type="submit" className="w-full">
									Create Notification
								</Button>
							</form>
						</DialogContent>
					</Dialog>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Title</TableHead>
								<TableHead>Message</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>User</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{notifications.map((notification) => (
								<TableRow key={notification.id}>
									<TableCell>{notification.title}</TableCell>
									<TableCell>{notification.message}</TableCell>
									<TableCell>{notification.type}</TableCell>
									<TableCell>{(notification as any).profiles?.username || 'All Users'}</TableCell>
									<TableCell>{new Date(notification.created_at).toLocaleDateString()}</TableCell>
									<TableCell>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => handleDelete(notification.id)}
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

export default withAuth(NotificationsManagement, true);