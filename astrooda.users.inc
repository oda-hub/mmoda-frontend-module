<?php

/**
 * Maximum length of description text field.
 */
define('DESCRIPTION_USE_CASE_MAX_LENGTH', 255);


function customize_registration_form(&$form)
{
    $form['account']['mail']['#description'] = t('Please use an institutional email addrress to subscribe to the service. ' 
    . $form['account']['mail']['#description']);
      
    $form['account']['description_use_case']['#attributes'] = array('class' => array('description_use_case_textarea'), 
    'maxlength' => DESCRIPTION_USE_CASE_MAX_LENGTH);
    $form['account']['description_use_case']['#resizable'] = FALSE;
}