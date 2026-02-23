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
	const { isPro } = usePro();

	return (
		<nav className="dkdt-sidebar" role="navigation" aria-label="Tool navigation">
			{ tools.map( ( category ) => (
				<div key={ category.category } className="dkdt-sidebar-group">
					<h3 className="dkdt-sidebar-category">
						<span className="dkdt-sidebar-icon">{ category.icon }</span>
						{ category.category }
					</h3>
					<ul className="dkdt-sidebar-items">
						{ category.items.map( ( tool ) => (
							<li key={ tool.id }>
								<button
									className={ `dkdt-sidebar-item${
										currentTool === tool.id ? ' active' : ''
									}` }
									onClick={ () => onToolChange( tool.id ) }
									aria-current={
										currentTool === tool.id ? 'page' : undefined
									}
								>
									{ tool.label }
									{ tool.pro && ! isPro && <span className="dkdt-sidebar-pro-tag">Pro</span> }
								</button>
							</li>
						) ) }
					</ul>
				</div>
			) ) }
			<div className="dkdt-sidebar-divider" />
			<div className="dkdt-sidebar-pro">
				{ isPro ? (
					<div className="dkdt-pro-active">Pro Active</div>
				) : (
					window.dkdtData?.upgradeUrl ? (
						<a className="dkdt-pro-btn" href={ window.dkdtData.upgradeUrl }>
							Upgrade to Pro
						</a>
					) : (
						<button className="dkdt-pro-btn" disabled>
							Upgrade to Pro
						</button>
					)
				) }
			</div>
		</nav>
	);
}
