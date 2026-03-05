import { useState, useMemo } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import ProBadge from '../components/ProBadge';

function computeDiff( a, b ) {
	const linesA = a.split( '\n' );
	const linesB = b.split( '\n' );
	const result = [];
	const maxLen = Math.max( linesA.length, linesB.length );

	// Simple line-by-line comparison.
	// Build LCS for better diff.
	const m = linesA.length;
	const n = linesB.length;
	const dp = Array( m + 1 ).fill( null ).map( () => Array( n + 1 ).fill( 0 ) );

	for ( let i = 1; i <= m; i++ ) {
		for ( let j = 1; j <= n; j++ ) {
			if ( linesA[ i - 1 ] === linesB[ j - 1 ] ) {
				dp[ i ][ j ] = dp[ i - 1 ][ j - 1 ] + 1;
			} else {
				dp[ i ][ j ] = Math.max( dp[ i - 1 ][ j ], dp[ i ][ j - 1 ] );
			}
		}
	}

	// Backtrack to find diff.
	let i = m;
	let j = n;
	const ops = [];

	while ( i > 0 || j > 0 ) {
		if ( i > 0 && j > 0 && linesA[ i - 1 ] === linesB[ j - 1 ] ) {
			ops.unshift( { type: 'equal', lineA: i, lineB: j, text: linesA[ i - 1 ] } );
			i--;
			j--;
		} else if ( j > 0 && ( i === 0 || dp[ i ][ j - 1 ] >= dp[ i - 1 ][ j ] ) ) {
			ops.unshift( { type: 'add', lineB: j, text: linesB[ j - 1 ] } );
			j--;
		} else {
			ops.unshift( { type: 'remove', lineA: i, text: linesA[ i - 1 ] } );
			i--;
		}
	}

	return ops;
}

export default function DiffChecker() {
	const [ textA, setTextA ] = useState( '' );
	const [ textB, setTextB ] = useState( '' );

	const diff = useMemo( () => {
		if ( ! textA && ! textB ) return [];
		return computeDiff( textA, textB );
	}, [ textA, textB ] );

	const stats = useMemo( () => {
		const added = diff.filter( ( d ) => d.type === 'add' ).length;
		const removed = diff.filter( ( d ) => d.type === 'remove' ).length;
		const unchanged = diff.filter( ( d ) => d.type === 'equal' ).length;
		return { added, removed, unchanged };
	}, [ diff ] );

	const preview = diff.length > 0 ? (
		<div className="mlc-wdt-diff-preview">
			<div className="mlc-wdt-diff-stats">
				<span className="mlc-wdt-diff-stat-add">+{ stats.added } added</span>
				<span className="mlc-wdt-diff-stat-remove">-{ stats.removed } removed</span>
				<span className="mlc-wdt-diff-stat-equal">{ stats.unchanged } unchanged</span>
			</div>
			<div className="mlc-wdt-diff-output">
				{ diff.map( ( op, idx ) => (
					<div
						key={ idx }
						className={ `mlc-wdt-diff-line mlc-wdt-diff-${ op.type }` }
					>
						<span className="mlc-wdt-diff-gutter">
							{ op.type === 'add' ? '+' : op.type === 'remove' ? '-' : ' ' }
						</span>
						<span className="mlc-wdt-diff-text">{ op.text || '\u00A0' }</span>
					</div>
				) ) }
			</div>
		</div>
	) : null;

	const controls = (
		<div className="mlc-wdt-diff-controls">
			<div className="mlc-wdt-diff-inputs">
				<div className="mlc-wdt-diff-input-col">
					<label className="mlc-wdt-control-label">Original</label>
					<textarea
						className="mlc-wdt-textarea mlc-wdt-textarea-mono"
						rows="12"
						value={ textA }
						onChange={ ( e ) => setTextA( e.target.value ) }
						placeholder="Paste original text here..."
					/>
				</div>
				<div className="mlc-wdt-diff-input-col">
					<label className="mlc-wdt-control-label">Modified</label>
					<textarea
						className="mlc-wdt-textarea mlc-wdt-textarea-mono"
						rows="12"
						value={ textB }
						onChange={ ( e ) => setTextB( e.target.value ) }
						placeholder="Paste modified text here..."
					/>
				</div>
			</div>
		</div>
	);

	return (
		<ProBadge feature="Diff Checker is a Pro feature">
			<ToolCard
				title="Diff Checker"
				help="Compare two pieces of text side by side. Shows additions, removals, and unchanged lines with color coding."
				preview={ preview }
				controls={ controls }
			/>
		</ProBadge>
	);
}
