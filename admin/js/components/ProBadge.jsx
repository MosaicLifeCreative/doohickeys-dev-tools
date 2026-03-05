import { usePro } from '../context/ProContext';

export default function ProBadge( { children, feature } ) {
	const { isPro } = usePro();

	if ( isPro ) {
		return children;
	}

	return (
		<div className="dkdt-pro-gate">
			<div className="dkdt-pro-gate-overlay">
				<span className="dkdt-pro-badge">Pro</span>
				{ feature && (
					<span className="dkdt-pro-feature-label">
						{ feature }
					</span>
				) }
			</div>
			<div className="dkdt-pro-gate-content">
				{ children }
			</div>
		</div>
	);
}
