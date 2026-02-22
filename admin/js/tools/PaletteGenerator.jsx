import ToolCard from '../components/ToolCard';

export default function PaletteGenerator() {
	const upgradeUrl = window.mlcWdtData?.upgradeUrl;

	const preview = (
		<div className="mlc-wdt-pro-upgrade-card">
			<span className="mlc-wdt-pro-upgrade-badge">Pro</span>
			<h3 className="mlc-wdt-pro-upgrade-title">Palette Generator</h3>
			<p className="mlc-wdt-pro-upgrade-desc">
				Interactive color wheel with 7 harmony modes — complementary, analogous, triadic, split-complementary, tetradic, square, and monochromatic. Export palettes as CSS or SCSS variables.
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
			title="Palette Generator"
			help="Available with Doohickey's Dev Tools Pro."
			preview={ preview }
		/>
	);
}
