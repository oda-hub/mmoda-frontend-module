<?php

namespace Drupal\mmoda\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Form\FormBuilderInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a 'Example: Display a form' block.
 *
 * This example demonstrates the use of the form_builder service, an
 * instance of \Drupal\Core\Form\FormBuilder, in order to retrieve and display
 * a form.
 *
 * @Block(
 *   id = "mmoda_block",
 *   admin_label = @Translation("MMODA")
 * )
 */
class MmodaMainBlock extends BlockBase implements ContainerFactoryPluginInterface
{

  /**
   * Form builder service.
   *
   * @var \Drupal\Core\Form\FormBuilderInterface
   */
  protected $formBuilder;

  /**
   *
   * {@inheritdoc} This method sets the block default configuration. This configuration
   *               determines the block's behavior when a block is initially placed in a
   *               region. Default values for the block configuration form should be added to
   *               the configuration array. System default configurations are assembled in
   *               BlockBase::__construct() e.g. cache setting and block title visibility.
   *
   * @see \Drupal\block\BlockBase::__construct()
   */
  public function defaultConfiguration()
  {
    // return [
    // 'region' => 'content', // Set region to header
    // 'settings' => [
    // 'visibility' => [
    // 'request_path' => [
    // 'id' => 'request_path',
    // 'pages' => '<front>'
    // ]
    // ]
    // ]
    // ];
    return [];
  }

  /**
   *
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, FormBuilderInterface $form_builder)
  {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->formBuilder = $form_builder;
  }

  /**
   *
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition)
  {
    $configuration = array(
      // A unique ID for the block instance.
      'id' => 'devel_execute_php_1',
      // The plugin block id as defined in the class.
      'plugin' => 'devel_execute_php',
      // The machine name of the theme region.
      'region' => 'content',
      'settings' => array(
        'label' => 'Execute PHP'
      ),
      // The machine name of the theme.
      'theme' => 'mmoda_bootstrap5',
      'visibility' => array(),
      'weight' => 100
    );
    return new static($configuration, $plugin_id, $plugin_definition, $container->get('form_builder'));
  }

  /**
   *
   * {@inheritdoc}
   */
  public function build()
  {
    $instrument_settings = \Drupal::config('mmoda_isgri.settings');
    $isgri1 = [
      'name' => $instrument_settings->get('name'),
      'active' => 'active',
      'messenger' => $instrument_settings->get('messenger'),
      'title' => $instrument_settings->get('title'),
      'help_page_url' => $instrument_settings->get('help_page_url'),
      'acknowledgement' => $instrument_settings->get('acknowledgement'),
     // 'form' => $this->formBuilder->getForm(MmodaIsgriForm::class),
      'form' => $this->formBuilder->getForm('\Drupal\mmoda_isgri\Form\MmodaIsgriForm'),
      // 'form' => 'Coucou ISGRI',
      'help_page_url' => 'help/isgri'
    ];
    $isgri2 = [
      'name' => 'jemx',
      'active' => $instrument_settings->get('active'),
      'messenger' => $instrument_settings->get('messenger'),
      'title' => 'Jem-X1',
      'help_page_url' => $instrument_settings->get('help_page_url'),
      'acknowledgement' => $instrument_settings->get('acknowledgement'),
      // 'form' => $this->formBuilder->getForm(MmodaIsgriForm::class)
      'form' => 'Coucou JEM-X',
      'help_page_url' => 'help/jemx'
    ];

    $output = [
      '#region' => 'content',
      '#theme' => 'mmoda',
     # '#name_resolve_form' => $this->formBuilder->getForm(NameResolveForm::class),
      '#name_resolve_form' => $this->formBuilder->getForm('\Drupal\mmoda\Form\NameResolveForm'),

//       '#common_form' => $this->formBuilder->getForm(CommonForm::class),
      '#common_form' => $this->formBuilder->getForm('\Drupal\mmoda\Form\CommonForm'),

      '#instruments' => [
        $isgri1,
       // $isgri2
      ],
      'description' => [
        '#markup' => $this->t('Using form provided by @classname', [
          '@classname' => CommonForm::class
        ])
      ]
    ];

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
