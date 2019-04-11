<?php

/**
 * @file
 * Provides a block displaying prayer times for the visitor's location
 */

/**
 */
function astrooda_common($form, &$form_state) {
  drupal_get_messages();

  $form = array ();
  $session_id = session_id ();

  $form ['#tree'] = FALSE;
  // turn off form caching
  // $form_state['no_cache'] = TRUE;

//   $form ['session_id'] = array (
//       '#type' => 'hidden',
//       '#value' => $session_id
//   );
  // $form ['#action'] = '/dispatch-data/test';
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
      '#type' => 'button',
      '#button_type' => 'button',
      '#name' => 'resolve_name',
      '#value' => t ( "Resolve" ),
      '#attributes' => array (
          'class' => array (
              'btn-primary',
              'form-item'
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

//   $form ['use_resolver'] = array (
//       '#type' => 'checkboxes',
//       '#title' => t ( "Resolvers :" ),
//       //'#default_value' => '',
//       '#options' => array (
//           'local' => 'Local',
//           'sesame' => 'Sesame service',
//       ),
//      '#default_value' => array('local'),
//       '#parent_classes' => array (
//           'form-group',
//           'col-md-12'
//       ),
//       '#prefix' => '<div class="row">',
//       '#suffix' => '</div>'
//   );

  $form ['radec'] = array (
      '#type' => 'item',
      '#prefix' => '<div class="row">',
      '#suffix' => '</div>'
  );

  $form ['radec'] ['RA'] = array (
      '#type' => 'textfield',
      '#title' => t ( "RA" ),
      '#description' => t ( "The right ascension." ),
      '#default_value' => '257.815417',
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
          )
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
          )
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
      '#default_value' => 'iso',
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
      )
  );

  //form_load_include ( $form_state, 'inc', 'astrooda', 'astrooda.common' );
  $form['#validate'] = array('astrooda_common_validate');
  return ($form);
}

function astrooda_common_validate ($form, &$form_state) {
  error_log('Validating common form ');
  form_clear_error();
}

function resolve_object_name_callback($form, &$form_state) {
  module_load_include ( 'inc', 'astrooda', 'astrooda.nameresolver' );

  $form ['radec'] ['RA'] ['#value'] = 50;
  $form ['radec'] ['DEC'] ['#value'] = 80;

  $args = resolve_object_name ( $form_state ['input'] ['src_name'],  $form_state ['input'] ['use_resolver']);

  $commands [] = array (
      'command' => 'set_ra_dec', // the name of your javascript callback
      'args' => $args
  );
  return array (
      '#type' => 'ajax',
      '#commands' => $commands
  );
}

