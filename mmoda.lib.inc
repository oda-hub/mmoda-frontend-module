<?php

/**
 */
function _mmoda_install_started()
{
  variable_set('mmoda_install_started', true);
}

/**
 */
function _mmoda_install_finished()
{
  variable_del('mmoda_install_started');
}

/**
 */
function _mmoda_uninstall_started()
{
  variable_set('mmoda_uninstall_started', true);
}

/**
 */
function _mmoda_uninstall_finished()
{
  variable_del('mmoda_uninstall_started');
}

/**
 */
function _mmoda_core($module_name)
{
  # $core_module_name = basename(__FILE__, '.lib.inc');
  list ($core_module_name) = explode('_', $module_name);
  return ($core_module_name == $module_name);
}

/**
 * Implements hook_install().
 */
function _mmoda_common_install($module_name, $instrument, $module_settings)
{
  _mmoda_install_started();
  list ($core_module_name) = explode('_', $module_name);
  $core_module_settings = array();

  $module_settings['help_page_nids'] = array();

  $field_mmoda_module = field_info_field('field_mmoda_module');
  if (_mmoda_core($module_name)) {
    $core_module_settings = $module_settings;
    $core_module_settings['module_name'] = $core_module_name;
    $field_mmoda_module['settings']['allowed_values'][$module_name] = strtoupper($module_name);
  } else {
    $core_module_settings = variable_get($core_module_name . '_settings');
    $core_module_settings['instruments'][$instrument] = $module_settings;
    $core_module_settings['module_instrument'][$module_name] = $instrument;
    $field_mmoda_module['settings']['allowed_values'][$module_name] = $module_settings['title'];
  }
  field_update_field($field_mmoda_module);

  variable_set($core_module_name . '_settings', $core_module_settings);

  // add help nodes
  _mmoda_help_pages_import($core_module_name, $module_name, $instrument);

  _mmoda_install_finished();
}

/**
 * Implements hook_uninstall().
 */
function _mmoda_common_uninstall($module_name, $instrument = '')
{
  list ($core_module_name) = explode('_', $module_name);
  _mmoda_uninstall_started();
  $core_module_settings = variable_get($core_module_name . '_settings');

  // Delete module help page nodes
  _mmoda_help_pages_delete($core_module_name, $module_name, $instrument);

  // Delete module settings
  if (_mmoda_core($module_name)) {
    variable_del($module_name . '_settings');
  } else {
    unset($core_module_settings['instruments'][$instrument]);
    variable_set($core_module_name . '_settings', $core_module_settings);
  }
  $field_mmoda_module = field_info_field('field_mmoda_module');
  if (isset($field_mmoda_module['settings']['allowed_values'][$module_name])) {
    unset($core_module_settings['module_instrument'][$module_name]);
    unset($field_mmoda_module['settings']['allowed_values'][$module_name]);
    field_update_field($field_mmoda_module);
  }
  _mmoda_uninstall_finished();
}

/**
 * .
 */
function _mmoda_build_tree(array $elements, $parentId = 0)
{
  $branch = array();

  foreach ($elements as $element) {
    if ($element['parent_id'] == $parentId) {
      $children = _mmoda_build_tree($elements, $element['id']);
      if ($children) {
        $element['children'] = $children;
      }
      $branch[] = $element;
    }
  }
  return $branch;
}

/**
 * .
 */
function _mmoda_get_node_root_uuids(array $elements)
{
  $all_ids = array();
  foreach ($elements as $element) {
    $all_ids[] = $element['id'];
  }
  $root_ids = array();
  foreach ($elements as $element) {
    if (! in_array($element['parent_id'], $all_ids)) {
      $root_ids[] = $element;
    }
  }
  return $root_ids;
}

/**
 * .
 */
function _mmoda_import_nodes_tree(array $nodes_tree, &$help_page_nids)
{
  foreach ($nodes_tree as $node_tree) {
    $help_file =$node_tree['file_name'];
    $node_export = file_get_contents($help_file);
    if (! empty($node_export)) {
      $import_output = node_export_import($node_export);
      // error_log(print_r($import_output, true));
      if ($import_output['success']) {
        $node = node_load($import_output['nids'][0]);
        $node->uid = 1;
        $node->status = 1;
        node_save($node);
        $help_page_nids[] = $import_output['nids'][0];
        drupal_set_message("Help file $help_file imported successfully");
      }
      if (isset($node_tree['children'])) {
        _mmoda_import_nodes_tree($node_tree['children'], $help_page_nids);
      }
    } else {
      throw new Exception("Can not load xml help page file $help_file !");
    }
  }
}

