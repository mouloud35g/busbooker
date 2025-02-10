import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RootLayout } from "@/components/layouts/root-layout";

const PrivacyPage = () => {
	return (
		<RootLayout>
			<div className="container mx-auto p-4">
				<Card>
					<CardHeader>
						<CardTitle>Politique de Confidentialité</CardTitle>
					</CardHeader>
					<CardContent className="prose max-w-none">
						<h2>1. Collecte des Informations</h2>
						<p>
							Nous collectons les informations suivantes lorsque vous utilisez BusBooker :
						</p>
						<ul>
							<li>Informations personnelles (nom, email, numéro de téléphone)</li>
							<li>Informations de réservation</li>
							<li>Données de connexion et d'utilisation</li>
						</ul>

						<h2>2. Utilisation des Informations</h2>
						<p>
							Nous utilisons vos informations pour :
						</p>
						<ul>
							<li>Gérer vos réservations</li>
							<li>Vous contacter concernant vos voyages</li>
							<li>Améliorer nos services</li>
							<li>Assurer la sécurité de votre compte</li>
						</ul>

						<h2>3. Protection des Données</h2>
						<p>
							Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles contre tout accès non autorisé, modification, divulgation ou destruction.
						</p>

						<h2>4. Partage des Informations</h2>
						<p>
							Nous ne partageons vos informations qu'avec :
						</p>
						<ul>
							<li>Les compagnies de bus pour vos réservations</li>
							<li>Nos prestataires de services sécurisés</li>
							<li>Les autorités si requis par la loi</li>
						</ul>

						<h2>5. Vos Droits</h2>
						<p>
							Vous avez le droit de :
						</p>
						<ul>
							<li>Accéder à vos données personnelles</li>
							<li>Corriger vos informations</li>
							<li>Supprimer votre compte</li>
							<li>Retirer votre consentement</li>
						</ul>

						<h2>6. Cookies</h2>
						<p>
							Nous utilisons des cookies pour améliorer votre expérience sur notre site. Vous pouvez contrôler les cookies via les paramètres de votre navigateur.
						</p>

						<h2>7. Contact</h2>
						<p>
							Pour toute question concernant notre politique de confidentialité, contactez-nous à privacy@busbooker.dz
						</p>
					</CardContent>
				</Card>
			</div>
		</RootLayout>
	);
};

export default PrivacyPage;