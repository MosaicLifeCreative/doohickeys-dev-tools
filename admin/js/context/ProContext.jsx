import { createContext, useContext } from '@wordpress/element';

const ProContext = createContext( {
	isPro: false,
} );

export function ProProvider( { children } ) {
	// In the future, this will check a license key via wp_localize_script data.
	// For now, it defaults to false (free version).
	const isPro = window.mlcWdtData?.isPro || false;

	return (
		<ProContext.Provider value={ { isPro } }>
			{ children }
		</ProContext.Provider>
	);
}

export function usePro() {
	return useContext( ProContext );
}
