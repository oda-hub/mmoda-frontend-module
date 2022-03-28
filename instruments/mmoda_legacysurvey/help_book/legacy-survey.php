array(
  (object) array(
      'vid' => '3573',
      'uid' => '1',
      'title' => 'Legacy Survey',
      'log' => '',
      'status' => '1',
      'comment' => '1',
      'promote' => '0',
      'sticky' => '0',
      'vuuid' => 'c50f898d-1d15-4c3f-866c-15f7688b8f36',
      'nid' => '2219',
      'type' => 'mmoda_help_page',
      'language' => 'und',
      'created' => '1648461494',
      'changed' => '1648461742',
      'tnid' => '0',
      'translate' => '0',
      'uuid' => '5eb2a018-e399-4496-9cc5-831cded6aaea',
      'revision_timestamp' => '1648461742',
      'revision_uid' => '8',
      'body' => array(
        'und' => array(
          array(
            'value' => "<p>Placeholder for Legacy Survey help page content.</p>\r\n",
            'summary' => '',
            'format' => 'full_html',
            'safe_value' => "<p>Placeholder for Legacy Survey help page content.</p>\n",
            'safe_summary' => '',
          ),
        ),
      ),
      'field_mmoda_images_to_insert' => array(),
      'field_mmoda_module' => array(
        'und' => array(
          array(
            'value' => 'mmoda_legacysurvey',
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
      'path' => array(
        'pid' => '7044',
        'source' => 'node/2219',
        'alias' => 'help/mmoda/legacy-survey',
        'language' => 'und',
      ),
      'cid' => '0',
      'last_comment_timestamp' => '1648461494',
      'last_comment_name' => NULL,
      'last_comment_uid' => '0',
      'comment_count' => '0',
      'name' => 'sitamin',
      'picture' => '0',
      'data' => 'a:8:{s:7:"overlay";i:1;s:16:"ckeditor_default";s:1:"t";s:20:"ckeditor_show_toggle";s:1:"t";s:14:"ckeditor_width";s:4:"100%";s:13:"ckeditor_lang";s:2:"en";s:18:"ckeditor_auto_lang";s:1:"t";s:7:"contact";i:0;s:17:"mimemail_textonly";i:0;}',
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