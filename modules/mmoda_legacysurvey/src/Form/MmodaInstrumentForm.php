<?php
namespace Drupal\mmoda_legacysurvey\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Implements the MmodaLegacysurveyForm form controller.
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
    $instrument_settings = \Drupal::config('mmoda_legacysurvey.settings');
    $form['#action'] = $instrument_settings->get('data_server_url', $mmoda_settings->get('default_data_server_url'));
    $module_handler = \Drupal::service('module_handler');
    $module_path = $module_handler->getModule('mmoda_legacysurvey')->getPath();

    $form['instrument'] = array(
      '#type' => 'hidden',
      '#value' => 'legacysurvey'
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
        'legacy_survey_image' => 'Image & Catalog',
        'legacy_survey_photometry' => 'Photometry',
      )
    );

    $form['query_type'] = array(
      '#type' => 'hidden',
      '#default_value' => $instrument_settings->get('query_type'),
    );

    $form['data_release'] = array(
      '#type' => 'select',
      '#title' => t("Data Release"),
      '#default_value' => $instrument_settings->get('data_release'),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'data_release'
      ),
      '#options' => array(
        1 => 'DR1',
        2 => 'DR2',
        3 => 'DR3',
        4 => 'DR4',
        5 => 'DR5',
        6 => 'DR6',
        7 => 'DR7',
        8 => 'DR8',
        9 => 'DR9'
      )
    );

    $form['radius_photometry'] = array(
      '#type' => 'textfield',
      '#title' => t("Photometry collection radius"),
      '#default_value' => $instrument_settings->get('radius_photometry'),
      '#attributes' => array(
        'name' => $mform_id . 'radius_photometry',
        'data-bv-numeric' => 'true',
        'data-bv-notempty' => 'true',
        'title' => t("All sources in this radius from center will be used to obtain photometry."),
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#field_suffix' => t('arcsec'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            'value' => 'legacy_survey_photometry'
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array(
              'value' => 'legacy_survey_photometry'
            )
          )
        )
      ),
    );
  
    $form['image_size'] = array(
      '#type' => 'textfield',
      '#title' => "Image size",
      '#default_value' => $instrument_settings->get('image_size'),
      '#attributes' => array(
        'name' => $mform_id . 'image_size',
        'data-bv-numeric' => 'true',
        'data-bv-notempty' => 'true'
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#field_suffix' => 'arcmin',
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            'value' => 'legacy_survey_image'
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array(
              'value' => 'legacy_survey_image'
            )
          )
        )
      ),
    );
  
    $form['pixel_size'] = array(
      '#type' => 'textfield',
      '#title' => "Pixel size",
      '#default_value' => $instrument_settings->get('pixel_size'),
      '#parent_classes' => array(
        'form-group',
        'col-md-6'
      ),
      '#attributes' => array(
        'name' => $mform_id . 'pixel_size',
        'data-bv-numeric' => 'true',
        'data-bv-notempty' => 'true'
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#field_suffix' => t('arcsec per pixel'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            'value' => 'legacy_survey_image'
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array(
              'value' => 'legacy_survey_image'
            )
          )
        )
      ),
    );
  
    $form['image_band'] = array(
      '#type' => 'radios',
      '#title' => "Image Band",
      '#attributes' => array(
        'name' => $mform_id . 'image_band',
        'title' => "Select image band"
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#default_value' => $instrument_settings->get('image_band'),
      '#options' => array(
        'g' => 'g',
        'r' => 'r',
        'z' => 'z'
      ),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            'value' => 'legacy_survey_image'
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array(
              'value' => 'legacy_survey_image'
            )
          )
        )
      ),
    );

    $form['#theme'] = 'mmoda_legacysurvey_form';

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
    return 'mmoda_legacysurvey_form';
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
