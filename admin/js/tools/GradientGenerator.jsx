import { useState, useCallback } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CodeBlock from '../components/CodeBlock';

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
		{ color: '#4ECDC4', position: 100 },
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
			className="mlc-wdt-gradient-preview"
			style={ { background: gradientValue } }
		/>
	);

	const controls = (
		<div className="mlc-wdt-gradient-controls">
			{ /* Gradient Type */ }
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Type</label>
				<div className="mlc-wdt-radio-group">
					<label className={ `mlc-wdt-radio${ gradientType === 'linear' ? ' active' : '' }` }>
						<input
							type="radio"
							name="gradientType"
							value="linear"
							checked={ gradientType === 'linear' }
							onChange={ () => setGradientType( 'linear' ) }
						/>
						Linear
					</label>
					<label className={ `mlc-wdt-radio${ gradientType === 'radial' ? ' active' : '' }` }>
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
				<div className="mlc-wdt-control-group">
					<label className="mlc-wdt-control-label">
						Direction: { direction }&deg;
					</label>
					<div className="mlc-wdt-direction-presets">
						{ DIRECTION_PRESETS.map( ( preset ) => (
							<button
								key={ preset.value }
								className={ `mlc-wdt-direction-btn${ direction === preset.value ? ' active' : '' }` }
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
						className="mlc-wdt-range"
					/>
				</div>
			) : (
				<div className="mlc-wdt-control-group">
					<label className="mlc-wdt-control-label">Shape</label>
					<div className="mlc-wdt-radio-group">
						<label className={ `mlc-wdt-radio${ radialShape === 'circle' ? ' active' : '' }` }>
							<input
								type="radio"
								name="radialShape"
								value="circle"
								checked={ radialShape === 'circle' }
								onChange={ () => setRadialShape( 'circle' ) }
							/>
							Circle
						</label>
						<label className={ `mlc-wdt-radio${ radialShape === 'ellipse' ? ' active' : '' }` }>
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
					<div className="mlc-wdt-radial-position">
						<div className="mlc-wdt-range-row">
							<label className="mlc-wdt-range-label">
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
								className="mlc-wdt-range"
							/>
						</div>
						<div className="mlc-wdt-range-row">
							<label className="mlc-wdt-range-label">
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
								className="mlc-wdt-range"
							/>
						</div>
					</div>
				</div>
			) }

			{ /* Color Stops */ }
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Colors</label>
				<div className="mlc-wdt-color-stops">
					{ colors.map( ( colorStop, index ) => (
						<div key={ index } className="mlc-wdt-color-stop">
							<input
								type="color"
								value={ colorStop.color }
								onChange={ ( e ) =>
									updateColor( index, 'color', e.target.value )
								}
								className="mlc-wdt-color-picker"
								aria-label={ `Color ${ index + 1 }` }
							/>
							<input
								type="text"
								value={ colorStop.color }
								onChange={ ( e ) =>
									updateColor( index, 'color', e.target.value )
								}
								className="mlc-wdt-hex-input"
								maxLength={ 7 }
								aria-label={ `Hex value for color ${ index + 1 }` }
							/>
							<div className="mlc-wdt-position-control">
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
									className="mlc-wdt-range mlc-wdt-range-sm"
									aria-label={ `Position for color ${ index + 1 }` }
								/>
								<span className="mlc-wdt-position-value">
									{ colorStop.position }%
								</span>
							</div>
							{ colors.length > 2 && (
								<button
									className="mlc-wdt-remove-btn"
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
				<button className="mlc-wdt-add-btn" onClick={ addColor }>
					+ Add Color Stop
				</button>
			</div>

			{ /* Presets */ }
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Presets</label>
				<div className="mlc-wdt-presets">
					{ PRESET_GRADIENTS.map( ( preset ) => {
						const presetStops = preset.colors
							.map( ( c ) => `${ c.color } ${ c.position }%` )
							.join( ', ' );
						return (
							<button
								key={ preset.name }
								className="mlc-wdt-preset-btn"
								onClick={ () => applyPreset( preset ) }
								title={ preset.name }
								style={ {
									background: `linear-gradient(90deg, ${ presetStops })`,
								} }
							>
								<span className="mlc-wdt-preset-label">
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
			<p className="mlc-wdt-tip">
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
