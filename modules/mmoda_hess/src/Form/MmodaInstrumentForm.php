<?php
namespace Drupal\mmoda_hess\Form;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
/**
 * Implements the MmodahessForm form controller.
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
    $instrument_settings = \Drupal::config('mmoda_hess.settings');
    $form['#action'] = $instrument_settings->get('data_server_url', $mmoda_settings->get('default_data_server_url'));
    $module_handler = \Drupal::service('module_handler');
    $module_path = $module_handler->getModule('mmoda_hess')->getPath();

    $form['instrument'] = array(
      '#type' => 'hidden',
      '#value' => 'hess',
      '#attributes' => array(
        'integral_instrument' => 'false',
        'support_return_progress' => 'true'
      )
    );
    
    $form['query_type'] = array(
      '#type' => 'hidden',
      '#default_value' => $instrument_settings->get('query_type'),
    );

    $form['product_type'] = array(
      '#type' => 'radios',
      '#title' => "Product Type",
      '#attributes' => array(
        'name' => $mform_id . 'product_type',
        '#description' => "Select product type"
      ),
      '#default_value' => $instrument_settings->get('product_type'),
      '#options' => array(
        'Spectrum' => 'Spectrum',
        'Lightcurve' => 'Lightcurve',
        'Image' => 'Image',
      )
    );

    $form['Radius'] = array(
      '#type' => 'textfield',
      '#title' => t("Radius"),
      '#default_value' => $instrument_settings->get('Radius'),
      '#field_suffix' => "deg",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Spectrum'),
            'or',
            array('value' => 'Lightcurve'),
            'or',
            array('value' => 'Image')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Spectrum'),
            'or',
            array('value' => 'Lightcurve'),
            'or',
            array('value' => 'Image')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Radius',
      )
    );

    $form['R_s'] = array(
      '#type' => 'textfield',
      '#title' => "R_s",
      '#default_value' => $instrument_settings->get('R_s'),
      '#field_suffix' => "deg",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Spectrum'),
            'or',
            array('value' => 'Lightcurve')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Spectrum'),
            'or',
            array('value' => 'Lightcurve')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'R_s'
      )
    );

    $form['pixsize'] = array(
      '#type' => 'textfield',
      '#title' => "Pixel size",
      '#default_value' => $instrument_settings->get('pixsize'),
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
        'name' => $mform_id . 'pixsize',
      )
    );

    $form['Emin'] = array(
      '#type' => 'textfield',
      '#title' => "Emin",
      '#default_value' =>$instrument_settings->get('Emin'),
      '#field_suffix' => "TeV",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Spectrum'),
            'or',
            array('value' => 'Lightcurve'),
            'or',
            array('value' => 'Image')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Spectrum'),
            'or',
            array('value' => 'Lightcurve'),
            'or',
            array('value' => 'Image')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Emin',
      )
    );

    $form['Emax'] = array(
      '#type' => 'textfield',
      '#title' => "Emax",
      '#default_value' => $instrument_settings->get('Emax'),
      '#field_suffix' => "TeV",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Spectrum'),
            'or',
            array('value' => 'Lightcurve'),
            'or',
            array('value' => 'Image')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Spectrum'),
            'or',
            array('value' => 'Lightcurve'),
            'or',
            array('value' => 'Image')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Emax',
      )
    );

    $form['NEbins'] = array(
      '#type' => 'textfield',
      '#title' => "NEbins",
      '#default_value' => $instrument_settings->get('NEbins'),
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
        'name' => $mform_id . 'NEbins',
      )
    );

    $form['NTbins'] = array(
      '#type' => 'textfield',
      '#title' => "NTbins",
      '#default_value' => $instrument_settings->get('NTbins'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Lightcurve')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'Lightcurve')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'NTbins',
      )
    );

    $form['Efit_min'] = array(
      '#type' => 'textfield',
      '#title' => "Efit_min",
      '#default_value' => $instrument_settings->get('Efit_min'),
      '#field_suffix' => "TeV",
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
        'name' => $mform_id . 'Efit_min',
      )
    );

    $form['Efit_max'] = array(
      '#type' => 'textfield',
      '#title' => "Efit_max",
      '#default_value' => $instrument_settings->get('Efit_max'),
      '#field_suffix' => "TeV",
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
        'name' => $mform_id . 'Efit_max',
      )
    );

    $form['#theme'] = 'mmoda_hess_form';
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
    return 'mmoda_hess_form';
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
