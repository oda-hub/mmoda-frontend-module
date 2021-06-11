<?php

/**
 * @file
 * Default theme implementation to display a block.
 *
 * Available variables:
 * - $block->subject: Block title.
 * - $content: Block content.
 * - $block->module: Module that generated the block.
 * - $block->delta: An ID for the block, unique within each module.
 * - $block->region: The block region embedding the current block.
 * - $classes: String of classes that can be used to style contextually through
 *   CSS. It can be manipulated through the variable $classes_array from
 *   preprocess functions. The default values can be one or more of the
 *   following:
 *   - block: The current template type, i.e., "theming hook".
 *   - block-[module]: The module generating the block. For example, the user
 *     module is responsible for handling the default user navigation block. In
 *     that case the class would be 'block-user'.
 * - $title_prefix (array): An array containing additional output populated by
 *   modules, intended to be displayed in front of the main title tag that
 *   appears in the template.
 * - $title_suffix (array): An array containing additional output populated by
 *   modules, intended to be displayed after the main title tag that appears in
 *   the template.
 *
 * Helper variables:
 * - $classes_array: Array of html class attribute values. It is flattened
 *   into a string within the variable $classes.
 * - $block_zebra: Outputs 'odd' and 'even' dependent on each block region.
 * - $zebra: Same output as $block_zebra but independent of any block region.
 * - $block_id: Counter dependent on each block region.
 * - $id: Same output as $block_id but independent of any block region.
 * - $is_front: Flags true when presented in the front page.
 * - $logged_in: Flags true when the current user is a logged-in member.
 * - $is_admin: Flags true when the current user is an administrator.
 * - $block_html_id: A valid HTML ID and guaranteed unique.
 *
 * @see template_preprocess()
 * @see template_preprocess_block()
 * @see template_process()
 *
 * @ingroup themeable
 */
?>

<!-- Modal Dialog-->
<div id="ldialog" class="modal fade astrooda-log"
  role="dialog" aria-hidden="true" data-backdrop="static"
  data-keyboard="false">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <span class="close" data-dismiss="modal" aria-label="Close"
          aria-hidden="true">&times;</span>
        <h4 class="modal-title"></h4>
        <div class="header-message">
          <div>
            Session : <span class="session-id"></span> | Job Id : <span
              class="job-id"></span>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="legend">
          <div class="legend-element preparing"></div>
          Preparing
          <div class="legend-element calculating"></div>
          Calculating
          <div class="legend-element calculated"></div>
          Done
          <div class="legend-element from-cache"></div>
          Restored from cache
          <div class="legend-element analysis-exception"></div>
          Analysis exception
        </div>
        <div class="summary"></div>
        <div class="more-less-details">More details &gt;</div>
        <div class="details"></div>
        <i class="fa fa-spinner fa-spin" style="font-size: 24px"></i>
        <div class="progress progress-striped active"
          style="margin-bottom: 0;">
          <div class="progress-bar" style="width: 100%"></div>
        </div>
      </div>
      <div class="modal-footer">
        
        <div class="notice-progress-container">
          <!-- add notice in progress modal that request can be closed and re-sent #31  -->
          <span class="notice-progress-message">You can close this window and resubmit the same request at a later time to check its status or retrieve results</span>
          <span class="notice-progress-message email">This can be equally achieved by clicking on the link received by email</span>
          <br><br>
          <span class="notice-progress-message email">You will receive a notification at job completion</span>
        </div>

        <div class="buttons-container">
          <a id="oda-api-token" data-toggle="tooltip" title=""
            data-original-title="Report a bug or write us a feedback"
            class="write-feedback-button ctools-use-modal ctools-modal-modal-popup-large btn btn-primary"
            href="modal_forms/nojs/webform/392"><span class="oda-icon-label">Write a feedback</span><span class="glyphicon glyphicon-envelope">
          </span>
          </a>
          <button type="button"
            class="btn btn-primary form-button submit-button"
            data-dismiss="modal"></button>
        </div>

      </div>
    </div>
  </div>
</div>
<!-- Panel -->
<div id="astrooda_panel_model"
  class="result-panel panel panel-default ldraggable ">
  <div class="panel-heading lang-panel-header-tools">
    <span class="panel-title"></span> <span
      class="panel-toolbox pull-right"> <span class="date"></span>
      <span class="clickable"><i
        class="fa fa-chevron-up"></i></span> <span
      class="fa fa-times close-panel"></span>
    </span>
  </div>
  <div class="panel-body"></div>
  <div class="panel-footer"></div>
</div>
<?php  ?>
<div>
  <?=render($title_prefix)?>
<?php if (isset($subject)): ?>
  <h2 <?=$title_attributes?>><?=$subject?></h2>
