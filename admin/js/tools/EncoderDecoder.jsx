import { useState, useMemo, useCallback } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CopyButton from '../components/CopyButton';

const MODES = [
	{ id: 'base64', label: 'Base64' },
	{ id: 'url', label: 'URL' },
	{ id: 'html', label: 'HTML Entities' },
	{ id: 'utf8', label: 'UTF-8 Hex' },
];

function base64Encode( str ) {
	try {
		return btoa( unescape( encodeURIComponent( str ) ) );
	} catch {
		return 'Error: Invalid input for Base64 encoding';
	}
}

function base64Decode( str ) {
	try {
		return decodeURIComponent( escape( atob( str.trim() ) ) );
	} catch {
		return 'Error: Invalid Base64 string';
	}
}

function urlEncode( str ) {
	try {
		return encodeURIComponent( str );
	} catch {
		return 'Error: Invalid input';
	}
}

function urlDecode( str ) {
	try {
		return decodeURIComponent( str.trim() );
	} catch {
		return 'Error: Invalid URL-encoded string';
	}
}

function htmlEncode( str ) {
	const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
	return str.replace( /[&<>"']/g, ( c ) => map[ c ] );
}

function htmlDecode( str ) {
	const el = document.createElement( 'textarea' );
	el.innerHTML = str;
	return el.value;
}

function utf8Encode( str ) {
	const encoder = new TextEncoder();
	const bytes = encoder.encode( str );
	return Array.from( bytes )
		.map( ( b ) => '\\x' + b.toString( 16 ).padStart( 2, '0' ) )
		.join( '' );
}

function utf8Decode( str ) {
	try {
		const hex = str.replace( /\\x/g, '' ).replace( /\s+/g, '' );
		const bytes = [];
		for ( let i = 0; i < hex.length; i += 2 ) {
			bytes.push( parseInt( hex.substring( i, i + 2 ), 16 ) );
		}
		const decoder = new TextDecoder();
		return decoder.decode( new Uint8Array( bytes ) );
	} catch {
		return 'Error: Invalid UTF-8 hex string';
	}
}

const encoders = {
	base64: { encode: base64Encode, decode: base64Decode },
	url: { encode: urlEncode, decode: urlDecode },
	html: { encode: htmlEncode, decode: htmlDecode },
	utf8: { encode: utf8Encode, decode: utf8Decode },
};

export default function EncoderDecoder() {
	const [ mode, setMode ] = useState( 'base64' );
	const [ direction, setDirection ] = useState( 'encode' );
	const [ input, setInput ] = useState( '' );

	const result = useMemo( () => {
		if ( ! input ) return '';
		const fn = encoders[ mode ]?.[ direction ];
		return fn ? fn( input ) : '';
	}, [ mode, direction, input ] );

	const handleSwap = useCallback( () => {
		setDirection( ( prev ) => ( prev === 'encode' ? 'decode' : 'encode' ) );
		setInput( result );
	}, [ result ] );

	const preview = input ? (
		<div className="mlc-wdt-encoder-preview">
			<pre className="mlc-wdt-code-pre"><code>{ result }</code></pre>
			<div style={ { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' } }>
				<CopyButton text={ result } />
				<span className="mlc-wdt-encoder-stats">
					{ input.length } chars &rarr; { result.length } chars
				</span>
			</div>
		</div>
	) : null;

	const controls = (
		<div className="mlc-wdt-encoder-controls">
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Mode</label>
				<div className="mlc-wdt-radio-group">
					{ MODES.map( ( m ) => (
						<label key={ m.id } className={ `mlc-wdt-radio${ mode === m.id ? ' active' : '' }` }>
							<input
								type="radio"
								value={ m.id }
								checked={ mode === m.id }
								onChange={ () => setMode( m.id ) }
							/>
							{ m.label }
						</label>
					) ) }
				</div>
			</div>

			<div className="mlc-wdt-control-group">
				<div className="mlc-wdt-encoder-direction-row">
					<label className="mlc-wdt-control-label">Direction</label>
					<div className="mlc-wdt-radio-group">
						<label className={ `mlc-wdt-radio${ direction === 'encode' ? ' active' : '' }` }>
							<input
								type="radio"
								value="encode"
								checked={ direction === 'encode' }
								onChange={ () => setDirection( 'encode' ) }
							/>
							Encode
						</label>
						<label className={ `mlc-wdt-radio${ direction === 'decode' ? ' active' : '' }` }>
							<input
								type="radio"
								value="decode"
								checked={ direction === 'decode' }
								onChange={ () => setDirection( 'decode' ) }
							/>
							Decode
						</label>
					</div>
					<button className="mlc-wdt-contrast-swap-btn" onClick={ handleSwap } title="Swap input/output">
						&#8646;
					</button>
				</div>
			</div>

			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">
					Input ({ direction === 'encode' ? 'plain text' : `${ MODES.find( ( m ) => m.id === mode )?.label } encoded` })
				</label>
				<textarea
					className="mlc-wdt-textarea"
					rows="6"
					value={ input }
					onChange={ ( e ) => setInput( e.target.value ) }
					placeholder={
						direction === 'encode'
							? 'Type or paste text to encode...'
							: `Paste ${ MODES.find( ( m ) => m.id === mode )?.label } string to decode...`
					}
				/>
			</div>
		</div>
	);

	return (
		<ToolCard
			title="Encoder / Decoder"
			help="Encode and decode text using Base64, URL encoding, HTML entities, or UTF-8 hex. Use the swap button to quickly flip between input and output."
			preview={ preview }
			controls={ controls }
		/>
	);
}
