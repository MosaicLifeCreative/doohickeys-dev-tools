import ToolCard from '../components/ToolCard';

export default function DiffChecker() {
	const upgradeUrl = window.mlcWdtData?.upgradeUrl;

	const preview = (
		<div className="mlc-wdt-pro-upgrade-card">
			<span className="mlc-wdt-pro-upgrade-badge">Pro</span>
			<h3 className="mlc-wdt-pro-upgrade-title">Diff Checker</h3>
			<p className="mlc-wdt-pro-upgrade-desc">
				Side-by-side text comparison with highlighted additions, deletions, and modifications. Paste two blocks of text and instantly see the differences.
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
			title="Diff Checker"
			help="Available with Doohickey's Dev Tools Pro."
			preview={ preview }
		/>
	);
}
