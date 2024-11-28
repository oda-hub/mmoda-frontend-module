<?php
namespace Drupal\mmoda\Controller;

// use Drupal\Core\Form\FormBase;
// use Drupal\Core\Form\FormStateInterface;
// use Drupal\mmoda\Form\NameResolveForm;
// use Drupal\mmoda\Form\CommonForm;
// use Drupal\mmoda_isgri\Form\MmodaIsgriForm;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Logger\RfcLogLevel;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * @file
 * Contains \Drupal\mmoda\Controller\mmodaController.
 */
class mmodaController extends ControllerBase
{

  /**
   * {@inheritdoc}
   */
  protected function getModuleName()
  {
    return 'mmoda';
  }

  public function getToken()
  {
    $output = [];
    if (\Drupal::currentUser()->isAuthenticated()) {
      $user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());
      $maxroomid_field = $user->get('field_matrix_room_id');
      $is_mxroomid_empty = $maxroomid_field->isEmpty();
      $jwt_auth_service = \Drupal::service('jwt.authentication.jwt');

      $jwt_encoded_token = $jwt_auth_service->generateToken();

      $jwt_transcoder_service = \Drupal::service('jwt.transcoder');
      $jwt_decoded_token = $jwt_transcoder_service->decode($jwt_encoded_token);

      $jwt_decoded_token->setClaim('sub', $user->get('mail')->value);
      $jwt_decoded_token->setClaim('email', $user->get('mail')->value);
      $jwt_decoded_token->setClaim('name', $user->get('name')->value);
      $jwt_decoded_token->setClaim('roles', $user->getRoles());

      if ($is_mxroomid_empty)
        unset($jwt_decoded_token->mxroomid);
      else
        $jwt_decoded_token->setClaim('field_matrix_room_id', $maxroomid_field->getValue()[0]['value']);

      \Drupal::logger('mmoda_module')->log(RfcLogLevel::INFO, 'jwt_decoded_token: @jwt_decoded_token',
        [
          '@jwt_decoded_token' => print_r($jwt_decoded_token->getPayload(), TRUE)
        ]);

      $jwt_encoded_token_updated = $jwt_transcoder_service->encode($jwt_decoded_token);

      return new JsonResponse(array(
        'token' => $jwt_encoded_token_updated
      ));
    } else
      return (drupal_json_output(array(
        'error' => 'User not authenticated'
      )));
  }

  private function _mmoda_user_has_roles($instrument_roles)
  {
    if (empty($instrument_roles)) {
      return true;
    }

    $user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());
    $user_roles = $user->getRoles();
    $role_storage = \Drupal::entityTypeManager()->getStorage('user_role');

    $user_role_labels = array_map(function ($role_id) use ($role_storage) {
      $role = $role_storage->load($role_id);
      return $role ? $role->label() : null;
    }, $user_roles);

    $user_role_labels = array_filter($user_role_labels);

    $instrument_roles_ar = array_map('trim', explode(',', $instrument_roles));

    return ! empty(array_intersect($instrument_roles_ar, $user_role_labels));
  }

  public function content()
  {
    $module_handler = \Drupal::moduleHandler();
    //$module_object = $module_handler->getModule(basename(__FILE__, '.module'));

    $core_module_name = $this->getModuleName();

    $enabled_modules = $module_handler->getModuleList();
    //     \Drupal::service('libraries.manager')->load('bootstrap_form_validator');
    //     \Drupal::service('libraries.manager')->load('highlightjs');
    $mmoda_modules = array_filter($enabled_modules, function ($key) {
      return strpos($key, 'mmoda_') === 0;
    }, ARRAY_FILTER_USE_KEY);
    $module_dependencies = $module_handler->buildModuleDependencies($mmoda_modules);
    $mmoda_settings = \Drupal::config('mmoda.settings');

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
    $mmoda_js_settings = array();

    $default_weight = 10000;
    $instruments_weights = array();

    foreach ($instruments_settings as $mmoda_module_name => $instrument_settings) {

      $weight = $instrument_settings->get('weight');
      if (empty($weight) or in_array($weight, $instruments_weights)) {
        $weight = $default_weight;
        $default_weight += 10;
      }
      array_push($instruments_weights, $weight);
      $form = '';
      try {
        $form = \Drupal::formBuilder()->getForm('\Drupal\\' . $mmoda_module_name . '\Form\MmodaInstrumentForm');
      } catch (\Exception $e) {
        \Drupal::messenger()->addError('Error ' . $e->getCode() . ' : ' . $e->getMessage());
      }
      if (! empty($form)) {
        $instrument_name = $instrument_settings->get('name');
        $mmoda_js_settings[$instrument_name] = array();
        $enabled = $instrument_settings->get('enabled');
        $is_virtual = $instrument_settings->get('virtual') ?? 0;
        $allowed_roles = $instrument_settings->get('allowed_roles');

        if ($enabled and ! $is_virtual and ($allowed_roles == null or empty($allowed_roles) or $this->_mmoda_user_has_roles($allowed_roles))) {
          $instruments[$weight] = [
            'name' => $instrument_name,
            'active' => '',
            'messenger' => $instrument_settings->get('messenger'),
            'title' => $instrument_settings->get('title'),
            'help_page_url' => $instrument_settings->get('help_page_url'),
            'acknowledgement' => $instrument_settings->get('acknowledgement'),
            'form' => $form
          ];
        }
        $enable_use_catalog = $instrument_settings->get('enable_use_catalog');
        $js9_ext_id = $instrument_settings->get('js9_ext_id');
        $mmoda_js_settings[$instrument_name]['enable_use_catalog'] = ! is_null($enable_use_catalog) ? $enable_use_catalog : false;
        $mmoda_js_settings[$instrument_name]['js9_ext_id'] = ! is_null($js9_ext_id) ? $js9_ext_id : 4;
      }
    }
    // sort instruments by weight
    ksort($instruments);
    $instruments = array_values($instruments);

    // set the first instrument as active tab
    $instruments[0]['active'] = 'active';
    $common_form = \Drupal::formBuilder()->getForm('\Drupal\mmoda\Form\CommonForm');
    $mmoda_data['help_page_url'] = $mmoda_settings->get('help_page_url');

    $output = [
      '#region' => 'content',
      '#theme' => 'mmoda',
      '#name_resolve_form' => \Drupal::formBuilder()->getForm('\Drupal\mmoda\Form\NameResolveForm'),
      '#common_form' => $common_form,
      '#mmoda_data' => $mmoda_data,
      '#instruments' => $instruments
    ];
    $output['#attached']['drupalSettings'][$core_module_name] = $mmoda_js_settings;

    // Use the form builder service to retrieve a form by providing the full
    // name of the class that implements the form you want to display. getForm()
    // will return a render array representing the form that can be used
    // anywhere render arrays are used.
    //
    // In this case the build() method of a block plugin is expected to return
    // a render array so we add the form to the existing output and return it.

    return $output;
  }
}
