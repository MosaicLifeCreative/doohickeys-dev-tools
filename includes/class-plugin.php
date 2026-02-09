<?php
/**
 * Main plugin class.
 *
 * @package MLC_Web_Dev_Tools
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class MLC_Web_Dev_Tools_Plugin {

	/**
	 * Admin instance.
	 *
	 * @var MLC_Web_Dev_Tools_Admin
	 */
	private $admin;

	/**
	 * Initialize the plugin.
	 */
	public function run() {
		$this->load_dependencies();

		if ( is_admin() ) {
			$this->admin = new MLC_Web_Dev_Tools_Admin();
			$this->admin->init();
		}
	}

	/**
	 * Load required files.
	 */
	private function load_dependencies() {
		require_once MLC_WDT_PLUGIN_DIR . 'includes/class-admin.php';
	}
}
