import ToolCard from '../components/ToolCard';

export default function TestDataGenerator() {
	const upgradeUrl = window.mlcWdtData?.upgradeUrl;

	const preview = (
		<div className="mlc-wdt-pro-upgrade-card">
			<span className="mlc-wdt-pro-upgrade-badge">Pro</span>
			<h3 className="mlc-wdt-pro-upgrade-title">Test Data Generator</h3>
			<p className="mlc-wdt-pro-upgrade-desc">
				Generate realistic fake data — names, emails, addresses, phone numbers, companies, and more. Export as JSON or CSV for testing and development.
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
			title="Test Data Generator"
			help="Available with Doohickey's Dev Tools Pro."
			preview={ preview }
		/>
	);
}
