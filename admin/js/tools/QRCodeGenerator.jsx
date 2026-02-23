import { useState, useRef, useCallback } from '@wordpress/element';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import ToolCard from '../components/ToolCard';
import ColorPicker from '../components/ColorPicker';

const ERROR_LEVELS = [
	{ value: 'L', label: 'Low (7%)' },
	{ value: 'M', label: 'Medium (15%)' },
	{ value: 'Q', label: 'Quartile (25%)' },
	{ value: 'H', label: 'High (30%)' },
];

export default function QRCodeGenerator() {
	const [ content, setContent ] = useState( 'https://example.com' );
	const [ size, setSize ] = useState( 256 );
	const [ fgColor, setFgColor ] = useState( '#000000' );
	const [ bgColor, setBgColor ] = useState( '#ffffff' );
	const [ errorLevel, setErrorLevel ] = useState( 'M' );
	const canvasRef = useRef( null );
	const svgRef = useRef( null );

	const downloadPNG = useCallback( () => {
		const canvas = canvasRef.current?.querySelector( 'canvas' );
		if ( ! canvas ) {
			return;
		}
		const url = canvas.toDataURL( 'image/png' );
		const link = document.createElement( 'a' );
		link.download = 'qrcode.png';
		link.href = url;
		link.click();
	}, [] );

	const downloadSVG = useCallback( () => {
		const svg = svgRef.current?.querySelector( 'svg' );
		if ( ! svg ) {
			return;
		}
		const svgData = new XMLSerializer().serializeToString( svg );
		const blob = new Blob( [ svgData ], { type: 'image/svg+xml;charset=utf-8' } );
		const url = URL.createObjectURL( blob );
		const link = document.createElement( 'a' );
		link.download = 'qrcode.svg';
		link.href = url;
		link.click();
		URL.revokeObjectURL( url );
	}, [] );

	const preview = (
		<div className="dkdt-qr-preview">
			<div ref={ svgRef } className="dkdt-qr-display">
				<QRCodeSVG
					value={ content || ' ' }
					size={ Math.min( size, 400 ) }
					fgColor={ fgColor }
					bgColor={ bgColor }
					level={ errorLevel }
				/>
			</div>
			{ /* Hidden canvas for PNG download */ }
			<div ref={ canvasRef } style={ { display: 'none' } }>
				<QRCodeCanvas
					value={ content || ' ' }
					size={ size }
					fgColor={ fgColor }
					bgColor={ bgColor }
					level={ errorLevel }
				/>
			</div>
		</div>
	);

	const upgradeUrl = window.dkdtData?.upgradeUrl;

	const controls = (
		<div className="dkdt-qr-controls">
			{ /* Content */ }
			<div className="dkdt-control-group">
				<label className="dkdt-control-label">Content</label>
				<input
					type="text"
					value={ content }
					onChange={ ( e ) => setContent( e.target.value ) }
					className="dkdt-text-input"
					placeholder="Enter URL, text, or any data..."
				/>
			</div>

			{ /* Size */ }
			<div className="dkdt-control-group">
				<label className="dkdt-control-label">
					Size: { size }px
				</label>
				<input
					type="range"
					min="128"
					max="512"
					step="8"
					value={ size }
					onChange={ ( e ) => setSize( Number( e.target.value ) ) }
					className="dkdt-range"
				/>
			</div>

			{ /* Colors */ }
			<div className="dkdt-control-group">
				<label className="dkdt-control-label">Colors</label>
				<div className="dkdt-color-row">
					<ColorPicker color={ fgColor } onChange={ setFgColor } label="Foreground" />
					<ColorPicker color={ bgColor } onChange={ setBgColor } label="Background" />
				</div>
			</div>

			{ /* Error Correction */ }
			<div className="dkdt-control-group">
				<label className="dkdt-control-label">Error Correction</label>
				<select
					value={ errorLevel }
					onChange={ ( e ) => setErrorLevel( e.target.value ) }
					className="dkdt-select"
				>
					{ ERROR_LEVELS.map( ( level ) => (
						<option key={ level.value } value={ level.value }>
							{ level.label }
						</option>
					) ) }
				</select>
			</div>

			<div className="dkdt-pro-inline-note">
				<span className="dkdt-pro-badge-inline">Pro</span>
				Add a custom center logo to your QR codes in Pro.
				{ upgradeUrl && <a href={ upgradeUrl } className="dkdt-pro-inline-link">Upgrade</a> }
			</div>
		</div>
	);

	const output = (
		<div className="dkdt-qr-download-row">
			<button className="dkdt-download-btn" onClick={ downloadPNG }>
				Download PNG
			</button>
			<button className="dkdt-download-btn dkdt-download-btn-outline" onClick={ downloadSVG }>
				Download SVG
			</button>
		</div>
	);

	return (
		<ToolCard
			title="QR Code Generator"
			help="Generate QR codes for URLs, text, or any data. Customize colors, size, and error correction level. Download as PNG or SVG. Center logo available in Pro."
			preview={ preview }
			controls={ controls }
			output={ output }
		/>
	);
}
