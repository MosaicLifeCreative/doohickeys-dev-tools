<?php
/**
 * Plugin Name: Doohickey's Dev Tools
 * Description: Essential utilities for web developers—right in your WordPress dashboard.
 * Version: 1.0.2
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * Author: Mosaic Life Creative
 * Author URI: https://mosaiclifecreative.com
 * License: GPL-3.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: doohickeys-dev-tools
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants
define('DKDT_VERSION', '1.0.2');
define('DKDT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('DKDT_PLUGIN_URL', plugin_dir_url(__FILE__));

// Freemius SDK integration
if ( function_exists( 'dkdt_fs' ) ) {
	dkdt_fs()->set_basename( true, __FILE__ );
} else {
	$freemius_sdk = dirname( __FILE__ ) . '/vendor/freemius/start.php';

	if ( file_exists( $freemius_sdk ) ) {
		function dkdt_fs() {
			global $dkdt_fs;

			if ( ! isset( $dkdt_fs ) ) {
				require_once dirname( __FILE__ ) . '/vendor/freemius/start.php';

				$dkdt_fs = fs_dynamic_init( array(
					'id'                  => '24360',
					'slug'                => 'web-dev-tools',
					'premium_slug'        => 'doohickeys-dev-tools-premium',
					'type'                => 'plugin',
					'public_key'          => 'pk_f812a361b02bf6fe21443b390efb8',
					'is_premium'          => false,
					'is_org_compliant'    => true,
					'premium_suffix'      => 'Pro',
					'has_premium_version' => true,
					'has_addons'          => false,
					'has_paid_plans'      => true,
					'menu'                => array(
						'slug'       => 'doohickeys-dev-tools',
						'first-path' => 'admin.php?page=doohickeys-dev-tools',
						'support'    => false,
					),
				) );
			}

			return $dkdt_fs;
		}

		dkdt_fs();
		do_action( 'dkdt_fs_loaded' );
	}
}

// Load main plugin class
require_once DKDT_PLUGIN_DIR . 'includes/class-plugin.php';

// Initialize plugin
function dkdt_init() {
	$plugin = new Dkdt_Plugin();
	$plugin->run();
}
add_action( 'plugins_loaded', 'dkdt_init' );