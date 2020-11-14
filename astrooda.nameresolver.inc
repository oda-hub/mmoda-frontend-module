<?php
function resolve_object_name($source_name, $which_name_resolvers) {
<<<<<<< HEAD
  // $local_name_resolver_url = "http://cdcihn/tnr/api/v1.0/timespan/byname/";
  $local_name_resolver_url = "http://cdcihn/tnr-1.2/api/v1.1/byname/";
  // $local_name_resolver_url = "http://wwwcdcihn/tnr/api/v1.0/timespan/byname/";
  $name_resolver_url = "http://cdsweb.u-strasbg.fr/cgi-bin/nph-sesame/-oxp/NSV?";
  // sleep ( 2 );

  $data = array ();

  $data ['status'] = - 1;
  $data ['message'] = '';

  // resolve locally first
  $local_name_resolver_url .= rawurlencode ( $source_name );
  $json = @file_get_contents ( $local_name_resolver_url );

  if ($json) {
    $obj = json_decode ( $json );
//     error_log ( "Local name resolver error: " . $local_name_resolver_url );
//     error_log('Source :'.$source_name);
//     error_log('Response :'.print_r($json, true));
    if ($obj->success) {
      $data ['status'] = 0;
      $data ['message'] = 'Name resolved by local resolver.';
      if ($obj->success_time) {
        $data ['t1'] = $obj->view->t1;
        $data ['t2'] = $obj->view->t2;
      }
      if ($obj->have_coordinates and $obj->success_coordinates) {
        $data ['ra'] = $obj->ra;
        $data ['dec'] = $obj->dec;
      }
      return $data;
    }
  } else {
    error_log ( "Local name resolver error: " . $local_name_resolver_url );
  }

  libxml_use_internal_errors ( true );
  $name_resolver_url .= rawurlencode ( $source_name );
  $xml = simplexml_load_file ( $name_resolver_url, 'SimpleXMLElement', LIBXML_NOWARNING );
  if ($xml === false) {
    error_log ( "Failed getting XML for name resolution: " . $name_resolver_url );
    foreach ( libxml_get_errors () as $error ) {
      error_log ( $error->message );
    }
    $data ['message'] = 'Failed to resolve name.<br>Please try later ...';
  } else if (! isset ( $xml->Target->Resolver->jradeg )) {
    $data ['message'] = $source_name . ' : Unknown object !';
  } else {
    $ra = floatval ( $xml->Target->Resolver->jradeg ['0'] );
    $dec = floatval ( $xml->Target->Resolver->jdedeg ['0'] );
    $nameresolver = explode ( '=', ( string ) $xml->Target->Resolver->attributes ()->name [0] )[1];

    $data ['status'] = 0;
    $data ['message'] = 'Name resolved using ' . $nameresolver;
    $data ['ra'] = $ra;
    $data ['dec'] = $dec;
=======
  $local_name_resolver_url = "http://cdcihn/tnr/api/v1.0/timespan/byname/";
  $name_resolver_url = "http://cdsweb.u-strasbg.fr/cgi-bin/nph-sesame/-oxp/NSV?";
  // sleep(2000);
  
  $data = array ();
  
  $data ['status'] = - 1;
  $data ['message'] = '';
  
  if ($which_name_resolvers ['local'] == 'local') {
    // resolve locally first
    //$data ['message'].= 'Local selected  for query<br>';
    $local_name_resolver_url .= urlencode($source_name);
    $json = @file_get_contents ( $local_name_resolver_url);
    error_log ( 'JSON 1:' . print_r ( $json, true ) );
    $data ['status'] = 0;
    
    if ($json) {
      $obj = json_decode ( $json );
      error_log ( 'JSON 2:' . print_r ( $obj, true ) );
      
      if ($obj->success) {
        $data ['status'] = 0;
        $data ['message'] = 'Name resolved to time using local name resolver.<br/>';
        $data ['t1'] = $obj->view->t1;
        $data ['t2'] = $obj->view->t2;
      }
      else {
        $data ['status'] = -1;
        $data ['message'] .= $source_name . ' : Unknown object by local server !';
      }
    } else {
      error_log ( "Local name resolution failed : " . $name_resolver_url . "\n" . $json );
    }
  }
  
  if ($which_name_resolvers ['sesame'] == 'sesame') {
    //$data ['message'].= 'Sesame selected  for query<br>';
    libxml_use_internal_errors ( true );
    $name_resolver_url .= $source_name;
    $xml = simplexml_load_file ( $name_resolver_url, 'SimpleXMLElement', LIBXML_NOWARNING );
    error_log ( 'XML:' . $xml . '|' );
    if ($xml === false) {
      error_log ( "Failed getting XML for name resolution: " . $name_resolver_url );
      foreach ( libxml_get_errors () as $error ) {
        error_log ( $error->message );
      }
      $data ['message'] .= 'Failed to resolve name with Sesame service.<br>Please try later ...';
      // } else if (preg_match("/^[\b|\n|\r]*$/", $xml) or ((isset ( $xml->Target->INFO ) and (strpos ( $xml->Target->INFO, 'Nothing found' ) !== false)))) {
    } else if (! isset ( $xml->Target->Resolver->jradeg )) {
      $data ['message'] .= 'Resolution failed with Sesame, ' . $source_name . ' : Unknown object !';
      // write_log_file($xml);
    } else {
      $ra = floatval ( $xml->Target->Resolver->jradeg ['0'] );
      $dec = floatval ( $xml->Target->Resolver->jdedeg ['0'] );
      $nameresolver = explode ( '=', ( string ) $xml->Target->Resolver->attributes ()->name [0] )[1];
      
      $data ['status'] = 0;
      $data ['message'] .= '<br>Name resolved using ' . $nameresolver;
      $data ['ra'] = $ra;
      $data ['dec'] = $dec;
      
      // write_log_file($xml);
    }
>>>>>>> c10e998784be11db7deafc74a51e777aaa0cddbc
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