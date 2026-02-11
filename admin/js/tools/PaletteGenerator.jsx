import { useState, useRef, useCallback, useMemo, useEffect } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CopyButton from '../components/CopyButton';
import ProBadge from '../components/ProBadge';

/* ── Color math helpers ── */

function hslToHex( h, s, l ) {
	const sn = s / 100;
	const ln = l / 100;
	const a = sn * Math.min( ln, 1 - ln );
	const f = ( n ) => {
		const k = ( n + h / 30 ) % 12;
		const color = ln - a * Math.max( Math.min( k - 3, 9 - k, 1 ), -1 );
		return Math.round( color * 255 ).toString( 16 ).padStart( 2, '0' );
	};
	return `#${ f( 0 ) }${ f( 8 ) }${ f( 4 ) }`;
}

function hexToHsl( hex ) {
	const r = parseInt( hex.slice( 1, 3 ), 16 ) / 255;
	const g = parseInt( hex.slice( 3, 5 ), 16 ) / 255;
	const b = parseInt( hex.slice( 5, 7 ), 16 ) / 255;
	const max = Math.max( r, g, b );
	const min = Math.min( r, g, b );
	const l = ( max + min ) / 2;
	let h = 0;
	let s = 0;
	if ( max !== min ) {
		const d = max - min;
		s = l > 0.5 ? d / ( 2 - max - min ) : d / ( max + min );
		switch ( max ) {
			case r: h = ( ( g - b ) / d + ( g < b ? 6 : 0 ) ) / 6; break;
			case g: h = ( ( b - r ) / d + 2 ) / 6; break;
			case b: h = ( ( r - g ) / d + 4 ) / 6; break;
		}
	}
	return { h: Math.round( h * 360 ), s: Math.round( s * 100 ), l: Math.round( l * 100 ) };
}

function normalizeHue( h ) {
	return ( ( h % 360 ) + 360 ) % 360;
}

/* ── Harmony algorithms ── */

const HARMONIES = {
	complementary: {
		label: 'Complementary',
		desc: '2 colors opposite on the wheel',
		offsets: ( h ) => [ h, normalizeHue( h + 180 ) ],
	},
	analogous: {
		label: 'Analogous',
		desc: '3 colors adjacent on the wheel',
		offsets: ( h ) => [ normalizeHue( h - 30 ), h, normalizeHue( h + 30 ) ],
	},
	triadic: {
		label: 'Triadic',
		desc: '3 colors evenly spaced (120°)',
		offsets: ( h ) => [ h, normalizeHue( h + 120 ), normalizeHue( h + 240 ) ],
	},
	'split-complementary': {
		label: 'Split Comp.',
		desc: 'Base + 2 adjacent to complement',
		offsets: ( h ) => [ h, normalizeHue( h + 150 ), normalizeHue( h + 210 ) ],
	},
	square: {
		label: 'Square',
		desc: '4 colors evenly spaced (90°)',
		offsets: ( h ) => [ h, normalizeHue( h + 90 ), normalizeHue( h + 180 ), normalizeHue( h + 270 ) ],
	},
	tetradic: {
		label: 'Tetradic',
		desc: '4 colors in 2 complementary pairs',
		offsets: ( h ) => [ h, normalizeHue( h + 60 ), normalizeHue( h + 180 ), normalizeHue( h + 240 ) ],
	},
	monochromatic: {
		label: 'Monochromatic',
		desc: '5 shades of the same hue',
		offsets: ( h ) => [ h, h, h, h, h ],
	},
};

const MONO_LIGHTNESS = [ 20, 35, 50, 65, 80 ];

/* ── Wheel drawing helper ── */

function drawWheel( canvas, size, innerRatio ) {
	const ctx = canvas.getContext( '2d' );
	const center = size / 2;
	const outerR = size / 2 - 2;
	const innerR = outerR * innerRatio;

	ctx.clearRect( 0, 0, size, size );

	// Draw hue ring segment by segment
	for ( let deg = 0; deg < 360; deg++ ) {
		const startAngle = ( deg - 90.5 ) * ( Math.PI / 180 );
		const endAngle = ( deg - 89.5 ) * ( Math.PI / 180 );
		ctx.beginPath();
		ctx.arc( center, center, outerR, startAngle, endAngle );
		ctx.arc( center, center, innerR, endAngle, startAngle, true );
		ctx.closePath();
		ctx.fillStyle = `hsl(${ deg }, 100%, 50%)`;
		ctx.fill();
	}
}

/* ── Component ── */

