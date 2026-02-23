import { useState, useMemo } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CodeBlock from '../components/CodeBlock';

const FLEX_DIRECTIONS = [ 'row', 'row-reverse', 'column', 'column-reverse' ];
const JUSTIFY_OPTIONS = [ 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly' ];
const ALIGN_OPTIONS = [ 'stretch', 'flex-start', 'flex-end', 'center', 'baseline' ];
const WRAP_OPTIONS = [ 'nowrap', 'wrap', 'wrap-reverse' ];
const ALIGN_CONTENT_OPTIONS = [ 'stretch', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around' ];

const ITEM_COLORS = [
	'#0073aa', '#e35b5b', '#46b450', '#ffb900',
	'#9b59b6', '#3498db', '#1abc9c', '#e67e22',
	'#2c3e50', '#e74c3c', '#27ae60', '#f39c12',
];

function OptionRow( { label, value, options, onChange } ) {
	return (
		<div className="dkdt-control-group">
			<label className="dkdt-control-label">{ label }</label>
			<div className="dkdt-flex-options">
				{ options.map( ( opt ) => (
					<button
						key={ opt }
						className={ `dkdt-flex-option-btn${ value === opt ? ' active' : '' }` }
						onClick={ () => onChange( opt ) }
					>
						{ opt }
					</button>
				) ) }
			</div>
		</div>
	);
}

export default function FlexboxGenerator() {
	const [ direction, setDirection ] = useState( 'row' );
	const [ justify, setJustify ] = useState( 'flex-start' );
	const [ alignItems, setAlignItems ] = useState( 'stretch' );
	const [ wrap, setWrap ] = useState( 'nowrap' );
	const [ alignContent, setAlignContent ] = useState( 'stretch' );
	const [ gap, setGap ] = useState( 10 );
	const [ itemCount, setItemCount ] = useState( 5 );

	const containerStyle = useMemo( () => ( {
		display: 'flex',
		flexDirection: direction,
		justifyContent: justify,
		alignItems,
		flexWrap: wrap,
		alignContent,
		gap: `${ gap }px`,
		minHeight: '200px',
		padding: '12px',
		border: '2px dashed #c3c4c7',
		borderRadius: '6px',
		background: '#f9fafb',
		transition: 'all 0.2s',
	} ), [ direction, justify, alignItems, wrap, alignContent, gap ] );

	const cssOutput = useMemo( () => {
		const lines = [
			'display: flex;',
		];
		if ( direction !== 'row' ) lines.push( `flex-direction: ${ direction };` );
		if ( justify !== 'flex-start' ) lines.push( `justify-content: ${ justify };` );
		if ( alignItems !== 'stretch' ) lines.push( `align-items: ${ alignItems };` );
		if ( wrap !== 'nowrap' ) lines.push( `flex-wrap: ${ wrap };` );
		if ( wrap !== 'nowrap' && alignContent !== 'stretch' ) lines.push( `align-content: ${ alignContent };` );
		if ( gap > 0 ) lines.push( `gap: ${ gap }px;` );

		return `.container {\n${ lines.map( ( l ) => `  ${ l }` ).join( '\n' ) }\n}`;
	}, [ direction, justify, alignItems, wrap, alignContent, gap ] );

	const preview = (
		<div>
			<div style={ containerStyle }>
				{ Array.from( { length: itemCount } ).map( ( _, i ) => {
					const itemStyle = {
						background: ITEM_COLORS[ i % ITEM_COLORS.length ],
						color: '#fff',
						padding: direction.includes( 'column' ) ? '12px 24px' : '16px 24px',
						borderRadius: '4px',
						fontSize: '14px',
						fontWeight: 600,
						minWidth: '40px',
						textAlign: 'center',
						transition: 'all 0.2s',
					};
					return (
						<div key={ i } style={ itemStyle }>
							{ i + 1 }
						</div>
					);
				} ) }
			</div>
		</div>
	);

	const upgradeUrl = window.dkdtData?.upgradeUrl;

	const controls = (
		<div className="dkdt-flex-controls">
			<OptionRow label="flex-direction" value={ direction } options={ FLEX_DIRECTIONS } onChange={ setDirection } />
			<OptionRow label="justify-content" value={ justify } options={ JUSTIFY_OPTIONS } onChange={ setJustify } />
			<OptionRow label="align-items" value={ alignItems } options={ ALIGN_OPTIONS } onChange={ setAlignItems } />
			<OptionRow label="flex-wrap" value={ wrap } options={ WRAP_OPTIONS } onChange={ setWrap } />
			{ wrap !== 'nowrap' && (
				<OptionRow label="align-content" value={ alignContent } options={ ALIGN_CONTENT_OPTIONS } onChange={ setAlignContent } />
			) }

			<div className="dkdt-control-group">
				<label className="dkdt-control-label">gap: { gap }px</label>
				<input
					type="range"
					className="dkdt-range"
					min="0"
					max="40"
					value={ gap }
					onChange={ ( e ) => setGap( parseInt( e.target.value ) ) }
				/>
			</div>

			<div className="dkdt-control-group">
				<label className="dkdt-control-label">Items: { itemCount }</label>
				<input
					type="range"
					className="dkdt-range"
					min="1"
					max="12"
					value={ itemCount }
					onChange={ ( e ) => setItemCount( parseInt( e.target.value ) ) }
				/>
			</div>

			<div className="dkdt-pro-inline-note">
				<span className="dkdt-pro-badge-inline">Pro</span>
				Per-item flex properties (flex-grow, flex-shrink, flex-basis, align-self, order) available in Pro.
				{ upgradeUrl && <a href={ upgradeUrl } className="dkdt-pro-inline-link">Upgrade</a> }
			</div>
		</div>
	);

	const output = (
		<CodeBlock label="CSS" code={ cssOutput } />
	);

	return (
		<ToolCard
			title="Flexbox Generator"
			help="Visual CSS flexbox playground. Adjust container properties and see changes in real-time. Per-item controls available in Pro."
			preview={ preview }
			controls={ controls }
			output={ output }
		/>
	);
}
