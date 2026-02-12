import { usePro } from '../context/ProContext';

const tools = [
	{
		category: 'CSS Tools',
		icon: '\uD83D\uDCBB',
		items: [
			{ id: 'gradient', label: 'Gradient' },
			{ id: 'box-shadow', label: 'Box Shadow' },
			{ id: 'border', label: 'Border' },
			{ id: 'border-radius', label: 'Border Radius' },
			{ id: 'flexbox', label: 'Flexbox', pro: true },
			{ id: 'grid', label: 'Grid', pro: true },
			{ id: 'clip-path', label: 'Clip-Path' },
		],
	},
	{
		category: 'Color',
		icon: '\uD83C\uDFA8',
		items: [
			{ id: 'color-converter', label: 'Converter' },
			{ id: 'contrast-checker', label: 'Contrast' },
			{ id: 'palette', label: 'Palette', pro: true },
		],
	},
	{
		category: 'Code Tools',
		icon: '\uD83D\uDCDD',
		items: [
			{ id: 'formatter', label: 'Formatter', pro: true },
			{ id: 'encoder', label: 'Encoder/Decoder' },
			{ id: 'diff', label: 'Diff Checker', pro: true },
			{ id: 'string-utils', label: 'String Utilities' },
		],
	},
	{
		category: 'Generators',
		icon: '\u2699\uFE0F',
		items: [
			{ id: 'qrcode', label: 'QR Code' },
			{ id: 'placeholder-image', label: 'Placeholder Image' },
			{ id: 'lorem-ipsum', label: 'Lorem Ipsum' },
			{ id: 'table', label: 'HTML Table', pro: true },
			{ id: 'test-data', label: 'Test Data', pro: true },
		],
	},
	{
		category: 'SEO & Meta',
		icon: '\uD83D\uDD0D',
		items: [
			{ id: 'meta-tags', label: 'Meta Tags' },
			{ id: 'schema', label: 'Schema.org' },
		],
	},
	{
		category: 'Converters',
		icon: '\uD83D\uDD04',
		items: [
			{ id: 'svg-to-png', label: 'SVG to PNG' },
			{ id: 'html-to-markdown', label: 'HTML to Markdown' },
			{ id: 'markdown-preview', label: 'Markdown Preview' },
			{ id: 'aspect-ratio', label: 'Aspect Ratio' },
		],
	},
];

export default function Sidebar( { currentTool, onToolChange } ) {
	const { isPro, togglePro } = usePro();
	const isDebug = window.mlcWdtData?.isDebug || false;

	return (
		<nav className="mlc-wdt-sidebar" role="navigation" aria-label="Tool navigation">
			{ tools.map( ( category ) => (
				<div key={ category.category } className="mlc-wdt-sidebar-group">
					<h3 className="mlc-wdt-sidebar-category">
						<span className="mlc-wdt-sidebar-icon">{ category.icon }</span>
						{ category.category }
					</h3>
					<ul className="mlc-wdt-sidebar-items">
						{ category.items.map( ( tool ) => (
							<li key={ tool.id }>
								<button
									className={ `mlc-wdt-sidebar-item${
										currentTool === tool.id ? ' active' : ''
									}` }
									onClick={ () => onToolChange( tool.id ) }
									aria-current={
										currentTool === tool.id ? 'page' : undefined
									}
								>
									{ tool.label }
									{ tool.pro && ! isPro && <span className="mlc-wdt-sidebar-pro-tag">Pro</span> }
								</button>
							</li>
						) ) }
					</ul>
				</div>
			) ) }
			<div className="mlc-wdt-sidebar-divider" />
			<div className="mlc-wdt-sidebar-pro">
				{ isPro ? (
					<div className="mlc-wdt-pro-active">Pro Active</div>
				) : (
					<button className="mlc-wdt-pro-btn" disabled>
						Upgrade to Pro
					</button>
				) }
			</div>
			{ isDebug && (
				<>
					<div className="mlc-wdt-sidebar-divider" />
					<div className="mlc-wdt-sidebar-dev">
						<label className="mlc-wdt-dev-toggle">
							<input
								type="checkbox"
								checked={ isPro }
								onChange={ togglePro }
							/>
							<span className="mlc-wdt-dev-toggle-label">Dev: Pro Mode</span>
						</label>
					</div>
				</>
			) }
		</nav>
	);
}
