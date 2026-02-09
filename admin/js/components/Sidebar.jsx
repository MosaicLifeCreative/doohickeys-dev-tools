const tools = [
	{
		category: 'CSS Tools',
		icon: '\uD83C\uDFA8',
		items: [
			{ id: 'gradient', label: 'Gradient' },
			{ id: 'box-shadow', label: 'Box Shadow' },
		],
	},
	{
		category: 'Schema',
		icon: '\uD83D\uDCCA',
		items: [ { id: 'schema', label: 'Generator' } ],
	},
	{
		category: 'QR Code',
		icon: '\uD83D\uDCF1',
		items: [ { id: 'qrcode', label: 'Generator' } ],
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
];

export default function Sidebar( { currentTool, onToolChange } ) {
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
				<button className="mlc-wdt-pro-btn" disabled>
					Upgrade to Pro
				</button>
			</div>
		</nav>
	);
}