export default function PaletteGenerator() {
	const [ baseHue, setBaseHue ] = useState( 210 );
	const [ baseSat, setBaseSat ] = useState( 80 );
	const [ baseLit, setBaseLit ] = useState( 50 );
	const [ harmony, setHarmony ] = useState( 'complementary' );
	const canvasRef = useRef( null );
	const isDragging = useRef( false );
	const WHEEL_SIZE = 280;
	const INNER_RATIO = 0.68;

	// Draw wheel on mount
	useEffect( () => {
		if ( canvasRef.current ) {
			drawWheel( canvasRef.current, WHEEL_SIZE, INNER_RATIO );
		}
	}, [] );

	// Convert click position to hue
	const posToHue = useCallback( ( clientX, clientY ) => {
		const rect = canvasRef.current.getBoundingClientRect();
		const cx = rect.width / 2;
		const cy = rect.height / 2;
		const x = clientX - rect.left - cx;
		const y = clientY - rect.top - cy;
		let angle = Math.atan2( y, x ) * ( 180 / Math.PI ) + 90;
		if ( angle < 0 ) {
			angle += 360;
		}
		return Math.round( angle ) % 360;
	}, [] );

	const handleWheelMouseDown = useCallback( ( e ) => {
		const rect = canvasRef.current.getBoundingClientRect();
		const cx = rect.width / 2;
		const cy = rect.height / 2;
		const x = e.clientX - rect.left - cx;
		const y = e.clientY - rect.top - cy;
		const dist = Math.sqrt( x * x + y * y );
		const outerR = rect.width / 2 - 2;
		const innerR = outerR * INNER_RATIO;

		// Only start drag if clicking on the ring
		if ( dist >= innerR && dist <= outerR ) {
			isDragging.current = true;
			setBaseHue( posToHue( e.clientX, e.clientY ) );
		}
	}, [ posToHue ] );

	useEffect( () => {
		const handleMouseMove = ( e ) => {
			if ( isDragging.current ) {
				setBaseHue( posToHue( e.clientX, e.clientY ) );
			}
		};
		const handleMouseUp = () => {
			isDragging.current = false;
		};
		document.addEventListener( 'mousemove', handleMouseMove );
		document.addEventListener( 'mouseup', handleMouseUp );
		return () => {
			document.removeEventListener( 'mousemove', handleMouseMove );
			document.removeEventListener( 'mouseup', handleMouseUp );
		};
	}, [ posToHue ] );

	// Generate palette colors
	const palette = useMemo( () => {
		const rule = HARMONIES[ harmony ];
		const hues = rule.offsets( baseHue );

		return hues.map( ( h, i ) => {
			let s = baseSat;
			let l = baseLit;

			// Monochromatic: vary lightness
			if ( harmony === 'monochromatic' ) {
				s = baseSat;
				l = MONO_LIGHTNESS[ i ];
			}

			const hex = hslToHex( h, s, l );
			return { h, s, l, hex };
		} );
	}, [ baseHue, baseSat, baseLit, harmony ] );

	// Marker positions on the wheel
	const markers = useMemo( () => {
		const center = WHEEL_SIZE / 2;
		const outerR = WHEEL_SIZE / 2 - 2;
		const markerR = ( outerR + outerR * INNER_RATIO ) / 2;

		return palette.map( ( color ) => {
			const angleRad = ( color.h - 90 ) * ( Math.PI / 180 );
			return {
				x: center + markerR * Math.cos( angleRad ),
				y: center + markerR * Math.sin( angleRad ),
				hex: color.hex,
			};
		} );
	}, [ palette ] );

	// CSS variables export
	const cssVars = useMemo( () => {
		return palette.map( ( c, i ) => `  --color-${ i + 1 }: ${ c.hex };` ).join( '\n' );
	}, [ palette ] );

	const cssOutput = `:root {\n${ cssVars }\n}`;

	// Tailwind-style export
	const scssVars = useMemo( () => {
		return palette.map( ( c, i ) => `$color-${ i + 1 }: ${ c.hex };` ).join( '\n' );
	}, [ palette ] );

	const allHexes = palette.map( ( c ) => c.hex.toUpperCase() ).join( ', ' );

	const preview = (
		<div className="mlc-wdt-palette-preview">
			<div className="mlc-wdt-palette-wheel-wrap">
				{ /* Color wheel */ }
				<div className="mlc-wdt-palette-wheel-container">
					<canvas
						ref={ canvasRef }
						width={ WHEEL_SIZE }
						height={ WHEEL_SIZE }
						className="mlc-wdt-palette-wheel"
						onMouseDown={ handleWheelMouseDown }
					/>
					{ /* Harmony markers */ }
					{ markers.map( ( m, i ) => (
						<div
							key={ i }
							className={ `mlc-wdt-palette-marker${ i === 0 ? ' mlc-wdt-palette-marker-base' : '' }` }
							style={ {
								left: `${ m.x }px`,
								top: `${ m.y }px`,
								background: m.hex,
							} }
						/>
					) ) }
					{ /* Center swatch */ }
					<div
						className="mlc-wdt-palette-center"
						style={ { background: palette[ 0 ]?.hex } }
					>
						<span className="mlc-wdt-palette-center-hex">
							{ palette[ 0 ]?.hex.toUpperCase() }
						</span>
					</div>
				</div>
			</div>

			{ /* Palette strip */ }
			<div className="mlc-wdt-palette-strip">
				{ palette.map( ( color, i ) => (
					<div key={ i } className="mlc-wdt-palette-swatch-col">
						<div
							className="mlc-wdt-palette-swatch"
							style={ { background: color.hex } }
						/>
						<span className="mlc-wdt-palette-swatch-hex">
							{ color.hex.toUpperCase() }
						</span>
						<CopyButton text={ color.hex.toUpperCase() } />
					</div>
				) ) }
			</div>
		</div>
	);

	const controls = (
		<div className="mlc-wdt-palette-controls">
			{ /* Harmony mode */ }
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Color Harmony</label>
				<div className="mlc-wdt-palette-harmonies">
					{ Object.entries( HARMONIES ).map( ( [ key, rule ] ) => (
						<button
							key={ key }
							className={ `mlc-wdt-palette-harmony-btn${ harmony === key ? ' active' : '' }` }
							onClick={ () => setHarmony( key ) }
							title={ rule.desc }
						>
							{ rule.label }
						</button>
					) ) }
				</div>
			</div>

			{ /* Base color sliders */ }
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Base Color</label>
				<div className="mlc-wdt-palette-slider-group">
					<div className="mlc-wdt-palette-slider-row">
						<span className="mlc-wdt-palette-slider-label">Hue</span>
						<input
							type="range"
							className="mlc-wdt-range mlc-wdt-palette-hue-range"
							min="0"
							max="359"
							value={ baseHue }
							onChange={ ( e ) => setBaseHue( parseInt( e.target.value ) ) }
							style={ {
								background: `linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))`,
							} }
						/>
						<span className="mlc-wdt-field-value">{ baseHue }°</span>
					</div>
					<div className="mlc-wdt-palette-slider-row">
						<span className="mlc-wdt-palette-slider-label">Saturation</span>
						<input
							type="range"
							className="mlc-wdt-range"
							min="0"
							max="100"
							value={ baseSat }
							onChange={ ( e ) => setBaseSat( parseInt( e.target.value ) ) }
						/>
						<span className="mlc-wdt-field-value">{ baseSat }%</span>
					</div>
					{ harmony !== 'monochromatic' && (
						<div className="mlc-wdt-palette-slider-row">
							<span className="mlc-wdt-palette-slider-label">Lightness</span>
							<input
								type="range"
								className="mlc-wdt-range"
								min="10"
								max="90"
								value={ baseLit }
								onChange={ ( e ) => setBaseLit( parseInt( e.target.value ) ) }
							/>
							<span className="mlc-wdt-field-value">{ baseLit }%</span>
						</div>
					) }
				</div>
			</div>

			{ /* Quick base color input */ }
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Paste Base Color</label>
				<input
					type="text"
					className="mlc-wdt-text-input"
					placeholder="#0073aa or any hex"
					style={ { maxWidth: '200px' } }
					onBlur={ ( e ) => {
						const val = e.target.value.trim();
						const match = val.match( /^#?([0-9a-fA-F]{6})$/ );
						if ( match ) {
							const hsl = hexToHsl( `#${ match[ 1 ] }` );
							setBaseHue( hsl.h );
							setBaseSat( hsl.s );
							setBaseLit( hsl.l );
						}
					} }
					onKeyDown={ ( e ) => {
						if ( e.key === 'Enter' ) {
							e.target.blur();
						}
					} }
				/>
			</div>
		</div>
	);

	const output = (
		<div className="mlc-wdt-palette-output">
			<div className="mlc-wdt-control-group">
				<div style={ { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' } }>
					<label className="mlc-wdt-control-label" style={ { margin: 0 } }>All Colors</label>
					<CopyButton text={ allHexes } />
				</div>
				<code className="mlc-wdt-palette-all-hex">{ allHexes }</code>
			</div>

			<div className="mlc-wdt-control-group">
				<div style={ { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' } }>
					<label className="mlc-wdt-control-label" style={ { margin: 0 } }>CSS Variables</label>
					<CopyButton text={ cssOutput } />
				</div>
				<pre className="mlc-wdt-code-pre"><code>{ cssOutput }</code></pre>
			</div>

			<div className="mlc-wdt-control-group">
				<div style={ { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' } }>
					<label className="mlc-wdt-control-label" style={ { margin: 0 } }>SCSS Variables</label>
					<CopyButton text={ scssVars } />
				</div>
				<pre className="mlc-wdt-code-pre"><code>{ scssVars }</code></pre>
			</div>
		</div>
	);

	return (
		<ProBadge feature="Palette Generator is a Pro feature">
			<ToolCard
				title="Palette Generator"
				help="Generate harmonious color palettes using color theory. Click the wheel to pick a base hue, choose a harmony rule, and adjust saturation/lightness. Export as CSS variables or SCSS."
				preview={ preview }
				controls={ controls }
				output={ output }
			/>
		</ProBadge>
	);
}
