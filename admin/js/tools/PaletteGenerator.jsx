import ToolCard from '../components/ToolCard';

export default function PaletteGenerator() {
	const upgradeUrl = window.dkdtData?.upgradeUrl;

	const preview = (
		<div className="dkdt-pro-upgrade-card">
			<span className="dkdt-pro-upgrade-badge">Pro</span>
			<h3 className="dkdt-pro-upgrade-title">Palette Generator</h3>
			<p className="dkdt-pro-upgrade-desc">
				Interactive color wheel with 7 harmony modes — complementary, analogous, triadic, split-complementary, tetradic, square, and monochromatic. Export palettes as CSS or SCSS variables.
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
			title="Palette Generator"
			help="Available with Doohickey's Dev Tools Pro."
			preview={ preview }
		/>
	);
}
