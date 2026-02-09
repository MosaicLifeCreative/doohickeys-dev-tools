import { createRoot } from '@wordpress/element';
import App from './App';
import '../css/admin.css';

const container = document.getElementById( 'mlc-wdt-app' );
if ( container ) {
	const root = createRoot( container );
	root.render( <App /> );
}
