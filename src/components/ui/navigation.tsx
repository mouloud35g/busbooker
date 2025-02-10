import { Link } from "react-router-dom";
import { Button } from "./button";
import { NotificationsPopover } from "@/components/NotificationsPopover";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./dropdown-menu";

export function Navigation() {
	const [user, setUser] = useState<any>(null);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		checkUser();
	}, []);

	const checkUser = async () => {
		const { data: { user } } = await supabase.auth.getUser();
		if (user) {
			setUser(user);
			const { data: isAdmin } = await supabase.rpc('is_admin', {
				user_id: user.id
			});
			setIsAdmin(isAdmin);
		}
	};

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		window.location.href = '/';
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center gap-6 md:gap-10">
						<Link to="/" className="flex items-center space-x-2">
							<span className="text-xl font-bold">BusBooker</span>
						</Link>
						<nav className="hidden md:flex gap-6">
							<Link to="/about" className="text-sm font-medium transition-colors hover:text-primary">
								À propos
							</Link>
							<Link to="/contact" className="text-sm font-medium transition-colors hover:text-primary">
								Contact
							</Link>
							<Link to="/faq" className="text-sm font-medium transition-colors hover:text-primary">
								FAQ
							</Link>
						</nav>
					</div>
					
					<div className="flex items-center gap-4">
						{user ? (
							<>
								{isAdmin && (
									<Link to="/admin">
										<Button variant="ghost" size="sm">Admin</Button>
									</Link>
								)}
								<NotificationsPopover />
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" className="relative h-8 w-8 rounded-full">
											<Avatar className="h-8 w-8">
												<AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
												<AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
											</Avatar>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem asChild>
											<Link to="/profile" className="w-full">Mon Profil</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem onClick={handleSignOut}>
											Déconnexion
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</>
						) : (
							<Link to="/auth">
								<Button>Connexion</Button>
							</Link>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}