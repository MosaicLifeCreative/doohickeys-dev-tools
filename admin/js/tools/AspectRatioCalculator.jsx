import { useState, useMemo, useCallback } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CopyButton from '../components/CopyButton';

const COMMON_RATIOS = [
	{ label: '16:9', w: 16, h: 9 },
	{ label: '4:3', w: 4, h: 3 },
	{ label: '21:9', w: 21, h: 9 },
	{ label: '3:2', w: 3, h: 2 },
	{ label: '1:1', w: 1, h: 1 },
	{ label: '9:16', w: 9, h: 16 },
	{ label: '5:4', w: 5, h: 4 },
	{ label: '2:1', w: 2, h: 1 },
];

const PRESET_SIZES = {
	'16:9': [
		{ w: 640, h: 360, label: '360p' },
		{ w: 854, h: 480, label: '480p' },
		{ w: 1280, h: 720, label: '720p (HD)' },
		{ w: 1920, h: 1080, label: '1080p (Full HD)' },
		{ w: 2560, h: 1440, label: '1440p (2K)' },
		{ w: 3840, h: 2160, label: '4K (UHD)' },
	],
	'4:3': [
		{ w: 320, h: 240, label: 'QVGA' },
		{ w: 640, h: 480, label: 'VGA' },
		{ w: 800, h: 600, label: 'SVGA' },
		{ w: 1024, h: 768, label: 'XGA' },
		{ w: 1600, h: 1200, label: 'UXGA' },
		{ w: 2048, h: 1536, label: 'QXGA' },
	],
	'21:9': [
		{ w: 2560, h: 1080, label: 'UW-FHD' },
		{ w: 3440, h: 1440, label: 'UW-QHD' },
		{ w: 5120, h: 2160, label: 'UW-4K' },
	],
	'3:2': [
		{ w: 720, h: 480, label: 'NTSC DVD' },
		{ w: 1080, h: 720, label: '1080w' },
		{ w: 1440, h: 960, label: '1440w' },
		{ w: 2160, h: 1440, label: '2160w' },
	],
	'1:1': [
		{ w: 100, h: 100, label: 'Icon' },
		{ w: 400, h: 400, label: 'Thumbnail' },
		{ w: 1080, h: 1080, label: 'Instagram' },
		{ w: 2048, h: 2048, label: '2K Square' },
	],
	'9:16': [
		{ w: 360, h: 640, label: '360w' },
		{ w: 480, h: 854, label: '480w' },
		{ w: 720, h: 1280, label: 'HD Vertical' },
		{ w: 1080, h: 1920, label: 'FHD Vertical' },
	],
	'5:4': [
		{ w: 1280, h: 1024, label: 'SXGA' },
		{ w: 2560, h: 2048, label: 'QSXGA' },
	],
	'2:1': [
		{ w: 1000, h: 500, label: '1000w' },
		{ w: 2000, h: 1000, label: '2000w' },
		{ w: 4096, h: 2048, label: 'Equirectangular' },
	],
};

function gcd( a, b ) {
	a = Math.abs( Math.round( a ) );
	b = Math.abs( Math.round( b ) );
	while ( b ) {
		[ a, b ] = [ b, a % b ];
	}
	return a;
}

function simplifyRatio( w, h ) {
	if ( ! w || ! h ) return { rw: 0, rh: 0 };
	const d = gcd( w, h );
	return { rw: w / d, rh: h / d };
}