<?php endif;?>
  <?=render($title_suffix)?>


   <div class="content" <?=$content_attributes?>>
   <?php if (! isset($instruments)): ?>
   <div>
      No instruments module installed.<br>Please install and enable at
      least one instrument module.
    </div>
   <?php  else : ?>
    <!--div class="alert-dismissible alert alert-info header-info"
      role="alert">
      <a href="#" class="close" data-dismiss="alert" aria-label="close"
        title="close">×</a> <span class="glyphicon glyphicon-info-sign"> </span>
      <div class="header-info-text">
        This interface can be used for public data only. <br>A feedback
        button appears when the query returns its results to report on
        possible issues.
      </div>
    </div-->
    <div class="panel panel-default">
      <div class="panel-heading">
      <?php  if ($astrooda_debug) :?>
        <!--span>Session ID : <?=$session_id?>, count= <?=$session_count?></span-->
        <?php endif; ?>
        <div class="main-toolbar btn-group pull-right" role="group">
          <a data-toggle="tooltip" title=""
            data-original-title="Contact us"
            class="ctools-use-modal ctools-modal-modal-popup-large btn btn-primary"
            href="modal_forms/nojs/webform/383"><span class="oda-icon-label">Contact us</span><span class="glyphicon glyphicon-envelope">
          </span>
          </a>
          <a data-toggle="tooltip" title=""
            data-original-title="Sign in"
            class="btn btn-primary user-log login-link"
            href="user/login"><span class="oda-icon-label">Sign in</span><span class="glyphicon glyphicon-log-in">
          </span>
          </a>
          <a data-toggle="tooltip" title=""
            data-original-title="Sign out"
            class="btn btn-primary user-log logout-link"
            href="user/logout"><span class="oda-icon-label">Sign out</span><span
            class="glyphicon glyphicon-log-out"></span>
          </a>
          <button id="oda-api-token" type="button" class="btn btn-primary show-api-token" data-toggle="tooltip" data-original-title="Show API token, copy it or request it by email">
            <span class="oda-icon-label">API token </span>
            <span class="glyphicon glyphicon-star"></span>
          </button>
          <!--a id="oda-api-token" data-toggle="tooltip" title=""
            data-original-title="<?=$api_token_tip?>"
            class="<?=$api_token_request_or_copy?> ctools-modal-modal-popup-large btn btn-primary"
            href="modal_forms/nojs/webform/384"><span class="oda-icon-label">API token</span><span class="glyphicon glyphicon-star">
          </span>
          </a-->
          <a data-toggle="tooltip" title=""
            data-original-title="Help"
            class="btn btn-primary help-button"
            href="<?=$help_page?>"><span class="oda-icon-label">Help</span><span
            class="glyphicon glyphicon-info-sign"> </span>
          </a>
        </div>
      </div>
      <div id="formwrapper">
        <div class="common-params">
           <?=render($common_form)?>
          </div>
        <div class="instruments-panel panel with-nav-tabs panel-primary">
          <div class="panel-heading"></div>
          <div class="panel-body">
            <div class="tabs">
              <ul class="nav nav-tabs">
             <?php  foreach ($instruments as $name => $instrument ) :?>
                 <li id="<?=$name?>-tab"
                  class="<?=$instrument['active']?>"><a
                  href="#<?=$name?>" data-toggle="tab"><?=$instrument['title']?></a></li>
             <?php endforeach; ?>
              </ul>
              <div class="tab-content">
             <?php  foreach ($instruments as $name => $instrument ) :?>
              <div
                  class="instrument-panel instrument-panel-<?=$name?> tab-pane fade in <?=$instrument['active']?>"
                  id="<?=$name?>">
                  <div id="<?=$name?>-toolbox"
                    class="instrument-toolbox"></div>
                  <div id="<?=$name?>-params"
                    class="panel panel-default instrument-params-panel">
                    <div class="panel-heading">
                      <div class="instrument-params-panel-title">Instrument
                        query parameters :</div>
                      <div
                        class="intrument-toolbar btn-group pull-right"
                        role="group">
                        <a data-toggle="tooltip" title=""
                          data-original-title="Help"
                          class="btn btn-primary help-button"
                          href="<?=$instrument['help_page']?>"><span
                          class="glyphicon glyphicon-info-sign"> </span>
                        </a>
                      </div>
                    </div>
                    <div class="panel-body"><?=render($instrument['form'])?>
                    <?php  if ($instrument['acknowledgement']) :?>
                    <div id="<?=$name?>-paper-quote"
                        class="paper-quote alert alert-info alert-dismissible hidden"
                        role="alert">
                        <hr>
                        <a href="#" class="close" data-dismiss="alert"
                          aria-label="close" title="close">×</a> <span
                          class="glyphicon glyphicon-info-sign"> </span>
                        <div class="header-info-text"><?=$instrument['acknowledgement']?></div>
                      </div>
                      <?php endif; ?>
                    </div>
                  </div>

                </div>
             <?php endforeach; ?>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  <?php endif;?>
</div>