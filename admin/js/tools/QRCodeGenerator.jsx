import { useState, useRef, useCallback } from '@wordpress/element';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import ToolCard from '../components/ToolCard';

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
		<div className="mlc-wdt-qr-preview">
			<div ref={ svgRef } className="mlc-wdt-qr-display">
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

	const controls = (
		<div className="mlc-wdt-qr-controls">
			{ /* Content */ }
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Content</label>
				<input
					type="text"
					value={ content }
					onChange={ ( e ) => setContent( e.target.value ) }
					className="mlc-wdt-text-input"
					placeholder="Enter URL, text, or any data..."
				/>
			</div>

			{ /* Size */ }
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">
					Size: { size }px
				</label>
				<input
					type="range"
					min="128"
					max="512"
					step="8"
					value={ size }
					onChange={ ( e ) => setSize( Number( e.target.value ) ) }
					className="mlc-wdt-range"
				/>
			</div>

			{ /* Colors */ }
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Colors</label>
				<div className="mlc-wdt-color-row">
					<div className="mlc-wdt-color-field">
						<label className="mlc-wdt-range-label">Foreground</label>
						<div className="mlc-wdt-color-input-pair">
							<input
								type="color"
								value={ fgColor }
								onChange={ ( e ) => setFgColor( e.target.value ) }
								className="mlc-wdt-color-picker"
							/>
							<input
								type="text"
								value={ fgColor }
								onChange={ ( e ) => setFgColor( e.target.value ) }
								className="mlc-wdt-hex-input"
								maxLength={ 7 }
							/>
						</div>
					</div>
					<div className="mlc-wdt-color-field">
						<label className="mlc-wdt-range-label">Background</label>
						<div className="mlc-wdt-color-input-pair">
							<input
								type="color"
								value={ bgColor }
								onChange={ ( e ) => setBgColor( e.target.value ) }
								className="mlc-wdt-color-picker"
							/>
							<input
								type="text"
								value={ bgColor }
								onChange={ ( e ) => setBgColor( e.target.value ) }
								className="mlc-wdt-hex-input"
								maxLength={ 7 }
							/>
						</div>
					</div>
				</div>
			</div>

			{ /* Error Correction */ }
			<div className="mlc-wdt-control-group">
				<label className="mlc-wdt-control-label">Error Correction</label>
				<select
					value={ errorLevel }
					onChange={ ( e ) => setErrorLevel( e.target.value ) }
					className="mlc-wdt-select"
				>
					{ ERROR_LEVELS.map( ( level ) => (
						<option key={ level.value } value={ level.value }>
							{ level.label }
						</option>
					) ) }
				</select>
			</div>
		</div>
	);

	const output = (
		<div className="mlc-wdt-qr-download-row">
			<button className="mlc-wdt-download-btn" onClick={ downloadPNG }>
				Download PNG
			</button>
			<button className="mlc-wdt-download-btn mlc-wdt-download-btn-outline" onClick={ downloadSVG }>
				Download SVG
			</button>
		</div>
	);

	return (
		<ToolCard
			title="QR Code Generator"
			help="Generate QR codes for URLs, text, or any data. Customize colors, size, and error correction level. Download as PNG or SVG."
			preview={ preview }
			controls={ controls }
			output={ output }
		/>
	);
}
