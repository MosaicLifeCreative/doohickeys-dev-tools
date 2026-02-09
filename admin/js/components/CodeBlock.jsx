import CopyButton from './CopyButton';

export default function CodeBlock( { code, label = 'Generated CSS' } ) {
	return (
		<div className="mlc-wdt-code-block">
			<div className="mlc-wdt-code-header">
				<h3 className="mlc-wdt-section-label">{ label }</h3>
				<CopyButton text={ code } />
			</div>
			<pre className="mlc-wdt-code-pre">
				<code>{ code }</code>
			</pre>
		</div>
	);
}
