export default function Header() {
	return (
		<header className="dkdt-header">
			<div className="dkdt-header-left">
				<h1 className="dkdt-title">Doohickey's Dev Tools</h1>
				<span className="dkdt-subtitle">
					Essential utilities for web developers
				</span>
			</div>
			<div className="dkdt-header-right">
				<span className="dkdt-version">
					v{ window.dkdtData?.version || '1.0.0' }
				</span>
			</div>
		</header>
	);
}
