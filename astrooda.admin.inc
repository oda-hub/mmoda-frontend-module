<?php

/**
 * @file
 * Provides a block displaying prayer times for the visitor's location
 */

/**
 * Implements hook_block_configure().
 */
// function astrooda_block_configure($delta = '') {
function astrooda_admin_settings($form, &$form_state, $no_js_use = FALSE) {
  $form = array ();

  $form ['#validate'] [] = 'onyly_one_page_bottom_per_month';
  $form ['#submit'] [] = 'astrooda_monthlypdf_submit';

  if ($no_js_use) {
    // Remove the #ajax from the above, so ajax.js won't be loaded.
    if (! empty ( $form ['astrooda_monthlypdf'] ['remove_name'] ['#ajax'] )) {
      unset ( $form ['astrooda_monthlypdf'] ['remove_name'] ['#ajax'] );
    }
    unset ( $form ['astrooda_monthlypdf'] ['add_month'] ['#ajax'] );
  }

  return system_settings_form ( $form );
}

