import { useState, useEffect } from '@wordpress/element';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const toolComponents = {
	gradient: () => <div className="mlc-wdt-placeholder"><h2>CSS Gradient Generator</h2><p>Coming soon...</p></div>,
	'box-shadow': () => <div className="mlc-wdt-placeholder"><h2>Box Shadow Generator</h2><p>Coming soon...</p></div>,
	schema: () => <div className="mlc-wdt-placeholder"><h2>Schema.org Generator</h2><p>Coming soon...</p></div>,
	qrcode: () => <div className="mlc-wdt-placeholder"><h2>QR Code Generator</h2><p>Coming soon...</p></div>,
	'color-converter': () => <div className="mlc-wdt-placeholder"><h2>Color Converter</h2><p>Coming soon...</p></div>,
	'contrast-checker': () => <div className="mlc-wdt-placeholder"><h2>Contrast Checker</h2><p>Coming soon...</p></div>,
	palette: () => <div className="mlc-wdt-placeholder"><h2>Palette Generator</h2><p>Coming soon...</p></div>,
};

export default function App() {
	const getInitialTool = () => {
		const hash = window.location.hash.replace( '#', '' );
		return hash && toolComponents[ hash ] ? hash : 'gradient';
	};

	const [ currentTool, setCurrentTool ] = useState( getInitialTool );

	useEffect( () => {
		window.location.hash = currentTool;
	}, [ currentTool ] );

	useEffect( () => {
		const handleHashChange = () => {
			const hash = window.location.hash.replace( '#', '' );
			if ( hash && toolComponents[ hash ] ) {
				setCurrentTool( hash );
			}
		};
		window.addEventListener( 'hashchange', handleHashChange );
		return () => window.removeEventListener( 'hashchange', handleHashChange );
	}, [] );

	const ToolComponent = toolComponents[ currentTool ];

	return (
		<div className="mlc-wdt">
			<Header />
			<div className="mlc-wdt-layout">
				<Sidebar
					currentTool={ currentTool }
					onToolChange={ setCurrentTool }
				/>
				<main className="mlc-wdt-content">
					{ ToolComponent && <ToolComponent /> }
				</main>
			</div>
		</div>
	);
}
