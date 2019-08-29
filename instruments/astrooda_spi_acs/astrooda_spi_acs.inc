<?php

/**
 * @file
 * Provides a block displaying prayer times for the visitor's location
 */

/**
 */
function astrooda_spi_acs($form, &$form_state) {

  $form = array ();

  $form ['#tree'] = FALSE;
  //turn off form caching
  $mform_id= __FUNCTION__.'_';

  $form ['#action'] = 'dispatch-data/run_analysis';
  $form ['#method'] = 'POST';
  $form['#attributes'] = array('class' => 'spi_acs-form');

  $form ['instrument'] = array (
      '#type' => 'hidden',
      '#value' => 'spi_acs'
  );

  $astrooda_settings = variable_get('astrooda_settings');
  $instrument_defaults= $astrooda_settings['instruments']['spi_acs'];
  $form['#attached']['js'] = array(
    drupal_get_path('module', 'astrooda_spi_acs') . '/astrooda_spi_acs.js',
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
   //       'spi_acs_image' => 'Image',
   //       'spi_acs_spectrum' => 'Spectrum',
          'spi_acs_lc' => 'Light curve'
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
      '#description' => t ( "In seconds (multiple of 50 ms)." ),
      '#default_value' => $instrument_defaults['time_bin'],
      '#states' => array (
          'visible' => array (
              ':input[name="'.$mform_id.'product_type"]' => array (
                  'value' => 'spi_acs_lc'
              )
          ),
          'enabled' => array (
              ':input[name="'.$mform_id.'product_type"]' => array (
                  array (
                      'value' => 'spi_acs_lc'
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
         // 'data-astrooda-time-bin-min' => 40,
          'data-astrooda-time-bin-multiple' => 50,
      ),
      '#prefix' => '<div class="row">',
    '#suffix' => '</div><hr class="hr-default" />'
  );

//   $form ['time_bin_format'] = array (
//       '#type' => 'select',
//       '#title' => t ( "Unit" ),
//       '#options' => array (
//           'sec' => 'Seconds',
//           'jd' => 'Days'
//       ),
//       '#default_value' => $instrument_defaults['time_bin_format'],
//       '#states' => array (
//           'visible' => array (
//               ':input[name="'.$mform_id.'product_type"]' => array (
//                   'value' => 'spi_acs_lc'
//               )
//           ),
//           'enabled' => array (
//               ':input[name="'.$mform_id.'product_type"]' => array (
//                   array (
//                       'value' => 'spi_acs_lc'
//                   )
//               )
//           )
//       ),
//       '#parent_classes' => array (
//           'form-group',
//           'col-md-4'
//       ),
//       '#label_classes' => array (
//           'control-label'
//       ),
//       '#attributes' => array (
//           'class' => array (
//               'form-control time_bin_format'
//           )
//       ),
//       '#suffix' => '</div>'
//   );

  $form ['submit'] = array (
      '#type' => 'submit',
      '#value' => t ( 'Submit' ),
  );

  form_load_include ( $form_state, 'inc', 'astrooda', 'astrooda.spi_acs' );


  return ($form);
}
