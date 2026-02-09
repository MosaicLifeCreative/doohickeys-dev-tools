import { useState, useMemo } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CopyButton from '../components/CopyButton';

const TRANSFORMS = [
	{ id: 'uppercase', label: 'UPPERCASE', fn: ( s ) => s.toUpperCase() },
	{ id: 'lowercase', label: 'lowercase', fn: ( s ) => s.toLowerCase() },
	{
		id: 'titlecase',
		label: 'Title Case',
		fn: ( s ) => s.replace( /\b\w/g, ( c ) => c.toUpperCase() ),
	},
	{
		id: 'sentencecase',
		label: 'Sentence case',
		fn: ( s ) => s.toLowerCase().replace( /(^\w|[.!?]\s+\w)/g, ( c ) => c.toUpperCase() ),
	},
	{
		id: 'camelcase',
		label: 'camelCase',
		fn: ( s ) =>
			s.replace( /[-_\s]+(.)?/g, ( _, c ) => ( c ? c.toUpperCase() : '' ) )
				.replace( /^./, ( c ) => c.toLowerCase() ),
	},
	{
		id: 'pascalcase',
		label: 'PascalCase',
		fn: ( s ) =>
			s.replace( /[-_\s]+(.)?/g, ( _, c ) => ( c ? c.toUpperCase() : '' ) )
				.replace( /^./, ( c ) => c.toUpperCase() ),
	},
	{
		id: 'snakecase',
		label: 'snake_case',
		fn: ( s ) =>
			s.replace( /([A-Z])/g, '_$1' )
				.replace( /[-\s]+/g, '_' )
				.replace( /^_/, '' )
				.toLowerCase(),
	},
	{
		id: 'kebabcase',
		label: 'kebab-case',
		fn: ( s ) =>
			s.replace( /([A-Z])/g, '-$1' )
				.replace( /[_\s]+/g, '-' )
				.replace( /^-/, '' )
				.toLowerCase(),
	},
	{
		id: 'reverse',
		label: 'Reverse',
		fn: ( s ) => s.split( '' ).reverse().join( '' ),
	},
	{
		id: 'trim',
		label: 'Trim whitespace',
		fn: ( s ) => s.split( '\n' ).map( ( l ) => l.trim() ).join( '\n' ).trim(),
	},
	{
		id: 'remove-duplicates',
		label: 'Remove duplicate lines',
		fn: ( s ) => [ ...new Set( s.split( '\n' ) ) ].join( '\n' ),
	},
	{
		id: 'sort-lines',
		label: 'Sort lines A-Z',
		fn: ( s ) => s.split( '\n' ).sort( ( a, b ) => a.localeCompare( b ) ).join( '\n' ),
	},
];

export default function StringUtilities() {
	const [ input, setInput ] = useState( '' );
	const [ findText, setFindText ] = useState( '' );
	const [ replaceText, setReplaceText ] = useState( '' );

	const stats = useMemo( () => {
		const chars = input.length;
		const words = input.trim() ? input.trim().split( /\s+/ ).length : 0;
		const lines = input ? input.split( '\n' ).length : 0;
		const sentences = input.trim() ? input.split( /[.!?]+/ ).filter( ( s ) => s.trim() ).length : 0;
		return { chars, words, lines, sentences };
	}, [ input ] );

	const handleTransform = ( fn ) => {
		setInput( fn( input ) );
	};

	const handleFindReplace = () => {
		if ( ! findText ) return;
		setInput( input.split( findText ).join( replaceText ) );
	};

	const preview = (
		<div className="mlc-wdt-string-stats">
			<div className="mlc-wdt-string-stat">
				<span className="mlc-wdt-string-stat-value">{ stats.chars }</span>
				<span className="mlc-wdt-string-stat-label">Characters</span>
			</div>
			<div className="mlc-wdt-string-stat">
				<span className="mlc-wdt-string-stat-value">{ stats.words }</span>
				<span className="mlc-wdt-string-stat-label">Words</span>
			</div>
			<div className="mlc-wdt-string-stat">
				<span className="mlc-wdt-string-stat-value">{ stats.lines }</span>
				<span className="mlc-wdt-string-stat-label">Lines</span>
			</div>
			<div className="mlc-wdt-string-stat">
				<span className="mlc-wdt-string-stat-value">{ stats.sentences }</span>
				<span className="mlc-wdt-string-stat-label">Sentences</span>
			</div>
		</div>
	);

	const controls = (
		<div className="mlc-wdt-string-controls">
			<div className="mlc-wdt-control-group">
				<div style={ { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' } }>
					<label className="mlc-wdt-control-label" style={ { margin: 0 } }>Text</label>
					<CopyButton text={ input } />
				</div>
				<textarea
					className="mlc-wdt-textarea"
					rows="8"
					value={ input }
					onChange={ ( e ) => setInput( e.target.value ) }
					placeholder="Type or paste text here..."
				/>
			</div>

			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Transform</label>
				<div className="mlc-wdt-string-transforms">
					{ TRANSFORMS.map( ( t ) => (
						<button
							key={ t.id }
							className="mlc-wdt-string-transform-btn"
							onClick={ () => handleTransform( t.fn ) }
						>
							{ t.label }
						</button>
					) ) }
				</div>
			</div>

			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Find & Replace</label>
				<div className="mlc-wdt-string-find-row">
					<input
						type="text"
						className="mlc-wdt-text-input"
						placeholder="Find..."
						value={ findText }
						onChange={ ( e ) => setFindText( e.target.value ) }
					/>
					<input
						type="text"
						className="mlc-wdt-text-input"
						placeholder="Replace with..."
						value={ replaceText }
						onChange={ ( e ) => setReplaceText( e.target.value ) }
					/>
					<button className="mlc-wdt-download-btn" onClick={ handleFindReplace }>
						Replace All
					</button>
				</div>
			</div>
		</div>
	);

	return (
		<ToolCard
			title="String Utilities"
			help="Transform text case, reverse, trim, sort lines, remove duplicates, find & replace, and get character/word/line counts."
			preview={ preview }
			controls={ controls }
		/>
	);
}
