<?php
/**
 * Plugin Name: Web Dev Tools by Mosaic Life Creative
 * Plugin URI: https://mosaiclifecreative.com/web-dev-tools
 * Description: Essential utilities for web developers—right in your WordPress dashboard.
 * Version: 1.0.1
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * Author: Mosaic Life Creative
 * Author URI: https://mosaiclifecreative.com
 * License: GPL-3.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: mlc-web-dev-tools
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants
define('MLC_WDT_VERSION', '1.0.1');
define('MLC_WDT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('MLC_WDT_PLUGIN_URL', plugin_dir_url(__FILE__));

// Freemius SDK integration
if ( function_exists( 'mlc_wdt_fs' ) ) {
	mlc_wdt_fs()->set_basename( true, __FILE__ );
} else {
	$freemius_sdk = dirname( __FILE__ ) . '/vendor/freemius/start.php';

	if ( file_exists( $freemius_sdk ) ) {
		function mlc_wdt_fs() {
			global $mlc_wdt_fs;

			if ( ! isset( $mlc_wdt_fs ) ) {
				require_once dirname( __FILE__ ) . '/vendor/freemius/start.php';

				$mlc_wdt_fs = fs_dynamic_init( array(
					'id'                  => '24360',
					'slug'                => 'web-dev-tools',
					'type'                => 'plugin',
					'public_key'          => 'pk_f812a361b02bf6fe21443b390efb8',
					'is_premium'          => true,
					'premium_suffix'      => 'Pro',
					'has_premium_version' => true,
					'has_addons'          => false,
					'has_paid_plans'      => true,
					'wp_org_gatekeeper'   => 'OA7#BoRiBNqdf52FvzEf!!074aRLPs8fspif$7K1#4u4Csys1fQlCecVcUTOs2mcpeVHi#C2j9d09fOTvbC0HloPT7fFee5WdS3G',
					'menu'                => array(
						'slug'       => 'mlc-web-dev-tools',
						'first-path' => 'admin.php?page=mlc-web-dev-tools',
						'support'    => false,
					),
				) );
			}

			return $mlc_wdt_fs;
		}

		mlc_wdt_fs();
		do_action( 'mlc_wdt_fs_loaded' );
	}
}

// Load main plugin class
require_once MLC_WDT_PLUGIN_DIR . 'includes/class-plugin.php';

// Initialize plugin
function mlc_wdt_init() {
	$plugin = new MLC_Web_Dev_Tools_Plugin();
	$plugin->run();
}
add_action( 'plugins_loaded', 'mlc_wdt_init' );