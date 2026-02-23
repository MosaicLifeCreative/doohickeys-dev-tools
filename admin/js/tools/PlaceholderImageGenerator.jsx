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
		<div className="dkdt-placeholder-preview">
			<canvas
				ref={ canvasRef }
				style={ { width: `${ displayW }px`, height: `${ displayH }px` } }
				className="dkdt-placeholder-canvas"
			/>
		</div>
	);

	const upgradeUrl = window.dkdtData?.upgradeUrl;

	const controls = (
		<div className="dkdt-placeholder-controls">
			<div className="dkdt-control-group">
				<label className="dkdt-control-label">Dimensions</label>
				<div className="dkdt-placeholder-dims">
					<div className="dkdt-placeholder-dim">
						<label className="dkdt-range-label">Width (px)</label>
						<input
							type="number"
							className="dkdt-text-input"
							value={ width }
							min="1"
							max="4096"
							onChange={ ( e ) => setWidth( Math.max( 1, Math.min( 4096, Number( e.target.value ) || 1 ) ) ) }
						/>
					</div>
					<span className="dkdt-placeholder-x">&times;</span>
					<div className="dkdt-placeholder-dim">
						<label className="dkdt-range-label">Height (px)</label>
						<input
							type="number"
							className="dkdt-text-input"
							value={ height }
							min="1"
							max="4096"
							onChange={ ( e ) => setHeight( Math.max( 1, Math.min( 4096, Number( e.target.value ) || 1 ) ) ) }
						/>
					</div>
				</div>
			</div>

			<div className="dkdt-control-group">
				<label className="dkdt-control-label">Colors</label>
				<div className="dkdt-color-row">
					<ColorPicker color={ bgColor } onChange={ setBgColor } label="Background" />
					<ColorPicker color={ textColor } onChange={ setTextColor } label="Text" />
				</div>
			</div>

			<div className="dkdt-control-group">
				<label className="dkdt-control-label">Custom Text</label>
				<input
					type="text"
					className="dkdt-text-input"
					value={ customText }
					onChange={ ( e ) => setCustomText( e.target.value ) }
					placeholder={ `${ width } \u00D7 ${ height }` }
				/>
			</div>

			<div className="dkdt-control-group">
				<label className="dkdt-control-label">
					Font Size { fontSize > 0 ? `(${ fontSize }px)` : '(Auto)' }
				</label>
				<div className="dkdt-range-with-value">
					<input
						type="range"
						className="dkdt-range"
						min="0"
						max="200"
						value={ fontSize }
						onChange={ ( e ) => setFontSize( Number( e.target.value ) ) }
					/>
					<span className="dkdt-field-value">
						{ fontSize > 0 ? `${ fontSize }px` : 'Auto' }
					</span>
				</div>
				<p className="dkdt-tip">Set to 0 for automatic sizing based on dimensions</p>
			</div>

			<div className="dkdt-pro-inline-note">
				<span className="dkdt-pro-badge-inline">Pro</span>
				Social media preset sizes and inline Data URI export available in Pro.
				{ upgradeUrl && <a href={ upgradeUrl } className="dkdt-pro-inline-link">Upgrade</a> }
			</div>
		</div>
	);

	const output = (
		<div>
			<div className="dkdt-section-label">Download</div>
			<div className="dkdt-qr-download-row">
				<button className="dkdt-download-btn" onClick={ downloadPNG }>
					Download PNG
				</button>
				<button className="dkdt-download-btn dkdt-download-btn-outline" onClick={ downloadSVG }>
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
