import { usePro } from '../context/ProContext';

export default function ProBadge( { children, feature } ) {
	const { isPro } = usePro();

	if ( isPro ) {
		return children;
	}

	return (
		<div className="mlc-wdt-pro-gate">
			<div className="mlc-wdt-pro-gate-overlay">
				<span className="mlc-wdt-pro-badge">Pro</span>
				{ feature && (
					<span className="mlc-wdt-pro-feature-label">
						{ feature }
					</span>
				) }
			</div>
			<div className="mlc-wdt-pro-gate-content">
				{ children }
			</div>
		</div>
	);
}
