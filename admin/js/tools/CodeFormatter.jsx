import ToolCard from '../components/ToolCard';

export default function CodeFormatter() {
	const upgradeUrl = window.mlcWdtData?.upgradeUrl;

	const preview = (
		<div className="mlc-wdt-pro-upgrade-card">
			<span className="mlc-wdt-pro-upgrade-badge">Pro</span>
			<h3 className="mlc-wdt-pro-upgrade-title">Code Formatter</h3>
			<p className="mlc-wdt-pro-upgrade-desc">
				Auto-format and beautify JSON, HTML, CSS, JavaScript, and SQL. Paste messy code, get clean output instantly.
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
			title="Code Formatter"
			help="Available with Doohickey's Dev Tools Pro."
			preview={ preview }
		/>
	);
}
