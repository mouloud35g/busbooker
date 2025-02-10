import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";

interface RootLayoutProps {
	children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
	return (
		<div className="min-h-screen flex flex-col bg-background antialiased">
			<Navigation />
			<main className="flex-1 flex flex-col bg-gradient-to-b from-sage-50 to-white">
				{children}
			</main>
			<Footer />
		</div>
	);
}