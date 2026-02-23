import { useState, useCallback } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CodeBlock from '../components/CodeBlock';
import ColorPicker from '../components/ColorPicker';

const PRESET_GRADIENTS = [
	{ name: 'Sunset', colors: [ { color: '#FF6B6B', position: 0 }, { color: '#FFA07A', position: 50 }, { color: '#FFD700', position: 100 } ] },
	{ name: 'Ocean', colors: [ { color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 } ] },
	{ name: 'Forest', colors: [ { color: '#11998e', position: 0 }, { color: '#38ef7d', position: 100 } ] },
	{ name: 'Berry', colors: [ { color: '#e44d26', position: 0 }, { color: '#f16529', position: 50 }, { color: '#e44d26', position: 100 } ] },
	{ name: 'Sky', colors: [ { color: '#2196F3', position: 0 }, { color: '#21CBF3', position: 100 } ] },
	{ name: 'Peach', colors: [ { color: '#ffecd2', position: 0 }, { color: '#fcb69f', position: 100 } ] },
];

const DIRECTION_PRESETS = [
	{ label: '\u2192', value: 90, title: 'Right' },
	{ label: '\u2199', value: 135, title: 'Bottom Right' },
	{ label: '\u2193', value: 180, title: 'Down' },
	{ label: '\u2198', value: 225, title: 'Bottom Left' },
	{ label: '\u2190', value: 270, title: 'Left' },
	{ label: '\u2196', value: 315, title: 'Top Left' },
	{ label: '\u2191', value: 0, title: 'Up' },
	{ label: '\u2197', value: 45, title: 'Top Right' },
];

