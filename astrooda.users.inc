<?php

/**
 * Maximum length of description text field.
 */
define('DESCRIPTION_USE_CASE_MAX_LENGTH', 255);


function customize_registration_form(&$form)
{
    $form['account']['mail']['#description'] = t('Please use an institutional email addrress to subscribe to the service. '
    . $form['account']['mail']['#description']);

    array_push($form['field_description_use_case']['und'][0]['value']['#attributes']['class'], 'description-use-case-textarea');
    $form['field_description_use_case']['#resizable'] = FALSE;
}