/**
 * .
 */
function _mmoda_help_pages_import($core_module_name, $module_name, $instrument = '')
{
  $module_path = drupal_get_path('module', $module_name);
  $help_pages_dir = $module_path . '/help_book';

  if (! is_dir($help_pages_dir))
    return;

  $book_root_files = array();
  $book_parent_files = array();
  $not_book_root_files = array();

  $dh = @opendir($help_pages_dir);
  $pages_hierarchy = array();
  if (FALSE !== $dh)
    while (($help_file = readdir($dh)) !== FALSE) {
      if (! preg_match('/\.php$/', $help_file)) {
        continue;
      }
      $help_file = $help_pages_dir . DIRECTORY_SEPARATOR . $help_file;
      $code_string = file_get_contents($help_file);
      $node = node_export_drupal_import($code_string)[0];
      $node_export_book = $node->node_export_book;
      // error_log('Node export books:'.print_r($node_export_book, true));
      if ($node_export_book['#is_root'])
        $book_root_files[] = $help_file;
      else if ($node_export_book['#book_uuid'] == $node_export_book['#parent_uuid'])
        $book_parent_files[] = $help_file;
      else
        $not_book_root_files[] = $help_file;

      array_push($pages_hierarchy, array(
        'id' => $node->uuid,
        'parent_id' => $node->node_export_book['#parent_uuid'],
        'file_name' => $help_file
      ));
    }
  else {
    throw new Exception("The help pages directory is not readable.\nCan not import help pages !");
  }
  closedir($dh);
  $root_ids = _mmoda_get_node_root_uuids($pages_hierarchy);
  $help_page_nids = array();
  foreach ($root_ids as $element) {
    $nodes_tree = _mmoda_build_tree($pages_hierarchy, $element['id']);
    _mmoda_import_nodes_tree(array($element), $help_page_nids);
    _mmoda_import_nodes_tree($nodes_tree, $help_page_nids);
  }

  $module_settings = variable_get($core_module_name . '_settings', array());
  if (empty($instrument))
    $module_settings['help_page_nids'] = $help_page_nids;
  else
    $module_settings['instruments'][$instrument]['help_page_nids'] = $help_page_nids;
  $module_settings['modules'][$module_name]['just_installed'] = count($help_page_nids);

  variable_set($core_module_name . '_settings', $module_settings);
}

function _mmoda_help_pages_delete($core_module_name, $module_name, $instrument = '')
{
  $module_settings = variable_get($core_module_name . '_settings', array());

  if ($module_name == $core_module_name)
    $help_page_nids = $module_settings['help_page_nids'];
  else
    $help_page_nids = $module_settings['instruments'][$instrument]['help_page_nids'];

  // Delete module help pages
  node_delete_multiple($help_page_nids);
}

function _mmodaa_instrument_enable($instrument)
{
  $core_module_name = basename(__FILE__, '.lib.inc');

  $core_module_settings = variable_get($core_module_name . '_settings');
  $core_module_settings['instruments'][$instrument]['enabled'] = true;
  variable_set($core_module_name . '_settings', $core_module_settings);
}

function _mmodaa_instrument_disable($instrument)
{
  $core_module_name = basename(__FILE__, '.lib.inc');

  $core_module_settings = variable_get($core_module_name . '_settings');
  $core_module_settings['instruments'][$instrument]['enabled'] = false;
  variable_set($core_module_name . '_settings', $core_module_settings);
}

/**
 * Return all users who have the given role.
 *
 * @param int|string $role
 *          Name of the role or the ID or the role.
 * @param bool|TRUE $active_user
 *          Determine, if only the active users should be returned.
 * @return array Array of user objects.
 */
function mmoda_get_users_with_role($role, $active_user = TRUE)
{
  $users = array();
  $rid = 0;
  if (is_int($role)) {
    $rid = $role;
  } else {
    if ($role_obj = user_role_load_by_name($role)) {
      $rid = $role_obj->rid;
    }
  }
  if ($rid) {
    $uids = db_select('users_roles', 'ur')->fields('ur', array(
      'uid'
    ))
      ->condition('ur.rid', $rid)
      ->execute()
      ->fetchCol();
    if (! empty($uids)) {
      $query = new EntityFieldQuery();
      $query->entityCondition('entity_type', 'user')->propertyCondition('uid', $uids, 'IN');
      if ($active_user) {
        $query->propertyCondition('status', 1);
      }
      $entities = $query->execute();
      if (! empty($entities)) {
        $users = user_load_multiple(array_keys($entities['user']));
      }
    }
  }

  return $users;
}
