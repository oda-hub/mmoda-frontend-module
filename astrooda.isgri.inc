<?php

/**
 * @file
 * Provides a block displaying prayer times for the visitor's location
 */

/**
 */
function astrooda_isgri($form, &$form_state) {
    
  $module_path= drupal_get_path('module', 'astrooda');

  $form = array ();
  
  $form ['#tree'] = FALSE;
  //turn off form caching
  //$form_state['no_cache'] = TRUE;
  
  $mform_id= __FUNCTION__.'_';
  
  $form ['#action'] = '/dispatch-data/run_analysis';
  // $form['#action'] = '/test_post.php';
  // $form['#method'] = 'GET';
  $form ['#method'] = 'POST';
  
  
  $form['#attributes'] = array('class' => 'isgri-form');
  
  $form ['instrument'] = array (
      '#type' => 'hidden',
      '#value' => 'isgri'
  );

  $form ['osa_version'] = array (
      '#type' => 'select',
      '#title' => t ( "OSA Version" ),
      '#default_value' => 'OSA11.0',
      '#options' => array (
          'OSA10.2' => 'OSA10.2',
          'OSA11.0' => 'OSA11.0'
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
  );
  
  $form ['radius'] = array (
      '#type' => 'textfield',
      '#title' => t ( "Radius" ),
      '#default_value' => '25',
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
      '#suffix' => '</div><hr class="hr-default" />',
  );
  
  $form ['use_scws'] = array (
      '#type' => 'radios',
      '#title' => t ( "Use Science Windows - ScWs" ),
      '#description' => t ( "Maximum number of ScWs is 50." ),
      '#attributes' => array (
          'name' => $mform_id.'use_scws'
      ),
      '#options' => array (
          'no' => t ( 'No' ),
          'form_list' => t ( 'List' ),
          'user_file' => t ( 'File' )
      ),
      '#default_value' => 'no',
      '#parent_classes' => array (
          'form-group',
          'col-md-8'
      ),
      '#prefix' => '<div class="row">',
      '#suffix' => '</div>'
  );
  
  $form ['scw_list'] = array (
      '#type' => 'textarea',
      '#title' => t ( "ScWs List" ),
      '#default_value' => '005100410010.001,005100420010.001',
      '#parent_classes' => array (
          'form-group',
          'col-md-12'
      ),
      '#label_classes' => array (
          'control-label'
      ),
      '#attributes' => array (
          'class' => array (
              'form-control'
          )
      ),
      '#states' => array (
          'visible' => array ( // action to take.
              ':input[name="'.$mform_id.'use_scws"]' => array (
                  'value' => 'form_list'
              )
          ),
          'enabled' => array (
              ':input[name="'.$mform_id.'use_scws"]' => array (
                  array (
                      'value' => 'form_list'
                  )
              )
          )
      ),
      '#prefix' => '<div class="row">',
      '#suffix' => '</div>'
  );
  
  $form ['user_scw_list_file'] = array (
      '#type' => 'file',
      '#title' => t ( "ScWs file" ),
      '#description' => t ( 'An ASCII file, one ScW per line.'),
      '#attributes' => array (
          'name' => 'user_scw_list_file',
          'class' => array (
              'user_scw_list_file'
          )
      ),
      '#parent_classes' => array (
          'form-group',
          'col-md-8'
      ),
      '#label_classes' => array (
          'control-label'
      ),
      '#states' => array (
          'visible' => array ( // action to take.
              ':input[name="'.$mform_id.'use_scws"]' => array (
                  'value' => 'user_file'
              )
          ),
          'enabled' => array (
              ':input[name="'.$mform_id.'use_scws"]' => array (
                  array (
                      'value' => 'user_file'
                  )
              )
          )
      ),
      '#field_suffix' => '<span class="fa fa-times clear-left-input"></span>',
      '#prefix' => '<div class="row">',
      '#suffix' => '</div><hr class="hr-default" />'
  );
  
  $form ['E1_keV'] = array (
      '#type' => 'textfield',
      '#title' => t ( "Energy Min" ),
      '#description' => t ( "The minimum of the energy band." ),
      '#default_value' => '20.0',
      '#required' => TRUE,
      '#size' => 10,
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
      '#prefix' => '<div class="row">'
  );
  
  $form ['E2_keV'] = array (
      '#type' => 'textfield',
      '#title' => t ( "Energy Max" ),
      '#description' => t ( "The maximum of the energy band." ),
      '#default_value' => '40.0',
      '#required' => TRUE,
      '#size' => 10,
      '#parent_classes' => array (
          'form-group',
          'col-md-5'
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
      '#default_value' => 'Dummy',
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
      '#prefix' => '<div class="row">'
  );
  
  $form ['detection_threshold'] = array (
      '#type' => 'textfield',
      '#title' => t ( "Detection Threshold" ),
      '#description' => t ( "Output catalog significance threshold" ),
      '#default_value' => '5.0',
      '#parent_classes' => array (
          'form-group',
          'col-md-5'
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
  
  $form ['product_type'] = array (
      '#type' => 'radios',
      '#title' => t ( "Product Type" ),
      '#description' => t ( "Select product type" ),
      '#attributes' => array ('name' => $mform_id.'product_type'),
      '#default_value' => 'isgri_image',
      '#options' => array (
          'isgri_image' => 'Image',
          'isgri_spectrum' => 'Spectrum',
          'isgri_lc' => 'Light curve'
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
      '#description' => t ( "Minimum value is 20 seconds." ),
      '#default_value' => '1000',
      '#states' => array (
          'visible' => array (
              ':input[name="'.$mform_id.'product_type"]' => array (
                  'value' => 'isgri_lc'
              )
          ),
          'enabled' => array (
              ':input[name="'.$mform_id.'product_type"]' => array (
                  array (
                      'value' => 'isgri_lc'
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
      '#default_value' => 'sec',
      '#states' => array (
          'visible' => array (
              ':input[name="'.$mform_id.'product_type"]' => array (
                  'value' => 'isgri_lc'
              )
          ),
          'enabled' => array (
              ':input[name="'.$mform_id.'product_type"]' => array (
                  array (
                      'value' => 'isgri_lc'
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
  
//   $form ['image_scale_min'] = array (
//       '#type' => 'textfield',
//       '#title' => t ( "Significance Min" ),
//       '#description' => t ( "" ),
//       '#default_value' => '',
//       '#states' => array (
//           'visible' => array (
//               ':input[name="'.$mform_id.'product_type"]' => array (
//                   'value' => 'isgri_image'
//               )
//           ),
//           'enabled' => array (
//               ':input[name="'.$mform_id.'product_type"]' => array (
//                   array (
//                       'value' => 'isgri_image'
//                   )
//               )
//           )
//       ),
//       '#parent_classes' => array (
//           'form-group',
//           'col-md-6'
//       ),
//       '#label_classes' => array (
//           'control-label'
//       ),
//       '#attributes' => array (
//           'class' => array (
//               'form-control'
//           ),
//           'data-bv-numeric' => 'true'
//       ),
//       '#prefix' => '<div class="row">'
//   );
  
//   $form ['image_scale_max'] = array (
//       '#type' => 'textfield',
//       '#title' => t ( "Significance Max" ),
//       '#description' => t ( "" ),
//       '#default_value' => '',
//       '#states' => array (
//           'visible' => array (
//               ':input[name="'.$mform_id.'product_type"]' => array (
//                   'value' => 'isgri_image'
//               )
//           ),
//           'enabled' => array (
//               ':input[name="'.$mform_id.'product_type"]' => array (
//                   array (
//                       'value' => 'isgri_image'
//                   )
//               )
//           )
//       ),
//       '#parent_classes' => array (
//           'form-group',
//           'col-md-6'
//       ),
//       '#label_classes' => array (
//           'control-label'
//       ),
//       '#attributes' => array (
//           'class' => array (
//               'form-control'
//           ),
//           'data-bv-numeric' => 'true'
//       ),
//       '#suffix' => '</div>'
//   );
  
  $form ['user_catalog_file'] = array (
      '#type' => 'file',
      '#title' => t ( "User catalog" ),
      '#description' => t ( 'If needed, create a custom catalog following one of the templates : <a href="'.$module_path.'/data/catalog.txt" download>ASCII</a> or <a href="'.$module_path.'/data/catalog.fits" download>FITS</a>.'),
      '#attributes' => array (
          'name' => 'user_catalog_file'
      ),
      '#prefix' => '<hr class="hr-default" /><div class="row">',
      '#suffix' => '<div class="inline-user-catalog hidden"><a class="show-catalog" href="#" >Inline catalog</a><span class="fa fa-times remove-catolog"></span></div></div><hr class="hr-default" />',
      '#parent_classes' => array (
          'form-group',
          'col-md-8'
      ),
      '#label_classes' => array (
          'control-label'
      )
  );
  
  $form ['submit'] = array (
      '#type' => 'submit',
      '#value' => t ( 'Submit' ),
  );
  
  form_load_include ( $form_state, 'inc', 'astrooda', 'astrooda.isgri' );
  
   
  return ($form);
}
