import { useState, useRef, useEffect, useCallback } from '@wordpress/element';

function hsvToHex( h, s, v ) {
	const c = v * s;
	const x = c * ( 1 - Math.abs( ( ( h / 60 ) % 2 ) - 1 ) );
	const m = v - c;
	let r, g, b;

	if ( h < 60 ) {
		[ r, g, b ] = [ c, x, 0 ];
	} else if ( h < 120 ) {
		[ r, g, b ] = [ x, c, 0 ];
	} else if ( h < 180 ) {
		[ r, g, b ] = [ 0, c, x ];
	} else if ( h < 240 ) {
		[ r, g, b ] = [ 0, x, c ];
	} else if ( h < 300 ) {
		[ r, g, b ] = [ x, 0, c ];
	} else {
		[ r, g, b ] = [ c, 0, x ];
	}

	const toHex = ( val ) => {
		const hex = Math.round( ( val + m ) * 255 ).toString( 16 );
		return hex.length === 1 ? '0' + hex : hex;
	};

	return `#${ toHex( r ) }${ toHex( g ) }${ toHex( b ) }`;
}

function hexToHsv( hex ) {
	const cleanHex = hex.replace( '#', '' );
	if ( cleanHex.length !== 6 ) {
		return { h: 0, s: 0, v: 0 };
	}

	const r = parseInt( cleanHex.slice( 0, 2 ), 16 ) / 255;
	const g = parseInt( cleanHex.slice( 2, 4 ), 16 ) / 255;
	const b = parseInt( cleanHex.slice( 4, 6 ), 16 ) / 255;

	const max = Math.max( r, g, b );
	const min = Math.min( r, g, b );
	const d = max - min;

	let h = 0;
	if ( d !== 0 ) {
		if ( max === r ) {
			h = 60 * ( ( ( g - b ) / d ) % 6 );
		} else if ( max === g ) {
			h = 60 * ( ( b - r ) / d + 2 );
		} else {
			h = 60 * ( ( r - g ) / d + 4 );
		}
	}
	if ( h < 0 ) {
		h += 360;
	}

	const s = max === 0 ? 0 : d / max;
	return { h, s, v: max };
}

function isValidHex( hex ) {
	return /^#[0-9a-fA-F]{6}$/.test( hex );
}

