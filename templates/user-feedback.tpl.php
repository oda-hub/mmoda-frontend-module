<?php
?>
<!-- Modal Feedback-->
<div id="lfeedback" class="modal fade" tabindex='-1' role="dialog"
  aria-hidden="true" data-backdrop="static">
  <div class="modal-dialog modal-lg">
  <div class="modal-content">
  <div class="modal-header">
    <span class="close" data-dismiss="modal"
    aria-label="Close" aria-hidden="true">&times;</span>
    <h4 class="modal-title">Feedback / Bug report</h4>
    </div>
    <div class="modal-body">
    <div id="feedback-messages"></div>
    <?=render($bug_report_form)?>
      </div>
      <div class="modal-footer">
        <button type="button"
          class="btn btn-primary form-button cancel-button"
          data-dismiss="modal">Cancel</button>
      </div>
    </div>
  </div>
</div>
