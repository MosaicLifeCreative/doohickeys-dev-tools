import { useState, useMemo, useCallback } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CopyButton from '../components/CopyButton';
import ColorPicker from '../components/ColorPicker';

function hexToRgb( hex ) {
	const r = parseInt( hex.slice( 1, 3 ), 16 );
	const g = parseInt( hex.slice( 3, 5 ), 16 );
	const b = parseInt( hex.slice( 5, 7 ), 16 );
	return { r, g, b };
}

function rgbToHsl( { r, g, b } ) {
	const rs = r / 255;
	const gs = g / 255;
	const bs = b / 255;
	const max = Math.max( rs, gs, bs );
	const min = Math.min( rs, gs, bs );
	const l = ( max + min ) / 2;
	let h = 0;
	let s = 0;

	if ( max !== min ) {
		const d = max - min;
		s = l > 0.5 ? d / ( 2 - max - min ) : d / ( max + min );
		switch ( max ) {
			case rs:
				h = ( ( gs - bs ) / d + ( gs < bs ? 6 : 0 ) ) / 6;
				break;
			case gs:
				h = ( ( bs - rs ) / d + 2 ) / 6;
				break;
			case bs:
				h = ( ( rs - gs ) / d + 4 ) / 6;
				break;
		}
	}

	return {
		h: Math.round( h * 360 ),
		s: Math.round( s * 100 ),
		l: Math.round( l * 100 ),
	};
}

function rgbToCmyk( { r, g, b } ) {
	if ( r === 0 && g === 0 && b === 0 ) {
		return { c: 0, m: 0, y: 0, k: 100 };
	}
	const rs = r / 255;
	const gs = g / 255;
	const bs = b / 255;
	const k = 1 - Math.max( rs, gs, bs );
	const c = ( 1 - rs - k ) / ( 1 - k );
	const m = ( 1 - gs - k ) / ( 1 - k );
	const y = ( 1 - bs - k ) / ( 1 - k );
	return {
		c: Math.round( c * 100 ),
		m: Math.round( m * 100 ),
		y: Math.round( y * 100 ),
		k: Math.round( k * 100 ),
	};
}

function rgbToHwb( { r, g, b } ) {
	const hsl = rgbToHsl( { r, g, b } );
	const w = Math.min( r, g, b ) / 255;
	const bl = 1 - Math.max( r, g, b ) / 255;
	return {
		h: hsl.h,
		w: Math.round( w * 100 ),
		b: Math.round( bl * 100 ),
	};
}

function FormatRow( { label, value } ) {
	return (
		<div className="mlc-wdt-convert-row">
			<span className="mlc-wdt-convert-label">{ label }</span>
			<code className="mlc-wdt-convert-value">{ value }</code>
			<CopyButton text={ value } />
		</div>
	);
}

