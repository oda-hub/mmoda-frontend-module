<?php
/**
 * @file
 * isgri_help_page.features.node_export_features.inc
 */

/**
 * Implements hook_node_export_features_default().
 */
function astrooda_help_page_node_export_features_default() {
  $node_export = array(
  'code_string' => 'array(
  (object) array(
      \'vid\' => \'173\',
      \'uid\' => \'0\',
      \'title\' => \'Astrooda\',
      \'log\' => \'\',
      \'status\' => \'1\',
      \'comment\' => \'1\',
      \'promote\' => \'0\',
      \'sticky\' => \'0\',
      \'vuuid\' => \'53e7ae93-150c-4cd7-a01b-4bef40378dcb\',
      \'nid\' => \'173\',
      \'type\' => \'astrooda_help\',
      \'language\' => \'en\',
      \'created\' => \'1553096439\',
      \'changed\' => \'1606120457\',
      \'tnid\' => \'0\',
      \'translate\' => \'0\',
      \'uuid\' => \'e51c6f3b-adbf-4d06-904a-67ec65cda783\',
      \'revision_timestamp\' => \'1606120457\',
      \'revision_uid\' => \'1\',
      \'body\' => array(
        \'und\' => array(
          array(
            \'value\' => "<h1>Overview</h1>\r\n\r\n<p>This page provides a short tutorial for the&nbsp;&nbsp;testing version of online analysis.</p>\r\n",
            \'summary\' => "<p>This page provides a short tutorial for the&nbsp;&nbsp;testing version of online analysis.<br />\r\n&nbsp;</p>\r\n",
            \'format\' => \'full_html\',
            \'safe_value\' => "<h1>Overview</h1>\n<p>This page provides a short tutorial for the  testing version of online analysis.</p>\n",
            \'safe_summary\' => "<p>This page provides a short tutorial for the  testing version of online analysis.<br />\n </p>\n",
          ),
        ),
      ),
      \'field_images_to_insert\' => array(),
      \'rdf_mapping\' => array(
        \'rdftype\' => array(
          \'sioc:Item\',
          \'foaf:Document\',
        ),
        \'title\' => array(
          \'predicates\' => array(
            \'dc:title\',
          ),
        ),
        \'created\' => array(
          \'predicates\' => array(
            \'dc:date\',
            \'dc:created\',
          ),
          \'datatype\' => \'xsd:dateTime\',
          \'callback\' => \'date_iso8601\',
        ),
        \'changed\' => array(
          \'predicates\' => array(
            \'dc:modified\',
          ),
          \'datatype\' => \'xsd:dateTime\',
          \'callback\' => \'date_iso8601\',
        ),
        \'body\' => array(
          \'predicates\' => array(
            \'content:encoded\',
          ),
        ),
        \'uid\' => array(
          \'predicates\' => array(
            \'sioc:has_creator\',
          ),
          \'type\' => \'rel\',
        ),
        \'name\' => array(
          \'predicates\' => array(
            \'foaf:name\',
          ),
        ),
        \'comment_count\' => array(
          \'predicates\' => array(
            \'sioc:num_replies\',
          ),
          \'datatype\' => \'xsd:integer\',
        ),
        \'last_activity\' => array(
          \'predicates\' => array(
            \'sioc:last_activity_date\',
          ),
          \'datatype\' => \'xsd:dateTime\',
          \'callback\' => \'date_iso8601\',
        ),
      ),
      \'path\' => array(
        \'pid\' => \'100\',
        \'source\' => \'node/173\',
        \'alias\' => \'help/astrooda\',
        \'language\' => \'en\',
      ),
      \'cid\' => \'0\',
      \'last_comment_timestamp\' => \'1553096439\',
      \'last_comment_name\' => NULL,
      \'last_comment_uid\' => \'0\',
      \'comment_count\' => \'0\',
      \'toc_node_style\' => \'bullets\',
      \'toc_node_level\' => \'2\',
      \'toc_node_back_to_top_links\' => \'1\',
      \'name\' => \'\',
      \'picture\' => \'0\',
      \'data\' => NULL,
      \'menu\' => NULL,
      \'node_export_drupal_version\' => \'7\',
    ),
)',
);
  return $node_export;
}
