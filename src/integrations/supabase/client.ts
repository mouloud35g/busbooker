import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cjbotvlfgmkewcnwmmdr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYm90dmxmZ21rZXdjbndtbWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwNDkxOTgsImV4cCI6MjA1NDYyNTE5OH0.z0EXjgdh4GDCqi9rB6gAXJ_5gBa-R6YtukieB48WbmI";

export const supabase = createClient<Database>(
	SUPABASE_URL, 
	SUPABASE_PUBLISHABLE_KEY,
	{
		auth: {
			persistSession: true,
			autoRefreshToken: true,
		},
		realtime: {
			params: {
				eventsPerSecond: 10
			}
		}
	}
);