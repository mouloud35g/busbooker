import { Link } from "react-router-dom";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="w-full border-t bg-background">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<h3 className="font-semibold mb-4">BusBooker</h3>
						<p className="text-sm text-muted-foreground">
							La solution simple et rapide pour réserver vos billets de bus en Algérie.
						</p>
					</div>
					
					<div>
						<h3 className="font-semibold mb-4">Navigation</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
									Accueil
								</Link>
							</li>
							<li>
								<Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
									À propos
								</Link>
							</li>
							<li>
								<Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
									Contact
								</Link>
							</li>
							<li>
								<Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
									FAQ
								</Link>
							</li>
						</ul>
					</div>
					
					<div>
						<h3 className="font-semibold mb-4">Légal</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
									Conditions d'utilisation
								</Link>
							</li>
							<li>
								<Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
									Politique de confidentialité
								</Link>
							</li>
						</ul>
					</div>
					
					<div>
						<h3 className="font-semibold mb-4">Contact</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>Email: contact@busbooker.dz</li>
							<li>Tél: +213 XX XX XX XX</li>
							<li>Adresse: Alger, Algérie</li>
						</ul>
					</div>
				</div>
				
				<div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
					<p>&copy; {currentYear} BusBooker. Tous droits réservés.</p>
				</div>
			</div>
		</footer>
	);
}