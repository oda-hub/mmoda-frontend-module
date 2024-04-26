<?php
namespace Drupal\mmoda\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Implements the NameResolveForm form controller.
 *
 * This example demonstrates a simple form with a single text input element. We
 * extend FormBase which is the simplest form base class used in Drupal.
 *
 * @see \Drupal\Core\Form\FormBase
 */
class NameResolveForm extends FormBase
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
    $mmoda_settings = \Drupal::config('mmoda.settings');

    $form['src_name'] = array(
      '#type' => 'textfield',
      '#title' => t("Object name"),
      '#default_value' => $mmoda_settings->get('src_name'),
      '#required' => TRUE,
    );

    $form['resolve_src_name'] = array(
      '#type' => 'button',
      '#button_type' => 'button',
      '#name' => 'resolve_name',
      '#value' => $this->t("Resolve"),
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
    );

    $form['explore_src_name'] = array(
      '#type' => 'button',
      '#button_type' => 'button',
      '#name' => 'explore_name',
      '#value' => $this->t("Explore"),
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
    );

    $form['#theme'] = 'mmoda_name_resolve_form';

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
    return 'mmoda_name_resolve_form';
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
