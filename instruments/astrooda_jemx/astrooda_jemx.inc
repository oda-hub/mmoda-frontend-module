<?php

/**
 * @file
 * Provides a block displaying prayer times for the visitor's location
 */

/**
 */
function astrooda_jemx($form, &$form_state)
{
  $module_path = drupal_get_path('module', 'astrooda');

  $form = array();

  $form['#tree'] = FALSE;
  // turn off form caching
  // $form_state['no_cache'] = TRUE;

  $mform_id = __FUNCTION__ . '_';

  $form['#action'] = 'dispatch-data/run_analysis';
  $form['#method'] = 'POST';

  $form['#attributes'] = array(
    'class' => 'jemx-form'
  );

  $form['instrument'] = array(
    '#type' => 'hidden',
    '#value' => 'jemx'
  );

  $astrooda_settings = variable_get('astrooda_settings');
  $instrument_defaults = $astrooda_settings['instruments']['jemx'];

  $form['osa_version'] = array(
    '#type' => 'select',
    '#title' => t("OSA Version"),
    '#options' => array(
      'OSA10.2' => 'OSA10.2',
      'OSA11.0' => 'OSA11.0',
      'OSA11.1' => 'OSA11.1'
    ),
    '#default_value' => $instrument_defaults['osa_version'],
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
    '#prefix' => '<div class="row">'
  );

  $form['radius'] = array(
    '#type' => 'textfield',
    '#title' => t("Radius"),
    '#default_value' => $instrument_defaults['radius'],
    '#size' => 10,
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
      'data-bv-numeric' => 'true'
    ),
    '#field_suffix' => t('deg'),
    '#suffix' => '</div><hr class="hr-default" />'
  );

  $form['use_scws'] = array(
    '#type' => 'radios',
    '#title' => t("Use INTEGRAL pointing Science Windows (ScWs)"),
    '#attributes' => array(
      'name' => $mform_id . 'use_scws'
    ),
    '#options' => array(
      'no' => t('Select for time range'),
      'form_list' => t('Custom list'),
      'user_file' => t('Custom list in file')
    ),
    '#default_value' => 'no',
    '#parent_classes' => array(
      'form-group',
      'col-md-8'
    ),
    '#prefix' => '<div class="row">',
    '#suffix' => '</div>'
  );

  $form['max_pointings'] = array(
    '#type' => 'textfield',
    '#title' => t("Maximum number of ScWs"),
    '#description' => t("randomly selected in the time range"),
    '#size' => 10,
    '#default_value' => $instrument_defaults['max_pointings'],
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
      ),
      'data-bv-numeric' => 'true'
    ),
    '#states' => array(
      'visible' => array( // action to take.
        ':input[name="' . $mform_id . 'use_scws"]' => array(
          'value' => 'no'
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'use_scws"]' => array(
          array(
            'value' => 'no'
          )
        )
      )
    ),
    '#prefix' => '<div class="row">',
    '#suffix' => '</div>'
  );

  $form['scw_list'] = array(
    '#type' => 'textarea',
    '#title' => t("ScWs List"),
    '#default_value' => $instrument_defaults['scw_list'],
    '#parent_classes' => array(
      'form-group',
      'col-md-12'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#attributes' => array(
      'class' => array(
        'form-control'
      )
    ),
    '#states' => array(
      'visible' => array( // action to take.
        ':input[name="' . $mform_id . 'use_scws"]' => array(
          'value' => 'form_list'
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'use_scws"]' => array(
          array(
            'value' => 'form_list'
          )
        )
      )
    ),
    '#prefix' => '<div class="row">',
    '#suffix' => '</div>'
  );

  $form['user_scw_list_file'] = array(
    '#type' => 'file',
    '#title' => t("ScWs file"),
    '#description' => t('An ASCII file, one ScW per line.'),
    '#attributes' => array(
      'name' => 'user_scw_list_file',
      'class' => array(
        'user_scw_list_file'
      )
    ),
    '#parent_classes' => array(
      'form-group',
      'col-md-8'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#states' => array(
      'visible' => array( // action to take.
        ':input[name="' . $mform_id . 'use_scws"]' => array(
          'value' => 'user_file'
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'use_scws"]' => array(
          array(
            'value' => 'user_file'
          )
        )
      )
    ),
    '#field_suffix' => '<span class="fa fa-times clear-left-input"></span>',
    '#prefix' => '<div class="row">',
    '#suffix' => '</div><hr class="hr-default" />'
  );

  $form['integral_data_rights'] = array(
    '#type' => 'radios',
    '#title' => t("INTEGRAL data access priviledge"),
    '#attributes' => array(
      'name' => $mform_id . 'integral_data_rights'
    ),
    '#default_value' => 'public',
    '#options' => array(
      'public' => 'Public',
      'all-private' => 'All Private'
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

  $form['jemx_num'] = array(
    '#type' => 'radios',
    '#title' => t("JEMX module number"),
    '#description' => t(""),
    '#attributes' => array(
      'name' => $mform_id . 'jemx_num'
    ),
    '#options' => array(
      '1' => t('JEMX-1'),
      '2' => t('JEMX-2')
      // '3' => t ( 'Merged JEMX-1 and JEMX-2' )
    ),
    '#default_value' => '1',
    '#parent_classes' => array(
      'form-group',
      'col-md-8'
    ),
    '#prefix' => '<div class="row">',
    '#suffix' => '</div><hr class="hr-default" />'
  );

  $form['E1_keV'] = array(
    '#type' => 'textfield',
    '#title' => t("Energy Min"),
    '#description' => t("The minimum of the energy band."),
    '#required' => TRUE,
    '#size' => 10,
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
      ),
      'data-bv-numeric' => 'true'
    ),
    '#field_suffix' => t('keV'),
    '#prefix' => '<div class="row">'
  );

  $form['E1_keV']['#default_value'] = 3;

  $form['E2_keV'] = array(
    '#type' => 'textfield',
    '#title' => t("Energy Max"),
    '#description' => t("The maximum of the energy band."),
    '#required' => TRUE,
    '#size' => 10,
    '#parent_classes' => array(
      'form-group',
      'col-md-5'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#attributes' => array(
      'class' => array(
        'form-control'
      ),
      'data-bv-numeric' => 'true'
    ),
    '#field_suffix' => t('keV'),
    '#suffix' => '</div><hr class="hr-default" />'
  );

  $form['E2_keV']['#default_value'] = 20;

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
    '#prefix' => '<div class="row">'
  );

  $form['detection_threshold'] = array(
    '#type' => 'textfield',
    '#title' => t("Detection Threshold"),
    '#description' => t("Output catalog significance threshold"),
    '#parent_classes' => array(
      'form-group',
      'col-md-5'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#attributes' => array(
      'class' => array(
        'form-control'
      ),
      'data-bv-numeric' => 'true'
    ),
    '#suffix' => '</div><hr class="hr-default" />'
  );

  $form['detection_threshold']['#default_value'] = 7.0;

  $form['product_type'] = array(
    '#type' => 'radios',
    '#title' => t("Product Type"),
    '#description' => t("Select product type"),
    '#attributes' => array(
      'name' => $mform_id . 'product_type'
    ),
    '#default_value' => $instrument_defaults['product_type'],
    '#options' => array(
      'jemx_image' => 'Image',
      'jemx_spectrum' => 'Spectrum',
      'jemx_lc' => 'Light curve'
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

  $form['time_bin'] = array(
    '#type' => 'textfield',
    '#title' => t("Time bin"),
    '#description' => t("Minimum value is 20 seconds."),
    '#default_value' => $instrument_defaults['time_bin'],
    '#states' => array(
      'visible' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          'value' => 'jemx_lc'
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'jemx_lc'
          )
        )
      )
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
      ),
      'data-bv-numeric' => 'true',
      'data-astrooda-time-bin-min' => 20
    ),
    '#prefix' => '<div class="row">'
  );

  $form['time_bin_format'] = array(
    '#type' => 'select',
    '#title' => t("Unit"),
    '#options' => array(
      'sec' => 'Seconds',
      'jd' => 'Days'
    ),
    '#default_value' => $instrument_defaults['time_bin_format'],
    '#states' => array(
      'visible' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          'value' => 'jemx_lc'
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'jemx_lc'
          )
        )
      )
    ),
    '#parent_classes' => array(
      'form-group',
      'col-md-4'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#attributes' => array(
      'class' => array(
        'form-control time_bin_format'
      )
    ),
    '#suffix' => '</div>'
  );

  $form['user_catalog_file'] = array(
    '#type' => 'file',
    '#title' => t("User catalog"),
    '#description' => t('If needed, create a custom catalog following one of the templates : <a href="' . $module_path . '/data/catalog.txt" download>ASCII</a> or <a href="' . $module_path . '/data/catalog.fits" download>FITS</a>.'),
    '#attributes' => array(
      'name' => 'user_catalog_file'
    ),
    '#prefix' => '<hr class="hr-default" /><div class="row">',
    // '#suffix' => '<div class="inline-user-catalog hidden"><a class="show-catalog" href="#" >Inline catalog</a><span class="fa fa-times remove-catolog"></span></div></div><hr class="hr-default" />',
    '#suffix' => '</div><hr class="hr-default" />',
    '#parent_classes' => array(
      'form-group',
      'col-md-8'
    ),
    '#label_classes' => array(
      'control-label'
    )
  );

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit')
  );

  form_load_include($form_state, 'inc', 'astrooda', 'astrooda.jemx');

  return ($form);
}
