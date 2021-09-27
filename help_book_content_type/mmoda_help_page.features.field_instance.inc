<?php

/**
 * @file
 * mmoda_help_page.features.field_instance.inc
 */

/**
 * Implements hook_field_default_field_instances().
 */
function mmoda_help_page_field_default_field_instances() {
  $field_instances = array();

  // Exported field_instance: 'node-mmoda_help_page-body'.
  $field_instances['node-mmoda_help_page-body'] = array(
    'bundle' => 'mmoda_help_page',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'hidden',
        'module' => 'text',
        'settings' => array(),
        'type' => 'text_default',
        'weight' => 0,
      ),
      'teaser' => array(
        'label' => 'hidden',
        'module' => 'text',
        'settings' => array(
          'trim_length' => 600,
        ),
        'type' => 'text_summary_or_trimmed',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'body',
    'label' => 'Body',
    'required' => FALSE,
    'settings' => array(
      'display_summary' => TRUE,
      'text_processing' => 1,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'module' => 'text',
      'settings' => array(
        'rows' => 20,
        'summary_rows' => 5,
      ),
      'type' => 'text_textarea_with_summary',
      'weight' => 3,
    ),
  );

  // Exported field_instance:
  // 'node-mmoda_help_page-field_mmoda_images_to_insert'.
  $field_instances['node-mmoda_help_page-field_mmoda_images_to_insert'] = array(
    'bundle' => 'mmoda_help_page',
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'hidden',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 2,
      ),
      'teaser' => array(
        'label' => 'hidden',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_mmoda_images_to_insert',
    'label' => 'Images to insert',
    'required' => 0,
    'settings' => array(
      'alt_field' => 1,
      'default_image' => 0,
      'file_directory' => '',
      'file_extensions' => 'png gif jpg jpeg',
      'filefield_paths' => array(
        'active_updating' => 1,
        'file_name' => array(
          'options' => array(
            'pathauto' => 1,
            'slashes' => 1,
            'transliterate' => 0,
          ),
          'value' => '[file:ffp-name-only-original].[file:ffp-extension-original]',
        ),
        'file_path' => array(
          'options' => array(
            'pathauto' => 1,
            'slashes' => 1,
            'transliterate' => 0,
          ),
          'value' => 'mmoda/help/[node:field_mmoda_module]',
        ),
        'redirect' => FALSE,
        'retroactive_update' => 1,
      ),
      'filefield_paths_enabled' => 1,
      'max_filesize' => '',
      'max_resolution' => '',
      'min_resolution' => '',
      'title_field' => 1,
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'image',
      'settings' => array(
        'insert' => 1,
        'insert_absolute' => 0,
        'insert_class' => 'same-gallery',
        'insert_default' => 'colorbox__large',
        'insert_styles' => array(
          'auto' => 0,
          'colorbox__large' => 'colorbox__large',
          'colorbox__media_thumbnail' => 'colorbox__media_thumbnail',
          'colorbox__medium' => 'colorbox__medium',
          'colorbox__mmoda_width_800px' => 'colorbox__mmoda_width_800px',
          'colorbox__thumbnail' => 'colorbox__thumbnail',
          'icon_link' => 0,
          'image' => 'image',
          'image_large' => 0,
          'image_media_thumbnail' => 0,
          'image_medium' => 0,
          'image_mmoda_width_800px' => 0,
          'image_thumbnail' => 0,
          'link' => 0,
        ),
        'insert_width' => '',
        'preview_image_style' => 'thumbnail',
        'progress_indicator' => 'throbber',
      ),
      'type' => 'image_image',
      'weight' => 4,
    ),
  );

  // Exported field_instance: 'node-mmoda_help_page-field_mmoda_module'.
  $field_instances['node-mmoda_help_page-field_mmoda_module'] = array(
    'bundle' => 'mmoda_help_page',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 1,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_mmoda_module',
    'label' => 'MMODA module',
    'required' => 1,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => 1,
    ),
  );

  // Translatables
  // Included for use with string extractors like potx.
  t('Body');
  t('Images to insert');
  t('MMODA module');

  return $field_instances;
}