export default function ColorConverter() {
	const [ color, setColor ] = useState( '#0073aa' );
	const [ inputText, setInputText ] = useState( '#0073aa' );

	const rgb = useMemo( () => hexToRgb( color ), [ color ] );
	const hsl = useMemo( () => rgbToHsl( rgb ), [ rgb ] );
	const cmyk = useMemo( () => rgbToCmyk( rgb ), [ rgb ] );
	const hwb = useMemo( () => rgbToHwb( rgb ), [ rgb ] );

	const formats = useMemo( () => ( {
		hex: color.toUpperCase(),
		rgb: `rgb(${ rgb.r }, ${ rgb.g }, ${ rgb.b })`,
		rgbPercent: `rgb(${ Math.round( rgb.r / 2.55 ) }%, ${ Math.round( rgb.g / 2.55 ) }%, ${ Math.round( rgb.b / 2.55 ) }%)`,
		hsl: `hsl(${ hsl.h }, ${ hsl.s }%, ${ hsl.l }%)`,
		cmyk: `cmyk(${ cmyk.c }%, ${ cmyk.m }%, ${ cmyk.y }%, ${ cmyk.k }%)`,
		hwb: `hwb(${ hwb.h } ${ hwb.w }% ${ hwb.b }%)`,
	} ), [ color, rgb, hsl, cmyk, hwb ] );

	const handleTextInput = useCallback( ( e ) => {
		const val = e.target.value;
		setInputText( val );

		// Try to parse as hex.
		const hexMatch = val.match( /^#?([0-9a-fA-F]{6})$/ );
		if ( hexMatch ) {
			setColor( `#${ hexMatch[ 1 ] }` );
			return;
		}

		// Try 3-char hex.
		const hex3Match = val.match( /^#?([0-9a-fA-F]{3})$/ );
		if ( hex3Match ) {
			const expanded = hex3Match[ 1 ].split( '' ).map( ( c ) => c + c ).join( '' );
			setColor( `#${ expanded }` );
			return;
		}

		// Try rgb().
		const rgbMatch = val.match( /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/ );
		if ( rgbMatch ) {
			const rr = Math.min( 255, parseInt( rgbMatch[ 1 ] ) );
			const gg = Math.min( 255, parseInt( rgbMatch[ 2 ] ) );
			const bb = Math.min( 255, parseInt( rgbMatch[ 3 ] ) );
			const hexStr = `#${ [ rr, gg, bb ].map( ( c ) => c.toString( 16 ).padStart( 2, '0' ) ).join( '' ) }`;
			setColor( hexStr );
			return;
		}

		// Try hsl().
		const hslMatch = val.match( /hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*\)/ );
		if ( hslMatch ) {
			const hh = parseInt( hslMatch[ 1 ] ) / 360;
			const ss = parseInt( hslMatch[ 2 ] ) / 100;
			const ll = parseInt( hslMatch[ 3 ] ) / 100;
			const hue2rgb = ( p, q, t ) => {
				if ( t < 0 ) t += 1;
				if ( t > 1 ) t -= 1;
				if ( t < 1 / 6 ) return p + ( q - p ) * 6 * t;
				if ( t < 1 / 2 ) return q;
				if ( t < 2 / 3 ) return p + ( q - p ) * ( 2 / 3 - t ) * 6;
				return p;
			};
			let rr, gg, bb;
			if ( ss === 0 ) {
				rr = gg = bb = ll;
			} else {
				const q = ll < 0.5 ? ll * ( 1 + ss ) : ll + ss - ll * ss;
				const p = 2 * ll - q;
				rr = hue2rgb( p, q, hh + 1 / 3 );
				gg = hue2rgb( p, q, hh );
				bb = hue2rgb( p, q, hh - 1 / 3 );
			}
			const hexStr = `#${ [ rr, gg, bb ].map( ( c ) => Math.round( c * 255 ).toString( 16 ).padStart( 2, '0' ) ).join( '' ) }`;
			setColor( hexStr );
		}
	}, [] );

	const handlePickerChange = useCallback( ( val ) => {
		setColor( val );
		setInputText( val );
	}, [] );

	const preview = (
		<div className="mlc-wdt-convert-preview">
			<div className="mlc-wdt-convert-swatch-large" style={ { background: color } } />
		</div>
	);

	const controls = (
		<div className="mlc-wdt-convert-controls">
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Input Color</label>
				<div className="mlc-wdt-convert-input-row">
					<ColorPicker color={ color } onChange={ handlePickerChange } />
					<input
						type="text"
						className="mlc-wdt-text-input"
						value={ inputText }
						onChange={ handleTextInput }
						placeholder="#hex, rgb(), or hsl()"
					/>
				</div>
				<p className="mlc-wdt-tip">Accepts HEX (#ff0000), RGB (rgb(255,0,0)), or HSL (hsl(0,100%,50%))</p>
			</div>

			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">All Formats</label>
				<div className="mlc-wdt-convert-formats">
					<FormatRow label="HEX" value={ formats.hex } />
					<FormatRow label="RGB" value={ formats.rgb } />
					<FormatRow label="RGB %" value={ formats.rgbPercent } />
					<FormatRow label="HSL" value={ formats.hsl } />
					<FormatRow label="HWB" value={ formats.hwb } />
					<FormatRow label="CMYK" value={ formats.cmyk } />
				</div>
			</div>
		</div>
	);

	return (
		<ToolCard
			title="Color Converter"
			help="Convert colors between HEX, RGB, HSL, HWB, and CMYK formats. Type or paste any color value, or use the picker."
			preview={ preview }
			controls={ controls }
		/>
	);
}
