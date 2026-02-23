import { createContext, useContext, useState } from '@wordpress/element';

const ProContext = createContext( {
	isPro: false,
} );

export function ProProvider( { children } ) {
	const [ isPro ] = useState( () => window.dkdtData?.isPro || false );

	return (
		<ProContext.Provider value={ { isPro } }>
			{ children }
		</ProContext.Provider>
	);
}

export function usePro() {
	return useContext( ProContext );
}
