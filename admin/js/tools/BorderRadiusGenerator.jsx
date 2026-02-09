import { useState, useCallback } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CodeBlock from '../components/CodeBlock';
import ColorPicker from '../components/ColorPicker';

const CORNERS = [ 'topLeft', 'topRight', 'bottomRight', 'bottomLeft' ];
const CORNER_LABELS = {
	topLeft: 'Top Left',
	topRight: 'Top Right',
	bottomRight: 'Bottom Right',
	bottomLeft: 'Bottom Left',
};

const PRESETS = [
	{ name: 'Pill', values: { topLeft: 999, topRight: 999, bottomRight: 999, bottomLeft: 999 } },
	{ name: 'Round', values: { topLeft: 50, topRight: 50, bottomRight: 50, bottomLeft: 50 } },
	{ name: 'Ticket', values: { topLeft: 20, topRight: 20, bottomRight: 0, bottomLeft: 0 } },
	{ name: 'Leaf', values: { topLeft: 0, topRight: 40, bottomRight: 0, bottomLeft: 40 } },
	{ name: 'Drop', values: { topLeft: 50, topRight: 50, bottomRight: 50, bottomLeft: 0 } },
	{ name: 'Squircle', values: { topLeft: 30, topRight: 30, bottomRight: 30, bottomLeft: 30 } },
];

export default function BorderRadiusGenerator() {
	const [ linked, setLinked ] = useState( true );
	const [ unit, setUnit ] = useState( 'px' );
	const [ corners, setCorners ] = useState( {
		topLeft: 12,
		topRight: 12,
		bottomRight: 12,
		bottomLeft: 12,
	} );
	const [ boxColor, setBoxColor ] = useState( '#0073aa' );
	const [ bgColor, setBgColor ] = useState( '#f3f4f5' );

	const maxVal = unit === '%' ? 50 : 200;

	const updateCorner = useCallback( ( corner, value ) => {
		setCorners( ( prev ) => {
			if ( linked ) {
				const updated = {};
				CORNERS.forEach( ( c ) => {
					updated[ c ] = value;
				} );
				return updated;
			}
			return { ...prev, [ corner ]: value };
		} );
	}, [ linked ] );

	const applyPreset = useCallback( ( preset ) => {
		setCorners( { ...preset.values } );
		setLinked( false );
		setUnit( 'px' );
	}, [] );

	const allSame = CORNERS.every( ( c ) => corners[ c ] === corners.topLeft );

	const radiusValue = ( val ) => `${ val }${ unit }`;

	const generateCSS = () => {
		if ( allSame ) {
			return `border-radius: ${ radiusValue( corners.topLeft ) };`;
		}
		return `border-radius: ${ CORNERS.map( ( c ) => radiusValue( corners[ c ] ) ).join( ' ' ) };`;
	};

	const styleRadius = allSame
		? `${ corners.topLeft }${ unit }`
		: `${ corners.topLeft }${ unit } ${ corners.topRight }${ unit } ${ corners.bottomRight }${ unit } ${ corners.bottomLeft }${ unit }`;

	const preview = (
		<div className="mlc-wdt-radius-preview" style={ { background: bgColor } }>
			<div
				className="mlc-wdt-radius-box"
				style={ {
					borderRadius: styleRadius,
					background: boxColor,
				} }
			/>
		</div>
	);

	const controls = (
		<div className="mlc-wdt-radius-controls">
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Preview Colors</label>
				<div className="mlc-wdt-color-row">
					<ColorPicker color={ boxColor } onChange={ setBoxColor } label="Box" />
					<ColorPicker color={ bgColor } onChange={ setBgColor } label="Background" />
				</div>
			</div>

			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Presets</label>
				<div className="mlc-wdt-radius-presets">
					{ PRESETS.map( ( preset ) => (
						<button
							key={ preset.name }
							className="mlc-wdt-radius-preset-btn"
							onClick={ () => applyPreset( preset ) }
							title={ preset.name }
						>
							<div
								className="mlc-wdt-radius-preset-shape"
								style={ {
									borderRadius: `${ preset.values.topLeft }px ${ preset.values.topRight }px ${ preset.values.bottomRight }px ${ preset.values.bottomLeft }px`,
								} }
							/>
							<span className="mlc-wdt-radius-preset-name">{ preset.name }</span>
						</button>
					) ) }
				</div>
			</div>

			<div className="mlc-wdt-control-group">
				<div className="mlc-wdt-border-link-row">
					<label className="mlc-wdt-control-label">Corners</label>
					<div className="mlc-wdt-radius-options">
						<label className="mlc-wdt-checkbox">
							<input
								type="checkbox"
								checked={ linked }
								onChange={ ( e ) => setLinked( e.target.checked ) }
							/>
							Link
						</label>
						<div className="mlc-wdt-radio-group">
							<label className={ `mlc-wdt-radio${ unit === 'px' ? ' active' : '' }` }>
								<input
									type="radio"
									value="px"
									checked={ unit === 'px' }
									onChange={ () => setUnit( 'px' ) }
								/>
								px
							</label>
							<label className={ `mlc-wdt-radio${ unit === '%' ? ' active' : '' }` }>
								<input
									type="radio"
									value="%"
									checked={ unit === '%' }
									onChange={ () => setUnit( '%' ) }
								/>
								%
							</label>
						</div>
					</div>
				</div>
			</div>

			{ ( linked ? [ 'topLeft' ] : CORNERS ).map( ( corner ) => (
				<div key={ corner } className="mlc-wdt-range-row">
					<label className="mlc-wdt-range-label">
						{ linked ? 'All Corners' : CORNER_LABELS[ corner ] }
					</label>
					<div className="mlc-wdt-range-with-value">
						<input
							type="range"
							min="0"
							max={ maxVal }
							value={ corners[ corner ] }
							onChange={ ( e ) => updateCorner( corner, Number( e.target.value ) ) }
							className="mlc-wdt-range"
						/>
						<span className="mlc-wdt-field-value">{ corners[ corner ] }{ unit }</span>
					</div>
				</div>
			) ) }
		</div>
	);

	const output = (
		<CodeBlock code={ generateCSS() } label="Generated CSS" />
	);

	return (
		<ToolCard
			title="Border Radius Generator"
			help="Create CSS border-radius with individual corner control. Use presets for common shapes like pills, leaves, and drops. Switch between px and % units."
			preview={ preview }
			controls={ controls }
			output={ output }
		/>
	);
}
