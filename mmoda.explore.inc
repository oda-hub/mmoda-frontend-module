<?php

function explore_gallery_object($source_name)
{
  // $preview_example_url = 'http://cdciweb02.astro.unige.ch/mmoda/galleryd/node/5694/preview';
  // $complete_example_url = 'http://cdciweb02.astro.unige.ch/mmoda/galleryd/node/5694';

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
    $url_complete = $json_response['url'];
    // $url_complete = $complete_example_url;
    // $url = $preview_example_url;
    $data = array(
      'exit_status' => array(
        'status' => 0
      ),
      'status' => 0,
      'query_status' => 'done',
      'params' => $query_params,
      'json_response' => $json_response,
      'htmlResponse' => '<iframe id="mmoda-gallery-iframe" src="' . $url . '" title="MMODA Gallery"></iframe><br/>
                        <p class="text-center">Please visit the gallery to see the full list of products for this source <a href="' . $url_complete . '" target="_blank"> >> </a></p>'
    );
  }

  return $data;
}

