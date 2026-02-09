import { useState } from '@wordpress/element';

export default function ToolCard( { title, help, preview, controls, output } ) {
	const [ showHelp, setShowHelp ] = useState( false );

	return (
		<div className="mlc-wdt-tool-card">
			<header className="mlc-wdt-tool-header">
				<h2 className="mlc-wdt-tool-title">{ title }</h2>
				{ help && (
					<div className="mlc-wdt-tool-help-wrap">
						<button
							className="mlc-wdt-help-btn"
							onClick={ () => setShowHelp( ! showHelp ) }
							aria-label="Toggle help"
							title="Help"
						>
							?
						</button>
						{ showHelp && (
							<div className="mlc-wdt-help-tooltip">
								{ help }
							</div>
						) }
					</div>
				) }
			</header>

			{ preview && (
				<div className="mlc-wdt-preview-area">
					{ preview }
				</div>
			) }

			{ controls && (
				<div className="mlc-wdt-controls-area">
					<h3 className="mlc-wdt-section-label">Controls</h3>
					{ controls }
				</div>
			) }

			{ output && (
				<div className="mlc-wdt-output-area">
					{ output }
				</div>
			) }
		</div>
	);
}