export default function AspectRatioCalculator() {
	const [ mode, setMode ] = useState( 'calculate' );

	// Calculate mode
	const [ calcWidth, setCalcWidth ] = useState( 1920 );
	const [ calcHeight, setCalcHeight ] = useState( 1080 );

	// Scale mode
	const [ selectedRatio, setSelectedRatio ] = useState( COMMON_RATIOS[ 0 ] );
	const [ scaleWidth, setScaleWidth ] = useState( 1920 );
	const [ locked, setLocked ] = useState( 'width' ); // which field drives the other

	const calculatedRatio = useMemo( () => {
		return simplifyRatio( calcWidth, calcHeight );
	}, [ calcWidth, calcHeight ] );

	const scaledHeight = useMemo( () => {
		return Math.round( scaleWidth * ( selectedRatio.h / selectedRatio.w ) );
	}, [ scaleWidth, selectedRatio ] );

	const handleScaleWidthChange = useCallback( ( w ) => {
		setScaleWidth( w );
		setLocked( 'width' );
	}, [] );

	const handleScaleHeightChange = useCallback( ( h ) => {
		const w = Math.round( h * ( selectedRatio.w / selectedRatio.h ) );
		setScaleWidth( w );
		setLocked( 'height' );
	}, [ selectedRatio ] );

	const handleSwapCalc = () => {
		setCalcWidth( calcHeight );
		setCalcHeight( calcWidth );
	};

	const handleSelectRatio = ( ratio ) => {
		setSelectedRatio( ratio );
		// Recalculate with current width
		setScaleWidth( scaleWidth );
	};

	const ratioKey = `${ selectedRatio.w }:${ selectedRatio.h }`;
	const presets = PRESET_SIZES[ ratioKey ] || [];

	// Preview box dimensions (max 280px wide or tall, proportional)
	const previewMax = 280;
	const previewRatio = mode === 'calculate'
		? ( calcWidth && calcHeight ? calcWidth / calcHeight : 1 )
		: selectedRatio.w / selectedRatio.h;
	const previewW = previewRatio >= 1 ? previewMax : Math.round( previewMax * previewRatio );
	const previewH = previewRatio >= 1 ? Math.round( previewMax / previewRatio ) : previewMax;

	const displayWidth = mode === 'calculate' ? calcWidth : scaleWidth;
	const displayHeight = mode === 'calculate' ? calcHeight : scaledHeight;
	const displayRatio = mode === 'calculate' ? calculatedRatio : { rw: selectedRatio.w, rh: selectedRatio.h };

	const preview = (
		<div className="mlc-wdt-ar-preview-wrap">
			<div
				className="mlc-wdt-ar-preview-box"
				style={ {
					width: `${ previewW }px`,
					height: `${ previewH }px`,
				} }
			>
				<span className="mlc-wdt-ar-preview-dims">
					{ displayWidth } &times; { displayHeight }
				</span>
				<span className="mlc-wdt-ar-preview-ratio">
					{ displayRatio.rw }:{ displayRatio.rh }
				</span>
			</div>
		</div>
	);

	const controls = (
		<div className="mlc-wdt-ar-controls">
			{ /* Mode toggle */ }
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Mode</label>
				<div className="mlc-wdt-flex-options">
					<button
						className={ `mlc-wdt-flex-option-btn${ mode === 'calculate' ? ' active' : '' }` }
						onClick={ () => setMode( 'calculate' ) }
					>
						Calculate Ratio
					</button>
					<button
						className={ `mlc-wdt-flex-option-btn${ mode === 'scale' ? ' active' : '' }` }
						onClick={ () => setMode( 'scale' ) }
					>
						Scale from Ratio
					</button>
				</div>
			</div>

			{ mode === 'calculate' ? (
				<>
					{ /* Dimension inputs */ }
					<div className="mlc-wdt-ar-dims">
						<div className="mlc-wdt-control-group">
							<label className="mlc-wdt-control-label">Width</label>
							<input
								type="number"
								className="mlc-wdt-text-input"
								min="1"
								value={ calcWidth }
								onChange={ ( e ) => setCalcWidth( Math.max( 1, parseInt( e.target.value ) || 1 ) ) }
							/>
						</div>
						<button
							className="mlc-wdt-ar-swap"
							onClick={ handleSwapCalc }
							title="Swap width and height"
						>
							&#8646;
						</button>
						<div className="mlc-wdt-control-group">
							<label className="mlc-wdt-control-label">Height</label>
							<input
								type="number"
								className="mlc-wdt-text-input"
								min="1"
								value={ calcHeight }
								onChange={ ( e ) => setCalcHeight( Math.max( 1, parseInt( e.target.value ) || 1 ) ) }
							/>
						</div>
					</div>

					{ /* Result */ }
					<div className="mlc-wdt-ar-result">
						<span className="mlc-wdt-control-label">Aspect Ratio</span>
						<div className="mlc-wdt-ar-result-value">
							<span className="mlc-wdt-ar-ratio-display">
								{ calculatedRatio.rw }:{ calculatedRatio.rh }
							</span>
							<CopyButton text={ `${ calculatedRatio.rw }:${ calculatedRatio.rh }` } />
						</div>
						<span className="mlc-wdt-ar-css-value">
							CSS: <code>aspect-ratio: { calculatedRatio.rw } / { calculatedRatio.rh };</code>
							<CopyButton text={ `aspect-ratio: ${ calculatedRatio.rw } / ${ calculatedRatio.rh };` } />
						</span>
					</div>
				</>
			) : (
				<>
					{ /* Ratio picker */ }
					<div className="mlc-wdt-control-group">
						<label className="mlc-wdt-control-label">Aspect Ratio</label>
						<div className="mlc-wdt-flex-options">
							{ COMMON_RATIOS.map( ( r ) => (
								<button
									key={ `${ r.w }:${ r.h }` }
									className={ `mlc-wdt-flex-option-btn${ selectedRatio.w === r.w && selectedRatio.h === r.h ? ' active' : '' }` }
									onClick={ () => handleSelectRatio( r ) }
								>
									{ r.label }
								</button>
							) ) }
						</div>
					</div>

					{ /* Scale slider */ }
					<div className="mlc-wdt-control-group">
						<label className="mlc-wdt-control-label">Width: { scaleWidth }px</label>
						<input
							type="range"
							className="mlc-wdt-range"
							min="100"
							max="7680"
							step="10"
							value={ scaleWidth }
							onChange={ ( e ) => handleScaleWidthChange( parseInt( e.target.value ) ) }
						/>
					</div>

					{ /* Dimension inputs with lock */ }
					<div className="mlc-wdt-ar-dims">
						<div className="mlc-wdt-control-group">
							<label className="mlc-wdt-control-label">Width</label>
							<input
								type="number"
								className="mlc-wdt-text-input"
								min="1"
								value={ scaleWidth }
								onChange={ ( e ) => handleScaleWidthChange( Math.max( 1, parseInt( e.target.value ) || 1 ) ) }
							/>
						</div>
						<span className="mlc-wdt-ar-lock" title="Ratio locked">&#128279;</span>
						<div className="mlc-wdt-control-group">
							<label className="mlc-wdt-control-label">Height</label>
							<input
								type="number"
								className="mlc-wdt-text-input"
								min="1"
								value={ scaledHeight }
								onChange={ ( e ) => handleScaleHeightChange( Math.max( 1, parseInt( e.target.value ) || 1 ) ) }
							/>
						</div>
					</div>

					{ /* CSS output */ }
					<div className="mlc-wdt-ar-result">
						<span className="mlc-wdt-ar-css-value">
							CSS: <code>aspect-ratio: { selectedRatio.w } / { selectedRatio.h };</code>
							<CopyButton text={ `aspect-ratio: ${ selectedRatio.w } / ${ selectedRatio.h };` } />
						</span>
					</div>

					{ /* Presets table */ }
					{ presets.length > 0 && (
						<div className="mlc-wdt-ar-presets">
							<label className="mlc-wdt-control-label">Common { ratioKey } Sizes</label>
							<table className="mlc-wdt-ar-table">
								<thead>
									<tr>
										<th>Name</th>
										<th>Width</th>
										<th>Height</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{ presets.map( ( p ) => (
										<tr
											key={ p.label }
											className="mlc-wdt-ar-table-row"
											onClick={ () => handleScaleWidthChange( p.w ) }
											title="Click to use these dimensions"
										>
											<td>{ p.label }</td>
											<td>{ p.w }</td>
											<td>{ p.h }</td>
											<td>
												<CopyButton text={ `${ p.w }x${ p.h }` } />
											</td>
										</tr>
									) ) }
								</tbody>
							</table>
						</div>
					) }
				</>
			) }
		</div>
	);

	return (
		<ToolCard
			title="Aspect Ratio Calculator"
			help="Calculate aspect ratios from dimensions, or scale dimensions while locked to a ratio. Includes common presets for video, display, and social media sizes."
			preview={ preview }
			controls={ controls }
		/>
	);
}
