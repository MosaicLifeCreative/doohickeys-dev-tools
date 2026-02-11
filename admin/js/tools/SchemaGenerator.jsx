import { useState, useMemo } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CodeBlock from '../components/CodeBlock';
import { usePro } from '../context/ProContext';

const SCHEMA_TYPES = [
	{ id: 'article', label: 'Article' },
	{ id: 'local-business', label: 'Local Business' },
	{ id: 'faq', label: 'FAQ Page' },
	{ id: 'product', label: 'Product', pro: true },
	{ id: 'person', label: 'Person', pro: true },
	{ id: 'organization', label: 'Organization', pro: true },
	{ id: 'event', label: 'Event', pro: true },
	{ id: 'recipe', label: 'Recipe', pro: true },
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
	product: [
		{ key: 'name', label: 'Product Name', type: 'text', default: 'Widget Pro' },
		{ key: 'description', label: 'Description', type: 'textarea', default: 'The best widget money can buy.' },
		{ key: 'image', label: 'Image URL', type: 'text', default: 'https://example.com/product.jpg' },
		{ key: 'brand', label: 'Brand', type: 'text', default: 'WidgetCo' },
		{ key: 'sku', label: 'SKU', type: 'text', default: 'WP-001' },
		{ key: 'price', label: 'Price', type: 'text', default: '29.99' },
		{ key: 'currency', label: 'Currency', type: 'text', default: 'USD' },
		{ key: 'availability', label: 'Availability', type: 'text', default: 'InStock' },
	],
	person: [
		{ key: 'name', label: 'Name', type: 'text', default: 'Jane Doe' },
		{ key: 'jobTitle', label: 'Job Title', type: 'text', default: 'Software Engineer' },
		{ key: 'url', label: 'Website URL', type: 'text', default: 'https://janedoe.com' },
		{ key: 'email', label: 'Email', type: 'text', default: 'jane@example.com' },
		{ key: 'image', label: 'Photo URL', type: 'text', default: 'https://example.com/jane.jpg' },
		{ key: 'worksFor', label: 'Works For', type: 'text', default: 'Tech Corp' },
	],
	organization: [
		{ key: 'name', label: 'Name', type: 'text', default: 'My Organization' },
		{ key: 'url', label: 'Website URL', type: 'text', default: 'https://example.com' },
		{ key: 'logo', label: 'Logo URL', type: 'text', default: 'https://example.com/logo.png' },
		{ key: 'description', label: 'Description', type: 'textarea', default: 'A leading organization.' },
		{ key: 'email', label: 'Email', type: 'text', default: 'info@example.com' },
		{ key: 'phone', label: 'Phone', type: 'text', default: '+1-555-000-0000' },
	],
	faq: [
		{ key: 'q1', label: 'Question 1', type: 'text', default: 'What is this product?' },
		{ key: 'a1', label: 'Answer 1', type: 'textarea', default: 'This is a great product that helps you do things.' },
		{ key: 'q2', label: 'Question 2', type: 'text', default: 'How much does it cost?' },
		{ key: 'a2', label: 'Answer 2', type: 'textarea', default: 'It starts at $29.99/month.' },
		{ key: 'q3', label: 'Question 3', type: 'text', default: 'Is there a free trial?' },
		{ key: 'a3', label: 'Answer 3', type: 'textarea', default: 'Yes, we offer a 14-day free trial.' },
	],
	event: [
		{ key: 'name', label: 'Event Name', type: 'text', default: 'Tech Conference 2026' },
		{ key: 'description', label: 'Description', type: 'textarea', default: 'Annual technology conference.' },
		{ key: 'startDate', label: 'Start Date', type: 'text', default: '2026-06-15T09:00' },
		{ key: 'endDate', label: 'End Date', type: 'text', default: '2026-06-17T17:00' },
		{ key: 'location', label: 'Location Name', type: 'text', default: 'Convention Center' },
		{ key: 'street', label: 'Street Address', type: 'text', default: '500 Convention Way' },
		{ key: 'city', label: 'City', type: 'text', default: 'San Francisco' },
		{ key: 'image', label: 'Image URL', type: 'text', default: 'https://example.com/event.jpg' },
	],
	recipe: [
		{ key: 'name', label: 'Recipe Name', type: 'text', default: 'Classic Pancakes' },
		{ key: 'description', label: 'Description', type: 'textarea', default: 'Fluffy, golden pancakes perfect for breakfast.' },
		{ key: 'image', label: 'Image URL', type: 'text', default: 'https://example.com/pancakes.jpg' },
		{ key: 'prepTime', label: 'Prep Time (ISO)', type: 'text', default: 'PT10M' },
		{ key: 'cookTime', label: 'Cook Time (ISO)', type: 'text', default: 'PT15M' },
		{ key: 'servings', label: 'Servings', type: 'text', default: '4' },
		{ key: 'calories', label: 'Calories', type: 'text', default: '350' },
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
		case 'product':
			return {
				'@context': 'https://schema.org',
				'@type': 'Product',
				name: values.name,
				description: values.description,
				image: values.image,
				brand: { '@type': 'Brand', name: values.brand },
				sku: values.sku,
				offers: {
					'@type': 'Offer',
					price: values.price,
					priceCurrency: values.currency,
					availability: `https://schema.org/${ values.availability }`,
				},
			};
		case 'person':
			return {
				'@context': 'https://schema.org',
				'@type': 'Person',
				name: values.name,
				jobTitle: values.jobTitle,
				url: values.url,
				email: values.email,
				image: values.image,
				worksFor: { '@type': 'Organization', name: values.worksFor },
			};
		case 'organization':
			return {
				'@context': 'https://schema.org',
				'@type': 'Organization',
				name: values.name,
				url: values.url,
				logo: values.logo,
				description: values.description,
				email: values.email,
				telephone: values.phone,
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
		case 'event':
			return {
				'@context': 'https://schema.org',
				'@type': 'Event',
				name: values.name,
				description: values.description,
				startDate: values.startDate,
				endDate: values.endDate,
				image: values.image,
				location: {
					'@type': 'Place',
					name: values.location,
					address: { '@type': 'PostalAddress', streetAddress: values.street, addressLocality: values.city },
				},
			};
		case 'recipe':
			return {
				'@context': 'https://schema.org',
				'@type': 'Recipe',
				name: values.name,
				description: values.description,
				image: values.image,
				prepTime: values.prepTime,
				cookTime: values.cookTime,
				recipeYield: values.servings,
				nutrition: { '@type': 'NutritionInformation', calories: `${ values.calories } calories` },
			};
		default:
			return {};
	}
}

export default function SchemaGenerator() {
	const { isPro } = usePro();
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

	const controls = (
		<div className="mlc-wdt-schema-controls">
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Schema Type</label>
				<div className="mlc-wdt-radio-group" style={ { flexWrap: 'wrap' } }>
					{ SCHEMA_TYPES.map( ( t ) => (
						<label
							key={ t.id }
							className={ `mlc-wdt-radio${ schemaType === t.id ? ' active' : '' }${ t.pro && ! isPro ? ' mlc-wdt-radio-disabled' : '' }` }
							title={ t.pro && ! isPro ? 'Pro feature' : '' }
						>
							<input
								type="radio"
								value={ t.id }
								checked={ schemaType === t.id }
								onChange={ () => handleTypeChange( t.id ) }
								disabled={ t.pro && ! isPro }
							/>
							{ t.label }
							{ t.pro && ! isPro && <span className="mlc-wdt-pro-badge-inline">Pro</span> }
						</label>
					) ) }
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
			help="Generate JSON-LD structured data for SEO. Choose a schema type (Article, Business, Product, FAQ, etc.), fill in the fields, and copy the script tag."
			controls={ controls }
			output={ output }
		/>
	);
}
