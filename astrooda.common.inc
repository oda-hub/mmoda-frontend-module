<?php
/**
 * @file
 * Provides a block displaying prayer times for the visitor's location
 */

/**
 */
function astrooda_bug_report_form($form, &$form_state) {
  $form = array ();
  $form ['#tree'] = FALSE;
  $form ['#method'] = 'POST';

  $form ['message_type'] = array (
      '#type' => 'select',
      '#title' => t ( "Message type" ),
      '#options' => array (
          'feedback' => 'Feedback',
          'bugreport' => 'Bug report'
      )
  );
  $form ['name'] = array (
      '#type' => 'textfield',
      '#title' => t ( 'Name' ),
      '#attributes' => array (
          'placeholder' => t ( 'first and last name' )
      )
  );
  $form ['email'] = array (
      '#type' => 'emailfield',
      '#title' => t ( 'E-mail' ),
      '#required' => TRUE,
      '#attributes' => array (
          'placeholder' => t ( 'mail@example.com' )
      )
  );
  $form ['subject'] = array (
      '#type' => 'textfield',
      '#title' => t ( 'Subject' )
  );
  $form ['comment'] = array (
      '#type' => 'textarea',
      '#title' => t ( 'Comment' ),
      '#description' => t ( '' ),
      '#required' => TRUE
  );
  $form ['dispatcher_response'] = array (
      '#type' => 'hidden'
  );

  $form ['submit'] = array (
      '#type' => 'submit',
      '#value' => t ( 'Send' ),
      '#name' => 'send-feedback-button',
      '#ajax' => array (
          'callback' => 'process_user_feedback_callback',
          'wrapper' => 'feedback-messages',
          'method' => 'html',
          'effect' => 'fade',
          'progress' => array (
              'type' => 'throbber',
              'message' => '...'
          )
      ),
      '#attributes' => array (
          'class' => array (
              'btn-primary'
          )
      )
  );

  return ($form);
}

/**
 * Ajax callback function.
 */
function process_user_feedback_callback($form, &$form_state) {
  $selector = '#feedback-messages';
  $commands = array ();
  if (form_get_errors ()) {
    $error_messages_html = theme ( 'status_messages' );
    $commands [] = ajax_command_html ( $selector, $error_messages_html );
    $commands [] = array (
        'command' => 'enable_feedback_form'
    );
  } else {
    $astrooda_settings = variable_get ( 'astrooda_settings' );
    $support_email = $astrooda_settings ['support_email'];

    $from = $support_email [0];
    $to = implode ( ',', array_slice($support_email, 1) );
    $reply_to = $form_state ['values'] ['name'] . '<' . $form_state ['values'] ['email'] . '>';

    $message_type = $foldername = $form ['message_type'] ['#options'] [$form_state ['values'] ['message_type']];
    $subject = '[Astrooda ' . $message_type . ' ' . date ( 'Y-m-d\TH:i:s' ) . '] ' . $form_state ['values'] ['subject'];

    $dispatcher_response_filename = 'dispatcher_response_' . date ( 'Ymd\THis' ) . '.json';

    $body = 'Name : ' . $form_state ['values'] ['name'] . "\n";
    $body .= 'E-mail : ' . $form_state ['values'] ['email'] . "\n\n\n";
    $body .= "Comment :\n" . $form_state ['values'] ['comment'] . "\n\n\n\n\n\n";
    $body .= "Attached the last dispatcher response (a JSON): " .$dispatcher_response_filename. "\n";

    $attachment = array (
        'filecontent' => $form_state ['values'] ['dispatcher_response'],
        'filename' => $dispatcher_response_filename,
        'filemime' => 'application/json'
    );

    $params = array (
        'to' => $to,
        'from' => $from,
        'reply-to' => $reply_to,
        'subject' => $subject,
        'body' => $body,
        'attachment' => $attachment
    );

    drupal_mail ( 'astrooda', 'user_message', $to, language_default (), $params, $from );

    $commands [] = ajax_command_html ( $selector, '<div class="alert alert-block alert-dismissible alert-success">Your feedback has been successfully sent!</div>' );
    $commands [] = array (
        'command' => 'hide_feedback_form'
    );
  }
  return array (
      '#type' => 'ajax',
      '#commands' => $commands
  );
}

