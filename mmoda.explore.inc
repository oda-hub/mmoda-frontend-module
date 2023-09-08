<?php

function explore_gallery_object($source_name)
{
  //$preview_example_url = 'https://cdcidev.mtmco.net/mmoda/galleryd/node/5694/preview';

  $mmoda_settings = variable_get('mmoda_settings');
  $gallery_data_request = $mmoda_settings['common']['gallery_data_request'] . '?src_name=' . drupal_encode_path($source_name);

  $request = drupal_http_request($gallery_data_request);
  $json_response = drupal_json_decode($request->data);
  // drupal_add_http_header('X-Frame-Options', 'allow-from https://www.astro.unige.ch/', FALSE);
  if (empty($json_response)) {
    $data = array(
      'status' => - 1
    );
  } else {
    $url = $json_response['url_preview'];
    $data = array(
      'exit_status' => array(
        'status' => 0
      ),
      'status' => 0,
      'query_status' => 'done',
      'params' => $query_params,
      'json_response' => $json_response,
      'htmlResponse' => '<iframe id="mmoda-gallery-iframe" src="' . $url . '" title="MMODA Gallery"></iframe>'
    );
  }

  return $data;
}

