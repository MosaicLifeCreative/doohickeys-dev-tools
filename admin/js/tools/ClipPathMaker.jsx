import { useState, useMemo } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CodeBlock from '../components/CodeBlock';
import ColorPicker from '../components/ColorPicker';

const PRESETS = [
	{
		name: 'Triangle',
		type: 'polygon',
		points: '50% 0%, 0% 100%, 100% 100%',
	},
	{
		name: 'Trapezoid',
		type: 'polygon',
		points: '20% 0%, 80% 0%, 100% 100%, 0% 100%',
	},
	{
		name: 'Parallelogram',
		type: 'polygon',
		points: '25% 0%, 100% 0%, 75% 100%, 0% 100%',
	},
	{
		name: 'Rhombus',
		type: 'polygon',
		points: '50% 0%, 100% 50%, 50% 100%, 0% 50%',
	},
	{
		name: 'Pentagon',
		type: 'polygon',
		points: '50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%',
	},
	{
		name: 'Hexagon',
		type: 'polygon',
		points: '25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%',
	},
	{
		name: 'Octagon',
		type: 'polygon',
		points: '30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%',
	},
	{
		name: 'Star',
		type: 'polygon',
		points: '50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%',
	},
	{
		name: 'Cross',
		type: 'polygon',
		points: '33% 0%, 67% 0%, 67% 33%, 100% 33%, 100% 67%, 67% 67%, 67% 100%, 33% 100%, 33% 67%, 0% 67%, 0% 33%, 33% 33%',
	},
	{
		name: 'Arrow Right',
		type: 'polygon',
		points: '0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%',
	},
	{
		name: 'Arrow Left',
		type: 'polygon',
		points: '40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%',
	},
	{
		name: 'Chevron',
		type: 'polygon',
		points: '0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%',
	},
	{
		name: 'Circle',
		type: 'circle',
		value: '50% at 50% 50%',
	},
	{
		name: 'Ellipse',
		type: 'ellipse',
		value: '50% 35% at 50% 50%',
	},
	{
		name: 'Inset',
		type: 'inset',
		value: '10% 10% 10% 10% round 10px',
	},
];

export default function ClipPathMaker() {
	const [ activePreset, setActivePreset ] = useState( 0 );
	const [ customValue, setCustomValue ] = useState( '' );
	const [ bgColor, setBgColor ] = useState( '#0073aa' );
	const [ shapeBg, setShapeBg ] = useState( '#e8f0fe' );

	const preset = PRESETS[ activePreset ];

	const clipPath = useMemo( () => {
		if ( customValue ) return customValue;
		if ( preset.type === 'polygon' ) return `polygon(${ preset.points })`;
		if ( preset.type === 'circle' ) return `circle(${ preset.value })`;
		if ( preset.type === 'ellipse' ) return `ellipse(${ preset.value })`;
		if ( preset.type === 'inset' ) return `inset(${ preset.value })`;
		return '';
	}, [ activePreset, customValue, preset ] );

	const generateCSS = () => {
		return `-webkit-clip-path: ${ clipPath };\nclip-path: ${ clipPath };`;
	};

	const preview = (
		<div className="dkdt-clip-preview" style={ { background: shapeBg } }>
			<div
				className="dkdt-clip-shape"
				style={ {
					clipPath,
					WebkitClipPath: clipPath,
					background: bgColor,
				} }
			/>
		</div>
	);

	const controls = (
		<div className="dkdt-clip-controls">
			<div className="dkdt-control-group">
				<label className="dkdt-control-label">Colors</label>
				<div className="dkdt-color-row">
					<ColorPicker color={ bgColor } onChange={ setBgColor } label="Shape" />
					<ColorPicker color={ shapeBg } onChange={ setShapeBg } label="Background" />
				</div>
			</div>

			<div className="dkdt-control-group">
				<label className="dkdt-control-label">Presets</label>
				<div className="dkdt-clip-presets">
					{ PRESETS.map( ( p, i ) => (
						<button
							key={ p.name }
							className={ `dkdt-clip-preset-btn${ activePreset === i && ! customValue ? ' active' : '' }` }
							onClick={ () => { setActivePreset( i ); setCustomValue( '' ); } }
							title={ p.name }
						>
							<div
								className="dkdt-clip-preset-thumb"
								style={ {
									clipPath: p.type === 'polygon'
										? `polygon(${ p.points })`
										: p.type === 'circle'
											? `circle(${ p.value })`
											: p.type === 'ellipse'
												? `ellipse(${ p.value })`
												: `inset(${ p.value })`,
									WebkitClipPath: p.type === 'polygon'
										? `polygon(${ p.points })`
										: p.type === 'circle'
											? `circle(${ p.value })`
											: p.type === 'ellipse'
												? `ellipse(${ p.value })`
												: `inset(${ p.value })`,
								} }
							/>
							<span className="dkdt-clip-preset-name">{ p.name }</span>
						</button>
					) ) }
				</div>
			</div>

			<div className="dkdt-control-group">
				<label className="dkdt-control-label">Custom clip-path value</label>
				<input
					type="text"
					className="dkdt-text-input"
					value={ customValue || clipPath }
					onChange={ ( e ) => setCustomValue( e.target.value ) }
					placeholder="polygon(50% 0%, 0% 100%, 100% 100%)"
				/>
				<p className="dkdt-tip">Edit the clip-path value directly for fine control. Clear to return to presets.</p>
			</div>
		</div>
	);

	const output = (
		<CodeBlock code={ generateCSS() } label="Generated CSS" />
	);

	return (
		<ToolCard
			title="CSS Clip-Path Maker"
			help="Create CSS clip-path shapes using presets or custom values. Supports polygon, circle, ellipse, and inset shapes with live preview."
			preview={ preview }
			controls={ controls }
			output={ output }
		/>
	);
}
