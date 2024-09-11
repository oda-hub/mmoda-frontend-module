<?php
namespace Drupal\mmoda_jemx\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Implements the MmodaIsgriForm form controller.
 *
 * This example demonstrates a simple form with a single text input element. We
 * extend FormBase which is the simplest form base class used in Drupal.
 *
 * @see \Drupal\Core\Form\FormBase
 */
class MmodaInstrumentForm extends FormBase
{

  /**
   * Build the simple form.
   *
   * A build form method constructs an array that defines how markup and
   * other form elements are included in an HTML form.
   *
   * @param array $form
   *          Default form array structure.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *          Object containing current form state.
   *
   * @return array The render array defining the elements of the form.
   */
  public function buildForm(array $form, FormStateInterface $form_state)
  {
    $mform_id = $this->getFormId();

    $mmoda_settings = \Drupal::config('mmoda.settings');
    $instrument_settings = \Drupal::config('mmoda_jemx.settings');
    $form_action = ($instrument_settings->get('data_server_url') != NULL ) ? $instrument_settings->get('data_server_url') : $mmoda_settings->get('default_data_server_url');
    if ($form_action == NULL) {
      $messenger = \Drupal::Messenger();
      $messenger->addMessage('Error in module '.$instrument_settings->get('title').' : Neither of the two settings is set : data_server_url in mmoda_jemx.settings.yml nor default_data_server_url in mmoda.settings.yml',$messenger::TYPE_ERROR,true);
    }
    $form['#action'] = $form_action;
    $module_handler = \Drupal::service('module_handler');
    $module_path = $module_handler->getModule('mmoda_jemx')->getPath();

    $form['instrument'] = array(
      '#type' => 'hidden',
      '#value' => 'jemx',
      '#attributes' => array(
        'integral_instrument' => 'true',
        'support_return_progress' => 'false'
      )
    );

    $form['osa_version'] = array(
      '#type' => 'select',
      '#title' => t("OSA Version"),
      '#options' => array(
        'OSA10.2' => 'OSA10.2',
        'OSA11.2' => 'OSA11.2'
      ),
      '#default_value' => $instrument_settings->get('osa_version'),
    );

    $form['radius'] = array(
      '#type' => 'textfield',
      '#title' => t("Radius"),
      '#default_value' => $instrument_settings->get('radius'),
      '#size' => 10,
      '#attributes' => array(
        'name' => $mform_id . 'radius',
        'data-fv-numeric' => 'true'
      ),
      '#field_suffix' => t('deg'),
    );

    $form['use_scws'] = array(
      '#type' => 'radios',
      '#title' => t("Use INTEGRAL pointing Science Windows (ScWs)"),
      '#attributes' => array(
        'name' => $mform_id . 'use_scws'
      ),
      '#options' => array(
        'no' => t('Select for time range'),
        'form_list' => t('Custom list'),
        'user_file' => t('Custom list in file')
      ),
      '#default_value' => 'no',
    );

    $form['max_pointings'] = array(
      '#type' => 'textfield',
      '#title' => t("Maximum number of ScWs"),
      '#size' => 10,
      '#default_value' => $instrument_settings->get('max_pointings'),
      '#attributes' => array(
        'data-fv-integer' => 'true',
        'title' => t("randomly selected in the time range"),
      ),
      '#states' => array(
        'visible' => array( // action to take.
          ':input[name="' . $mform_id . 'use_scws"]' => array(
            'value' => 'no'
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'use_scws"]' => array(
            array(
              'value' => 'no'
            )
          )
        )
      ),
    );

    $form['scw_list'] = array(
      '#type' => 'textarea',
      '#title' => t("ScWs List"),
      '#default_value' => $instrument_settings->get('scw_list'),
      '#states' => array(
        'visible' => array( // action to take.
          ':input[name="' . $mform_id . 'use_scws"]' => array(
            'value' => 'form_list'
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'use_scws"]' => array(
            array(
              'value' => 'form_list'
            )
          )
        )
      ),
    );

    $form['user_scw_list_file'] = array(
      '#type' => 'file',
      '#title' => t("ScWs file"),
      '#attributes' => array(
        'name' => 'user_scw_list_file',
        'class' => array(
          'user_scw_list_file'
        ),
        'title' => t("An ASCII file, one ScW per line."),
      ),
      '#states' => array(
        'visible' => array( // action to take.
          ':input[name="' . $mform_id . 'use_scws"]' => array(
            'value' => 'user_file'
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'use_scws"]' => array(
            array(
              'value' => 'user_file'
            )
          )
        )
      ),
    );

    $form['integral_data_rights'] = array(
      '#type' => 'radios',
      '#title' => t("INTEGRAL data access priviledge"),
      '#attributes' => array(
        'name' => $mform_id . 'integral_data_rights'
      ),
      '#default_value' => 'public',
      '#options' => array(
        'public' => 'Public',
        'all-private' => 'All Private'
      ),
    );

    $form['jemx_num'] = array(
      '#type' => 'radios',
      '#title' => t("JEMX module number"),
      '#attributes' => array(
        'name' => $mform_id . 'jemx_num'
      ),
      '#options' => array(
        '1' => t('JEMX-1'),
        '2' => t('JEMX-2')
        // '3' => t ( 'Merged JEMX-1 and JEMX-2' )
      ),
      '#default_value' => '1',
    );

    $form['E1_keV'] = array(
      '#type' => 'textfield',
      '#title' => t("Energy Min"),
      '#default_value' => $instrument_settings->get('E1_keV'),
      '#required' => TRUE,
      '#size' => 10,
      '#attributes' => array(
        'data-fv-numeric' => 'true',
        'data-fv-vcheck-e1kev' => 'true',
        'title' => t("The minimum of the energy band."),
      ),
    );

    $form['E2_keV'] = array(
      '#type' => 'textfield',
      '#title' => t("Energy Max"),
      '#default_value' => $instrument_settings->get('E2_keV'),
      '#required' => TRUE,
      '#size' => 10,
      '#attributes' => array(
        'data-fv-numeric' => 'true',
        'data-fv-vcheck-e2kev' => 'true',
        'title' => t("The maximum of the energy band."),
      ),
    );

    $form['query_type'] = array(
      '#type' => 'select',
      '#title' => t("Query Type"),
      '#default_value' => $instrument_settings->get('query_type'),
      '#options' => array(
        'Real' => 'Real',
        'Dummy' => 'Dummy'
      ),
      '#attributes' => array(
        'title' => t("Select query type"),
      ),
    );

    $form['detection_threshold'] = array(
      '#type' => 'textfield',
      '#title' => t("Detection Threshold"),
      '#default_value' => 7.0,
      '#attributes' => array(
        'data-fv-numeric' => 'true',
        'title' => t("Output catalog significance threshold"),
      ),
    );


    $form['product_type'] = array(
      '#type' => 'radios',
      '#title' => t("Product Type"),
      '#attributes' => array(
        'name' => $mform_id . 'product_type',
        'title' => t("Select product type"),
      ),
      '#default_value' => $instrument_settings->get('product_type'),
      '#options' => array(
        'jemx_image' => 'Image',
        'jemx_spectrum' => 'Spectrum',
        'jemx_lc' => 'Light curve'
      ),
    );

    $form['time_bin'] = array(
      '#type' => 'textfield',
      '#title' => t("Time bin"),
      '#default_value' => $instrument_settings->get('time_bin'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            'value' => 'jemx_lc'
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array(
              'value' => 'jemx_lc'
            )
          )
        )
      ),
      '#attributes' => array(
        'data-fv-numeric' => 'true',
        'data-fv-numeric___message' => 'Please enter a valid float number',
        'data-fv-vcheck-timebin' => 'true',
        'data-mmoda-time-bin-min' => 20,
        'title' => t("Minimum value is 20 seconds"),
      ),
    );

    $form['time_bin_format'] = array(
      '#type' => 'select',
      '#title' => t("Unit"),
      '#options' => array(
        'sec' => 'Seconds',
        'jd' => 'Days'
      ),
      '#default_value' => $instrument_settings->get('time_bin_format'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            'value' => 'jemx_lc'
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array(
              'value' => 'jemx_lc'
            )
          )
        )
      ),
      '#attributes' => array(
        'class' => array(
          'time_bin_format'
        )
      ),
    );

