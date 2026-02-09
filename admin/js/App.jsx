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
import LoremIpsumGenerator from './tools/LoremIpsumGenerator';
import EncoderDecoder from './tools/EncoderDecoder';

const Placeholder = ( { title } ) => (
	<div className="mlc-wdt-placeholder"><h2>{ title }</h2><p>Coming soon...</p></div>
);

const toolComponents = {
	// CSS Tools
	gradient: GradientGenerator,
	'box-shadow': BoxShadowGenerator,
	border: BorderGenerator,
	'border-radius': BorderRadiusGenerator,
	flexbox: () => <Placeholder title="Flexbox Generator" />,
	grid: () => <Placeholder title="CSS Grid Generator" />,
	'clip-path': () => <Placeholder title="Clip-Path Maker" />,
	// Color
	'color-converter': ColorConverter,
	'contrast-checker': ContrastChecker,
	palette: () => <Placeholder title="Palette Generator" />,
	// Code Tools
	formatter: () => <Placeholder title="Code Formatter" />,
	encoder: EncoderDecoder,
	diff: () => <Placeholder title="Diff Checker" />,
	'string-utils': () => <Placeholder title="String Utilities" />,
	// Generators
	qrcode: QRCodeGenerator,
	'placeholder-image': PlaceholderImageGenerator,
	'lorem-ipsum': LoremIpsumGenerator,
	table: () => <Placeholder title="HTML Table Generator" />,
	'test-data': () => <Placeholder title="Test Data Generator" />,
	// SEO & Meta
	'meta-tags': () => <Placeholder title="Meta Tag Generator" />,
	schema: () => <Placeholder title="Schema.org Generator" />,
	// Converters
	'svg-to-png': () => <Placeholder title="SVG to PNG Converter" />,
	'html-to-markdown': () => <Placeholder title="HTML to Markdown" />,
	'markdown-preview': () => <Placeholder title="Markdown Preview" />,
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
