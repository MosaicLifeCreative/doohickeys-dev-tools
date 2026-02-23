import { useState } from '@wordpress/element';

export default function ToolCard( { title, help, preview, controls, output } ) {
	const [ showHelp, setShowHelp ] = useState( false );

	return (
		<div className="dkdt-tool-card">
			<header className="dkdt-tool-header">
				<h2 className="dkdt-tool-title">{ title }</h2>
				{ help && (
					<div className="dkdt-tool-help-wrap">
						<button
							className="dkdt-help-btn"
							onClick={ () => setShowHelp( ! showHelp ) }
							aria-label="Toggle help"
							title="Help"
						>
							?
						</button>
						{ showHelp && (
							<div className="dkdt-help-tooltip">
								{ help }
							</div>
						) }
					</div>
				) }
			</header>

			{ preview && (
				<div className="dkdt-preview-area">
					{ preview }
				</div>
			) }

			{ controls && (
				<div className="dkdt-controls-area">
					<h3 className="dkdt-section-label">Controls</h3>
					{ controls }
				</div>
			) }

			{ output && (
				<div className="dkdt-output-area">
					{ output }
				</div>
			) }
		</div>
	);
}
