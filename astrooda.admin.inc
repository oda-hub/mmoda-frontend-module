<?php

/**
 * @file
 * Provides a block displaying prayer times for the visitor's location
 */

/**
 * Implements hook_block_configure().
 */
// function astrooda_block_configure($delta = '') {
function astrooda_admin_settings($form, &$form_state, $no_js_use = FALSE) {
  $form = array ();

  $dailyPrayers = astrooda_prayer_hash ();
  $time_options = array (
      '24h' => t ( '24-hour time format, example 16:45' ),
      '12h' => t ( '12-hour time format, example 4:45 pm' ),
      '12hNS' => t ( '12-hour format with no suffix, example 4:45' ),
      'Float' => t ( 'Floating point number, example 16.75' )
  );

  $form ['#tree'] = TRUE;
  $form ['astrooda_header'] = array (
      '#type' => 'item',
      '#title' => '<h1>' . t ( 'Data Analysis Settings' ) . '</h1>',
      '#markup' => t ( 'All configuration parameters can be defined on this page.' )
  );

  $current_astrooda_general = variable_get ( 'astrooda_general', array (
      'name' => t ( "Lausanne" ),
      'latitude' => 46.5199617,
      'longitude' => 6.6335971,
      'time_format' => NULL,
      'timezone' => 'auto',
      'dst' => 'auto',
      'high_latitudes' => 'None',
      'adjust_hijriday' => '0'
  ) );

  $form ['astrooda_general'] = array (
      '#type' => 'fieldset',
      '#title' => t ( "General settings" ),
      '#collapsible' => TRUE,
      '#collapsed' => FALSE
  );

  $form ['astrooda_general'] ['name'] = array (
      '#type' => 'textfield',
      '#title' => t ( "Location name" ),
      '#description' => t ( "The name of the location, like a city or a town." ),
      '#default_value' => $current_astrooda_general ['name'],
      '#required' => TRUE,
      '#size' => 35,
      '#prefix' => '<div style="display: inline-block; width: 20em; vertical-align: top; padding-right: 3em;">',
      '#suffix' => '</div>'
  );
  $form ['astrooda_general'] ['latitude'] = array (
      '#type' => 'textfield',
      '#title' => t ( "Latitude" ),
      '#default_value' => $current_astrooda_general ['latitude'],
      '#required' => TRUE,
      '#size' => 20,
      '#prefix' => '<div style="display: inline-block; width: 15em; vertical-align: top; padding-right: 3em;">',
      '#suffix' => '</div>'
  );
  $form ['astrooda_general'] ['longitude'] = array (
      '#type' => 'textfield',
      '#title' => t ( "Longitude" ),
      '#default_value' => $current_astrooda_general ['longitude'],
      '#required' => TRUE,
      '#size' => 20,
      '#prefix' => '<div style="display: inline-block; width: 15em; vertical-align: top; padding-right: 3em;">',
      '#suffix' => '</div>'
  );

  $form ['astrooda_general'] ['time_format'] = array (
      '#type' => 'select',
      '#title' => t ( "Time format" ),
      '#description' => t ( "Select the time format to use for iPrayTimes" ),
      '#default_value' => $current_astrooda_general ['time_format'],
      '#options' => $time_options,
      '#prefix' => '<br><div style="display: inline-block; width: 20em; vertical-align: top; padding-right: 3em;">',
      '#suffix' => '</div>'
  );

  $form ['astrooda_general'] ['timezone'] = array (
      '#type' => 'select',
      '#title' => t ( "Time zone" ),

      // '#field_suffix' => t('(including daylight saving)'),
      '#options' => array (
          'auto' => 'Auto-detect'
      ) + astrooda_initTimeZoneList ( $selectedOption ),
      '#default_value' => $current_astrooda_general ['timezone'],
      '#prefix' => '<div style="display: inline-block; width: auto; vertical-align: top; padding-right: 3em;">',
      '#suffix' => '</div>'
  );

  $form ['astrooda_general'] ['dst'] = array (
      '#type' => 'select',
      '#title' => t ( "Day saving time" ),
      '#options' => array (
          'auto' => 'Auto-detect',
          '1' => 'On',
          '0' => 'Off'
      ),
      '#default_value' => $current_astrooda_general ['dst'],
      '#prefix' => '<div style="display: inline-block; width: auto; vertical-align: top; padding-right: 3em;">',
      '#suffix' => '</div>'
  );

  $form ['astrooda_general'] ['high_latitudes'] = array (
      '#type' => 'select',
      '#title' => t ( "High latitudes method" ),
      '#options' => array (
          'None' => 'No adjustments',
          'NightMiddle' => 'The middle of the night method',
          'OneSeventh' => 'The 1/7th of the night method',
          'AngleBased' => 'The angle-based method (recommended)'
      ),
      '#default_value' => $current_astrooda_general ['high_latitudes']
  );

  for($i = - 5; $i <= 5; $i ++) {
    $adjust_hijriday_values [$i] = $i;
  }
  $form ['astrooda_general'] ['adjust_hijriday'] = array (
      '#type' => 'select',
      '#title' => t ( "Hijri date adjustment" ),
      '#options' => $adjust_hijriday_values,
      '#default_value' => $current_astrooda_general ['adjust_hijriday']
  );

  $current_astrooda_calculation = variable_get ( 'astrooda_calculation', array (
      'method' => Null,
      'fajr' => Null,
      'maghrib' => array (
          'value' => Null,
          'unit' => Null
      ),
      'isha' => array (
          'value' => Null,
          'unit' => Null
      ),
      'dhuhr' => Null,
      'asr_method' => '1'
  ) );
  $form ['astrooda_calculation'] = array (
      '#type' => 'fieldset',
      '#title' => t ( "Calculation settings" ),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE
  );

  $form ['astrooda_calculation'] ['method'] = array (
      '#type' => 'select',
      '#title' => t ( "Calculation method" ),
      '#description' => t ( "The default calculation method to use" ),
      '#default_value' => $current_astrooda_calculation ['method'],
      '#options' => array (
          'MWL' => t ( 'Muslim World League' ),
          'ISNA' => t ( 'Islamic Society of North America' ),
          'Egypt' => t ( 'Egyptian General Authority of Survey' ),
          'Makkah' => t ( 'Umm al-Qura University, Makkah' ),
          'Karachi' => t ( 'University of Islamic Sciences, Karachi' ),
          'Tehran' => t ( 'Institute of Geophysics, University of Tehran' ),
          'Jafari' => t ( 'Shia Ithna Ashari (Jaafari)' ),
          'Custom' => t ( 'Custom Settings' )
      )
  );
  $form ['astrooda_calculation'] ['fajr'] = array (
      '#field_suffix' => t ( 'degrees' ),
      '#type' => 'textfield',
      '#size' => 5,
      '#maxlength' => 5,
      '#title' => t ( "Fajr" ),
      '#description' => t ( "Fajr twilight angle" ),
      '#default_value' => $current_astrooda_calculation ['fajr'],
      '#prefix' => '<div style="display: inline-block; width: auto; vertical-align: top; padding-right: 3em;">',
      '#suffix' => '</div>'
  );
  $form ['astrooda_calculation'] ['dhuhr'] = array (
      '#field_suffix' => t ( 'minutes after mid-day' ),
      '#type' => 'textfield',
      '#size' => 5,
      '#maxlength' => 5,
      '#title' => t ( "Dhuhr" ),
      '#default_value' => $current_astrooda_calculation ['dhuhr'],
      '#prefix' => '<div style="display: inline-block; width: auto; vertical-align: top; padding-right: 3em;">',
      '#suffix' => '</div>'
  );
  $form ['astrooda_calculation'] ['asr_method'] = array (
      '#type' => 'radios',
      '#title' => t ( "Asr method" ),
      '#description' => t ( "The calculation method for the Asr prayer" ),
      '#default_value' => $current_astrooda_calculation ['asr_method'],
      '#options' => array (
          '1' => t ( 'Shafii, Maliki, Jafari and Hanbali (shadow factor = 1)' ),
          '2' => t ( 'Hanafi school of tought (shadow factor = 2)' )
      ),
      '#prefix' => '<div style="display: inline-block; width: auto; vertical-align: top; padding-right: 3em;">',
      '#suffix' => '</div>'
  );
  $form ['astrooda_calculation'] ['maghrib'] = array (
      '#type' => 'fieldset',
      '#title' => t ( "Maghrib" ),
      '#attributes' => array (
          'style' => 'display: inline-block; width: 16em; vertical-align: top;'
      )
  );
  $form ['astrooda_calculation'] ['maghrib'] ['value'] = array (
      '#type' => 'textfield',
      '#size' => 5,
      '#maxlength' => 5,
      '#default_value' => $current_astrooda_calculation ['maghrib'] ['value']
  );

  $form ['astrooda_calculation'] ['maghrib'] ['unit'] = array (
      '#type' => 'radios',
      '#default_value' => $current_astrooda_calculation ['maghrib'] ['unit'],
      '#options' => array (
          0 => t ( 'degrees' ),
          1 => t ( 'minutes after sunset' )
      )
  );
  $form ['astrooda_calculation'] ['isha'] = array (
      '#type' => 'fieldset',
      '#title' => t ( "Isha" ),
      '#attributes' => array (
          'style' => 'display: inline-block; width: 16em; vertical-align: top;'
      )
  );
  $form ['astrooda_calculation'] ['isha'] ['value'] = array (
      '#type' => 'textfield',
      '#size' => 5,
      '#maxlength' => 5,
      '#default_value' => $current_astrooda_calculation ['isha'] ['value']
  );

  $form ['astrooda_calculation'] ['isha'] ['unit'] = array (
      '#type' => 'radios',
      '#default_value' => $current_astrooda_calculation ['isha'] ['unit'],
      '#options' => array (
          0 => t ( 'degrees' ),
          1 => t ( 'minutes after sunset' )
      )
  );

  $current_astrooda_jamaa = variable_get ( 'astrooda_jamaa' );

  $form ['astrooda_jamaa'] = array (
      '#type' => 'fieldset',
      '#title' => t ( "Jamaa times settings" ),
      '#collapsible' => TRUE,
      '#collapsed' => FALSE
  );

  $form ['astrooda_jamaa'] ['show_jamaa'] = array (
      '#type' => 'checkbox',
      '#title' => t ( 'Show jamaa times' ),
      '#default_value' => (isset ( $current_astrooda_jamaa ['show_jamaa'] ) ? $current_astrooda_jamaa ['show_jamaa'] : 0)
  );

  foreach ( $dailyPrayers as $key => $value ) {
    $form ['astrooda_jamaa'] [$key] = array (
        '#type' => 'fieldset',
        '#title' => $value,
        '#collapsible' => TRUE,
        '#collapsed' => FALSE,
        '#attributes' => array (
            'style' => 'display: inline-block; width: 16em; vertical-align: top;'
        ),
        '#states' => array (
            'visible' => array ( // action to take.
                ':input[name="astrooda_jamaa[show_jamaa]"]' => array (
                    'checked' => TRUE
                )
            )
        )
    );
    $form ['astrooda_jamaa'] [$key] ['time_or_delta'] = array (
        '#type' => 'radios',
        '#default_value' => (isset ( $current_astrooda_jamaa [$key] ['time_or_delta'] ) ? $current_astrooda_jamaa [$key] ['time_or_delta'] : 0),
        '#options' => array (
            '0' => t ( 'Specific time' ),
            '1' => t ( 'Additional time' )
        )
    );

    $form ['astrooda_jamaa'] [$key] ['time'] = array (

        // '#type' => 'textfield',
        '#type' => 'date_popup',
        '#date_label_position' => '',
        '#date_format' => 'H:i',
        '#default_value' => (isset ( $current_astrooda_jamaa [$key] ['time'] ) ? '2000-01-01 ' . $current_astrooda_jamaa [$key] ['time'] . ':00' : ''),
        '#states' => array (
            'visible' => array ( // action to take.
                ':input[name="astrooda_jamaa[' . $key . '][time_or_delta]"]' => array (
                    'value' => 0
                )
            )
        )
    );
    $form ['astrooda_jamaa'] [$key] ['delta'] = array (
        '#type' => 'select',
        '#date_label_position' => '',
        '#default_value' => (isset ( $current_astrooda_jamaa [$key] ['delta'] ) ? $current_astrooda_jamaa [$key] ['delta'] : '05'),
        '#options' => array (
            '05' => '05',
            '10' => '10',
            '15' => '15',
            '20' => '20',
            '25' => '25',
            '30' => '30'
        ),
        '#states' => array (
            'visible' => array ( // action to take.
                ':input[name="astrooda_jamaa[' . $key . '][time_or_delta]"]' => array (
                    'value' => 1
                )
            )
        )
    );
  }

  $current_astrooda_adjust_times = variable_get ( 'astrooda_adjust_times' );

  $form ['astrooda_adjust_times'] = array (
      '#type' => 'fieldset',
      '#title' => t ( "Times adjustment" ),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#description' => t ( "You can further tune calculated prayer times using a specific negative or positive offset for each prayer time." )
  );

  foreach ( $dailyPrayers as $key => $value ) {
    $form ['astrooda_adjust_times'] [$key] = array (
        '#field_suffix' => t ( 'minutes' ),
        '#type' => 'textfield',
        '#size' => 5,
        '#maxlength' => 5,
        '#title' => $value,

        // '#attributes' => array ('style' => 'display: inline-block; width: 12em'),
        '#prefix' => '<div style="float: left; width: 12em;">',
        '#suffix' => '</div>',
        '#default_value' => (isset ( $current_astrooda_adjust_times [$key] ) ? $current_astrooda_adjust_times [$key] : '')
    );
  }

  $current_astrooda_monthlypdf = variable_get ( 'astrooda_monthlypdf', NULL );
  $form ['astrooda_monthlypdf'] = array (
      '#type' => 'fieldset',
      '#title' => t ( "Monthly table PDF settings" ),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,

      // Set up the wrapper so that AJAX will be able to replace the fieldset.
      '#prefix' => '<div id="astrooda-monthlypdf-wrapper">',
      '#suffix' => '</div>'
  );

  $form ['astrooda_monthlypdf'] ['header'] = array (
      '#type' => 'text_format',
      '#base_type' => 'textarea',
      '#format' => (isset ( $current_astrooda_monthlypdf ['header'] )) ? $current_astrooda_monthlypdf ['header'] ['format'] : 'filtered_html',
      '#default_value' => (isset ( $current_astrooda_monthlypdf ['header'] )) ? $current_astrooda_monthlypdf ['header'] ['value'] : null,
      '#required' => FALSE,
      '#title' => t ( 'Header' ),
      '#token_insert' => TRUE
  );

  if (module_exists ( 'token' )) {
    $form ['astrooda_monthlypdf'] ['header'] ['token_help'] = array (
        '#theme' => 'token_tree',
        '#token_types' => array (
            'site'
        )
    );
  }

  $form ['astrooda_monthlypdf'] ['title'] = array (
      '#type' => 'text_format',
      '#base_type' => 'textarea',
      '#format' => (isset ( $current_astrooda_monthlypdf ['title'] )) ? $current_astrooda_monthlypdf ['title'] ['format'] : 'filtered_html',
      '#default_value' => (isset ( $current_astrooda_monthlypdf ['title'] )) ? $current_astrooda_monthlypdf ['title'] ['value'] : null,
      '#required' => FALSE,
      '#title' => t ( 'Title' ),
      '#token_insert' => TRUE
  );
  /*
   * if (module_exists('token')) {
   * $form['astrooda_monthlypdf']['title']['token_help'] = array(
   * '#theme' => 'token_tree',
   * '#token_types' => array('astrooda'),
   * );
   * }
   */
  $form ['astrooda_monthlypdf'] ['footer'] = array (
      '#type' => 'text_format',
      '#base_type' => 'textarea',
      '#format' => (isset ( $current_astrooda_monthlypdf ['footer'] )) ? $current_astrooda_monthlypdf ['footer'] ['format'] : 'filtered_html',
      '#default_value' => (isset ( $current_astrooda_monthlypdf ['footer'] )) ? $current_astrooda_monthlypdf ['footer'] ['value'] : null,
      '#required' => FALSE,

      // '#date_label_position' => 'within',
      '#title' => t ( 'Footer' )
  );

  // Build the fieldset with the proper number of names. We'll use
  // $form_state['num_months'] to determine the number of textfields to build.
  $num_months = 0;

  if (isset ( $current_astrooda_monthlypdf ) and isset ( $current_astrooda_monthlypdf ['months'] ))
    $num_months = count ( $current_astrooda_monthlypdf ['months'] );
  if (! isset ( $form_state ['num_months'] ) && $num_months > 0) {
    $form_state ['num_months'] = $num_months;
  } else if (! isset ( $form_state ['num_months'] )) {
    $form_state ['num_months'] = 0;
  }

  for($i = 0; $i < $form_state ['num_months']; $i ++) {
    $theMonth = '';
    if (isset ( $form_state ['input'] ['astrooda_monthlypdf'] ['months'] [$i] ) and $i < $form_state ['num_months'] - 1) {
      if ($form_state ['input'] ['astrooda_monthlypdf'] ['months'] [$i] ['month'] ['month'] > 0)
        $theMonth = sprintf ( "%02d", $form_state ['input'] ['astrooda_monthlypdf'] ['months'] [$i] ['month'] ['month'] );
    } else if (! isset ( $form_state ['input'] ['astrooda_monthlypdf'] ['months'] [$i] ) and isset ( $current_astrooda_monthlypdf ['months'] [$i] ))
      $theMonth = $current_astrooda_monthlypdf ['months'] [$i] ['month'];

    $theMonthName = '';
    if (! empty ( $theMonth )) {
      $theMonthName = date ( "F", mktime ( 0, 0, 0, $theMonth, 10, 2000 ) );
    }

    $default_month = (isset ( $current_astrooda_monthlypdf ['months'] [$i] ['month'] )) ? $current_astrooda_monthlypdf ['months'] [$i] ['month'] : '01';
    $default_month = '2000-' . $default_month . '-01';

    $form ['astrooda_monthlypdf'] ['months'] [$i] = array (
        '#type' => 'fieldset',
        '#title' => t ( 'Timetable page bottom content for the month: ' ) . t ( $theMonthName ),
        '#collapsible' => TRUE,
        '#collapsed' => TRUE
    );
    $form ['astrooda_monthlypdf'] ['months'] [$i] ['#weight'] = 15;
    if ($theMonth != '')
      $form ['astrooda_monthlypdf'] ['months'] [$i] ['#weight'] = intval ( $theMonth );

    $form ['astrooda_monthlypdf'] ['months'] [$i] ['month'] = array (
        '#type' => 'date_select',
        '#date_format' => 'F',
        '#required' => TRUE,
        '#date_label_position' => '',
        '#title_display' => 'invisible',
        '#default_value' => $default_month
    );

    $form ['astrooda_monthlypdf'] ['months'] [$i] ['page_bottom'] = array (
        '#type' => 'text_format',
        '#format' => (isset ( $current_astrooda_monthlypdf ['months'] [$i] )) ? $current_astrooda_monthlypdf ['months'] [$i] ['page_bottom'] ['format'] : 'filtered_html',
        '#default_value' => (isset ( $current_astrooda_monthlypdf ['months'] [$i] )) ? $current_astrooda_monthlypdf ['months'] [$i] ['page_bottom'] ['value'] : null,
        '#required' => TRUE,

        // '#date_label_position' => 'within',
        '#title' => t ( 'Content' )
    );

    $form ['astrooda_monthlypdf'] ['months'] [$i] ['remove_month'] = array (
        '#type' => 'submit',
        '#ipt-m-index' => $i,
        '#name' => 'month-' . $i,
        '#value' => t ( 'Delete' ),
        '#submit' => array (
            'astrooda_pdf_remove_month'
        ),
        '#limit_validation_errors' => array (), // No validation.
        '#ajax' => array (
            'callback' => 'astrooda_monthlypdf_callback',
            'wrapper' => 'astrooda-monthlypdf-wrapper'
        )
    // '#attributes' => array('class' => array('ui-icon', 'ui-icon-closethick'))
    );

  }

  if ($form_state ['num_months'] < 12)
    $form ['astrooda_monthlypdf'] ['add_month'] = array (
        '#type' => 'submit',
        '#value' => t ( 'Add a page bottom for a specific month' ),
        '#submit' => array (
            'astrooda_pdf_add_month'
        ),

        // See the examples in ajax_example.module for more details on the
        // properties of #ajax.
        '#ajax' => array (
            'callback' => 'astrooda_monthlypdf_callback',
            'wrapper' => 'astrooda-monthlypdf-wrapper',
            'method' => 'replace',
            'effect' => 'slide'
        )
    );
  $form ['#validate'] [] = 'onyly_one_page_bottom_per_month';
  $form ['#submit'] [] = 'astrooda_monthlypdf_submit';

  if ($no_js_use) {
    // Remove the #ajax from the above, so ajax.js won't be loaded.
    if (! empty ( $form ['astrooda_monthlypdf'] ['remove_name'] ['#ajax'] )) {
      unset ( $form ['astrooda_monthlypdf'] ['remove_name'] ['#ajax'] );
    }
    unset ( $form ['astrooda_monthlypdf'] ['add_month'] ['#ajax'] );
  }

  return system_settings_form ( $form );
}

