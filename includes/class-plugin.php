<?php
/**
 * Main plugin class.
 *
 * @package Dkdt
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Dkdt_Plugin {

	/**
	 * Admin instance.
	 *
	 * @var Dkdt_Admin
	 */
	private $admin;

	/**
	 * Initialize the plugin.
	 */
	public function run() {
		$this->load_dependencies();

		if ( is_admin() ) {
			$this->admin = new Dkdt_Admin();
			$this->admin->init();
		}
	}

	/**
	 * Load required files.
	 */
	private function load_dependencies() {
		require_once DKDT_PLUGIN_DIR . 'includes/class-admin.php';
	}
}
