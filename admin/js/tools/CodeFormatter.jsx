import ToolCard from '../components/ToolCard';

export default function CodeFormatter() {
	const upgradeUrl = window.dkdtData?.upgradeUrl;

	const preview = (
		<div className="dkdt-pro-upgrade-card">
			<span className="dkdt-pro-upgrade-badge">Pro</span>
			<h3 className="dkdt-pro-upgrade-title">Code Formatter</h3>
			<p className="dkdt-pro-upgrade-desc">
				Auto-format and beautify JSON, HTML, CSS, JavaScript, and SQL. Paste messy code, get clean output instantly.
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
			title="Code Formatter"
			help="Available with Doohickey's Dev Tools Pro."
			preview={ preview }
		/>
	);
}
