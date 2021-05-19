function validate_timebin(value, validator, $thefield) {
  // console.log('validating time bin');

  var time_bin_format = validator.getFieldElements('time_bin_format').val();

  if ($thefield.data('astroodaTimeBinMin')) {
    var time_bin_min_seconds = $thefield.data('astroodaTimeBinMin');
    var time_bin_format_message = time_bin_min_seconds + ' seconds';
    if (time_bin_format == 'jd') {
      time_bin_min_days = (time_bin_min_seconds / 86400).toFixed(6);
      var time_bin_format_message = time_bin_min_days + ' day (' + time_bin_min_seconds + ' seconds)';
    }
    if (value < time_bin_min) {
      return {
        valid: false,
        message: 'Please enter a time bin higher than ' + time_bin_format_message
      }
    }
  }

  if ($thefield.data('astroodaTimeBinMultiple')) {
    var time_bin_min = $thefield.data('astroodaTimeBinMin');
    var time_bin_format_message = time_bin_min + ' seconds';
    value *= 1000;
    if (time_bin_format == 'jd') {
      value = value * 86400;
    }
    if (value % 50 != 0) {
      value_inf = (value - (value % 50));
      value_sup = value_inf + 50;
      if (time_bin_format == 'jd') {
        million = Math.pow(10, 6);
        value_inf *= million;
        value_sup *= million;
        value_inf = ((value_inf - (value_inf % 86400))) / (86400 * million);
        value_sup = ((value_sup - (value_sup % 86400))) / (86400 * million);
      }
      value_inf /= 1000;
      value_sup /= 1000;
      return {
        valid: false,
        message: 'Please enter a time bin multiple of 50 ms (' + value_inf + ' or ' + value_sup + ')'
      }
    }
  }
  return true;
}

function panel_title(srcname, param) {
  return 'Source: ' + srcname + '; ' + 
    (typeof param.E1_keV !== 'undefined' ? param.E1_keV + ' - ' + param.E2_keV + ' keV, ' : '') + 
    (typeof param.time_bin !== 'undefined' ? param.time_bin + ' ' + 
      (typeof param.time_bin_format !== 'undefined' ? param.time_bin_format : 'sec'): '');
      // or what is the default for timebin?
}

