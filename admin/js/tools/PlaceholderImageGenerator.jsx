import { useState, useRef, useCallback, useEffect } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import ColorPicker from '../components/ColorPicker';

export default function PlaceholderImageGenerator() {
	const canvasRef = useRef( null );
	const [ width, setWidth ] = useState( 800 );
	const [ height, setHeight ] = useState( 400 );
	const [ bgColor, setBgColor ] = useState( '#cccccc' );
	const [ textColor, setTextColor ] = useState( '#666666' );
	const [ customText, setCustomText ] = useState( '' );
	const [ fontSize, setFontSize ] = useState( 0 ); // 0 = auto

	const displayText = customText || `${ width } \u00D7 ${ height }`;
	const autoFontSize = fontSize > 0 ? fontSize : Math.max( 12, Math.min( 72, Math.floor( Math.min( width, height ) / 8 ) ) );

	const drawCanvas = useCallback( () => {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;

		// Set drawing size.
		canvas.width = width;
		canvas.height = height;

		const ctx = canvas.getContext( '2d' );

		// Background.
		ctx.fillStyle = bgColor;
		ctx.fillRect( 0, 0, width, height );

		// Text.
		ctx.fillStyle = textColor;
		ctx.font = `${ autoFontSize }px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText( displayText, width / 2, height / 2 );
	}, [ width, height, bgColor, textColor, displayText, autoFontSize ] );

	useEffect( () => {
		drawCanvas();
	}, [ drawCanvas ] );

	const downloadPNG = useCallback( () => {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;
		const link = document.createElement( 'a' );
		link.download = `placeholder-${ width }x${ height }.png`;
		link.href = canvas.toDataURL( 'image/png' );
		link.click();
	}, [ width, height ] );

	const downloadSVG = useCallback( () => {
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ width }" height="${ height }">
	<rect width="100%" height="100%" fill="${ bgColor }"/>
	<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
		fill="${ textColor }" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif"
		font-size="${ autoFontSize }">${ displayText }</text>
</svg>`;
		const blob = new Blob( [ svg ], { type: 'image/svg+xml' } );
		const link = document.createElement( 'a' );
		link.download = `placeholder-${ width }x${ height }.svg`;
		link.href = URL.createObjectURL( blob );
		link.click();
		URL.revokeObjectURL( link.href );
	}, [ width, height, bgColor, textColor, displayText, autoFontSize ] );

	// Scale canvas display so it fits the preview area.
	const maxDisplayW = 600;
	const maxDisplayH = 300;
	const scale = Math.min( 1, maxDisplayW / width, maxDisplayH / height );
	const displayW = Math.round( width * scale );
	const displayH = Math.round( height * scale );

	const preview = (
		<div className="mlc-wdt-placeholder-preview">
			<canvas
				ref={ canvasRef }
				style={ { width: `${ displayW }px`, height: `${ displayH }px` } }
				className="mlc-wdt-placeholder-canvas"
			/>
		</div>
	);

	const upgradeUrl = window.mlcWdtData?.upgradeUrl;

	const controls = (
		<div className="mlc-wdt-placeholder-controls">
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Dimensions</label>
				<div className="mlc-wdt-placeholder-dims">
					<div className="mlc-wdt-placeholder-dim">
						<label className="mlc-wdt-range-label">Width (px)</label>
						<input
							type="number"
							className="mlc-wdt-text-input"
							value={ width }
							min="1"
							max="4096"
							onChange={ ( e ) => setWidth( Math.max( 1, Math.min( 4096, Number( e.target.value ) || 1 ) ) ) }
						/>
					</div>
					<span className="mlc-wdt-placeholder-x">&times;</span>
					<div className="mlc-wdt-placeholder-dim">
						<label className="mlc-wdt-range-label">Height (px)</label>
						<input
							type="number"
							className="mlc-wdt-text-input"
							value={ height }
							min="1"
							max="4096"
							onChange={ ( e ) => setHeight( Math.max( 1, Math.min( 4096, Number( e.target.value ) || 1 ) ) ) }
						/>
					</div>
				</div>
			</div>

			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Colors</label>
				<div className="mlc-wdt-color-row">
					<ColorPicker color={ bgColor } onChange={ setBgColor } label="Background" />
					<ColorPicker color={ textColor } onChange={ setTextColor } label="Text" />
				</div>
			</div>

			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Custom Text</label>
				<input
					type="text"
					className="mlc-wdt-text-input"
					value={ customText }
					onChange={ ( e ) => setCustomText( e.target.value ) }
					placeholder={ `${ width } \u00D7 ${ height }` }
				/>
			</div>

			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">
					Font Size { fontSize > 0 ? `(${ fontSize }px)` : '(Auto)' }
				</label>
				<div className="mlc-wdt-range-with-value">
					<input
						type="range"
						className="mlc-wdt-range"
						min="0"
						max="200"
						value={ fontSize }
						onChange={ ( e ) => setFontSize( Number( e.target.value ) ) }
					/>
					<span className="mlc-wdt-field-value">
						{ fontSize > 0 ? `${ fontSize }px` : 'Auto' }
					</span>
				</div>
				<p className="mlc-wdt-tip">Set to 0 for automatic sizing based on dimensions</p>
			</div>

			<div className="mlc-wdt-pro-inline-note">
				<span className="mlc-wdt-pro-badge-inline">Pro</span>
				Social media preset sizes and inline Data URI export available in Pro.
				{ upgradeUrl && <a href={ upgradeUrl } className="mlc-wdt-pro-inline-link">Upgrade</a> }
			</div>
		</div>
	);

	const output = (
		<div>
			<div className="mlc-wdt-section-label">Download</div>
			<div className="mlc-wdt-qr-download-row">
				<button className="mlc-wdt-download-btn" onClick={ downloadPNG }>
					Download PNG
				</button>
				<button className="mlc-wdt-download-btn mlc-wdt-download-btn-outline" onClick={ downloadSVG }>
					Download SVG
				</button>
			</div>
		</div>
	);

	return (
		<ToolCard
			title="Placeholder Image Generator"
			help="Generate placeholder images for mockups and development. Set custom dimensions, colors, and text. Download as PNG or SVG. Social media presets available in Pro."
			preview={ preview }
			controls={ controls }
			output={ output }
		/>
	);
}
