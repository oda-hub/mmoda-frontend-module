<?php

/**
 * @file
 * Provides a block displaying prayer times for the visitor's location
 */

/**
 */
function mmoda_euclid($form, &$form_state)
{
  $module_path = drupal_get_path('module', 'mmoda');
  $instrument = 'euclid';

  $form = array();

  $form['#tree'] = FALSE;
  // turn off form caching
  // $form_state['no_cache'] = TRUE;

  $mform_id = __FUNCTION__ . '_';

  $form['#method'] = 'POST';

  $form['#attributes'] = array(
    'class' => 'euclid-form'
  );

  $form['instrument'] = array(
    '#type' => 'hidden',
    '#value' => 'euclid'
  );
  $module_name = basename(__FILE__, '.install');
  list ($core_module_name) = explode('_', $module_name);

  $core_module_settings = variable_get($core_module_name . '_settings');
  $instrument_defaults = $core_module_settings['instruments'][$instrument];

  $form['#action'] = $instrument_defaults['data_server_local_url'];

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
    '#prefix' => '<div class="row">',
    '#suffix' => '</div><hr class="hr-default" />'
  );


  $form['E1_keV'] = array(
    '#type' => 'textfield',
    '#title' => t("Energy Min"),
    '#description' => t("The minimum of the energy band."),
    '#default_value' => $instrument_defaults['E1_keV'],
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

  $form['E2_keV'] = array(
    '#type' => 'textfield',
    '#title' => t("Energy Max"),
    '#description' => t("The maximum of the energy band."),
    '#default_value' => $instrument_defaults['E2_keV'],
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
      'euclid_image' => 'Image',
      'euclid_spectrum' => 'Spectrum',
      'euclid_lc' => 'Light curve'
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
          'value' => 'euclid_lc'
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'euclid_lc'
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
      'data-mmoda-time-bin-min' => 20
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
          'value' => 'euclid_lc'
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'euclid_lc'
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
    // '#suffix' => '<div class="inline-user-catalog hidden"><a class="show-catalog" href="#" >Inline catalog</a><span class="fa fa-times remove-catalog"></span></div></div><hr class="hr-default" />',
    // '#suffix' => '<div class="inline-user-catalog hidden"><button class="btn btn-default show-catalog" href="#" >Inline catalog</button><span class="fa fa-times remove-catalog"></span></div></div><hr class="hr-default" />',
    '#suffix' => '</div><hr class="hr-default" />',
    '#parent_classes' => array(
      'form-group',
      'col-md-8'
    ),
    '#label_classes' => array(
      'control-label'
    )
  );
//   error_log(print_r($instrument_defaults['filters'], true));
  $instruments_filters = array('none' => 'Select a filter');
  foreach ($instrument_defaults['filters'] as $instrument => $filters) {
    if (! array_key_exists($instrument, $instruments_filters))
      $instruments_filters[$instrument] = array();
    foreach ($filters as $filter) {
      $instruments_filters[$instrument][$instrument . '|' . $filter] = $filter;
    }
  }
//   error_log(print_r($instruments_filters, true));
//   $filename = '/tmp/instruments_filters.php';
//   $f = fopen($filename, 'w');
//   fwrite($f, print_r($instruments_filters, true));
//   fclose($f);

  $form['filters'] = array(
    '#type' => 'container',
    '#title' => t('Filters'),
//     '#collapsible' => TRUE, // Added
//     '#collapsed' => FALSE, // Added
    '#attributes' => array(
      'class' => array(
        'euclid-instruments-filters'
      )
    ),
    '#suffix' => '<hr>'

  );
  // To make these fields required
  // $form['filters']['instrument[]'] = array(
  // '#type' => 'select',
  // '#title' => t('Instrument'),
  // '#options' => array_keys($instrument_defaults['filters']),
  // '#prefix' => '<div class="row">',
  // '#parent_classes' => array(
  // 'form-group',
  // 'col-md-3'
  // )
  // );
  $form['filters']['filter[]'] = array(
    '#type' => 'select',
    '#title' => t(''),
    // '#options' => $instrument_defaults['filters'],$instruments_filters
    '#options' => $instruments_filters,
    '#parent_classes' => array(
      'form-group',
    ),
    '#prefix' => '<label class="control-label" for="edit-integral-data-rights">Filters</label><table><thead><tr><th>Filter</th><th>Flux column name</th><th>Flux error column name</th><th></th></tr></thead><tbody>'
     .'<tr><td>',
    '#suffix' => '</td>'
  );
  $form['filters']['flux[]'] = array(
    '#type' => 'textfield',
    '#title' => t(''),
    '#parent_classes' => array(
      'form-group',
    ),
    '#prefix' => '<td>',
    '#suffix' => '</td>'
  );
  $form['filters']['flux_error[]'] = array(
    '#type' => 'textfield',
    '#title' => t(''),
    '#parent_classes' => array(
      'form-group',
    ),
    '#prefix' => '<td>',
    '#suffix' => '</td>',
  );

  $form['filters']['plus'] = array(
    '#type' => 'markup',
    '#markup' => '<button class="btn btn-secondary plus-element"><span class="glyphicon glyphicon-plus"></span></button>',
    '#prefix' => '<td>',
    '#suffix' => '</td></tr></tbody></table>'
  );


  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit')
  );
  drupal_add_js(array(
    'euclid-filters' => $instrument_defaults['filters']
  ), 'setting');

  form_load_include($form_state, 'inc', 'mmoda', 'mmoda.euclid');

  return ($form);
}
