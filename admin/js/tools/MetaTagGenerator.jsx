import { useState, useMemo } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CodeBlock from '../components/CodeBlock';

export default function MetaTagGenerator() {
	const [ title, setTitle ] = useState( 'My Page Title' );
	const [ description, setDescription ] = useState( 'A brief description of this page for search engines and social media.' );
	const [ url, setUrl ] = useState( 'https://example.com/page' );
	const [ image, setImage ] = useState( 'https://example.com/og-image.jpg' );
	const [ siteName, setSiteName ] = useState( 'My Website' );
	const [ twitterHandle, setTwitterHandle ] = useState( '@mysite' );
	const [ type, setType ] = useState( 'website' );
	const [ robots, setRobots ] = useState( 'index, follow' );

	const metaTags = useMemo( () => {
		const tags = [];
		// Basic SEO.
		tags.push( `<title>${ title }</title>` );
		tags.push( `<meta name="description" content="${ description }">` );
		tags.push( `<meta name="robots" content="${ robots }">` );
		tags.push( `<link rel="canonical" href="${ url }">` );
		tags.push( '' );
		// Open Graph (Facebook / LinkedIn).
		tags.push( '<!-- Open Graph / Facebook -->' );
		tags.push( `<meta property="og:type" content="${ type }">` );
		tags.push( `<meta property="og:url" content="${ url }">` );
		tags.push( `<meta property="og:title" content="${ title }">` );
		tags.push( `<meta property="og:description" content="${ description }">` );
		tags.push( `<meta property="og:image" content="${ image }">` );
		tags.push( `<meta property="og:site_name" content="${ siteName }">` );
		tags.push( '' );
		// Twitter Card.
		tags.push( '<!-- Twitter -->' );
		tags.push( '<meta property="twitter:card" content="summary_large_image">' );
		tags.push( `<meta property="twitter:url" content="${ url }">` );
		tags.push( `<meta property="twitter:title" content="${ title }">` );
		tags.push( `<meta property="twitter:description" content="${ description }">` );
		tags.push( `<meta property="twitter:image" content="${ image }">` );
		if ( twitterHandle ) {
			tags.push( `<meta property="twitter:site" content="${ twitterHandle }">` );
		}
		return tags.join( '\n' );
	}, [ title, description, url, image, siteName, twitterHandle, type, robots ] );

	const preview = (
		<div className="mlc-wdt-meta-previews">
			{ /* Google Preview */ }
			<div className="mlc-wdt-meta-preview-block">
				<label className="mlc-wdt-control-label">Google Search</label>
				<div className="mlc-wdt-meta-google">
					<div className="mlc-wdt-meta-google-url">{ url }</div>
					<div className="mlc-wdt-meta-google-title">{ title }</div>
					<div className="mlc-wdt-meta-google-desc">{ description }</div>
				</div>
			</div>

			{ /* Facebook / OG Preview */ }
			<div className="mlc-wdt-meta-preview-block">
				<label className="mlc-wdt-control-label">Facebook / LinkedIn</label>
				<div className="mlc-wdt-meta-social">
					{ image && (
						<div className="mlc-wdt-meta-social-image" style={ { background: '#e0e0e0' } }>
							<span className="mlc-wdt-meta-social-image-placeholder">OG Image: { image.split( '/' ).pop() }</span>
						</div>
					) }
					<div className="mlc-wdt-meta-social-body">
						<div className="mlc-wdt-meta-social-domain">{ siteName }</div>
						<div className="mlc-wdt-meta-social-title">{ title }</div>
						<div className="mlc-wdt-meta-social-desc">{ description }</div>
					</div>
				</div>
			</div>

			{ /* Twitter Preview */ }
			<div className="mlc-wdt-meta-preview-block">
				<label className="mlc-wdt-control-label">X (Twitter)</label>
				<div className="mlc-wdt-meta-social mlc-wdt-meta-twitter">
					{ image && (
						<div className="mlc-wdt-meta-social-image" style={ { background: '#e0e0e0' } }>
							<span className="mlc-wdt-meta-social-image-placeholder">Card Image: { image.split( '/' ).pop() }</span>
						</div>
					) }
					<div className="mlc-wdt-meta-social-body">
						<div className="mlc-wdt-meta-social-title">{ title }</div>
						<div className="mlc-wdt-meta-social-desc">{ description }</div>
						<div className="mlc-wdt-meta-social-domain">{ url.replace( /^https?:\/\//, '' ).split( '/' )[ 0 ] }</div>
					</div>
				</div>
			</div>
		</div>
	);

	const controls = (
		<div className="mlc-wdt-meta-controls">
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">
					Title
					<span className="mlc-wdt-meta-char-count">{ title.length }/60</span>
				</label>
				<input
					type="text"
					className="mlc-wdt-text-input"
					value={ title }
					onChange={ ( e ) => setTitle( e.target.value ) }
				/>
			</div>
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">
					Description
					<span className="mlc-wdt-meta-char-count">{ description.length }/160</span>
				</label>
				<textarea
					className="mlc-wdt-textarea"
					rows="3"
					value={ description }
					onChange={ ( e ) => setDescription( e.target.value ) }
				/>
			</div>
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">URL</label>
				<input
					type="text"
					className="mlc-wdt-text-input"
					value={ url }
					onChange={ ( e ) => setUrl( e.target.value ) }
				/>
			</div>
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Image URL (1200x630 recommended)</label>
				<input
					type="text"
					className="mlc-wdt-text-input"
					value={ image }
					onChange={ ( e ) => setImage( e.target.value ) }
				/>
			</div>
			<div className="mlc-wdt-meta-row">
				<div className="mlc-wdt-control-group" style={ { flex: 1 } }>
					<label className="mlc-wdt-control-label">Site Name</label>
					<input
						type="text"
						className="mlc-wdt-text-input"
						value={ siteName }
						onChange={ ( e ) => setSiteName( e.target.value ) }
					/>
				</div>
				<div className="mlc-wdt-control-group" style={ { flex: 1 } }>
					<label className="mlc-wdt-control-label">Twitter Handle</label>
					<input
						type="text"
						className="mlc-wdt-text-input"
						value={ twitterHandle }
						onChange={ ( e ) => setTwitterHandle( e.target.value ) }
					/>
				</div>
			</div>
			<div className="mlc-wdt-meta-row">
				<div className="mlc-wdt-control-group" style={ { flex: 1 } }>
					<label className="mlc-wdt-control-label">Page Type</label>
					<select
						className="mlc-wdt-select"
						value={ type }
						onChange={ ( e ) => setType( e.target.value ) }
					>
						<option value="website">Website</option>
						<option value="article">Article</option>
						<option value="product">Product</option>
						<option value="profile">Profile</option>
					</select>
				</div>
				<div className="mlc-wdt-control-group" style={ { flex: 1 } }>
					<label className="mlc-wdt-control-label">Robots</label>
					<select
						className="mlc-wdt-select"
						value={ robots }
						onChange={ ( e ) => setRobots( e.target.value ) }
					>
						<option value="index, follow">Index, Follow</option>
						<option value="noindex, follow">NoIndex, Follow</option>
						<option value="index, nofollow">Index, NoFollow</option>
						<option value="noindex, nofollow">NoIndex, NoFollow</option>
					</select>
				</div>
			</div>
		</div>
	);

	const output = (
		<CodeBlock code={ metaTags } label="Meta Tags" />
	);

	return (
		<ToolCard
			title="Meta Tag Generator"
			help="Generate SEO meta tags, Open Graph (Facebook/LinkedIn), and Twitter Card tags with live previews of how your page will appear on Google, social media, and more."
			preview={ preview }
			controls={ controls }
			output={ output }
		/>
	);
}
