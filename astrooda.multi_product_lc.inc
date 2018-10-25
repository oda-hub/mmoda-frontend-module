<?php

/**
 * @file
 * Provides a block displaying prayer times for the visitor's location
 */

/**
 */
function astrooda_multi_product_lc($form, &$form_state) {
  
  $form = array ();
  
  $form ['#tree'] = FALSE;
  //turn off form caching
  $mform_id= __FUNCTION__.'_';
  
  $form ['#action'] = '/dispatch-data/run_analysis';
  // $form['#action'] = '/test_post.php';
  // $form['#method'] = 'GET';
  $form ['#method'] = 'POST';
  $form['#attributes'] = array('class' => 'multi_product_lc-form');

  $form ['instrument'] = array (
      '#type' => 'hidden',
      '#value' => 'multi_product_lc'
  );
  
  
  
  $form ['query_type'] = array (
      '#type' => 'select',
      '#title' => t ( "Query Type" ),
      '#description' => t ( "Select query type" ),
      '#default_value' => 'Real',
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
  
  
  $form ['query_action'] = array (
      '#type' => 'radios',
      '#title' => t ( "Query Action" ),
      '#description' => t ( "Select query action" ),
      '#attributes' => array ('name' => $mform_id.'query_action'),
      '#default_value' => 'merge',
      '#options' => array (
          'merge' => 'Merge',
          'rebin' => 'Rebin'
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
      '#default_value' => '',
      '#states' => array (
          'visible' => array (
              ':input[name="'.$mform_id.'query_action"]' => array (
                  'value' => 'polar_lc'
              )
          ),
          'enabled' => array (
              ':input[name="'.$mform_id.'query_action"]' => array (
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
      '#default_value' => 'jd',
      '#states' => array (
          'visible' => array (
              ':input[name="'.$mform_id.'query_action"]' => array (
                  'value' => 'polar_lc'
              )
          ),
          'enabled' => array (
              ':input[name="'.$mform_id.'query_action"]' => array (
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
      '#suffix' => '</div>'
  );
  
  
  $form ['submit'] = array (
      '#type' => 'submit',
      '#value' => t ( 'Submit' ),
  );
  
  form_load_include ( $form_state, 'inc', 'astrooda', 'astrooda.polar' );
  
   
  return ($form);
}
