import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
	return (
		<div className="container mx-auto py-8">
			<h1 className="text-4xl font-bold mb-8 text-center">À propos de BusBooker</h1>
			
			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Notre Mission</CardTitle>
					</CardHeader>
					<CardContent>
						<p>BusBooker simplifie la réservation de bus en Algérie. Notre plateforme permet aux voyageurs de réserver facilement leurs billets de bus en ligne, en offrant une expérience utilisateur fluide et sécurisée.</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Nos Valeurs</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="list-disc pl-4 space-y-2">
							<li>Simplicité et facilité d'utilisation</li>
							<li>Service client de qualité</li>
							<li>Sécurité et fiabilité</li>
							<li>Innovation continue</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Nos Services</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="list-disc pl-4 space-y-2">
							<li>Réservation de billets en ligne</li>
							<li>Choix de sièges</li>
							<li>Gestion des réservations</li>
							<li>Support client 24/7</li>
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Notre Engagement</CardTitle>
					</CardHeader>
					<CardContent>
						<p>Nous nous engageons à fournir un service de qualité supérieure, en collaborant avec les meilleures compagnies de bus pour offrir des voyages confortables et sûrs à nos clients.</p>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}