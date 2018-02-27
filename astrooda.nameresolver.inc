<?php
function resolve_object_name($source_name) {
  $name_resolver_url = "http://cdsweb.u-strasbg.fr/cgi-bin/nph-sesame/-oxp/NSV?";
  //sleep(2000);
  sleep(0);
  libxml_use_internal_errors ( true );
  $name_resolver_url .= $source_name;
  $xml = simplexml_load_file ( $name_resolver_url, 'SimpleXMLElement', LIBXML_NOWARNING );
  
  if ($xml === false) {
    error_log ( "Failed loading XML for name resolution: " . $name_resolver_url );
    foreach ( libxml_get_errors () as $error ) {
      error_log ( $error->message );
    }
    $data = [
        'status' => -1,
        'message' => 'Failed to resolve name with Sesame service.<br>Please try later ...',
    ];
  } else if (isset($xml->Target->INFO) and (strpos($xml->Target->INFO,'Nothing found') !== false)) {
    $data = [
        'status' => -1,
        'message' => $source_name.' : Unknown object !',
    ];
    //write_log_file($xml);
  }
  else {
    $ra = floatval ( $xml->Target->Resolver->jradeg ['0'] );
    $dec = floatval ( $xml->Target->Resolver->jdedeg ['0'] );
    $nameresolver = explode('=', (string) $xml->Target->Resolver->attributes()->name[0])[1];
    
    $data = [
        'status' => 0,
        'message' => 'Name resolved using '.$nameresolver,
        'ra' => $ra,
        'dec' => $dec
    ];
    //write_log_file($xml);
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