<?php
/**
 * Admin interface class.
 *
 * @package MLC_Web_Dev_Tools
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class MLC_Web_Dev_Tools_Admin {

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
		add_action( 'wp_ajax_mlc_wdt_toggle_pro', array( $this, 'ajax_toggle_pro' ) );
	}

	/**
	 * Add the admin menu page.
	 */
	public function add_admin_menu() {
		$this->hook_suffix = add_menu_page(
			__( 'Web Dev Tools', 'mlc-web-dev-tools' ),
			__( 'Web Dev Tools', 'mlc-web-dev-tools' ),
			'manage_options',
			'mlc-web-dev-tools',
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

		$asset_file = MLC_WDT_PLUGIN_DIR . 'build/index.asset.php';

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = require $asset_file;

		wp_enqueue_script(
			'mlc-wdt-admin',
			MLC_WDT_PLUGIN_URL . 'build/index.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		wp_enqueue_style(
			'mlc-wdt-admin',
			MLC_WDT_PLUGIN_URL . 'build/index.css',
			array(),
			$asset['version']
		);

		// Check Pro status: Freemius first, fall back to dev toggle.
		$is_pro = false;
		if ( function_exists( 'mlc_wdt_fs' ) ) {
			$is_pro = mlc_wdt_fs()->is_paying();
		}
		// Dev override: allow WP_DEBUG toggle to still work.
		if ( ! $is_pro && defined( 'WP_DEBUG' ) && WP_DEBUG ) {
			$is_pro = (bool) get_option( 'mlc_wdt_pro_active', false );
		}

		// Build upgrade URL from Freemius.
		$upgrade_url = '';
		if ( function_exists( 'mlc_wdt_fs' ) ) {
			$upgrade_url = mlc_wdt_fs()->get_upgrade_url();
		}

		wp_localize_script(
			'mlc-wdt-admin',
			'mlcWdtData',
			array(
				'pluginUrl'  => MLC_WDT_PLUGIN_URL,
				'nonce'      => wp_create_nonce( 'mlc_wdt_nonce' ),
				'version'    => MLC_WDT_VERSION,
				'isPro'      => $is_pro,
				'isDebug'    => defined( 'WP_DEBUG' ) && WP_DEBUG,
				'upgradeUrl' => $upgrade_url,
			)
		);
	}

	/**
	 * AJAX handler to toggle Pro mode (dev only, requires WP_DEBUG).
	 */
	public function ajax_toggle_pro() {
		check_ajax_referer( 'mlc_wdt_nonce', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( 'Unauthorized', 403 );
		}

		if ( ! defined( 'WP_DEBUG' ) || ! WP_DEBUG ) {
			wp_send_json_error( 'Only available in debug mode', 403 );
		}

		$current = (bool) get_option( 'mlc_wdt_pro_active', false );
		update_option( 'mlc_wdt_pro_active', ! $current );

		wp_send_json_success( array( 'isPro' => ! $current ) );
	}

	/**
	 * Render the admin page.
	 */
	public function render_admin_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		echo '<div class="wrap"><div id="mlc-wdt-app"></div></div>';
	}
}
