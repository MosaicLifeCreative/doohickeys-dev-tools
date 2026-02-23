import { useState, useEffect } from '@wordpress/element';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GradientGenerator from './tools/GradientGenerator';
import BoxShadowGenerator from './tools/BoxShadowGenerator';
import BorderGenerator from './tools/BorderGenerator';
import BorderRadiusGenerator from './tools/BorderRadiusGenerator';
import ClipPathMaker from './tools/ClipPathMaker';
import QRCodeGenerator from './tools/QRCodeGenerator';
import ContrastChecker from './tools/ContrastChecker';
import ColorConverter from './tools/ColorConverter';
import PlaceholderImageGenerator from './tools/PlaceholderImageGenerator';
import LoremIpsumGenerator from './tools/LoremIpsumGenerator';
import EncoderDecoder from './tools/EncoderDecoder';
import CodeFormatter from './tools/CodeFormatter';
import StringUtilities from './tools/StringUtilities';
import DiffChecker from './tools/DiffChecker';
import HtmlToMarkdown from './tools/HtmlToMarkdown';
import MarkdownPreview from './tools/MarkdownPreview';
import SvgToPng from './tools/SvgToPng';
import TestDataGenerator from './tools/TestDataGenerator';
import TableGenerator from './tools/TableGenerator';
import SchemaGenerator from './tools/SchemaGenerator';
import MetaTagGenerator from './tools/MetaTagGenerator';
import PaletteGenerator from './tools/PaletteGenerator';
import FlexboxGenerator from './tools/FlexboxGenerator';
import GridGenerator from './tools/GridGenerator';
import AspectRatioCalculator from './tools/AspectRatioCalculator';

const toolComponents = {
	// CSS Tools
	gradient: GradientGenerator,
	'box-shadow': BoxShadowGenerator,
	border: BorderGenerator,
	'border-radius': BorderRadiusGenerator,
	flexbox: FlexboxGenerator,
	grid: GridGenerator,
	'clip-path': ClipPathMaker,
	// Color
	'color-converter': ColorConverter,
	'contrast-checker': ContrastChecker,
	palette: PaletteGenerator,
	// Code Tools
	formatter: CodeFormatter,
	encoder: EncoderDecoder,
	diff: DiffChecker,
	'string-utils': StringUtilities,
	// Generators
	qrcode: QRCodeGenerator,
	'placeholder-image': PlaceholderImageGenerator,
	'lorem-ipsum': LoremIpsumGenerator,
	table: TableGenerator,
	'test-data': TestDataGenerator,
	// SEO & Meta
	'meta-tags': MetaTagGenerator,
	schema: SchemaGenerator,
	// Converters
	'svg-to-png': SvgToPng,
	'html-to-markdown': HtmlToMarkdown,
	'markdown-preview': MarkdownPreview,
	'aspect-ratio': AspectRatioCalculator,
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
		<div className="dkdt">
			<Header />
			<div className="dkdt-layout">
				<Sidebar
					currentTool={ currentTool }
					onToolChange={ setCurrentTool }
				/>
				<main className="dkdt-content">
					{ ToolComponent && <ToolComponent /> }
				</main>
			</div>
		</div>
	);
}
