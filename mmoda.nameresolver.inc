<?php

function resolve_object_name($source_name)
{
  // $local_name_resolver_url = "https://resolver-prod.obsuks1.unige.ch/api/v1.1/byname/";
  $local_name_resolver_url = "https://resolver.odahub.fr/api/v1.1/byname/";
  $name_resolver_url = "http://cdsweb.u-strasbg.fr/cgi-bin/nph-sesame/-oxp/SNV?";
  // sleep ( 2 );

  $data = array();

  $data['status'] = - 1;
  $data['message'] = 'Resolution failed ! we are working on fixing it.<br>Please try later ...';

  // resolve locally first
  $local_name_resolver_url .= rawurlencode($source_name);
  watchdog('MMODA', 'local name resolver URL request is: @url', array('@url' => $local_name_resolver_url), WATCHDOG_DEBUG);
  $local_resolution_ok = false;
  if ($response_json_string = @file_get_contents($local_name_resolver_url) and $response_json = json_decode($response_json_string)) {
    if ($response_json->success) {
      if($response_json->have_coordinates and $response_json->success_coordinates) {
        $data['ra'] = $response_json->ra;
        $data['dec'] = $response_json->dec;
      }
      $data['status'] = 0;
      $data['message'] = 'Object resolved by local resolver.';
      if ($response_json->success_time) {
        $data['t1'] = $response_json->view->t1;
        $data['t2'] = $response_json->view->t2;
      }
      return $data;
    } else {
      watchdog('MMODA', 'Object name can not be resolved by local name resolver: @url , content as a string of the respons is: @response_json_string', 
      array('@url' => $local_name_resolver_url, '@response_json_string' => json_encode($response_json, JSON_PRETTY_PRINT)), WATCHDOG_DEBUG);
      error_log("Object name can not be resolved by local name resolver: " . $local_name_resolver_url);
    }
  } else {
    watchdog('MMODA', 'Local name resolver error: @url', array('@url' => $local_name_resolver_url), WATCHDOG_DEBUG);
    error_log("Local name resolver error: " . $local_name_resolver_url);
  }

  libxml_use_internal_errors(true);
  $name_resolver_url .= rawurlencode($source_name);
  $xml = simplexml_load_file($name_resolver_url, 'SimpleXMLElement', LIBXML_NOWARNING);
  if (false === $xml) {
    error_log("Failed getting XML for name resolution: " . $name_resolver_url);
    foreach (libxml_get_errors() as $error) {
      error_log($error->message);
    }
    $data['message'] = 'Failed to resolve name.<br>Please try later ...';
  } else if (! isset($xml->Target->Resolver->jradeg)) {
    error_log('Object name can not be resolved by remote name resolver:' . $name_resolver_url . "\n" . $xml->Target->INFO);
    $data['message'] = $source_name . ': The requested object could not be resolved.';
    $data['extra_message'] = 'This may be due to an incorrect input or a temporary unavailability of the external service(s) we rely on.';
  } else {
    if (is_array($xml->Target->Resolver->jradeg)) {
      $ra = floatval($xml->Target->Resolver->jradeg['0']);
      $dec = floatval($xml->Target->Resolver->jdedeg['0']);
    } else {
      $ra = floatval($xml->Target->Resolver->jradeg);
      $dec = floatval($xml->Target->Resolver->jdedeg);
    }
    $nameresolver = explode('=', (string) $xml->Target->Resolver->attributes()->name[0])[1];
    $data['status'] = 0;
    $data['message'] = 'Object resolved using the external service ' . $nameresolver;
    $data['ra'] = $ra;
    $data['dec'] = $dec;
  }

  return $data;
}