function astrooda_ask_token_form($form, &$form_state) {
  $form = array ();
  $form ['#tree'] = FALSE;
  $form ['#method'] = 'POST';

  $form ['name'] = array (
      '#type' => 'textfield',
      '#title' => t ( 'Name' ),
      '#required' => TRUE,
      '#attributes' => array (
          'placeholder' => t ( 'first and last name' )
      )
  );
  $form ['email'] = array (
      '#type' => 'emailfield',
      '#title' => t ( 'E-mail' ),
      '#required' => TRUE,
      '#attributes' => array (
          'placeholder' => t ( 'mail@example.com' )
      )
  );
  $form ['message'] = array (
      '#type' => 'textarea',
      '#title' => t ( 'Message' ),
      '#description' => t ( '' ),
      '#required' => TRUE
  );

  $form ['submit'] = array (
      '#type' => 'submit',
      '#value' => t ( 'Send' ),
      '#name' => 'ask-token-button',
      '#ajax' => array (
          'callback' => 'process_ask_token_callback',
          'wrapper' => 'token-messages',
          'method' => 'html',
          'effect' => 'fade',
          'progress' => array (
              'type' => 'throbber',
              'message' => '...'
          )
      ),
      '#attributes' => array (
          'class' => array (
              'btn-primary'
          )
      )
  );

  return ($form);
}

/**
 * Ajax callback function.
 */
function process_ask_token_callback($form, &$form_state) {
  $selector = '#token-messages';
  $commands = array ();
  if (form_get_errors ()) {
    $error_messages_html = theme ( 'status_messages' );
    $commands [] = ajax_command_html ( $selector, $error_messages_html );
    $commands [] = array (
        'command' => 'enable_token_form'
    );
  } else {
    $astrooda_settings = variable_get ( 'astrooda_settings' );
    $support_email = $astrooda_settings ['support_email'];

    $from = $support_email [0];
    $to = implode ( ',', array_slice($support_email,1) );
    $reply_to = $form_state ['values'] ['name'] . '<' . $form_state ['values'] ['email'] . '>';

    $message_type = $foldername = $form ['message_type'] ['#options'] [$form_state ['values'] ['message_type']];
    $subject = '[Astrooda API Token request] ' . $form_state ['values'] ['name'];

    $body = 'Name : ' . $form_state ['values'] ['name'] . "\n";
    $body .= 'E-mail : ' . $form_state ['values'] ['email'] . "\n\n\n";
    $body .= "Message :\n" . $form_state ['values'] ['message'] . "\n";

    $params = array (
        'to' => $to,
        'from' => $from,
        'reply-to' => $reply_to,
        'subject' => $subject,
        'body' => $body
    );

    drupal_mail ( 'astrooda', 'user_message', $to, language_default (), $params, $from );

    $commands [] = ajax_command_html ( $selector, '<div class="alert alert-block alert-dismissible alert-success">Your API token request has been successfully sent!</div>' );
    $commands [] = array (
        'command' => 'hide_ask_token_form'
    );
  }
  return array (
      '#type' => 'ajax',
      '#commands' => $commands
  );
}

/**
 * Implements hook_mail().
 */
function astrooda_mail($key, &$message, $params) {
//   $filename = '/tmp/momo/mail_params.php';
//   unlink($filename);

//   $f = fopen ( $filename, 'w' );
//   fwrite ( $f, "mail params:\n" );
//   fwrite ( $f, print_r ( $params, true ) );
//   fclose ( $f );
//   chmod ( $filename, 0777 );
  switch ($key) {
    case 'user_message' :
      $message ['to'] = $params ['to'];
      $message ['subject'] = $params ['subject'];
      $message ['body'] = array (
          $params ['body']
      );
      $message ['headers'] ['From'] = $params ['from'];
      $message ['headers'] ['Sender'] = $params ['from'];
      $message ['headers'] ['Reply-To'] = $params ['reply-to'];

      // Add attachment when available.
      if (isset ( $params ['attachment'] )) {
        $message ['params'] ['attachments'] [] = $params ['attachment'];
      }
      break;
  }
}

/**
 */
