import { createRoot } from '@wordpress/element';
import { ProProvider } from './context/ProContext';
import App from './App';
import '../css/admin.css';

const container = document.getElementById( 'dkdt-app' );
if ( container ) {
	const root = createRoot( container );
	root.render(
		<ProProvider>
			<App />
		</ProProvider>
	);
}
