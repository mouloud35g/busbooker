import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
	const faqs = [
		{
			question: "Comment réserver un billet de bus ?",
			answer: "Pour réserver un billet, il suffit de sélectionner votre ville de départ et d'arrivée, choisir la date de voyage, sélectionner le bus qui vous convient et procéder au paiement. Vous recevrez une confirmation par email."
		},
		{
			question: "Puis-je annuler ma réservation ?",
			answer: "Oui, vous pouvez annuler votre réservation jusqu'à 24 heures avant le départ. Des frais d'annulation peuvent s'appliquer selon les conditions de la compagnie de bus."
		},
		{
			question: "Comment choisir mon siège ?",
			answer: "Lors de la réservation, vous aurez accès à un plan du bus où vous pourrez sélectionner votre siège préféré parmi ceux disponibles."
		},
		{
			question: "Quels modes de paiement acceptez-vous ?",
			answer: "Nous acceptons les cartes bancaires, CCP, et Baridi Mob pour le paiement des billets."
		},
		{
			question: "Que faire si je perds mon billet ?",
			answer: "Ne vous inquiétez pas ! Vous pouvez retrouver votre billet dans votre espace personnel ou dans l'email de confirmation qui vous a été envoyé."
		},
		{
			question: "Y a-t-il une limite de bagages ?",
			answer: "La limite de bagages dépend de la compagnie de bus. En général, vous avez droit à un bagage en soute et un bagage à main. Consultez les conditions spécifiques de votre voyage lors de la réservation."
		}
	]

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-4xl font-bold mb-8 text-center">Questions Fréquentes</h1>
			
			<div className="max-w-3xl mx-auto">
				<Accordion type="single" collapsible className="space-y-4">
					{faqs.map((faq, index) => (
						<AccordionItem key={index} value={`item-${index}`}>
							<AccordionTrigger className="text-left">
								{faq.question}
							</AccordionTrigger>
							<AccordionContent>
								{faq.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	)
}