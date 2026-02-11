import { useState, useMemo } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CodeBlock from '../components/CodeBlock';
import ProBadge from '../components/ProBadge';

const JUSTIFY_ITEMS_OPTIONS = [ 'stretch', 'start', 'end', 'center' ];
const ALIGN_ITEMS_OPTIONS = [ 'stretch', 'start', 'end', 'center' ];
const JUSTIFY_CONTENT_OPTIONS = [ 'start', 'end', 'center', 'stretch', 'space-between', 'space-around', 'space-evenly' ];
const ALIGN_CONTENT_OPTIONS = [ 'start', 'end', 'center', 'stretch', 'space-between', 'space-around', 'space-evenly' ];

const CELL_COLORS = [
	'#0073aa', '#e35b5b', '#46b450', '#ffb900',
	'#9b59b6', '#3498db', '#1abc9c', '#e67e22',
	'#2c3e50', '#e74c3c', '#27ae60', '#f39c12',
	'#8e44ad', '#16a085', '#d35400', '#2980b9',
	'#c0392b', '#7f8c8d', '#34495e', '#f1c40f',
];

const TEMPLATES = [
	{ label: 'Holy Grail', cols: '200px 1fr 200px', rows: 'auto 1fr auto', areas: '"header header header" "nav main aside" "footer footer footer"', cells: 4 },
	{ label: '12 Col Grid', cols: 'repeat(12, 1fr)', rows: 'auto', areas: '', cells: 12 },
	{ label: 'Cards (3 Col)', cols: 'repeat(3, 1fr)', rows: 'auto', areas: '', cells: 6 },
	{ label: 'Sidebar + Main', cols: '250px 1fr', rows: '1fr', areas: '', cells: 2 },
	{ label: 'Dashboard', cols: 'repeat(4, 1fr)', rows: 'auto auto', areas: '', cells: 8 },
	{ label: 'Masonry-ish', cols: 'repeat(3, 1fr)', rows: '150px 150px 150px', areas: '', cells: 9 },
];

function OptionRow( { label, value, options, onChange } ) {
	return (
		<div className="mlc-wdt-control-group">
			<label className="mlc-wdt-control-label">{ label }</label>
			<div className="mlc-wdt-flex-options">
				{ options.map( ( opt ) => (
					<button
						key={ opt }
						className={ `mlc-wdt-flex-option-btn${ value === opt ? ' active' : '' }` }
						onClick={ () => onChange( opt ) }
					>
						{ opt }
					</button>
				) ) }
			</div>
		</div>
	);
}

