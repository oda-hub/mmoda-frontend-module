<?php

/**
 * Maximum length of description text field.
 */
define('DESCRIPTION_USE_CASE_MAX_LENGTH', 255);


function customize_registration_form(&$form)
{
    $form['account']['mail']['#description'] = t('Please use an institutional email addrress to subscribe to the service. ' 
    . $form['account']['mail']['#description']);
      
    // $form['account']['description_use_case']['#description'] = t('Note that the computing resources are provided by the University of Geneva. For their fair use, we need to know: We would like you to provide us with a small overview of your activities, in particular:
    //     <ul>
    //         <li>The purpose of your work(s) in broad terms</li>
    //         <li>Possible collaborators in or outside of the University of Geneva</li>
    //         <li>An estimation of the amount of resources needed for your project(s)</li>
    //     </ul>
    //     We will contact you back in case we need additional information.');
    $form['account']['description_use_case']['#required'] = TRUE;
    $form['account']['description_use_case']['#attributes'] = array('class' => array('description_use_case_textarea'), 
    'maxlength' => DESCRIPTION_USE_CASE_MAX_LENGTH);
    $form['account']['description_use_case']['#rows'] = 4;
    $form['account']['description_use_case']['#resizable'] = FALSE;
}