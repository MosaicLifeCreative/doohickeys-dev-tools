import { useState, useMemo } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CodeBlock from '../components/CodeBlock';

const SCHEMA_TYPES = [
	{ id: 'article', label: 'Article' },
	{ id: 'local-business', label: 'Local Business' },
	{ id: 'faq', label: 'FAQ Page' },
];

const FIELDS = {
	article: [
		{ key: 'headline', label: 'Headline', type: 'text', default: 'My Article Title' },
		{ key: 'description', label: 'Description', type: 'textarea', default: 'A brief description of the article.' },
		{ key: 'authorName', label: 'Author Name', type: 'text', default: 'John Doe' },
		{ key: 'publisherName', label: 'Publisher', type: 'text', default: 'My Website' },
		{ key: 'publisherLogo', label: 'Publisher Logo URL', type: 'text', default: 'https://example.com/logo.png' },
		{ key: 'datePublished', label: 'Date Published', type: 'text', default: '2026-01-15' },
		{ key: 'dateModified', label: 'Date Modified', type: 'text', default: '2026-02-01' },
		{ key: 'image', label: 'Image URL', type: 'text', default: 'https://example.com/image.jpg' },
	],
	'local-business': [
		{ key: 'name', label: 'Business Name', type: 'text', default: 'My Business' },
		{ key: 'description', label: 'Description', type: 'textarea', default: 'A great local business.' },
		{ key: 'image', label: 'Image URL', type: 'text', default: 'https://example.com/photo.jpg' },
		{ key: 'phone', label: 'Phone', type: 'text', default: '+1-555-123-4567' },
		{ key: 'street', label: 'Street Address', type: 'text', default: '123 Main St' },
		{ key: 'city', label: 'City', type: 'text', default: 'New York' },
		{ key: 'state', label: 'State', type: 'text', default: 'NY' },
		{ key: 'zip', label: 'ZIP Code', type: 'text', default: '10001' },
		{ key: 'priceRange', label: 'Price Range', type: 'text', default: '$$' },
	],
	faq: [
		{ key: 'q1', label: 'Question 1', type: 'text', default: 'What is this product?' },
		{ key: 'a1', label: 'Answer 1', type: 'textarea', default: 'This is a great product that helps you do things.' },
		{ key: 'q2', label: 'Question 2', type: 'text', default: 'How much does it cost?' },
		{ key: 'a2', label: 'Answer 2', type: 'textarea', default: 'It starts at $29.99/month.' },
		{ key: 'q3', label: 'Question 3', type: 'text', default: 'Is there a free trial?' },
		{ key: 'a3', label: 'Answer 3', type: 'textarea', default: 'Yes, we offer a 14-day free trial.' },
	],
};

function buildSchema( type, values ) {
	switch ( type ) {
		case 'article':
			return {
				'@context': 'https://schema.org',
				'@type': 'Article',
				headline: values.headline,
				description: values.description,
				image: values.image,
				datePublished: values.datePublished,
				dateModified: values.dateModified,
				author: { '@type': 'Person', name: values.authorName },
				publisher: {
					'@type': 'Organization',
					name: values.publisherName,
					logo: { '@type': 'ImageObject', url: values.publisherLogo },
				},
			};
		case 'local-business':
			return {
				'@context': 'https://schema.org',
				'@type': 'LocalBusiness',
				name: values.name,
				description: values.description,
				image: values.image,
				telephone: values.phone,
				priceRange: values.priceRange,
				address: {
					'@type': 'PostalAddress',
					streetAddress: values.street,
					addressLocality: values.city,
					addressRegion: values.state,
					postalCode: values.zip,
				},
			};
		case 'faq':
			return {
				'@context': 'https://schema.org',
				'@type': 'FAQPage',
				mainEntity: [
					{ '@type': 'Question', name: values.q1, acceptedAnswer: { '@type': 'Answer', text: values.a1 } },
					{ '@type': 'Question', name: values.q2, acceptedAnswer: { '@type': 'Answer', text: values.a2 } },
					{ '@type': 'Question', name: values.q3, acceptedAnswer: { '@type': 'Answer', text: values.a3 } },
				].filter( ( q ) => q.name ),
			};
		default:
			return {};
	}
}

export default function SchemaGenerator() {
	const [ schemaType, setSchemaType ] = useState( 'article' );
	const [ values, setValues ] = useState( () => {
		const defaults = {};
		FIELDS.article.forEach( ( f ) => { defaults[ f.key ] = f.default; } );
		return defaults;
	} );

	const handleTypeChange = ( newType ) => {
		setSchemaType( newType );
		const defaults = {};
		FIELDS[ newType ].forEach( ( f ) => { defaults[ f.key ] = f.default; } );
		setValues( defaults );
	};

	const schema = useMemo( () => buildSchema( schemaType, values ), [ schemaType, values ] );
	const jsonLd = useMemo( () => JSON.stringify( schema, null, 2 ), [ schema ] );
	const scriptTag = `<script type="application/ld+json">\n${ jsonLd }\n</script>`;

	const upgradeUrl = window.mlcWdtData?.upgradeUrl;

	const controls = (
		<div className="mlc-wdt-schema-controls">
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Schema Type</label>
				<div className="mlc-wdt-radio-group" style={ { flexWrap: 'wrap' } }>
					{ SCHEMA_TYPES.map( ( t ) => (
						<label
							key={ t.id }
							className={ `mlc-wdt-radio${ schemaType === t.id ? ' active' : '' }` }
						>
							<input
								type="radio"
								value={ t.id }
								checked={ schemaType === t.id }
								onChange={ () => handleTypeChange( t.id ) }
							/>
							{ t.label }
						</label>
					) ) }
				</div>
				<div className="mlc-wdt-pro-inline-note" style={ { marginTop: '8px' } }>
					<span className="mlc-wdt-pro-badge-inline">Pro</span>
					5 additional schema types (Product, Person, Organization, Event, Recipe) available in Pro.
					{ upgradeUrl && <a href={ upgradeUrl } className="mlc-wdt-pro-inline-link">Upgrade</a> }
				</div>
			</div>

			{ ( FIELDS[ schemaType ] || [] ).map( ( field ) => (
				<div key={ field.key } className="mlc-wdt-control-group">
					<label className="mlc-wdt-control-label">{ field.label }</label>
					{ field.type === 'textarea' ? (
						<textarea
							className="mlc-wdt-textarea"
							rows="2"
							value={ values[ field.key ] || '' }
							onChange={ ( e ) => setValues( ( prev ) => ( { ...prev, [ field.key ]: e.target.value } ) ) }
						/>
					) : (
						<input
							type="text"
							className="mlc-wdt-text-input"
							value={ values[ field.key ] || '' }
							onChange={ ( e ) => setValues( ( prev ) => ( { ...prev, [ field.key ]: e.target.value } ) ) }
						/>
					) }
				</div>
			) ) }
		</div>
	);

	const output = (
		<div>
			<CodeBlock code={ scriptTag } label="HTML Script Tag" />
			<CodeBlock code={ jsonLd } label="JSON-LD" />
		</div>
	);

	return (
		<ToolCard
			title="Schema.org Generator"
			help="Generate JSON-LD structured data for SEO. Choose a schema type (Article, Business, FAQ), fill in the fields, and copy the script tag. Additional types available in Pro."
			controls={ controls }
			output={ output }
		/>
	);
}
