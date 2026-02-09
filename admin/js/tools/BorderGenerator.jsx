import { useState, useCallback } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CodeBlock from '../components/CodeBlock';
import ColorPicker from '../components/ColorPicker';

const SIDES = [ 'top', 'right', 'bottom', 'left' ];
const STYLES = [ 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset', 'none' ];

const DEFAULT_SIDE = {
	width: 2,
	style: 'solid',
	color: '#333333',
};

export default function BorderGenerator() {
	const [ linked, setLinked ] = useState( true );
	const [ sides, setSides ] = useState( {
		top: { ...DEFAULT_SIDE },
		right: { ...DEFAULT_SIDE },
		bottom: { ...DEFAULT_SIDE },
		left: { ...DEFAULT_SIDE },
	} );
	const [ boxColor, setBoxColor ] = useState( '#ffffff' );
	const [ bgColor, setBgColor ] = useState( '#f3f4f5' );

	const updateSide = useCallback( ( side, field, value ) => {
		setSides( ( prev ) => {
			if ( linked ) {
				const updated = {};
				SIDES.forEach( ( s ) => {
					updated[ s ] = { ...prev[ s ], [ field ]: value };
				} );
				return updated;
			}
			return { ...prev, [ side ]: { ...prev[ side ], [ field ]: value } };
		} );
	}, [ linked ] );

	const sideToCSS = ( s ) => {
		if ( s.style === 'none' ) {
			return 'none';
		}
		return `${ s.width }px ${ s.style } ${ s.color }`;
	};

	const allSame = SIDES.every(
		( s ) =>
			sides[ s ].width === sides.top.width &&
			sides[ s ].style === sides.top.style &&
			sides[ s ].color === sides.top.color
	);

	const generateCSS = () => {
		if ( allSame ) {
			return `border: ${ sideToCSS( sides.top ) };`;
		}
		return SIDES.map( ( s ) => `border-${ s }: ${ sideToCSS( sides[ s ] ) };` ).join( '\n' );
	};

	const borderStyle = {};
	SIDES.forEach( ( s ) => {
		const prop = `border${ s.charAt( 0 ).toUpperCase() + s.slice( 1 ) }`;
		borderStyle[ prop ] = sideToCSS( sides[ s ] );
	} );

	const preview = (
		<div className="mlc-wdt-border-preview" style={ { background: bgColor } }>
			<div
				className="mlc-wdt-border-box"
				style={ { ...borderStyle, background: boxColor } }
			/>
		</div>
	);

	const controls = (
		<div className="mlc-wdt-border-controls">
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Preview Colors</label>
				<div className="mlc-wdt-color-row">
					<ColorPicker color={ boxColor } onChange={ setBoxColor } label="Box" />
					<ColorPicker color={ bgColor } onChange={ setBgColor } label="Background" />
				</div>
			</div>

			<div className="mlc-wdt-control-group">
				<div className="mlc-wdt-border-link-row">
					<label className="mlc-wdt-control-label">Border Sides</label>
					<label className="mlc-wdt-checkbox">
						<input
							type="checkbox"
							checked={ linked }
							onChange={ ( e ) => setLinked( e.target.checked ) }
						/>
						Link all sides
					</label>
				</div>
			</div>

			{ ( linked ? [ 'top' ] : SIDES ).map( ( side ) => (
				<div key={ side } className="mlc-wdt-border-side">
					{ ! linked && (
						<span className="mlc-wdt-border-side-label">
							{ side.charAt( 0 ).toUpperCase() + side.slice( 1 ) }
						</span>
					) }
					<div className="mlc-wdt-border-side-fields">
						<div className="mlc-wdt-border-field">
							<label className="mlc-wdt-range-label">Width</label>
							<div className="mlc-wdt-range-with-value">
								<input
									type="range"
									min="0"
									max="20"
									value={ sides[ side ].width }
									onChange={ ( e ) => updateSide( side, 'width', Number( e.target.value ) ) }
									className="mlc-wdt-range"
								/>
								<span className="mlc-wdt-field-value">{ sides[ side ].width }px</span>
							</div>
						</div>
						<div className="mlc-wdt-border-field">
							<label className="mlc-wdt-range-label">Style</label>
							<select
								className="mlc-wdt-select"
								value={ sides[ side ].style }
								onChange={ ( e ) => updateSide( side, 'style', e.target.value ) }
							>
								{ STYLES.map( ( s ) => (
									<option key={ s } value={ s }>
										{ s.charAt( 0 ).toUpperCase() + s.slice( 1 ) }
									</option>
								) ) }
							</select>
						</div>
						<div className="mlc-wdt-border-field">
							<label className="mlc-wdt-range-label">Color</label>
							<ColorPicker
								color={ sides[ side ].color }
								onChange={ ( val ) => updateSide( side, 'color', val ) }
							/>
						</div>
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
			title="CSS Border Generator"
			help="Create CSS borders with per-side control over width, style, and color. Link all sides for uniform borders or unlink for individual control."
			preview={ preview }
			controls={ controls }
			output={ output }
		/>
	);
}
