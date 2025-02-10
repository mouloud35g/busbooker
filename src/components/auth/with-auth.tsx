
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from "sonner";

export function withAuth<P extends object>(
	WrappedComponent: React.ComponentType<P>,
	requireAdmin: boolean = false
) {
	return function WithAuthComponent(props: P) {
		const navigate = useNavigate();
		const [isLoading, setIsLoading] = useState(true);
		const [isAuthorized, setIsAuthorized] = useState(false);

		useEffect(() => {
			const checkAuth = async () => {
				try {
					const { data: { session } } = await supabase.auth.getSession();
					
					if (!session) {
						toast.error("Vous devez être connecté pour accéder à cette page");
						navigate('/auth');
						return;
					}

					if (requireAdmin) {
						const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin', {
							user_id: session.user.id
						});

						if (adminCheckError) {
							console.error('Error checking admin status:', adminCheckError);
							throw adminCheckError;
						}

						if (!isAdmin) {
							toast.error("Vous devez être administrateur pour accéder à cette page");
							navigate('/');
							return;
						}
					}

					setIsAuthorized(true);
				} catch (error) {
					console.error('Auth check failed:', error);
					toast.error("Une erreur est survenue lors de la vérification de vos droits");
					navigate('/auth');
				} finally {
					setIsLoading(false);
				}
			};

			checkAuth();

			// Set up auth state change listener
			const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
				if (!session) {
					setIsAuthorized(false);
					navigate('/auth');
				}
			});

			return () => {
				subscription.unsubscribe();
			};
		}, [navigate]);

		if (isLoading) {
			return <LoadingSpinner />;
		}

		if (!isAuthorized) {
			return null;
		}

		return <WrappedComponent {...props} />;
	};
}
