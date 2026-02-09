import { useState, useCallback } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CopyButton from '../components/CopyButton';

const LANGUAGES = [
	{ id: 'json', label: 'JSON' },
	{ id: 'html', label: 'HTML' },
	{ id: 'css', label: 'CSS' },
	{ id: 'js', label: 'JavaScript' },
	{ id: 'sql', label: 'SQL' },
];

function formatJSON( str ) {
	try {
		return JSON.stringify( JSON.parse( str ), null, 2 );
	} catch ( e ) {
		return 'Error: Invalid JSON - ' + e.message;
	}
}

function minifyJSON( str ) {
	try {
		return JSON.stringify( JSON.parse( str ) );
	} catch ( e ) {
		return 'Error: Invalid JSON - ' + e.message;
	}
}

function formatCSS( str ) {
	let result = str.trim();
	// Normalize whitespace.
	result = result.replace( /\s+/g, ' ' );
	// Add newline after { and ;
	result = result.replace( /\{/g, ' {\n  ' );
	result = result.replace( /;\s*/g, ';\n  ' );
	result = result.replace( /\}\s*/g, '\n}\n\n' );
	// Clean up extra spaces before closing brace.
	result = result.replace( /\s+\}/g, '\n}' );
	return result.trim();
}

function minifyCSS( str ) {
	return str
		.replace( /\/\*[\s\S]*?\*\//g, '' )
		.replace( /\s+/g, ' ' )
		.replace( /\s*([{}:;,])\s*/g, '$1' )
		.replace( /;}/g, '}' )
		.trim();
}

function formatHTML( str ) {
	const tab = '  ';
	let result = '';
	let indent = 0;
	// Split on tags.
	const tokens = str.replace( />\s+</g, '><' ).split( /(<[^>]+>)/g ).filter( Boolean );

	for ( const token of tokens ) {
		if ( token.match( /^<\/([\w-]+)/ ) ) {
			indent = Math.max( 0, indent - 1 );
			result += tab.repeat( indent ) + token + '\n';
		} else if ( token.match( /^<([\w-]+)/ ) ) {
			const selfClosing = token.match( /\/>$/ );
			const voidTags = /^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/i;
			result += tab.repeat( indent ) + token + '\n';
			if ( ! selfClosing && ! voidTags.test( token ) ) {
				indent++;
			}
		} else if ( token.trim() ) {
			result += tab.repeat( indent ) + token.trim() + '\n';
		}
	}
	return result.trim();
}

function minifyHTML( str ) {
	return str
		.replace( /\n\s*/g, '' )
		.replace( />\s+</g, '><' )
		.trim();
}

function formatJS( str ) {
	let result = '';
	let indent = 0;
	const tab = '  ';
	let inString = false;
	let stringChar = '';

	for ( let i = 0; i < str.length; i++ ) {
		const ch = str[ i ];

		if ( inString ) {
			result += ch;
			if ( ch === stringChar && str[ i - 1 ] !== '\\' ) {
				inString = false;
			}
			continue;
		}

		if ( ch === '"' || ch === "'" || ch === '`' ) {
			inString = true;
			stringChar = ch;
			result += ch;
			continue;
		}

		if ( ch === '{' || ch === '[' ) {
			indent++;
			result += ch + '\n' + tab.repeat( indent );
		} else if ( ch === '}' || ch === ']' ) {
			indent = Math.max( 0, indent - 1 );
			result += '\n' + tab.repeat( indent ) + ch;
		} else if ( ch === ';' ) {
			result += ';\n' + tab.repeat( indent );
		} else if ( ch === ',' ) {
			result += ',\n' + tab.repeat( indent );
		} else {
			result += ch;
		}
	}
	return result.replace( /\n\s*\n/g, '\n' ).trim();
}

