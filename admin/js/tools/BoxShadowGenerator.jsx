import { useState, useCallback } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CodeBlock from '../components/CodeBlock';
import ColorPicker from '../components/ColorPicker';

const DEFAULT_SHADOW = {
	h: 0,
	v: 4,
	blur: 8,
	spread: 0,
	color: '#000000',
	opacity: 25,
	inset: false,
};

function hexToRgba( hex, opacity ) {
	const r = parseInt( hex.slice( 1, 3 ), 16 );
	const g = parseInt( hex.slice( 3, 5 ), 16 );
	const b = parseInt( hex.slice( 5, 7 ), 16 );
	return `rgba(${ r }, ${ g }, ${ b }, ${ opacity / 100 })`;
}

function shadowToCSS( shadow ) {
	const inset = shadow.inset ? 'inset ' : '';
	const rgba = hexToRgba( shadow.color, shadow.opacity );
	return `${ inset }${ shadow.h }px ${ shadow.v }px ${ shadow.blur }px ${ shadow.spread }px ${ rgba }`;
}

export default function BoxShadowGenerator() {
	const [ shadows, setShadows ] = useState( [ { ...DEFAULT_SHADOW } ] );
	const [ boxColor, setBoxColor ] = useState( '#ffffff' );
	const [ bgColor, setBgColor ] = useState( '#f3f4f5' );

	const updateShadow = useCallback( ( index, field, value ) => {
		setShadows( ( prev ) => {
			const updated = [ ...prev ];
			updated[ index ] = { ...updated[ index ], [ field ]: value };
			return updated;
		} );
	}, [] );

	const addShadow = useCallback( () => {
		setShadows( ( prev ) => [ ...prev, { ...DEFAULT_SHADOW } ] );
	}, [] );

	const removeShadow = useCallback( ( index ) => {
		setShadows( ( prev ) => prev.filter( ( _, i ) => i !== index ) );
	}, [] );

	const moveShadow = useCallback( ( index, dir ) => {
		setShadows( ( prev ) => {
			const newIndex = index + dir;
			if ( newIndex < 0 || newIndex >= prev.length ) {
				return prev;
			}
			const updated = [ ...prev ];
			[ updated[ index ], updated[ newIndex ] ] = [ updated[ newIndex ], updated[ index ] ];
			return updated;
		} );
	}, [] );

	const combinedShadow = shadows.map( shadowToCSS ).join( ', ' );

	const generateCSS = () => {
		if ( shadows.length === 1 ) {
			return `box-shadow: ${ shadowToCSS( shadows[ 0 ] ) };`;
		}
		const lines = shadows.map( ( s ) => `  ${ shadowToCSS( s ) }` ).join( ',\n' );
		return `box-shadow:\n${ lines };`;
	};

	const preview = (
		<div className="mlc-wdt-shadow-preview" style={ { background: bgColor } }>
			<div
				className="mlc-wdt-shadow-box"
				style={ {
					boxShadow: combinedShadow,
					background: boxColor,
				} }
			/>
		</div>
	);

	const controls = (
		<div className="mlc-wdt-shadow-controls">
			{ /* Box/BG colors */ }
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Preview Colors</label>
				<div className="mlc-wdt-color-row">
					<ColorPicker color={ boxColor } onChange={ setBoxColor } label="Box" />
					<ColorPicker color={ bgColor } onChange={ setBgColor } label="Background" />
				</div>
			</div>

			{ /* Shadow layers */ }
			{ shadows.map( ( shadow, index ) => (
				<div key={ index } className="mlc-wdt-shadow-layer">
					<div className="mlc-wdt-shadow-layer-header">
						<span className="mlc-wdt-shadow-layer-title">
							Shadow { index + 1 }
						</span>
						<div className="mlc-wdt-shadow-layer-actions">
							{ shadows.length > 1 && (
								<>
									<button
										className="mlc-wdt-icon-btn"
										onClick={ () => moveShadow( index, -1 ) }
										disabled={ index === 0 }
										title="Move up"
									>
										&#9650;
									</button>
									<button
										className="mlc-wdt-icon-btn"
										onClick={ () => moveShadow( index, 1 ) }
										disabled={ index === shadows.length - 1 }
										title="Move down"
									>
										&#9660;
									</button>
									<button
										className="mlc-wdt-remove-btn"
										onClick={ () => removeShadow( index ) }
										title="Remove shadow"
									>
										&times;
									</button>
								</>
							) }
						</div>
					</div>

					<div className="mlc-wdt-shadow-fields">
						<div className="mlc-wdt-shadow-field">
							<label className="mlc-wdt-range-label">H-Offset</label>
							<input
								type="range"
								min="-50"
								max="50"
								value={ shadow.h }
								onChange={ ( e ) => updateShadow( index, 'h', Number( e.target.value ) ) }
								className="mlc-wdt-range"
							/>
							<span className="mlc-wdt-field-value">{ shadow.h }px</span>
						</div>
						<div className="mlc-wdt-shadow-field">
							<label className="mlc-wdt-range-label">V-Offset</label>
							<input
								type="range"
								min="-50"
								max="50"
								value={ shadow.v }
								onChange={ ( e ) => updateShadow( index, 'v', Number( e.target.value ) ) }
								className="mlc-wdt-range"
							/>
							<span className="mlc-wdt-field-value">{ shadow.v }px</span>
						</div>
						<div className="mlc-wdt-shadow-field">
							<label className="mlc-wdt-range-label">Blur</label>
							<input
								type="range"
								min="0"
								max="100"
								value={ shadow.blur }
								onChange={ ( e ) => updateShadow( index, 'blur', Number( e.target.value ) ) }
								className="mlc-wdt-range"
							/>
							<span className="mlc-wdt-field-value">{ shadow.blur }px</span>
						</div>
						<div className="mlc-wdt-shadow-field">
							<label className="mlc-wdt-range-label">Spread</label>
							<input
								type="range"
								min="-50"
								max="50"
								value={ shadow.spread }
								onChange={ ( e ) => updateShadow( index, 'spread', Number( e.target.value ) ) }
								className="mlc-wdt-range"
							/>
							<span className="mlc-wdt-field-value">{ shadow.spread }px</span>
						</div>
					</div>

					<div className="mlc-wdt-shadow-bottom-row">
						<ColorPicker
							color={ shadow.color }
							onChange={ ( val ) => updateShadow( index, 'color', val ) }
						/>
						<div className="mlc-wdt-shadow-field mlc-wdt-shadow-field-opacity">
							<label className="mlc-wdt-range-label">Opacity</label>
							<input
								type="range"
								min="0"
								max="100"
								value={ shadow.opacity }
								onChange={ ( e ) => updateShadow( index, 'opacity', Number( e.target.value ) ) }
								className="mlc-wdt-range"
							/>
							<span className="mlc-wdt-field-value">{ shadow.opacity }%</span>
						</div>
						<label className="mlc-wdt-checkbox">
							<input
								type="checkbox"
								checked={ shadow.inset }
								onChange={ ( e ) => updateShadow( index, 'inset', e.target.checked ) }
							/>
							Inset
						</label>
					</div>
				</div>
			) ) }

			<button className="mlc-wdt-add-btn" onClick={ addShadow }>
				+ Add Shadow
			</button>
		</div>
	);

	const output = (
		<CodeBlock code={ generateCSS() } label="Generated CSS" />
	);

	return (
		<ToolCard
			title="Box Shadow Generator"
			help="Create single or multi-layer box shadows with full control over offset, blur, spread, color, and opacity. Toggle inset for inner shadows."
			preview={ preview }
			controls={ controls }
			output={ output }
		/>
	);
}
