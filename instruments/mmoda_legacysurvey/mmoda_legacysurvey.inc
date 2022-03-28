<?php

/**
 * @file
 * Provides a block displaying prayer times for the visitor's location
 */

/**
 */
function mmoda_legacysurvey($form, &$form_state)
{
  $form = array();

  $form['#tree'] = FALSE;
  // turn off form caching
  $mform_id = __FUNCTION__ . '_';

  $form['#action'] = 'dispatch-data/run_analysis';
  $form['#method'] = 'POST';
  $form['#attributes'] = array(
    'class' => 'legacysurvey-form'
  );

  $form['instrument'] = array(
    '#type' => 'hidden',
    '#value' => 'legacysurvey'
  );

  $mmoda_settings = variable_get('mmoda_settings');
  $instrument_defaults = $mmoda_settings['instruments']['legacysurvey'];

  $form['query_type'] = array(
    '#type' => 'hidden',
    '#value' => $instrument_defaults['query_type'],
  );

  $form['data_release'] = array(
    '#type' => 'select',
    '#title' => t("Data Release"),
    '#default_value' => $instrument_defaults['data_release'],
    '#parent_classes' => array(
      'form-group',
      'col-md-6'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#attributes' => array(
      'name' => $mform_id . 'data_release',
      'class' => array(
        'form-control'
      ),
    ),
    '#options' => array(
      1 => 'DR1',
      2 => 'DR2',
      3 => 'DR3',
      4 => 'DR4',
      5 => 'DR5',
      6 => 'DR6',
      7 => 'DR7',
      8 => 'DR8',
      9 => 'DR9'
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
      'legacy_survey_image' => 'Image & Catalog',
      'legacy_survey_photometry' => 'Photometry',
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

  $form['radius_photometry'] = array(
    '#type' => 'textfield',
    '#title' => t("Photometry collection radius"),
    '#description' => t("All sources in this radius from center will be used to obtain photometry."),
    '#default_value' => $instrument_defaults['radius_photometry'],
    '#parent_classes' => array(
      'form-group',
      'col-md-6'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#attributes' => array(
      'name' => $mform_id . 'radius_photometry',
      'class' => array(
        'form-control'
      ),
      'data-bv-numeric' => 'true',
      'data-bv-notempty' => 'true'
    ),
    '#prefix' => '<div class="row">',
    '#field_suffix' => t('arcsec'),
    '#suffix' => '</div>',
    '#states' => array(
      'visible' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          'value' => 'legacy_survey_photometry'
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'legacy_survey_photometry'
          )
        )
      )
    ),
  );

  $form['image_size'] = array(
    '#type' => 'textfield',
    '#title' => t("Image size"),
    '#default_value' => $instrument_defaults['image_size'],
    '#parent_classes' => array(
      'form-group',
      'col-md-6'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#attributes' => array(
      'name' => $mform_id . 'image_size',
      'class' => array(
        'form-control'
      ),
      'data-bv-numeric' => 'true',
      'data-bv-notempty' => 'true'
    ),
    '#prefix' => '<div class="row">',
    '#field_suffix' => t('arcmin'),
    '#states' => array(
      'visible' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          'value' => 'legacy_survey_image'
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'legacy_survey_image'
          )
        )
      )
    ),
  );


  $form['pixel_size'] = array(
    '#type' => 'textfield',
    '#title' => t("Pixel size"),
    '#default_value' => $instrument_defaults['pixel_size'],
    '#parent_classes' => array(
      'form-group',
      'col-md-6'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#attributes' => array(
      'name' => $mform_id . 'pixel_size',
      'class' => array(
        'form-control'
      ),
      'data-bv-numeric' => 'true',
      'data-bv-notempty' => 'true'
    ),
    '#field_suffix' => t('arcsec per pixel'),
    '#suffix' => '</div>',
    '#states' => array(
      'visible' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          'value' => 'legacy_survey_image'
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'legacy_survey_image'
          )
        )
      )
    ),
  );

  $form['image_band'] = array(
    '#type' => 'radios',
    '#title' => t("Image Band"),
    '#description' => t("Select image band"),
    '#attributes' => array(
      'name' => $mform_id . 'image_band'
    ),
    '#default_value' => $instrument_defaults['image_band'],
    '#options' => array(
      'g' => 'g',
      'r' => 'r',
      'z' => 'z'
    ),
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
          'value' => 'legacy_survey_image'
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'legacy_survey_image'
          )
        )
      )
    ),
  );





  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit'),
    '#prefix' => '<hr class="hr-default" />'
  );

  form_load_include($form_state, 'inc', 'mmoda', 'mmoda.legacysurvey');

  return ($form);
}
