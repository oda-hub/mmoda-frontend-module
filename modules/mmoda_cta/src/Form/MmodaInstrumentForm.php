<?php
namespace Drupal\mmoda_cta\Form;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
/**
 * Implements the MmodactaForm form controller.
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
    $instrument_settings = \Drupal::config('mmoda_cta.settings');
    $form['#action'] = $instrument_settings->get('data_server_url', $mmoda_settings->get('default_data_server_url'));
    $module_handler = \Drupal::service('module_handler');
    $module_path = $module_handler->getModule('mmoda_cta')->getPath();
    $form['instrument'] = array(
      '#type' => 'hidden',
      '#value' => 'cta',
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
        'name' => $mform_id . 'product_type',
        'title' => "Select product type"
      ),
      '#default_value' => $instrument_settings->get('product_type'),
      '#options' => array(
        'pre-defined_model' => 'Pre-defined model',
        'LST1_observation_simulator' => 'Lst1 observation simulator',
        'model_cube_file' => 'Model cube file'
      )
    );
    $form['OffAxis_angle'] = array(
      '#type' => 'textfield',
      '#title' => "OffAxis_angle",
      '#default_value' => $instrument_settings->get('OffAxis_angle'),
      '#field_suffix' => "deg",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'pre-defined_model'),
            'or',
            array('value' => 'model_cube_file')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'pre-defined_model'),
            'or',
            array('value' => 'model_cube_file')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'OffAxis_angle',
      )
    );
    $form['cut_efficiency'] = array(
      '#type' => 'textfield',
      '#title' => "cut_efficiency",
      '#default_value' => $instrument_settings->get('cut_efficiency'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'LST1_observation_simulator')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'LST1_observation_simulator')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'cut_efficiency',
      )
    );
    $form['data_cube_type'] = array(
      '#type' => 'radios',
      '#title' => "data_cube",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file')
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file')
          )
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'data_cube_type',
        'class' => array(
          'file-url-text-padding'
        )
      ),
      '#options' => array(
        'file' => 'Upload a file',
        'url' => 'Provide a URL'
      ),
      '#default_value' => 'file'
    );
    $form['data_cube_url'] = array(
      '#type' => 'textfield',
      '#title' => 'File URL',
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file')
          )
          ,
          'and',
          ':input[name="' . $mform_id . 'data_cube_type"]' => array(
            array('value' => 'url')
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file')
          )
          ,
          'and',
          ':input[name="' . $mform_id . 'data_cube_type"]' => array(
            array('value' => 'url')
          )
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'data_cube',
        'class' => array(
          'file-url-text-padding'
        )
      )
    );
    $form['data_cube_file'] = array(
      '#type' => 'file',
      '#title' => 'Upload a file',
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file')
          )
          ,
          'and',
          ':input[name="' . $mform_id . 'data_cube_type"]' => array(
            array('value' => 'file')
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file')
          )
          ,
          'and',
          ':input[name="' . $mform_id . 'data_cube_type"]' => array(
            array('value' => 'file')
          )
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'data_cube',
        'class' => array(
          'file-url-text-padding'
        )
      )
    );
    $form['Texp'] = array(
      '#type' => 'textfield',
      '#title' => "Texp",
      '#default_value' => $instrument_settings->get('Texp'),
      '#field_suffix' => "hour",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'pre-defined_model'),
            'or',
            array('value' => 'model_cube_file')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'pre-defined_model'),
            'or',
            array('value' => 'model_cube_file')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Texp',
      )
    );
    $form['Zd'] = array(
      '#type' => 'textfield',
      '#title' => "Zenith angle",
      '#default_value' => $instrument_settings->get('Zd'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'LST1_observation_simulator')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'LST1_observation_simulator')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Zd',
      )
    );
    $form['F0'] = array(
      '#type' => 'textfield',
      '#title' => "F0",
      '#default_value' => $instrument_settings->get('F0'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file'),
            'or',
            array('value' => 'pre-defined_model')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file'),
            'or',
            array('value' => 'pre-defined_model')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'F0',
      )
    );
    $form['z'] = array(
      '#type' => 'textfield',
      '#title' => "z",
      '#default_value' => $instrument_settings->get('z'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'pre-defined_model')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'pre-defined_model')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'z',
      )
    );
    $form['N_backgr_regions'] = array(
      '#type' => 'textfield',
      '#title' => "Number of backgorund regions",
      '#default_value' => $instrument_settings->get('N_backgr_regions'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'LST1_observation_simulator')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'LST1_observation_simulator')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'N_backgr_regions',
      )
    );
    $form['E0'] = array(
      '#type' => 'textfield',
      '#title' => "E0",
      '#default_value' => $instrument_settings->get('E0'),
      '#field_suffix' => "TeV",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file'),
            'or',
            array('value' => 'pre-defined_model')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file'),
            'or',
            array('value' => 'pre-defined_model')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'E0',
      )
    );
    $form['Exposure_time'] = array(
      '#type' => 'textfield',
      '#title' => "Exposure time in hours",
      '#default_value' => $instrument_settings->get('Exposure_time'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'LST1_observation_simulator')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'LST1_observation_simulator')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Exposure_time',
      )
    );
    $form['source_extension'] = array(
      '#type' => 'textfield',
      '#title' => "Source extension in degrees",
      '#default_value' => $instrument_settings->get('source_extension'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'LST1_observation_simulator')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'LST1_observation_simulator')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'source_extension',
      )
    );
    $form['Radius_spectal_extraction'] = array(
      '#type' => 'textfield',
      '#title' => "Radius_spectal_extraction",
      '#default_value' => $instrument_settings->get('Radius_spectal_extraction'),
      '#field_suffix' => "deg",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file'),
            'or',
            array('value' => 'pre-defined_model')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file'),
            'or',
            array('value' => 'pre-defined_model')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Radius_spectal_extraction',
      )
    );
    $form['Gamma'] = array(
      '#type' => 'textfield',
      '#title' => "Gamma",
      '#default_value' => $instrument_settings->get('Gamma'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'pre-defined_model')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'pre-defined_model')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Gamma',
      )
    );
    $form['Norm'] = array(
      '#type' => 'textfield',
      '#title' => "Powerlaw flux normalisation, 1/(TeV cm2 s)",
      '#default_value' => $instrument_settings->get('Norm'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'LST1_observation_simulator')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'LST1_observation_simulator')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Norm',
      )
    );
    $form['Radius_sky_image'] = array(
      '#type' => 'textfield',
      '#title' => "Radius_sky_image",
      '#default_value' => $instrument_settings->get('Radius_sky_image'),
      '#field_suffix' => "deg",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file'),
            'or',
            array('value' => 'pre-defined_model')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file'),
            'or',
            array('value' => 'pre-defined_model')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Radius_sky_image',
      )
    );
    $form['index'] = array(
      '#type' => 'textfield',
      '#title' => "Powerlaw slope",
      '#default_value' => $instrument_settings->get('index'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'LST1_observation_simulator')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'LST1_observation_simulator')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'index',
      )
    );
    $form['Site'] = array(
      '#type' => 'select',
      '#options' => array(
        'North' => 'North',
        'South' => 'South',
      ),
      '#title' => "Site",
      '#default_value' => $instrument_settings->get('Site'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file'),
            'or',
            array('value' => 'pre-defined_model')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file'),
            'or',
            array('value' => 'pre-defined_model')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Site',
      )
    );
    $form['Telescopes_LST'] = array(
      '#type' => 'radios',
      '#options' => array(
        1 => 'True',
        0 => 'False'
      ),
      '#title' => "Telescopes_LST",
      '#default_value' => $instrument_settings->get('Telescopes_LST'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Telescopes_LST',
      )
    );

    $form['Telescopes_MST'] = array(
      '#type' => 'radios',
      '#options' => array(
        1 => 'True',
        0 => 'False'
      ),
      '#title' => "Telescopes_MST",
      '#default_value' => $instrument_settings->get('Telescopes_MST'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Telescopes_MST',
      )
    );

    $form['Telescope_LST'] = array(
      '#type' => 'radios',
      '#options' => array(
        1 => 'True',
        0 => 'False'
      ),
      '#title' => "Telescope_LST",
      '#default_value' => $instrument_settings->get('Telescope_LST'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'pre-defined_model')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'pre-defined_model')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Telescope_LST',
      )
    );
    $form['Telescopes_SST'] = array(
      '#type' => 'radios',
      '#options' => array(
        1 => 'True',
        0 => 'False'
      ),
      '#title' => "Telescopes_SST",
      '#default_value' => $instrument_settings->get('Telescopes_SST'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_cube_file')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Telescopes_SST',
      )
    );
    $form['Telescope_MST'] = array(
      '#type' => 'radios',
      '#options' => array(
        1 => 'True',
        0 => 'False'
      ),
      '#title' => "Telescope_MST",
      '#default_value' => $instrument_settings->get('Telescope_MST'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'pre-defined_model')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'pre-defined_model')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Telescope_MST',
      )
    );
    $form['Telescope_SST'] = array(
      '#type' => 'radios',
      '#options' => array(
        1 => 'True',
        0 => 'False'
      ),
      '#title' => "Telescope_SST",
      '#default_value' => $instrument_settings->get('Telescope_SST'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'pre-defined_model')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'pre-defined_model')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Telescope_SST',
      )
    );
    
    $form['#theme'] = 'mmoda_cta_form';
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
    return 'mmoda_cta_form';
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
