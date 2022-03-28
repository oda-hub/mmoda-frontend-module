<?php

/**
 * @file
 * mmoda_help_page.features.inc
 */

/**
 * Implements hook_node_info().
 */
function mmoda_node_info() {
  $items = array(
    'mmoda_help_page' => array(
      'name' => t('MMODA help page'),
      'base' => 'node_content',
      'description' => t('A dedicated content type for the help pages of the module MMODA.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
