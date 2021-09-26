<?php

/**
 * @file
 * mmoda_help_page.features.field_base.inc
 */

/**
 * Implements hook_field_default_field_bases().
 */
function mmoda_help_page_field_default_field_bases() {
  $field_bases = array();

  // Exported field_base: 'field_mmoda_images_to_insert'.
  $field_bases['field_mmoda_images_to_insert'] = array(
    'active' => 1,
    'cardinality' => -1,
    'deleted' => 0,
    'entity_types' => array(),
    'field_name' => 'field_mmoda_images_to_insert',
    'indexes' => array(
      'fid' => array(
        0 => 'fid',
      ),
    ),
    'locked' => 0,
    'module' => 'image',
    'settings' => array(
      'default_image' => 0,
      'uri_scheme' => 'public',
    ),
    'translatable' => 0,
    'type' => 'image',
  );

  // Exported field_base: 'field_mmoda_module'.
  $field_bases['field_mmoda_module'] = array(
    'active' => 1,
    'cardinality' => 1,
    'deleted' => 0,
    'entity_types' => array(),
    'field_name' => 'field_mmoda_module',
    'indexes' => array(
      'value' => array(
        0 => 'value',
      ),
    ),
    'locked' => 0,
    'module' => 'list',
    'settings' => array(
      'allowed_values' => array(
        'astrooda' => 'MMODA',
        'astrooda_isgri' => 'MMODA ISGRI',
        'astrooda_jemx' => 'MMODA JEMX',
        'astrooda_antares' => 'MMODA Antares',
        'astrooda_magic' => 'MMODA Magic',
        'astrooda_spi_acs' => 'MMODA SPI ACS',
        'astrooda_polar' => 'MMODA Polar',
        'astrooda_multiproduct' => 'MMODA multi-product',
      ),
      'allowed_values_function' => '',
    ),
    'translatable' => 0,
    'type' => 'list_text',
  );

  return $field_bases;
}
