<?php

/**
 * @file
 * Provides a block displaying prayer times for the visitor's location
 */

/**
 */
function astrooda_gw($form, &$form_state)
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

  $astrooda_settings = variable_get('astrooda_settings');
  $instrument_defaults = $astrooda_settings['instruments']['gw'];

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
      'gw_image' => 'Image',
      'gw_strain' => 'Strain',
      'gw_spectrogram' => 'Spectrogram',
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
    '#suffix' => '</div><hr class="hr-default" />'
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

  form_load_include($form_state, 'inc', 'astrooda', 'astrooda.gw');

  return ($form);
}