function astrooda_common($form, &$form_state) {
<<<<<<< HEAD
  drupal_get_messages ();

=======
>>>>>>> c10e998784be11db7deafc74a51e777aaa0cddbc
  $form = array ();
  $session_id = session_id ();

  $form ['#tree'] = FALSE;
  // turn off form caching
  // $form_state['no_cache'] = TRUE;
<<<<<<< HEAD

  // $form ['session_id'] = array (
  // '#type' => 'hidden',
  // '#value' => $session_id
  // );
=======
  
  $form ['session_id'] = array (
      '#type' => 'hidden',
      '#value' => $session_id
  );
>>>>>>> c10e998784be11db7deafc74a51e777aaa0cddbc
  // $form ['#action'] = '/dispatch-data/test';
  $form ['#method'] = 'POST';

  $astrooda_settings = variable_get ( 'astrooda_settings' );
  $instrument_defaults = $astrooda_settings ['common'];

  $form ['src_name'] = array (
      '#type' => 'textfield',
      '#title' => t ( "Object name" ),
      // '#description' => t ( "The right ascension." ),
      '#default_value' => $instrument_defaults ['src_name'],
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
<<<<<<< HEAD

  // $form ['use_resolver'] = array (
  // '#type' => 'checkboxes',
  // '#title' => t ( "Resolvers :" ),
  // //'#default_value' => '',
  // '#options' => array (
  // 'local' => 'Local',
  // 'sesame' => 'Sesame service',
  // ),
  // '#default_value' => array('local'),
  // '#parent_classes' => array (
  // 'form-group',
  // 'col-md-12'
  // ),
  // '#prefix' => '<div class="row">',
  // '#suffix' => '</div>'
  // );

=======
  
  $form ['use_resolver'] = array (
      '#type' => 'checkboxes',
      '#title' => t ( "Resolvers :" ),
      //'#default_value' => '',
      '#options' => array (
          'local' => 'Local',
          'sesame' => 'Sesame service',
      ),
     '#default_value' => array('local'),
      '#parent_classes' => array (
          'form-group',
          'col-md-12'
      ),
      '#prefix' => '<div class="row">',
      '#suffix' => '</div>'
  );
  
>>>>>>> c10e998784be11db7deafc74a51e777aaa0cddbc
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
      // 'data-bv-between' => 'true',
      // 'data-bv-between-min' => 0,
      // 'data-bv-between-max' => 360
       
  );

  $form ['radec'] ['DEC'] = array (
      '#type' => 'textfield',
      '#title' => t ( "Dec" ),
      '#description' => t ( "The declination." ),
      '#default_value' => $instrument_defaults ['DEC'],
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
      // 'data-bv-between' => 'true',
      // 'data-bv-between-min' => - 90,
      // 'data-bv-between-max' => 90
       
  );

  $form ['time'] = array (
      '#type' => 'item',
      '#prefix' => '<div class="row">',
      '#suffix' => '</div>'
  );
  $form ['time'] ['T1'] = array (
      '#type' => 'textfield',
      '#title' => t ( "Start time" ),
      '#default_value' => $instrument_defaults ['T1'],
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
      '#default_value' => $instrument_defaults ['T2'],
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
<<<<<<< HEAD
  );

  $form ['#validate'] = array (
      'astrooda_common_validate'
=======
>>>>>>> c10e998784be11db7deafc74a51e777aaa0cddbc
  );
  return ($form);
}
<<<<<<< HEAD
function astrooda_common_validate($form, &$form_state) {
  // error_log('Validating common form ');
  form_clear_error ();
}
function resolve_object_name_callback($form, &$form_state) {
  module_load_include ( 'inc', 'astrooda', 'astrooda.nameresolver' );

  $form ['radec'] ['RA'] ['#value'] = 50;
  $form ['radec'] ['DEC'] ['#value'] = 80;

  $args = resolve_object_name ( $form_state ['input'] ['src_name'], $form_state ['input'] ['use_resolver'] );

=======
function resolve_object_name_callback($form, &$form_state) {
  module_load_include ( 'inc', 'astrooda', 'astrooda.nameresolver' );
//   error_log ( 'Resolve callback !' );
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
  
  $args = resolve_object_name ( $form_state ['input'] ['src_name'],  $form_state ['input'] ['use_resolver']);
  
>>>>>>> c10e998784be11db7deafc74a51e777aaa0cddbc
  $commands [] = array (
      'command' => 'set_ra_dec', // the name of your javascript callback
      'args' => $args
  );
  return array (
      '#type' => 'ajax',
      '#commands' => $commands
  );
}