function minifyJS( str ) {
	return str
		.replace( /\/\/.*$/gm, '' )
		.replace( /\/\*[\s\S]*?\*\//g, '' )
		.replace( /\s+/g, ' ' )
		.replace( /\s*([{}();,:])\s*/g, '$1' )
		.trim();
}

const SQL_KEYWORDS = [
	'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'INSERT', 'INTO', 'VALUES',
	'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX',
	'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP', 'BY', 'ORDER',
	'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'AS', 'IN', 'NOT', 'NULL', 'IS',
	'LIKE', 'BETWEEN', 'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
	'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'DISTINCT',
];

function formatSQL( str ) {
	let result = str.trim();
	// Uppercase keywords.
	SQL_KEYWORDS.forEach( ( kw ) => {
		const regex = new RegExp( '\\b' + kw + '\\b', 'gi' );
		result = result.replace( regex, kw );
	} );
	// Add newlines before main keywords.
	const lineBreakers = [ 'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY',
		'GROUP BY', 'HAVING', 'LIMIT', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN',
		'INNER JOIN', 'OUTER JOIN', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET',
		'DELETE', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'UNION' ];
	lineBreakers.forEach( ( kw ) => {
		const regex = new RegExp( '\\s+(' + kw.replace( / /g, '\\s+' ) + ')\\b', 'g' );
		result = result.replace( regex, '\n$1' );
	} );
	// Indent after SELECT, SET, VALUES.
	result = result.replace( /\bSELECT\b\s+/g, 'SELECT\n  ' );
	result = result.replace( /,\s*/g, ',\n  ' );
	return result.trim();
}

function minifySQL( str ) {
	return str.replace( /\s+/g, ' ' ).trim();
}

const formatters = {
	json: { format: formatJSON, minify: minifyJSON },
	html: { format: formatHTML, minify: minifyHTML },
	css: { format: formatCSS, minify: minifyCSS },
	js: { format: formatJS, minify: minifyJS },
	sql: { format: formatSQL, minify: minifySQL },
};

export default function CodeFormatter() {
	const [ language, setLanguage ] = useState( 'json' );
	const [ input, setInput ] = useState( '' );
	const [ output, setOutput ] = useState( '' );

	const handleFormat = useCallback( () => {
		if ( ! input ) return;
		setOutput( formatters[ language ].format( input ) );
	}, [ input, language ] );

	const handleMinify = useCallback( () => {
		if ( ! input ) return;
		setOutput( formatters[ language ].minify( input ) );
	}, [ input, language ] );

	const preview = output ? (
		<div className="mlc-wdt-formatter-preview">
			<div style={ { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' } }>
				<span className="mlc-wdt-section-label" style={ { margin: 0 } }>Output</span>
				<CopyButton text={ output } />
			</div>
			<pre className="mlc-wdt-code-pre"><code>{ output }</code></pre>
		</div>
	) : null;

	const controls = (
		<div className="mlc-wdt-formatter-controls">
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Language</label>
				<div className="mlc-wdt-radio-group">
					{ LANGUAGES.map( ( lang ) => (
						<label key={ lang.id } className={ `mlc-wdt-radio${ language === lang.id ? ' active' : '' }` }>
							<input
								type="radio"
								value={ lang.id }
								checked={ language === lang.id }
								onChange={ () => setLanguage( lang.id ) }
							/>
							{ lang.label }
						</label>
					) ) }
				</div>
			</div>

			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Input</label>
				<textarea
					className="mlc-wdt-textarea"
					rows="10"
					value={ input }
					onChange={ ( e ) => setInput( e.target.value ) }
					placeholder={ `Paste your ${ LANGUAGES.find( ( l ) => l.id === language )?.label } code here...` }
				/>
			</div>

			<div className="mlc-wdt-formatter-actions">
				<button className="mlc-wdt-download-btn" onClick={ handleFormat }>
					Beautify
				</button>
				<button className="mlc-wdt-download-btn mlc-wdt-download-btn-outline" onClick={ handleMinify }>
					Minify
				</button>
			</div>
		</div>
	);

	return (
		<ToolCard
			title="Code Formatter"
			help="Format (beautify) or minify JSON, HTML, CSS, JavaScript, and SQL code. Paste your code, select the language, and click Beautify or Minify."
			preview={ preview }
			controls={ controls }
		/>
	);
}
