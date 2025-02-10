import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Notification {
	id: string;
	title: string;
	message: string;
	type: string;
	read: boolean;
	created_at: string;
}

export function NotificationsPopover() {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		fetchNotifications();
		const subscription = setupRealtimeSubscription();
		return () => {
			subscription.unsubscribe();
		};
	}, []);

	useEffect(() => {
		setUnreadCount(notifications.filter(n => !n.read).length);
	}, [notifications]);

	const fetchNotifications = async () => {
		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) return;

			const { data } = await supabase
				.from('notifications')
				.select('*')
				.eq('user_id', user.id)
				.order('created_at', { ascending: false })
				.limit(10);

			setNotifications(data || []);
		} catch (error) {
			console.error('Error fetching notifications:', error);
		}
	};

	const setupRealtimeSubscription = () => {
		return supabase
			.channel('notifications_changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'notifications',
				},
				() => fetchNotifications()
			)
			.subscribe();
	};

	const markAsRead = async (id: string) => {
		try {
			const { error } = await supabase
				.from('notifications')
				.update({ read: true })
				.eq('id', id);

			if (error) throw error;
			
			setNotifications(notifications.map(n => 
				n.id === id ? { ...n, read: true } : n
			));
		} catch (error) {
			console.error('Error marking notification as read:', error);
		}
	};

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case 'booking':
				return '🎫';
			case 'system':
				return '🔔';
			case 'update':
				return '📝';
			default:
				return '📌';
		}
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<Bell className="h-5 w-5" />
					{unreadCount > 0 && (
						<Badge 
							variant="destructive" 
							className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
						>
							{unreadCount}
						</Badge>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80 p-0">
				<div className="p-4 border-b">
					<h4 className="font-semibold">Notifications</h4>
				</div>
				<ScrollArea className="h-[300px]">
					{notifications.length > 0 ? (
						<div className="divide-y">
							{notifications.map((notification) => (
								<div
									key={notification.id}
									className={`p-4 cursor-pointer hover:bg-gray-50 ${
										!notification.read ? 'bg-gray-50' : ''
									}`}
									onClick={() => markAsRead(notification.id)}
								>
									<div className="flex items-start gap-3">
										<span className="text-xl">
											{getNotificationIcon(notification.type)}
										</span>
										<div className="flex-1 space-y-1">
											<p className="text-sm font-medium leading-none">
												{notification.title}
											</p>
											<p className="text-sm text-gray-500">
												{notification.message}
											</p>
											<p className="text-xs text-gray-400">
												{format(new Date(notification.created_at), "Pp", { locale: fr })}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="p-4 text-center text-sm text-gray-500">
							Aucune notification
						</div>
					)}
				</ScrollArea>
			</PopoverContent>
		</Popover>
	);
}