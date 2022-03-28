<?php

/**
 * @file
 * Provides a block displaying prayer times for the visitor's location
 */

/**
 */
function mmoda_gw($form, &$form_state)
{
  $form = array();

  $form['#tree'] = FALSE;
  // turn off form caching
  $mform_id = __FUNCTION__ . '_';

  $form['#action'] = 'dispatch-data/run_analysis';
  $form['#method'] = 'POST';
  $form['#attributes'] = array(
    'class' => 'gw-form'
  );

  $form['instrument'] = array(
    '#type' => 'hidden',
    '#value' => 'gw'
  );

  $mmoda_settings = variable_get('mmoda_settings');
  $instrument_defaults = $mmoda_settings['instruments']['gw'];

  $form['query_type'] = array(
    '#type' => 'hidden',
    '#value' => $instrument_defaults['query_type'],
  );

  $form['detector'] = array(
    '#type' => 'select',
    '#title' => t("Detector"),
    '#default_value' => $instrument_defaults['detector'],
    '#parent_classes' => array(
      'form-group',
      'col-md-6'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#attributes' => array(
      'name' => $mform_id . 'detector',
      'class' => array(
        'form-control'
      ),
    ),
    '#options' => array(
      'H1' => 'H1',
      'L1' => 'L1',
      'V1' => 'V1'
    ),
    '#prefix' => '<div class="row">',
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
      'gw_skymap_image' => 'Skymap & catalogue',
      'gw_strain' => 'Strain time series',
      'gw_spectrogram' => 'Spectrogram',
    ),
    '#parent_classes' => array(
      'form-group',
      'col-md-6'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#prefix' => '<div class="row">',
    '#suffix' => '</div><hr class="hr-default" />'
  );

  $form['do_cone_search'] = array(
    '#type' => 'radios',
    '#title' => t("Search mode"),
    '#attributes' => array(
      'name' => $mform_id . 'do_cone_search'
    ),
    '#options' => array(
      'true' => 'Cone search',
      'false' => 'All sky'
    ),
    '#default_value' => $instrument_defaults['do_cone_search'],
    '#parent_classes' => array(
      'form-group',
      'col-md-6'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#prefix' => '<div class="row">',
    '#states' => array(
      'visible' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          'value' => 'gw_skymap_image'
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'gw_skymap_image'
          )
        )
      )
    ),
  );

  $form['contour_levels'] = array(
    '#type' => 'textfield',
    '#title' => t("Contour levels"),
    '#description' => t("Comma-separated list of levels"),
    '#default_value' => $instrument_defaults['contour_levels'],
    '#states' => array(
      'visible' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          'value' => 'gw_skymap_image'
        ),
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          'value' => 'gw_skymap_image'
        ),
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
      'data-bv-notempty' => 'true',
      'data-bv-regexp' => 'true',
      'data-bv-regexp-regexp' => '^[0-9]{1,2}(,[0-9]{1,2})*$',
    ),
    '#suffix' => '</div>'
  );

  $form['level_threshold'] = array(
    '#type' => 'textfield',
    '#title' => t("Level threshold"),
    '#default_value' => $instrument_defaults['level_threshold'],
    '#states' => array(
      'visible' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          'value' => 'gw_skymap_image'
        ),
        'and',
        ':input[name="' . $mform_id . 'do_cone_search"]' => array(
          'value' => 'true'
        ),
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          'value' => 'gw_skymap_image'
        ),
        'and',
        ':input[name="' . $mform_id . 'do_cone_search"]' => array(
          'value' => 'true'
        ),
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
      'data-bv-notempty' => 'true',
      'data-bv-integer' => 'true',
      'data-bv-between' => 'true',
      'data-bv-between-min' => '0',
      'data-bv-between-max' => '100',
    ),
    '#prefix' => '<div class="row">'
  );

  $form['radius'] = array(
    '#type' => 'textfield',
    '#title' => t("Radius"),
    '#default_value' => $instrument_defaults['radius'],
    '#states' => array(
      'visible' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          'value' => 'gw_skymap_image'
        ),
        'and',
        ':input[name="' . $mform_id . 'do_cone_search"]' => array(
          'value' => 'true'
        ),
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          'value' => 'gw_skymap_image'
        ),
        'and',
        ':input[name="' . $mform_id . 'do_cone_search"]' => array(
          'value' => 'true'
        ),
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
      'data-bv-notempty' => 'true',
      'data-bv-numeric' => 'true',
      'data-bv-between' => 'true',
      'data-bv-between-min' => '0',
      'data-bv-between-max' => '360',
    ),
    '#suffix' => '</div>'
  );

  $form['whiten'] = array(
    '#type' => 'radios',
    '#title' => t("Whiten?"),
    '#description' => t("Should the strain data be whiten?"),
    '#attributes' => array(
      'name' => $mform_id . 'whiten'
    ),
    '#options' => array(
      'true' => 'Yes',
      'false' => 'No'
    ),
    '#default_value' => $instrument_defaults['whiten'],
    '#parent_classes' => array(
      'form-group',
      'col-md-6'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#prefix' => '<div class="row">',
    '#suffix' => '</div>',
    '#states' => array(
      'visible' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          'value' => 'gw_spectrogram', 'or', 'value' => 'gw_strain' 
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'gw_spectrogram', 'or', 'value' => 'gw_strain'
          )
        )
      )
    ),
  );

  $form['qmin'] = array(
    '#type' => 'textfield',
    '#title' => t("Lower Q"),
    '#description' => t("Lower bound of Qs interval"),
    '#default_value' => $instrument_defaults['qmin'],
    '#states' => array(
      'visible' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          'value' => 'gw_spectrogram'
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'gw_spectrogram'
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
      'data-bv-integer' => 'true',
    ),
    '#prefix' => '<div class="row">'
  );

  $form['qmax'] = array(
    '#type' => 'textfield',
    '#title' => t("Upper Q"),
    '#description' => t("Upper bound of Qs interval"),
    '#default_value' => $instrument_defaults['qmax'],
    '#states' => array(
      'visible' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          'value' => 'gw_spectrogram'
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'gw_spectrogram'
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
      'data-bv-integer' => 'true',
    ),
    '#suffix' => '</div>'
  );

  $form['fmin'] = array(
    '#type' => 'textfield',
    '#title' => t("Lower frequency"),
    '#description' => t("Lower frequency to bandpass"),
    '#default_value' => $instrument_defaults['fmin'],
    '#states' => array(
      'visible' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          'value' => 'gw_strain'
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'gw_strain'
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
      'data-bv-integer' => 'true',
    ),
    '#prefix' => '<div class="row">',
    '#field_suffix' => t('Hz'),
  );

  $form['fmax'] = array(
    '#type' => 'textfield',
    '#title' => t("Upper frequency"),
    '#description' => t("Upper frequency to bandpass"),
    '#default_value' => $instrument_defaults['fmax'],
    '#states' => array(
      'visible' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          'value' => 'gw_strain'
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'gw_strain'
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
      'data-bv-integer' => 'true',
    ),
    '#suffix' => '</div>',
    '#field_suffix' => t('Hz'),
  );


  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit'),
    '#prefix' => '<hr class="hr-default" />'
  );

  form_load_include($form_state, 'inc', 'mmoda', 'mmoda.gw');

  return ($form);
}
