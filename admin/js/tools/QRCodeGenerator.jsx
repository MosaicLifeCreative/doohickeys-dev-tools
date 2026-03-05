import { useState, useRef, useCallback } from '@wordpress/element';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import ToolCard from '../components/ToolCard';
import ColorPicker from '../components/ColorPicker';
import ProBadge from '../components/ProBadge';
import { usePro } from '../context/ProContext';

const ERROR_LEVELS = [
	{ value: 'L', label: 'Low (7%)' },
	{ value: 'M', label: 'Medium (15%)' },
	{ value: 'Q', label: 'Quartile (25%)' },
	{ value: 'H', label: 'High (30%)' },
];

export default function QRCodeGenerator() {
	const { isPro } = usePro();
	const [ content, setContent ] = useState( 'https://example.com' );
	const [ size, setSize ] = useState( 256 );
	const [ fgColor, setFgColor ] = useState( '#000000' );
	const [ bgColor, setBgColor ] = useState( '#ffffff' );
	const [ errorLevel, setErrorLevel ] = useState( 'M' );
	const [ logoSrc, setLogoSrc ] = useState( null );
	const [ logoSize, setLogoSize ] = useState( 20 );
	const canvasRef = useRef( null );
	const svgRef = useRef( null );
	const fileInputRef = useRef( null );

	const handleLogoUpload = useCallback( ( e ) => {
		const file = e.target.files?.[ 0 ];
		if ( ! file ) {
			return;
		}
		const reader = new FileReader();
		reader.onload = ( ev ) => {
			setLogoSrc( ev.target.result );
		};
		reader.readAsDataURL( file );
	}, [] );

	const removeLogo = useCallback( () => {
		setLogoSrc( null );
		if ( fileInputRef.current ) {
			fileInputRef.current.value = '';
		}
	}, [] );

	const logoPixelSize = Math.round( size * ( logoSize / 100 ) );

	const imageSettings = logoSrc && isPro
		? {
				src: logoSrc,
				height: logoPixelSize,
				width: logoPixelSize,
				excavate: true,
			}
		: undefined;

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
					imageSettings={ imageSettings }
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
					imageSettings={ imageSettings }
				/>
			</div>
		</div>
	);

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

			{ /* Logo (Pro) */ }
			<div className="dkdt-control-group">
				<ProBadge feature="Add a logo to your QR code">
					<label className="dkdt-control-label">Center Logo</label>
					<div className="dkdt-logo-upload">
						{ logoSrc ? (
							<div className="dkdt-logo-preview-row">
								<img
									src={ logoSrc }
									alt="Logo preview"
									className="dkdt-logo-thumb"
								/>
								<div className="dkdt-logo-info">
									<button
										className="dkdt-remove-btn"
										onClick={ removeLogo }
										title="Remove logo"
									>
										&times;
									</button>
								</div>
							</div>
						) : (
							<button
								className="dkdt-add-btn"
								onClick={ () => fileInputRef.current?.click() }
							>
								+ Upload Logo
							</button>
						) }
						<input
							ref={ fileInputRef }
							type="file"
							accept="image/*"
							onChange={ handleLogoUpload }
							style={ { display: 'none' } }
						/>
					</div>
					{ logoSrc && (
						<div className="dkdt-logo-size-control">
							<label className="dkdt-range-label">
								Logo Size: { logoSize }%
							</label>
							<input
								type="range"
								min="10"
								max="35"
								value={ logoSize }
								onChange={ ( e ) => setLogoSize( Number( e.target.value ) ) }
								className="dkdt-range"
							/>
						</div>
					) }
				</ProBadge>
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
			help="Generate QR codes for URLs, text, or any data. Customize colors, size, and error correction level. Download as PNG or SVG. Pro users can add a center logo."
			preview={ preview }
			controls={ controls }
			output={ output }
		/>
	);
}
