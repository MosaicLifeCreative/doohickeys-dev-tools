import { useState, useEffect } from '@wordpress/element';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GradientGenerator from './tools/GradientGenerator';
import BoxShadowGenerator from './tools/BoxShadowGenerator';
import BorderGenerator from './tools/BorderGenerator';
import BorderRadiusGenerator from './tools/BorderRadiusGenerator';
import QRCodeGenerator from './tools/QRCodeGenerator';
import ContrastChecker from './tools/ContrastChecker';
import ColorConverter from './tools/ColorConverter';
import PlaceholderImageGenerator from './tools/PlaceholderImageGenerator';

const toolComponents = {
	gradient: GradientGenerator,
	'box-shadow': BoxShadowGenerator,
	border: BorderGenerator,
	'border-radius': BorderRadiusGenerator,
	'color-converter': ColorConverter,
	'contrast-checker': ContrastChecker,
	palette: () => <div className="mlc-wdt-placeholder"><h2>Palette Generator</h2><p>Coming soon...</p></div>,
	qrcode: QRCodeGenerator,
	'placeholder-image': PlaceholderImageGenerator,
	schema: () => <div className="mlc-wdt-placeholder"><h2>Schema.org Generator</h2><p>Coming soon...</p></div>,
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
