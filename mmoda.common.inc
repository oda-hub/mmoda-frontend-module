<?php

/**
 * @file
 * Provides a block displaying prayer times for the visitor's location
 */

/**
 */
function mmoda_bug_report_form($form, &$form_state)
{
  $form = array();
  $form['#tree'] = FALSE;
  $form['#method'] = 'POST';

  $form['message_type'] = array(
    '#type' => 'select',
    '#title' => t("Message type"),
    '#options' => array(
      'feedback' => 'Feedback',
      'bugreport' => 'Bug report'
    )
  );
  $form['name'] = array(
    '#type' => 'textfield',
    '#title' => t('Name'),
    '#attributes' => array(
      'placeholder' => t('first and last name')
    )
  );
  $form['email'] = array(
    '#type' => 'emailfield',
    '#title' => t('E-mail'),
    '#required' => TRUE,
    '#attributes' => array(
      'placeholder' => t('mail@example.com')
    )
  );
  $form['subject'] = array(
    '#type' => 'textfield',
    '#title' => t('Subject')
  );
  $form['comment'] = array(
    '#type' => 'textarea',
    '#title' => t('Comment'),
    '#description' => t(''),
    '#required' => TRUE
  );
  $form['dispatcher_response'] = array(
    '#type' => 'hidden'
  );

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Send'),
    '#name' => 'send-feedback-button',
    '#ajax' => array(
      'callback' => 'process_user_feedback_callback',
      'wrapper' => 'feedback-messages',
      'method' => 'html',
      'effect' => 'fade',
      'progress' => array(
        'type' => 'throbber',
        'message' => '...'
      )
    ),
    '#attributes' => array(
      'class' => array(
        'btn-primary'
      )
    )
  );

  return theme($form);
}

/**
 * Ajax callback function.
 */
function process_user_feedback_callback($form, &$form_state)
{
  $selector = '#feedback-messages';
  $commands = array();
  if (form_get_errors()) {
    $error_messages_html = theme('status_messages');
    $commands[] = ajax_command_html($selector, $error_messages_html);
    $commands[] = array(
      'command' => 'enable_feedback_form'
    );
  } else {
    $mmoda_settings = variable_get('mmoda_settings');
    $support_email = $mmoda_settings['support_email'];

    $from = $support_email[0];
    $to = implode(',', array_slice($support_email, 1));
    $reply_to = $form_state['values']['name'] . '<' . $form_state['values']['email'] . '>';

    $message_type = $form['message_type']['#options'][$form_state['values']['message_type']];
    $subject = '[MMODA ' . $message_type . ' ' . date('Y-m-d\TH:i:s') . '] ' . $form_state['values']['subject'];

    $dispatcher_response_filename = 'dispatcher_response_' . date('Ymd\THis') . '.json';

    $body = 'Name : ' . $form_state['values']['name'] . "\n";
    $body .= 'E-mail : ' . $form_state['values']['email'] . "\n\n\n";
    $body .= "Comment :\n" . $form_state['values']['comment'] . "\n\n\n\n\n\n";
    $body .= "Attached the last dispatcher response (a JSON): " . $dispatcher_response_filename . "\n";

    $attachment = array(
      'filecontent' => $form_state['values']['dispatcher_response'],
      'filename' => $dispatcher_response_filename,
      'filemime' => 'application/json'
    );

    $params = array(
      'to' => $to,
      'from' => $from,
      'reply-to' => $reply_to,
      'subject' => $subject,
      'body' => $body,
      'attachment' => $attachment
    );

    drupal_mail('mmoda', 'user_message', $to, language_default(), $params, $from, true);

    $commands[] = ajax_command_html($selector, '<div class="alert alert-block alert-dismissible alert-success">Your feedback has been successfully sent!</div>');
    $commands[] = array(
      'command' => 'hide_feedback_form'
    );
  }
  return array(
    '#type' => 'ajax',
    '#commands' => $commands
  );
}

/**
 * Implements hook_mail().
 */
function mmoda_mail($key, &$message, $params)
{
  switch ($key) {
    case 'user_message':
      $message['to'] = $params['to'];
      $message['subject'] = $params['subject'];
      $message['body'] = array(
        $params['body']
      );
      $message['headers']['From'] = $params['from'];
      $message['headers']['Sender'] = $params['from'];
      $message['headers']['Reply-To'] = $params['reply-to'];

      // Add attachment when available.
      if (isset($params['attachment'])) {
        $message['params']['attachments'][] = $params['attachment'];
      }
      break;
  }
}

/**
 */
