import ToolCard from '../components/ToolCard';

export default function DiffChecker() {
	const upgradeUrl = window.dkdtData?.upgradeUrl;

	const preview = (
		<div className="dkdt-pro-upgrade-card">
			<span className="dkdt-pro-upgrade-badge">Pro</span>
			<h3 className="dkdt-pro-upgrade-title">Diff Checker</h3>
			<p className="dkdt-pro-upgrade-desc">
				Side-by-side text comparison with highlighted additions, deletions, and modifications. Paste two blocks of text and instantly see the differences.
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
			title="Diff Checker"
			help="Available with Doohickey's Dev Tools Pro."
			preview={ preview }
		/>
	);
}
