import { useState } from '@wordpress/element';

export default function CopyButton( { text } ) {
	const [ copied, setCopied ] = useState( false );

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText( text );
			setCopied( true );
			setTimeout( () => setCopied( false ), 2000 );
		} catch {
			// Fallback for older browsers
			const textarea = document.createElement( 'textarea' );
			textarea.value = text;
			textarea.style.position = 'fixed';
			textarea.style.opacity = '0';
			document.body.appendChild( textarea );
			textarea.select();
			document.execCommand( 'copy' );
			document.body.removeChild( textarea );
			setCopied( true );
			setTimeout( () => setCopied( false ), 2000 );
		}
	};

	return (
		<button
			onClick={ handleCopy }
			className={ `dkdt-copy-btn${ copied ? ' copied' : '' }` }
			aria-label={ copied ? 'Copied' : 'Copy to clipboard' }
		>
			{ copied ? 'Copied!' : 'Copy' }
		</button>
	);
}
