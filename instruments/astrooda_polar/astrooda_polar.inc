<?php

/**
 * @file
 * Provides a block displaying prayer times for the visitor's location
 */

/**
 */
function astrooda_polar($form, &$form_state) {

  $form = array ();

  $form ['#tree'] = FALSE;
  //turn off form caching
  $mform_id= __FUNCTION__.'_';

  $form ['#action'] = 'dispatch-data/run_analysis';
  $form ['#method'] = 'POST';
  $form['#attributes'] = array('class' => 'polar-form');

  $form ['instrument'] = array (
      '#type' => 'hidden',
      '#value' => 'polar'
  );

  $astrooda_settings = variable_get('astrooda_settings');
  $instrument_defaults= $astrooda_settings['instruments']['polar'];

  $form ['E1_keV'] = array (
      '#type' => 'textfield',
      '#title' => t ( "Energy Min" ),
      '#description' => t ( "The minimum of the energy band." ),
<<<<<<< HEAD:instruments/astrooda_polar/astrooda_polar.inc
      '#default_value' => $instrument_defaults['E1_keV'],
=======
      '#default_value' => '0.0',
>>>>>>> c10e998784be11db7deafc74a51e777aaa0cddbc:astrooda.polar.inc
      '#required' => TRUE,
      '#size' => 10,
      '#parent_classes' => array (
          'form-group',
          'col-md-6'
      ),
      '#field_suffix' => t('keV'),
      '#label_classes' => array (
          'control-label'
      ),
      '#attributes' => array (
          'class' => array (
              'form-control'
          ),
          'data-bv-numeric' => 'true'
      ),
      '#prefix' => '<div class="row">'
  );

  $form ['E2_keV'] = array (
      '#type' => 'textfield',
      '#title' => t ( "Energy Max" ),
      '#description' => t ( "The maximum of the energy band." ),
<<<<<<< HEAD:instruments/astrooda_polar/astrooda_polar.inc
      '#default_value' => $instrument_defaults['E2_keV'],
=======
      '#default_value' => '2000.0',
>>>>>>> c10e998784be11db7deafc74a51e777aaa0cddbc:astrooda.polar.inc
      '#required' => TRUE,
      '#size' => 10,
      '#field_suffix' => t('keV'),
      '#parent_classes' => array (
          'form-group',
          'col-md-6'
      ),
      '#label_classes' => array (
          'control-label'
      ),
      '#attributes' => array (
          'class' => array (
              'form-control'
          ),
          'data-bv-numeric' => 'true'
      ),
      '#suffix' => '</div><hr class="hr-default" />'
  );

  $form ['query_type'] = array (
      '#type' => 'select',
      '#title' => t ( "Query Type" ),
      '#description' => t ( "Select query type" ),
      '#default_value' => $instrument_defaults['query_type'],
      '#options' => array (
          'Real' => 'Real',
          'Dummy' => 'Dummy'
      ),
      '#parent_classes' => array (
          'form-group',
          'col-md-6'
      ),
      '#label_classes' => array (
          'control-label'
      ),
      '#attributes' => array (
          'class' => array (
              'form-control'
          )
      ),
      '#prefix' => '<div class="row">',
      '#suffix' => '</div><hr class="hr-default" />',
  );


  $form ['product_type'] = array (
      '#type' => 'radios',
      '#title' => t ( "Product Type" ),
      '#description' => t ( "Select product type" ),
      '#attributes' => array ('name' => $mform_id.'product_type'),
      '#default_value' => $instrument_defaults['product_type'],
      '#options' => array (
   //       'polar_image' => 'Image',
   //       'polar_spectrum' => 'Spectrum',
          'polar_lc' => 'Light curve'
      ),
      '#parent_classes' => array (
          'form-group',
          'col-md-6'
      ),
      '#label_classes' => array (
          'control-label'
      ),
      '#prefix' => '<div class="row">',
      '#suffix' => '</div>'
  );

  $form ['time_bin'] = array (
      '#type' => 'textfield',
      '#title' => t ( "Time bin" ),
      //'#description' => t ( "Minimum value is 20 seconds." ),
<<<<<<< HEAD:instruments/astrooda_polar/astrooda_polar.inc
      '#default_value' => $instrument_defaults['time_bin'],
=======
      '#default_value' => '0.1',
>>>>>>> c10e998784be11db7deafc74a51e777aaa0cddbc:astrooda.polar.inc
      '#states' => array (
          'visible' => array (
              ':input[name="'.$mform_id.'product_type"]' => array (
                  'value' => 'polar_lc'
              )
          ),
          'enabled' => array (
              ':input[name="'.$mform_id.'product_type"]' => array (
                  array (
                      'value' => 'polar_lc'
                  )
              )
          )
      ),
      '#parent_classes' => array (
          'form-group',
          'col-md-6'
      ),
      '#label_classes' => array (
          'control-label'
      ),
      '#attributes' => array (
          'class' => array (
              'form-control'
          ),
          'data-bv-numeric' => 'true',
      ),
      '#prefix' => '<div class="row">'
  );

  $form ['time_bin_format'] = array (
      '#type' => 'select',
      '#title' => t ( "Unit" ),
      '#options' => array (
          'sec' => 'Seconds',
          'jd' => 'Days'
      ),
<<<<<<< HEAD:instruments/astrooda_polar/astrooda_polar.inc
      '#default_value' => $instrument_defaults['time_bin_format'],
=======
      '#default_value' => 'sec',
>>>>>>> c10e998784be11db7deafc74a51e777aaa0cddbc:astrooda.polar.inc
      '#states' => array (
          'visible' => array (
              ':input[name="'.$mform_id.'product_type"]' => array (
                  'value' => 'polar_lc'
              )
          ),
          'enabled' => array (
              ':input[name="'.$mform_id.'product_type"]' => array (
                  array (
                      'value' => 'polar_lc'
                  )
              )
          )
      ),
      '#parent_classes' => array (
          'form-group',
          'col-md-4'
      ),
      '#label_classes' => array (
          'control-label'
      ),
      '#attributes' => array (
          'class' => array (
              'form-control time_bin_format'
          )
      ),
      '#suffix' => '</div><hr class="hr-default" />'
  );

  $form ['submit'] = array (
      '#type' => 'submit',
      '#value' => t ( 'Submit' ),
  );

  form_load_include ( $form_state, 'inc', 'astrooda', 'astrooda.polar' );


  return ($form);
}
