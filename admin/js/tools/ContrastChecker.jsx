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
			className={ `mlc-wdt-contrast-badge ${ pass ? 'mlc-wdt-contrast-pass' : 'mlc-wdt-contrast-fail' }` }
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
		<div className="mlc-wdt-contrast-preview">
			<div
				className="mlc-wdt-contrast-sample"
				style={ { color: fgColor, backgroundColor: bgColor } }
			>
				<span className="mlc-wdt-contrast-sample-large">Large Text (18px+)</span>
				<span className="mlc-wdt-contrast-sample-normal">
					Normal body text at 14px — The quick brown fox jumps over the lazy dog.
				</span>
				<span className="mlc-wdt-contrast-sample-small">Small UI text at 11px</span>
			</div>
			<div className="mlc-wdt-contrast-ratio-display">
				<span className="mlc-wdt-contrast-ratio-value">{ ratioStr }</span>
				<span className="mlc-wdt-contrast-ratio-label">:1 ratio</span>
			</div>
		</div>
	);

	const controls = (
		<div className="mlc-wdt-contrast-controls">
			<div className="mlc-wdt-control-group">
				<div className="mlc-wdt-contrast-color-row">
					<div className="mlc-wdt-color-field">
						<label className="mlc-wdt-control-label">Foreground (Text)</label>
						<ColorPicker color={ fgColor } onChange={ setFgColor } />
					</div>
					<button
						className="mlc-wdt-contrast-swap-btn"
						onClick={ swap }
						title="Swap colors"
					>
						&#8646;
					</button>
					<div className="mlc-wdt-color-field">
						<label className="mlc-wdt-control-label">Background</label>
						<ColorPicker color={ bgColor } onChange={ setBgColor } />
					</div>
				</div>
			</div>

			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">WCAG 2.1 Results</label>
				<div className="mlc-wdt-contrast-results">
					<div className="mlc-wdt-contrast-result-row">
						<span className="mlc-wdt-contrast-result-label">Normal Text</span>
						<div className="mlc-wdt-contrast-badges">
							<RatingBadge pass={ aaNormal } label="AA" />
							<RatingBadge pass={ aaaNormal } label="AAA" />
						</div>
						<span className="mlc-wdt-contrast-req">Requires 4.5:1 (AA) / 7:1 (AAA)</span>
					</div>
					<div className="mlc-wdt-contrast-result-row">
						<span className="mlc-wdt-contrast-result-label">Large Text (18px+ / 14px bold)</span>
						<div className="mlc-wdt-contrast-badges">
							<RatingBadge pass={ aaLarge } label="AA" />
							<RatingBadge pass={ aaaLarge } label="AAA" />
						</div>
						<span className="mlc-wdt-contrast-req">Requires 3:1 (AA) / 4.5:1 (AAA)</span>
					</div>
					<div className="mlc-wdt-contrast-result-row">
						<span className="mlc-wdt-contrast-result-label">UI Components</span>
						<div className="mlc-wdt-contrast-badges">
							<RatingBadge pass={ aaLarge } label="AA" />
						</div>
						<span className="mlc-wdt-contrast-req">Requires 3:1</span>
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
