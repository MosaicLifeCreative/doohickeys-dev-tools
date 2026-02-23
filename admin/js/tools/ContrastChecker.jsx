import { useState, useMemo } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import ColorPicker from '../components/ColorPicker';

function hexToRgb( hex ) {
	const r = parseInt( hex.slice( 1, 3 ), 16 );
	const g = parseInt( hex.slice( 3, 5 ), 16 );
	const b = parseInt( hex.slice( 5, 7 ), 16 );
	return { r, g, b };
}

function relativeLuminance( { r, g, b } ) {
	const [ rs, gs, bs ] = [ r, g, b ].map( ( c ) => {
		const s = c / 255;
		return s <= 0.03928 ? s / 12.92 : Math.pow( ( s + 0.055 ) / 1.055, 2.4 );
	} );
	return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio( hex1, hex2 ) {
	const l1 = relativeLuminance( hexToRgb( hex1 ) );
	const l2 = relativeLuminance( hexToRgb( hex2 ) );
	const lighter = Math.max( l1, l2 );
	const darker = Math.min( l1, l2 );
	return ( lighter + 0.05 ) / ( darker + 0.05 );
}

function RatingBadge( { pass, label } ) {
	return (
		<span
			className={ `dkdt-contrast-badge ${ pass ? 'dkdt-contrast-pass' : 'dkdt-contrast-fail' }` }
		>
			{ pass ? 'Pass' : 'Fail' } { label }
		</span>
	);
}

export default function ContrastChecker() {
	const [ fgColor, setFgColor ] = useState( '#1e1e1e' );
	const [ bgColor, setBgColor ] = useState( '#ffffff' );

	const ratio = useMemo( () => contrastRatio( fgColor, bgColor ), [ fgColor, bgColor ] );
	const ratioStr = ratio.toFixed( 2 );

	// WCAG 2.1 thresholds
	const aaNormal = ratio >= 4.5;
	const aaLarge = ratio >= 3;
	const aaaNormal = ratio >= 7;
	const aaaLarge = ratio >= 4.5;

	const swap = () => {
		const tmp = fgColor;
		setFgColor( bgColor );
		setBgColor( tmp );
	};

	const preview = (
		<div className="dkdt-contrast-preview">
			<div
				className="dkdt-contrast-sample"
				style={ { color: fgColor, backgroundColor: bgColor } }
			>
				<span className="dkdt-contrast-sample-large">Large Text (18px+)</span>
				<span className="dkdt-contrast-sample-normal">
					Normal body text at 14px — The quick brown fox jumps over the lazy dog.
				</span>
				<span className="dkdt-contrast-sample-small">Small UI text at 11px</span>
			</div>
			<div className="dkdt-contrast-ratio-display">
				<span className="dkdt-contrast-ratio-value">{ ratioStr }</span>
				<span className="dkdt-contrast-ratio-label">:1 ratio</span>
			</div>
		</div>
	);

	const controls = (
		<div className="dkdt-contrast-controls">
			<div className="dkdt-control-group">
				<div className="dkdt-contrast-color-row">
					<div className="dkdt-color-field">
						<label className="dkdt-control-label">Foreground (Text)</label>
						<ColorPicker color={ fgColor } onChange={ setFgColor } />
					</div>
					<button
						className="dkdt-contrast-swap-btn"
						onClick={ swap }
						title="Swap colors"
					>
						&#8646;
					</button>
					<div className="dkdt-color-field">
						<label className="dkdt-control-label">Background</label>
						<ColorPicker color={ bgColor } onChange={ setBgColor } />
					</div>
				</div>
			</div>

			<div className="dkdt-control-group">
				<label className="dkdt-control-label">WCAG 2.1 Results</label>
				<div className="dkdt-contrast-results">
					<div className="dkdt-contrast-result-row">
						<span className="dkdt-contrast-result-label">Normal Text</span>
						<div className="dkdt-contrast-badges">
							<RatingBadge pass={ aaNormal } label="AA" />
							<RatingBadge pass={ aaaNormal } label="AAA" />
						</div>
						<span className="dkdt-contrast-req">Requires 4.5:1 (AA) / 7:1 (AAA)</span>
					</div>
					<div className="dkdt-contrast-result-row">
						<span className="dkdt-contrast-result-label">Large Text (18px+ / 14px bold)</span>
						<div className="dkdt-contrast-badges">
							<RatingBadge pass={ aaLarge } label="AA" />
							<RatingBadge pass={ aaaLarge } label="AAA" />
						</div>
						<span className="dkdt-contrast-req">Requires 3:1 (AA) / 4.5:1 (AAA)</span>
					</div>
					<div className="dkdt-contrast-result-row">
						<span className="dkdt-contrast-result-label">UI Components</span>
						<div className="dkdt-contrast-badges">
							<RatingBadge pass={ aaLarge } label="AA" />
						</div>
						<span className="dkdt-contrast-req">Requires 3:1</span>
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<ToolCard
			title="Contrast Checker"
			help="Check color contrast ratios against WCAG 2.1 accessibility standards. AA level is required for most websites; AAA is the enhanced standard."
			preview={ preview }
			controls={ controls }
		/>
	);
}
