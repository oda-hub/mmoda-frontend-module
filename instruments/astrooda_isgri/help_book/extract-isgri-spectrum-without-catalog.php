array(
  (object) array(
      'vid' => '2319',
      'uid' => '1',
      'title' => 'Extract an ISGRI spectrum without a catalog',
      'log' => 'nan',
      'status' => '1',
      'comment' => '1',
      'promote' => '0',
      'sticky' => '0',
      'vuuid' => '1160c99d-7c37-4a05-954f-38d03c56041a',
      'nid' => '1567',
      'type' => 'mmoda_help_page',
      'language' => 'und',
      'created' => '1642079660',
      'changed' => '1642431278',
      'tnid' => '0',
      'translate' => '0',
      'uuid' => 'a27c0da3-e215-4c84-94d4-fee05ecdf4ed',
      'revision_timestamp' => '1642431278',
      'revision_uid' => '8',
      'body' => array(
        'und' => array(
          array(
            'value' => "<p>It is possible to extract a spectrum without passing from a catalog. The system will take care of making a mosaic image and extract sources from a catalog.</p>\r\n\r\n<p>However, this is not recommended, as there could be NEW fake sources that appear and slow down or even degrade the spectral quality.</p>\r\n\r\n<p>We give this example:</p>\r\n\r\n<p>We look for the Crab nebula and pulsar, so we type \"Crab\" and click on \"resolve\". Then, we select a date in which we know there are Crab observations (here we limit ourselves to one hour). Then, we select \"Spectrum\", put a minimum detection significance of 7 to reduce the number of fake detected sources in the field of a bright object and use an energy range from 30 to 50 that we know is less noisy. Finally, we click on \"submit\".</p>\r\n\r\n<p>&nbsp;</p>\r\n",
            'summary' => '',
            'format' => 'filtered_html',
            'safe_value' => "<p>It is possible to extract a spectrum without passing from a catalog. The system will take care of making a mosaic image and extract sources from a catalog.</p>\n\n<p>However, this is not recommended, as there could be NEW fake sources that appear and slow down or even degrade the spectral quality.</p>\n\n<p>We give this example:</p>\n\n<p>We look for the Crab nebula and pulsar, so we type \"Crab\" and click on \"resolve\". Then, we select a date in which we know there are Crab observations (here we limit ourselves to one hour). Then, we select \"Spectrum\", put a minimum detection significance of 7 to reduce the number of fake detected sources in the field of a bright object and use an energy range from 30 to 50 that we know is less noisy. Finally, we click on \"submit\".</p>\n\n<p> </p>",
            'safe_summary' => '',
          ),
        ),
      ),
      'field_mmoda_images_to_insert' => array(),
      'field_mmoda_module' => array(
        'und' => array(
          array(
            'value' => 'astrooda_isgri',
          ),
        ),
      ),
      'field_test' => array(),
      'rdf_mapping' => array(
        'rdftype' => array(
          'sioc:Item',
          'foaf:Document',
        ),
        'title' => array(
          'predicates' => array(
            'dc:title',
          ),
        ),
        'created' => array(
          'predicates' => array(
            'dc:date',
            'dc:created',
          ),
          'datatype' => 'xsd:dateTime',
          'callback' => 'date_iso8601',
        ),
        'changed' => array(
          'predicates' => array(
            'dc:modified',
          ),
          'datatype' => 'xsd:dateTime',
          'callback' => 'date_iso8601',
        ),
        'body' => array(
          'predicates' => array(
            'content:encoded',
          ),
        ),
        'uid' => array(
          'predicates' => array(
            'sioc:has_creator',
          ),
          'type' => 'rel',
        ),
        'name' => array(
          'predicates' => array(
            'foaf:name',
          ),
        ),
        'comment_count' => array(
          'predicates' => array(
            'sioc:num_replies',
          ),
          'datatype' => 'xsd:integer',
        ),
        'last_activity' => array(
          'predicates' => array(
            'sioc:last_activity_date',
          ),
          'datatype' => 'xsd:dateTime',
          'callback' => 'date_iso8601',
        ),
      ),
      'path' => array(
        'pid' => '4006',
        'source' => 'node/1567',
        'alias' => 'help/mmoda/extract-isgri-spectrum-without-catalog',
        'language' => 'und',
      ),
      'cid' => '0',
      'last_comment_timestamp' => '1642079660',
      'last_comment_name' => NULL,
      'last_comment_uid' => '0',
      'comment_count' => '0',
      'name' => 'sitamin',
      'picture' => '0',
      'data' => 'a:8:{s:7:"overlay";i:1;s:16:"ckeditor_default";s:1:"t";s:20:"ckeditor_show_toggle";s:1:"t";s:14:"ckeditor_width";s:4:"100%";s:13:"ckeditor_lang";s:2:"en";s:18:"ckeditor_auto_lang";s:1:"t";s:7:"contact";i:0;s:17:"mimemail_textonly";i:0;}',
      'menu' => NULL,
      'node_export_drupal_version' => '7',
      'node_export_book' => array(
        '#parent_uuid' => '047fdf2b-d571-43ed-837c-9199bdad0803',
        '#book_uuid' => '0c1158fd-6204-4bda-bca9-a302feade315',
        'weight' => -13,
        '#is_root' => FALSE,
      ),
    ),
)