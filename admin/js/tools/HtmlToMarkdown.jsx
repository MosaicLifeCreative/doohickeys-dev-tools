import { useState, useMemo } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CopyButton from '../components/CopyButton';

function htmlToMarkdown( html ) {
	if ( ! html.trim() ) return '';

	let md = html;

	// Headings.
	for ( let i = 6; i >= 1; i-- ) {
		const regex = new RegExp( `<h${ i }[^>]*>(.*?)<\\/h${ i }>`, 'gi' );
		md = md.replace( regex, ( _, content ) => '\n' + '#'.repeat( i ) + ' ' + content.trim() + '\n' );
	}

	// Bold / italic.
	md = md.replace( /<(strong|b)>(.*?)<\/\1>/gi, '**$2**' );
	md = md.replace( /<(em|i)>(.*?)<\/\1>/gi, '*$2*' );
	md = md.replace( /<(del|s|strike)>(.*?)<\/\1>/gi, '~~$2~~' );

	// Code.
	md = md.replace( /<code>(.*?)<\/code>/gi, '`$1`' );
	md = md.replace( /<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '\n```\n$1\n```\n' );
	md = md.replace( /<pre[^>]*>([\s\S]*?)<\/pre>/gi, '\n```\n$1\n```\n' );

	// Links and images.
	md = md.replace( /<a[^>]+href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)' );
	md = md.replace( /<img[^>]+src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)' );
	md = md.replace( /<img[^>]+src="([^"]*)"[^>]*\/?>/gi, '![]($1)' );

	// Lists.
	md = md.replace( /<li[^>]*>(.*?)<\/li>/gi, '- $1\n' );
	md = md.replace( /<\/?[ou]l[^>]*>/gi, '\n' );

	// Blockquote.
	md = md.replace( /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, ( _, content ) => {
		return content.trim().split( '\n' ).map( ( line ) => '> ' + line.trim() ).join( '\n' ) + '\n';
	} );

	// Horizontal rule.
	md = md.replace( /<hr\s*\/?>/gi, '\n---\n' );

	// Line break.
	md = md.replace( /<br\s*\/?>/gi, '\n' );

	// Paragraphs.
	md = md.replace( /<p[^>]*>(.*?)<\/p>/gi, '$1\n\n' );

	// Table.
	md = md.replace( /<table[^>]*>([\s\S]*?)<\/table>/gi, ( _, tableContent ) => {
		const rows = [];
		const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
		let rowMatch;
		while ( ( rowMatch = rowRegex.exec( tableContent ) ) !== null ) {
			const cells = [];
			const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
			let cellMatch;
			while ( ( cellMatch = cellRegex.exec( rowMatch[ 1 ] ) ) !== null ) {
				cells.push( cellMatch[ 1 ].trim() );
			}
			rows.push( cells );
		}
		if ( rows.length === 0 ) return '';
		let table = '| ' + rows[ 0 ].join( ' | ' ) + ' |\n';
		table += '| ' + rows[ 0 ].map( () => '---' ).join( ' | ' ) + ' |\n';
		for ( let i = 1; i < rows.length; i++ ) {
			table += '| ' + rows[ i ].join( ' | ' ) + ' |\n';
		}
		return '\n' + table;
	} );

	// Strip remaining tags.
	md = md.replace( /<[^>]+>/g, '' );

	// Decode entities.
	md = md.replace( /&amp;/g, '&' );
	md = md.replace( /&lt;/g, '<' );
	md = md.replace( /&gt;/g, '>' );
	md = md.replace( /&quot;/g, '"' );
	md = md.replace( /&#39;/g, "'" );
	md = md.replace( /&nbsp;/g, ' ' );

	// Clean up extra blank lines.
	md = md.replace( /\n{3,}/g, '\n\n' );

	return md.trim();
}

export default function HtmlToMarkdown() {
	const [ input, setInput ] = useState( '' );
	const result = useMemo( () => htmlToMarkdown( input ), [ input ] );

	const preview = result ? (
		<div className="dkdt-htm-preview">
			<div style={ { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' } }>
				<span className="dkdt-section-label" style={ { margin: 0 } }>Markdown Output</span>
				<CopyButton text={ result } />
			</div>
			<pre className="dkdt-code-pre"><code>{ result }</code></pre>
		</div>
	) : null;

	const controls = (
		<div className="dkdt-htm-controls">
			<div className="dkdt-control-group">
				<label className="dkdt-control-label">HTML Input</label>
				<textarea
					className="dkdt-textarea"
					rows="10"
					value={ input }
					onChange={ ( e ) => setInput( e.target.value ) }
					placeholder="Paste HTML here..."
				/>
			</div>
		</div>
	);

	return (
		<ToolCard
			title="HTML to Markdown"
			help="Convert HTML to Markdown. Supports headings, bold, italic, links, images, lists, tables, code blocks, blockquotes, and more."
			preview={ preview }
			controls={ controls }
		/>
	);
}
