<?php
namespace Drupal\mmoda\Controller;

// use Drupal\Core\Form\FormBase;
// use Drupal\Core\Form\FormStateInterface;
// use Drupal\mmoda\Form\NameResolveForm;
// use Drupal\mmoda\Form\CommonForm;
// use Drupal\mmoda_isgri\Form\MmodaIsgriForm;

/**
 * @file
 * Contains \Drupal\mmoda\Controller\mmodaController.
 */
class mmodaController
{

  public function content()
  {
    $module_handler = \Drupal::moduleHandler();
    $enabled_modules = $module_handler->getModuleList();
//     \Drupal::service('libraries.manager')->load('bootstrap_form_validator');
//     \Drupal::service('libraries.manager')->load('highlightjs');
    $mmoda_modules = array_filter($enabled_modules, function ($key) {
      return strpos($key, 'mmoda_') === 0;
    }, ARRAY_FILTER_USE_KEY);
    $module_ependencies = $module_handler->buildModuleDependencies($mmoda_modules);

    $instruments_settings = array();
    foreach ($mmoda_modules as $mmoda_module_name => $mmoda_module) {
      $module_info = \Drupal::config($mmoda_module_name . '.info');
      $module_config = \Drupal::config($mmoda_module_name . '.settings');
      $is_virtual = $module_config->get('virtual');
      $moduleHandler = \Drupal::service('module_handler');
      if ($moduleHandler->moduleExists($mmoda_module_name) and (empty($is_virtual) or $is_virtual != 1)) {
        $instruments_settings[$mmoda_module_name] = $module_config;
      }
    }
    $instruments = array();
    foreach ($instruments_settings as $mmoda_module_name => $instrument_settings) {
      $weight = $instrument_settings->get('weight');
      if (empty($weight))
        $weight = 99999999999;
      $form = '';
      try {
        $form = \Drupal::formBuilder()->getForm('\Drupal\\' . $mmoda_module_name . '\Form\MmodaInstrumentForm');
      }
      catch (\Exception $e) {
        \Drupal::messenger()->addError('Error ' . $e->getCode() . ' : ' . $e->getMessage());
      }
      if (! empty($form))
        $instruments[$weight] = [
          'name' => $instrument_settings->get('name'),
          'active' => '',
          'messenger' => $instrument_settings->get('messenger'),
          'title' => $instrument_settings->get('title'),
          'help_page_url' => $instrument_settings->get('help_page_url'),
          'acknowledgement' => $instrument_settings->get('acknowledgement'),
          'form' => $form,
          'help_page_url' => 'help/isgri'
        ];
    }
    // sort instruments by weight
    ksort($instruments);
    $instruments = array_values($instruments);

    // set the first instrument as active tab
    $instruments[0]['active'] = 'active';

    $output = [
      '#region' => 'content',
      '#theme' => 'mmoda',
      '#name_resolve_form' => \Drupal::formBuilder()->getForm('\Drupal\mmoda\Form\NameResolveForm'),
      '#common_form' => \Drupal::formBuilder()->getForm('\Drupal\mmoda\Form\CommonForm'),
      '#instruments' => $instruments
    ];

    // Use the form builder service to retrieve a form by providing the full
    // name of the class that implements the form you want to display. getForm()
    // will return a render array representing the form that can be used
    // anywhere render arrays are used.
    //
    // In this case the build() method of a block plugin is expected to return
    // a render array so we add the form to the existing output and return it.

    return $output;

    return array(
      '#type' => 'markup',
      '#markup' => t('Hello, World!')
    );
  }
}
