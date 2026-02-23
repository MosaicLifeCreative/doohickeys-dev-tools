import CopyButton from './CopyButton';

export default function CodeBlock( { code, label = 'Generated CSS' } ) {
	return (
		<div className="dkdt-code-block">
			<div className="dkdt-code-header">
				<h3 className="dkdt-section-label">{ label }</h3>
				<CopyButton text={ code } />
			</div>
			<pre className="dkdt-code-pre">
				<code>{ code }</code>
			</pre>
		</div>
	);
}
