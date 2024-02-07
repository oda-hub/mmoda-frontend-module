<?php

/**
 * @file
 * Provides a block displaying prayer times for the visitor's location
 */

/**
 */
function mmoda_euclid($form, &$form_state)
{
  $form = array();
  
  $form['#tree'] = FALSE;
  $mform_id = __FUNCTION__ . '_';
  
  $form['#method'] = 'POST';
  $form['#attributes'] = array(
    'class' => 'euclid-form'
  );
  
  $form['instrument'] = array(
    '#type' => 'hidden',
    '#value' => 'example'
  );
  
  $mmoda_settings = variable_get('mmoda_settings');
  $instrument_defaults = $mmoda_settings['instruments']['euclid'];
  
  $form['query_type'] = array(
    '#type' => 'hidden',
    '#value' => $instrument_defaults['query_type']
  );
  
  $form['product_type'] = array(
    '#type' => 'radios',
    '#title' => t("Product Type"),
    '#description' => t("Select product type"),
    '#attributes' => array(
      'name' => $mform_id . 'product_type'
    ),
    '#default_value' => $instrument_defaults['product_type'],
    '#options' => array(
      
      'Run_Phosphoros_basic' => 'Run phosphoros basic'
    ),
    '#parent_classes' => array(
      'form-group',
      'col-md-6'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#prefix' => '<hr class="hr-default" /><div class="row">',
    '#suffix' => '</div><hr class="hr-default" />'
  );
  
  $form['Catalog_URL'] = array(
    
    '#type' => 'textfield',
    
    '#title' => t("Catalog_URL"),
    '#default_value' => $instrument_defaults['Catalog_URL'],
    
    '#states' => array(
      
      'visible' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'Run_Phosphoros_basic'
          )
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'Run_Phosphoros_basic'
          )
        )
      )
    ),
    
    '#attributes' => array(
      'name' => $mform_id . 'Catalog_URL'
    ),
    '#parent_classes' => array(
      'form-group',
      'col-md-6'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#prefix' => '<div class="row">',
    '#suffix' => '</div>'
  );
  
  $form['ab_magnitude'] = array(
    
    '#type' => 'radios',
    '#options' => array(
      True => 'True',
      False => 'False'
    ),
    
    '#title' => t("ab_magnitude"),
    '#default_value' => $instrument_defaults['ab_magnitude'],
    
    '#states' => array(
      
      'visible' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'Run_Phosphoros_basic'
          )
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'Run_Phosphoros_basic'
          )
        )
      )
    ),
    
    '#attributes' => array(
      'name' => $mform_id . 'ab_magnitude'
    ),
    '#parent_classes' => array(
      'form-group',
      'col-md-6'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#prefix' => '<div class="row">',
    '#suffix' => '</div>'
  );
  
  $form['column_name_DustColumnDensity'] = array(
    
    '#type' => 'textfield',
    
    '#title' => t("column_name_DustColumnDensity"),
    '#default_value' => $instrument_defaults['column_name_DustColumnDensity'],
    
    '#states' => array(
      
      'visible' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'Run_Phosphoros_basic'
          )
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'Run_Phosphoros_basic'
          )
        )
      )
    ),
    
    '#attributes' => array(
      'name' => $mform_id . 'column_name_DustColumnDensity'
    ),
    '#parent_classes' => array(
      'form-group',
      'col-md-6'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#prefix' => '<div class="row">',
    '#suffix' => '</div>'
  );
  
  $form['column_name_SourceID'] = array(
    
    '#type' => 'textfield',
    
    '#title' => t("column_name_SourceID"),
    '#default_value' => $instrument_defaults['column_name_SourceID'],
    
    '#states' => array(
      
      'visible' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'Run_Phosphoros_basic'
          )
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'Run_Phosphoros_basic'
          )
        )
      )
    ),
    
    '#attributes' => array(
      'name' => $mform_id . 'column_name_SourceID'
    ),
    '#parent_classes' => array(
      'form-group',
      'col-md-6'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#prefix' => '<div class="row">',
    '#suffix' => '</div>'
  );
  
  $instruments_filters = array();
  foreach ($instrument_defaults['filters_table'] as $instrument => $filters) {
    if (! array_key_exists($instrument, $instruments_filters))
      $instruments_filters[$instrument] = array();
      foreach ($filters as $filter) {
        $instruments_filters[$instrument][$instrument . '|' . $filter] = $filter;
      }
  }
  
  $form['filters'] = array(
    '#type' => 'container',
    '#title' => t('Filters'),
    '#attributes' => array(
      'class' => array(
        'euclid-instruments-filters multivalued-field'
      )
    ),
    '#suffix' => '<hr>'
  );
  
  $form['filters']['filters[filter][]'] = array(
    '#type' => 'select',
    '#title' => t('Filter'),
    '#required' => TRUE,
    '#options' => $instruments_filters,
    '#parent_classes' => array(
      'col-md-4'
    ),
    '#prefix' => '<label class="control-label" for="edit-integral-data-rights">Filters</label>' . '<div class="row form-group multivalued-value">'
  );
  $form['filters']['filters[flux][]'] = array(
    '#type' => 'textfield',
    '#title' => t('Flux column name'),
    '#required' => TRUE,
    '#parent_classes' => array(
      'col-md-3'
    )
  );
  $form['filters']['filters[flux_error][]'] = array(
    '#type' => 'textfield',
    '#title' => t('Flux error column name'),
    '#required' => TRUE,
    '#parent_classes' => array(
      'col-md-3'
    ),
    '#suffix' => '</div>'
  );
  
  drupal_add_js(array(
    'euclid-filters' => $instrument_defaults['filters_table']
  ), 'setting');
  
  $form['flag_MissingPhotometry'] = array(
    
    '#type' => 'textfield',
    
    '#title' => t("flag_MissingPhotometry"),
    '#default_value' => $instrument_defaults['flag_MissingPhotometry'],
    
    '#states' => array(
      
      'visible' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'Run_Phosphoros_basic'
          )
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'Run_Phosphoros_basic'
          )
        )
      )
    ),
    
    '#attributes' => array(
      'name' => $mform_id . 'flag_MissingPhotometry'
    ),
    '#parent_classes' => array(
      'form-group',
      'col-md-6'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#prefix' => '<div class="row">',
    '#suffix' => '</div>'
  );
  
  $form['flag_UpperLimit'] = array(
    
    '#type' => 'textfield',
    
    '#title' => t("flag_UpperLimit"),
    '#default_value' => $instrument_defaults['flag_UpperLimit'],
    
    '#states' => array(
      
      'visible' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'Run_Phosphoros_basic'
          )
        )
      ),
      'enabled' => array(
        ':input[name="' . $mform_id . 'product_type"]' => array(
          array(
            'value' => 'Run_Phosphoros_basic'
          )
        )
      )
    ),
    
    '#attributes' => array(
      'name' => $mform_id . 'flag_UpperLimit'
    ),
    '#parent_classes' => array(
      'form-group',
      'col-md-6'
    ),
    '#label_classes' => array(
      'control-label'
    ),
    '#prefix' => '<div class="row">',
    '#suffix' => '</div>'
  );
  
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit'),
    '#prefix' => '<hr class="hr-default" />'
  );
  
  form_load_include($form_state, 'inc', 'mmoda', 'mmoda.euclid');
  
  return ($form);
}