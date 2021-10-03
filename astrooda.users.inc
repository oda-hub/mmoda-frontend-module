<?php

/**
 * Maximum length of description text field.
 */
define('DESCRIPTION_USE_CASE_MAX_LENGTH', 255);


function customize_registration_form(&$form)
{
    $form['account']['mail']['#description'] = t('Please use an institutional email addrress to subscribe to the service. '
    . $form['account']['mail']['#description']);
<<<<<<< HEAD

=======
    
>>>>>>> ead4da0f84f01c5375c97fab9b4c3043169fd0df
    array_push($form['field_description_use_case']['und'][0]['value']['#attributes']['class'], 'description-use-case-textarea');
    $form['field_description_use_case']['#resizable'] = FALSE;
}