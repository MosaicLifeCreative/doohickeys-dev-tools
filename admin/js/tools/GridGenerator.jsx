import { useState, useMemo } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CodeBlock from '../components/CodeBlock';

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

	const totalCells = cols * rows;

	const gridTemplateCols = `repeat(${ cols }, ${ colSizing })`;
	const gridTemplateRows = `repeat(${ rows }, ${ rowSizing })`;

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

		return `.grid-container {\n${ lines.map( ( l ) => `  ${ l }` ).join( '\n' ) }\n}`;
	}, [ gridTemplateCols, gridTemplateRows, colGap, rowGap, justifyItems, alignItems, justifyContent, alignContent ] );

	const preview = (
		<div>
			<div style={ containerStyle }>
				{ Array.from( { length: totalCells } ).map( ( _, i ) => {
					const cellStyle = {
						background: CELL_COLORS[ i % CELL_COLORS.length ],
						color: '#fff',
						padding: '12px',
						borderRadius: '4px',
						fontSize: '13px',
						fontWeight: 600,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						minHeight: '48px',
						transition: 'all 0.2s',
					};
					return (
						<div key={ i } style={ cellStyle }>
							{ i + 1 }
						</div>
					);
				} ) }
			</div>
		</div>
	);

	const upgradeUrl = window.mlcWdtData?.upgradeUrl;

	const controls = (
		<div className="mlc-wdt-grid-controls">
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
						onChange={ ( e ) => setCols( parseInt( e.target.value ) ) }
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
						onChange={ ( e ) => setRows( parseInt( e.target.value ) ) }
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
						onChange={ ( e ) => setColSizing( e.target.value ) }
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
						onChange={ ( e ) => setRowSizing( e.target.value ) }
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

			<div className="mlc-wdt-pro-inline-note">
				<span className="mlc-wdt-pro-badge-inline">Pro</span>
				Grid templates (Holy Grail, Dashboard, 12-Col, etc.), custom column/row definitions, and per-cell span controls available in Pro.
				{ upgradeUrl && <a href={ upgradeUrl } className="mlc-wdt-pro-inline-link">Upgrade</a> }
			</div>
		</div>
	);

	const output = (
		<CodeBlock label="CSS" code={ cssOutput } />
	);

	return (
		<ToolCard
			title="CSS Grid Generator"
			help="Visual CSS Grid layout builder. Set columns, rows, gaps, and alignment. Templates, custom definitions, and per-cell spans available in Pro."
			preview={ preview }
			controls={ controls }
			output={ output }
		/>
	);
}
