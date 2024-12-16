array(
  (object) array(
      'vid' => '2561',
      'uid' => '1',
      'title' => 'Magic',
      'log' => 'nan',
      'status' => '1',
      'comment' => '1',
      'promote' => '0',
      'sticky' => '0',
      'vuuid' => '207de882-064e-4925-b992-d3d4e529820a',
      'nid' => '1693',
      'type' => 'mmoda_help_page',
      'language' => 'en',
      'created' => '1647850892',
      'changed' => '1647850892',
      'tnid' => '0',
      'translate' => '0',
      'uuid' => '73e60277-d8dd-4045-b0d0-7d627c696aab',
      'revision_timestamp' => '1647850892',
      'revision_uid' => '0',
      'body' => array(
        'und' => array(
          array(
            'value' => "<h1>Overview</h1>\r\n\r\n<h4><strong>MAGIC</strong> : a ...</h4>\r\n",
            'summary' => "<p>This page provides a short tutorial for the online analysis interface of MAGIC data.</p>\r\n",
            'format' => 'full_html',
            'safe_value' => "<h1>Overview</h1>\n\n<h4><strong>MAGIC</strong> : a ...</h4>\n",
            'safe_summary' => "<p>This page provides a short tutorial for the online analysis interface of MAGIC data.</p>\n",
          ),
        ),
      ),
      'field_mmoda_images_to_insert' => array(),
      'field_mmoda_module' => array(
        'und' => array(
          array(
            'value' => 'mmoda_magic',
          ),
        ),
      ),
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
      'cid' => '0',
      'last_comment_timestamp' => '1647850892',
      'last_comment_name' => NULL,
      'last_comment_uid' => '0',
      'comment_count' => '0',
      'name' => 'sitamin',
      'picture' => '0',
      'data' => 'a:8:{s:7:"overlay";i:1;s:16:"ckeditor_default";s:1:"t";s:20:"ckeditor_show_toggle";s:1:"t";s:14:"ckeditor_width";s:4:"100%";s:13:"ckeditor_lang";s:2:"en";s:18:"ckeditor_auto_lang";s:1:"t";s:7:"contact";i:0;s:17:"mimemail_textonly";i:0;}',
      'path' => array(
        'pid' => '4580',
        'source' => 'node/1693',
        'alias' => 'help/mmoda/magic',
        'language' => 'en',
      ),
      'menu' => NULL,
      'node_export_drupal_version' => '7',
      'node_export_book' => array(
        '#parent_uuid' => '0c1158fd-6204-4bda-bca9-a302feade315',
        '#book_uuid' => '0c1158fd-6204-4bda-bca9-a302feade315',
        'weight' => -9,
        '#is_root' => FALSE,
      ),
    ),
)