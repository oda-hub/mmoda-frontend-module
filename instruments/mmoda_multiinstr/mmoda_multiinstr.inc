<?php

/**
 * @file
 * Provides a block displaying prayer times for the visitor's location
 */

/**
 */
function mmoda_multiinstr($form, &$form_state) {

  $form = array ();

  $form ['#tree'] = FALSE;
  //turn off form caching
  $mform_id= __FUNCTION__.'_';

  $form ['#action'] = 'dispatch-data/run_analysis';
  $form ['#method'] = 'POST';
  $form['#attributes'] = array('class' => 'multiinstr-form');

  $form ['instrument'] = array (
      '#type' => 'hidden',
      '#value' => 'multimessenger'
  );

  $mmoda_settings = variable_get('mmoda_settings');
  $instrument_defaults= $mmoda_settings['instruments']['multiinstr'];

  $form ['query_type'] = array (
      '#type' => 'hidden',
      '#value' => $instrument_defaults['query_type'],
  );

  $form ['ids_csv'] = array (
      '#type' => 'textfield',
      '#title' => t ( "Product ids" ),
      '#default_value' => '',
      '#parent_classes' => array (
          'form-group',
          'col-md-6'
      ),
      '#attributes' => array (
          'class' => array (
              'form-control'
          ),
      ),
    '#prefix' => '<div class="row">',
    '#suffix' => '</div>'
  );


  $form ['submit'] = array (
      '#type' => 'submit',
      '#value' => t ( 'Submit' ),
  );

  form_load_include ( $form_state, 'inc', 'mmoda', 'mmoda.multiinstr' );


  return ($form);
}
