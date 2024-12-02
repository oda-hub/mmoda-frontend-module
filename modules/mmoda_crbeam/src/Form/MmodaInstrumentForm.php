<?php
namespace Drupal\mmoda_crbeam\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Implements the MmodaCrbeamForm form controller.
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
    $instrument_settings = \Drupal::config('mmoda_crbeam.settings');
    $form['#action'] = $instrument_settings->get('data_server_url', $mmoda_settings->get('default_data_server_url'));
    $module_handler = \Drupal::service('module_handler');
    $module_path = $module_handler->getModule('mmoda_crbeam')->getPath();

    $form['instrument'] = array(
      '#type' => 'hidden',
      '#value' => 'crbeam',
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
        'compute_new_column' => 'Compute new column',
        'filter_table' => 'Filter table',
        'model_CTA_events' => 'Model cta events',
        'histogram_column' => 'Histogram column',
        'CRbeam' => 'Crbeam',
        'Generate_events' => 'Generate events',
      )
    );

    $form['fn_type'] = array(
      '#type' => 'radios',
      '#title' => "fn",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'compute_new_column'),
            'or',
            array('value' => 'filter_table'),
            'or',
            array('value' => 'histogram_column')
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'compute_new_column'),
            'or',
            array('value' => 'filter_table'),
            'or',
            array('value' => 'histogram_column')
          )
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'fn_type',
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

    $form['fn_url'] = array(
      '#type' => 'textfield',
      '#title' => 'File URL',
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'compute_new_column'),
            'or',
            array('value' => 'filter_table'),
            'or',
            array('value' => 'histogram_column')
          ),
          'and',
          ':input[name="' . $mform_id . 'fn_type"]' => array(
            array('value' => 'url')
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'compute_new_column'),
            'or',
            array('value' => 'filter_table'),
            'or',
            array('value' => 'histogram_column')
          )
          ,
          'and',
          ':input[name="' . $mform_id . 'fn_type"]' => array(
            array('value' => 'url')
          )
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'fn',
        'class' => array(
          'file-url-text-padding'
        )
      )
    );

    $form['fn_file'] = array(
      '#type' => 'file',
      '#title' => 'Upload a file',
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'compute_new_column'),
            'or',
            array('value' => 'filter_table'),
            'or',
            array('value' => 'histogram_column')
          ),
          'and',
          ':input[name="' . $mform_id . 'fn_type"]' => array(
            array('value' => 'file')
          )
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'compute_new_column'),
            'or',
            array('value' => 'filter_table'),
            'or',
            array('value' => 'histogram_column')
          ),
          'and',
          ':input[name="' . $mform_id . 'fn_type"]' => array(
            array('value' => 'file')
          )
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'fn',
        'class' => array(
          'file-url-text-padding'
        )
      )
    );

    $form['z_start'] = array(
      '#type' => 'textfield',
      '#title' => "z_start",
      '#default_value' => $instrument_settings->get('z_start'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'z_start',
      )
    );

    $form['new_column'] = array(
      '#type' => 'textfield',
      '#title' => "new_column",
      '#default_value' => $instrument_settings->get('new_column'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'compute_new_column')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'compute_new_column')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'new_column',
      )
    );

    $form['expression'] = array(
      '#type' => 'textfield',
      '#title' => "expression",
      '#default_value' => $instrument_settings->get('expression'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'filter_table'),
            'or',
            array('value' => 'compute_new_column')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'filter_table'),
            'or',
            array('value' => 'compute_new_column')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'expression',
      )
    );

    $form['Npart'] = array(
      '#type' => 'textfield',
      '#title' => "Npart",
      '#default_value' => $instrument_settings->get('Npart'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Npart',
        'data-bv-between-max' => '100000',
        'data-bv-between-min' => '1',
        'data-bv-between' => 'true',
      )
    );

    $form['sep'] = array(
      '#type' => 'textfield',
      '#title' => "sep",
      '#default_value' => $instrument_settings->get('sep'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'histogram_column'),
            'or',
            array('value' => 'filter_table'),
            'or',
            array('value' => 'compute_new_column')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'histogram_column'),
            'or',
            array('value' => 'filter_table'),
            'or',
            array('value' => 'compute_new_column')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'sep',
      )
    );

    $form['particle_type'] = array(
      '#type' => 'select',
      '#options' => array(
        'electron' => 'electron',
        'gamma' => 'gamma',
        'proton' => 'proton',
      ),
      '#title' => "particle_type",
      '#default_value' => $instrument_settings->get('particle_type'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'particle_type',
      )
    );

    $form['column'] = array(
      '#type' => 'textfield',
      '#title' => "column",
      '#default_value' => $instrument_settings->get('column'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'histogram_column')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'histogram_column')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'column',
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
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
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

    $form['weights'] = array(
      '#type' => 'textfield',
      '#title' => "weights",
      '#default_value' => $instrument_settings->get('weights'),
      '#states' => array(

        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'histogram_column')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'histogram_column')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'weights',
      )
    );

    $form['Emin'] = array(
      '#type' => 'textfield',
      '#title' => "Emin",
      '#default_value' => $instrument_settings->get('Emin'),
      '#field_suffix' => "TeV",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'Emin',
      ),
    );

    $form['binning'] = array(
      '#type' => 'select',
      '#options' => array(
        'linear' => 'linear',
        'logarithmic' => 'logarithmic',
      ),
      '#title' => "binning",
      '#default_value' => $instrument_settings->get('binning'),
      '#states' => array(

        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'histogram_column')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'histogram_column')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'binning',
      ),
    );

    $form['EminSource'] = array(
      '#type' => 'textfield',
      '#title' => "EminSource",
      '#default_value' => $instrument_settings->get('EminSource'),
      '#field_suffix' => "TeV",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'EminSource',
      )
    );

    $form['minval'] = array(
      '#type' => 'textfield',
      '#title' => "minval",
      '#default_value' => $instrument_settings->get('minval'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'histogram_column')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'histogram_column')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'minval',
      )
    );

    $form['Gamma'] = array(
      '#type' => 'textfield',
      '#title' => "Gamma",
      '#default_value' => $instrument_settings->get('Gamma'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
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

    $form['maxval'] = array(
      '#type' => 'textfield',
      '#title' => "maxval",
      '#default_value' => $instrument_settings->get('maxval'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'histogram_column')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'histogram_column')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'maxval',
      )
    );

    $form['EGMF_fG'] = array(
      '#type' => 'textfield',
      '#title' => "EGMF_fG",
      '#default_value' => $instrument_settings->get('EGMF_fG'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'EGMF_fG'
      )
    );

    $form['nbins'] = array(
      '#type' => 'textfield',
      '#title' => "nbins",
      '#default_value' => $instrument_settings->get('nbins'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'histogram_column')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'histogram_column')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'nbins',
      )
    );

    $form['lmaxEGMF_Mpc'] = array(
      '#type' => 'textfield',
      '#title' => "lmaxEGMF_Mpc",
      '#default_value' => $instrument_settings->get('lmaxEGMF_Mpc'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'lmaxEGMF_Mpc'
      )
    );

    $form['xlabel'] = array(
      '#type' => 'textfield',
      '#title' => "xlabel",
      '#default_value' => $instrument_settings->get('xlabel'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'histogram_column')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'histogram_column')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'xlabel',
      )
    );

    $form['jet_half_size'] = array(
      '#type' => 'textfield',
      '#title' => "jet_half_size",
      '#default_value' => $instrument_settings->get('jet_half_size'),
      '#field_suffix' => "deg",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'jet_half_size',
      )
    );

    $form['ylabel'] = array(
      '#type' => 'textfield',
      '#title' => "ylabel",
      '#default_value' => $instrument_settings->get('ylabel'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'histogram_column')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'histogram_column')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'ylabel',
      )
    );

    $form['jet_direction'] = array(
      '#type' => 'textfield',
      '#title' => "jet_direction",
      '#default_value' => $instrument_settings->get('jet_direction'),
      '#field_suffix' => "deg",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'jet_direction',
      )
    );

    $form['window_size_RA'] = array(
      '#type' => 'textfield',
      '#title' => "window_size_RA",
      '#default_value' => $instrument_settings->get('window_size_RA'),
      '#field_suffix' => "deg",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'window_size_RA',
      )
    );

    $form['psf'] = array(
      '#type' => 'textfield',
      '#title' => "psf",
      '#default_value' => $instrument_settings->get('psf'),
      '#field_suffix' => "deg",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'psf',
      )
    );

    $form['window_size_DEC'] = array(
      '#type' => 'textfield',
      '#title' => "window_size_DEC",
      '#default_value' => $instrument_settings->get('window_size_DEC'),
      '#field_suffix' => "deg",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'window_size_DEC',
      )
    );

    $form['livetime'] = array(
      '#type' => 'textfield',
      '#title' => "livetime",
      '#default_value' => $instrument_settings->get('livetime'),
      '#field_suffix' => "day",
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'livetime',
      )
    );

    $form['EBL'] = array(
      '#type' => 'select',
      '#options' => array(
        'Franceschini 2017' => 'Franceschini 2017',
        'Inoue 2012 Baseline' => 'Inoue 2012 Baseline',
        'Inoue 2012 lower limit' => 'Inoue 2012 lower limit',
        'Inoue 2012 upper limit' => 'Inoue 2012 upper limit',
        'Stecker 2016 lower limit' => 'Stecker 2016 lower limit',
        'Stecker 2016 upper limit' => 'Stecker 2016 upper limit',
      ),
      '#title' => "EBL",
      '#default_value' => $instrument_settings->get('EBL'),
      '#states' => array(
        'visible' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        ),
        'enabled' => array(
          ':input[name="' . $mform_id . 'product_type"]' => array(
            array('value' => 'model_CTA_events'),
            'or',
            array('value' => 'CRbeam'),
            'or',
            array('value' => 'Generate_events')
          ),
        )
      ),
      '#label_attributes' => array(
        'class' => array('label')
      ),
      '#attributes' => array(
        'name' => $mform_id . 'EBL',
      )
    );

    $form['#theme'] = 'mmoda_crbeam_form';

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
    return 'mmoda_crbeam_form';
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
