<?php
namespace Drupal\mmoda_gw\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Implements the MmodaGWForm form controller.
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
    $instrument_settings = \Drupal::config('mmoda_gw.settings');
    $form['#action'] = $instrument_settings->get('data_server_url', $mmoda_settings->get('default_data_server_url'));
    $module_handler = \Drupal::service('module_handler');
    $module_path = $module_handler->getModule('mmoda_gw')->getPath();

    $form['instrument'] = array(
      '#type' => 'hidden',
      '#value' => 'gw'
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
        'gw_skymap_image' => 'Skymap & Catalog',
        'gw_strain' => 'Strain time series',
        'gw_spectrogram' => 'Spectrogram',
      ),
    );

    $form['query_type'] = array(
      '#type' => 'hidden',
      '#default_value' => $instrument_settings->get('product_type')
    );

    $form['detector'] = array(
      '#type' => 'select',
      '#title' => t("Detector"),
      '#default_value' => $instrument_settings->get('detector'),
      '#parent_classes' => array(
        'form-group',
        'col-md-6'
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'detector',
        'class' => array(
          'form-control'
        ),
      ),
      '#options' => array(
        'H1' => 'H1',
        'L1' => 'L1',
        'V1' => 'V1'
      )
    );

    $form['do_cone_search'] = array(
      '#type' => 'radios',
      '#title' => t("Search mode"),
      '#attributes' => array(
        'name' => $mform_id . 'do_cone_search'
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#options' => array(
        1 => 'Cone search',
        0 => 'All sky'
      ),
      '#default_value' => $instrument_settings->get('do_cone_search'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            'value' => 'gw_skymap_image'
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array(
              'value' => 'gw_skymap_image'
            )
          )
        )
      ),
    );
  
    $form['contour_levels'] = array(
      '#type' => 'textfield',
      '#title' => t("Contour levels"),
      '#default_value' => $instrument_settings->get('contour_levels'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            'value' => 'gw_skymap_image'
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            'value' => 'gw_skymap_image'
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'title' => t("Comma-separated list of levels"),
        'data-bv-notempty' => 'true',
        'data-bv-regexp' => 'true',
        'data-bv-regexp-regexp' => '^[0-9]{1,2}(,[0-9]{1,2})*$',
      ),
    );
  
    $form['level_threshold'] = array(
      '#type' => 'textfield',
      '#title' => "Level threshold",
      '#default_value' => $instrument_settings->get('level_threshold'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            'value' => 'gw_skymap_image'
          ),
          'and',
          ':input[name="' . $mform_id . 'do_cone_search"]' => array(
            'value' => 'true'
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            'value' => 'gw_skymap_image'
          ),
          'and',
          ':input[name="' . $mform_id . 'do_cone_search"]' => array(
            'value' => 'true'
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'data-bv-notempty' => 'true',
        'data-bv-integer' => 'true',
        'data-bv-between' => 'true',
        'data-bv-between-min' => '0',
        'data-bv-between-max' => '100',
      )
    );
  
    $form['radius'] = array(
      '#type' => 'textfield',
      '#title' => "Radius",
      '#default_value' => $instrument_settings->get('radius'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            'value' => 'gw_skymap_image'
          ),
          'and',
          ':input[name="' . $mform_id . 'do_cone_search"]' => array(
            'value' => 'true'
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            'value' => 'gw_skymap_image'
          ),
          'and',
          ':input[name="' . $mform_id . 'do_cone_search"]' => array(
            'value' => 'true'
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'data-bv-notempty' => 'true',
        'data-bv-numeric' => 'true',
        'data-bv-between' => 'true',
        'data-bv-between-min' => '0',
        'data-bv-between-max' => '360',
      )
    );
  
    $form['whiten'] = array(
      '#type' => 'radios',
      '#title' => "Whiten?",
      '#attributes' => array(
        'title' => "Should the strain data be whiten?",
        'name' => $mform_id . 'whiten'
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#options' => array(
        1 => 'Yes',
        0 => 'No'
      ),
      '#default_value' => $instrument_settings->get('whiten'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'gw_spectrogram'), 'or', array('value' => 'gw_strain')
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'gw_spectrogram'), 'or', array('value' => 'gw_strain')
           )
          )
      )
    );
  
    $form['qmin'] = array(
      '#type' => 'textfield',
      '#title' => "Lower Q",
      '#default_value' => $instrument_settings->get('qmin'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            'value' => 'gw_spectrogram'
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array(
              'value' => 'gw_spectrogram'
            )
          )
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'data-bv-integer' => 'true',
        'title' => t("Lower bound of Qs interval"),
      )
    );
  
    $form['qmax'] = array(
      '#type' => 'textfield',
      '#title' => "Upper Q",
      '#default_value' => $instrument_settings->get('qmax'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            'value' => 'gw_spectrogram'
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array(
              'value' => 'gw_spectrogram'
            )
          )
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'data-bv-integer' => 'true',
        'title' => t("Upper bound of Qs interval"),
      )
    );
  
    $form['fmin'] = array(
      '#type' => 'textfield',
      '#title' => "Lower frequency",
      '#default_value' => $instrument_settings->get('fmin'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            'value' => 'gw_strain'
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array(
              'value' => 'gw_strain'
            )
          )
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'data-bv-integer' => 'true',
        'title' => "Lower frequency to bandpass",
      ),
      '#field_suffix' => 'Hz'
    );
  
    $form['fmax'] = array(
      '#type' => 'textfield',
      '#title' => "Upper frequency",
      '#default_value' => $instrument_settings->get('fmax'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            'value' => 'gw_strain'
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array(
              'value' => 'gw_strain'
            )
          )
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'data-bv-integer' => 'true',
        'title' => "Upper frequency to bandpass"
      ),
      '#field_suffix' => 'Hz'
    );

    $form['#theme'] = 'mmoda_gw_form';

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
    return 'mmoda_gw_form';
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
