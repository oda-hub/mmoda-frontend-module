<?php
namespace Drupal\mmoda\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\mmoda\Ajax\setRADecCommand;
use Drupal\mmoda\Ajax\exploreMMODAGlleryObjectCommand;
use Drupal\Component\Utility\UrlHelper;

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
      '#required' => TRUE
    );

    // Group submit handlers in an actions element with a key of "actions" so
    // that it gets styled correctly, and so that other modules may add actions
    // to the form. This is not required, but is convention.
    $form['actions'] = [
      '#type' => 'actions',
    ];

    $form['actions']['resolve_src_name'] = array(
      '#type' => 'button',
      '#button_type' => 'button',
      '#name' => 'resolve_name',
      '#value' => $this->t("Resolve"),
      '#ajax' => array(
        'callback' => '::resolveObjectNameCallback',
        'progress' => array(
          'type' => 'throbber',
          'message' => ''
        )
      ),
      '#states' => array(
        'enabled' => array(
          ':input[name="src_name"]' => [
            'filled' => TRUE
          ]
        )
      )
    );

    $form['actions']['explore_src_name'] = array(
      '#type' => 'button',
      '#button_type' => 'button',
      '#name' => 'explore_name',
      '#value' => $this->t("Explore"),
      '#ajax' => array(
        'callback' => '::exploreMMODAGallery',
        'progress' => array(
          'type' => 'throbber',
          'message' => ''
        )
      ),
      '#states' => array(
        'enabled' => array(
          ':input[name="src_name"]' => [
            'filled' => TRUE
          ]
        )
      )
    );
    $form['#token'] = FALSE;
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
//     $title = $form_state->getValue('title');
//     if (strlen($title ?? '') < 5) {
      // Set an error for the form element with a key of "title".
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
  }

  /**
   * Handles switching the available regions based on the selected theme.
   */
  public function resolveObjectNameCallback($form, FormStateInterface $form_state)
  {
//     $form_state->setRebuild(TRUE);
    $form['radec']['RA']['#value'] = 50;
    $form['radec']['DEC']['#value'] = 80;

    $args = $this->resolveObjectName($form_state->getValue('src_name'));
    $ajax_response = new AjaxResponse();
    $ajax_response->addCommand(new setRADecCommand($args));

    // Finally return the AjaxResponse object.
    return $ajax_response;
  }

  /**
   * Handles switching the available regions based on the selected theme.
   */
  public function exploreMMODAGallery($form, FormStateInterface $form_state)
  {
    $form['radec']['RA']['#value'] = 0;
    $form['radec']['DEC']['#value'] = 0;

    $args = $this->exploreMMODAGlleryObject($form_state->getValue('src_name'));
    $ajax_response = new AjaxResponse();
    $ajax_response->addCommand(new exploreMMODAGlleryObjectCommand($args));

    // Finally return the AjaxResponse object.
    return $ajax_response;
  }

  /**
   * Handles switching the available regions based on the selected theme.
   */
  public function resolveObjectName($source_name)
  {
    $mmoda_settings = \Drupal::config('mmoda.settings');

    $local_name_resolver_url = $mmoda_settings->get('local_name_resolver_url');
    $name_resolver_url = $mmoda_settings->get('name_resolver_url');
    //sleep ( 20 );

    $data = array();

    $data['status'] = - 1;
    $data['message'] = 'Resolution failed ! we are working on fixing it.<br>Please try later ...';

    // resolve locally first
    $local_name_resolver_url .= rawurlencode($source_name);
    $local_resolution_ok = false;
    if ($response_json_string = @file_get_contents($local_name_resolver_url) and $response_json = json_decode($response_json_string)) {
      if ($response_json->success and $response_json->have_coordinates and $response_json->success_coordinates) {
        $data['ra'] = $response_json->ra;
        $data['dec'] = $response_json->dec;
        $data['status'] = 0;
        $data['message'] = 'Name resolved by local resolver.';
        if ($response_json->success_time) {
          $data['t1'] = $response_json->view->t1;
          $data['t2'] = $response_json->view->t2;
        }
        return $data;
      } else {
        error_log("Object name can not be resolved by local name resolver: " . $local_name_resolver_url);
      }
    } else {
      error_log("Local name resolver error: " . $local_name_resolver_url);
    }

    libxml_use_internal_errors(true);
    $name_resolver_url .= rawurlencode($source_name);
    $xml = simplexml_load_file($name_resolver_url, 'SimpleXMLElement', LIBXML_NOWARNING);
    if (false === $xml) {
      error_log("Failed getting XML for name resolution: " . $name_resolver_url);
      foreach (libxml_get_errors() as $error) {
        error_log($error->message);
      }
      $data['message'] = 'Failed to resolve name.<br>Please try later ...';
    } else if (! isset($xml->Target->Resolver->jradeg)) {
      error_log('Object name can not be resolved by remote name resolver:' . $name_resolver_url . "\n" . $xml->Target->INFO);
      $data['message'] = $source_name . ' : Unknown object !';
    } else {
      if (is_array($xml->Target->Resolver->jradeg)) {
        $ra = floatval($xml->Target->Resolver->jradeg['0']);
        $dec = floatval($xml->Target->Resolver->jdedeg['0']);
      } else {
        $ra = floatval($xml->Target->Resolver->jradeg);
        $dec = floatval($xml->Target->Resolver->jdedeg);
      }
      $nameresolver = explode('=', (string) $xml->Target->Resolver->attributes()->name[0])[1];
      $data['status'] = 0;
      $data['message'] = 'Name resolved using ' . $nameresolver;
      $data['ra'] = $ra;
      $data['dec'] = $dec;
    }

    return $data;
  }

  public function exploreMMODAGlleryObject($source_name)
  {
    $mmoda_settings = \Drupal::config('mmoda.settings');
//     sleep ( 200 );

    $gallery_data_request = $mmoda_settings->get('gallery_data_request_url') . '?src_name=' . UrlHelper::encodePath($source_name);

    try {
      $response = \Drupal::httpClient()->get($gallery_data_request, array(
        'headers' => array(
          'Accept' => 'text/plain'
        )
      ));
      $response_data = (string) $response->getBody();
      if (empty($response_data)) {
        $data = array(
          'status' => - 1
        );
      } else {
        error_log('$response_data:'.$response_data);
        $json_response = json_decode($response_data, true);
        error_log('$json_response:'.print_r($json_response, true));
        // drupal_add_http_header('X-Frame-Options', 'allow-from https://www.astro.unige.ch/', FALSE);
        if (empty($json_response)) {
          $data = array(
            'status' => - 1
          );
        } else {
          $url = $json_response['url_preview'];
          $url_complete = $json_response['url'];

          $data = array(
            'exit_status' => array(
              'status' => 0
            ),
            'status' => 0,
            'query_status' => 'done',
            'params' => $query_params,
            'json_response' => $json_response,
            'htmlResponse' => '<iframe id="mmoda-gallery-iframe" src="' . $url .
            '" title="MMODA Gallery"></iframe><br/>
                        <p class="text-center current-message"><a href="' . $url_complete .
            '" target="_blank">Please visit the gallery to see the full list of products for this source >> </a></p>'
          );
        }
      }
    } catch (RequestException $e) {
      $data = array(
        'status' => - 1
      );
    }

    return $data;
  }
}
