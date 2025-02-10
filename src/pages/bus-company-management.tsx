import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { withAuth } from "@/components/auth/with-auth";
import type { Database } from "@/integrations/supabase/types";

type BusCompany = Database['public']['Tables']['bus_companies']['Row'];

const BusCompanyManagement = () => {

	const [companies, setCompanies] = useState<BusCompany[]>([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		contact_email: "",
		contact_phone: "",
	});
	const { toast } = useToast();

	useEffect(() => {
		fetchCompanies();
		const subscription = setupRealtimeSubscription();
		return () => {
			subscription.unsubscribe();
		};
	}, []);

	const fetchCompanies = async () => {
		try {
			const { data, error } = await supabase
				.from('bus_companies')
				.select('*')
				.order('name');
			
			if (error) throw error;
			setCompanies(data || []);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to fetch bus companies",
				variant: "destructive",
			});
		}
	};

	const setupRealtimeSubscription = () => {
		return supabase
			.channel('bus_companies_changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'bus_companies',
				},
				() => fetchCompanies()
			)
			.subscribe();
	};


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const { error } = await supabase
				.from('bus_companies')
				.insert([formData]);

			if (error) throw error;

			toast({
				title: "Success",
				description: "Bus company created successfully",
			});
			
			setIsDialogOpen(false);
			setFormData({
				name: "",
				description: "",
				contact_email: "",
				contact_phone: "",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to create bus company",
				variant: "destructive",
			});
		}
	};

	const handleDelete = async (id: string) => {
		try {
			const { error } = await supabase
				.from('bus_companies')
				.delete()
				.eq('id', id);

			if (error) throw error;

			toast({
				title: "Success",
				description: "Bus company deleted successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete bus company",
				variant: "destructive",
			});
		}
	};


	return (
		<div className="container mx-auto p-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Bus Company Management</CardTitle>
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button>Add New Company</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add New Bus Company</DialogTitle>
							</DialogHeader>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<Label htmlFor="name">Company Name</Label>
									<Input
										id="name"
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="description">Description</Label>
									<Textarea
										id="description"
										value={formData.description}
										onChange={(e) =>
											setFormData({ ...formData, description: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="email">Contact Email</Label>
									<Input
										id="email"
										type="email"
										value={formData.contact_email}
										onChange={(e) =>
											setFormData({ ...formData, contact_email: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="phone">Contact Phone</Label>
									<Input
										id="phone"
										value={formData.contact_phone}
										onChange={(e) =>
											setFormData({ ...formData, contact_phone: e.target.value })
										}
										required
									/>
								</div>
								<Button type="submit" className="w-full">
									Create Company
								</Button>
							</form>
						</DialogContent>
					</Dialog>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Description</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Phone</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{companies.map((company) => (
								<TableRow key={company.id}>
									<TableCell>{company.name}</TableCell>
									<TableCell>{company.description}</TableCell>
									<TableCell>{company.contact_email}</TableCell>
									<TableCell>{company.contact_phone}</TableCell>
									<TableCell>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => handleDelete(company.id)}
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

export default withAuth(BusCompanyManagement, true);