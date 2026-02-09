import { usePro } from '../context/ProContext';

const tools = [
	{
		category: 'CSS Tools',
		icon: '\uD83C\uDFA8',
		items: [
			{ id: 'gradient', label: 'Gradient' },
			{ id: 'box-shadow', label: 'Box Shadow' },
			{ id: 'border', label: 'Border' },
			{ id: 'border-radius', label: 'Border Radius' },
		],
	},
	{
		category: 'Color',
		icon: '\uD83C\uDFA8',
		items: [
			{ id: 'color-converter', label: 'Converter' },
			{ id: 'contrast-checker', label: 'Contrast' },
			{ id: 'palette', label: 'Palette' },
		],
	},
	{
		category: 'Generators',
		icon: '\u2699\uFE0F',
		items: [
			{ id: 'qrcode', label: 'QR Code' },
			{ id: 'placeholder-image', label: 'Placeholder Image' },
		],
	},
	{
		category: 'Schema',
		icon: '\uD83D\uDCCA',
		items: [ { id: 'schema', label: 'Generator' } ],
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
