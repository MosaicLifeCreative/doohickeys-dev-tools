import { useState, useMemo } from '@wordpress/element';
import ToolCard from '../components/ToolCard';
import CopyButton from '../components/CopyButton';

function markdownToHtml( md ) {
	if ( ! md.trim() ) return '';

	let html = md;

	// Code blocks (fenced).
	html = html.replace( /```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>' );

	// Inline code.
	html = html.replace( /`([^`]+)`/g, '<code>$1</code>' );

	// Headings.
	html = html.replace( /^######\s+(.+)$/gm, '<h6>$1</h6>' );
	html = html.replace( /^#####\s+(.+)$/gm, '<h5>$1</h5>' );
	html = html.replace( /^####\s+(.+)$/gm, '<h4>$1</h4>' );
	html = html.replace( /^###\s+(.+)$/gm, '<h3>$1</h3>' );
	html = html.replace( /^##\s+(.+)$/gm, '<h2>$1</h2>' );
	html = html.replace( /^#\s+(.+)$/gm, '<h1>$1</h1>' );

	// Horizontal rule.
	html = html.replace( /^---+$/gm, '<hr>' );
	html = html.replace( /^\*\*\*+$/gm, '<hr>' );

	// Bold and italic.
	html = html.replace( /\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>' );
	html = html.replace( /\*\*(.+?)\*\*/g, '<strong>$1</strong>' );
	html = html.replace( /\*(.+?)\*/g, '<em>$1</em>' );
	html = html.replace( /~~(.+?)~~/g, '<del>$1</del>' );

	// Images (before links).
	html = html.replace( /!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">' );

	// Links.
	html = html.replace( /\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>' );

	// Blockquotes.
	html = html.replace( /^>\s+(.+)$/gm, '<blockquote>$1</blockquote>' );
	// Merge adjacent blockquotes.
	html = html.replace( /<\/blockquote>\n<blockquote>/g, '\n' );

	// Unordered lists.
	html = html.replace( /^[-*]\s+(.+)$/gm, '<li>$1</li>' );
	html = html.replace( /(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>' );

	// Tables.
	html = html.replace( /^(\|.+\|)\n(\|[-: |]+\|)\n((?:\|.+\|\n?)+)/gm, ( _, header, _sep, body ) => {
		const headerCells = header.split( '|' ).filter( ( c ) => c.trim() );
		const rows = body.trim().split( '\n' );
		let table = '<table><thead><tr>';
		headerCells.forEach( ( cell ) => {
			table += `<th>${ cell.trim() }</th>`;
		} );
		table += '</tr></thead><tbody>';
		rows.forEach( ( row ) => {
			const cells = row.split( '|' ).filter( ( c ) => c.trim() );
			table += '<tr>';
			cells.forEach( ( cell ) => {
				table += `<td>${ cell.trim() }</td>`;
			} );
			table += '</tr>';
		} );
		table += '</tbody></table>';
		return table;
	} );

	// Paragraphs - wrap remaining text lines.
	const lines = html.split( '\n' );
	const result = [];
	let inBlock = false;

	for ( const line of lines ) {
		const trimmed = line.trim();
		if ( trimmed.match( /^<(h[1-6]|pre|ul|ol|table|blockquote|hr|div)/ ) ) {
			inBlock = true;
			result.push( trimmed );
		} else if ( trimmed.match( /^<\/(pre|ul|ol|table|blockquote|div)>/ ) ) {
			inBlock = false;
			result.push( trimmed );
		} else if ( inBlock ) {
			result.push( trimmed );
		} else if ( trimmed === '' ) {
			result.push( '' );
		} else if ( ! trimmed.match( /^</ ) ) {
			result.push( `<p>${ trimmed }</p>` );
		} else {
			result.push( trimmed );
		}
	}

	return result.join( '\n' ).replace( /\n{3,}/g, '\n\n' ).trim();
}

const SAMPLE = `# Heading 1
## Heading 2

This is a paragraph with **bold**, *italic*, and \`inline code\`.

- List item one
- List item two
- List item three

> This is a blockquote

\`\`\`
const hello = "world";
\`\`\`

[Link text](https://example.com)

---

| Name | Value |
| --- | --- |
| Alpha | 100 |
| Beta | 200 |`;

export default function MarkdownPreview() {
	const [ input, setInput ] = useState( SAMPLE );
	const html = useMemo( () => markdownToHtml( input ), [ input ] );

	const preview = (
		<div className="mlc-wdt-md-preview">
			<div
				className="mlc-wdt-md-rendered"
				dangerouslySetInnerHTML={ { __html: html } }
			/>
		</div>
	);

	const controls = (
		<div className="mlc-wdt-md-controls">
			<div className="mlc-wdt-control-group">
				<div style={ { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' } }>
					<label className="mlc-wdt-control-label" style={ { margin: 0 } }>Markdown</label>
					<CopyButton text={ input } />
				</div>
				<textarea
					className="mlc-wdt-textarea mlc-wdt-textarea-mono"
					rows="14"
					value={ input }
					onChange={ ( e ) => setInput( e.target.value ) }
					placeholder="Type Markdown here..."
				/>
			</div>
		</div>
	);

	const output = (
		<div>
			<div style={ { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' } }>
				<span className="mlc-wdt-section-label" style={ { margin: 0 } }>HTML Output</span>
				<CopyButton text={ html } />
			</div>
			<pre className="mlc-wdt-code-pre"><code>{ html }</code></pre>
		</div>
	);

	return (
		<ToolCard
			title="Markdown Preview"
			help="Write Markdown and see a live rendered preview. Also outputs the generated HTML for copying."
			preview={ preview }
			controls={ controls }
			output={ output }
		/>
	);
}
