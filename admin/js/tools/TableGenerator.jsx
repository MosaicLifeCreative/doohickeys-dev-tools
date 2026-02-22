import ToolCard from '../components/ToolCard';

export default function TableGenerator() {
	const upgradeUrl = window.mlcWdtData?.upgradeUrl;

	const preview = (
		<div className="mlc-wdt-pro-upgrade-card">
			<span className="mlc-wdt-pro-upgrade-badge">Pro</span>
			<h3 className="mlc-wdt-pro-upgrade-title">HTML Table Generator</h3>
			<p className="mlc-wdt-pro-upgrade-desc">
				Visual table builder with customizable rows, columns, styling, and CSV import. Generate clean HTML table markup ready to paste into your project.
			</p>
			{ upgradeUrl && (
				<a href={ upgradeUrl } className="mlc-wdt-pro-btn">
					Upgrade to Pro
				</a>
			) }
		</div>
	);

	return (
		<ToolCard
			title="HTML Table Generator"
			help="Available with Doohickey's Dev Tools Pro."
			preview={ preview }
		/>
	);
}
