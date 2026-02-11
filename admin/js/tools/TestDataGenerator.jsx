import { useState, useMemo, useCallback } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CopyButton from '../components/CopyButton';
import ProBadge from '../components/ProBadge';

const FIRST_NAMES = [
	'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
	'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
	'Thomas', 'Sarah', 'Christopher', 'Karen', 'Daniel', 'Lisa', 'Matthew', 'Nancy',
	'Anthony', 'Betty', 'Mark', 'Margaret', 'Steven', 'Sandra', 'Andrew', 'Ashley',
	'Paul', 'Emily', 'Joshua', 'Donna', 'Kenneth', 'Michelle', 'Kevin', 'Carol',
];

const LAST_NAMES = [
	'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
	'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
	'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
	'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
];

const DOMAINS = [ 'gmail.com', 'yahoo.com', 'outlook.com', 'example.com', 'company.org', 'test.io' ];

const STREETS = [
	'Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Elm St', 'Pine Rd', 'Walnut Blvd',
	'Birch Ct', 'Willow Way', 'Cherry Ln', 'Park Ave', 'Lake Dr', 'Hill St', 'River Rd',
];

const CITIES = [
	'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
	'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Seattle',
	'Denver', 'Boston', 'Nashville', 'Portland', 'Atlanta', 'Miami',
];

const STATES = [ 'NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'FL', 'OH', 'WA', 'CO', 'GA', 'TN', 'OR', 'MA' ];

const COMPANIES = [
	'Acme Corp', 'Globex Inc', 'Initech', 'Umbrella Corp', 'Stark Industries',
	'Wayne Enterprises', 'Cyberdyne Systems', 'Weyland-Yutani', 'Soylent Corp',
	'Aperture Science', 'Tyrell Corp', 'Massive Dynamic', 'Oscorp', 'LexCorp',
];

const FIELDS = [
	{ id: 'name', label: 'Full Name' },
	{ id: 'firstName', label: 'First Name' },
	{ id: 'lastName', label: 'Last Name' },
	{ id: 'email', label: 'Email' },
	{ id: 'phone', label: 'Phone' },
	{ id: 'address', label: 'Address' },
	{ id: 'city', label: 'City' },
	{ id: 'state', label: 'State' },
	{ id: 'zip', label: 'ZIP Code' },
	{ id: 'company', label: 'Company' },
	{ id: 'date', label: 'Date' },
	{ id: 'id', label: 'ID (UUID)' },
];

function rand( arr ) {
	return arr[ Math.floor( Math.random() * arr.length ) ];
}

function randInt( min, max ) {
	return min + Math.floor( Math.random() * ( max - min + 1 ) );
}

function uuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, ( c ) => {
		const r = ( Math.random() * 16 ) | 0;
		return ( c === 'x' ? r : ( r & 0x3 ) | 0x8 ).toString( 16 );
	} );
}

function generateField( fieldId ) {
	const fn = rand( FIRST_NAMES );
	const ln = rand( LAST_NAMES );
	switch ( fieldId ) {
		case 'name': return `${ fn } ${ ln }`;
		case 'firstName': return fn;
		case 'lastName': return ln;
		case 'email': return `${ fn.toLowerCase() }.${ ln.toLowerCase() }@${ rand( DOMAINS ) }`;
		case 'phone': return `(${ randInt( 200, 999 ) }) ${ randInt( 200, 999 ) }-${ randInt( 1000, 9999 ) }`;
		case 'address': return `${ randInt( 100, 9999 ) } ${ rand( STREETS ) }`;
		case 'city': return rand( CITIES );
		case 'state': return rand( STATES );
		case 'zip': return String( randInt( 10000, 99999 ) );
		case 'company': return rand( COMPANIES );
		case 'date': {
			const y = randInt( 2020, 2026 );
			const m = String( randInt( 1, 12 ) ).padStart( 2, '0' );
			const d = String( randInt( 1, 28 ) ).padStart( 2, '0' );
			return `${ y }-${ m }-${ d }`;
		}
		case 'id': return uuid();
		default: return '';
	}
}

