import { createContext, useContext, useState, useCallback } from '@wordpress/element';

const ProContext = createContext( {
	isPro: false,
	togglePro: () => {},
} );

export function ProProvider( { children } ) {
	const [ isPro, setIsPro ] = useState( () => window.mlcWdtData?.isPro || false );

	const togglePro = useCallback( () => {
		const newVal = ! isPro;
		setIsPro( newVal );

		// Persist via AJAX.
		fetch( window.ajaxurl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams( {
				action: 'mlc_wdt_toggle_pro',
				nonce: window.mlcWdtData?.nonce || '',
			} ),
		} );
	}, [ isPro ] );

	return (
		<ProContext.Provider value={ { isPro, togglePro } }>
			{ children }
		</ProContext.Provider>
	);
}

export function usePro() {
	return useContext( ProContext );
}