function mmoda_name_resolve($form, &$form_state)
{
  $form = array();
  $form['#tree'] = FALSE;
  $form['#method'] = 'POST';

  $mmoda_settings = variable_get('mmoda_settings');
  $instrument_defaults = $mmoda_settings['common'];

  $form['src_name'] = array(
    '#type' => 'textfield',
    '#title' => t("Object name"),
    '#default_value' => $instrument_defaults['src_name'],
    '#required' => TRUE,
    '#parent_classes' => array(
      'form-group',
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#attributes' => array(
      'class' => array(
        'form-control'
      )
    ),
    '#prefix' => '<div class="row"><div class="col-md-12"><div class="input-group form-item">'
  );

  $form['resolve_src_name'] = array(
    '#type' => 'button',
    '#button_type' => 'button',
    '#name' => 'resolve_name',
    '#value' => t("Resolve"),
    '#attributes' => array(
      'class' => array(
        'btn-primary',
        'form-item'
      )
    ),
    '#ajax' => array(
      'callback' => 'resolve_object_name_callback',
      'progress' => array(
        'type' => 'throbber',
        'message' => '...'
      )
    ),
    '#states' => array(
      'enabled' => array(
        ':input[name="src_name"]' => ['filled' => TRUE]
      )
    ),
    '#prefix' => '<span id="resolve-src-name" class="input-group-btn-hide form-group align-bottom">',
  );

  $form['explore_src_name'] = array(
    '#type' => 'button',
    '#button_type' => 'button',
    '#name' => 'explore_name',
    '#value' => t("Explore"),
    '#attributes' => array(
      'class' => array(
        'btn-primary',
        'form-item'
      )
    ),
    '#ajax' => array(
      'callback' => 'explore_object_name_callback',
      'progress' => array(
        'type' => 'throbber',
        'message' => '...'
      )
    ),
    '#states' => array(
      'enabled' => array(
        ':input[name="src_name"]' => ['filled' => TRUE]
      )
    ),
    '#suffix' => '</span></div></div></div>'
  );

  return ($form);
}

/**
 */
function mmoda_common($form, &$form_state)
{
  $form = array();
  $form['#tree'] = FALSE;
  $form['#method'] = 'POST';

  $mmoda_settings = variable_get('mmoda_settings');
  $instrument_defaults = $mmoda_settings['common'];

  $form['radec'] = array(
    '#type' => 'item',
    '#prefix' => '<div class="row">',
    '#suffix' => '</div>'
  );

  $form['radec']['RA'] = array(
    '#type' => 'textfield',
    '#title' => t("RA"),
    '#description' => t("The right ascension."),
    '#default_value' => $instrument_defaults['RA'],
    '#required' => TRUE,
    '#size' => 10,
    '#parent_classes' => array(
      'form-group',
      'col-md-6'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#attributes' => array(
      'class' => array(
        'form-control'
      )
    )
  );

  $form['radec']['DEC'] = array(
    '#type' => 'textfield',
    '#title' => t("Dec"),
    '#description' => t("The declination."),
    '#default_value' => $instrument_defaults['DEC'],
    '#required' => TRUE,
    '#size' => 10,
    '#parent_classes' => array(
      'form-group',
      'col-md-6'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#attributes' => array(
      'class' => array(
        'form-control'
      )
    )
  );

  $form['time'] = array(
    '#type' => 'item',
    '#prefix' => '<div class="row">',
    '#suffix' => '</div>'
  );
  $form['time']['T1'] = array(
    '#type' => 'textfield',
    '#title' => t("Start time"),
    '#default_value' => $instrument_defaults['T1'],
    '#required' => TRUE,
    '#size' => 10,
    '#parent_classes' => array(
      'form-group',
      'col-md-5'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#attributes' => array(
      'class' => array(
        'form-control'
      )
    ),
    '#states' => array(
      'enabled' => array(
        ':input[name="use_scws"]' => array(
          array(
            'value' => 'no'
          )
        )
      )
    )
  );

  $form['time']['T2'] = array(
    '#type' => 'textfield',
    '#title' => t("End time"),
    '#default_value' => $instrument_defaults['T2'],
    '#required' => TRUE,
    '#size' => 10,
    '#parent_classes' => array(
      'form-group',
      'col-md-5'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#attributes' => array(
      'class' => array(
        'form-control'
      )
    ),
    '#states' => array(
      'enabled' => array(
        ':input[name="use_scws"]' => array(
          array(
            'value' => 'no'
          )
        )
      )
    )
  );

  $form['time']['T_format'] = array(
    '#type' => 'select',
    '#title' => t("Time unit"),
    '#options' => array(
      'isot' => 'ISO/ISOT',
      'mjd' => 'MJD'
    ),
    '#default_value' => 'iso',
    '#parent_classes' => array(
      'form-group',
      'col-md-2'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#attributes' => array(
      'class' => array(
        'form-control'
      )
    ),
    '#states' => array(
      'enabled' => array(
        ':input[name="use_scws"]' => array(
          array(
            'value' => 'no'
          )
        )
      )
    )
  );

  $form['#validate'] = array(
    'mmoda_common_validate'
  );
  return ($form);
}

function mmoda_common_validate($form, &$form_state)
{
  form_clear_error();
}

function resolve_object_name_callback($form, &$form_state)
{
  module_load_include('inc', 'mmoda', 'mmoda.nameresolver');

  $form['radec']['RA']['#value'] = 50;
  $form['radec']['DEC']['#value'] = 80;

  $args = resolve_object_name($form_state['input']['src_name'], $form_state['input']['use_resolver']);
  $commands[] = array(
    'command' => 'set_ra_dec', // the name of your javascript callback
    'args' => $args
  );
  return array(
    '#type' => 'ajax',
    '#commands' => $commands
  );
}

function explore_object_name_callback($form, &$form_state)
{
  module_load_include('inc', 'mmoda', 'mmoda.explore');

  $args = explore_gallery_object($form_state['input']['src_name']);

  $commands[] = array(
    'command' => 'set_object_gallery', // the name of your javascript callback
    'args' => $args
  );
  return array(
    '#type' => 'ajax',
    '#commands' => $commands
  );
}

