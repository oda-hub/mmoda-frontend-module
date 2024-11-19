

<?php

/**
 * @file
 * Provides a block displaying prayer times for the visitor's location
 */

/**
 */
function mmoda_crbeam($form, &$form_state)
{
  $form = array();

  $form['#tree'] = FALSE;
  // turn off form caching
  $mform_id = __FUNCTION__ . '_';

  $form['#action'] = 'dispatch-data/run_analysis';
  $form['#method'] = 'POST';
  $form['#attributes'] = array(
    'class' => 'crbeam-form'
  );

  $form['instrument'] = array(
    '#type' => 'hidden',
    '#value' => 'crbeam',
    '#attributes' => array(
      'integral_instrument' => 'false',
      'support_return_progress' => 'true'
    )
  );

  $mmoda_settings = variable_get('mmoda_settings');
  $instrument_defaults = $mmoda_settings['instruments']['crbeam'];

  $form['query_type'] = array(
    '#type' => 'hidden',
    '#value' => $instrument_defaults['query_type'],
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
      
      'Generate_events' => 'Generate events',
      
      'histogram_column' => 'Histogram column',
      
      'compute_new_column' => 'Compute new column',
      
      'CRbeam' => 'Crbeam',
      
      'model_CTA_events' => 'Model cta events',
      
      'filter_table' => 'Filter table',
      
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

  
    


  
      
      $form['z_start'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("z_start"),
        
        '#default_value' => $instrument_defaults['z_start'],
        
        
          '#states' => array(
            
            
            
            
            
            
            
            
            'visible' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            ),
            'enabled' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            )
          ),
        
        '#attributes' => array(
          'name' => $mform_id . 'z_start',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['Npart'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("Npart"),
        
        '#default_value' => $instrument_defaults['Npart'],
        
        
          '#states' => array(
            
            
            
            
            
            
            
            
            'visible' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            ),
            'enabled' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            )
          ),
        
        '#attributes' => array(
          'name' => $mform_id . 'Npart',
          
          
              
              'data-bv-between-max' => '100000',
              'data-bv-between-min' => '1',
              'data-bv-between' => 'true',
              
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['particle_type'] = array(
      
        
        '#type' => 'select',
        '#options' => array(
          
          'electron' => 'electron',
          
          'gamma' => 'gamma',
          
          'proton' => 'proton',
          
        ),
        
        
        '#title' => t("particle_type"),
        
        '#default_value' => $instrument_defaults['particle_type'],
        
        
          '#states' => array(
            
            
            
            
            
            
            
            
            'visible' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            ),
            'enabled' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            )
          ),
        
        '#attributes' => array(
          'name' => $mform_id . 'particle_type',
          
          
              
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['Emax'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("Emax"),
        
        '#default_value' => $instrument_defaults['Emax'],
        
        '#field_suffix' => t("TeV"),
        
        
          '#states' => array(
            
            
            
            
            
            
            
            
            'visible' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            ),
            'enabled' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            )
          ),
        
        '#attributes' => array(
          'name' => $mform_id . 'Emax',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['Emin'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("Emin"),
        
        '#default_value' => $instrument_defaults['Emin'],
        
        '#field_suffix' => t("TeV"),
        
        
          '#states' => array(
            
            
            
            
            
            
            
            
            'visible' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            ),
            'enabled' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            )
          ),
        
        '#attributes' => array(
          'name' => $mform_id . 'Emin',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['EminSource'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("EminSource"),
        
        '#default_value' => $instrument_defaults['EminSource'],
        
        '#field_suffix' => t("TeV"),
        
        
          '#states' => array(
            
            
            
            
            
            
            
            
            'visible' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            ),
            'enabled' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            )
          ),
        
        '#attributes' => array(
          'name' => $mform_id . 'EminSource',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['Gamma'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("Gamma"),
        
        '#default_value' => $instrument_defaults['Gamma'],
        
        
          '#states' => array(
            
            
            
            
            
            
            
            
            'visible' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            ),
            'enabled' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            )
          ),
        
        '#attributes' => array(
          'name' => $mform_id . 'Gamma',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['EGMF_fG'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("EGMF_fG"),
        
        '#default_value' => $instrument_defaults['EGMF_fG'],
        
        
          '#states' => array(
            
            
            
            
            
            
            
            
            'visible' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            ),
            'enabled' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            )
          ),
        
        '#attributes' => array(
          'name' => $mform_id . 'EGMF_fG',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['lmaxEGMF_Mpc'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("lmaxEGMF_Mpc"),
        
        '#default_value' => $instrument_defaults['lmaxEGMF_Mpc'],
        
        
          '#states' => array(
            
            
            
            
            
            
            
            
            'visible' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            ),
            'enabled' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            )
          ),
        
        '#attributes' => array(
          'name' => $mform_id . 'lmaxEGMF_Mpc',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['jet_half_size'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("jet_half_size"),
        
        '#default_value' => $instrument_defaults['jet_half_size'],
        
        '#field_suffix' => t("deg"),
        
        
          '#states' => array(
            
            
            
            
            
            
            
            
            'visible' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            ),
            'enabled' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            )
          ),
        
        '#attributes' => array(
          'name' => $mform_id . 'jet_half_size',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['jet_direction'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("jet_direction"),
        
        '#default_value' => $instrument_defaults['jet_direction'],
        
        '#field_suffix' => t("deg"),
        
        
          '#states' => array(
            
            
            
            
            
            
            
            
            'visible' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            ),
            'enabled' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            )
          ),
        
        '#attributes' => array(
          'name' => $mform_id . 'jet_direction',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['psf'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("psf"),
        
        '#default_value' => $instrument_defaults['psf'],
        
        '#field_suffix' => t("deg"),
        
        
          '#states' => array(
            
            
            
            
            
            
            'visible' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam')
              ),
            ),
            'enabled' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam')
              ),
            )
          ),
        
        '#attributes' => array(
          'name' => $mform_id . 'psf',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['window_size_RA'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("window_size_RA"),
        
        '#default_value' => $instrument_defaults['window_size_RA'],
        
        '#field_suffix' => t("deg"),
        
        
          '#states' => array(
            
            
            
            
            
            
            
            
            'visible' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            ),
            'enabled' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            )
          ),
        
        '#attributes' => array(
          'name' => $mform_id . 'window_size_RA',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['window_size_DEC'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("window_size_DEC"),
        
        '#default_value' => $instrument_defaults['window_size_DEC'],
        
        '#field_suffix' => t("deg"),
        
        
          '#states' => array(
            
            
            
            
            
            
            
            
            'visible' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            ),
            'enabled' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            )
          ),
        
        '#attributes' => array(
          'name' => $mform_id . 'window_size_DEC',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

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
        
        
        '#title' => t("EBL"),
        
        '#default_value' => $instrument_defaults['EBL'],
        
        
          '#states' => array(
            
            
            
            
            
            
            
            
            'visible' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            ),
            'enabled' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'Generate_events'), 'or', array('value' => 'CRbeam'), 'or', array('value' => 'model_CTA_events')
              ),
            )
          ),
        
        '#attributes' => array(
          'name' => $mform_id . 'EBL',
          
          
              
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
    
      
      $form['fn_type'] = array(
      
        '#type' => 'radios',
        
        '#title' =>  fn",
        
        
        
          '#states' => array(
            
            
            
            
            
            
            
            
            'visible' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'histogram_column'), 'or', array('value' => 'compute_new_column'), 'or', array('value' => 'filter_table')
              )
              
            ),
            'enabled' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'histogram_column'), 'or', array('value' => 'compute_new_column'), 'or', array('value' => 'filter_table')
              )
              
            )
          ),
          
          '#attributes' => array(
            
            'name' => $mform_id . 'fn_type',
            
          ),
          
          '#options' => array(
            'file' => t('Upload a file'),
            'url' => t('Provide a URL')
          ),
            
          '#default_value' => 'file',
            
          
          '#parent_classes' => array(
            'form-group',
            'col-md-8'
          ),

          '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
      
      $form['fn_url'] = array(
      
        '#type' => 'textfield',
        
        '#title' => t('File URL'),
        
        
        
          '#states' => array(
            
            
            
            
            
            
            
            
            'visible' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'histogram_column'), 'or', array('value' => 'compute_new_column'), 'or', array('value' => 'filter_table')
              )
              
                ,'and',
                ':input[name="' . $mform_id . 'fn_type"]' => array(
                  array('value' => 'url')
                )
              
            ),
            'enabled' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'histogram_column'), 'or', array('value' => 'compute_new_column'), 'or', array('value' => 'filter_table')
              )
              
                ,'and',
                ':input[name="' . $mform_id . 'fn_type"]' => array(
                  array('value' => 'url')
                )
              
            )
          ),
          
          '#attributes' => array(
            
            'name' => $mform_id . 'fn',
            
          ),
          
          '#parent_classes' => array(
            'form-group',
            'col-md-8'
          ),

          '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
      
      $form['fn_file'] = array(
      
        '#type' => 'file',
        
        '#title' => t('Upload a file'),
        
        
        
          '#states' => array(
            
            
            
            
            
            
            
            
            'visible' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'histogram_column'), 'or', array('value' => 'compute_new_column'), 'or', array('value' => 'filter_table')
              )
              
                ,'and',
                ':input[name="' . $mform_id . 'fn_type"]' => array(
                  array('value' => 'file')
                )
              
            ),
            'enabled' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'histogram_column'), 'or', array('value' => 'compute_new_column'), 'or', array('value' => 'filter_table')
              )
              
                ,'and',
                ':input[name="' . $mform_id . 'fn_type"]' => array(
                  array('value' => 'file')
                )
              
            )
          ),
          
          '#attributes' => array(
            
            'name' => $mform_id . 'fn',
            
          ),
          
          '#parent_classes' => array(
            'form-group',
            'col-md-8'
          ),

          '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
  
    
  
    


  
      
      $form['sep'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("sep"),
        
        '#default_value' => $instrument_defaults['sep'],
        
        
          '#states' => array(
            
            
            
            
            
            
            
            
            'visible' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'histogram_column'), 'or', array('value' => 'compute_new_column'), 'or', array('value' => 'filter_table')
              ),
            ),
            'enabled' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'histogram_column'), 'or', array('value' => 'compute_new_column'), 'or', array('value' => 'filter_table')
              ),
            )
          ),
        
        '#attributes' => array(
          'name' => $mform_id . 'sep',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['column'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("column"),
        
        '#default_value' => $instrument_defaults['column'],
        
        
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
        
        '#attributes' => array(
          'name' => $mform_id . 'column',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['weights'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("weights"),
        
        '#default_value' => $instrument_defaults['weights'],
        
        
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
        
        '#attributes' => array(
          'name' => $mform_id . 'weights',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['binning'] = array(
      
        
        '#type' => 'select',
        '#options' => array(
          
          'linear' => 'linear',
          
          'logarithmic' => 'logarithmic',
          
        ),
        
        
        '#title' => t("binning"),
        
        '#default_value' => $instrument_defaults['binning'],
        
        
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
        
        '#attributes' => array(
          'name' => $mform_id . 'binning',
          
          
              
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['minval'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("minval"),
        
        '#default_value' => $instrument_defaults['minval'],
        
        
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
        
        '#attributes' => array(
          'name' => $mform_id . 'minval',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['maxval'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("maxval"),
        
        '#default_value' => $instrument_defaults['maxval'],
        
        
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
        
        '#attributes' => array(
          'name' => $mform_id . 'maxval',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['nbins'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("nbins"),
        
        '#default_value' => $instrument_defaults['nbins'],
        
        
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
        
        '#attributes' => array(
          'name' => $mform_id . 'nbins',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['xlabel'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("xlabel"),
        
        '#default_value' => $instrument_defaults['xlabel'],
        
        
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
        
        '#attributes' => array(
          'name' => $mform_id . 'xlabel',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['ylabel'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("ylabel"),
        
        '#default_value' => $instrument_defaults['ylabel'],
        
        
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
        
        '#attributes' => array(
          'name' => $mform_id . 'ylabel',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['new_column'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("new_column"),
        
        '#default_value' => $instrument_defaults['new_column'],
        
        
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
        
        '#attributes' => array(
          'name' => $mform_id . 'new_column',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['expression'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("expression"),
        
        '#default_value' => $instrument_defaults['expression'],
        
        
          '#states' => array(
            
            
            
            
            
            
            'visible' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'compute_new_column'), 'or', array('value' => 'filter_table')
              ),
            ),
            'enabled' => array(
              ':input[name="' . $mform_id . 'product_type"]' => array(
                array('value' => 'compute_new_column'), 'or', array('value' => 'filter_table')
              ),
            )
          ),
        
        '#attributes' => array(
          'name' => $mform_id . 'expression',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  
    


  
      
      $form['livetime'] = array(
      
        
        '#type' => 'textfield',
        
        
        '#title' => t("livetime"),
        
        '#default_value' => $instrument_defaults['livetime'],
        
        '#field_suffix' => t("day"),
        
        
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
        
        '#attributes' => array(
          'name' => $mform_id . 'livetime',
          
          
        ),
        '#parent_classes' => array(
          'form-group',
          
          'col-md-6'
        ),
        '#label_classes' => array(
          'control-label'
        ),
        '#prefix' => '
                    <div class="row">',

          '#suffix' => '</div>'

      );
    
    
  

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit'),
    '#prefix' => '<hr class="hr-default" />'
  );

  form_load_include($form_state, 'inc', 'mmoda', 'mmoda.crbeam');

  return ($form);
}