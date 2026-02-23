import ToolCard from '../components/ToolCard';

export default function TableGenerator() {
	const upgradeUrl = window.dkdtData?.upgradeUrl;

	const preview = (
		<div className="dkdt-pro-upgrade-card">
			<span className="dkdt-pro-upgrade-badge">Pro</span>
			<h3 className="dkdt-pro-upgrade-title">HTML Table Generator</h3>
			<p className="dkdt-pro-upgrade-desc">
				Visual table builder with customizable rows, columns, styling, and CSV import. Generate clean HTML table markup ready to paste into your project.
			</p>
			{ upgradeUrl && (
				<a href={ upgradeUrl } className="dkdt-pro-btn">
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
