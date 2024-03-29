<?php

/**
 * @file
 * Provides a block displaying prayer times for the visitor's location
 */

/**
 */
function mmoda_antares($form, &$form_state)
{
  $form = array();

  $form['#tree'] = FALSE;
  // turn off form caching
  $mform_id = __FUNCTION__ . '_';

  $form['#method'] = 'POST';
  $form['#attributes'] = array(
    'class' => 'antares-form'
  );

  $form['instrument'] = array(
    '#type' => 'hidden',
    '#value' => 'antares'
  );

  $mmoda_settings = variable_get('mmoda_settings');
  $instrument_defaults = $mmoda_settings['instruments']['antares'];

  $form['#action'] = $instrument_defaults['data_server_local_url'];

  /*
   * $form ['E1_keV'] = array (
   * '#type' => 'textfield',
   * '#title' => t ( "Energy Min" ),
   * '#description' => t ( "The minimum of the energy band." ),
   * '#default_value' => $instrument_defaults['E1_keV'],
   * '#required' => TRUE,
   * '#size' => 10,
   * '#parent_classes' => array (
   * 'form-group',
   * 'col-md-6'
   * ),
   * '#label_classes' => array (
   * 'control-label'
   * ),
   * '#attributes' => array (
   * 'class' => array (
   * 'form-control'
   * ),
   * 'data-bv-numeric' => 'true'
   * ),
   * '#prefix' => '<div class="row">'
   * );
   *
   * $form ['E2_keV'] = array (
   * '#type' => 'textfield',
   * '#title' => t ( "Energy Max" ),
   * '#description' => t ( "The maximum of the energy band." ),
   * '#default_value' => $instrument_defaults['E2_keV'],
   * '#required' => TRUE,
   * '#size' => 10,
   * '#parent_classes' => array (
   * 'form-group',
   * 'col-md-5'
   * ),
   * '#label_classes' => array (
   * 'control-label'
   * ),
   * '#attributes' => array (
   * 'class' => array (
   * 'form-control'
   * ),
   * 'data-bv-numeric' => 'true'
   * ),
   * '#suffix' => '</div><hr class="hr-default" />'
   * );
   */
  $form['query_type'] = array(
    '#type' => 'select',
    '#title' => t("Query Type"),
    '#description' => t("Select query type"),
    '#default_value' => $instrument_defaults['query_type'],
    '#options' => array(
      'Real' => 'Real',
      'Dummy' => 'Dummy'
    ),
    '#parent_classes' => array(
      'form-group',
      'col-md-6'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#attributes' => array(
      'class' => array(
        'form-control'
      )
    ),
    '#prefix' => '<div class="row">',
    '#suffix' => '</div><hr class="hr-default" />'
  );

  $form['radius'] = array(
    '#type' => 'textfield',
    '#title' => t("Radius"),
    '#default_value' => $instrument_defaults['radius'],
    '#parent_classes' => array(
      'form-group',
      'col-md-6'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#attributes' => array(
      'name' => $mform_id . 'radius',
      'class' => array(
        'form-control'
      ),
      'data-bv-numeric' => 'true',
      'data-bv-between' => 'true',
      'data-bv-between-inclusive' => 'true',
      'data-bv-between-max' => 2.5,
      'data-bv-between-min' => 0.1,
      'data-bv-between-message' => 'Please enter value between 0.1 and 2.5',
      'data-bv-notempty' => 'true'
    ),
    '#prefix' => '<div class="row">',
    '#field_suffix' => t('deg'),
    '#suffix' => '</div><hr class="hr-default" />'
  );

  $form['product_type'] = array(
    '#type' => 'radios',
    '#title' => t("Product Type"),
    '#description' => t("Select product type"),
    '#attributes' => array(
      'name' => $mform_id . 'product_type'
    ),
    '#default_value' => $instrument_defaults['product_type'],
    '#options' => array(
      // 'antares_image' => 'Image',
      'antares_spectrum' => 'Spectrum'
      // 'antares_lc' => 'Light curve',
      // 'antares_table' => 'Table'
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
  /*
   * $form ['time_bin'] = array (
   * '#type' => 'textfield',
   * '#title' => t ( "Time bin" ),
   * //'#description' => t ( "Minimum value is 20 seconds." ),
   * '#default_value' => $instrument_defaults['time_bin'],
   * '#states' => array (
   * 'visible' => array (
   * ':input[name="'.$mform_id.'product_type"]' => array (
   * 'value' => 'antares_lc'
   * )
   * ),
   * 'enabled' => array (
   * ':input[name="'.$mform_id.'product_type"]' => array (
   * array (
   * 'value' => 'antares_lc'
   * )
   * )
   * )
   * ),
   * '#parent_classes' => array (
   * 'form-group',
   * 'col-md-6'
   * ),
   * '#label_classes' => array (
   * 'control-label'
   * ),
   * '#attributes' => array (
   * 'class' => array (
   * 'form-control'
   * ),
   * 'data-bv-numeric' => 'true',
   * ),
   * '#prefix' => '<div class="row">'
   * );
   *
   * $form ['time_bin_format'] = array (
   * '#type' => 'select',
   * '#title' => t ( "Unit" ),
   * '#options' => array (
   * 'sec' => 'Seconds',
   * 'jd' => 'Days'
   * ),
   * '#default_value' => $instrument_defaults['time_bin_format'],
   * '#states' => array (
   * 'visible' => array (
   * ':input[name="'.$mform_id.'product_type"]' => array (
   * 'value' => 'antares_lc'
   * )
   * ),
   * 'enabled' => array (
   * ':input[name="'.$mform_id.'product_type"]' => array (
   * array (
   * 'value' => 'antares_lc'
   * )
   * )
   * )
   * ),
   * '#parent_classes' => array (
   * 'form-group',
   * 'col-md-4'
   * ),
   * '#label_classes' => array (
   * 'control-label'
   * ),
   * '#attributes' => array (
   * 'class' => array (
   * 'form-control time_bin_format'
   * )
   * ),
   * '#suffix' => '</div><hr class="hr-default" />'
   * );
   */

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit')
  );

  form_load_include($form_state, 'inc', 'mmoda', 'mmoda.antares');

  return ($form);
}
