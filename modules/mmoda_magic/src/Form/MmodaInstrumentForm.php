<?php
namespace Drupal\mmoda_magic\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Implements the MmodamagicForm form controller.
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
    $instrument_settings = \Drupal::config('mmoda_magic.settings');
    $form['#action'] = $instrument_settings->get('data_server_url', $mmoda_settings->get('default_data_server_url'));
    $module_handler = \Drupal::service('module_handler');
    $module_path = $module_handler->getModule('mmoda_magic')->getPath();

    $form['instrument'] = array(
      '#type' => 'hidden',
      '#value' => 'magic'
    );

    $form ['query_type'] = array (
      '#type' => 'select',
      '#title' => "Query Type",
      '#default_value' => $instrument_settings->get('query_type'),
      '#options' => array (
        'Real' => 'Real',
        'Dummy' => 'Dummy'
      ),
      '#attributes' => array (
        'title' => "Select query type",
        'class' => array (
            'form-control'
        )
      )
   );

    $form ['radius'] = array (
        '#type' => 'textfield',
        '#title' => "Radius",
        '#default_value' => $instrument_settings->get('radius'),
        '#attributes' => array (
          'name' => $mform_id . 'radius',
          'class' => array (
                'form-control'
            ),
            'data-bv-numeric' => 'true'
        )
    );


    $form ['product_type'] = array (
        '#type' => 'radios',
        '#title' => "Product Type",
        '#description' => "Select product type",
        '#attributes' => array ('name' => $mform_id.'product_type'),
        '#default_value' => $instrument_settings->get('product_type'),
        '#options' => array (
            'magic_image' => 'Image',
            'magic_spectrum' => 'Spectrum',
            'magic_lc' => 'Light curve',
            'magic_table' => 'Table'
        ),
        '#parent_classes' => array (
            'form-group',
            'col-md-6'
        )
    );

    $form['#theme'] = 'mmoda_magic_form';

    $form['submit'] = array(
      '#type' => 'submit',
      '#value' => 'Submit'
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
    return 'mmoda_magic_form';
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
