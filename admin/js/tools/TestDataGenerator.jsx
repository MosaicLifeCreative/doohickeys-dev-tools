import ToolCard from '../components/ToolCard';

export default function TestDataGenerator() {
	const upgradeUrl = window.dkdtData?.upgradeUrl;

	const preview = (
		<div className="dkdt-pro-upgrade-card">
			<span className="dkdt-pro-upgrade-badge">Pro</span>
			<h3 className="dkdt-pro-upgrade-title">Test Data Generator</h3>
			<p className="dkdt-pro-upgrade-desc">
				Generate realistic fake data — names, emails, addresses, phone numbers, companies, and more. Export as JSON or CSV for testing and development.
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
			title="Test Data Generator"
			help="Available with Doohickey's Dev Tools Pro."
			preview={ preview }
		/>
	);
}
