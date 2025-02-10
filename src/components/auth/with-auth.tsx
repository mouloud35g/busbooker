import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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
						navigate('/auth');
						return;
					}

					if (requireAdmin) {
						const { data: isAdmin } = await supabase.rpc('is_admin', {
							user_id: session.user.id
						});

						if (!isAdmin) {
							navigate('/');
							return;
						}
					}

					setIsAuthorized(true);
				} catch (error) {
					console.error('Auth check failed:', error);
					navigate('/auth');
				} finally {
					setIsLoading(false);
				}
			};

			checkAuth();
		}, [navigate]);

		if (isLoading) {
			return (
				<div className="flex items-center justify-center min-h-screen">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
				</div>
			);
		}

		if (!isAuthorized) {
			return null;
		}

		return <WrappedComponent {...props} />;
	};
}