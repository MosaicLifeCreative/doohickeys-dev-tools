import { useState, useMemo } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CodeBlock from '../components/CodeBlock';
import ProBadge from '../components/ProBadge';

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

export default function FlexboxGenerator() {
	const [ direction, setDirection ] = useState( 'row' );
	const [ justify, setJustify ] = useState( 'flex-start' );
	const [ alignItems, setAlignItems ] = useState( 'stretch' );
	const [ wrap, setWrap ] = useState( 'nowrap' );
	const [ alignContent, setAlignContent ] = useState( 'stretch' );
	const [ gap, setGap ] = useState( 10 );
	const [ itemCount, setItemCount ] = useState( 5 );

	// Per-item overrides
	const [ items, setItems ] = useState( () =>
		Array.from( { length: 12 }, ( _, i ) => ( {
			flexGrow: 0,
			flexShrink: 1,
			flexBasis: 'auto',
			alignSelf: 'auto',
			order: 0,
			label: i + 1,
		} ) )
	);

	const [ selectedItem, setSelectedItem ] = useState( null );

	const updateItem = ( idx, field, val ) => {
		setItems( ( prev ) => {
			const next = [ ...prev ];
			next[ idx ] = { ...next[ idx ], [ field ]: val };
			return next;
		} );
	};

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

		let css = `.container {\n${ lines.map( ( l ) => `  ${ l }` ).join( '\n' ) }\n}`;

		// Check for any non-default item overrides
		const activeItems = items.slice( 0, itemCount );
		const hasOverrides = activeItems.some( ( item ) =>
			item.flexGrow !== 0 || item.flexShrink !== 1 || item.flexBasis !== 'auto' || item.alignSelf !== 'auto' || item.order !== 0
		);

		if ( hasOverrides ) {
			activeItems.forEach( ( item, i ) => {
				const itemLines = [];
				if ( item.flexGrow !== 0 ) itemLines.push( `  flex-grow: ${ item.flexGrow };` );
				if ( item.flexShrink !== 1 ) itemLines.push( `  flex-shrink: ${ item.flexShrink };` );
				if ( item.flexBasis !== 'auto' ) itemLines.push( `  flex-basis: ${ item.flexBasis };` );
				if ( item.alignSelf !== 'auto' ) itemLines.push( `  align-self: ${ item.alignSelf };` );
				if ( item.order !== 0 ) itemLines.push( `  order: ${ item.order };` );
				if ( itemLines.length > 0 ) {
					css += `\n\n.item-${ i + 1 } {\n${ itemLines.join( '\n' ) }\n}`;
				}
			} );
		}

		return css;
	}, [ direction, justify, alignItems, wrap, alignContent, gap, items, itemCount ] );

	const preview = (
		<div>
			<div style={ containerStyle }>
				{ items.slice( 0, itemCount ).map( ( item, i ) => {
					const itemStyle = {
						background: ITEM_COLORS[ i % ITEM_COLORS.length ],
						color: '#fff',
						padding: direction.includes( 'column' ) ? '12px 24px' : '16px 24px',
						borderRadius: '4px',
						fontSize: '14px',
						fontWeight: 600,
						cursor: 'pointer',
						outline: selectedItem === i ? '3px solid #23282d' : 'none',
						outlineOffset: '2px',
						flexGrow: item.flexGrow,
						flexShrink: item.flexShrink,
						flexBasis: item.flexBasis,
						alignSelf: item.alignSelf === 'auto' ? undefined : item.alignSelf,
						order: item.order,
						minWidth: '40px',
						textAlign: 'center',
						transition: 'all 0.2s',
					};
					return (
						<div
							key={ i }
							style={ itemStyle }
							onClick={ () => setSelectedItem( selectedItem === i ? null : i ) }
							title={ `Item ${ i + 1 } — click to edit` }
						>
							{ item.label }
						</div>
					);
				} ) }
			</div>
			<p className="mlc-wdt-tip">Click an item to edit its individual flex properties.</p>
		</div>
	);

	const controls = (
		<div className="mlc-wdt-flex-controls">
			<OptionRow label="flex-direction" value={ direction } options={ FLEX_DIRECTIONS } onChange={ setDirection } />
			<OptionRow label="justify-content" value={ justify } options={ JUSTIFY_OPTIONS } onChange={ setJustify } />
			<OptionRow label="align-items" value={ alignItems } options={ ALIGN_OPTIONS } onChange={ setAlignItems } />
			<OptionRow label="flex-wrap" value={ wrap } options={ WRAP_OPTIONS } onChange={ setWrap } />
			{ wrap !== 'nowrap' && (
				<OptionRow label="align-content" value={ alignContent } options={ ALIGN_CONTENT_OPTIONS } onChange={ setAlignContent } />
			) }

			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">gap: { gap }px</label>
				<input
					type="range"
					className="mlc-wdt-range"
					min="0"
					max="40"
					value={ gap }
					onChange={ ( e ) => setGap( parseInt( e.target.value ) ) }
				/>
			</div>

			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Items: { itemCount }</label>
				<input
					type="range"
					className="mlc-wdt-range"
					min="1"
					max="12"
					value={ itemCount }
					onChange={ ( e ) => {
						const count = parseInt( e.target.value );
						setItemCount( count );
						if ( selectedItem !== null && selectedItem >= count ) {
							setSelectedItem( null );
						}
					} }
				/>
			</div>

			{ /* Per-item controls (Pro) */ }
			<ProBadge feature="Per-item flex controls are a Pro feature">
			<div className="mlc-wdt-flex-item-controls">
				<label className="mlc-wdt-control-label">
					Per-Item Properties
					{ selectedItem !== null && selectedItem < itemCount && (
						<button
							className="mlc-wdt-flex-deselect"
							onClick={ () => setSelectedItem( null ) }
						>
							Close
						</button>
					) }
				</label>

				{ selectedItem !== null && selectedItem < itemCount ? (
					<div className="mlc-wdt-flex-item-fields">
						<div className="mlc-wdt-flex-item-field">
							<span className="mlc-wdt-palette-slider-label">flex-grow</span>
							<input
								type="range"
								className="mlc-wdt-range"
								min="0"
								max="5"
								value={ items[ selectedItem ].flexGrow }
								onChange={ ( e ) => updateItem( selectedItem, 'flexGrow', parseInt( e.target.value ) ) }
							/>
							<span className="mlc-wdt-field-value">{ items[ selectedItem ].flexGrow }</span>
						</div>

						<div className="mlc-wdt-flex-item-field">
							<span className="mlc-wdt-palette-slider-label">flex-shrink</span>
							<input
								type="range"
								className="mlc-wdt-range"
								min="0"
								max="5"
								value={ items[ selectedItem ].flexShrink }
								onChange={ ( e ) => updateItem( selectedItem, 'flexShrink', parseInt( e.target.value ) ) }
							/>
							<span className="mlc-wdt-field-value">{ items[ selectedItem ].flexShrink }</span>
						</div>

						<div className="mlc-wdt-flex-item-field">
							<span className="mlc-wdt-palette-slider-label">flex-basis</span>
							<select
								className="mlc-wdt-select"
								value={ items[ selectedItem ].flexBasis }
								onChange={ ( e ) => updateItem( selectedItem, 'flexBasis', e.target.value ) }
							>
								<option value="auto">auto</option>
								<option value="0">0</option>
								<option value="50px">50px</option>
								<option value="100px">100px</option>
								<option value="150px">150px</option>
								<option value="200px">200px</option>
								<option value="25%">25%</option>
								<option value="33.33%">33.33%</option>
								<option value="50%">50%</option>
							</select>
						</div>

						<div className="mlc-wdt-flex-item-field">
							<span className="mlc-wdt-palette-slider-label">align-self</span>
							<select
								className="mlc-wdt-select"
								value={ items[ selectedItem ].alignSelf }
								onChange={ ( e ) => updateItem( selectedItem, 'alignSelf', e.target.value ) }
							>
								<option value="auto">auto</option>
								<option value="flex-start">flex-start</option>
								<option value="flex-end">flex-end</option>
								<option value="center">center</option>
								<option value="stretch">stretch</option>
								<option value="baseline">baseline</option>
							</select>
						</div>

						<div className="mlc-wdt-flex-item-field">
							<span className="mlc-wdt-palette-slider-label">order</span>
							<input
								type="range"
								className="mlc-wdt-range"
								min="-5"
								max="5"
								value={ items[ selectedItem ].order }
								onChange={ ( e ) => updateItem( selectedItem, 'order', parseInt( e.target.value ) ) }
							/>
							<span className="mlc-wdt-field-value">{ items[ selectedItem ].order }</span>
						</div>
					</div>
				) : (
					<p className="mlc-wdt-tip" style={ { margin: '8px 0 0' } }>
						Click an item in the preview to customize flex-grow, flex-shrink, flex-basis, align-self, and order.
					</p>
				) }
			</div>
			</ProBadge>
		</div>
	);

	const output = (
		<CodeBlock label="CSS" code={ cssOutput } />
	);

	return (
		<ToolCard
			title="Flexbox Generator"
			help="Visual CSS flexbox playground. Adjust container properties and see changes in real-time. Click individual items to customize flex-grow, flex-shrink, flex-basis, align-self, and order."
			preview={ preview }
			controls={ controls }
			output={ output }
		/>
	);
}
