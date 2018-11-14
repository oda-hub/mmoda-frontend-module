<?php

/**
 * @file
 * Provides a block displaying prayer times for the visitor's location
 */

/**
 */
function astrooda_common($form, &$form_state) {
  
  $form = array ();
  $session_id = session_id ();
  
  $form ['#tree'] = FALSE;
  //turn off form caching
  //$form_state['no_cache'] = TRUE;
      
  $form ['session_id'] = array (
      '#type' => 'hidden',
      '#value' => $session_id
  );
//   $form ['#action'] = '/dispatch-data/test';
  $form ['#method'] = 'POST';
  
  $astrooda_settings = variable_get('astrooda_settings');
  $instrument_defaults= $astrooda_settings['common'];
  
  $form ['src_name'] = array (
      '#type' => 'textfield',
      '#title' => t ( "Object name" ),
      // '#description' => t ( "The right ascension." ),
      '#default_value' => $instrument_defaults['src_name'],
      '#required' => TRUE,
      '#parent_classes' => array (
          'form-group',
          ''
      ),
      '#label_classes' => array (
          'control-label'
      ),
      '#attributes' => array (
          'class' => array (
              'form-control'
          )
      ),
      // 'data-validate' => 'false'
      '#prefix' => '<div class="row"><div class="col-md-12"><div class="input-group form-item">'
  );
  
  $form ['resolve_src_name'] = array (
      '#type' => 'submit',
      '#name' => 'resolve_name',
      '#value' => t ( "Resolve" ),
      '#attributes' => array (
          'class' => array (
              'btn-primary', 'form-item'
          )
      ),
      '#ajax' => array (
          'callback' => 'resolve_object_name_callback',
          'progress' => array (
              'type' => 'throbber',
              'message' => '...'
          )
      ),
      // 'message' => t ( 'Resolving name using ').'<a href="http://cds.u-strasbg.fr/cgi-bin/Sesame" target="_blank">Sesame</a>'.t(' respectively NED, Simbad and VizieR...' )
      
      '#prefix' => '<span id="resolve-src-name" class="input-group-btn form-group align-bottom">',
      '#suffix' => '</span></div></div></div>'
  );
  
  $form ['radec'] = array (
      '#type' => 'item',
      '#prefix' => '<div class="row">',
      '#suffix' => '</div>'
  );
  
  $form ['radec'] ['RA'] = array (
      '#type' => 'textfield',
      '#title' => t ( "RA" ),
      '#description' => t ( "The right ascension." ),
      '#default_value' => $instrument_defaults['RA'],
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
//           'data-bv-between' => 'true',
//           'data-bv-between-min' => 0,
//           'data-bv-between-max' => 360
      )
  );
  
  $form ['radec'] ['DEC'] = array (
      '#type' => 'textfield',
      '#title' => t ( "Dec" ),
      '#description' => t ( "The declination." ),
      '#default_value' => $instrument_defaults['DEC'],
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
//           'data-bv-between' => 'true',
//           'data-bv-between-min' => - 90,
//           'data-bv-between-max' => 90
      )
  );
  
  $form ['time'] = array (
      '#type' => 'item',
      '#prefix' => '<div class="row">',
      '#suffix' => '</div>'
  );
  $form ['time'] ['T1'] = array (
      '#type' => 'textfield',
      '#title' => t ( "Start time" ),
      '#default_value' => $instrument_defaults['T1'],
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
          )
      ),
      '#states' => array (
          'enabled' => array (
              ':input[name="use_scws"]' => array (
                  array (
                      'value' => 'no'
                  )
              )
          )
      )
  );
  
  $form ['time'] ['T2'] = array (
      '#type' => 'textfield',
      '#title' => t ( "End time" ),
      '#default_value' => $instrument_defaults['T2'],
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
          )
      ),
      '#states' => array (
          'enabled' => array (
              ':input[name="use_scws"]' => array (
                  array (
                      'value' => 'no'
                  )
              )
          )
      )
  );
  
  $form ['time'] ['T_format'] = array (
      '#type' => 'select',
      '#title' => t ( "Time unit" ),
      '#options' => array (
          'isot' => 'ISO/ISOT',
          'mjd' => 'MJD'
      ),
      '#default_value' => $instrument_defaults['T_format'],
      '#parent_classes' => array (
          'form-group',
          'col-md-2'
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
          'enabled' => array (
              ':input[name="use_scws"]' => array (
                  array (
                      'value' => 'no'
                  )
              )
          )
      ),
  );
  form_load_include ( $form_state, 'inc', 'astrooda', 'astrooda.common' );
  
  return ($form);
}

function resolve_object_name_callback($form, &$form_state) {
  module_load_include ( 'inc', 'astrooda', 'astrooda.nameresolver' );
  error_log('Resolve callback !');
  //   $filename = '/tmp/form_state.txt';
  //   $f = fopen ( $filename, 'w' );
  //   fwrite ( $f, "form_state\n" );
  //   fwrite ( $f, print_r ( $form_state ['input'], true ) );
  //   fclose ( $f );
  //   chmod ( $filename, 0777 );

  $form ['radec'] ['RA'] ['#value'] = 50;
  $form ['radec'] ['DEC'] ['#value'] = 80;
  // $commands = array();

  // $args= [ 'ra' => 67,
  // 'dec' => 88
  // ];

  $args = resolve_object_name ( $form_state ['input'] ['src_name'] );

  $commands [] = array (
      'command' => 'set_ra_dec', // the name of your javascript callback
      'args' => $args
  );
  // $commands[] = ajax_command_data('.form-item-RA input.form-control', 'value', 70);
  // $commands[] = ajax_command_data(".form-item-DEC input.form-control", 'value', 45);
  return array (
      '#type' => 'ajax',
      '#commands' => $commands
  );
}

