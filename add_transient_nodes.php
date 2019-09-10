<?php
function integral_create_file($file_path, $relative_path) {
  $file = file_save_data ( file_get_contents ( $file_path ), 'public://' . $relative_path . basename ( $file_path ) );

  return ($file);
}
function add_node_integral_all_sky_image($all_sky_image, $trigger_product_ref_id) {
  global $user;

  $values = array (
      'type' => 'integral_all_sky_image',
      'uid' => $user->uid,
      'status' => 1,
      'comment' => 0,
      'promote' => 0
  );
  $entity = entity_create ( 'node', $values );
  $ewrapper = entity_metadata_wrapper ( 'node', $entity );
  $ewrapper->title->set ( $all_sky_image->title );

  $file = integral_create_file ( $all_sky_image->image_file, 'integral-transients/all-sky-images/' );
  $ewrapper->field_integral_image->file->set ( $file );

  $ewrapper->field_associated_to->set ( intval ( $trigger_product_ref_id ) );
  $ewrapper->save ();

  return $ewrapper->getIdentifier ();
}
function add_node_integral_lightcurve($lightcurve, $trigger_product_ref_id) {
  global $user;

  $values = array (
      'type' => 'integral_lightcurve',
      'uid' => $user->uid,
      'status' => 1,
      'comment' => 0,
      'promote' => 0
  );
  $entity = entity_create ( 'node', $values );
  $ewrapper = entity_metadata_wrapper ( 'node', $entity );
  $ewrapper->title->set ( $lightcurve->title );

  $file = integral_create_file ( $lightcurve->image_file, 'integral-transients/lightcurves/' );
  $ewrapper->field_integral_image->file->set ( $file );

  $ewrapper->field_associated_to->set ( intval ( $trigger_product_ref_id ) );
  $ewrapper->save ();

  return $ewrapper->getIdentifier ();
}
function add_node_integral_rate_summary($rate_summary, $trigger_product_ref_id) {
  global $user;

  $values = array (
      'type' => 'integral_rate_summary',
      'uid' => $user->uid,
      'status' => 1,
      'comment' => 0,
      'promote' => 0
  );
  $entity = entity_create ( 'node', $values );
  $ewrapper = entity_metadata_wrapper ( 'node', $entity );
  $ewrapper->title->set ( $rate_summary->title );

  $ewrapper->field_associated_to->set ( intval ( $trigger_product_ref_id ) );
  $ewrapper->save ();

  return $ewrapper->getIdentifier ();
}
function add_node_integral_localization_summary($localization_summary, $trigger_product_ref_id) {
  global $user;

  $values = array (
      'type' => 'integral_localization_summary',
      'uid' => $user->uid,
      'status' => 1,
      'comment' => 0,
      'promote' => 0
  );
  $entity = entity_create ( 'node', $values );
  $ewrapper = entity_metadata_wrapper ( 'node', $entity );
  $ewrapper->title->set ( $localization_summary->title );

  $ewrapper->field_associated_to->set ( intval ( $trigger_product_ref_id ) );
  $ewrapper->save ();

  return $ewrapper->getIdentifier ();
}
function add_node_integral_trigger_product($trigger_product) {
  global $user;
  $filename = '/tmp/momo/add-transient-nodes-log.txt';
  $f = fopen ( $filename, 'w' );
  fwrite ( $f, "add-transient-nodes-log.txt  :\n" );

  // entity_create replaces the procedural steps in the first example of
  // creating a new object $node and setting its 'type' and uid property
  $values = array (
      'type' => 'integral_trigger_product',
      'uid' => $user->uid,
      'status' => 1,
      'comment' => 0,
      'promote' => 0
  );
  $entity = entity_create ( 'node', $values );

  // The entity is now created, but we have not yet simplified use of it.
  // Now create an entity_metadata_wrapper around the new node entity
  // to make getting and setting values easier
  $ewrapper = entity_metadata_wrapper ( 'node', $entity );

  $instrumentTidArr = taxonomy_get_term_by_name ( $trigger_product->instrument, 'instruments' );
  if (empty ( $instrumentTidArr )) {
    print "Error : no term id\n";
    //drupal_set_message ( 'No term found' );
  } else {
    $instrumentTid = array_pop ( $instrumentTidArr )->tid;
    //drupal_set_message ( 'Term found: ' . $tid );
    $ewrapper->field_instrument->set ( $instrumentTid );
  }

  $classTidArr = taxonomy_get_term_by_name ( $trigger_product->transient_class, 'transient_class' );
  if (empty ( $classTidArr )) {
    print "Error : no term id\n";
    //drupal_set_message ( 'No term found' );
  } else {
    $classTid = array_pop ( $classTidArr )->tid;
    //drupal_set_message ( 'Term found: ' . $tid );
    $ewrapper->field_class->set ( $classTid );
  }

  // Using the wrapper, we do not have to worry about telling Drupal
  // what language we are using. The Entity API handles that for us.
  $ewrapper->title->set ( $trigger_product->title );

  // Setting the body is a bit different from other properties or fields
  // because the body can have both its complete value and its
  $ewrapper->body->set ( array (
      'value' => $trigger_product->body
  ) );

  // $ewrapper->field_instrument->set ( $trigger_product->instrument );
  // $ewrapper->field_class->set ( $trigger_product->transient_class );

  // $ewrapper->body->summary->set ( $trigger_product[->summary);

  // Setting the value of an entity reference field only requires passing
  // the entity id (e.g., nid) of the entity to which you want to refer
  // The nid 15 here is just an example.
  // $ref_nid = 15;
  // Note that the entity id (e.g., nid) must be passed as an integer not a
  // string

  // Entity API cannot set date field values so the 'old' method must
  // be used
  $time = new DateTime ( $trigger_product->t0 );
  $entity->field_time [LANGUAGE_NONE] [0] = array (
      'value' => date_format ( $time, 'Y-m-d H:i:s.u' ),
      'timezone' => 'none',
      'timezone_db' => 'none'
  );

  // Now just save the wrapper and the entity
  // There is some suggestion that the 'true' argument is necessary to
  // the entity save method to circumvent a bug in Entity API. If there is
  // such a bug, it almost certainly will get fixed, so make sure to check.
  $ewrapper->save ();
  $trigger_product_ref_id = $ewrapper->getIdentifier ();

  $all_sky_image_ref_id = add_node_integral_all_sky_image ( $trigger_product->all_sky_image, $trigger_product_ref_id );
  $ewrapper->field_all_sky_images [] = (intval ( $all_sky_image_ref_id ));

  $lightcurve_ref_id = add_node_integral_lightcurve ( $trigger_product->light_curve, $trigger_product_ref_id );
  $ewrapper->field_light_curves [] = (intval ( $lightcurve_ref_id ));

  $rate_summary_ref_id = add_node_integral_rate_summary ( $trigger_product->rate_summary, $trigger_product_ref_id );
  $ewrapper->field__rate_summaries [] = (intval ( $rate_summary_ref_id ));

  $localization_summary_ref_id = add_node_integral_localization_summary ( $trigger_product->localization_summary, $trigger_product_ref_id );
  $ewrapper->field__localization_summaries [] = (intval ( $localization_summary_ref_id ));

  $ewrapper->save ();

  fclose ( $f );
  chmod ( $filename, 0777 );
}

