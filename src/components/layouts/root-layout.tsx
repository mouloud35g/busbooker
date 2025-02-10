import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";

interface RootLayoutProps {
	children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
	return (
		<div className="min-h-screen flex flex-col bg-background">
			<Navigation />
			<main className="flex-1 flex flex-col">
				{children}
			</main>
			<Footer />
		</div>
	);
}