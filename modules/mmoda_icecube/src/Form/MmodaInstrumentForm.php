<?php
namespace Drupal\mmoda_icecube\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Implements the MmodaicecubeForm form controller.
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
    $mform_id = $this->getFormId() . '_';

    $mmoda_settings = \Drupal::config('mmoda.settings');
    $instrument_settings = \Drupal::config('mmoda_icecube.settings');
    $form['#action'] = $instrument_settings->get('data_server_url', $mmoda_settings->get('default_data_server_url'));
    $module_handler = \Drupal::service('module_handler');
    $module_path = $module_handler->getModule('mmoda_icecube')->getPath();

    $form['instrument'] = array(
      '#type' => 'hidden',
      '#value' => 'icecube',
      '#attributes' => array(
        'integral_instrument' => 'false',
        'support_return_progress' => 'true'
      )
    );

    $form['query_type'] = array(
      '#type' => 'hidden',
      '#value' => $instrument_settings->get('query_type'),
    );
    
    $form['product_type'] = array(
      '#type' => 'radios',
      '#title' => "Product Type",
      '#attributes' => array(
        '#description' => "Select product type",
        'name' => $mform_id . 'product_type'
      ),
      '#default_value' => $instrument_settings->get('product_type'),
      '#options' => array(
        'Spectrum' => 'Spectrum',
        'Lightcurve' => 'Lightcurve',
        'Image' => 'Image'
      ),
    );

    $form['IC40'] = array(
      '#type' => 'radios',
      '#options' => array(
        1 => 'True',
        0 => 'False'
      ),
      '#title' => "IC40",

      '#default_value' => $instrument_settings->get('IC40'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Spectrum'),
            'or',
            array('value' => 'Image')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Spectrum'),
            'or',
            array('value' => 'Image')
          ),
        )
      ),

      '#attributes' => array(
        'name' => $mform_id . 'IC40',
      )
    );
    
    $form['Slope'] = array(
      '#type' => 'textfield',
      '#title' => "Slope",
      '#default_value' => $instrument_settings->get('Slope'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Lightcurve'),
            'or',
            array('value' => 'Spectrum'),
            'or',
            array('value' => 'Image')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Lightcurve'),
            'or',
            array('value' => 'Spectrum'),
            'or',
            array('value' => 'Image')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Slope',
      )
    );

    $form['IC59'] = array(
      '#type' => 'radios',
      '#options' => array(
        1 => 'True',
        0 => 'False'
      ),
      '#title' => "IC59",
      '#default_value' => $instrument_settings->get('IC59'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Spectrum'),
            'or',
            array('value' => 'Image')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Spectrum'),
            'or',
            array('value' => 'Image')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'IC59',
      )
    );

    $form['IC79'] = array(
      '#type' => 'radios',
      '#options' => array(
        1 => 'True',
        0 => 'False'
      ),
      '#title' => "IC79",
      '#default_value' => $instrument_settings->get('IC79'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Spectrum'),
            'or',
            array('value' => 'Image')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Spectrum'),
            'or',
            array('value' => 'Image')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'IC79',
      )
    );

    $form['IC86_I'] = array(
      '#type' => 'radios',
      '#options' => array(
        1 => 'True',
        0 => 'False'
      ),
      '#title' => "IC86_I",

      '#default_value' => $instrument_settings->get('IC86_I'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Spectrum'),
            'or',
            array('value' => 'Image')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Spectrum'),
            'or',
            array('value' => 'Image')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'IC86_I',
      )
    );

    $form['IC86_II_VII'] = array(
      '#type' => 'radios',
      '#options' => array(
        1 => 'True',
        0 => 'False'
      ),
      '#title' => "IC86_II_VII",
      '#default_value' => $instrument_settings->get('IC86_II_VII'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Spectrum'),
            'or',
            array('value' => 'Image')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Spectrum'),
            'or',
            array('value' => 'Image')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'IC86_II_VII',
      )
    );

    $form['Spectrum_type'] = array(
      '#type' => 'select',
      '#options' => array(

        'Fixed_slope' => 'Fixed_slope',

        'Free_slope' => 'Free_slope',

      ),
      '#title' => "Spectrum_type",

      '#default_value' => $instrument_settings->get('Spectrum_type'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Spectrum')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Spectrum')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Spectrum_type',
      )
    );

    $form['Radius'] = array(
      '#type' => 'textfield',
      '#title' => "Radius",
      '#default_value' => $instrument_settings->get('Radius'),
      '#field_suffix' => "deg",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Image')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Image')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Radius'
      )
    );

    $form['pixel_size'] = array(
      '#type' => 'textfield',
      '#title' => "pixel_size",
      '#default_value' => $instrument_settings->get('pixel_size'),
      '#field_suffix' => "deg",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Image')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Image')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'pixel_size'
      )
    );

    $form['TSmap_type'] = array(
      '#type' => 'select',
      '#options' => array(
        'Fixed_slope' => 'Fixed_slope',
        'Free_slope' => 'Free_slope',
      ),
      '#title' => "TSmap_type",
      '#default_value' => $instrument_settings->get('TSmap_type'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Image')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Image')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'TSmap_type',
      )
    );

    $form['#theme'] = 'mmoda_icecube_form';

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
    return 'mmoda_icecube_form';
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
