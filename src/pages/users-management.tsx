import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { withAuth } from "@/components/auth/with-auth";
import { AdminLayout } from "@/components/layouts/admin-layout";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

const UsersManagement = () => {
	const [users, setUsers] = useState<Profile[]>([]);
	const { toast } = useToast();

	useEffect(() => {
		fetchUsers();
		const subscription = setupRealtimeSubscription();
		return () => {
			subscription.unsubscribe();
		};
	}, []);

	const fetchUsers = async () => {
		try {
			const { data, error } = await supabase
				.from('profiles')
				.select('*')
				.order('created_at', { ascending: false });
			
			if (error) throw error;
			setUsers(data || []);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to fetch users",
				variant: "destructive",
			});
		}
	};

	const setupRealtimeSubscription = () => {
		return supabase
			.channel('profiles_changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'profiles',
				},
				() => fetchUsers()
			)
			.subscribe();
	};

	const toggleUserRole = async (userId: string, currentRole: string) => {
		try {
			const newRole = currentRole === 'admin' ? 'user' : 'admin';
			const { error } = await supabase
				.from('profiles')
				.update({ role: newRole })
				.eq('id', userId);

			if (error) throw error;

			toast({
				title: "Success",
				description: "User role updated successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update user role",
				variant: "destructive",
			});
		}
	};

	return (
		<AdminLayout>
			<div className="container mx-auto p-4">
				<Card>
					<CardHeader>
						<CardTitle>Users Management</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Username</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Phone</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.map((user) => (
									<TableRow key={user.id}>
										<TableCell>{user.username || 'N/A'}</TableCell>
										<TableCell>{user.id}</TableCell>
										<TableCell>{user.phone_number || 'N/A'}</TableCell>
										<TableCell>
											<Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
												{user.role}
											</Badge>
										</TableCell>
										<TableCell>
											<Button
												variant="outline"
												size="sm"
												onClick={() => toggleUserRole(user.id, user.role)}
											>
												Toggle Role
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

export default withAuth(UsersManagement, true);