export default function TestDataGenerator() {
	const [ selectedFields, setSelectedFields ] = useState( [ 'name', 'email', 'phone', 'company' ] );
	const [ count, setCount ] = useState( 10 );
	const [ format, setFormat ] = useState( 'json' );
	const [ seed, setSeed ] = useState( 0 );

	const toggleField = useCallback( ( fieldId ) => {
		setSelectedFields( ( prev ) =>
			prev.includes( fieldId )
				? prev.filter( ( f ) => f !== fieldId )
				: [ ...prev, fieldId ]
		);
	}, [] );

	const data = useMemo( () => {
		// eslint-disable-next-line no-unused-vars
		const _trigger = seed;
		const rows = [];
		for ( let i = 0; i < count; i++ ) {
			const row = {};
			selectedFields.forEach( ( f ) => {
				row[ f ] = generateField( f );
			} );
			rows.push( row );
		}
		return rows;
	}, [ selectedFields, count, seed ] );

	const output = useMemo( () => {
		if ( data.length === 0 || selectedFields.length === 0 ) return '';

		if ( format === 'json' ) {
			return JSON.stringify( data, null, 2 );
		}

		if ( format === 'csv' ) {
			const headers = selectedFields.join( ',' );
			const rows = data.map( ( row ) =>
				selectedFields.map( ( f ) => `"${ row[ f ] }"` ).join( ',' )
			);
			return [ headers, ...rows ].join( '\n' );
		}

		// Table (plain text).
		const labels = selectedFields.map( ( f ) => FIELDS.find( ( ff ) => ff.id === f )?.label || f );
		const widths = labels.map( ( label, i ) => {
			const fieldId = selectedFields[ i ];
			const maxData = Math.max( ...data.map( ( row ) => ( row[ fieldId ] || '' ).length ) );
			return Math.max( label.length, maxData ) + 2;
		} );
		let table = labels.map( ( l, i ) => l.padEnd( widths[ i ] ) ).join( '| ' ) + '\n';
		table += widths.map( ( w ) => '-'.repeat( w ) ).join( '+-' ) + '\n';
		data.forEach( ( row ) => {
			table += selectedFields.map( ( f, i ) => ( row[ f ] || '' ).padEnd( widths[ i ] ) ).join( '| ' ) + '\n';
		} );
		return table;
	}, [ data, format, selectedFields ] );

	const preview = output ? (
		<div className="mlc-wdt-testdata-preview">
			<div style={ { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' } }>
				<span className="mlc-wdt-section-label" style={ { margin: 0 } }>Output</span>
				<CopyButton text={ output } />
			</div>
			<pre className="mlc-wdt-code-pre" style={ { maxHeight: '300px', overflow: 'auto' } }><code>{ output }</code></pre>
		</div>
	) : null;

	const controls = (
		<div className="mlc-wdt-testdata-controls">
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Fields</label>
				<div className="mlc-wdt-testdata-fields">
					{ FIELDS.map( ( field ) => (
						<label key={ field.id } className="mlc-wdt-checkbox">
							<input
								type="checkbox"
								checked={ selectedFields.includes( field.id ) }
								onChange={ () => toggleField( field.id ) }
							/>
							{ field.label }
						</label>
					) ) }
				</div>
			</div>

			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Count: { count }</label>
				<div className="mlc-wdt-range-with-value">
					<input
						type="range"
						className="mlc-wdt-range"
						min="1"
						max="100"
						value={ count }
						onChange={ ( e ) => setCount( Number( e.target.value ) ) }
					/>
					<span className="mlc-wdt-field-value">{ count }</span>
				</div>
			</div>

			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Format</label>
				<div className="mlc-wdt-radio-group">
					{ [ { id: 'json', label: 'JSON' }, { id: 'csv', label: 'CSV' }, { id: 'table', label: 'Table' } ].map( ( f ) => (
						<label key={ f.id } className={ `mlc-wdt-radio${ format === f.id ? ' active' : '' }` }>
							<input
								type="radio"
								value={ f.id }
								checked={ format === f.id }
								onChange={ () => setFormat( f.id ) }
							/>
							{ f.label }
						</label>
					) ) }
				</div>
			</div>

			<button className="mlc-wdt-add-btn" onClick={ () => setSeed( ( prev ) => prev + 1 ) }>
				Regenerate
			</button>
		</div>
	);

	return (
		<ProBadge feature="Test Data Generator is a Pro feature">
			<ToolCard
				title="Test Data Generator"
				help="Generate realistic fake data for testing. Choose fields (name, email, phone, address, etc.), set the count, and export as JSON, CSV, or plain text table."
				preview={ preview }
				controls={ controls }
			/>
		</ProBadge>
	);
}
