import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export default function ContactPage() {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		toast({
			title: "Message envoyé",
			description: "Nous vous répondrons dans les plus brefs délais.",
		})
	}

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-4xl font-bold mb-8 text-center">Contactez-nous</h1>
			
			<div className="max-w-2xl mx-auto">
				<Card>
					<CardHeader>
						<CardTitle>Formulaire de contact</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<Label htmlFor="name">Nom complet</Label>
								<Input id="name" placeholder="Votre nom" required />
							</div>
							
							<div>
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" placeholder="votre@email.com" required />
							</div>
							
							<div>
								<Label htmlFor="subject">Sujet</Label>
								<Input id="subject" placeholder="Sujet de votre message" required />
							</div>
							
							<div>
								<Label htmlFor="message">Message</Label>
								<Textarea 
									id="message" 
									placeholder="Votre message ici..." 
									className="min-h-[150px]"
									required 
								/>
							</div>
							
							<Button type="submit" className="w-full">
								Envoyer le message
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}