    $form['user_catalog_file'] = array(
      '#type' => 'file',
      '#title' => t("User catalog"),
      '#attributes' => array(
        'name' => 'user_catalog_file'
      ),
      '#suffix' => t('<div>If needed, create a custom catalog following one of the templates : <a href="' .
                  $module_path . '/data/catalog.txt" download>ASCII</a> or <a href="' . $module_path . '/data/catalog.fits" download>FITS</a>.</div>'),
    );
    $form['#theme'] = 'mmoda_jemx_form';

    $form['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Submit')
    );



    return $form;
  }

  /**
   * Getter method for Form ID.
   *
   * The form ID is used in implementations of hook_form_alter() to allow other
   * modules to alter the render array built by this form controller. It must be
   * unique site wide. It normally starts with the providing module's name.
   *
   * @return string The unique ID of the form defined by this class.
   */
  public function getFormId()
  {
    return 'mmoda_jemx_form';
  }

  /**
   * Implements form validation.
   *
   * The validateForm method is the default method called to validate input on
   * a form.
   *
   * @param array $form
   *          The render array of the currently built form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *          Object describing the current state of the form.
   */
  public function validateForm(array &$form, FormStateInterface $form_state)
  {
    $title = $form_state->getValue('title');
    if (strlen($title) < 5) {
      // Set an error for the form element with a key of "title".
      $form_state->setErrorByName('title', $this->t('The title must be at least 5 characters long.'));
    }
  }

  /**
   * Implements a form submit handler.
   *
   * The submitForm method is the default method called for any submit elements.
   *
   * @param array $form
   *          The render array of the currently built form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *          Object describing the current state of the form.
   */
  public function submitForm(array &$form, FormStateInterface $form_state)
  {
    /*
     * This would normally be replaced by code that actually does something
     * with the title.
     */
    $title = $form_state->getValue('title');
    $this->messenger()->addMessage($this->t('You specified a title of %title.', [
      '%title' => $title
    ]));
  }
}