export default function GradientGenerator() {
	const [ gradientType, setGradientType ] = useState( 'linear' );
	const [ direction, setDirection ] = useState( 90 );
	const [ radialShape, setRadialShape ] = useState( 'circle' );
	const [ radialPosition, setRadialPosition ] = useState( { x: 50, y: 50 } );
	const [ colors, setColors ] = useState( [
		{ color: '#FF6B6B', position: 0 },
		{ color: '#FFA07A', position: 50 },
		{ color: '#FFD700', position: 100 },
	] );

	const updateColor = useCallback( ( index, field, value ) => {
		setColors( ( prev ) => {
			const updated = [ ...prev ];
			updated[ index ] = { ...updated[ index ], [ field ]: value };
			return updated;
		} );
	}, [] );

	const addColor = useCallback( () => {
		setColors( ( prev ) => {
			const positions = prev.map( ( c ) => c.position );
			const maxPos = Math.max( ...positions );
			const minPos = Math.min( ...positions );
			const newPos = Math.round( ( maxPos + minPos ) / 2 );
			return [ ...prev, { color: '#888888', position: newPos } ];
		} );
	}, [] );

	const removeColor = useCallback( ( index ) => {
		setColors( ( prev ) => prev.filter( ( _, i ) => i !== index ) );
	}, [] );

	const applyPreset = useCallback( ( preset ) => {
		setColors( preset.colors.map( ( c ) => ( { ...c } ) ) );
	}, [] );

	const buildGradientValue = () => {
		const sortedColors = [ ...colors ].sort( ( a, b ) => a.position - b.position );
		const colorStops = sortedColors
			.map( ( c ) => `${ c.color } ${ c.position }%` )
			.join( ', ' );

		if ( gradientType === 'radial' ) {
			const position = `${ radialPosition.x }% ${ radialPosition.y }%`;
			return `radial-gradient(${ radialShape } at ${ position }, ${ colorStops })`;
		}
		return `linear-gradient(${ direction }deg, ${ colorStops })`;
	};

	const gradientValue = buildGradientValue();

	const generateCSS = () => {
		const sortedColors = [ ...colors ].sort( ( a, b ) => a.position - b.position );
		const colorStops = sortedColors
			.map( ( c ) => `  ${ c.color } ${ c.position }%` )
			.join( ',\n' );

		if ( gradientType === 'radial' ) {
			const position = `${ radialPosition.x }% ${ radialPosition.y }%`;
			return `background: radial-gradient(\n  ${ radialShape } at ${ position },\n${ colorStops }\n);`;
		}
		return `background: linear-gradient(\n  ${ direction }deg,\n${ colorStops }\n);`;
	};

	const preview = (
		<div
			className="dkdt-gradient-preview"
			style={ { background: gradientValue } }
		/>
	);

	const controls = (
		<div className="dkdt-gradient-controls">
			{ /* Gradient Type */ }
			<div className="dkdt-control-group">
				<label className="dkdt-control-label">Type</label>
				<div className="dkdt-radio-group">
					<label className={ `dkdt-radio${ gradientType === 'linear' ? ' active' : '' }` }>
						<input
							type="radio"
							name="gradientType"
							value="linear"
							checked={ gradientType === 'linear' }
							onChange={ () => setGradientType( 'linear' ) }
						/>
						Linear
					</label>
					<label className={ `dkdt-radio${ gradientType === 'radial' ? ' active' : '' }` }>
						<input
							type="radio"
							name="gradientType"
							value="radial"
							checked={ gradientType === 'radial' }
							onChange={ () => setGradientType( 'radial' ) }
						/>
						Radial
					</label>
				</div>
			</div>

			{ /* Direction (linear) or Shape/Position (radial) */ }
			{ gradientType === 'linear' ? (
				<div className="dkdt-control-group">
					<label className="dkdt-control-label">
						Direction: { direction }&deg;
					</label>
					<div className="dkdt-direction-presets">
						{ DIRECTION_PRESETS.map( ( preset ) => (
							<button
								key={ preset.value }
								className={ `dkdt-direction-btn${ direction === preset.value ? ' active' : '' }` }
								onClick={ () => setDirection( preset.value ) }
								title={ preset.title }
							>
								{ preset.label }
							</button>
						) ) }
					</div>
					<input
						type="range"
						min="0"
						max="360"
						value={ direction }
						onChange={ ( e ) => setDirection( Number( e.target.value ) ) }
						className="dkdt-range"
					/>
				</div>
			) : (
				<div className="dkdt-control-group">
					<label className="dkdt-control-label">Shape</label>
					<div className="dkdt-radio-group">
						<label className={ `dkdt-radio${ radialShape === 'circle' ? ' active' : '' }` }>
							<input
								type="radio"
								name="radialShape"
								value="circle"
								checked={ radialShape === 'circle' }
								onChange={ () => setRadialShape( 'circle' ) }
							/>
							Circle
						</label>
						<label className={ `dkdt-radio${ radialShape === 'ellipse' ? ' active' : '' }` }>
							<input
								type="radio"
								name="radialShape"
								value="ellipse"
								checked={ radialShape === 'ellipse' }
								onChange={ () => setRadialShape( 'ellipse' ) }
							/>
							Ellipse
						</label>
					</div>
					<div className="dkdt-radial-position">
						<div className="dkdt-range-row">
							<label className="dkdt-range-label">
								Center X: { radialPosition.x }%
							</label>
							<input
								type="range"
								min="0"
								max="100"
								value={ radialPosition.x }
								onChange={ ( e ) =>
									setRadialPosition( ( prev ) => ( {
										...prev,
										x: Number( e.target.value ),
									} ) )
								}
								className="dkdt-range"
							/>
						</div>
						<div className="dkdt-range-row">
							<label className="dkdt-range-label">
								Center Y: { radialPosition.y }%
							</label>
							<input
								type="range"
								min="0"
								max="100"
								value={ radialPosition.y }
								onChange={ ( e ) =>
									setRadialPosition( ( prev ) => ( {
										...prev,
										y: Number( e.target.value ),
									} ) )
								}
								className="dkdt-range"
							/>
						</div>
					</div>
				</div>
			) }

			{ /* Color Stops */ }
			<div className="dkdt-control-group">
				<label className="dkdt-control-label">Colors</label>
				<div className="dkdt-color-stops">
					{ colors.map( ( colorStop, index ) => (
						<div key={ index } className="dkdt-color-stop">
							<ColorPicker
								color={ colorStop.color }
								onChange={ ( val ) => updateColor( index, 'color', val ) }
							/>
							<div className="dkdt-position-control">
								<input
									type="range"
									min="0"
									max="100"
									value={ colorStop.position }
									onChange={ ( e ) =>
										updateColor(
											index,
											'position',
											Number( e.target.value )
										)
									}
									className="dkdt-range dkdt-range-sm"
									aria-label={ `Position for color ${ index + 1 }` }
								/>
								<span className="dkdt-position-value">
									{ colorStop.position }%
								</span>
							</div>
							{ colors.length > 2 && (
								<button
									className="dkdt-remove-btn"
									onClick={ () => removeColor( index ) }
									aria-label={ `Remove color ${ index + 1 }` }
									title="Remove color"
								>
									&times;
								</button>
							) }
						</div>
					) ) }
				</div>
				<button className="dkdt-add-btn" onClick={ addColor }>
					+ Add Color Stop
				</button>
			</div>

			{ /* Presets */ }
			<div className="dkdt-control-group">
				<label className="dkdt-control-label">Presets</label>
				<div className="dkdt-presets">
					{ PRESET_GRADIENTS.map( ( preset ) => {
						const presetStops = preset.colors
							.map( ( c ) => `${ c.color } ${ c.position }%` )
							.join( ', ' );
						return (
							<button
								key={ preset.name }
								className="dkdt-preset-btn"
								onClick={ () => applyPreset( preset ) }
								title={ preset.name }
								style={ {
									background: `linear-gradient(90deg, ${ presetStops })`,
								} }
							>
								<span className="dkdt-preset-label">
									{ preset.name }
								</span>
							</button>
						);
					} ) }
				</div>
			</div>
		</div>
	);

	const output = (
		<div>
			<CodeBlock code={ generateCSS() } label="Generated CSS" />
			<p className="dkdt-tip">
				Tip: Try adding a third color in the middle for depth.
			</p>
		</div>
	);

	return (
		<ToolCard
			title="CSS Gradient Generator"
			help="Create linear and radial gradients with live preview. Adjust colors, positions, and direction to build the perfect gradient."
			preview={ preview }
			controls={ controls }
			output={ output }
		/>
	);
}
