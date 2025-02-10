import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
	return (
		<div className="container mx-auto py-8">
			<h1 className="text-4xl font-bold mb-8 text-center">Conditions d'Utilisation</h1>
			
			<div className="space-y-6 max-w-4xl mx-auto">
				<Card>
					<CardHeader>
						<CardTitle>1. Acceptation des conditions</CardTitle>
					</CardHeader>
					<CardContent>
						<p>En utilisant BusBooker, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>2. Réservations et paiements</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="list-disc pl-4 space-y-2">
							<li>Les réservations sont soumises à disponibilité</li>
							<li>Les prix sont en dinars algériens et incluent toutes les taxes applicables</li>
							<li>Le paiement doit être effectué au moment de la réservation</li>
							<li>Nous nous réservons le droit de modifier les prix à tout moment</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>3. Annulations et remboursements</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="list-disc pl-4 space-y-2">
							<li>Les annulations sont possibles jusqu'à 24h avant le départ</li>
							<li>Des frais d'annulation peuvent s'appliquer selon la politique de la compagnie</li>
							<li>Les remboursements sont traités dans un délai de 5 à 10 jours ouvrables</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>4. Responsabilités</CardTitle>
					</CardHeader>
					<CardContent>
						<p>BusBooker agit en tant qu'intermédiaire entre les voyageurs et les compagnies de bus. Nous ne sommes pas responsables des retards, annulations ou autres problèmes liés au service de transport.</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>5. Protection des données</CardTitle>
					</CardHeader>
					<CardContent>
						<p>Nous nous engageons à protéger vos données personnelles conformément à la réglementation en vigueur. Pour plus d'informations, consultez notre politique de confidentialité.</p>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}