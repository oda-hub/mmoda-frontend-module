<?php

function explore_gallery_object($source_name)
{
  $url = "https://www.astro.unige.ch/mmoda/gallery/astro_entities/all_sources?_format=hal_json&src_name=Mrk+421";
  $ourl = 'https://cdcidev.mtmco.net/mmoda/galleryd/node/5694/preview';
  // $ourl = 'http://cdciweb02.isdc.unige.ch/mmoda/galleryd/node/5694/preview';
  // $ourl = 'https://www.astro.unige.ch/mmoda/galleryd/node/5694/preview';
  $mmoda_settings = variable_get('mmoda_settings');
  $gallery_data_request = $mmoda_settings['common']['gallery_data_request'] . '?src_name=' . drupal_encode_path($source_name);
  $gallery_base_url = $mmoda_settings['common']['gallery_base_url'];
  error_log('mmoda_settings:' . print_r($mmoda_settings, true));
  error_log('gallery_data_request:' . $gallery_data_request);
  error_log('gallery_base_url:' . $gallery_base_url);

  $request = drupal_http_request($gallery_data_request);
  $json_response = drupal_json_decode($request->data);
  // drupal_add_http_header('X-Frame-Options', 'allow-from https://www.astro.unige.ch/', FALSE);
  if (empty($json_response)) {
    $data = array(
      'status' => - 1
    );
  } else {
    //$ourl = $json_response['url_preview'];
    $ourl = str_replace($gallery_base_url, 'https://cdcidev.mtmco.net', $json_response['url_preview']);
    //$ourl = str_replace('http', 'https', $ourl);
    $ourl = str_replace('gallery', 'galleryd', $ourl);
    $data = array(
      'exit_status' => array(
        'status' => 0
      ),
      'status' => 0,
      'query_status' => 'done',
      'params' => $query_params,
      'json_response' => $json_response,
      'htmlResponse' => '<iframe id="mmoda-gallery-iframe" src="' . $ourl . '" title="MMODA Gallery"></iframe>'
    );
  }

  return $data;
}

/*
function write_log_file($xml) {
  $filename = '/tmp/sesame_response.xml';
  $f = fopen ( $filename, 'w' );
  fwrite ( $f, "URL:" . $name_resolver_url . "\n" );
  fwrite ( $f, "Name:" . (string) $xml->Target->Resolver->attributes()->name[0]. "\n" );
  fwrite ( $f, "INFO:" . (string) $xml->Target->INFO. "\n" );
  fwrite ( $f, "XML:\n" );
  fwrite ( $f, print_r ( $xml, TRUE ) );
  fclose ( $f );

  chmod ( $filename, 0777 );

}
*/