function astrooda_monthlypdf_submit($form, &$form_state) {
}

function onyly_one_page_bottom_per_month($form, &$form_state) {
  for($i = 0; $i < $form_state ['num_months'] - 1; $i ++)
    for($j = $i + 1; $j < $form_state ['num_months']; $j ++)
      if ($form_state ['values'] ['astrooda_monthlypdf'] ['months'] [$i] ['month'] == $form_state ['values'] ['astrooda_monthlypdf'] ['months'] [$j] ['month']) {
        $themonth = date ( "F", mktime ( 0, 0, 0, $form_state ['values'] ['astrooda_monthlypdf'] ['months'] [$i] ['month'], 10, 2000 ) );
        form_error ( $form ['astrooda_monthlypdf'] ['months'] [$i] ['month'], t ( 'Duplicated page bottom for the same month : ' ) . t ( $themonth ) );
        form_error ( $form ['astrooda_monthlypdf'] ['months'] [$j] ['month'] );
      }
}

function astrooda_pdf_add_month($form, &$form_state) {
  $form_state ['num_months'] ++;
  $form_state ['rebuild'] = TRUE;
}

function astrooda_pdf_remove_month($form, &$form_state) {
  $layerid_delete = $form_state ['clicked_button'] ['#ipt-m-index'];

  if ($form_state ['num_months'] > 0) {
    for($i = $layerid_delete; $i < $form_state ['num_months'] - 1; $i ++) {
      $form_state ['input'] ['astrooda_monthlypdf'] ['months'] [$i] = $form_state ['input'] ['astrooda_monthlypdf'] ['months'] [$i + 1];
      $form_state ['values'] ['astrooda_monthlypdf'] ['months'] [$i] = $form_state ['values'] ['astrooda_monthlypdf'] ['months'] [$i + 1];
    }
  }

  $form_state ['num_months'] --;
  unset ( $form_state ['input'] ['astrooda_monthlypdf'] ['months'] [$form_state ['num_months']] );
  unset ( $form_state ['values'] ['astrooda_monthlypdf'] ['months'] [$form_state ['num_months']] );

  $form_state ['rebuild'] = TRUE;
}

function astrooda_monthlypdf_callback($form, $form_state) {
  return $form ['astrooda_monthlypdf'];
}