export default function GridGenerator() {
	const [ cols, setCols ] = useState( 3 );
	const [ rows, setRows ] = useState( 3 );
	const [ colSizing, setColSizing ] = useState( '1fr' );
	const [ rowSizing, setRowSizing ] = useState( 'auto' );
	const [ colGap, setColGap ] = useState( 10 );
	const [ rowGap, setRowGap ] = useState( 10 );
	const [ justifyItems, setJustifyItems ] = useState( 'stretch' );
	const [ alignItems, setAlignItems ] = useState( 'stretch' );
	const [ justifyContent, setJustifyContent ] = useState( 'start' );
	const [ alignContent, setAlignContent ] = useState( 'start' );

	// Custom column / row definitions
	const [ customCols, setCustomCols ] = useState( '' );
	const [ customRows, setCustomRows ] = useState( '' );

	// Per-cell overrides (span)
	const [ selectedCell, setSelectedCell ] = useState( null );
	const [ cells, setCells ] = useState( () =>
		Array.from( { length: 36 }, () => ( {
			colSpan: 1,
			rowSpan: 1,
		} ) )
	);

	const updateCell = ( idx, field, val ) => {
		setCells( ( prev ) => {
			const next = [ ...prev ];
			next[ idx ] = { ...next[ idx ], [ field ]: val };
			return next;
		} );
	};

	const totalCells = cols * rows;

	const gridTemplateCols = customCols || `repeat(${ cols }, ${ colSizing })`;
	const gridTemplateRows = customRows || `repeat(${ rows }, ${ rowSizing })`;

	const containerStyle = useMemo( () => ( {
		display: 'grid',
		gridTemplateColumns: gridTemplateCols,
		gridTemplateRows: gridTemplateRows,
		columnGap: `${ colGap }px`,
		rowGap: `${ rowGap }px`,
		justifyItems,
		alignItems,
		justifyContent,
		alignContent,
		minHeight: '250px',
		padding: '12px',
		border: '2px dashed #c3c4c7',
		borderRadius: '6px',
		background: '#f9fafb',
		transition: 'all 0.2s',
	} ), [ gridTemplateCols, gridTemplateRows, colGap, rowGap, justifyItems, alignItems, justifyContent, alignContent ] );

	const cssOutput = useMemo( () => {
		const lines = [
			'display: grid;',
			`grid-template-columns: ${ gridTemplateCols };`,
			`grid-template-rows: ${ gridTemplateRows };`,
		];
		if ( colGap > 0 || rowGap > 0 ) {
			if ( colGap === rowGap ) {
				lines.push( `gap: ${ colGap }px;` );
			} else {
				lines.push( `gap: ${ rowGap }px ${ colGap }px;` );
			}
		}
		if ( justifyItems !== 'stretch' ) lines.push( `justify-items: ${ justifyItems };` );
		if ( alignItems !== 'stretch' ) lines.push( `align-items: ${ alignItems };` );
		if ( justifyContent !== 'start' ) lines.push( `justify-content: ${ justifyContent };` );
		if ( alignContent !== 'start' ) lines.push( `align-content: ${ alignContent };` );

		let css = `.grid-container {\n${ lines.map( ( l ) => `  ${ l }` ).join( '\n' ) }\n}`;

		// Cell overrides
		const activeCells = cells.slice( 0, totalCells );
		activeCells.forEach( ( cell, i ) => {
			const cellLines = [];
			if ( cell.colSpan > 1 ) cellLines.push( `  grid-column: span ${ cell.colSpan };` );
			if ( cell.rowSpan > 1 ) cellLines.push( `  grid-row: span ${ cell.rowSpan };` );
			if ( cellLines.length > 0 ) {
				css += `\n\n.cell-${ i + 1 } {\n${ cellLines.join( '\n' ) }\n}`;
			}
		} );

		return css;
	}, [ gridTemplateCols, gridTemplateRows, colGap, rowGap, justifyItems, alignItems, justifyContent, alignContent, cells, totalCells ] );

	const applyTemplate = ( template ) => {
		setCustomCols( template.cols );
		setCustomRows( template.rows );
		// Reset spans
		setCells( Array.from( { length: 36 }, () => ( { colSpan: 1, rowSpan: 1 } ) ) );
		setSelectedCell( null );
	};

	const preview = (
		<div>
			<div style={ containerStyle }>
				{ Array.from( { length: totalCells } ).map( ( _, i ) => {
					const cell = cells[ i ];
					const cellStyle = {
						background: CELL_COLORS[ i % CELL_COLORS.length ],
						color: '#fff',
						padding: '12px',
						borderRadius: '4px',
						fontSize: '13px',
						fontWeight: 600,
						cursor: 'pointer',
						outline: selectedCell === i ? '3px solid #23282d' : 'none',
						outlineOffset: '2px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						minHeight: '48px',
						gridColumn: cell.colSpan > 1 ? `span ${ cell.colSpan }` : undefined,
						gridRow: cell.rowSpan > 1 ? `span ${ cell.rowSpan }` : undefined,
						transition: 'all 0.2s',
					};
					return (
						<div
							key={ i }
							style={ cellStyle }
							onClick={ () => setSelectedCell( selectedCell === i ? null : i ) }
							title={ `Cell ${ i + 1 } — click to edit` }
						>
							{ i + 1 }
						</div>
					);
				} ) }
			</div>
			<p className="mlc-wdt-tip">Click a cell to set column/row span.</p>
		</div>
	);

	const controls = (
		<div className="mlc-wdt-grid-controls">
			{ /* Templates (Pro) */ }
			<ProBadge feature="Grid templates are a Pro feature">
				<div className="mlc-wdt-control-group">
					<label className="mlc-wdt-control-label">Templates</label>
					<div className="mlc-wdt-grid-templates">
						{ TEMPLATES.map( ( t ) => (
							<button
								key={ t.label }
								className="mlc-wdt-flex-option-btn"
								onClick={ () => applyTemplate( t ) }
							>
								{ t.label }
							</button>
						) ) }
					</div>
				</div>
			</ProBadge>

			{ /* Columns / Rows */ }
			<div className="mlc-wdt-grid-dims">
				<div className="mlc-wdt-control-group">
					<label className="mlc-wdt-control-label">Columns: { cols }</label>
					<input
						type="range"
						className="mlc-wdt-range"
						min="1"
						max="6"
						value={ cols }
						onChange={ ( e ) => {
							setCols( parseInt( e.target.value ) );
							setCustomCols( '' );
							if ( selectedCell !== null && selectedCell >= parseInt( e.target.value ) * rows ) {
								setSelectedCell( null );
							}
						} }
					/>
				</div>
				<div className="mlc-wdt-control-group">
					<label className="mlc-wdt-control-label">Rows: { rows }</label>
					<input
						type="range"
						className="mlc-wdt-range"
						min="1"
						max="6"
						value={ rows }
						onChange={ ( e ) => {
							setRows( parseInt( e.target.value ) );
							setCustomRows( '' );
							if ( selectedCell !== null && selectedCell >= cols * parseInt( e.target.value ) ) {
								setSelectedCell( null );
							}
						} }
					/>
				</div>
			</div>

			{ /* Sizing */ }
			<div className="mlc-wdt-grid-dims">
				<div className="mlc-wdt-control-group">
					<label className="mlc-wdt-control-label">Column Sizing</label>
					<select
						className="mlc-wdt-select"
						value={ colSizing }
						onChange={ ( e ) => { setColSizing( e.target.value ); setCustomCols( '' ); } }
					>
						<option value="1fr">1fr (equal)</option>
						<option value="auto">auto</option>
						<option value="100px">100px</option>
						<option value="150px">150px</option>
						<option value="200px">200px</option>
						<option value="minmax(100px, 1fr)">minmax(100px, 1fr)</option>
					</select>
				</div>
				<div className="mlc-wdt-control-group">
					<label className="mlc-wdt-control-label">Row Sizing</label>
					<select
						className="mlc-wdt-select"
						value={ rowSizing }
						onChange={ ( e ) => { setRowSizing( e.target.value ); setCustomRows( '' ); } }
					>
						<option value="auto">auto</option>
						<option value="1fr">1fr (equal)</option>
						<option value="100px">100px</option>
						<option value="150px">150px</option>
						<option value="200px">200px</option>
						<option value="minmax(80px, auto)">minmax(80px, auto)</option>
					</select>
				</div>
			</div>

			{ /* Custom definitions (Pro) */ }
			<ProBadge feature="Custom grid definitions are a Pro feature">
				<div className="mlc-wdt-control-group">
					<label className="mlc-wdt-control-label">Custom Column Definition</label>
					<input
						type="text"
						className="mlc-wdt-text-input"
						placeholder="e.g. 200px 1fr 200px"
						value={ customCols }
						onChange={ ( e ) => setCustomCols( e.target.value ) }
					/>
				</div>
				<div className="mlc-wdt-control-group">
					<label className="mlc-wdt-control-label">Custom Row Definition</label>
					<input
						type="text"
						className="mlc-wdt-text-input"
						placeholder="e.g. auto 1fr auto"
						value={ customRows }
						onChange={ ( e ) => setCustomRows( e.target.value ) }
					/>
				</div>
			</ProBadge>

			{ /* Gaps */ }
			<div className="mlc-wdt-grid-dims">
				<div className="mlc-wdt-control-group">
					<label className="mlc-wdt-control-label">Column Gap: { colGap }px</label>
					<input
						type="range"
						className="mlc-wdt-range"
						min="0"
						max="40"
						value={ colGap }
						onChange={ ( e ) => setColGap( parseInt( e.target.value ) ) }
					/>
				</div>
				<div className="mlc-wdt-control-group">
					<label className="mlc-wdt-control-label">Row Gap: { rowGap }px</label>
					<input
						type="range"
						className="mlc-wdt-range"
						min="0"
						max="40"
						value={ rowGap }
						onChange={ ( e ) => setRowGap( parseInt( e.target.value ) ) }
					/>
				</div>
			</div>

			{ /* Alignment */ }
			<OptionRow label="justify-items" value={ justifyItems } options={ JUSTIFY_ITEMS_OPTIONS } onChange={ setJustifyItems } />
			<OptionRow label="align-items" value={ alignItems } options={ ALIGN_ITEMS_OPTIONS } onChange={ setAlignItems } />
			<OptionRow label="justify-content" value={ justifyContent } options={ JUSTIFY_CONTENT_OPTIONS } onChange={ setJustifyContent } />
			<OptionRow label="align-content" value={ alignContent } options={ ALIGN_CONTENT_OPTIONS } onChange={ setAlignContent } />

			{ /* Per-cell controls (Pro) */ }
			{ selectedCell !== null && selectedCell < totalCells && (
				<ProBadge feature="Per-cell span controls are a Pro feature">
				<div className="mlc-wdt-flex-item-controls">
					<label className="mlc-wdt-control-label">
						Cell { selectedCell + 1 } Properties
						<button
							className="mlc-wdt-flex-deselect"
							onClick={ () => setSelectedCell( null ) }
						>
							Close
						</button>
					</label>

					<div className="mlc-wdt-flex-item-fields">
						<div className="mlc-wdt-flex-item-field">
							<span className="mlc-wdt-palette-slider-label">Column Span</span>
							<input
								type="range"
								className="mlc-wdt-range"
								min="1"
								max={ cols }
								value={ cells[ selectedCell ].colSpan }
								onChange={ ( e ) => updateCell( selectedCell, 'colSpan', parseInt( e.target.value ) ) }
							/>
							<span className="mlc-wdt-field-value">{ cells[ selectedCell ].colSpan }</span>
						</div>
						<div className="mlc-wdt-flex-item-field">
							<span className="mlc-wdt-palette-slider-label">Row Span</span>
							<input
								type="range"
								className="mlc-wdt-range"
								min="1"
								max={ rows }
								value={ cells[ selectedCell ].rowSpan }
								onChange={ ( e ) => updateCell( selectedCell, 'rowSpan', parseInt( e.target.value ) ) }
							/>
							<span className="mlc-wdt-field-value">{ cells[ selectedCell ].rowSpan }</span>
						</div>
					</div>
				</div>
				</ProBadge>
			) }
		</div>
	);

	const output = (
		<CodeBlock label="CSS" code={ cssOutput } />
	);

	return (
		<ToolCard
			title="CSS Grid Generator"
			help="Visual CSS Grid layout builder. Set columns, rows, gaps, and alignment. Use templates for common layouts. Click cells to set column/row spans."
			preview={ preview }
			controls={ controls }
			output={ output }
		/>
	);
}
