<?php
/**
 * Plugin Name: Web Dev Tools by MLC
 * Plugin URI: https://mosaiclifecreative.com/web-dev-tools
 * Description: Essential utilities for web developers—right in your WordPress dashboard.
 * Version: 1.0.0
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
define('MLC_WDT_VERSION', '1.0.0');
define('MLC_WDT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('MLC_WDT_PLUGIN_URL', plugin_dir_url(__FILE__));

// TODO: Load includes and initialize plugin