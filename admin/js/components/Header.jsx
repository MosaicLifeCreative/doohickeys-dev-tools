export default function Header() {
	return (
		<header className="mlc-wdt-header">
			<div className="mlc-wdt-header-left">
				<h1 className="mlc-wdt-title">Web Dev Tools</h1>
				<span className="mlc-wdt-subtitle">
					Essential utilities for web developers
				</span>
			</div>
			<div className="mlc-wdt-header-right">
				<span className="mlc-wdt-version">
					v{ window.mlcWdtData?.version || '1.0.0' }
				</span>
			</div>
		</header>
	);
}
