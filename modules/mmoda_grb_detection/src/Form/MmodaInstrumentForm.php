<?php
namespace Drupal\mmoda_grb_detection\Form;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
/**
 * Implements the Mmodagrb_detectionForm form controller.
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
    $instrument_settings = \Drupal::config('mmoda_grb_detection.settings');
    $form['#action'] = $instrument_settings->get('data_server_url', $mmoda_settings->get('default_data_server_url'));
    $module_handler = \Drupal::service('module_handler');
    $module_path = $module_handler->getModule('mmoda_grb_detection')->getPath();
    
    $form['instrument'] = array(
      '#type' => 'hidden',
      '#value' => 'grb_detection',
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
      '#title' => t("Product Type"),
      '#attributes' => array(
        '#description' => t("Select product type"),
        'name' => $mform_id . 'product_type'
      ),
      '#default_value' => $instrument_settings->get('product_type'),
      '#options' => array(
        'integralallsky' => 'Integralallsky',
        'detectgrb' => 'Detectgrb'
      ),
      '#label_attributes' => array(
        'class' => array('label')
      )
    );

    $form['RA_rename'] = array(
      '#type' => 'textfield',
      '#title' => t("RA_rename"),
      '#default_value' => $instrument_settings->get('RA_rename'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'integralallsky')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'integralallsky')
          ),
        )
      ),
      '#attributes' => array(
        'name' => $mform_id . 'RA_rename',
      ),
      '#label_attributes' => array(
        'class' => array('label')
      )
    );

    $form['detection_time_scales'] = array(
      '#type' => 'textfield',
      '#title' => t("detection_time_scales"),
      '#default_value' => $instrument_settings->get('detection_time_scales'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'detectgrb')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'detectgrb')
          ),
        )
      ),
      '#attributes' => array(
        'name' => $mform_id . 'detection_time_scales',
      ),
      '#label_attributes' => array(
        'class' => array('label')
      )
    );

    $form['Dec'] = array(
      '#type' => 'textfield',
      '#title' => t("Dec"),
      '#default_value' => $instrument_settings->get('Dec'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'integralallsky')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'integralallsky')
          ),
        )
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Dec',
      ),
      '#label_attributes' => array(
        'class' => array('label')
      )
    );

    $form['lc_time_scale'] = array(
      '#type' => 'textfield',
      '#title' => t("lc_time_scale"),
      '#default_value' => $instrument_settings->get('lc_time_scale'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'detectgrb')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'detectgrb')
          ),
        )
      ),
      '#attributes' => array(
        'name' => $mform_id . 'lc_time_scale',
      ),
      '#label_attributes' => array(
        'class' => array('label')
      )
    );

    $form['tstart_rel_mseconds'] = array(
      '#type' => 'textfield',
      '#title' => t("tstart_rel_mseconds"),
      '#default_value' => $instrument_settings->get('tstart_rel_mseconds'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'integralallsky')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'integralallsky')
          ),
        )
      ),
      '#attributes' => array(
        'name' => $mform_id . 'tstart_rel_mseconds',
      ),
      '#label_attributes' => array(
        'class' => array('label')
      )
    );

    $form['background_age'] = array(
      '#type' => 'textfield',
      '#title' => t("background_age"),
      '#default_value' => $instrument_settings->get('background_age'),
      '#field_suffix' => t("s"),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'detectgrb')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'detectgrb')
          ),
        )
      ),
      '#attributes' => array(
        'name' => $mform_id . 'background_age',
      ),
      '#label_attributes' => array(
        'class' => array('label')
      )
    );

    $form['tstop_rel_seconds'] = array(
      '#type' => 'textfield',
      '#title' => t("tstop_rel_seconds"),
      '#default_value' => $instrument_settings->get('tstop_rel_seconds'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'integralallsky')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'integralallsky')
          ),
        )
      ),
      '#attributes' => array(
        'name' => $mform_id . 'tstop_rel_seconds',
      ),
      '#label_attributes' => array(
        'class' => array('label')
      )
    );

    $form['min_sn'] = array(
      '#type' => 'textfield',
      '#title' => t("min_sn"),
      '#default_value' => $instrument_settings->get('min_sn'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'detectgrb')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'detectgrb')
          ),
        )
      ),
      '#attributes' => array(
        'name' => $mform_id . 'min_sn',
      ),
      '#label_attributes' => array(
        'class' => array('label')
      )
    );

    $form['t0_utc'] = array(
      '#type' => 'textfield',
      '#title' => t("t0_utc"),
      '#default_value' => $instrument_settings->get('t0_utc'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'integralallsky')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'integralallsky')
          ),
        )
      ),
      '#attributes' => array(
        'name' => $mform_id . 't0_utc',
      ),
      '#label_attributes' => array(
        'class' => array('label')
      )
    );

    $form['required_completeness'] = array(
      '#type' => 'textfield',
      '#title' => t("required_completeness"),
      '#default_value' => $instrument_settings->get('required_completeness'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'integralallsky')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'integralallsky')
          ),
        )
      ),
      '#attributes' => array(
        'name' => $mform_id . 'required_completeness',
      ),
      '#label_attributes' => array(
        'class' => array('label')
      )
    );

    $form['mode'] = array(
      '#type' => 'textfield',
      '#title' => t("mode"),
      '#default_value' => $instrument_settings->get('mode'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'integralallsky')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'integralallsky')
          ),
        )
      ),
      '#attributes' => array(
        'name' => $mform_id . 'mode',
      ),
      '#label_attributes' => array(
        'class' => array('label')
      )
    );

    $form['global_snr_threshold'] = array(
      '#type' => 'textfield',
      '#title' => t("global_snr_threshold"),
      '#default_value' => $instrument_settings->get('global_snr_threshold'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'integralallsky')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'integralallsky')
          ),
        )
      ),
      '#attributes' => array(
        'name' => $mform_id . 'global_snr_threshold',
      ),
      '#label_attributes' => array(
        'class' => array('label')
      )
    );

    $form['negative_excesses'] = array(
      '#type' => 'textfield',
      '#title' => t("negative_excesses"),
      '#default_value' => $instrument_settings->get('negative_excesses'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'integralallsky')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'integralallsky')
          ),
        )
      ),
      '#attributes' => array(
        'name' => $mform_id . 'negative_excesses',
      ),
      '#label_attributes' => array(
        'class' => array('label')
      )
    );

    $form['#theme'] = 'mmoda_grb_detection_form';
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
    return 'mmoda_grb_detection_form';
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