$InputDir = '/home/mohamed/tmp/data/data';

$trigger_object_names = scandir ( $InputDir );
$i = 0;

foreach ( $trigger_object_names as $trigger_object_name ) {
  $i ++;
  if (preg_match ( '/^\./', $trigger_object_name ) or $i <5) {
    continue;
  }
  if ($i == 7) {
    //break;
  }
  print ('--- Processing trigger object:' . $trigger_object_name . "\n") ;
  $trigger_object = file_get_contents ( $InputDir . DIRECTORY_SEPARATOR . $trigger_object_name . DIRECTORY_SEPARATOR . 'metadata.json' );
  $trigger_product = json_decode ( $trigger_object );
  if (empty ( $trigger_product )) {
    print "Metadata not found for " . $trigger_object_name . "\n";
    continue;
  }
  $trigger_product->instrument = 'INTEGRAL ISGRI';
  // $trigger_product->instrument = 61;
  $trigger_product->title = $trigger_object_name;
  $trigger_product->body = '';

  $productsDir = $InputDir . DIRECTORY_SEPARATOR . $trigger_object_name . DIRECTORY_SEPARATOR . 'associated_products';

  // Process light curve
  $lcDir = $productsDir . DIRECTORY_SEPARATOR . 'LightCurve';
  $lightcurve_object = ( object ) [ ];
  $lightcurve_object->title = $trigger_object_name . ' light curve';
  $lightcurve_object->image_file = $lcDir . DIRECTORY_SEPARATOR . 'data.png';
  $trigger_product->light_curve = $lightcurve_object;

  // Process all-sky image
  $asimageDir = $productsDir . DIRECTORY_SEPARATOR . 'SkyImage';
  $all_sky_image_object = ( object ) [ ];
  $all_sky_image_object->title = $trigger_object_name . ' all-sky image';
  $all_sky_image_object->image_file = $asimageDir . DIRECTORY_SEPARATOR . 'data.png';
  $trigger_product->all_sky_image = $all_sky_image_object;

  // Process rate summary
  $rate_summary_object = ( object ) [ ];
  $rate_summary_object->title = $trigger_object_name . ' rate summary';
  $trigger_product->rate_summary = $rate_summary_object;

  // Process localization summary
  $localization_summary_object = ( object ) [ ];
  $localization_summary_object->title = $trigger_object_name . ' localization summary';
  $trigger_product->localization_summary = $localization_summary_object;

  print print_r ( $trigger_product, true );
  add_node_integral_trigger_product ( $trigger_product );
}

// $trigger_product = array();
// $trigger_product['title'] = 'FRB010724';
// $trigger_product['body'] = 'FRB010724 body text';

// $trigger_product['all_sky_image']['title'] = 'FRB010724 all_sky_image';
// $trigger_product['all_sky_image']['image_file'] = '/home/mohamed/tmp/data/data/FRB010724/associated_products/SkyImage/data.png';

// $trigger_product['light_curve']['title'] = 'FRB010724 light_curve';
// $trigger_product['light_curve']['image_file'] = '/home/mohamed/tmp/data/data/FRB010724/associated_products/LightCurve/data.png';

// $trigger_product['rate_summary']['title'] = 'FRB010724 rate_summary';

// $trigger_product['localization_summary']['title'] = 'FRB010724 localization_summary';

// add_node_integral_trigger_product($trigger_product);

?>