export default function ColorPicker( { color, onChange, label } ) {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ hsv, setHsv ] = useState( () => hexToHsv( color ) );
	const [ hexInput, setHexInput ] = useState( color );
	const pickerRef = useRef( null );
	const satCanvasRef = useRef( null );
	const isDraggingSat = useRef( false );
	const isDraggingHue = useRef( false );

	// Sync from parent color prop
	useEffect( () => {
		if ( isValidHex( color ) ) {
			setHsv( hexToHsv( color ) );
			setHexInput( color );
		}
	}, [ color ] );

	// Close on outside click
	useEffect( () => {
		if ( ! isOpen ) {
			return;
		}
		const handleClick = ( e ) => {
			if ( pickerRef.current && ! pickerRef.current.contains( e.target ) ) {
				setIsOpen( false );
			}
		};
		document.addEventListener( 'mousedown', handleClick );
		return () => document.removeEventListener( 'mousedown', handleClick );
	}, [ isOpen ] );

	const emitColor = useCallback(
		( newHsv ) => {
			const hex = hsvToHex( newHsv.h, newHsv.s, newHsv.v );
			setHexInput( hex );
			onChange( hex );
		},
		[ onChange ]
	);

	// Saturation/Brightness panel interaction
	const handleSatMouseDown = useCallback( ( e ) => {
		isDraggingSat.current = true;
		updateSatFromEvent( e );
	}, [] );

	const updateSatFromEvent = useCallback(
		( e ) => {
			const rect = satCanvasRef.current.getBoundingClientRect();
			const x = Math.max( 0, Math.min( e.clientX - rect.left, rect.width ) );
			const y = Math.max( 0, Math.min( e.clientY - rect.top, rect.height ) );
			const s = x / rect.width;
			const v = 1 - y / rect.height;
			const newHsv = { ...hsv, s, v };
			setHsv( newHsv );
			emitColor( newHsv );
		},
		[ hsv, emitColor ]
	);

	// Hue slider interaction
	const handleHueMouseDown = useCallback( ( e ) => {
		isDraggingHue.current = true;
		updateHueFromEvent( e );
	}, [] );

	const updateHueFromEvent = useCallback(
		( e ) => {
			const rect = e.currentTarget
				? e.currentTarget.getBoundingClientRect()
				: e.target.getBoundingClientRect();
			// Try getting the hue bar rect from a stored ref
			const hueBar = pickerRef.current?.querySelector( '.mlc-wdt-cp-hue-bar' );
			const barRect = hueBar ? hueBar.getBoundingClientRect() : rect;
			const x = Math.max( 0, Math.min( e.clientX - barRect.left, barRect.width ) );
			const h = ( x / barRect.width ) * 360;
			const newHsv = { ...hsv, h };
			setHsv( newHsv );
			emitColor( newHsv );
		},
		[ hsv, emitColor ]
	);

	// Global mouse move/up for dragging
	useEffect( () => {
		const handleMouseMove = ( e ) => {
			if ( isDraggingSat.current ) {
				const rect = satCanvasRef.current.getBoundingClientRect();
				const x = Math.max( 0, Math.min( e.clientX - rect.left, rect.width ) );
				const y = Math.max( 0, Math.min( e.clientY - rect.top, rect.height ) );
				const s = x / rect.width;
				const v = 1 - y / rect.height;
				setHsv( ( prev ) => {
					const newHsv = { ...prev, s, v };
					const hex = hsvToHex( newHsv.h, newHsv.s, newHsv.v );
					setHexInput( hex );
					onChange( hex );
					return newHsv;
				} );
			}
			if ( isDraggingHue.current ) {
				const hueBar = pickerRef.current?.querySelector( '.mlc-wdt-cp-hue-bar' );
				if ( hueBar ) {
					const barRect = hueBar.getBoundingClientRect();
					const x = Math.max( 0, Math.min( e.clientX - barRect.left, barRect.width ) );
					const h = ( x / barRect.width ) * 360;
					setHsv( ( prev ) => {
						const newHsv = { ...prev, h };
						const hex = hsvToHex( newHsv.h, newHsv.s, newHsv.v );
						setHexInput( hex );
						onChange( hex );
						return newHsv;
					} );
				}
			}
		};
		const handleMouseUp = () => {
			isDraggingSat.current = false;
			isDraggingHue.current = false;
		};
		document.addEventListener( 'mousemove', handleMouseMove );
		document.addEventListener( 'mouseup', handleMouseUp );
		return () => {
			document.removeEventListener( 'mousemove', handleMouseMove );
			document.removeEventListener( 'mouseup', handleMouseUp );
		};
	}, [ onChange ] );

	const handleHexChange = ( e ) => {
		const val = e.target.value;
		setHexInput( val );
		if ( isValidHex( val ) ) {
			setHsv( hexToHsv( val ) );
			onChange( val );
		}
	};

	const hueColor = hsvToHex( hsv.h, 1, 1 );

	return (
		<div className="mlc-wdt-cp" ref={ pickerRef }>
			{ label && <label className="mlc-wdt-range-label">{ label }</label> }
			<div className="mlc-wdt-cp-trigger-row">
				<button
					className="mlc-wdt-cp-swatch"
					onClick={ () => setIsOpen( ! isOpen ) }
					style={ { background: color } }
					aria-label="Open color picker"
				/>
				<input
					type="text"
					value={ hexInput }
					onChange={ handleHexChange }
					className="mlc-wdt-hex-input"
					maxLength={ 7 }
				/>
			</div>

			{ isOpen && (
				<div className="mlc-wdt-cp-popover">
					{ /* Saturation/Brightness panel */ }
					<div
						ref={ satCanvasRef }
						className="mlc-wdt-cp-sat-panel"
						style={ { background: hueColor } }
						onMouseDown={ handleSatMouseDown }
					>
						<div className="mlc-wdt-cp-sat-white" />
						<div className="mlc-wdt-cp-sat-black" />
						<div
							className="mlc-wdt-cp-sat-cursor"
							style={ {
								left: `${ hsv.s * 100 }%`,
								top: `${ ( 1 - hsv.v ) * 100 }%`,
							} }
						/>
					</div>

					{ /* Hue bar */ }
					<div
						className="mlc-wdt-cp-hue-bar"
						onMouseDown={ handleHueMouseDown }
					>
						<div
							className="mlc-wdt-cp-hue-cursor"
							style={ { left: `${ ( hsv.h / 360 ) * 100 }%` } }
						/>
					</div>

					{ /* Preview + hex */ }
					<div className="mlc-wdt-cp-footer">
						<div
							className="mlc-wdt-cp-preview-swatch"
							style={ { background: color } }
						/>
						<input
							type="text"
							value={ hexInput }
							onChange={ handleHexChange }
							className="mlc-wdt-hex-input mlc-wdt-cp-hex"
							maxLength={ 7 }
						/>
					</div>
				</div>
			) }
		</div>
	);
}
