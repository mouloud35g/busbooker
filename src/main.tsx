import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Import des styles
import './index.css';

// Supprimer les styles par défaut
import './App.css';

const root = document.getElementById('root');

if (!root) {
	throw new Error('Root element not found');
}

createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>
);
