array(
  (object) array(
      'vid' => '3400',
      'uid' => '355',
      'title' => 'Legacy survey 2',
      'log' => '',
      'status' => '1',
      'comment' => '1',
      'promote' => '0',
      'sticky' => '0',
      'vuuid' => '8eab426b-22c3-42bb-9f50-daa7428c3703',
      'nid' => '2131',
      'type' => 'mmoda_help_page',
      'language' => 'und',
      'created' => '1648200632',
      'changed' => '1648200632',
      'tnid' => '0',
      'translate' => '0',
      'uuid' => 'e9a88363-7030-470f-80ea-6334478379d4',
      'revision_timestamp' => '1648200632',
      'revision_uid' => '355',
      'body' => array(
        'und' => array(
          array(
            'value' => "<p>asdfasdf&nbsp;</p>\r\n",
            'summary' => '',
            'format' => 'full_html',
            'safe_value' => "<p>asdfasdf </p>\n",
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
        'pid' => '6608',
        'source' => 'node/2131',
        'alias' => 'help/mmoda/legacy-survey-2',
        'language' => 'und',
      ),
      'cid' => '0',
      'last_comment_timestamp' => '1648200632',
      'last_comment_name' => NULL,
      'last_comment_uid' => '355',
      'comment_count' => '0',
      'name' => 'motamus',
      'picture' => '3075',
      'data' => 'a:7:{s:9:"oidc_name";s:7:"motamus";s:17:"oidc_picture_hash";s:32:"b3af366090404335c767c88f7c269693";s:16:"ckeditor_default";s:1:"t";s:20:"ckeditor_show_toggle";s:1:"t";s:14:"ckeditor_width";s:4:"100%";s:13:"ckeditor_lang";s:2:"en";s:18:"ckeditor_auto_lang";s:1:"t";}',
      'menu' => NULL,
      'node_export_drupal_version' => '7',
      'node_export_book' => array(
        '#parent_uuid' => '5eb2a018-e399-4496-9cc5-831cded6aaea',
        '#book_uuid' => '0c1158fd-6204-4bda-bca9-a302feade315',
        'weight' => -15,
        '#is_root' => FALSE,
      ),
    ),
)