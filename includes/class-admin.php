<?php
/**
 * Admin interface class.
 *
 * @package Dkdt
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Dkdt_Admin {

	/**
	 * The admin page hook suffix.
	 *
	 * @var string
	 */
	private $hook_suffix;

	/**
	 * Register hooks.
	 */
	public function init() {
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Add the admin menu page.
	 */
	public function add_admin_menu() {
		$this->hook_suffix = add_menu_page(
			__( "Doohickey's Dev Tools", 'doohickeys-dev-tools' ),
			__( "Doohickey's", 'doohickeys-dev-tools' ),
			'manage_options',
			'doohickeys-dev-tools',
			array( $this, 'render_admin_page' ),
			'dashicons-editor-code',
			80
		);
	}

	/**
	 * Enqueue admin assets only on our plugin page.
	 *
	 * @param string $hook_suffix The current admin page hook suffix.
	 */
	public function enqueue_assets( $hook_suffix ) {
		if ( $this->hook_suffix !== $hook_suffix ) {
			return;
		}

		$asset_file = DKDT_PLUGIN_DIR . 'build/index.asset.php';

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = require $asset_file;

		wp_enqueue_script(
			'dkdt-admin',
			DKDT_PLUGIN_URL . 'build/index.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		wp_enqueue_style(
			'dkdt-admin',
			DKDT_PLUGIN_URL . 'build/index.css',
			array(),
			$asset['version']
		);

		// Build upgrade URL from Freemius.
		$upgrade_url = '';
		if ( function_exists( 'dkdt_fs' ) ) {
			$upgrade_url = dkdt_fs()->get_upgrade_url();
		}

		wp_localize_script(
			'dkdt-admin',
			'dkdtData',
			array(
				'pluginUrl'  => DKDT_PLUGIN_URL,
				'nonce'      => wp_create_nonce( 'dkdt_nonce' ),
				'version'    => DKDT_VERSION,
				'upgradeUrl' => $upgrade_url,
			)
		);
	}

	/**
	 * Render the admin page.
	 */
	public function render_admin_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		echo '<div class="wrap"><div id="dkdt-app"></div></div>';
	}
}
