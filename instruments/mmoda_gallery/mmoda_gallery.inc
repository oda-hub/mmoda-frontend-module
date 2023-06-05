<?php

/**
 * @file
 * Provides a block displaying prayer times for the visitor's location
 */

/**
 */
function mmoda_gallery($form, &$form_state)
{
  $form = array();

  $form['#tree'] = FALSE;
  // turn off form caching
  $mform_id = __FUNCTION__ . '_';

  $form['#method'] = 'POST';
  $form['#attributes'] = array(
    'class' => 'gallery-form'
  );

  $form['instrument'] = array(
    '#type' => 'hidden',
    '#value' => 'gallery'
  );

  $mmoda_settings = variable_get('mmoda_settings');
  $instrument_defaults = $mmoda_settings['instruments']['gallery'];

  $form['#action'] = $instrument_defaults['data_server_local_url'];
  $form['#attributes'] = array(
    'class' => array(
      'mmoda-iframe-result'
    )
  );
  $form['product_type'] = array(
    '#type' => 'select',
    '#title' => t("Product Type"),
    '#description' => t("Select product type"),
    '#attributes' => array(
      'name' => $mform_id . 'product_type'
    ),
    '#default_value' => $instrument_defaults['product_type'],
    '#options' => array(
      'gallery_all' => 'All',
      'gallery_images' => 'Images',
      'gallery_spectra' => 'Spectra',
      'gallery_lcs' => 'Light curves'
    ),
    '#parent_classes' => array(
      'form-group',
      'col-md-6'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#prefix' => '<div class="row">',
    '#suffix' => '</div>'
  );

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit'),
    '#prefix' => '<hr class="hr-default" />'
  );

  form_load_include($form_state, 'inc', 'mmoda', 'mmoda.gallery');

  return ($form);
}