(function($) {

  $(document).ready(commonReady);
  var desktop_panel_counter = 1;

  var request_draw_spectrum = false;
  var request_spectrum_form_element;

  var ajax_request_timeout = 5 * 60 * 1000; // sets timeout to 5 minutes
  // var ajax_request_timeout= 10 * 1000; // test timeout

  var ignore_params_url = ['job_id', 'session_id', 'use_resolver[local]', 'user_catalog_file', 'token'];

  // all processing distinct nodes during a request
  var distinct_nodes;

  var current_ajax_call_params = {};
  var last_dataserver_response = {};
  var max_nb_attempts_after_failed = 0;
  var current_nb_attempts_after_failed = 0;

  function AJAX_call() {
    // Display the key/value pairs
    // console.log('--- initialFormData');
    // for(var parameter of
    // current_ajax_call_params.initialFormData.entries())
    // {
    // console.log(parameter[0]+ '='+ parameter[1]);
    // }
    // console.log('--- currentFormData');
    // for(var parameter of
    // current_ajax_call_params.currentFormData.entries())
    // {
    // console.log(parameter[0]+ '='+ parameter[1]);
    // }
    var requestTimer = null;
    var startAJAXTime = new Date().getTime();
    var jqxhr = $.ajax({
      url: current_ajax_call_params.action,
      data: current_ajax_call_params.currentFormData,
      // data: form_elements,
      dataType: 'json',
      processData: false,
      contentType: false,
      timeout: ajax_request_timeout,
      type: 'POST'
    }).done(
      function(data, textStatus, jqXHR) {
        last_dataserver_response = data;
        // console.log('--- Query response ---');
        // console.log(data);
        job_id = '';
        session_id = '';
        if (data['job_monitor'].hasOwnProperty('job_id')) {
          job_id = data['job_monitor']['job_id'];
        }
        if (data.hasOwnProperty('session_id')) {
          session_id = data['session_id'];
        }
        if (session_id && job_id) {
          waitingDialog.setHeaderMessagesSessionId(session_id);
          waitingDialog.setHeaderMessageJobId(job_id);
          waitingDialog.showHeaderMessage();
        }
        var query_failed = false;
        if (data.query_status == 'failed' || (data.products.hasOwnProperty('image') && data.products.image == null)) {
          current_nb_attempts_after_failed++;
          query_failed = true;
        } else {
          current_nb_attempts_after_failed = 0;
        }
        // console.log('current_nb_attempts_after_failed='+current_nb_attempts_after_failed);
        if (query_failed && (current_nb_attempts_after_failed > max_nb_attempts_after_failed)) {
          waitingDialog.hideSpinner();
          waitingDialog.append('<table class="error-table"><tr><td>' + get_current_date_time() + '</td><td>' + data.exit_status.message + '</td></tr><tr><td></td><td>'
            + data.exit_status.error_message + '</td></tr></table>', 'danger');
          waitingDialog.setClose();
          add_dispatcher_response_to_feedback_form(data);
        } else if (data.query_status != 'done') {
          waitingDialog.showLegend();
          previous_summary = '';
          if (data.products.hasOwnProperty('input_prod_list')) {
            data_units = data.products.input_prod_list;
          }

          if (typeof messages !== 'undefined') {
            previous_summary = messages.summary;
          }
          messages = get_server_message(data, data_units);
          current_summary = messages.summary;
          messages.summary = get_current_date_time() + messages.summary;
          if (current_summary != previous_summary) {
            waitingDialog.replace(messages);
            $('#ldialog .summary [data-toggle="tooltip"]').tooltip({
              trigger: 'hover'
            });
          }

          current_ajax_call_params.currentFormData = cloneFormData(current_ajax_call_params.initialFormData);
          current_ajax_call_params.currentFormData.append('query_status', data.query_status);
          if (!current_ajax_call_params.currentFormData.has('job_id')) {
            current_ajax_call_params.currentFormData.append('job_id', job_id);
            current_ajax_call_params.currentFormData.append('session_id', session_id);
          }
          requestTimer = setTimeout(AJAX_call, 5000);
        } else {
          add_dispatcher_response_to_feedback_form(data);
          var regex = /[\/]*$/;
          var url = window.location.href.replace(regex, '');
          data.products.api_code = data.products.api_code.replace(/host='([^']+)'/i, "host='" + url + "/dispatch-data'");

          waitingDialog.hideSpinner();
          instrument = $('input[name=instrument]', ".instrument-panel.active").val();
          waitingDialog.append(get_current_date_time() + ' ' + data.query_status, 'success');
          $('#ldialog').find('.progress').hide();
          if (data.exit_status.status != 0) {
            debug_message = '';
            if (data.exit_status.debug_message) {
              debug_message = '<hr>' + debug_message;
            }
            $('#ldialog').find('.progress').hide();
          }
          data.products['session_id_old'] = data.products.session_id;
          data.products['session_id'] = data.session_id;

          if (data.products.hasOwnProperty('image')) {
            if (data.products.hasOwnProperty('download_file_name') && data.products.download_file_name.indexOf('light_curve') == 0) {
              product_panel_body = display_lc_table(job_id, data.query_status, data.products);
            } else {
              if (data.products.image.hasOwnProperty('spectral_fit_image')) {
                product_panel_body = display_spectrum(request_spectrum_form_element.data(), data.products, job_id, instrument);
              } else if (Array.isArray(data.products.image)) {
                product_panel_body = display_image_table(data.products, job_id, instrument);
              } else {
                product_panel_body = display_image(data.products, job_id, instrument);
              }
            }
          } else if (data.products.hasOwnProperty('spectrum_name')) {
            product_panel_body = display_spectrum_table(job_id, data.query_status, data.products);
          }
          $('.instrument-panel.active .paper-quote').clone().removeClass('hidden').addClass('paper-quote').removeAttr('id').appendTo(product_panel_body);

          waitingDialog.setClose();
        }
        // data.exit_status.comment = 'Hoho';
        if (data.exit_status.comment) {
          waitingDialog.append('<div class="comment alert alert-warning">' + data.exit_status.comment + '</div>');
        }
      }).complete(function(jqXHR, textStatus) {
        // console.log('Exec time : ' + (new
        // Date().getTime() -
        // startAJAXTime));
        $('#ldialog button.write-feedback-button').removeClass('hidden');
        $('button[type=submit]', ".instrument-panel.active, .common-params").prop('disabled', false);
      }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log('textStatus : ' + textStatus + '|');
        console.log('errorThrown :' + errorThrown);
        console.log('jqXHR');
        console.log(jqXHR);
        waitingDialog.hideSpinner();
        var message = get_current_date_time() + ' ';
        if (errorThrown == 'timeout') {
          message += ' Timeout (' + (ajax_request_timeout / 1000) + 's) !';
        } else if (jqXHR.status > 0) {
          message += textStatus + ' ' + jqXHR.status + ', ' + errorThrown;
        } else {
          message += 'Can not reach the data server, unknown error';
        }
        waitingDialog.append('<div>' + message + '</div>', 'danger');
      });

    $('#ldialog .cancel-button').on('click', function() {
      if (requestTimer) {
        window.clearTimeout(requestTimer);
      }
      $('#ldialog .header-message .job-id').html('');
      $('#ldialog .summary').html('');
      $('#ldialog .details').html('');
      $('#ldialog .modal-body .more-less-details').hide();

      jqxhr.abort();
    });
    // jqxhr

  }

  function add_dispatcher_response_to_feedback_form(data) {
    $('[name="dispatcher_response"]', '#astrooda-bug-report-form').val(JSON.stringify(data));
  }

  function get_server_message(response, data_units) {
    var messages = {
      summary: ' Status : ' + response['job_monitor']['status'] + '<br>',
      details: ''
    };

    if ((!response['job_monitor'].hasOwnProperty('full_report_dict_list') || response['job_monitor'].full_report_dict_list.length == 0) && (data_units.length == 0)) {
      return (messages);
    }

    var current_status_table = new Array();
    if (response['job_monitor'].hasOwnProperty('full_report_dict_list')) {
      for (var j = 0; j < response['job_monitor'].full_report_dict_list.length; j++) {
        data_unit = response['job_monitor'].full_report_dict_list[j].scwid;
        node = response['job_monitor'].full_report_dict_list[j].node;

        if (data_units.indexOf(data_unit) == -1) {
          data_units.push(data_unit);
        }
        if (typeof current_status_table[data_unit] === 'undefined') {
          current_status_table[data_unit] = new Array();
        }
        if (distinct_nodes.indexOf(node) == -1) {
          distinct_nodes.push(node);
        }
        if (typeof current_status_table[data_unit][node] === 'undefined') {
          current_status_table[data_unit][node] = new Array();
        }
        current_status_table[data_unit][node][response['job_monitor'].full_report_dict_list[j].message] = Object.keys(current_status_table[data_unit][node]).length;
      }
    }
    // Get all nodes, columns
    messages.summary += '<table class="status-table"><thead><tr><th></th><th>Data unit</th>';
    first_unit_data = Object.keys(current_status_table)[0];
    for (j in distinct_nodes) {
      node = distinct_nodes[j];
      messages.summary += '<th class="rotate"><div><span>' + node + '</span></div></th>';
    }

    // Get all data units, rows
    messages.summary += '</tr></thead><tbody>';
    var counter = 1;
    for (i in data_units) {
      data_unit = data_units[i];
      data_unit_label = data_unit;
      var current_counter = pad(counter++, 3);
      if (data_unit == 'inapplicable') {
        data_unit_label = '&nbsp;';
        current_counter = '';
      }
      if (typeof job_status_table[data_unit] === 'undefined') {
        job_status_table[data_unit] = new Array();
      }
      messages.summary += '<tr><td>' + current_counter + '</td><td>' + data_unit_label + '</td>';
      for (j in distinct_nodes) {
        started_or_not = '';
        node = distinct_nodes[j];
        value = '';
        var cssClass = '';
        if (typeof current_status_table[data_unit] !== 'undefined' && typeof current_status_table[data_unit][node] !== 'undefined'
          && Object.keys(current_status_table[data_unit][node]).length) {
          cssClass = get_node_status_class(current_status_table[data_unit][node]);
        }
        messages.summary += '<td class="' + cssClass + '" data-toggle="tooltip" data-container="#ldialog .summary" title="' + value + '"></td>';
      }

      messages.summary += '</tr>';
    }

    messages.summary += '</tbody></table>';
    if (response['job_monitor'].hasOwnProperty('full_report_dict_list') && response['job_monitor'].full_report_dict_list.length > 0) {
      messages.details = '<table class="message-table"><thead><tr><th>Dta unit</th><th>node</th><th>message</th></tr></thead><tbody>';
      for (var j = 0; j < response['job_monitor'].full_report_dict_list.length; j++) {
        messages.details += '<tr><td>' + response['job_monitor'].full_report_dict_list[j].scwid + '</td><td>' + response['job_monitor'].full_report_dict_list[j].node + '</td><td>'
          + response['job_monitor'].full_report_dict_list[j].message + '</td></tr>';
      }
      messages.details += '</tbody></table>';
    }

    return (messages);
  }

  function get_node_status_class(node_messages) {
    if (typeof node_messages !== 'object') {
      return ('');
    }
    var last_node_message_index = -1;
    var last_node_message = '';
    for (message in node_messages) {
      if (node_messages[message] > last_node_message_index) {
        last_node_message_index = node_messages[message];
        last_node_message = message;
      }
    }
    cssClass = '';
    if (node_messages) {
      cssClass = 'preparing';
      if ('main starting' in node_messages) {
        cssClass = 'calculating';
      }
    }
    if ('analysis exception' in node_messages)
      return ('analysis-exception');

    switch (last_node_message) {
      case 'treating dependencies':
        cssClass = 'calculating';
        break;
      case 'analysis exception':
        cssClass = 'analysis-exception';
        break;
      case 'restored from cache':
        if ('main done' in node_messages) {
          cssClass = 'calculated';
        } else {
          cssClass = 'from-cache';
        }
        break;
      case 'main done':
      case 'task complete':
        cssClass = 'calculated';
        break;
      default:
    }
    return (cssClass);
  }

  function commonReady() {

    $('#lfeedback button#edit-submit').prependTo($('#lfeedback .modal-footer'));

    $('button.write-feedback-button').on('click', function(event) {
      $('#lfeedback').modal({
        show: true
      });
    });

    $('#lfeedback').on('hidden.bs.modal', function() {
      $('#feedback-messages', $(this)).html('');
      $('input,select,textarea', '#lfeedback').prop('disabled', false);
    });

    $('#lfeedback').on('shown.bs.modal', function() {
      $('#astrooda-bug-report-form').removeClass('hidden');
      $('.modal-footer button.cancel-button', $(this)).text('Cancel').show();
      $('.modal-footer button#edit-submit', $(this)).show();
    });

    $('#ldialog').on('hidden.bs.modal', function() {
      $('#ldialog button.write-feedback-button').addClass('hidden');
    })

    $('#ltoken button#edit-submit--2').prependTo($('#ltoken .modal-footer'));

    $('#ltoken').on('hidden.bs.modal', function() {
      $('#token-messages', $(this)).html('');
      $('input,textarea', '#ltoken').prop('disabled', false);
    });

    $('#ltoken').on('shown.bs.modal', function() {
      $('#astrooda-ask-token-form').removeClass('hidden');
      $('.modal-footer button.cancel-button', $(this)).text('Cancel').show();
      $('.modal-footer button#edit-submit--2', $(this)).show();
    });

    $('body').on('click', 'table.lightcurve-table tbody button.copy-multi-product', function(e) {
      var current_row = $(this).parents('tr');
      var data = current_row.data();
      var current_panel = $(this).closest('.panel');
      var product_type = current_panel.data("product_type");
      $('#multi-product-' + product_type + '-tab a').click();
      // return;
      if (multiproduct_panel_id = data['multiproduct_' + product_type + '_panel_id']) {
        $(multiproduct_panel_id).highlight_result_panel(lightcurve_offset);
        $('.fa-chevron-down', multiproduct_panel_id).click();

      } else {
        $(".instrument-panel.active").data("lightcurve_table_current_row", current_row);
        var lc_index = data.index;
        var parent_catalog_offset = $(".instrument-panel.active").offset();
        var catalog_offset = {};
        catalog_offset.top = e.pageY - parent_catalog_offset.top;
        catalog_offset.left = e.pageX - parent_catalog_offset.left;
        display_multiproduct_table(current_panel, lc_index, datetime, catalog_offset);
      }
    });

    $('body').on('click', 'table.lightcurve-table tbody button.draw-lightcurve, table.image-table tbody button.draw-image', function(e) {
      var current_row = $(this).parents('tr');
      var data = current_row.data();
      var lightcurve_offset = {};
      lightcurve_offset.top = e.pageY;
      lightcurve_offset.left = e.pageX;
      if (lightcurve_panel_id = data.lightcurve_panel_id) {
        $(lightcurve_panel_id).highlight_result_panel(lightcurve_offset);
        $('.fa-chevron-down', lightcurve_panel_id).click();

      } else {
        $(".instrument-panel.active").data("lightcurve_table_current_row", current_row);
        var lc_index = data.index;
        var current_panel = $(this).closest('.panel');
        var parent_catalog_offset = $(".instrument-panel.active").offset();
        var catalog_offset = {};
        catalog_offset.top = e.pageY - parent_catalog_offset.top;
        catalog_offset.left = e.pageX - parent_catalog_offset.left;
        display_lc_image(current_panel, lc_index, datetime, catalog_offset);
      }
    });

    $('body').on('click', 'table.spectrum-table tbody button.draw-spectrum', function(e) {
      var current_row = $(this).parents('tr');
      var data = current_row.data();
      var spectrum_offset = {};
      spectrum_offset.top = e.pageY;
      spectrum_offset.left = e.pageX;

      if (spectrum_panel_id = data.spectrum_panel_id) {
        $(spectrum_panel_id).highlight_result_panel(spectrum_offset);
        $('.fa-chevron-down', spectrum_panel_id).click();

      } else {

        // return;
        request_draw_spectrum = true;
        request_spectrum_form_element = $(this);
        draw_spectrum_form_elements = new FormData();

        draw_spectrum_form_elements.append('session_id', data.session_id);
        draw_spectrum_form_elements.append('query_status', 'ready');
        draw_spectrum_form_elements.append('job_id', data.job_id);
        draw_spectrum_form_elements.append('instrument', $('input[name=instrument]', ".instrument-panel.active").val());
        draw_spectrum_form_elements.append('query_type', $('select[name=query_type]', ".instrument-panel.active").val());
        draw_spectrum_form_elements.append('product_type', 'spectral_fit');
        draw_spectrum_form_elements.append('xspec_model', data.xspec_model);
        draw_spectrum_form_elements.append('ph_file_name', data.ph_file_name);
        draw_spectrum_form_elements.append('arf_file_name', data.arf_file_name);
        draw_spectrum_form_elements.append('rmf_file_name', data.rmf_file_name);

        $(this).data('session_id', data.session_id);
        $(this).data('parameters', draw_spectrum_form_elements);
        $(this).data('source_name', data.source_name);
        $(this).data('files', data.ph_file_name + ',' + data.arf_file_name + ',' + data.rmf_file_name);

        $(".instrument-panel.active").data("last_click_position", {
          'top': e.pageY,
          'left': e.pageX
        });
        $(".instrument-panel.active").data("spectrum_table_current_row", current_row);
        $(".form-submit", ".instrument-panel.active").click();
      }
    });

    $("body").on('click', '.panel .close-panel', function(e) {
      var panel = $(this).closest('.panel');
      if (panel.data('catalog')) {
        // delete catalog when attached to panel
        panel.removeData('catalog');

      }
      if (panel.data('log')) {
        // delete log when attached to panel
        panel.removeData('log');

      }

      // update the catalog only if it is in the parameters panel
      if (panel.data('catalog_parent_panel_id')) {
        catalog_parent_panel_id = $(panel.data('catalog_parent_panel_id'));
        catalog_parent_panel_id.removeData('catalog_panel_id');
      }

      // update the spectrum only if it is in the parameters panel
      if (panel.data('spectrum_parent_panel_id')) {
        spectrum_parent_panel_id = $(panel.data('spectrum_parent_panel_id'));
        spectrum_parent_panel_id.removeData('spectrum_panel_id');
      }

      // update the lightcurve only if it is in the parameters
      // panel
      if (panel.data('lightcurve_parent_panel_id')) {
        lightcurve_parent_panel_id = $(panel.data('lightcurve_parent_panel_id'));
        lightcurve_parent_panel_id.removeData('lightcurve_panel_id');
      }

      if (panel.data('log_product_panel_id')) {
        log_product_panel_id = panel.data('log_product_panel_id');
        $(log_product_panel_id).removeData('log_panel_id');
      }

      if (panel.data('query_parameters_product_panel_id')) {
        query_parameters_product_panel_id = panel.data('query_parameters_product_panel_id');
        $(query_parameters_product_panel_id).removeData('query_parameters_panel_id');
      }
      panel.remove();
    });

    $("body").on('click', '.instrument-params-panel .show-catalog, .result-panel .show-catalog', function(e) {
      e.preventDefault();
      var showUseCatalog = false;
      var catalog_parent_panel = $(this).parents('.result-panel, .instrument-params-panel');
      if (catalog_parent_panel.hasClass('result-panel')) {
        showUseCatalog = true;
      }
      var parent_catalog_offset = $(".instrument-panel.active").offset();
      var catalog_offset = {};
      catalog_offset.top = e.pageY;
      catalog_offset.left = e.pageX;
      if (catalog_panel_id = catalog_parent_panel.data('catalog_panel_id')) {
        $(catalog_panel_id).highlight_result_panel(catalog_offset);
        $('.fa-chevron-down', catalog_panel_id).click();

      } else {
        // Show catalog

        var catalog = clone(catalog_parent_panel.data('catalog'));
        catalog_offset.top -= parent_catalog_offset.top;
        catalog_offset.left -= parent_catalog_offset.left;
        display_catalog(catalog, '#' + catalog_parent_panel.attr('id'), catalog_offset, showUseCatalog);
      }
    });
    $("body").on('click', '.result-panel .show-js9', function(e) {
      e.preventDefault();
      display_image_js9($(this).data("image_file_path"), $(this).data("e1_kev"), $(this).data("e2_kev"), $(this).data("datetime"));
    });
    $("body").on('click', '.result-panel .show-log', function(e) {
      e.preventDefault();
      var log_parent_panel = $(this).closest('.result-panel');
      var log = log_parent_panel.data('log');
      var parent_log_offset = $(".instrument-panel.active").offset();
      var log_offset = {};
      log_offset.top = e.pageY;
      log_offset.left = e.pageX;
      if (log_panel_id = log_parent_panel.data('log_panel_id')) {
        $(log_panel_id).highlight_result_panel(log_offset);
        $('.fa-chevron-down', log_panel_id).click();
      } else {
        // Show log
        var datetime = $(this).attr('data-datetime');
        log_offset.top -= parent_log_offset.top;
        log_offset.left -= parent_log_offset.left;

        display_log(log, '#' + log_parent_panel.attr('id'), datetime, log_offset);
      }
    });
    $("body").on('click', '.result-panel .show-query-parameters', function(e) {
      e.preventDefault();
      var query_parameters_parent_panel = $(this).closest('.result-panel');
      var query_parameters = query_parameters_parent_panel.data('analysis_parameters');
      var parent_query_parameters_offset = $(".instrument-panel.active").offset();
      var query_parameters_offset = {};
      query_parameters_offset.top = e.pageY;
      query_parameters_offset.left = e.pageX;
      if (query_parameters_panel_id = query_parameters_parent_panel.data('query_parameters_panel_id')) {
        $(query_parameters_panel_id).highlight_result_panel(query_parameters_offset);
        $('.fa-chevron-down', query_parameters_panel_id).click();
      } else {
        // Show query_parameters
        var datetime = $(this).attr('data-datetime');
        query_parameters_offset.top -= parent_query_parameters_offset.top;
        query_parameters_offset.left -= parent_query_parameters_offset.left;

        display_query_parameters(query_parameters, '#' + query_parameters_parent_panel.attr('id'), datetime, query_parameters_offset);
      }
    });

    $("body").on('click', '.result-panel .share-query', function(e) {
      e.preventDefault();
      var query_parameters_parent_panel = $(this).closest('.result-panel');
      var query_parameters = query_parameters_parent_panel.data('analysis_parameters');
      var url = get_query_url(query_parameters);
      copyToClipboard(url);
    });

    $("body").on('click', '.result-panel .api-code', function(e) {
      e.preventDefault();
      var query_parameters_parent_panel = $(this).closest('.result-panel');
      copyToClipboard(query_parameters_parent_panel.data('api_code'));
    });

    $("body").on('click', '.result-panel .api-token-ask', function(e) {
      e.preventDefault();
      $('#ltoken').modal({
        show: true
      });
    });

    $("body").on('click', '.result-panel .api-token', function(e) {
      e.preventDefault();
      var auth_cookie = $('#ltoken').data('auth-cookie');
      copyToClipboard($.cookie(auth_cookie));
    });

    $("body").on('click', '.result-panel .use-catalog', function(e) {
      e.preventDefault();
      var catalog_panel = $(this).parents('.result-panel');
      var catalog_parent_panel = $(catalog_panel.data('catalog_parent_panel_id'));
      var catalog = clone(catalog_parent_panel.data('catalog'));
      var dataTable = catalog_panel.data('dataTable');
      // delete none-selected sources from the catalog in the copy
      if (dataTable.rows({
        selected: true
      }).count() > 0) {
        dataTable.rows({
          selected: false
        }).remove();

      }
      catalog.data = dataTable.data().toArray();
      $(".instrument-panel.active .instrument-params-panel").data({
        catalog: catalog,
        dataTable: dataTable
      });
      $('.instrument-panel.active .instrument-params-panel .inline-user-catalog').removeClass('hidden');

      var event = $.Event('click');
      var showCatalog = $('.instrument-panel.active .instrument-params-panel .show-catalog');
      var catalog_position = showCatalog.position();
      var new_catalog_position = {
        left: catalog_position.left + showCatalog.width() / 2,
        top: catalog_position.top + showCatalog.height() * 2
      }

      var catalog_offset = showCatalog.offset();
      event.pageX = catalog_offset.left + showCatalog.width() / 2;
      event.pageY = catalog_offset.top + showCatalog.height() / 2;
      catalog_panel.animate(new_catalog_position, "slow", function() {
        $('.close-panel', catalog_panel).click();
        showCatalog.trigger(event);
      });
    });
    // delete catalog when attached to panel
    $(".instrument-panel.active .instrument-params-panel .inline-user-catalog").on('click', ".remove-catolog", function(e) {
      $(this).parent().addClass('hidden');
      var panel = $(".instrument-panel.active .instrument-params-panel");
      if (panel.data('catalog')) {
        panel.removeData('catalog');
      }
    });

    waitingDialog = get_waitingDialog();
    // The main block is hidden at startup (in astrooda.css) and
    // shown here after the setup of DOM and the field controls
    $('.block-astrooda').show();
    $('body').on('click', '.astrooda-log .more-less-details', function(e) {
      e.preventDefault();
      var $this = $(this);
      var details = $(this).parent().find('.details');
      details.slideToggle('slow', function() {
        var txt = $(this).is(':visible') ? '< Less details' : 'More details >';
        $this.text(txt);
      });
    });

    // Create validator and validate a frist time :
    // This is important in Firefox when the page is refreshed
    // where indeed the old values are still in the form
    var validator = $('.instrument-panel form').bootstrapValidator({
      // live :'disabled',
      fields: {
        'scw_list': {
          // enabled: false,
          validators: {
            callback: {
              callback: function(value, validator, $field) {
                return (validate_scws(value, 50));
              }
            }
          }
        },
        'time_bin': {
          // enabled: false,
          validators: {
            callback: {
              callback: function(value, validator, $field) {
                return (validate_timebin(value, validator, $field));
              }
            }
          }
        },
        'E1_keV': {
          // enabled: false,
          validators: {
            callback: {
              callback: function(value, validator, $field) {
                var E2_keV = validator.getFieldElements('E2_keV').val();
                if (Number(value) >= Number(E2_keV)) {
                  return {
                    valid: false,
                    message: 'Energy min must be lower that energy max'
                  }
                }
                return true;
              }
            }
          }
        },
        'E2_keV': {
          // enabled: false,
          validators: {
            callback: {
              callback: function(value, validator, $field) {
                var E1_keV = validator.getFieldElements('E1_keV').val();
                if (Number(value) <= Number(E1_keV)) {
                  return {
                    valid: false,
                    message: 'Energy max must be higher that energy min'
                  }
                }
                return true;
              }
            }
          }
        },
      },
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      }
    }).data('bootstrapValidator');// .validate();

    // if (!validator.isValid()) {
    // validator.disableSubmitButtons(true);
    // }

    $('[name^=time_bin_format]', '.instrument-params-panel form').on('change', function(e) {
      var form = $(this).parents('form');
      form.data('bootstrapValidator').updateStatus('time_bin', 'NOT_VALIDATED').validateField('time_bin');
    });

    $('[name=E1_keV]', '.instrument-params-panel form').on('change', function(e) {
      var form = $(this).parents('form');
      form.data('bootstrapValidator').updateStatus('E2_keV', 'NOT_VALIDATED').validateField('E2_keV');
    });

    $('[name=E2_keV]', '.instrument-params-panel form').on('change', function(e) {
      var form = $(this).parents('form');
      form.data('bootstrapValidator').updateStatus('E1_keV', 'NOT_VALIDATED').validateField('E1_keV');
    });

    $('.instrument-panel form').on('error.form.bv', function(e) {
      e.preventDefault();
    });

    $('.instrument-panel form').on('success.form.bv', function(e) {
      e.preventDefault();

      var form_id = $(this).attr('id').replace(/-/g, "_");
      var form_panel = $(this).closest('.panel');
      var formData;
      if (request_draw_spectrum) {
        formData = request_spectrum_form_element.data('parameters');
      } else {
        $('input:not(:file)', this).val(function(_, value) {
          return $.trim(value);
        });

        // Disable form elements added by Drupal
        $('[name^=form_]', this).prop('disabled', true);
        $('[name^=form_]', 'form#astrooda-common').prop('disabled', true);
        // $('[name=catalog_selected_objects]',
        // this).prop('disabled',
        // true);

        // Collect common parameters
        var allFormData = $("form#astrooda-common").serializeArray().map(function(item, index) {
          if (item.name == 'T1' || item.name == 'T2') {
            item.value = item.value.replace(' ', 'T')
          }
          return (item);
        });

        // Collect instrument form fields and remove the
        // form id prefix from
        // the name
        var instrumentFormData = $($(this)[0]).serializeArray().map(function(item, index) {
          item.name = item.name.replace(form_id + '_', '');
          return (item);
        });

        allFormData = allFormData.concat(instrumentFormData);
        formData = new FormData();
        for (var lindex = 0; lindex < allFormData.length; lindex++)
          formData.append(allFormData[lindex].name, allFormData[lindex].value);
        // Enable form elements added by Drupal
        $('[name^=form_]', this).prop('disabled', false);
        $('[name^=form_]', 'form#astrooda-common').prop('disabled', false);
        // $('[name=catalog_selected_objects]',this).prop('disabled',
        // false);

        if (form_panel.data('catalog')) {
          catalog = form_panel.data('catalog').initial_catalog;
          var catalog_selected_objects_string = '';
          if (form_panel.data('dataTable')) {
            var dataTable = form_panel.data('dataTable');
            catalog.cat_column_list = dataTable.columns().data().toArray();
            catalog_selected_objects = Array.apply(null, Array(dataTable.rows().count()));
            catalog_selected_objects = catalog_selected_objects.map(function(x, i) {
              return i + 1
            });
            catalog_selected_objects_string = catalog_selected_objects.join(',');
            catalog.cat_column_list[0] = catalog_selected_objects;
          } else {
            catalog_selected_objects_string = catalog.cat_column_list[0].join(',');
          }
          formData.append('catalog_selected_objects', catalog_selected_objects_string);
          formData.append('selected_catalog', JSON.stringify(catalog));
        }
        // Attach files
        $.each($('input:file:enabled', this), function(i, file) {
          if ($(this).val() !== '') {
            formData.append($(this).attr('name'), file.files[0]);
          }
        });
      }
      $('input[name=xspec_model]', this).prop('disabled', false);
      $('input.spectrum-fit-param', this).prop('disabled', true);

      request_draw_spectrum = false;

      waitingDialog.show('Processing ...', '', {
        progressType: 'success',
        showProgressBar: false,
        showSpinner: true
      });
      waitingDialog.hideHeaderMessage();

      current_ajax_call_params = {};
      console.log('Drupal.visitor.token : ' + $.cookie('Drupal.visitor.token'));
      if ($.cookie('Drupal.visitor.token')) {
        var access_token = $.cookie('Drupal.visitor.token');
        formData.append('token', access_token);
      }
      current_ajax_call_params.initialFormData = formData;
      current_ajax_call_params.currentFormData = cloneFormData(formData);
      if (!current_ajax_call_params.currentFormData.has('query_status')) {
        current_ajax_call_params.currentFormData.append('query_status', 'new');
        current_ajax_call_params.currentFormData.append('session_id', 'new');
        current_ajax_call_params.currentFormData.append('job_id', '');
      }
      current_ajax_call_params.action = $(this).attr('action');
      current_ajax_call_params.form = this;

      data_units = new Array();
      job_status_table = new Array();
      distinct_nodes = new Array();

      AJAX_call();
    });

    $('button.write-feedback-button').on('click', function(event) {
      $.get('send-bug-report', function(data) {

        var html = $.parseHTML(data);
        console.log(data);
        /*
        var help_text = $(".region-content .block-system", html);
        var title = $(".page-header", html).text();
        help_text.find('#table-of-contents-links ul.toc-node-bullets li a, .toc-top-links a').each(function() {
          $(this).attr('href', $(this).attr('href').substring($(this).attr('href').indexOf("#")));
        });
        help_text.find('#table-of-contents-links').addClass('rounded');
        waitingDialog.show(title + ' Help', help_text, {
          dialogSize: 'lg',
          buttonText: 'Close',
          showCloseInHeader: true,
        });
        */
      });
      $('#lfeedback').modal({
        show: true
      });
    });

    $('.help-button').on('click', function(e) {
      // e.preventDefault();
      $.get($(this).attr('href'), function(data) {

        var html = $.parseHTML(data);
        var help_text = $(".region-content .block-system", html);
        var title = $(".page-header", html).text();
        help_text.find('#table-of-contents-links ul.toc-node-bullets li a, .toc-top-links a').each(function() {
          $(this).attr('href', $(this).attr('href').substring($(this).attr('href').indexOf("#")));
        });
        help_text.find('#table-of-contents-links').addClass('rounded');
        waitingDialog.show(title + ' Help', help_text, {
          dialogSize: 'lg',
          buttonText: 'Close',
          showCloseInHeader: true,
        });
      });
      return false;
    });

    if (Drupal.settings.hasOwnProperty('url_parameters')) {
      // console.log(Drupal.settings.url_parameters);
      make_request(Drupal.settings.url_parameters);
    }

  }

  function make_request(request_parameters) {

    // Set catalog in the corresponding instrument form
    if (request_parameters.hasOwnProperty('selected_catalog')) {
      var catalog = JSON.parse(request_parameters.selected_catalog);
      var datetime = get_current_date_time();
      attach_catalog_data_image_panel(datetime, catalog, $(".instrument-panel.active .instrument-params-panel"));
      $('.instrument-panel.active .instrument-params-panel .inline-user-catalog').removeClass('hidden');
    }

    $(".instruments-panel ul.nav-tabs li#" + request_parameters.instrument + '-tab a').tab('show');
    $('input, textarea, select', 'form#astrooda-common, form.' + request_parameters.instrument + '-form').each(function() {
      var re = new RegExp('astrooda_?-?' + request_parameters.instrument + '_?-?');
      var field_name = $(this).attr('name').replace(re, '');

      if (request_parameters.hasOwnProperty(field_name)) {
        if ($(this).attr('type') == 'radio') {
          if ($(this).val() == request_parameters[field_name]) {
            $(this).click();
          }
        } else {
          $(this).val(request_parameters[field_name]);
        }
      }
    });
    $('form.' + request_parameters.instrument + '-form').submit();

  }

  function create_catalog_datatable(editor, catalog, catalog_container) {
    return (catalog_container.DataTable({
      data: catalog.data,
      columns: catalog.column_names,
      // dom : 'Brtflip',
      dom: '<"container-fluid"<"top"<"row"B>if>rt<"bottom"<l>p><"clear">>',
      buttons: [
        'selectAll',
        'selectNone',
        {
          text: 'New',
          className: 'btn-primary',
          extend: "create",
          formTitle: '<h3>Add new object</h3>',
          editor: editor,
          formButtons: [{
            text: 'Add',
            className: 'btn-primary save-row',
            action: function() {
              this.submit();
            }
          }, {
            text: 'Cancel',
            className: 'btn-primary',
            action: function() {
              this.close();
            }
          }]
        },
        {
          text: 'Edit',
          className: 'btn-primary',
          extend: "editSingle",
          formTitle: '<h3>Edit object</h3>',
          editor: editor,
          formButtons: [{
            label: 'Save',
            className: 'btn-primary save-row',
            action: function() {
              this.submit();
            }
          }, {
            label: 'Cancel',
            className: 'btn-primary',
            action: function() {
              this.close();
            }
          }]
        },
        {
          extend: "remove",
          className: 'btn-primary',
          formTitle: '<h3>Delete source(s)</h3>',
          editor: editor,
          formMessage: function(e, dt) {
            var rows = dt.rows(e.modifier()).data().pluck('src_names');
            return 'Confirm the deletion of the following sources ? <ul><li>' + rows.join('</li><li>') + '</li></ul>';
          }
        },
        {
          text: 'Save as TXT',
          className: 'btn-primary',
          action: function(e, dt, button, config) {
            var data = dt.buttons.exportData();
            data.header[0] = "meta_ID";
            var file_content = '';
            for (var i = 0; i < data.header.length; i++) {
              data.header[i] = data.header[i].replace(' ', '_');
            }
            file_content = data.header.join(' ') + "\n";
            for (var i = 0; i < data.body.length; i++) {
              data.body[i][0] = i;
              file_content += data.body[i].join(' ') + "\n";
            }
            $.fn.dataTable.fileSave(new Blob([file_content]), 'catalog.txt');
          }
        },
        {
          text: 'Add query object',
          className: 'btn-primary',
          action: function(e, dt, button, config) {
            editor.title('<h3>Add query object</h3>').buttons([{
              text: 'Add',
              className: 'btn-primary save-row',
              action: function() {
                this.submit();
              }
            }, {
              text: 'Cancel',
              className: 'btn-primary',
              action: function() {
                this.close();
              }
            }]).create().set('src_names', $('input[name=src_name]', 'form#astrooda-common').val()).set('ra', $('input[name=RA]', 'form#astrooda-common').val()).set('dec',
              $('input[name=DEC]', 'form#astrooda-common').val());
            // Make Editor draggable (movable)
            // $('.DTE_Action_Create').draggable({
            // handle : '.DTE_Header, .DTE_Footer',
            // stack : '.ldraggable',
            // containment : "parent"
            // });
          }
        }],
      select: {
        style: 'os',
        selector: 'td:first-child'
      },
      order: [[1, 'asc']],
    }))
  }

  function display_catalog(catalog, afterDiv, offset, showUseCatalog) {
    var datetime = catalog.datetime;

    var panel_ids = $(afterDiv).insert_new_panel(desktop_panel_counter++, 'image-catalog', datetime);

    var catalog_panel = $('#' + panel_ids.panel_id);
    $('#' + panel_ids.panel_body_id).append('<div class="catalog-wrapper"><table class="astro-ana"></table></div>');

    $(afterDiv).data({
      catalog_panel_id: '#' + panel_ids.panel_id
    });
    catalog_panel.data({
      catalog_parent_panel_id: afterDiv
    });

    if (showUseCatalog) {
      $('.panel-footer', '#' + panel_ids.panel_id).append(
        '<button type="button" class="btn btn-primary pull-right use-catalog" data-datetime="' + datetime + '" >Use catalog</button><div class="clearfix"></div>');
    }

    var editor = new $.fn.dataTable.Editor({
      table: '#' + panel_ids.panel_id + ' .catalog-wrapper .astro-ana',
      fields: catalog.fields,
    });

    var catalog_container = $(".catalog-wrapper .astro-ana", '#' + panel_ids.panel_id);

    var dataTable = create_catalog_datatable(editor, catalog, catalog_container)

    // Activate inline edit on click of a table cell
    catalog_container.on('click', 'tbody td:not(:first-child)', function(e) {
      editor.inline(this);
    });

    editor.on('preSubmit', function(e, data, action) {
      var rowId = Object.keys(data.data)[0];
      if (action === 'confirm') {

      }
      if (action !== 'remove') {
        var ra = this.field('ra');
        var dec = this.field('dec');
        var src_names = this.field('src_names');
        var ldataTable = $(this.s.table).DataTable();
        // var lfilter = (action === 'edit')? data.data;
        var confirmation = ($('.DTE button.save-row').data('confirmation'));
        if (!confirmation) {
          ldataTable.rows().every(
            function(rowIdx, tableLoop, rowLoop) {
              // ignore compare with
              // the current row !
              if (this.id() === rowId)
                return;

              var d = this.data();
              var distance = getDistanceFromLatLonInKm(dec.val(), ra.val(), d.dec, d.ra);
              // var distance_same =
              // d.ERR_RAD * 2;
              var distance_same = 0.00001;
              if (distance <= distance_same) {
                // Highlight the row
                // in the table
                $(this.node()).addClass('alert alert-danger');
                $(this).show();

                // Change the editor
                // button to "Save
                // anyway"
                $('.DTE button.save-row').html('Save anyway !').removeClass('btn-primary').addClass('btn-warning').data('confirmation', true);
                // Fix a bug where
                // the opacity of
                // the error
                // message element
                // is set to 0:
                // not displayed
                $('.DTE .DTE_Form_Error').css({
                  'opacity': ''
                });

                editor.error('<div class="alert alert-danger alert-dismissible"><strong>Object already in the catalog ! :</strong><br>Source name: ' + d.src_names + '<br>RA: '
                  + d.ra + '<br>Dec: ' + d.dec + '<br>Distance: ' + distance + '</dv>');
                setTimeout(function() {
                  var row = $(".catalog-wrapper .astro-ana", '#' + panel_ids.panel_id).DataTable().row(rowIdx).node();

                  $(row).removeClass('alert alert-danger')
                }, 5000);
              }
            });
        } else {
          $('.DTE button.save-row').html('Save').removeClass('btn-warning').addClass('btn-primary').removeData('confirmation').removeData('ltext');
        }

        // validate RA between 0 and 360
        if (ra.val() < 0 || ra.val() > 360) {
          ra.error('Value must be between 0 and 360');
        }

        // validate RA between 0 and 360
        if (dec.val() < -90 || dec.val() > 90) {
          dec.error('Value must be between -90 and 90');
        }

        // If any error was reported, cancel the
        // submission so it can be
        // corrected
        if (this.inError() && !confirmation) {
          return false;
        }

      }
    });
    // Update the catalog within the main window whenever the dataTable is
    // changed
    // create, remove or edit of any cell
    if (!showUseCatalog) {
      editor.on('create remove edit', function(e, json, data) {
        var catalog_parent_panel = $(afterDiv);
        if (catalog_parent_panel.hasClass('instrument-params-panel')) {
          var panel = $('#' + panel_ids.panel_id);
          var dataTable = panel.data('dataTable');
          var catalog = catalog_parent_panel.data('catalog');
          catalog.data = dataTable.data().toArray();
          catalog_parent_panel.data({
            'catalog': catalog,
            'dataTable': dataTable
          });
        }
      });
    }

    catalog_panel.data({
      dataTable: dataTable,
      currentRowId: catalog.data.length
    });
    source_name = $('input[name=src_name]', 'form#astrooda-common').val();
    $('#' + panel_ids.panel_id + ' .panel-heading .panel-title').html('Source : ' + source_name + ' - Image catalog');

    catalog_panel.highlight_result_panel(offset);

  }

  function getDistanceFromLatLonInKm(dec1, ra1, dec2, ra2) {
    var dLat = deg2rad(dec2 - dec1);
    var dLon = deg2rad(ra2 - ra1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(dec1)) * Math.cos(deg2rad(dec2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    var b = 2 * Math.asin(a);
    return b;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  function display_log(log, afterDiv, datetime, offset) {
    var panel_ids = $(afterDiv).insert_new_panel(desktop_panel_counter++, 'image-log', datetime);
    $('#' + panel_ids.panel_body_id).append('<div class="log-wrapper">' + log + '</div>');
    $(afterDiv).data({
      log_panel_id: '#' + panel_ids.panel_id
    });
    $('#' + panel_ids.panel_id).data({
      log_product_panel_id: afterDiv
    });
    source_name = $('input[name=src_name]', 'form#astrooda-common').val();
    $('#' + panel_ids.panel_id + ' .panel-heading .panel-title').html('Source : ' + source_name + ' - Log');
    $('#' + panel_ids.panel_id).addClass('astrooda-log');
    $('#' + panel_ids.panel_id).highlight_result_panel(offset);

  }

  function display_query_parameters(query_parameters, afterDiv, datetime, offset) {
    var panel_ids = $(afterDiv).insert_new_panel(desktop_panel_counter++, 'image-query_parameters', datetime);

    var header = '<tr><th>Parameter</th><th>Value</th><th/></tr>';
    var body = '';
    for (var parameter in query_parameters) {
      if (query_parameters.hasOwnProperty(parameter)) {
        body += '<tr><td>' + parameter + '</td><td>' + query_parameters[parameter] + '</td>' + '</tr>';
      }
    }
    var html = '<table class=""><thead>' + header + '</thead><tbody>' + body + '</tbody></table>';
    $('#' + panel_ids.panel_body_id).append('<div class="query_parameters-wrapper">' + html + '</div>');

    $(afterDiv).data({
      query_parameters_panel_id: '#' + panel_ids.panel_id
    });
    $('#' + panel_ids.panel_id).data({
      query_parameters_product_panel_id: afterDiv
    });

    source_name = $('input[name=src_name]', 'form#astrooda-common').val();
    $('#' + panel_ids.panel_id + ' .panel-heading .panel-title').html('Source : ' + source_name + ' -  Query parameters');
    $('#' + panel_ids.panel_id).addClass('astrooda-query_parameters');
    $('#' + panel_ids.panel_id).highlight_result_panel(offset);

  }

  function get_query_url(query_parameters) {
    var url_parameters = new Array();
    for (var parameter in query_parameters) {
      if (ignore_params_url.indexOf(parameter) == -1) {
        url_parameters.push({
          'name': parameter,
          'value': query_parameters[parameter]
        });
      }
    }
    var iframeStatus = checkIFrame();
    var thelocation = window.location;
    if (iframeStatus == 2) {
      thelocation = window.parent.location;
    }
    var currentURL = thelocation.protocol + '//' + thelocation.host + thelocation.pathname;
    return (currentURL + '?' + $.param(url_parameters));
  }

  function only_one_catalog_selection(element_wrapper, element_class, select_all_element, checked_element) {
    $('input[name=' + checked_element + ']', element_wrapper).on('change', function(e) {
      if (this.checked) {
        obj = $(element_wrapper);
        $('input[name=' + checked_element + ']', element_class).each(function(e) {
          if (!$(this).closest(element_class).is(obj)) {
            $(this).prop('checked', false);
          }
        });
      }
    });
  }

  function display_lc_table(job_id, query_status, data) {
    datetime = get_current_date_time();

    var panel_ids = $(".instrument-params-panel", ".instrument-panel.active").insert_new_panel(desktop_panel_counter++, 'lc-table', datetime);

    var session_id = data.session_id;
    var session_job_ids = '<div>Session ID : ' + session_id + '</div><div>Job ID : ' + job_id + '</div>';
    $('#' + panel_ids.panel_id).data("log", session_job_ids + $('.modal-body', '#ldialog').html());

    $('#' + panel_ids.panel_id).data("product_type", 'lc');

    var toolbar = '<div class="btn-group" role="group">';
    toolbar += '<button class="btn btn-default show-query-parameters"  type="button" data-datetime="' + datetime + '" >Query parameters</button>';
    toolbar += '<button class="btn btn-default show-log"  type="button" data-datetime="' + datetime + '" >Log</button>';
    toolbar += '<button class="btn btn-default share-query"  type="button" data-datetime="' + datetime
      + '" >Share <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="Copy the product URL to clipboard" ></span></button>';
    toolbar += '<button class="btn btn-default api-code"  type="button" data-datetime="' + datetime
      + '" >API code <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="Copy the API code to the clipboard" ></span></button>';
    toolbar += get_token_button();
    toolbar += '</div>';
    $('#' + panel_ids.panel_body_id).append(toolbar);

    if (data.input_prod_list.length > 0) {
      scw_list = data.input_prod_list.join(', ');
      $('#' + panel_ids.panel_body_id).append(
        '<div>ScWs List <button type="button" class="btn btn-xs copy-to-clipboard" >Copy</button>:<br><div class="scw-list">' + scw_list + '</div></div>');
      $('.copy-to-clipboard').on('click', function() {
        copyToClipboard($(this).parent().find('.astrooda-popover-content').text());
      });
      $('.scw-list', '#' + panel_ids.panel_body_id).html(add3Dots('ScWs List', $('.scw-list', '#' + panel_ids.panel_body_id).html(), 71));
      $('.popover-help', '#' + panel_ids.panel_body_id).on('click', function(e) {
        e.preventDefault();
        return true;
      }).popover({
        container: 'body',
        content: function() {
          return $(this).parent().find('.astrooda-popover-content').html();
        },
        html: true,
        template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h4 class="popover-title"></h4><div class="popover-content"></div></div>'
      });
    }
    $('#' + panel_ids.panel_id).data({
      'job_id': job_id
    });

    $('#' + panel_ids.panel_id).data({
      'products': data
    });

    $('#' + panel_ids.panel_id).data({
      analysis_parameters: data.analysis_parameters,
      api_code: data.api_code,
    });

    $('#' + panel_ids.panel_id + ' .panel-heading .panel-title').html(panel_title(data.analysis_parameters.src_name, data.analysis_parameters));

    var lightcurve_table_data = new Array(data.name.length);
    for (var i = 0; i < data.name.length; i++) {
      lightcurve_table_data[i] = {
        DT_RowId: 'row_' + i,
        source_name: data.name[i],
        index: i,
      }
    }

    $('#' + panel_ids.panel_body_id).append('<div class="lightcurve-table-wrapper"><table class="lightcurve-table table-striped"></table></div>');
    var lightcurve_table_column_names = [{
      title: "Source Name",
      name: "source_name",
      data: "source_name",
    }, {
      data: null,
      title: "Light Curve",
      name: "lightcurve",
      defaultContent: '<button type="button" class="btn btn-primary draw-lightcurve">View</button>',
      orderable: false
    }, {
      data: null,
      title: "Multi-product",
      name: "multi_product",
      defaultContent: '<button type="button" class="btn btn-primary copy-multi-product">Copy</button>',
      orderable: false
    },];

    var lightcurve_table_container = $(".lightcurve-table", '#' + panel_ids.panel_id);

    var dataTable = lightcurve_table_container.DataTable({
      // "bAutoWidth": false,
      data: lightcurve_table_data,
      columns: lightcurve_table_column_names,
      // dom : 'Brtflip',
      dom: '<"top"Bif>rt<"bottom"<l>p><"clear">',
      buttons: [],
      order: [[0, 'asc']],
      "rowCallback": function(row, data) {
        $(row).data(data);
      }
    });

    $('#' + panel_ids.panel_id).highlight_result_panel();

  }

  function display_image_table(data, job_id, query_status) {
    datetime = get_current_date_time();

    var panel_ids = $(".instrument-params-panel", ".instrument-panel.active").insert_new_panel(desktop_panel_counter++, 'image-table', datetime);

    var session_id = data.session_id;
    var session_job_ids = '<div>Session ID : ' + session_id + '</div><div>Job ID : ' + job_id + '</div>';
    $('#' + panel_ids.panel_id).data("log", session_job_ids + $('.modal-body', '#ldialog').html());

    $('#' + panel_ids.panel_id).data("product_type", 'image');

    var toolbar = '<div class="btn-group" role="group">';
    toolbar += '<button class="btn btn-default show-query-parameters"  type="button" data-datetime="' + datetime + '" >Query parameters</button>';
    toolbar += '<button class="btn btn-default show-log"  type="button" data-datetime="' + datetime + '" >Log</button>';
    toolbar += '<button class="btn btn-default share-query"  type="button" data-datetime="' + datetime
      + '" >Share <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="Copy the product URL to clipboard" ></span></button>';
    toolbar += '<button class="btn btn-default api-code"  type="button" data-datetime="' + datetime
      + '" >API code <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="Copy the API code to the clipboard" ></span></button>';
    toolbar += get_token_button();
    toolbar += '</div>';
    $('#' + panel_ids.panel_body_id).append(toolbar);

    if (data.input_prod_list.length > 0) {
      scw_list = data.input_prod_list.join(', ');
      $('#' + panel_ids.panel_body_id).append(
        '<div>ScWs List <button type="button" class="btn btn-xs copy-to-clipboard" >Copy</button>:<br><div class="scw-list">' + scw_list + '</div></div>');
      $('.copy-to-clipboard').on('click', function() {
        copyToClipboard($(this).parent().find('.astrooda-popover-content').text());
      });
      $('.scw-list', '#' + panel_ids.panel_body_id).html(add3Dots('ScWs List', $('.scw-list', '#' + panel_ids.panel_body_id).html(), 71));
      $('.popover-help', '#' + panel_ids.panel_body_id).on('click', function(e) {
        e.preventDefault();
        return true;
      }).popover({
        container: 'body',
        content: function() {
          return $(this).parent().find('.astrooda-popover-content').html();
        },
        html: true,
        template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h4 class="popover-title"></h4><div class="popover-content"></div></div>'
      });
    }
    $('#' + panel_ids.panel_id).data({
      'job_id': job_id
    });

    $('#' + panel_ids.panel_id).data({
      'products': data
    });

    $('#' + panel_ids.panel_id).data({
      analysis_parameters: data.analysis_parameters,
      api_code: data.api_code,
    });

    $('#' + panel_ids.panel_id + ' .panel-heading .panel-title').html(panel_title(data.analysis_parameters.src_name, data.analysis_parameters));

    var image_table_data = new Array(data.name.length);
    for (var i = 0; i < data.name.length; i++) {
      image_table_data[i] = {
        DT_RowId: 'row_' + i,
        source_name: data.name[i],
        index: i,
      }
    }

    $('#' + panel_ids.panel_body_id).append('<div class="image-table-wrapper"><table class="image-table table-striped"></table></div>');
    var image_table_column_names = [{
      title: "Source Name",
      name: "source_name",
      data: "source_name",
    }, {
      data: null,
      title: "Image",
      name: "image",
      defaultContent: '<button type="button" class="btn btn-primary draw-image">View</button>',
      orderable: false
    },];

    var image_table_container = $(".image-table", '#' + panel_ids.panel_id);

    var dataTable = image_table_container.DataTable({
      // "bAutoWidth": false,
      data: image_table_data,
      columns: image_table_column_names,
      // dom : 'Brtflip',
      dom: '<"top"Bif>rt<"bottom"<l>p><"clear">',
      buttons: [],
      order: [[0, 'asc']],
      "rowCallback": function(row, data) {
        $(row).data(data);
      }
    });

    $('#' + panel_ids.panel_id).highlight_result_panel();

    return ($('#' + panel_ids.panel_body_id));

  }

  function display_lc_image(current_panel, lc_index, datetime, catalog_offset) {
    var panel_ids = $(".instrument-params-panel", ".instrument-panel.active").insert_new_panel(desktop_panel_counter++, 'image', datetime);

    var current_row = $(".instrument-panel.active").data("lightcurve_table_current_row");
    $(current_row).data({
      lightcurve_panel_id: '#' + panel_ids.panel_id
    });
    $('#' + panel_ids.panel_id).data({
      lightcurve_parent_panel_id: current_row
    });

    var data = current_panel.data('products');

    var image = data.image[lc_index];
    var session_id = data.session_id;
    var job_id = current_panel.data('job_id');

    var file_name = data.file_name[lc_index].replace('query_lc_query_lc_', '');

    var files_list = data.file_name[lc_index];
    if (data.root_file_name) {
      file_name = file_name.split('.').slice(0, -1).join('.') + '.tar.gz';
      files_list += ',' + data.root_file_name;
    } else {
      file_name += '.gz';
    }
    url = 'session_id=' + session_id + '&download_file_name=' + file_name + '&file_list=' + files_list + '&query_status=ready&job_id=' + job_id + '&instrument=' + instrument;
    url = url.replace(/\+/g, '%2B');

    var toolbar = '<div class="btn-group" role="group">';
    toolbar += '<a class="btn btn-default" role="button" href="dispatch-data/download_products?' + url
      + '" >Download <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="Light curve in FITS format" ></span></a>';
    toolbar += '</div>';
    $('#' + panel_ids.panel_body_id).append(toolbar);

    // mpld3.draw_figure(panel_ids.panel_body_id, image.image);
    $('#' + panel_ids.panel_body_id).append(image.image.script + image.image.div);

    $('#' + panel_ids.panel_body_id).append(image.header_text.replace(/\n/g, "<br />"));
    $('#' + panel_ids.panel_body_id).append(get_text_table(image.table_text));
    $('#' + panel_ids.panel_body_id).append(image.footer_text.replace(/\n/g, "<br />"));

    product_type = $("input[name$='product_type']:checked", ".instrument-panel.active").val();

    $('#' + panel_ids.panel_id + ' .panel-heading .panel-title').html(panel_title(data.name[lc_index], data.analysis_parameters));

    // set_draggable();
    $('#' + panel_ids.panel_id).css({
      // 'width' : $('#' + panel_ids.panel_id).width()
    });

    $('#' + panel_ids.panel_id).highlight_result_panel(catalog_offset);
    return ($('#' + panel_ids.panel_body_id));


  }

  function display_spectrum_table(job_id, query_status, data) {

    datetime = get_current_date_time();

    var panel_ids = $(".instrument-params-panel", ".instrument-panel.active").insert_new_panel(desktop_panel_counter++, 'spectrum-table', datetime);

    var session_id = data.session_id;
    var session_job_ids = '<div>Session ID : ' + session_id + '</div><div>Job ID : ' + job_id + '</div>';
    $('#' + panel_ids.panel_id).data("log", session_job_ids + $('.modal-body', '#ldialog').html());

    var toolbar = '<div class="btn-group" role="group">';
    toolbar += '<button class="btn btn-default show-query-parameters"  type="button" data-datetime="' + datetime + '" >Query parameters</button>';
    toolbar += '<button class="btn btn-default show-log"  type="button" data-datetime="' + datetime + '" >Log</button>';
    toolbar += '<button class="btn btn-default share-query"  type="button" data-datetime="' + datetime
      + '" >Share <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="Copy the product URL to clipboard" ></span></button>';
    toolbar += '<button class="btn btn-default api-code"  type="button" data-datetime="' + datetime
      + '" >API code <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="Copy the API code to the clipboard" ></span></button>';
    toolbar += get_token_button();
    toolbar += '</div>';
    $('#' + panel_ids.panel_body_id).append(toolbar);

    $('#' + panel_ids.panel_id + ' .panel-heading .panel-title').html('Source : ' + data.analysis_parameters.src_name);

    var spectrum_table_data = new Array(data.spectrum_name.length);
    for (var i = 0; i < data.spectrum_name.length; i++) {
      spectrum_table_data[i] = {
        DT_RowId: 'row_' + i,
        source_name: data.spectrum_name[i],
        xspec_model: 'powerlaw',
        arf_file_name: data.arf_file_name[i],
        ph_file_name: data.ph_file_name[i],
        rmf_file_name: data.rmf_file_name[i],
        job_id: job_id,
        session_id: session_id,
        instrument: data.instrument,
      }
    }

    $('#' + panel_ids.panel_id).data({
      analysis_parameters: data.analysis_parameters,
      api_code: data.api_code,
    });

    $('#' + panel_ids.panel_body_id).append('<div class="spectrum-table-wrapper"><table class="spectrum-table table-striped"></table></div>');
    var spectrum_table_column_names = [
      {
        title: "Source Name",
        name: "source_name",
        data: "source_name",
      },
      {
        title: "Xspec Model",
        name: "xspec_model",
        data: "xspec_model",
        orderable: false
      },
      {
        data: null,
        title: "Spectrum",
        name: "spectrum",
        defaultContent: '<button type="button" class="btn btn-primary draw-spectrum">Fit</button>',
        orderable: false
      },
      {
        data: null,
        title: "Download",
        name: "download",
        render: function(data, type, full, meta) {
          download_filename = 'spectra-' + data.source_name + '.tar.gz';
          datafiles = data.ph_file_name + ',' + data.arf_file_name + ',' + data.rmf_file_name;
          url = 'session_id=' + data.session_id + '&file_list=' + datafiles + '&download_file_name=' + download_filename + '&query_status=ready&job_id=' + data.job_id
            + '&instrument=' + data.instrument;
          url = url.replace(/\+/g, '%2B');
          var downloadButton = '<a class="btn btn-default" role="button" href="dispatch-data/download_products?' + url
            + '" >Download <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="Spectrum, rmf and arf in FITS format" ></span></a>';
          return (downloadButton);
        },
        orderable: false
      },];

    var spectrum_table_fields = [{
      name: "source_name",
      type: "readonly",
    }, {
      name: "xspec_model",
    }, {
      name: "spectrum",
      type: "readonly",
    },];
    var editor = new $.fn.dataTable.Editor({
      table: '#' + panel_ids.panel_id + ' .spectrum-table',
      fields: spectrum_table_fields,
    });
    var spectrum_table_container = $(".spectrum-table", '#' + panel_ids.panel_id);

    var dataTable = spectrum_table_container.DataTable({
      // "bAutoWidth": false,
      data: spectrum_table_data,
      columns: spectrum_table_column_names,
      // dom : 'Brtflip',
      dom: '<"top"Bif>rt<"bottom"<l>p><"clear">',
      buttons: [],
      order: [[0, 'asc']],
      "rowCallback": function(row, data) {
        $(row).data(data);
      }
    });

    // Activate inline edit on click of a table cell
    spectrum_table_container.on('click', 'tbody td:nth-child(2)', function(e) {
      editor.inline(this);
    });
    editor.on('initEdit', function(e, json, data) {
      $(this).data('xspec_model_previous_val', data.xspec_model);
    });

    editor.on('postEdit', function(e, json, data) {
      if ($(this).data('xspec_model_previous_val') != data.xspec_model) {
        $('.instrument-panel.active .spectrum-table tr#' + data.DT_RowId).removeData('spectrum_panel_id');
      }
    });

    // highlight_result_panel(panel_ids.panel_id);
    $('#' + panel_ids.panel_id).highlight_result_panel();
    return ($('#' + panel_ids.panel_body_id));

  }

  function display_spectrum(metadata, data, job_id, instrument) {

    datetime = get_current_date_time();
    var panel_ids = $(".instrument-params-panel", ".instrument-panel.active").insert_new_panel(desktop_panel_counter++, 'spectrum', datetime);

    var current_row = $(".instrument-panel.active").data("spectrum_table_current_row");
    $(current_row).data({
      spectrum_panel_id: '#' + panel_ids.panel_id
    });
    $('#' + panel_ids.panel_id).data({
      spectrum_parent_panel_id: current_row
    });

    product_type = $("input[name$='product_type']:checked", ".instrument-panel.active").val();

    // download_filename = 'spectra-' + metadata.source_name + '.tar.gz';
    // url = 'session_id=' + metadata.session_id + '&file_list=' +
    // metadata.files + '&download_file_name=' + download_filename +
    // '&query_status=ready&job_id=' + job_id
    // + '&instrument=' + instrument;
    // url = url.replace(/\+/g, '%2B');
    //
    // var downloadButton = '<a class="btn btn-default" role="button"
    // href="dispatch-data/download_products?' + url
    // + '" >Download <span class="glyphicon glyphicon-info-sign"
    // data-toggle="tooltip" title="Spectrum, rmf and arf in FITS format"
    // ></span></a>';
    // var toolbar = '<div class="btn-group" role="group">' + downloadButton +
    // '</div>';
    // $('#' + panel_ids.panel_body_id).append(toolbar);

    // $('#' + panel_ids.panel_body_id).append(
    // '<a href="dispatch-data/download_products?' + url +
    // '">Download</a>');

    // mpld3.draw_figure(panel_ids.panel_body_id, data.spectral_fit_image);
    $('#' + panel_ids.panel_body_id).append(data.image.spectral_fit_image.script + data.image.spectral_fit_image.div);

    $('#' + panel_ids.panel_body_id).append(data.image.header_text.replace(/\n/g, "<br />"));
    $('#' + panel_ids.panel_body_id).append(get_text_table(data.image.table_text));
    $('#' + panel_ids.panel_body_id).append(data.image.footer_text.replace(/\n/g, "<br />"));

    $('#' + panel_ids.panel_id + ' .panel-heading .panel-title').html('Source : ' + metadata.source_name);

    var x = $('#' + panel_ids.panel_id).offset().top - 100;
    jQuery('body').animate({
      scrollTop: x
    }, 500);
    var parent_spectrum_offset = $(".instrument-panel.active").offset();
    var last_click_position = $(".instrument-panel.active").data('last_click_position');

    var spectrum_offset = {};
    spectrum_offset.top = last_click_position.top - parent_spectrum_offset.top;
    spectrum_offset.left = last_click_position.left - parent_spectrum_offset.left;

    $('#' + panel_ids.panel_id).highlight_result_panel(spectrum_offset);
    return ($('#' + panel_ids.panel_body_id));

  }

  function format_output(data) {
    return (Number(data).toFixed(4));
  }

  function attach_catalog_data_image_panel(datetime, catalog, JQpanel) {
    // var catalog = data.catalog;
    var columns = [];
    var fields = [];
    columns[0] = {
      title: '',
      data: null,
      defaultContent: '',
      className: 'select-checkbox',
      orderable: false
    };
    for (var i = 1; i < catalog.cat_column_descr.length; i++) {
      columns[i] = {
        title: catalog.cat_column_descr[i][0].replace('_', ' '),
        name: catalog.cat_column_descr[i][0],
        data: catalog.cat_column_descr[i][0],
      };
      fields[i - 1] = {
        label: catalog.cat_column_descr[i][0].replace('_', ' ').toUpperCase(),
        name: catalog.cat_column_descr[i][0],
      };
      var readonlyFields = ['significance', 'err_rad', 'new_source'];
      var defaultValFields = ['isgri_flag', 'flag'];
      if (catalog.cat_column_descr[i][0].toLowerCase() == 'ra') {
        fields[i - 1].def = '1';
      }
      if (defaultValFields.indexOf(catalog.cat_column_descr[i][0].toLowerCase()) != -1) {
        fields[i - 1].def = '1';
      }
      if (readonlyFields.indexOf(catalog.cat_column_descr[i][0].toLowerCase()) != -1) {
        fields[i - 1].type = 'readonly';
      }
      if (catalog.cat_column_descr[i][1].indexOf('f') != -1) {
        fields[i - 1].attr = new Object();
        fields[i - 1].attr.type = 'number';
        fields[i - 1].attr.step = 'any';
        columns[i].render = function(data) {
          return (format_output(data));
        };
      }
    }
    var dataSet = new Array(catalog.cat_column_list[0].length);
    for (var j = 0; j < catalog.cat_column_list[0].length; j++) {
      dataSet[j] = new Object();
      dataSet[j]['DT_RowId'] = 'row_' + j;
      for (var i = 1; i < catalog.cat_column_list.length; i++) {
        dataSet[j][catalog.cat_column_descr[i][0]] = catalog.cat_column_list[i][j];
      }
    }
    var selectedRows = new Array(catalog.cat_column_list[0].length);
    JQpanel.data({
      catalog: {
        initial_catalog: catalog,
        data: dataSet,
        column_names: columns,
        fields: fields,
        datetime: datetime,
      }
    });
  }

  function get_token_button() {
    var auth_cookie = $('#ltoken').data('auth-cookie');
    var title = 'Copy your API token to the clipboard';
    var button = 'api-token';
    if (!$.cookie(auth_cookie)) {
      title = 'Request an API token';
      button = 'api-token-ask';
    }
    return '<button class="btn btn-default ' + button + '" type="button">API token <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="' + title + '" ></span></button>';
  }

  function display_image(data, job_id, instrument) {
    datetime = get_current_date_time();
    var panel_ids = $(".instrument-params-panel", ".instrument-panel.active").insert_new_panel(desktop_panel_counter++, 'image', datetime);

    if (data.hasOwnProperty('catalog')) {
      attach_catalog_data_image_panel(datetime, data.catalog, $('#' + panel_ids.panel_id));
    }

    $('#' + panel_ids.panel_id).data({
      analysis_parameters: data.analysis_parameters,
      api_code: data.api_code,
    });

    var session_id = data.session_id;

    url = 'session_id=' + session_id + '&download_file_name=' + data.download_file_name + '&file_list=' + data.file_name + '&query_status=ready&job_id=' + job_id + '&instrument='
      + instrument;
    url = url.replace(/\+/g, '%2B');

    var session_job_ids = '<div>Session ID : ' + session_id + '</div><div>Job ID : ' + job_id + '</div>';
    $('#' + panel_ids.panel_id).data("log", session_job_ids + $('.modal-body', '#ldialog').html());

    var toolbar = '<div class="btn-group" role="group">';
    toolbar += '<button class="btn btn-default show-js9" type="button" data-datetime="' + datetime + '" data-image_file_path="'+data.image.file_path+
    '" data-E1_keV="'+data.analysis_parameters.E1_keV+'" data-E2_keV="'+data.analysis_parameters.E2_keV+'" >JS9</button>';
    toolbar += '<a class="btn btn-default" role="button" href="dispatch-data/download_products?' + url
      + '" >Download <span class="glyphicon glyphicon-info-sign remove-catolog" data-toggle="tooltip" title="image, catalog and region file" ></span></a>';

    product_type = $("input[name$='product_type']:checked", ".instrument-panel.active").val();
    if (product_type.endsWith('image')) {""
      toolbar += '<button class="btn btn-default show-catalog" type="button" data-datetime="' + datetime + '" >Catalog</button>';
    }
    toolbar += '<button class="btn btn-default show-query-parameters"  type="button" data-datetime="' + datetime + '" >Query parameters</button>';
    toolbar += '<button class="btn btn-default show-log"  type="button" data-datetime="' + datetime + '" >Log</button>';
    toolbar += '<button class="btn btn-default share-query"  type="button" data-datetime="' + datetime
      + '" >Share <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="Copy the product URL to clipboard" ></span></button>';
    toolbar += '<button class="btn btn-default api-code"  type="button" data-datetime="' + datetime
      + '" >API code <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="Copy the API code to the clipboard" ></span></button>';
    toolbar += get_token_button();
    toolbar += '</div>';
    $('#' + panel_ids.panel_body_id).append(toolbar);

    if (data.input_prod_list.length > 0) {
      scw_list = data.input_prod_list.join(', ');
      $('#' + panel_ids.panel_body_id).append(
        '<div>ScWs List <button type="button" class="btn btn-xs copy-to-clipboard" >Copy</button>:<br><div class="scw-list">' + scw_list + '</div></div>');
      $('.copy-to-clipboard').on('click', function() {
        copyToClipboard($(this).parent().find('.scw-list .astrooda-popover-content').text());
      });
      $('.scw-list', '#' + panel_ids.panel_body_id).html(add3Dots('ScWs List', $('.scw-list', '#' + panel_ids.panel_body_id).html(), 71));
      var pop = $('.popover-help', '#' + panel_ids.panel_body_id).on('click', function(e) {
        e.preventDefault();
        return true;
      }).popover({
        container: 'body',
        content: function() {
          return $(this).parent().find('.astrooda-popover-content').html();
        },
        html: true,
        template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h4 class="popover-title"></h4><div class="popover-content"></div></div>'
      });
    }
    $('#' + panel_ids.panel_body_id).append(data.image.image.script + data.image.image.div);

    $('#' + panel_ids.panel_body_id).append(data.image.header_text.replace(/\n/g, "<br />"));
    $('#' + panel_ids.panel_body_id).append(get_text_table(data.image.table_text));
    $('#' + panel_ids.panel_body_id).append(data.image.footer_text.replace(/\n/g, "<br />"));
    $('#' + panel_ids.panel_id + ' .panel-heading .panel-title').html(data.analysis_parameters.E1_keV + ' - ' + data.analysis_parameters.E2_keV + ' keV');

    $('#' + panel_ids.panel_id).highlight_result_panel();
    return ($('#' + panel_ids.panel_body_id));
  }
  function display_image_js9(image_file_path, E1_keV, E2_keV, datetime) {

    // mpld3.draw_figure(panel_ids.panel_body_id, data.image.image);
    var panel_ids = $(".instrument-params-panel", ".instrument-panel.active").insert_new_panel(desktop_panel_counter++, 'js9', datetime);

    $('#' + panel_ids.panel_body_id).append($('<iframe>', {
      src: '/cdci/astrooda/dispatch-data/api/v1.0/oda/get_js9_plot?file_path=' + image_file_path + '&ext_id=4',
      id: 'js9iframe',
      width: '650',
      height: '700',
      frameborder: 0,
      scrolling: 'no'
    }));

    // source_name = $('input[name=src_name]',
    // 'form#astrooda-common').val();
    // $('#' + panel_ids.panel_id + ' .panel-heading .panel-title').html(
    // 'Source : ' + source_name + ' - ' + product_type);
    $('#' + panel_ids.panel_id + ' .panel-heading .panel-title').html(E1_keV + ' - ' + E2_keV + ' keV');

    $('#' + panel_ids.panel_id).highlight_result_panel();
    //return ($('#' + panel_ids.panel_body_id));

  }

})(jQuery);
