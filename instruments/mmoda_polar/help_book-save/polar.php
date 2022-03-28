array(
  (object) array(
      'vid' => '433',
      'uid' => '1',
      'title' => 'Polar',
      'log' => '',
      'status' => '1',
      'comment' => '1',
      'promote' => '0',
      'sticky' => '0',
      'vuuid' => '3ac6d272-d2c3-4ece-99e4-786dfd652cfa',
      'nid' => '415',
      'type' => 'mmoda_help_page',
      'language' => 'en',
      'created' => '1631527081',
      'changed' => '1631723531',
      'tnid' => '0',
      'translate' => '0',
      'uuid' => 'c792f98a-e869-4235-9663-7f2c52d0b5f0',
      'revision_timestamp' => '1631723531',
      'revision_uid' => '1',
      'body' => array(
        'und' => array(
          array(
            'value' => "<h1>Overview</h1>\r\n\r\n<h4><strong>POLAR</strong> : a compact detector for Gamma Ray Bursts photon polarization measurements.</h4>\r\n\r\n<p>Polar was launched in space September 15 2016 at 14:04 UTC and successfully ran until April 4 2017 at 00:46:36 UTC.</p>\r\n\r\n<p>This page provides a short tutorial for the online analysis interface of POLAR data.</p>\r\n\r\n<h2>Source query panel</h2>\r\n\r\n<p>The top panel of the interface allows to define the parameters common to all instruments.</p>\r\n\r\n<p>[[{\"fid\":\"667\",\"view_mode\":\"colorbox\",\"fields\":{\"height\":257,\"width\":755,\"class\":\"media-element file-default\",\"data-delta\":\"1\",\"format\":\"colorbox\",\"alignment\":\"\",\"field_file_image_alt_text[und][0][value]\":false,\"field_file_image_title_text[und][0][value]\":false,\"external_url\":\"\"},\"link_text\":null,\"type\":\"media\",\"field_deltas\":{\"1\":{\"height\":257,\"width\":755,\"class\":\"media-element file-default\",\"data-delta\":\"1\",\"format\":\"colorbox\",\"alignment\":\"\",\"field_file_image_alt_text[und][0][value]\":false,\"field_file_image_title_text[und][0][value]\":false,\"external_url\":\"\"}},\"attributes\":{\"height\":257,\"width\":755,\"class\":\"media-element file-colorbox\",\"data-delta\":\"1\"}}]]</p>\r\n\r\n<h2>Instrument query panel</h2>\r\n\r\n<p>Click on the \"POLAR\" button in the virtual desktop field to display POLAR specific parameters.</p>\r\n\r\n<p>[[{\"fid\":\"668\",\"view_mode\":\"colorbox\",\"fields\":{\"height\":689,\"width\":566,\"class\":\"media-element file-default\",\"data-delta\":\"2\",\"format\":\"colorbox\",\"alignment\":\"\",\"field_file_image_alt_text[und][0][value]\":false,\"field_file_image_title_text[und][0][value]\":false,\"external_url\":\"\"},\"link_text\":null,\"type\":\"media\",\"field_deltas\":{\"2\":{\"height\":689,\"width\":566,\"class\":\"media-element file-default\",\"data-delta\":\"2\",\"format\":\"colorbox\",\"alignment\":\"\",\"field_file_image_alt_text[und][0][value]\":false,\"field_file_image_title_text[und][0][value]\":false,\"external_url\":\"\"}},\"attributes\":{\"height\":689,\"width\":566,\"class\":\"media-element file-colorbox\",\"data-delta\":\"2\"}}]]</p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<h1>Analysis Flow</h1>\r\n\r\n<p>The analysis steps are described below:</p>\r\n\r\n<h2>Query Data</h2>\r\n\r\n<ol>\r\n\t<li>Start analysis by entering the source name of interest in the field \"Object name\" of the top panel.</li>\r\n\t<li>click on the \"Resolve\" button to trigger the resolver. If the object of interest is found, time range fields are filled. You may also wish to fill them manually. The RA and Dec fields are for now dummy. For GRB objects, select only the <em>Local</em> resolver. As Sesame does not know anything about GRB, it will just run for quite a long time without resulting anything.</li>\r\n\t<li>Adapt / fill time interval for the data.<br>\r\n\t\t&nbsp;</li>\r\n</ol>\r\n\r\n<h2>Timing Analysis</h2>\r\n\r\n<ol>\r\n\t<li>\r\n\t\t<p>Select \"POLAR\" on the instrument query panel.</p>\r\n\t</li>\r\n\t<li>\r\n\t\t<p>Check the \"Lightcurve\" checkbox.</p>\r\n\t</li>\r\n\t<li>\r\n\t\t<p>Set a possible energy range for the data selection. The default [0,2000] keV covers the full POLAR energy range.</p>\r\n\t</li>\r\n\t<li>\r\n\t\t<p>Set the time bin width and unit for the lightcurve. Remind that the start and end time of the lightcurve are determined by the time limits set in the top multi-instrument panel.</p>\r\n\t</li>\r\n\t<li>\r\n\t\t<p>The \"Query Type\" field must be set to <em>Real</em>.</p>\r\n\t</li>\r\n\t<li>\r\n\t\t<p>Launch the lightcurve extraction by pressing the \"Submit\" button.</p>\r\n\t</li>\r\n</ol>\r\n\r\n<p>[[{\"fid\":\"669\",\"view_mode\":\"colorbox\",\"fields\":{\"height\":587,\"width\":643,\"class\":\"media-element file-default\",\"data-delta\":\"3\",\"format\":\"colorbox\",\"alignment\":\"\",\"field_file_image_alt_text[und][0][value]\":false,\"field_file_image_title_text[und][0][value]\":false,\"external_url\":\"\"},\"link_text\":null,\"type\":\"media\",\"field_deltas\":{\"3\":{\"height\":587,\"width\":643,\"class\":\"media-element file-default\",\"data-delta\":\"3\",\"format\":\"colorbox\",\"alignment\":\"\",\"field_file_image_alt_text[und][0][value]\":false,\"field_file_image_title_text[und][0][value]\":false,\"external_url\":\"\"}},\"attributes\":{\"height\":587,\"width\":643,\"class\":\"media-element file-colorbox\",\"data-delta\":\"3\"}}]]</p>\r\n\r\n<p>A window pops up showing the status of the processing request. Note that according to the request, the processing time can be quite long. Click on \"close\" when done to close the window.</p>\r\n\r\n<p>[[{\"fid\":\"670\",\"view_mode\":\"colorbox\",\"fields\":{\"height\":452,\"width\":1361,\"class\":\"media-element file-default\",\"data-delta\":\"4\",\"format\":\"colorbox\",\"alignment\":\"\",\"field_file_image_alt_text[und][0][value]\":false,\"field_file_image_title_text[und][0][value]\":false,\"external_url\":\"\"},\"link_text\":null,\"type\":\"media\",\"field_deltas\":{\"4\":{\"height\":452,\"width\":1361,\"class\":\"media-element file-default\",\"data-delta\":\"4\",\"format\":\"colorbox\",\"alignment\":\"\",\"field_file_image_alt_text[und][0][value]\":false,\"field_file_image_title_text[und][0][value]\":false,\"external_url\":\"\"}},\"attributes\":{\"height\":452,\"width\":1361,\"class\":\"media-element file-colorbox\",\"data-delta\":\"4\"}}]]</p>\r\n\r\n<p>Once the request is processed, it is displayed in the workspace, together with other previous results.</p>\r\n\r\n<p>[[{\"fid\":\"671\",\"view_mode\":\"colorbox\",\"fields\":{\"height\":338,\"width\":461,\"class\":\"media-element file-default\",\"data-delta\":\"5\",\"format\":\"colorbox\",\"alignment\":\"\",\"field_file_image_alt_text[und][0][value]\":false,\"field_file_image_title_text[und][0][value]\":false,\"external_url\":\"\"},\"link_text\":null,\"type\":\"media\",\"field_deltas\":{\"5\":{\"height\":338,\"width\":461,\"class\":\"media-element file-default\",\"data-delta\":\"5\",\"format\":\"colorbox\",\"alignment\":\"\",\"field_file_image_alt_text[und][0][value]\":false,\"field_file_image_title_text[und][0][value]\":false,\"external_url\":\"\"}},\"attributes\":{\"height\":338,\"width\":461,\"class\":\"media-element file-colorbox\",\"data-delta\":\"5\"}}]]</p>\r\n\r\n<p>Click on the \"View\" button on the right of the source object to display the lightcurve.</p>\r\n\r\n<p>[[{\"fid\":\"672\",\"view_mode\":\"colorbox\",\"fields\":{\"height\":604,\"width\":523,\"class\":\"media-element file-default\",\"data-delta\":\"6\",\"format\":\"colorbox\",\"alignment\":\"\",\"field_file_image_alt_text[und][0][value]\":false,\"field_file_image_title_text[und][0][value]\":false,\"external_url\":\"\"},\"link_text\":null,\"type\":\"media\",\"field_deltas\":{\"6\":{\"height\":604,\"width\":523,\"class\":\"media-element file-default\",\"data-delta\":\"6\",\"format\":\"colorbox\",\"alignment\":\"\",\"field_file_image_alt_text[und][0][value]\":false,\"field_file_image_title_text[und][0][value]\":false,\"external_url\":\"\"}},\"attributes\":{\"height\":604,\"width\":523,\"class\":\"media-element file-colorbox\",\"data-delta\":\"6\"}}]]</p>\r\n\r\n<p>By clicking on the \"Download\" button, you have a possibility to download the lightcurve in FITS and ROOT format for further analysis.</p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<h2>Caveats / Known Issues</h2>\r\n\r\n<p>A) if the given time range is inverted, the server issues no specific warning. It just says that there is no data for the given time range.</p>\r\n",
            'summary' => "<p>This page provides a short tutorial for the online analysis interface of POLAR data.</p>\r\n",
            'format' => 'full_html',
            'safe_value' => "<h1>Overview</h1>\n\n<h4><strong>POLAR</strong> : a compact detector for Gamma Ray Bursts photon polarization measurements.</h4>\n\n<p>Polar was launched in space September 15 2016 at 14:04 UTC and successfully ran until April 4 2017 at 00:46:36 UTC.</p>\n\n<p>This page provides a short tutorial for the online analysis interface of POLAR data.</p>\n\n<h2>Source query panel</h2>\n\n<p>The top panel of the interface allows to define the parameters common to all instruments.</p>\n\n<div class=\"media-p\"><div class=\"media-element-container media-colorbox\">\n\n<!-- THEME DEBUG -->\n<!-- CALL: theme('file_entity') -->\n<!-- FILE NAME SUGGESTIONS:\n   * file--667--colorbox.tpl.php\n   * file--667.tpl.php\n   * file--image--png--colorbox.tpl.php\n   * file--image--png.tpl.php\n   * file--image--colorbox.tpl.php\n   * file--image.tpl.php\n   * file-entity.tpl.php\n-->\n<!-- BEGIN OUTPUT from 'sites/all/modules/file_entity/file_entity.tpl.php' -->\n<div id=\"file-667\" class=\"file file-image file-image-png\">\n\n        <h2 class=\"element-invisible\"><a href=\"/mmoda/images/grb-selectionpng\">grb-selection.png</a></h2>\n    \n  \n  <div class=\"content\">\n    <a href=\"https://cdcidev.mtmco.net/mmoda/sites/default/files/help/images/grb-selection.png\" title=\"\" class=\"colorbox\" data-colorbox-gallery=\"gallery-all-NgQ5KfsXBPg\" data-cbox-img-attrs=\"{&quot;title&quot;: &quot;&quot;, &quot;alt&quot;: &quot;&quot;}\"><img class=\"media-element file-colorbox\" data-delta=\"1\" height=\"257\" width=\"755\" typeof=\"foaf:Image\" src=\"https://cdcidev.mtmco.net/mmoda/sites/default/files/help/images/grb-selection.png\" alt=\"\" title=\"\" /></a>  </div>\n\n  \n</div>\n\n<!-- END OUTPUT from 'sites/all/modules/file_entity/file_entity.tpl.php' -->\n\n</div></div>\n\n<h2>Instrument query panel</h2>\n\n<p>Click on the \"POLAR\" button in the virtual desktop field to display POLAR specific parameters.</p>\n\n<div class=\"media-p\"><div class=\"media-element-container media-colorbox\">\n\n<!-- THEME DEBUG -->\n<!-- CALL: theme('file_entity') -->\n<!-- FILE NAME SUGGESTIONS:\n   * file--668--colorbox.tpl.php\n   * file--668.tpl.php\n   * file--image--png--colorbox.tpl.php\n   * file--image--png.tpl.php\n   * file--image--colorbox.tpl.php\n   * file--image.tpl.php\n   * file-entity.tpl.php\n-->\n<!-- BEGIN OUTPUT from 'sites/all/modules/file_entity/file_entity.tpl.php' -->\n<div id=\"file-668\" class=\"file file-image file-image-png\">\n\n        <h2 class=\"element-invisible\"><a href=\"/mmoda/images/polar-querypng\">polar-query.png</a></h2>\n    \n  \n  <div class=\"content\">\n    <a href=\"https://cdcidev.mtmco.net/mmoda/sites/default/files/help/images/polar-query.png\" title=\"\" class=\"colorbox\" data-colorbox-gallery=\"gallery-all-NgQ5KfsXBPg\" data-cbox-img-attrs=\"{&quot;title&quot;: &quot;&quot;, &quot;alt&quot;: &quot;&quot;}\"><img class=\"media-element file-colorbox\" data-delta=\"2\" height=\"689\" width=\"566\" typeof=\"foaf:Image\" src=\"https://cdcidev.mtmco.net/mmoda/sites/default/files/help/images/polar-query.png\" alt=\"\" title=\"\" /></a>  </div>\n\n  \n</div>\n\n<!-- END OUTPUT from 'sites/all/modules/file_entity/file_entity.tpl.php' -->\n\n</div></div>\n\n<p> </p>\n\n<h1>Analysis Flow</h1>\n\n<p>The analysis steps are described below:</p>\n\n<h2>Query Data</h2>\n\n<ol>\n\t<li>Start analysis by entering the source name of interest in the field \"Object name\" of the top panel.</li>\n\t<li>click on the \"Resolve\" button to trigger the resolver. If the object of interest is found, time range fields are filled. You may also wish to fill them manually. The RA and Dec fields are for now dummy. For GRB objects, select only the <em>Local</em> resolver. As Sesame does not know anything about GRB, it will just run for quite a long time without resulting anything.</li>\n\t<li>Adapt / fill time interval for the data.<br />\n\t\t </li>\n</ol>\n\n<h2>Timing Analysis</h2>\n\n<ol>\n\t<li>\n\t\t<p>Select \"POLAR\" on the instrument query panel.</p>\n\t</li>\n\t<li>\n\t\t<p>Check the \"Lightcurve\" checkbox.</p>\n\t</li>\n\t<li>\n\t\t<p>Set a possible energy range for the data selection. The default [0,2000] keV covers the full POLAR energy range.</p>\n\t</li>\n\t<li>\n\t\t<p>Set the time bin width and unit for the lightcurve. Remind that the start and end time of the lightcurve are determined by the time limits set in the top multi-instrument panel.</p>\n\t</li>\n\t<li>\n\t\t<p>The \"Query Type\" field must be set to <em>Real</em>.</p>\n\t</li>\n\t<li>\n\t\t<p>Launch the lightcurve extraction by pressing the \"Submit\" button.</p>\n\t</li>\n</ol>\n\n<div class=\"media-p\"><div class=\"media-element-container media-colorbox\">\n\n<!-- THEME DEBUG -->\n<!-- CALL: theme('file_entity') -->\n<!-- FILE NAME SUGGESTIONS:\n   * file--669--colorbox.tpl.php\n   * file--669.tpl.php\n   * file--image--png--colorbox.tpl.php\n   * file--image--png.tpl.php\n   * file--image--colorbox.tpl.php\n   * file--image.tpl.php\n   * file-entity.tpl.php\n-->\n<!-- BEGIN OUTPUT from 'sites/all/modules/file_entity/file_entity.tpl.php' -->\n<div id=\"file-669\" class=\"file file-image file-image-png\">\n\n        <h2 class=\"element-invisible\"><a href=\"/mmoda/images/polarpanelpng\">polarpanel.png</a></h2>\n    \n  \n  <div class=\"content\">\n    <a href=\"https://cdcidev.mtmco.net/mmoda/sites/default/files/help/images/polarpanel.png\" title=\"\" class=\"colorbox\" data-colorbox-gallery=\"gallery-all-NgQ5KfsXBPg\" data-cbox-img-attrs=\"{&quot;title&quot;: &quot;&quot;, &quot;alt&quot;: &quot;&quot;}\"><img class=\"media-element file-colorbox\" data-delta=\"3\" height=\"587\" width=\"643\" typeof=\"foaf:Image\" src=\"https://cdcidev.mtmco.net/mmoda/sites/default/files/help/images/polarpanel.png\" alt=\"\" title=\"\" /></a>  </div>\n\n  \n</div>\n\n<!-- END OUTPUT from 'sites/all/modules/file_entity/file_entity.tpl.php' -->\n\n</div></div>\n\n<p>A window pops up showing the status of the processing request. Note that according to the request, the processing time can be quite long. Click on \"close\" when done to close the window.</p>\n\n<div class=\"media-p\"><div class=\"media-element-container media-colorbox\">\n\n<!-- THEME DEBUG -->\n<!-- CALL: theme('file_entity') -->\n<!-- FILE NAME SUGGESTIONS:\n   * file--670--colorbox.tpl.php\n   * file--670.tpl.php\n   * file--image--png--colorbox.tpl.php\n   * file--image--png.tpl.php\n   * file--image--colorbox.tpl.php\n   * file--image.tpl.php\n   * file-entity.tpl.php\n-->\n<!-- BEGIN OUTPUT from 'sites/all/modules/file_entity/file_entity.tpl.php' -->\n<div id=\"file-670\" class=\"file file-image file-image-png\">\n\n        <h2 class=\"element-invisible\"><a href=\"/mmoda/images/processingdonepng\">processingdone.png</a></h2>\n    \n  \n  <div class=\"content\">\n    <a href=\"https://cdcidev.mtmco.net/mmoda/sites/default/files/help/images/processingdone.png\" title=\"\" class=\"colorbox\" data-colorbox-gallery=\"gallery-all-NgQ5KfsXBPg\" data-cbox-img-attrs=\"{&quot;title&quot;: &quot;&quot;, &quot;alt&quot;: &quot;&quot;}\"><img class=\"media-element file-colorbox\" data-delta=\"4\" height=\"452\" width=\"1361\" typeof=\"foaf:Image\" src=\"https://cdcidev.mtmco.net/mmoda/sites/default/files/help/images/processingdone.png\" alt=\"\" title=\"\" /></a>  </div>\n\n  \n</div>\n\n<!-- END OUTPUT from 'sites/all/modules/file_entity/file_entity.tpl.php' -->\n\n</div></div>\n\n<p>Once the request is processed, it is displayed in the workspace, together with other previous results.</p>\n\n<div class=\"media-p\"><div class=\"media-element-container media-colorbox\">\n\n<!-- THEME DEBUG -->\n<!-- CALL: theme('file_entity') -->\n<!-- FILE NAME SUGGESTIONS:\n   * file--671--colorbox.tpl.php\n   * file--671.tpl.php\n   * file--image--png--colorbox.tpl.php\n   * file--image--png.tpl.php\n   * file--image--colorbox.tpl.php\n   * file--image.tpl.php\n   * file-entity.tpl.php\n-->\n<!-- BEGIN OUTPUT from 'sites/all/modules/file_entity/file_entity.tpl.php' -->\n<div id=\"file-671\" class=\"file file-image file-image-png\">\n\n        <h2 class=\"element-invisible\"><a href=\"/mmoda/images/requestslistpng\">requestslist.png</a></h2>\n    \n  \n  <div class=\"content\">\n    <a href=\"https://cdcidev.mtmco.net/mmoda/sites/default/files/help/images/requestslist.png\" title=\"\" class=\"colorbox\" data-colorbox-gallery=\"gallery-all-NgQ5KfsXBPg\" data-cbox-img-attrs=\"{&quot;title&quot;: &quot;&quot;, &quot;alt&quot;: &quot;&quot;}\"><img class=\"media-element file-colorbox\" data-delta=\"5\" height=\"338\" width=\"461\" typeof=\"foaf:Image\" src=\"https://cdcidev.mtmco.net/mmoda/sites/default/files/help/images/requestslist.png\" alt=\"\" title=\"\" /></a>  </div>\n\n  \n</div>\n\n<!-- END OUTPUT from 'sites/all/modules/file_entity/file_entity.tpl.php' -->\n\n</div></div>\n\n<p>Click on the \"View\" button on the right of the source object to display the lightcurve.</p>\n\n<div class=\"media-p\"><div class=\"media-element-container media-colorbox\">\n\n<!-- THEME DEBUG -->\n<!-- CALL: theme('file_entity') -->\n<!-- FILE NAME SUGGESTIONS:\n   * file--672--colorbox.tpl.php\n   * file--672.tpl.php\n   * file--image--png--colorbox.tpl.php\n   * file--image--png.tpl.php\n   * file--image--colorbox.tpl.php\n   * file--image.tpl.php\n   * file-entity.tpl.php\n-->\n<!-- BEGIN OUTPUT from 'sites/all/modules/file_entity/file_entity.tpl.php' -->\n<div id=\"file-672\" class=\"file file-image file-image-png\">\n\n        <h2 class=\"element-invisible\"><a href=\"/mmoda/images/lightcurve0png\">lightcurve0.png</a></h2>\n    \n  \n  <div class=\"content\">\n    <a href=\"https://cdcidev.mtmco.net/mmoda/sites/default/files/help/images/lightcurve0.png\" title=\"\" class=\"colorbox\" data-colorbox-gallery=\"gallery-all-NgQ5KfsXBPg\" data-cbox-img-attrs=\"{&quot;title&quot;: &quot;&quot;, &quot;alt&quot;: &quot;&quot;}\"><img class=\"media-element file-colorbox\" data-delta=\"6\" height=\"604\" width=\"523\" typeof=\"foaf:Image\" src=\"https://cdcidev.mtmco.net/mmoda/sites/default/files/help/images/lightcurve0.png\" alt=\"\" title=\"\" /></a>  </div>\n\n  \n</div>\n\n<!-- END OUTPUT from 'sites/all/modules/file_entity/file_entity.tpl.php' -->\n\n</div></div>\n\n<p>By clicking on the \"Download\" button, you have a possibility to download the lightcurve in FITS and ROOT format for further analysis.</p>\n\n<p> </p>\n\n<h2>Caveats / Known Issues</h2>\n\n<p>A) if the given time range is inverted, the server issues no specific warning. It just says that there is no data for the given time range.</p>\n",
            'safe_summary' => "<p>This page provides a short tutorial for the online analysis interface of POLAR data.</p>\n",
          ),
        ),
      ),
      'field_mmoda_images_to_insert' => array(),
      'field_mmoda_module' => array(
        'und' => array(
          array(
            'value' => 'mmoda_polar',
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
        'pid' => '321',
        'source' => 'node/415',
        'alias' => 'book/mmoda/polar',
        'language' => 'en',
      ),
      'cid' => '0',
      'last_comment_timestamp' => '1631527081',
      'last_comment_name' => NULL,
      'last_comment_uid' => '1',
      'comment_count' => '0',
      'name' => 'sitamin',
      'picture' => '0',
      'data' => 'a:8:{s:7:"overlay";i:1;s:16:"ckeditor_default";s:1:"t";s:20:"ckeditor_show_toggle";s:1:"t";s:14:"ckeditor_width";s:4:"100%";s:13:"ckeditor_lang";s:2:"en";s:18:"ckeditor_auto_lang";s:1:"t";s:7:"contact";i:0;s:17:"mimemail_textonly";i:0;}',
      'menu' => NULL,
      'node_export_drupal_version' => '7',
      'node_export_book' => array(
        '#parent_uuid' => 'e51c6f3b-adbf-4d06-904a-67ec65cda783',
        '#book_uuid' => 'e51c6f3b-adbf-4d06-904a-67ec65cda783',
        'weight' => 0,
        '#is_root' => FALSE,
      ),
    ),
)