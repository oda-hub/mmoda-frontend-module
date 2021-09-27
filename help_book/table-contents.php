array(
  (object) array(
      'vid' => '2151',
      'uid' => '1',
      'title' => 'Table of contents',
      'log' => 'nan',
      'status' => '1',
      'comment' => '1',
      'promote' => '0',
      'sticky' => '0',
      'vuuid' => '91959419-0774-44ff-978b-1937304bf94e',
      'nid' => '1483',
      'type' => 'mmoda_help_page',
      'language' => 'und',
      'created' => '1632500993',
      'changed' => '1632500993',
      'tnid' => '0',
      'translate' => '0',
      'uuid' => '03cc06f4-261c-43ba-af03-b0c980ed9b54',
      'revision_timestamp' => '1632500993',
      'revision_uid' => '0',
      'body' => array(),
      'field_mmoda_images_to_insert' => array(),
      'field_mmoda_module' => array(
        'und' => array(
          array(
            'value' => 'astrooda',
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
      'last_comment_timestamp' => '1632500993',
      'last_comment_name' => NULL,
      'last_comment_uid' => '0',
      'comment_count' => '0',
      'name' => 'sitamin',
      'picture' => '0',
      'data' => 'a:8:{s:7:"overlay";i:1;s:16:"ckeditor_default";s:1:"t";s:20:"ckeditor_show_toggle";s:1:"t";s:14:"ckeditor_width";s:4:"100%";s:13:"ckeditor_lang";s:2:"en";s:18:"ckeditor_auto_lang";s:1:"t";s:7:"contact";i:0;s:17:"mimemail_textonly";i:0;}',
      'path' => array(
        'pid' => '3469',
        'source' => 'node/1483',
        'alias' => 'help/mmoda/table-contents',
        'language' => 'und',
      ),
      'menu' => NULL,
      'node_export_drupal_version' => '7',
      'node_export_book' => array(
        '#parent_uuid' => '0c1158fd-6204-4bda-bca9-a302feade315',
        '#book_uuid' => '0c1158fd-6204-4bda-bca9-a302feade315',
        'weight' => -15,
        '#is_root' => FALSE,
      ),
    ),
)