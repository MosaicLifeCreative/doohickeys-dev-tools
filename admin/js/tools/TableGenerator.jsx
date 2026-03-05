import { useState, useCallback } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CodeBlock from '../components/CodeBlock';
import ColorPicker from '../components/ColorPicker';
import ProBadge from '../components/ProBadge';

export default function TableGenerator() {
	const [ rows, setRows ] = useState( 4 );
	const [ cols, setCols ] = useState( 3 );
	const [ hasHeader, setHasHeader ] = useState( true );
	const [ striped, setStriped ] = useState( true );
	const [ bordered, setBordered ] = useState( true );
	const [ hover, setHover ] = useState( true );
	const [ headerBg, setHeaderBg ] = useState( '#0073aa' );
	const [ headerText, setHeaderText ] = useState( '#ffffff' );
	const [ cells, setCells ] = useState( () => createCells( 4, 3 ) );

	function createCells( r, c ) {
		const data = [];
		for ( let i = 0; i < r; i++ ) {
			const row = [];
			for ( let j = 0; j < c; j++ ) {
				row.push( i === 0 ? `Header ${ j + 1 }` : `Row ${ i } Col ${ j + 1 }` );
			}
			data.push( row );
		}
		return data;
	}

	const updateDimensions = useCallback( ( newRows, newCols ) => {
		setRows( newRows );
		setCols( newCols );
		setCells( ( prev ) => {
			const data = [];
			for ( let i = 0; i < newRows; i++ ) {
				const row = [];
				for ( let j = 0; j < newCols; j++ ) {
					row.push( prev[ i ]?.[ j ] || ( i === 0 ? `Header ${ j + 1 }` : `Cell` ) );
				}
				data.push( row );
			}
			return data;
		} );
	}, [] );

	const updateCell = useCallback( ( r, c, value ) => {
		setCells( ( prev ) => {
			const updated = prev.map( ( row ) => [ ...row ] );
			updated[ r ][ c ] = value;
			return updated;
		} );
	}, [] );

	const tableStyle = [
		'table { width: 100%; border-collapse: collapse; }',
		bordered ? 'th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }' : 'th, td { padding: 8px 12px; text-align: left; }',
		hasHeader ? `thead th { background: ${ headerBg }; color: ${ headerText }; font-weight: 600; }` : '',
		striped ? 'tbody tr:nth-child(even) { background: #f9f9f9; }' : '',
		hover ? 'tbody tr:hover { background: #e8f0fe; }' : '',
	].filter( Boolean ).join( '\n' );

	const generateHTML = () => {
		let html = '<table>\n';
		const startRow = hasHeader ? 1 : 0;

		if ( hasHeader && cells.length > 0 ) {
			html += '  <thead>\n    <tr>\n';
			cells[ 0 ].forEach( ( cell ) => {
				html += `      <th>${ cell }</th>\n`;
			} );
			html += '    </tr>\n  </thead>\n';
		}

		html += '  <tbody>\n';
		for ( let i = startRow; i < cells.length; i++ ) {
			html += '    <tr>\n';
			cells[ i ].forEach( ( cell ) => {
				html += `      <td>${ cell }</td>\n`;
			} );
			html += '    </tr>\n';
		}
		html += '  </tbody>\n</table>';
		return html;
	};

	const inlineStyle = {};
	if ( bordered ) {
		inlineStyle.border = '1px solid #ddd';
		inlineStyle.borderCollapse = 'collapse';
	}

	const preview = (
		<div className="mlc-wdt-table-preview">
			<table style={ { width: '100%', borderCollapse: 'collapse' } }>
				{ hasHeader && cells.length > 0 && (
					<thead>
						<tr>
							{ cells[ 0 ].map( ( cell, j ) => (
								<th
									key={ j }
									style={ {
										background: headerBg,
										color: headerText,
										fontWeight: 600,
										padding: '8px 12px',
										border: bordered ? '1px solid #ddd' : 'none',
									} }
								>
									{ cell }
								</th>
							) ) }
						</tr>
					</thead>
				) }
				<tbody>
					{ cells.slice( hasHeader ? 1 : 0 ).map( ( row, i ) => (
						<tr
							key={ i }
							style={ {
								background: striped && i % 2 === 1 ? '#f9f9f9' : 'transparent',
							} }
						>
							{ row.map( ( cell, j ) => (
								<td
									key={ j }
									style={ {
										padding: '8px 12px',
										border: bordered ? '1px solid #ddd' : 'none',
									} }
								>
									{ cell }
								</td>
							) ) }
						</tr>
					) ) }
				</tbody>
			</table>
		</div>
	);

	const controls = (
		<div className="mlc-wdt-table-controls">
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Dimensions</label>
				<div className="mlc-wdt-placeholder-dims">
					<div className="mlc-wdt-placeholder-dim">
						<label className="mlc-wdt-range-label">Rows</label>
						<input
							type="number"
							className="mlc-wdt-text-input"
							value={ rows }
							min="1"
							max="20"
							onChange={ ( e ) => updateDimensions( Math.max( 1, Math.min( 20, Number( e.target.value ) || 1 ) ), cols ) }
						/>
					</div>
					<span className="mlc-wdt-placeholder-x">&times;</span>
					<div className="mlc-wdt-placeholder-dim">
						<label className="mlc-wdt-range-label">Columns</label>
						<input
							type="number"
							className="mlc-wdt-text-input"
							value={ cols }
							min="1"
							max="10"
							onChange={ ( e ) => updateDimensions( rows, Math.max( 1, Math.min( 10, Number( e.target.value ) || 1 ) ) ) }
						/>
					</div>
				</div>
			</div>

			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Options</label>
				<div className="mlc-wdt-lorem-options">
					<label className="mlc-wdt-checkbox">
						<input type="checkbox" checked={ hasHeader } onChange={ ( e ) => setHasHeader( e.target.checked ) } />
						Header row
					</label>
					<label className="mlc-wdt-checkbox">
						<input type="checkbox" checked={ bordered } onChange={ ( e ) => setBordered( e.target.checked ) } />
						Bordered
					</label>
					<label className="mlc-wdt-checkbox">
						<input type="checkbox" checked={ striped } onChange={ ( e ) => setStriped( e.target.checked ) } />
						Striped rows
					</label>
					<label className="mlc-wdt-checkbox">
						<input type="checkbox" checked={ hover } onChange={ ( e ) => setHover( e.target.checked ) } />
						Hover highlight
					</label>
				</div>
			</div>

			{ hasHeader && (
				<div className="mlc-wdt-control-group">
					<label className="mlc-wdt-control-label">Header Colors</label>
					<div className="mlc-wdt-color-row">
						<ColorPicker color={ headerBg } onChange={ setHeaderBg } label="Background" />
						<ColorPicker color={ headerText } onChange={ setHeaderText } label="Text" />
					</div>
				</div>
			) }

			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Edit Cells</label>
				<div className="mlc-wdt-table-edit" style={ { overflowX: 'auto' } }>
					<table style={ { borderCollapse: 'collapse' } }>
						<tbody>
							{ cells.map( ( row, i ) => (
								<tr key={ i }>
									{ row.map( ( cell, j ) => (
										<td key={ j } style={ { padding: '2px' } }>
											<input
												type="text"
												className="mlc-wdt-text-input"
												value={ cell }
												onChange={ ( e ) => updateCell( i, j, e.target.value ) }
												style={ { width: '120px', fontSize: '12px', padding: '4px 6px' } }
											/>
										</td>
									) ) }
								</tr>
							) ) }
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);

	const output = (
		<div>
			<CodeBlock code={ generateHTML() } label="HTML" />
			<CodeBlock code={ tableStyle } label="CSS" />
		</div>
	);

	return (
		<ProBadge feature="HTML Table Generator is a Pro feature">
			<ToolCard
				title="HTML Table Generator"
				help="Build and style HTML tables with a visual editor. Set dimensions, edit cell content, customize header colors, and toggle borders, stripes, and hover effects."
				preview={ preview }
				controls={ controls }
				output={ output }
			/>
		</ProBadge>
	);
}
