<?php
namespace Drupal\mmoda_polar\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Implements the MmodaPolarForm form controller.
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
    $instrument_settings = \Drupal::config('mmoda_polar.settings');
    $form['#action'] = $instrument_settings->get('data_server_url', $mmoda_settings->get('default_data_server_url'));
    $module_handler = \Drupal::service('module_handler');
    $module_path = $module_handler->getModule('mmoda_polar')->getPath();

    $form['instrument'] = array(
      '#type' => 'hidden',
      '#value' => 'polar'
    );

    $form['product_type'] = array(
      '#type' => 'radios',
      '#title' => t("Product Type"),
      '#attributes' => array(
        'name' => $mform_id . 'product_type',
        'title' => t("Select product type")
      ),
      '#default_value' => $instrument_settings->get('product_type'),
      '#options' => array(
        'polar_lc' => 'Light curve'
      )
    );

    $form['E1_keV'] = array(
      '#type' => 'textfield',
      '#title' => t("Energy Min"),
      '#field_suffix' => t("keV"),
      '#default_value' => $instrument_settings->get('E1_keV'),
      '#required' => TRUE,
      '#size' => 10,
      '#attributes' => array(
        'data-fv-numeric' => 'true',
        'data-fv-vcheck-e1kev' => 'true',
        'title' => t("The minimum of the energy band")
      )
    );

    $form['E2_keV'] = array(
      '#type' => 'textfield',
      '#title' => t("Energy Max"),
      '#field_suffix' => t("keV"),
      '#default_value' => $instrument_settings->get('E2_keV'),
      '#required' => TRUE,
      '#size' => 10,
      '#attributes' => array(
        'data-fv-numeric' => 'true',
        'data-fv-vcheck-e2kev' => 'true',
        'title' => t("The maximum of the energy band")
      )
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
        'title' => "Select query type",
      )
    );

    $form['time_bin'] = array(
      '#type' => 'textfield',
      '#title' => t("Time bin"),
      '#default_value' => $instrument_settings->get('time_bin'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            'value' => 'polar_lc'
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array(
              'value' => 'polar_lc'
            )
          )
        )
      ),
      '#attributes' => array(
        'data-fv-numeric' => 'true',
        'title' => t("Minimum value is 20 seconds."),
      )
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
            'value' => 'polar_lc'
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array(
              'value' => 'polar_lc'
            )
          )
        )
      ),
      '#attributes' => array(
        'class' => array(
          'time_bin_format'
        )
      )
    );

    $form['#theme'] = 'mmoda_polar_form';

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
    return 'mmoda_polar_form';
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
    //     $title = $form_state->getValue('title');
    //     if (strlen($title) < 5) {
    //       // Set an error for the form element with a key of "title".
    //       $form_state->setErrorByName('title', $this->t('The title must be at least 5 characters long.'));
    //     }
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
