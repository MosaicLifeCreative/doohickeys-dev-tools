import { useState, useMemo, useCallback } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CopyButton from '../components/CopyButton';

const CLASSIC_WORDS = [
	'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
	'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
	'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
	'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
	'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
	'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
	'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
	'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
	'accusamus', 'iusto', 'odio', 'dignissimos', 'ducimus', 'blanditiis',
	'praesentium', 'voluptatum', 'deleniti', 'atque', 'corrupti', 'quos', 'dolores',
	'quas', 'molestias', 'recusandae', 'itaque', 'earum', 'rerum', 'hic', 'tenetur',
	'sapiente', 'delectus', 'aut', 'reiciendis', 'voluptatibus', 'maiores', 'alias',
	'perferendis', 'doloribus', 'asperiores', 'repellat', 'temporibus', 'quibusdam',
	'officiis', 'debitis', 'necessitatibus', 'saepe', 'eveniet', 'voluptates',
	'repudiandae', 'recusandae', 'libero', 'tempore', 'cum', 'soluta', 'nobis',
	'eligendi', 'optio', 'cumque', 'nihil', 'impedit', 'quo', 'minus', 'maxime',
	'placeat', 'facere', 'possimus', 'omnis', 'voluptas', 'assumenda',
];

const FIRST_SENTENCE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

function randomWord() {
	return CLASSIC_WORDS[ Math.floor( Math.random() * CLASSIC_WORDS.length ) ];
}

function generateSentence( minWords = 6, maxWords = 14 ) {
	const count = minWords + Math.floor( Math.random() * ( maxWords - minWords + 1 ) );
	const words = [];
	for ( let i = 0; i < count; i++ ) {
		words.push( randomWord() );
	}
	// Add a comma after word 3-5 sometimes.
	if ( count > 6 && Math.random() > 0.5 ) {
		const commaPos = 2 + Math.floor( Math.random() * 3 );
		if ( commaPos < words.length - 1 ) {
			words[ commaPos ] += ',';
		}
	}
	words[ 0 ] = words[ 0 ].charAt( 0 ).toUpperCase() + words[ 0 ].slice( 1 );
	return words.join( ' ' ) + '.';
}

function generateParagraph( sentenceCount = 4 ) {
	const sentences = [];
	for ( let i = 0; i < sentenceCount; i++ ) {
		sentences.push( generateSentence() );
	}
	return sentences.join( ' ' );
}

export default function LoremIpsumGenerator() {
	const [ mode, setMode ] = useState( 'paragraphs' );
	const [ count, setCount ] = useState( 3 );
	const [ startClassic, setStartClassic ] = useState( true );
	const [ includeHtml, setIncludeHtml ] = useState( false );
	const [ seed, setSeed ] = useState( 0 );

	const regenerate = useCallback( () => {
		setSeed( ( prev ) => prev + 1 );
	}, [] );

	const output = useMemo( () => {
		// eslint-disable-next-line no-unused-vars
		const _trigger = seed; // Force re-compute on regenerate.

		if ( mode === 'paragraphs' ) {
			const paras = [];
			for ( let i = 0; i < count; i++ ) {
				let para = generateParagraph( 3 + Math.floor( Math.random() * 3 ) );
				if ( i === 0 && startClassic ) {
					para = FIRST_SENTENCE + ' ' + para;
				}
				paras.push( para );
			}
			if ( includeHtml ) {
				return paras.map( ( p ) => `<p>${ p }</p>` ).join( '\n\n' );
			}
			return paras.join( '\n\n' );
		}

		if ( mode === 'sentences' ) {
			const sentences = [];
			for ( let i = 0; i < count; i++ ) {
				if ( i === 0 && startClassic ) {
					sentences.push( FIRST_SENTENCE );
				} else {
					sentences.push( generateSentence() );
				}
			}
			return sentences.join( ' ' );
		}

		// Words.
		const words = [];
		if ( startClassic ) {
			const classic = 'lorem ipsum dolor sit amet'.split( ' ' );
			words.push( ...classic.slice( 0, Math.min( count, classic.length ) ) );
		}
		while ( words.length < count ) {
			words.push( randomWord() );
		}
		return words.join( ' ' );
	}, [ mode, count, startClassic, includeHtml, seed ] );

	const wordCount = output.split( /\s+/ ).filter( Boolean ).length;
	const charCount = output.length;

	const preview = (
		<div className="mlc-wdt-lorem-preview">
			<div className="mlc-wdt-lorem-text">{ output }</div>
			<div className="mlc-wdt-lorem-stats">
				<span>{ wordCount } words</span>
				<span>{ charCount } characters</span>
			</div>
		</div>
	);

	const controls = (
		<div className="mlc-wdt-lorem-controls">
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Type</label>
				<div className="mlc-wdt-radio-group">
					{ [ 'paragraphs', 'sentences', 'words' ].map( ( m ) => (
						<label key={ m } className={ `mlc-wdt-radio${ mode === m ? ' active' : '' }` }>
							<input
								type="radio"
								value={ m }
								checked={ mode === m }
								onChange={ () => setMode( m ) }
							/>
							{ m.charAt( 0 ).toUpperCase() + m.slice( 1 ) }
						</label>
					) ) }
				</div>
			</div>

			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">
					Count: { count }
				</label>
				<div className="mlc-wdt-range-with-value">
					<input
						type="range"
						className="mlc-wdt-range"
						min="1"
						max={ mode === 'words' ? 500 : mode === 'sentences' ? 50 : 20 }
						value={ count }
						onChange={ ( e ) => setCount( Number( e.target.value ) ) }
					/>
					<span className="mlc-wdt-field-value">{ count }</span>
				</div>
			</div>

			<div className="mlc-wdt-control-group">
				<div className="mlc-wdt-lorem-options">
					<label className="mlc-wdt-checkbox">
						<input
							type="checkbox"
							checked={ startClassic }
							onChange={ ( e ) => setStartClassic( e.target.checked ) }
						/>
						Start with "Lorem ipsum dolor sit amet..."
					</label>
					{ mode === 'paragraphs' && (
						<label className="mlc-wdt-checkbox">
							<input
								type="checkbox"
								checked={ includeHtml }
								onChange={ ( e ) => setIncludeHtml( e.target.checked ) }
							/>
							Wrap in &lt;p&gt; tags
						</label>
					) }
				</div>
			</div>

			<button className="mlc-wdt-add-btn" onClick={ regenerate }>
				Regenerate
			</button>
		</div>
	);

	const outputSection = (
		<div className="mlc-wdt-lorem-output">
			<div style={ { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' } }>
				<span className="mlc-wdt-section-label" style={ { margin: 0 } }>Output</span>
				<CopyButton text={ output } />
			</div>
			<pre className="mlc-wdt-code-pre"><code>{ output }</code></pre>
		</div>
	);

	return (
		<ToolCard
			title="Lorem Ipsum Generator"
			help="Generate placeholder text for mockups and layouts. Choose paragraphs, sentences, or words. Optionally wrap in HTML paragraph tags."
			preview={ preview }
			controls={ controls }
			output={ outputSection }
		/>
	);
}
