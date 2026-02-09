import { useState, useRef, useCallback } from '@wordpress/element';
import ToolCard from '../components/ToolCard';

export default function SvgToPng() {
	const canvasRef = useRef( null );
	const [ svgInput, setSvgInput ] = useState( '' );
	const [ scale, setScale ] = useState( 1 );
	const [ dimensions, setDimensions ] = useState( null );
	const [ error, setError ] = useState( '' );
	const [ rendered, setRendered ] = useState( false );

	const handleFileUpload = useCallback( ( e ) => {
		const file = e.target.files?.[ 0 ];
		if ( ! file ) return;
		const reader = new FileReader();
		reader.onload = ( ev ) => {
			setSvgInput( ev.target.result );
			setError( '' );
		};
		reader.readAsText( file );
	}, [] );

	const renderSvg = useCallback( () => {
		if ( ! svgInput.trim() ) return;

		setError( '' );
		setRendered( false );

		// Parse SVG to get dimensions.
		const parser = new DOMParser();
		const doc = parser.parseFromString( svgInput, 'image/svg+xml' );
		const svgEl = doc.querySelector( 'svg' );

		if ( ! svgEl ) {
			setError( 'No valid <svg> element found in input.' );
			return;
		}

		let w = parseFloat( svgEl.getAttribute( 'width' ) ) || 0;
		let h = parseFloat( svgEl.getAttribute( 'height' ) ) || 0;

		if ( ( ! w || ! h ) && svgEl.getAttribute( 'viewBox' ) ) {
			const vb = svgEl.getAttribute( 'viewBox' ).split( /[\s,]+/ );
			w = parseFloat( vb[ 2 ] ) || 300;
			h = parseFloat( vb[ 3 ] ) || 150;
		}

		if ( ! w ) w = 300;
		if ( ! h ) h = 150;

		setDimensions( { w, h } );

		const canvas = canvasRef.current;
		const scaledW = Math.round( w * scale );
		const scaledH = Math.round( h * scale );
		canvas.width = scaledW;
		canvas.height = scaledH;

		const ctx = canvas.getContext( '2d' );
		const img = new Image();
		const blob = new Blob( [ svgInput ], { type: 'image/svg+xml;charset=utf-8' } );
		const url = URL.createObjectURL( blob );

		img.onload = () => {
			ctx.clearRect( 0, 0, scaledW, scaledH );
			ctx.drawImage( img, 0, 0, scaledW, scaledH );
			URL.revokeObjectURL( url );
			setRendered( true );
		};

		img.onerror = () => {
			setError( 'Failed to render SVG. Check for syntax errors.' );
			URL.revokeObjectURL( url );
		};

		img.src = url;
	}, [ svgInput, scale ] );

	const downloadPNG = useCallback( () => {
		const canvas = canvasRef.current;
		if ( ! canvas || ! rendered ) return;
		const link = document.createElement( 'a' );
		link.download = `converted-${ Math.round( ( dimensions?.w || 300 ) * scale ) }x${ Math.round( ( dimensions?.h || 150 ) * scale ) }.png`;
		link.href = canvas.toDataURL( 'image/png' );
		link.click();
	}, [ rendered, scale, dimensions ] );

	const preview = (
		<div className="mlc-wdt-svg-preview">
			<canvas
				ref={ canvasRef }
				style={ {
					maxWidth: '100%',
					display: rendered ? 'block' : 'none',
					border: '1px solid var(--mlc-border)',
					borderRadius: '4px',
				} }
			/>
			{ ! rendered && ! error && (
				<div className="mlc-wdt-svg-empty">
					Paste SVG code or upload a file, then click "Convert to PNG"
				</div>
			) }
			{ error && (
				<div className="mlc-wdt-svg-error">{ error }</div>
			) }
		</div>
	);

	const controls = (
		<div className="mlc-wdt-svg-controls">
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Upload SVG File</label>
				<input
					type="file"
					accept=".svg"
					onChange={ handleFileUpload }
					className="mlc-wdt-file-input"
				/>
			</div>

			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Or Paste SVG Code</label>
				<textarea
					className="mlc-wdt-textarea"
					rows="8"
					value={ svgInput }
					onChange={ ( e ) => { setSvgInput( e.target.value ); setError( '' ); } }
					placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">...</svg>'
				/>
			</div>

			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">
					Scale: { scale }x
					{ dimensions && ` (${ Math.round( dimensions.w * scale ) } x ${ Math.round( dimensions.h * scale ) }px)` }
				</label>
				<div className="mlc-wdt-range-with-value">
					<input
						type="range"
						className="mlc-wdt-range"
						min="0.5"
						max="8"
						step="0.5"
						value={ scale }
						onChange={ ( e ) => setScale( Number( e.target.value ) ) }
					/>
					<span className="mlc-wdt-field-value">{ scale }x</span>
				</div>
			</div>

			<div className="mlc-wdt-qr-download-row">
				<button className="mlc-wdt-download-btn" onClick={ renderSvg }>
					Convert to PNG
				</button>
				{ rendered && (
					<button className="mlc-wdt-download-btn mlc-wdt-download-btn-outline" onClick={ downloadPNG }>
						Download PNG
					</button>
				) }
			</div>
		</div>
	);

	return (
		<ToolCard
			title="SVG to PNG Converter"
			help="Convert SVG files or code to PNG images at any scale. Upload an SVG file or paste SVG markup, choose your output scale, and download as PNG."
			preview={ preview }
			controls={ controls }
		/>
	);
}
