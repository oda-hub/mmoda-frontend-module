var current_instrument_form_validator;
var requestTimer;
var messages = {};

function validate_paste($thefield) {
  var maxlength = parseInt($thefield.attr('maxlength'));
  var pastedValueLength = $thefield.data('pastedValueLength');
  if ($thefield.data('truncatedPaste')) {
    $thefield.removeData('truncatedPaste pastedValueLength');
    return {
      valid: false,
      message: 'Pasted value too large (' + pastedValueLength + '), maximum allowed length is ' + maxlength
    }
  };
  return true;
}

function validate_timebin(value, validator, $thefield) {
  var time_bin_format = validator.getFieldElements('time_bin_format').val();
  if ($thefield.data('mmodaTimeBinMin')) {
    var time_bin_min_seconds = $thefield.data('mmodaTimeBinMin');
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

  if ($thefield.data('mmodaTimeBinMultiple')) {
    var time_bin_min = $thefield.data('mmodaTimeBinMin');
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
  var title_items = [];
  if (srcname !== undefined && srcname !== '') title_items.push('Source: ' + srcname);
  if (param.hasOwnProperty('E1_keV')) title_items.push(param.E1_keV + ' - ' + param.E2_keV + ' keV');
  var time_bin_format = 'sec';
  if (param.hasOwnProperty('time_bin_format')) time_bin_format = param.time_bin_format;
  if (param.hasOwnProperty('time_bin')) title_items.push(param.time_bin + ' ' + time_bin_format);
  // or what is the default for timebin?
  return (title_items.join(', '));
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
  var run_analysis_data_query_status = undefined;
  var last_dataserver_response = {};
  var request_return_progress_from_result_panel = false;
  var max_nb_attempts_after_failed = 0;
  var current_nb_attempts_after_failed = 0;

  function AJAX_call_get_token() {
    return $.ajax({
      url: 'get_token',
    });
  }

  function AJAX_submit_call() {
    AJAX_call_get_token().done(
      function(data, textStatus, jqXHR) {
        if (data.hasOwnProperty('token') && data.token !== null && data.token !== undefined && data.token !== '') {
          current_ajax_call_params.currentFormData.append('token', data.token);
        }

        AJAX_call();
      }).error(function(jqXHR, textStatus, errorThrown) {
        console.log('Error in requesting the user token:');
        console.log('textStatus : ' + textStatus);
        console.log('errorThrown :' + errorThrown);
        console.log('jqXHR');
        console.log(jqXHR);
        AJAX_call();
      });
  }

  function response_panel_mismatch(data) {
    var returned_product_instrument = data.products.analysis_parameters.instrument;
    var active_panel_instrument = $('input[name="instrument"]', '.instrument-panel.active form').val();
    if (returned_product_instrument == active_panel_instrument) return false;
    return true;
  }

  function mmoda_show_product(data) {
    if (response_panel_mismatch(data)) return;
    $(".notice-progress-container").hide();
    add_dispatcher_response_to_feedback_form(data);
    var regex = /[\/]*$/;
    var url = window.location.href.replace(regex, '');
    if (data.hasOwnProperty('products')) {
      data.products.api_code = data.products.api_code.replace(/host='([^']+)'/i, "host='" + url + "/dispatch-data'");
      data.products['session_id_old'] = data.products.session_id;
      data.products['session_id'] = data.session_id;
    }
    waitingDialog.hideSpinner();

    instrument = $('input[name=instrument]', ".instrument-panel.active").val();
    let current_instrument_query = current_ajax_call_params.initialFormData.get('instrument');
    waitingDialog.setProgressBarStatus('done', false);
    waitingDialog.setProgressBarText('done');
    if (current_instrument_query !== undefined && ($(`input[value='${current_instrument_query}']`, ".instrument-panel.active")[0].attributes.hasOwnProperty('support_return_progress') &&
        $(`input[value='${current_instrument_query}']`, ".instrument-panel")[0].attributes.support_return_progress.value == 'true')) {
          waitingDialog.enableReturnProgressLink();
    }
    if (data.exit_status.status != 0) {
      debug_message = '';
      if (data.exit_status.debug_message) {
        debug_message = '<hr>' + debug_message;
      }
    }

    if (data.hasOwnProperty('htmlResponse')) {
      product_panel_body = display_in_iframe(data);
    }
    else if (data.products.hasOwnProperty('image')) {
      if (data.products.hasOwnProperty('download_file_name') && data.products.download_file_name.indexOf('light_curve') == 0) {
        product_panel_body = display_lc_table(job_id, data.products);
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

    $('.instrument-panel.active .instrument-params-panel .paper-quote').clone().removeClass('hidden').removeAttr('id').appendTo(product_panel_body);
    waitingDialog.setClose();
  }

  function mmoda_update_request_progress(data) {
    if ($('.notice-progress-container').is(":hidden")) {
      $('.notice-progress-container').show();
    }
    let current_instrument_query = current_ajax_call_params.initialFormData.get('instrument');
    let integral_instrument = false;
    if (current_instrument_query !== undefined) {
      if ($(`input[value='${current_instrument_query}']`, ".instrument-panel")[0].attributes.hasOwnProperty('integral_instrument') &&
        $(`input[value='${current_instrument_query}']`, ".instrument-panel")[0].attributes.integral_instrument.value == 'true') {
        integral_instrument = true;
      }
    }
    previous_summary = '';

    // if (data.products.hasOwnProperty('input_prod_list')) {
    //   data_units = data.products.input_prod_list;
    // }
    if (typeof messages !== 'undefined') {
      previous_summary = messages.summary;
      previous_details = messages.details;
    }

    response_status = data['job_monitor']['status'];
    let progress, progress_max;
    if (data['job_monitor'].hasOwnProperty('full_report_dict')) {
      if (data['job_monitor'].full_report_dict.hasOwnProperty('progress'))
        progress = data['job_monitor']['full_report_dict']['progress'];
      if (data['job_monitor'].full_report_dict.hasOwnProperty('progress_max'))
        progress_max = data['job_monitor']['full_report_dict']['progress_max'];
    }
    waitingDialog.setProgressBarText(response_status);

    messages = get_server_message(data, integral_instrument);
    current_summary = messages.summary;
    current_details = messages.details;
    // messages.summary = get_current_date_time() + messages.summary;
    if (current_instrument_query !== undefined) {
      if ($(`input[value='${current_instrument_query}']`, ".instrument-panel.active")[0].attributes.hasOwnProperty('support_return_progress') &&
        $(`input[value='${current_instrument_query}']`, ".instrument-panel")[0].attributes.support_return_progress.value == 'true') {
        if (response_status == 'progress' || response_status == 'ready')
          waitingDialog.enableReturnProgressLink();
        waitingDialog.setProgressBarStatus(response_status, true, progress, progress_max);
      }
      else
        waitingDialog.setProgressBarStatus(response_status, false);
    }
    // if (current_summary != previous_summary) {
    //   waitingDialog.replace(messages);
    //   $('#ldialog .summary [data-toggle="tooltip"]').tooltip({
    //     trigger: 'hover'
    //   });
    // }

    if (current_details !== '' && integral_instrument)
      waitingDialog.showLegend();

    if (current_details != previous_details) {
      waitingDialog.replace(messages);
      $('#ldialog .summary [data-toggle="tooltip"]').tooltip({
        trigger: 'hover'
      });
    }

    let access_token = current_ajax_call_params.currentFormData.get('token');
    current_ajax_call_params.currentFormData = cloneFormData(current_ajax_call_params.initialFormData);
    run_analysis_data_query_status = data.query_status;
    if (!current_ajax_call_params.currentFormData.has('job_id')) {
      current_ajax_call_params.currentFormData.append('job_id', job_id);
      current_ajax_call_params.currentFormData.append('session_id', session_id);
    }

    if (access_token != undefined)
      current_ajax_call_params.currentFormData.set('token', access_token);

    requestTimer = setTimeout(AJAX_call, 5000);
  }

  function mmoda_show_request_failed(data) {
    waitingDialog.hideSpinner();
    waitingDialog.hideProgressBar();
    let current_instrument_query = current_ajax_call_params.initialFormData.get('instrument');
    reformatted_exit_status_message = data.exit_status.message.replace(/\\n/g, "<br />").replace(/\n/g, "<br />");

    reformatted_error_message = data.exit_status.error_message.replace(/\\n/g, "<br />").replace(/\n/g, "<br />");
    warning_obj = {'failures' : '<table class="error-table"><tr><td>' + get_current_date_time() + '</td><td>'
     + reformatted_exit_status_message + '</td></tr><tr><td></td><td>'
     + reformatted_error_message + '</td></tr></table>'
    };
    if (current_instrument_query !== undefined && ($(`input[value='${current_instrument_query}']`, ".instrument-panel.active")[0].attributes.hasOwnProperty('support_return_progress') &&
        $(`input[value='${current_instrument_query}']`, ".instrument-panel")[0].attributes.support_return_progress.value == 'true')) {
          waitingDialog.enableReturnProgressLink();
    }
    waitingDialog.append(warning_obj, 'danger');
    waitingDialog.setClose();
    add_dispatcher_response_to_feedback_form(data);
  }

  function mmoda_show_request_error(jqXHR, textStatus, errorThrown) {
    waitingDialog.hideSpinner();
    waitingDialog.hideProgressBar();
    // no need to enable the return progress link as this function is called when the request is aborted,
    // or there is a timeout, or the server is not reachable, so the return progress link is not relevant
    // or the request cannot be processed by the disptcher (eg instrument not available)

    // No need to go further if request aborted by the user
    if (textStatus == 'abort') return;

    serverResponse = '';
    try {
      serverResponse = $.parseJSON(jqXHR.responseText);
    } catch (e) {
      serverResponse = jqXHR.responseText;
    }
    var message = '<tr><td>' + get_current_date_time() + '</td>';
    if (errorThrown == 'timeout' || errorThrown == 'Request Timeout') {
      // more comprehensive message
      message += '<td>Timeout error.</td></tr>';
      message += '<tr><td></td><td>A timeout has occured, this was probably caused by a problem in accessing the server: ' +
        'please try to resubmit your request. ' +
        'You can also inspect <a href="http://status.odahub.io">http://status.odahub.io</a> to notice any recent issues.<br\>' +
        'If the problem persists you can request support by leaving us a feedback.</td></tr>';
    } else if (jqXHR.status > 0) {
      message += '<td>' + textStatus.charAt(0).toUpperCase() + textStatus.slice(1) + ' ' + jqXHR.status + ', ' + errorThrown + ': ';
      if (typeof serverResponse == 'string') {
        message += serverResponse + '</td>';
      } else {
        if ('exit_status' in serverResponse) {
          if ('message' in serverResponse.exit_status)
            message += serverResponse.exit_status.message;
          message += '</td></tr>';
          if ('error_message' in serverResponse.exit_status)
            message += '<tr><td></td><td>' + serverResponse.exit_status.error_message + '</td></tr>';
        }
        else {
          message += serverResponse.error_message + '</td></tr>';
        }
      }
    } else {
      message += '<td>Can not reach the data server, unknown error</td>';
    }
    // to be consistebnt with the way the error is visulized in case query_failed
    reformatted_message = message.replace(/\\n/g, "<br />");
    reformatted_message = reformatted_message.replace(/\n/g, "<br />");
    warning_obj = { 'failures': '<table class="error-table">' + reformatted_message + '</table>' };
    waitingDialog.append(warning_obj, 'danger');
  }

  function AJAX_call() {
    // Display the key / value pairs
    //    console.log('--- initialFormData');
    //    for (var parameter of
    //      current_ajax_call_params.initialFormData.entries()) {
    //      console.log(parameter[0] + '=' + parameter[1]);
    //    }
    //    console.log('--- currentFormData');
    //    for (var parameter of
    //      current_ajax_call_params.currentFormData.entries()) {
    //      console.log(parameter[0] + '=' + parameter[1]);
    //    }
    // must be global variable
    requestTimer = null;

    current_ajax_call_params.currentFormData.delete('return_progress');
    if(typeof run_analysis_data_query_status !== 'undefined')
      current_ajax_call_params.currentFormData.set('query_status', run_analysis_data_query_status);

    //var startAJAXTime = new Date().getTime();
    var mmoda_jqXHR = $.ajax({
      url: current_ajax_call_params.action,
      data: current_ajax_call_params.currentFormData,
      dataType: 'json',
      processData: false,
      contentType: false,
      timeout: ajax_request_timeout,
      type: 'POST'
    }).done(
      function(data, textStatus, jqXHR) {
        last_dataserver_response = data;
        job_id = '';
        session_id = '';
        if (data.hasOwnProperty('job_monitor') && data.job_monitor.hasOwnProperty('job_id')) {
          job_id = data['job_monitor']['job_id'];
        }
        if (data.hasOwnProperty('session_id')) {
          session_id = data['session_id'];
        }
        if (session_id && job_id) {
          waitingDialog.setJobInfoSessionId(session_id);
          waitingDialog.setJobInfoJobId(job_id);
          waitingDialog.showJobInfo();
        }
        var query_failed = false;
        if (data.query_status == 'failed' || (data.hasOwnProperty('products') && data.products.hasOwnProperty('image') && data.products.image == null)) {
          current_nb_attempts_after_failed++;
          query_failed = true;
        } else {
          current_nb_attempts_after_failed = 0;
        }
        if (query_failed && (current_nb_attempts_after_failed > max_nb_attempts_after_failed)) {
          mmoda_show_request_failed(data);
        } else if (data.query_status != 'done') {
          mmoda_update_request_progress(data);
        } else {
          mmoda_show_product(data);
        }
        // data.exit_status.comment = 'Hoho';
        if (data.exit_status.comment) {
          warning_obj = { 'warnings': '<div class="comment alert alert-warning">' + data.exit_status.comment + '</div>' };
          waitingDialog.replace(warning_obj);
        }
      }).complete(function(jqXHR, textStatus) {
        $('button[type=submit]', ".instrument-panel.active, .common-params").prop('disabled', false);
      }).error(function(jqXHR, textStatus, errorThrown) {
        mmoda_show_request_error(jqXHR, textStatus, errorThrown);

      });

    // jqxhr
    var index = mmoda_ajax_jqxhr.push(mmoda_jqXHR);
    $('#ldialog .close-button').data("mmoda_jqxhr_index", index - 1);


  }

  function add_dispatcher_response_to_feedback_form(data) {
    $('[name="dispatcher_response"]', '#mmoda-bug-report-form').val(JSON.stringify(data));
  }

  function get_server_message(response, integral_instrument) {
    var messages = {
      summary: '',
      details: ''
    };

    if ((!response.job_monitor.hasOwnProperty('full_report_dict_list') || response.job_monitor.full_report_dict_list.length == 0) &&
      (!response.products.hasOwnProperty('input_prod_list') || response.products.input_prod_list.length == 0) &&
      (!response.job_monitor.hasOwnProperty('full_report_dict') || response.job_monitor.full_report_dict == {})) {
      return (messages);
    }

    messages.summary += get_server_summary_message(response, integral_instrument);
    messages.details += get_server_detailed_message(response, integral_instrument);

    return (messages);
  }

  function get_server_summary_message(response, integral_instrument) {
    summary = '';
    if (integral_instrument) {
      data_units = [];
      if (response.products.hasOwnProperty('input_prod_list')) {
        data_units = data.products.input_prod_list;
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
      summary = '<table class="status-table"><thead><tr><th></th><th>Data unit</th>';
      first_unit_data = Object.keys(current_status_table)[0];
      for (j in distinct_nodes) {
        node = distinct_nodes[j];
        summary += '<th class="rotate"><div><span>' + node + '</span></div></th>';
      }

      // Get all data units, rows
      summary += '</tr></thead><tbody>';
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
        summary += '<tr><td>' + current_counter + '</td><td>' + data_unit_label + '</td>';
        for (j in distinct_nodes) {
          started_or_not = '';
          node = distinct_nodes[j];
          value = '';
          var cssClass = '';
          if (typeof current_status_table[data_unit] !== 'undefined' && typeof current_status_table[data_unit][node] !== 'undefined'
            && Object.keys(current_status_table[data_unit][node]).length) {
            cssClass = get_node_status_class(current_status_table[data_unit][node]);
          }
          summary += '<td class="' + cssClass + '" data-toggle="tooltip" data-container="#ldialog .summary" title="' + value + '"></td>';
        }

        summary += '</tr>';
      }

      summary += '</tbody></table>';
    }

    return summary;
  }

  function get_server_detailed_message(response, integral_instrument) {
    // if integral
    if (integral_instrument) {
      if (response['job_monitor'].hasOwnProperty('full_report_dict_list') && response['job_monitor'].full_report_dict_list.length > 0) {
        details = '<table class="message-table"><thead><tr><th>Data unit</th><th>node</th><th>message</th></tr></thead><tbody>';
        for (var j = 0; j < response['job_monitor'].full_report_dict_list.length; j++) {
          details += '<tr><td>' + response['job_monitor'].full_report_dict_list[j].scwid + '</td><td>' + response['job_monitor'].full_report_dict_list[j].node + '</td><td>'
            + response['job_monitor'].full_report_dict_list[j].message + '</td></tr>';
        }
        details += '</tbody></table>';
      }
    } else {
      if (response['job_monitor'].hasOwnProperty('full_report_dict')) {
        details = '';
        if (response['job_monitor'].full_report_dict.hasOwnProperty('stage'))
          details += `stage: ${response['job_monitor'].full_report_dict.stage}`;
        if (response['job_monitor'].full_report_dict.hasOwnProperty('progress'))
          details += ` - progress: ${response['job_monitor'].full_report_dict.progress}`;
        if (details)
          details += '<br>';
      }
    }
    return details;
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

  function showErrorWhenTruncatedPaste() {
    $("input[type=text][maxlength], textarea[maxlength]").bind("paste", function(e) {
      var pastedDataLength = e.originalEvent.clipboardData.getData('text').length;
      if ($(this)[0].hasAttribute('maxlength') && !isNaN(parseInt($(this).attr('maxlength')))) {
        var maxlength = parseInt($(this).attr('maxlength'));
        if (pastedDataLength > maxlength) {
          $(this).data('truncatedPaste', true);
          $(this).data('pastedValueLength', pastedDataLength);
          var gparent_elt = $(this).parent().parent();
          $('label', gparent_elt).addClass('control-label');
          gparent_elt.addClass('has-feedback has-error');
          e.preventDefault();
          var current_form = $(this).closest('form');
          var elt_name = $(this).attr('name');
          current_form.data('bootstrapValidator').updateStatus(elt_name, 'NOT_VALIDATED').validateField(elt_name);
        }
      }
    });

    $("input[type=text], textarea").bind("input", function() {
      var parent_elt = $(this).parent().parent();
      parent_elt.removeClass('has-feedback has-error');
    });
  }

  function all_instruments_forms_set_bootstrapValidator() {

    var validator_fields = {};
    
    $("input[type=text][maxlength], textarea[maxlength]").each(function() {
      var name = $(this).attr('name');
      //      var maxlength = parseInt($(this).attr('maxlength'));
      validator_fields[name] = {
        // enabled: false,
        validators: {
          callback: {
            callback: function(value, validator, $field) {
              return (validate_paste($field));
            }
          }
        }
      }
    });

    validator_fields['scw_list'] = {
        // enabled: false,
        validators: {
          callback: {
            callback: function(value, validator, $field) {
              return (validate_scws(value, 500));
            }
        }
      }
    };
    
    validator_fields['time_bin'] = {
      // enabled: false,
      validators: {
        callback: {
          callback: function(value, validator, $field) {
            return (validate_timebin(value, validator, $field));
          }
        }
      }
    };

    validator_fields['E1_keV'] = {
      // enabled: false,
      validators: {
        notEmpty: {
          message: 'Please enter a value'
        },
        callback: {
          callback: function(value, validator, $field) {
            var E2_keV = validator.getFieldElements('E2_keV').val();
            if (Number(value) >= Number(E2_keV)) {
              return {
                valid: false,
                message: 'Energy min must be lower than energy max'
              }
            }
            return true;
          }
        }
      }
    };
    validator_fields['E2_keV'] = {
      // enabled: false,
      validators: {
        notEmpty: {
          message: 'Please enter a value'
        },
        callback: {
          callback: function(value, validator, $field) {
            var E1_keV = validator.getFieldElements('E1_keV').val();
            if (Number(value) <= Number(E1_keV)) {
              return {
                valid: false,
                message: 'Energy max must be higher than energy min'
              }
            }
            return true;
          }
        }
      }
    };
    euclid_multi_fields = $('.euclid-instruments-filters .form-control');

    for (let fld of euclid_multi_fields) {
      validator_fields[fld.name] = {
        validators: {
          notEmpty: {
            message: (fld.type == 'select-one') ? 'Please select filter' : 'Please enter a value'
          }
        }
      }
    };

    $('.instrument-panel form').bootstrapValidator({
      fields: validator_fields,
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      }
    });
  }

  function insert_new_multivalued_field(add_multivalued_button) {
    var current_instrument_form_validator = $(add_multivalued_button).closest('.instrument-panel form').data('bootstrapValidator');
    var multivalued_field = $(add_multivalued_button).closest('.multivalued-field');
    var current_row = $(add_multivalued_button).prev();
    var newVAlue = current_row.clone();
    $('input, select, textarea', newVAlue).val('');
    current_row.after(newVAlue);
    $('button', multivalued_field).prop('disabled', false);
    $('input, select, textarea', newVAlue).each(function() {
      current_instrument_form_validator.addField($(this));
    });
    newVAlue.show();
  }

  function delete_multivalued_field(delete_multivalued_button) {
    multivalued_field = $(delete_multivalued_button).closest('.multivalued-field');
    var current_row = $(delete_multivalued_button).parent();
    current_row.remove();
    var nb_rows = $('.multivalued-value', multivalued_field).length;
    if (nb_rows == 1) $('button.delete-multivalued-element', multivalued_field).prop('disabled', true)
  }


  function commonReady() {
    $('.multivalued-field').removeClass('form-group');

    all_instruments_forms_set_bootstrapValidator();
    var add_multivalued_elt_button = $('<button>').addClass('btn btn-secondary add-multivalued-element').append($('<span>').addClass('glyphicon glyphicon-plus'));
    var del_multivalued_elt_button = $('<button>').addClass('btn btn-secondary delete-multivalued-element').append($('<span>').addClass('glyphicon glyphicon-minus'));
    $('.multivalued-field').append(add_multivalued_elt_button);
    $('.multivalued-field .multivalued-value').append(del_multivalued_elt_button);
    $('button', '.multivalued-field .multivalued-value').prop('disabled', true);

    $('.multivalued-field .multivalued-value').each(function() {
      var multivalued_field = $(this).closest('.multivalued-field');
      var labels = $(this).clone();
      labels.find('input, select, textarea, button').remove();
      labels.removeClass('multivalued-value');
      $(this).find('label').remove();
      multivalued_field.find('label:first').after(labels);
    })

    $('.multivalued-field').on('click', '.add-multivalued-element', function(e) {
      // Prevent form submission
      e.preventDefault();
      insert_new_multivalued_field(this);
    });
    $('.multivalued-field').on('click', '.delete-multivalued-element', function(e) {
      // Prevent form submission
      e.preventDefault();
      delete_multivalued_field(this);
    });

    $('body').on('click', '#ldialog .close-button', function(e) {
      e.preventDefault();
      if (requestTimer !== null) {
        window.clearTimeout(requestTimer);
      }
      // clean-up modal window
      $('#ldialog .header-message .job-id').html('');
      $('#ldialog .header-message .session-id').html('');
      $('#ldialog .job-info .job-id').html('');
      $('#ldialog .job-info .session-id').html('');
      waitingDialog.replace();
      $('#ldialog .details').hide();
      $('#ldialog .more-less-details .fa-info-circle').css('color', '');
      $('#ldialog .progress').addClass('progress-striped');
      waitingDialog.setProgressBarText('');
      waitingDialog.setProgressBarTextColor('black');
      waitingDialog.disableReturnProgressLink();
      waitingDialog.showMoreLessLink();
      waitingDialog.disableMoreLessLink();
      waitingDialog.hideLegend();

      // remove any child html-progress modal window
      $("#ldialog > *").each(function() {
        var id = $(this).attr('id');
        if (id !== 'ldialog-modal-dialog')
          $(this).remove();
      });

      if (typeof mmoda_ajax_jqxhr[$(this).data('mmoda_jqxhr_index')] !== 'undefined') {
        mmoda_ajax_jqxhr[$(this).data('mmoda_jqxhr_index')].abort();
      }
      if ($(this).data("mmoda_gallery_close") == 1) $('#mmoda-gallery-panel').data("mmoda_gallery_close", 1);
      if ($('#ldialog-modal-dialog').data("return_progress_jqxhr")) $('#ldialog-modal-dialog').data("return_progress_jqxhr").abort();

      $(this).removeData('mmoda_gallery_close');
      $(this).removeData('mmoda_jqxhr_index');

    });

    $('#ldialog').on('hidden.bs.modal', function() {
      $('#ldialog button.write-feedback-button').hide();
      $(".notice-progress-container").hide();
    })

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

    $("body").on('click', '.panel .close-panel', function() {
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

      // update the lightcurve only if it is in the parameters panel
      if (panel.data('lightcurve_parent_panel_id')) {
        lightcurve_parent_panel_id = $(panel.data('lightcurve_parent_panel_id'));
        lightcurve_parent_panel_id.removeData('lightcurve_panel_id');
      }

      if (panel.data('log_product_panel_id')) {
        log_product_panel_id = panel.data('log_product_panel_id');
        $(log_product_panel_id).removeData('log_panel_id');
      }

      if (panel.data('api_code_product_panel_id')) {
        log_product_panel_id = panel.data('api_code_product_panel_id');
        $(log_product_panel_id).removeData('api_code_panel_id');
      }

      if (panel.data('query_parameters_product_panel_id')) {
        query_parameters_product_panel_id = panel.data('query_parameters_product_panel_id');
        $(query_parameters_product_panel_id).removeData('query_parameters_panel_id');
      }

      if (panel.data('return_progress_html_output_product_panel_id')) {
        query_parameters_product_panel_id = panel.data('return_progress_html_output_product_panel_id');
        $(query_parameters_product_panel_id).removeData('return_progress_html_output_id');
      }

      if (panel.data('return_progress_jqxhr')) {
        return_progress_jqxhr = panel.data('return_progress_jqxhr');
        return_progress_jqxhr.abort();
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
      display_image_js9($(this).data("image_file_path"), $(this).data());
    });

    $("body").on('click', '.result-panel .show-log', function(e) {
      e.preventDefault();
      var log_parent_panel = $(this).closest('.panel');
      var log = log_parent_panel.data('log');
      var parent_log_offset = $(this).closest(".instrument-panel").offset();

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

    $("body").on('click', '.result-panel .api-code', function(e) {
      e.preventDefault();
      var api_code_parent_panel = $(this).closest('.panel');
      var parent_api_code_offset = $(this).closest(".instrument-panel").offset();

      var api_code_offset = {};
      api_code_offset.top = e.pageY;
      api_code_offset.left = e.pageX;
      if (api_code_panel_id = api_code_parent_panel.data('api_code_panel_id')) {
        $(api_code_panel_id).highlight_result_panel(api_code_offset);
        $('.fa-chevron-down', api_code_panel_id).click();
      } else {
        // Show api_code
        var datetime = $(this).attr('data-datetime');
        api_code_offset.top -= parent_api_code_offset.top;
        api_code_offset.left -= parent_api_code_offset.left;

        display_api_code(api_code_parent_panel.data('api_code'), '#' + api_code_parent_panel.attr('id'), datetime, api_code_offset);
      }
    });

    $(".tab-content, #ldialog").on('click', ".return-progress-link-tooltip", function(e) {
      e.stopPropagation();
    });

    $(".tab-content").on('click', '.return-progress-link.enabled .prompt', function(e) {
      let target_obj = $(e.target);
      let parent_target_obj = target_obj.parent();
      let parent_panel = $(this).closest('.panel');
      let formData_return_progress_link = parent_panel.data('formData_return_progress_link');
      let return_progress_html_output = parent_panel.data('return_progress_html_output');
      let return_progress_html_panel_id = parent_panel.data('return_progress_html_output_id');
      var progress_html_offset = { left: parent_panel.offset().left, top: e.pageY - parent_panel.offset().top };
      if (return_progress_html_panel_id) {
        $(return_progress_html_panel_id).highlight_progress_panel(progress_html_offset, parent_panel.attr('id'));
        $('.fa-chevron-down', return_progress_html_panel_id).click();
        return;
      }
      if (return_progress_html_output) {
        panel_id = display_progress_html_output(return_progress_html_output,
          '#' + parent_panel.attr('id'),
          progress_html_offset,
          false,
          true);
        $('.fa-chevron-down', return_progress_html_panel_id).click();
        parent_panel.data({
          'return_progress_html_output_id': '#' + panel_id
        });
        return;
      }
      parent_target_obj.find('.fa-spinner').show();
      target_obj.hide();
      AJAX_call_get_token().done(
        function(data, textStatus, jqXHR) {
          formData_return_progress_link.set('return_progress', 'True');
          formData_return_progress_link.set('query_status', 'new');
          if (data.hasOwnProperty('token') && data.token !== null && data.token !== undefined && data.token !== '')
            formData_return_progress_link.set('token', data.token);
            var return_progress_jqXHR = $.ajax({
              url: current_ajax_call_params.action,
              data: formData_return_progress_link,
              dataType: 'json',
              processData: false,
              contentType: false,
              timeout: ajax_request_timeout,
              type: 'POST'
            }).done(function(data, textStatus, jqXHR) {
              console.log(data);
              if (data.products.hasOwnProperty('progress_product_html_output')) {
                output_html = data.products.progress_product_html_output;
                panel_id = display_progress_html_output(output_html,
                  '#' + parent_panel.attr('id'),
                  progress_html_offset,
                  true,
                  true);
              } else  {
                output_html = '<div class="summary-failures alert alert-danger">Output notebook currently not available. Our team is notified and is working on it.</div>';
                panel_id = display_progress_html_output(output_html,
                  '#' + parent_panel.attr('id'), 
                  progress_html_offset, 
                  true, 
                  true);
              }
              parent_panel.data({
                'return_progress_html_output': output_html,
                'return_progress_html_output_id': '#' + panel_id
              });
            }).complete(function(jqXHR, textStatus) {
              parent_target_obj.find('.fa-spinner').hide();
              target_obj.show();
            }).error(function(jqXHR, textStatus, errorThrown) {
              parent_target_obj.find('.fa-spinner').hide();
              target_obj.show();
            });
            
            // jqxhr
            parent_panel.data("return_progress_jqxhr", return_progress_jqXHR);

        }
      );

    });

    
    $("#ldialog").on('click', '.return-progress-link.enabled .prompt', function(e) {
      waitingDialog.showSpinner();
      waitingDialog.hidePrompt();
      let parent_panel = $('#ldialog-modal-dialog');
      AJAX_call_get_token().done(
        function(data, textStatus, jqXHR) {
          current_ajax_call_params.currentFormData.set('return_progress', 'True');
          current_ajax_call_params.currentFormData.set('query_status', 'new');
          if (data.hasOwnProperty('token') && data.token !== null && data.token !== undefined && data.token !== '')
            current_ajax_call_params.currentFormData.set('token', data.token);
          var return_progress_jqXHR = $.ajax({
            url: current_ajax_call_params.action,
            data: current_ajax_call_params.currentFormData,
            dataType: 'json',
            processData: false,
            contentType: false,
            timeout: ajax_request_timeout,
            type: 'POST'
          }).done(function(data, textStatus, jqXHR) {
            $("#ldialog > *").each(function() {
              var id = $(this).attr('id');
              if (id !== 'ldialog-modal-dialog')
                $(this).remove();
            });
            console.log(data);
            var progress_html_offset = { left: parent_panel.offset().left, top: 50 };
            if (data.products.hasOwnProperty('progress_product_html_output')) {
              display_progress_html_output(data.products.progress_product_html_output, '#' + parent_panel.attr('id'), progress_html_offset);
            } else  {
              delete progress_html_offset.top;
              display_progress_html_output('<div class="summary-failures alert alert-danger">Output notebook currently not available. Our team is notified and is working on it.</div>', '#' + parent_panel.attr('id'), progress_html_offset, true);
            }
          }).complete(function(jqXHR, textStatus) {
            console.log(jqXHR.responseText);
            waitingDialog.hideSpinner();
            waitingDialog.showPrompt();
          }).error(function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            waitingDialog.hideSpinner();
            waitingDialog.showPrompt();
          });
          // jqxhr
          parent_panel.data("return_progress_jqxhr", return_progress_jqXHR);
        }
      );
    });

    $("body").on('click', '.result-panel .renku-publish', function(e) {
      e.preventDefault();
      renku_publish_formData = new FormData();
      url_params = {};
      let job_id = $(this).data('job_id');
      let renku_publish_panel = $(this)[0];

      AJAX_call_get_token().done(
        function(data, textStatus, jqXHR) {
          if (data.hasOwnProperty('token') && data.token !== null && data.token !== undefined && data.token !== '') {
            let token = data.token;
            let url_dispatcher_renku_publish_url = get_renku_publish_url(token, job_id)

            // remove any previous results
            if (renku_publish_panel.parentElement.nextSibling.className === 'result-renku-publish')
              renku_publish_panel.parentElement.nextSibling.remove();

            // disable publish-on-renku button
            e.target.disabled = true;

            // show spinner
            let div_spinner = get_div_spinner();
            renku_publish_panel.parentElement.after(div_spinner);

            var renku_publish_jqxhr = $.ajax({
              url: url_dispatcher_renku_publish_url,
              processData: false,
              contentType: false,
              context: this,
              timeout: ajax_request_timeout,
              type: 'POST'
            }).complete(function(renku_publish_jqXHR, renku_publish_textStatus) {
              serverResponse = '';
              try {
                serverResponse = $.parseJSON(renku_publish_jqXHR.responseText);
              } catch (e) {
                serverResponse = renku_publish_jqXHR.responseText;
              }
              publish_response_title = 'Renku publish result: ';
              publish_result_type = 'success';
              if (renku_publish_textStatus == 'error') {
                if (typeof serverResponse === 'object' && serverResponse.hasOwnProperty('error_message'))
                  serverResponse = `\"${serverResponse.error_message}\" - we will work to fix the issue.`;
                else
                  serverResponse = 'we will work to fix the issue.';

                serverResponse += ' In the meantime you can check the status of <a target="_blank" href="https://renkulab.statuspage.io/">Renku</a> and' +
                  ' <a target="_blank" href="https://mmoda.statuspage.io/">Mmoda</a>.'
                // https://renkulab.statuspage.io/ and https://mmoda.statuspage.io/ 

                publish_response_title = 'Could not publish to Renku:';

                publish_result_type = 'publish_error';
              } else {
                // success -> redirect to the link returned from the call
                window.open(serverResponse, "_blank");
              }

              // hide/remove the spinner
              $('.renku-progress').remove();
              // re-enable publish-on-renku button, or disable it forever?
              e.target.disabled = false;

              let publish_result_panel = display_renku_publish_result(publish_result_type, serverResponse, publish_response_title);
              renku_publish_panel.parentElement.after(publish_result_panel);

            }).error(
              function(renku_publish_jqXHR, renku_publish_textStatus, renku_publish_errorThrown) {
                console.log(renku_publish_textStatus);
                e.target.disabled = false;
              }
            );
          } else {
            publish_response_title = 'Error while publishing to Renku: ';
            publish_result_type = 'publish_error';
            no_user_loged_in_error_message = 'please login to MMODA first and then retry';

            let publish_result_panel = display_renku_publish_result(publish_result_type, no_user_loged_in_error_message, publish_response_title);
            renku_publish_panel.parentElement.after(publish_result_panel);
          }
        }).error(function(jqXHR, textStatus, errorThrown) {
          console.log('Error in requesting the user token:');
          console.log('textStatus : ' + textStatus);
          console.log('errorThrown :' + errorThrown);
          console.log('jqXHR');
          console.log(jqXHR);
        });


    });

    $("body").on('click', '.panel .copy-api-code', function(e) {
      e.preventDefault();
      var parent_panel = $(this).closest('.panel');
      api_code_product_panel_id = parent_panel.data('api_code_product_panel_id');
      copyToClipboard($(api_code_product_panel_id).data('api_code'));
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

    $("body").on('click', '.copy-api-token', function(e) {
      e.preventDefault();
      token_text = $("#edit-submitted-copy-button p")[0].textContent;
      if (token_text !== undefined)
        copyToClipboard(token_text);
    });

    // --------------- Catalog Toolbar start
    var toolbar = $('<div>').addClass('inline-user-catalog btn-group').attr('role', 'group');
    var dbutton = $('<button>').attr('type', 'button').addClass('btn btn-default');

    // Add button : Show inline catalogue
    button = dbutton.clone().addClass('show-catalog').text('Inline catalog');
    toolbar.append(button);

    // Add button : Remove inline catalogue
    button = dbutton.clone().addClass('remove-catalog');
    glyphicon = $('<span>').addClass("glyphicon glyphicon-remove");
    glyphicon.attr({ title: "Remove inline catalogue" });
    button.append(glyphicon);
    toolbar.append(button);
    $('.form-item-files-user-catalog-file').after(toolbar);
    // --------------- Catalog Toolbar end

    // Warn the user that if he/she selects objects
    // only those objects will be copied to the used catalog
    $("body").on('click', '.catalog-wrapper table.mmoda tr td.select-checkbox', function(e) {
      e.preventDefault();
      var catalog_panel = $(this).closest('.panel');
      var dataTable = catalog_panel.data('dataTable');
      if (dataTable.rows({ selected: true }).count() == 0) {
        $('.use-catalog', catalog_panel).text('Use catalog').removeClass('highlight');
      }
      else {
        $('.use-catalog', catalog_panel).text('Use catalog with selected objects only').addClass('underline');
      }
    });

    $("body").on('click', '.result-panel .use-catalog', function(e) {
      e.preventDefault();
      var catalog_panel = $(this).parents('.result-panel');
      var catalog_parent_panel = $(catalog_panel.data('catalog_parent_panel_id'));
      var catalog = clone(catalog_parent_panel.data('catalog'));
      var dataTable = catalog_panel.data('dataTable');
      if (dataTable.rows({ selected: true }).count() > 0) {
        dataTable.rows({ selected: false }).remove();
      }
      catalog.data = dataTable.data().toArray();
      $(".instrument-panel.active .instrument-params-panel").data({
        catalog: catalog,
        dataTable: dataTable
      });
      $('.instrument-panel.active .instrument-params-panel .inline-user-catalog').css('display', 'inline-block');

      var event = $.Event('click');
      var showCatalog = $('.instrument-panel.active .instrument-params-panel .inline-user-catalog');
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
        $('button.show-catalog', showCatalog).trigger(event);
      });
    });

    // delete catalog when attached to panel
    $(".instrument-panel .instrument-params-panel .inline-user-catalog").on('click', ".remove-catalog", function() {
      $(this).parent().hide();
      var panel = $(this).closest(".instrument-params-panel");
      if (panel.data('catalog')) {
        panel.removeData('catalog');
      }
      if (panel.data('catalog_panel_id')) {
        catalog_panel_id = panel.data('catalog_panel_id');
        $(catalog_panel_id).remove();
      }
    });

    waitingDialog = get_waitingDialog();
    // The main block is hidden at startup (in mmoda.css) and
    // shown here after the setup of DOM and the field controls
    $('.block-mmoda').show();
    $('body').on('click', '.mmoda-log .more-less-details.enabled', function(e) {
      e.preventDefault();
      var $this = $(this);
      // var details = $(this).parent().find('.details');
      var details = $('#ldialog .summary .details');
      details.slideToggle('slow', function() {
        // var txt = $(this).is(':visible') ? '< Less details' : 'More details >';
        // $this.text(txt);
      });
    });

    // Create validator and validate a frist time :
    // This is important in Firefox when the page is refreshed
    // where indeed the old values are still in the form

    $('[name^=time_bin_format]', '.instrument-params-panel form').on('change', function() {
      var form = $(this).parents('form');
      form.data('bootstrapValidator').updateStatus('time_bin', 'NOT_VALIDATED').validateField('time_bin');
    });

    $('[name=E1_keV]', '.instrument-params-panel form').on('change', function() {
      var form = $(this).parents('form');
      form.data('bootstrapValidator').updateStatus('E2_keV', 'NOT_VALIDATED').validateField('E2_keV');
    });

    $('[name=E2_keV]', '.instrument-params-panel form').on('change', function() {
      var form = $(this).parents('form');
      form.data('bootstrapValidator').updateStatus('E1_keV', 'NOT_VALIDATED').validateField('E1_keV');
    });

    $('.instrument-panel form').on('error.form.bv', function(e) {
      e.preventDefault();
    });

    $('.instrument-panel form').on('success.form.bv', function(e) {
      e.preventDefault();
      //      if ($(e.target).is('.instrument-panel form.mmoda-iframe-result')) {
      //        e.stopPropagation();
      //        return;
      //      }

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
        $('[name^=form_]', '.common-params').prop('disabled', true);
        // $('[name=catalog_selected_objects]',
        // this).prop('disabled',
        // true);

        // Collect object name 
        var allFormData = $("form#mmoda-name-resolve").serializeArray().map(function(item, index) {
          return (item);
        });

        // Collect common parameters
        var commonFormData = $("form#mmoda-common").serializeArray().map(function(item, index) {
          if (item.name == 'T1' || item.name == 'T2') {
            item.value = item.value.replace(' ', 'T')
          }
          return (item);
        });
        var instrument_form_serializeJSON = $($(this)[0]).serializeJSON();
        var instrument_form_serializeArray = [];
        multival_pars = $.unique($.map($(this).find('.multivalued-value .form-control'), (x) => x.name.split('[')[0]));
        $.each(instrument_form_serializeJSON, function(param, value) {
          if (multival_pars.includes(param)) {
            let multivalued_param_element = $(`.multivalued-value .form-control[name^="${param}"]`);
            let multivalued_param_name = multivalued_param_element.attr('multivalued_field_param_name') || multivalued_param_element.attr('name');
            instrument_form_serializeArray.push({ 'name': multivalued_param_name, 'value': JSON.stringify(value) });
          }
          else instrument_form_serializeArray.push({ 'name': param, 'value': value });
        });

        // Collect instrument form fields and remove the
        // form id prefix from
        // the name
        var instrumentFormData = instrument_form_serializeArray.map(function(item) {
          item.name = item.name.replace(form_id + '_', '');
          return (item);
        });

        allFormData = allFormData.concat(commonFormData).concat(instrumentFormData);
        formData = new FormData();
        for (var lindex = 0; lindex < allFormData.length; lindex++)
          formData.append(allFormData[lindex].name, allFormData[lindex].value);
        // Enable form elements added by Drupal
        $('[name^=form_]', this).prop('disabled', false);
        $('[name^=form_]', '.common-params').prop('disabled', false);
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
            let file_entry_name = $(this).attr('name').replace(form_id + '_', '');
            formData.append(file_entry_name, file.files[0]);
          }
        });
      }
      $('input[name=xspec_model]', this).prop('disabled', false);
      $('input.spectrum-fit-param', this).prop('disabled', true);

      request_draw_spectrum = false;

      waitingDialog.show('Processing ...', {'summary': ''}, {
        progressType: 'success',
        showProgressBar: true,
        showSpinner: false,
        showReturnProgressLink: true
      });
      waitingDialog.setProgressBarText('processing request');
      waitingDialog.setProgressBarBackgroundcolor('#8da38f');
      waitingDialog.setProgressBarWidthPercentage(100);
      waitingDialog.hideHeaderMessage();
      $('.write-feedback-button').show();
      $(".notice-progress-container").hide();

      current_ajax_call_params = {};
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
      run_analysis_data_query_status = undefined;

      AJAX_submit_call();
    });

    $('body').on('click', '.open-in-modal', function(e) {
      e.preventDefault();

      // var current_modal = $(this).closest('.modal');
      var home_link = '';
      if (!$(this).hasClass('help-home')) {
        home_link_elt = $("<span>")
          .append($("<a>", { text: $("#help-home").attr('title'), class: 'open-in-modal help-home', href: $("#help-home").attr('href') })).append(' > ');
        home_link = home_link_elt[0].outerHTML;
      }

      var open_in_modal_base_path = $(this).attr('href');
      let path_items = open_in_modal_base_path.split("/");
      path_items.pop(); // remove the last
      open_in_modal_base_path = path_items.join("/");

      $.get($(this).attr('href'), function(data) {
        var html = $.parseHTML(data);
        var help_text = $(".region-content", html);
        var title = $(".page-header", html).text();
        help_text.find('#table-of-contents-links ul.toc-node-bullets li a, .toc-top-links a').each(function() {
          $(this).attr('href', $(this).attr('href').substring($(this).attr('href').indexOf("#")));
        });
        help_text.find('#table-of-contents-links').addClass('rounded');

        $("a[href]:not(.colorbox, [download], .active-trail)", help_text).each(function() {
          if (!(this.hostname && this.hostname !== location.hostname) && !$(this).attr('href').startsWith("#")) {
            $(this).addClass('open-in-modal');
            if ($(this).attr('href').indexOf(open_in_modal_base_path) < 0) {
              $(this).attr('href', open_in_modal_base_path + '/' + $(this).attr('href'));
            }
          }
          else if (!$(this).attr('href').startsWith("#")) $(this).attr('target', '_blank');
        });
        message = { 'summary': help_text };
        waitingDialog.show(home_link + title, message, {
          dialogSize: 'lg',
          showTitle: true,
          buttonText: 'Close',
          showCloseInHeader: true,
        });
        $('.colorbox').colorbox({ rel: 'mmoda-gallery', maxWidth: "100%", maxHeight: "100%" });
        $('#ldialog .modal-body').scrollTop(0);
        $(window).scrollTop(0);
        //        window.scroll(0, 0);
        //        $('html, body').animate({scrollTop:0},500);
      });
      return false;
    });

    if (Drupal.settings.hasOwnProperty('url_parameters')) {
      $('.instruments-panel .nav-tabs li#' + Drupal.settings.url_parameters.instrument + '-tab a').tab('show');
      make_request(Drupal.settings.url_parameters);
    }
    showErrorWhenTruncatedPaste();
  }

  function make_request(request_parameters) {
    var instrument_panel = $(".instrument-panel-" + request_parameters.instrument);
    var current_instrument_form_validator = $('form', instrument_panel).data('bootstrapValidator');

    // If there's just an error_message, visualize it
    if (request_parameters.hasOwnProperty('error_message')) {
      waitingDialog.show('Error message', {'summary': ''}, {
        progressType: 'success',
        'showProgress': true,
        'showButton': true
      });
      waitingDialog.showJobInfo();
      $('.write-feedback-button').show();
      waitingDialog.hideSpinner();

      warning_obj = {'failures' : '<table class="error-table"><tr>' +
        '<td>' + get_current_date_time() + '</td>' +
        '<td>error ' + request_parameters.status_code + ', ' + request_parameters.error_message + '</td>' +
        '</tr></table>',
      };
      waitingDialog.append(warning_obj, 'danger');
    }
    else {
      // Set catalog in the corresponding instrument form
      if (request_parameters.hasOwnProperty('selected_catalog') && request_parameters.selected_catalog) {
        var catalog = JSON.parse(request_parameters.selected_catalog);
        var datetime = get_current_date_time();
        attach_catalog_data_image_panel(datetime, catalog, $(".instrument-params-panel", instrument_panel));
        $(".instrument-params-panel .inline-user-catalog", instrument_panel).removeClass("hidden");
      }
      make_request_error = false;
      var make_request_error_messages = [];
      // var all_form_inputs = [];

      $('div.multivalued-field', 'form.' + request_parameters.instrument + '-form') .each(function() {
        // get name of the first select element
        var re_multivalued_field = new RegExp('\\[[^\\]]*\\]\\[\\]');
        let multivalued_field_name = $('input', this).attr('multivalued_field_param_name') ? $('input', this).attr('multivalued_field_param_name') : $('input', this).attr('name');
        var field_name = multivalued_field_name.replace(re_multivalued_field, '');
        let add_multivalued_button = $(this).find('.add-multivalued-element');
        if (request_parameters.hasOwnProperty(field_name)) {
          var field_values = request_parameters[field_name];
          let parsed_field_obj = JSON.parse(field_values);
          // for each key in the object, add a new multivalued field
          let parsed_field_obj_keys = Object.keys(parsed_field_obj);
          let num_multivalued_field = parsed_field_obj[parsed_field_obj_keys[0]].length;
          for (let i = 0; i < num_multivalued_field ; i++) {
            for(key of parsed_field_obj_keys) {
              var select_list = $('select', this).filter(function() {
                return $(this).attr('name') === `${field_name}[${key}][]`;
              });
              // check if the select has the value amongst its options
              let select_element = $(select_list[select_list.length - 1]);
              let hasOption = select_element.find('option').filter(function() {
                return $(this).val() === parsed_field_obj[key][i];
              }).length > 0;
              if (!hasOption)
                select_element.append(new Option(parsed_field_obj[key][i], parsed_field_obj[key][i]));
              select_element.val(parsed_field_obj[key][i]);
            }
            if($('.multivalued-value', this).length < num_multivalued_field)
              insert_new_multivalued_field(add_multivalued_button[0]);
          }
        }
      });

      $('input, textarea, select', 'form#mmoda-name-resolve, form#mmoda-common, form.' + request_parameters.instrument + '-form').each(function() {
        var re = new RegExp('mmoda_?-?' + request_parameters.instrument + '_?-?');
        var field_name = $(this).attr('name').replace(re, '');

        // all_form_inputs.push(field_name);
        // in case of field_name == user_catalog_file, it would crash, the dispatcher should not pass it?
        if (request_parameters.hasOwnProperty(field_name)) {
          // if the form element type is file, we should check if it is part of file input/url element:
          // it has to be checked if it exists an element with the same name in the form and "_type" appended to it
          let type_selector = $(`[name="mmoda_${request_parameters.instrument}_${field_name}_type"]`);
          if ($(this).attr('type') == 'file') {
            if (type_selector.length == 0) {
              make_request_error = true;
              make_request_error_messages.push('File parameter (' + field_name + ') can not be set via url');
            }
          } else if ($(this).attr('type') == 'radio') {
            if (type_selector.length == 0) {
              let url_request_value = request_parameters[field_name];
              if($(this).val() == 0 || $(this).val() == 1) {
                if(request_parameters[field_name].toLowerCase() == "true" || request_parameters[field_name] == "1") {
                  url_request_value = 1;
                } else if(request_parameters[field_name].toLowerCase() == "false" || request_parameters[field_name] == "0") {
                  url_request_value = 0;
                }
              }
              if ($(this).val() == url_request_value) {
                $(this).click();
              }
            }
          } else {
            if (type_selector.length > 0) {
              let type_selector_url = $(`[name="mmoda_${request_parameters.instrument}_${field_name}_type"][value="url"]`);
              if (type_selector_url.length > 0)
                type_selector_url.click();
            }
            try {
              $(this).val(request_parameters[field_name]);
            }
            catch (err) {
              make_request_error_messages.push('Failed initializing the parameter ' + field_name + ' in the request form');
              make_request_error = true;
              $('form.' + request_parameters.instrument + '-form').data('bootstrapValidator').updateStatus(field_name, 'NOT_VALIDATED').validateField(field_name);
            }
          }
        }
      });
      // all_form_inputs = all_form_inputs.filter(function(itm, i, a) {
      //   return i == a.indexOf(itm);
      // });
      // based on the black-listed parameters within the dispatcher, there used for the generation of the job_id, to be kept synchronized
      //      let accepted_params_url = ['query_status', 'oda_api_version', 'api', 'off_line', 'async_dispatcher', 'dry_run', 'selected_catalog'];
      //      for (parameter in request_parameters) {
      //        if (all_form_inputs.indexOf(parameter) == -1 && accepted_params_url.indexOf(parameter) == -1) {
      //          make_request_error_messages.push('Unknown parameter in the url:' + parameter);
      //          make_request_error = true;
      //        }
      //      }

      if (!make_request_error) {
        both_forms_valid = true;
        $('input, textarea, select', 'form#mmoda-common').each(function() {
          common_form_validator.validateField($(this).attr('name'));
          if (!common_form_validator.isValidField($(this).attr('name')))
            both_forms_valid = false;
        });

        if (both_forms_valid) {
          $('input, textarea, select', 'form.' + request_parameters.instrument + '-form').each(function() {
            current_instrument_form_validator.validateField($(this).attr('name'));
            if (!current_instrument_form_validator.isValidField($(this).attr('name')))
              both_forms_valid = false;
          });
        }
        if (!both_forms_valid) {
          make_request_error = true;
          current_instrument_form_validator.disableSubmitButtons(true);
          error_message = '<p>Unfortunately, the URL you used to access this page contains parameters with invalid values.</p>'
            + '<p>You can correct the errors within the form or you probably need another URL. </p>'
            + '<p>If you are not sure how to obtain it, please feel free to contact us using the "Write feedback" form below.</p>';
        }
        else {
          $('form.' + request_parameters.instrument + '-form').submit();
        }
      }
      else {
        error_message = '<p>Unfortunately, the URL you used to access this page contains parameter combination which could not be interpreted.</p>'
          + 'Errors : <ul><li>' + make_request_error_messages.join('</li><li>') + '</li></ul>'
          + '<p>You probably need another URL. </p>'
          + '<p>If you are not sure how to obtain it, please feel free to contact us using the "Write feedback" form below.</p>';
      }
      if (make_request_error) {
        waitingDialog.show('Processing request parameters ...', {'summary': ''}, {
          showProgressBar: false,
          showSpinner: false
        });
        warning_obj = {'failures' : error_message};
        waitingDialog.append(warning_obj, 'danger');
        $('.write-feedback-button').show();
      }
    }
  }

  function create_catalog_datatable(editor, catalog, catalog_container, enable_use_catalog) {
    var buttons = [
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
          }]).create().set('src_names', $('input[name=src_name]', '.common-params').val()).set('ra', $('input[name=RA]', '.common-params').val()).set('dec',
            $('input[name=DEC]', '.common-params').val());
          // Make Editor draggable (movable)
          // $('.DTE_Action_Create').draggable({
          // handle : '.DTE_Header, .DTE_Footer',
          // stack : '.ldraggable',
          // containment : "parent"
          // });
        }
      }];
    var button_save_as_text = [
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
      }];
    if (enable_use_catalog) {
      buttons = buttons.concat(button_save_as_text);
      select_row = {
        style: 'os',
        selector: 'td:first-child'
      };
    }
    else {
      buttons = button_save_as_text;
      select_row = false;
    }

    var catalog_datatable = catalog_container.DataTable({
      data: catalog.data,
      columns: catalog.column_names,
      // dom : 'Brtflip',
      dom: '<"container-fluid"<"top"<"row"B>if>rt<"bottom"<l>p><"clear">>',
      buttons: buttons,
      select: select_row,
      order: [[1, 'asc']],
    });
    if (!enable_use_catalog)
      // Disable row selection by removing the css class select-checkbox from the first column
      catalog_datatable.column(0).nodes().toJQuery().removeClass('select-checkbox');
    return (catalog_datatable);
  }

  function display_catalog(catalog, afterDiv, offset, showUseCatalog) {
    var datetime = catalog.datetime;

    var panel_ids = $(afterDiv).insert_new_panel(desktop_panel_counter++, 'image-catalog', datetime);
    source_name = $('input[name=src_name]', '.common-params').val();
    $('#' + panel_ids.panel_id + ' .panel-heading .panel-title').html('Source : ' + source_name + ' - Image catalog');


    var catalog_panel = $('#' + panel_ids.panel_id);
    var catalog_help_text = '<div class="help-text">To select multiple rows :<ol>' +
      '<li>To select the rows individually, click the first row, hold down the Ctrl key, and click additional rows.</li>' +
      '<li>To select adjacent rows, click the first row, hold down the Shift key, and click the last row.</li></ol></div>';

    $('#' + panel_ids.panel_body_id).append('<div class="catalog-wrapper"><table class="mmoda"></table></div>' + catalog_help_text);

    $(afterDiv).data({
      catalog_panel_id: '#' + panel_ids.panel_id
    });
    catalog_panel.data({
      catalog_parent_panel_id: afterDiv
    });

    var instrument = $('input[name=instrument]', ".instrument-panel.active").val();
    var enable_use_catalog = Drupal.settings.mmoda[instrument].enable_use_catalog;
    if (enable_use_catalog && showUseCatalog) {
      $('.panel-footer', '#' + panel_ids.panel_id).append(
        '<button type="button" class="btn btn-primary pull-right use-catalog" data-datetime="' + datetime + '" >Use catalog</button><div class="clearfix"></div>');
    }

    var editor = new $.fn.dataTable.Editor({
      table: '#' + panel_ids.panel_id + ' .catalog-wrapper .mmoda',
      fields: catalog.fields,
    });

    var catalog_container = $(".catalog-wrapper .mmoda", '#' + panel_ids.panel_id);

    var dataTable = create_catalog_datatable(editor, catalog, catalog_container, enable_use_catalog)

    catalog_panel.data({
      dataTable: dataTable,
      currentRowId: catalog.data.length
    });

    // Activate inline edit on click of a table cell
    if (enable_use_catalog) catalog_container.on('click', 'tbody td:not(:first-child)', function() {
      editor.inline(this);
    });

    editor.on('preSubmit', function(e, data, action) {
      var rowId = Object.keys(data.data)[0];
      if (action === 'confirm') {

      }
      if (action !== 'remove') {
        var ra = this.field('ra');
        var dec = this.field('dec');
        //var src_names = this.field('src_names');
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
              // var distance_same = d.ERR_RAD * 2;
              var distance_same = 0.00001;
              if (distance <= distance_same) {
                // Highlight the row in the table
                $(this.node()).addClass('alert alert-danger');
                $(this).show();

                // Change the editor button to "Save anyway"
                $('.DTE button.save-row').html('Save anyway !').removeClass('btn-primary').addClass('btn-warning').data('confirmation', true);
                // Fix a bug where the opacity of the error message element is set to 0: not displayed
                $('.DTE .DTE_Form_Error').css({
                  'opacity': ''
                });

                editor.error('<div class="alert alert-danger alert-dismissible"><strong>Object already in the catalog ! :</strong><br>Source name: ' + d.src_names + '<br>RA: '
                  + d.ra + '<br>Dec: ' + d.dec + '<br>Distance: ' + distance + '</dv>');
                setTimeout(function() {
                  var row = $(".catalog-wrapper .mmoda", '#' + panel_ids.panel_id).DataTable().row(rowIdx).node();

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

  function display_api_code(api_code, afterDiv, datetime, offset) {
    var panel_ids = $(afterDiv).insert_new_panel(desktop_panel_counter++, 'image-api-code', datetime);
    $('#' + panel_ids.panel_body_id).append('<div class="api-code-wrapper"><pre><code class="language-python">' + api_code + '</code></pre></div>');

    $('#' + panel_ids.panel_body_id).append('<button type="button" class="btn btn-default copy-api-code">Copy API code to clipboard<span class="glyphicon glyphicon-copy"></span></button>');
    $(afterDiv).data({
      api_code_panel_id: '#' + panel_ids.panel_id
    });
    $('#' + panel_ids.panel_id).data({
      api_code_product_panel_id: afterDiv
    });
    source_name = $('input[name=src_name]', '.common-params').val();
    $('#' + panel_ids.panel_id + ' .panel-heading .panel-title').html('Source : ' + source_name + ' - API code');
    $('#' + panel_ids.panel_id).addClass('mmoda-api-code');
    $('#' + panel_ids.panel_id).highlight_result_panel(offset);
    hljs.highlightAll();

  }

  function display_renku_publish_result(publish_result_type = 'success', publish_result, result_title) {
    let div_result = $('<div>').addClass('result-renku-publish');
    let div_result_title = $('<div>').addClass('result-renku-publish-title').text(result_title);
    div_result.append(div_result_title);
    let result_error_message = null;
    // apply custom css max-width, to be improved

    if (publish_result_type == 'success') {
      let link_result = $('<div>')
        .addClass('result-renku-publish-link')
        .css("max-width", '650px')
        .text("Result successfully posted in Renku!");
      div_result.append(link_result);
    } else if (publish_result_type == 'publish_error') {
      result_error_message = $('<div>')
        .addClass('result-renku-publish-link')
        .css("max-width", '600px')
        .html(publish_result);
      // define a tooltip
      if (result_error_message != null) {
        // highlight missing roles
        publish_result_interpreted = publish_result.replace(
          /-(.*)/g,
          function(m) { return '- <b>' + m.substr(1) + '</b>' }
        );

        let result_error_message_tooltip = $('<div>').addClass('result-renku-publish-link-tooltip').html(publish_result_interpreted);
        result_error_message.append(result_error_message_tooltip);
      }

      div_result.append(result_error_message);
    }

    return div_result[0];
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
    source_name = $('input[name=src_name]', '.common-params').val();
    $('#' + panel_ids.panel_id + ' .panel-heading .panel-title').html('Source : ' + source_name + ' - Log');
    $('#' + panel_ids.panel_id).addClass('mmoda-log');
    $('#' + panel_ids.panel_id).highlight_result_panel(offset);
  }

  function display_progress_html_output(html_content, afterDiv, offset, errorDisplay = false, draggable = false) {
    let afterDiv_obj = $(afterDiv);
    var panel_ids = afterDiv_obj.insert_new_panel(desktop_panel_counter++, 'html-progress', undefined, undefined, undefined, draggable);
    $('#' + panel_ids.panel_body_id).append(html_content);
    afterDiv_obj.data({
      progress_html_output_panel_id: '#' + panel_ids.panel_id
    });
    $('#' + panel_ids.panel_id).data({
      progress_html_output_panel_id: afterDiv
    });
    if (!draggable)
      $('#' + panel_ids.panel_id).removeClass('ldraggable');
    $('#' + panel_ids.panel_id + ' .panel-heading .panel-title').html('Current progress');
    $('#' + panel_ids.panel_id).addClass('mmoda-html-progress');
    if (errorDisplay)
      $('#' + panel_ids.panel_id).addClass('mmoda-html-progress-error-display');
    offset.left = afterDiv_obj.offset().left + (afterDiv_obj.width() - $('#' + panel_ids.panel_id).width()) / 2;
    
    $('#' + panel_ids.panel_id).highlight_progress_panel(offset, afterDiv_obj.attr('id') );

    $('#' + panel_ids.panel_id).data({
      return_progress_html_output_product_panel_id: afterDiv
    });

    return panel_ids.panel_id;
  }

  function display_query_parameters(query_parameters, afterDiv, datetime, offset) {
    var panel_ids = $(afterDiv).insert_new_panel(desktop_panel_counter++, 'image-query_parameters', datetime);

    var header = '<tr><th>Parameter</th><th>Value</th><th/></tr>';
    var body = '';
    for (var parameter in query_parameters) {
      if (parameter != 'token' && query_parameters.hasOwnProperty(parameter)) {
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

    source_name = $('input[name=src_name]', '.common-params').val();
    $('#' + panel_ids.panel_id + ' .panel-heading .panel-title').html('Source : ' + source_name + ' -  Query parameters');
    $('#' + panel_ids.panel_id).addClass('mmoda-query_parameters');
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
        $('input[name=' + checked_element + ']', element_class).each(function() {
          if (!$(this).closest(element_class).is(obj)) {
            $(this).prop('checked', false);
          }
        });
      }
    });
  }

  function display_lc_table(job_id, data) {
    datetime = get_current_date_time();

    var panel_ids = $(".instrument-params-panel", ".instrument-panel.active").insert_new_panel(desktop_panel_counter++, 'lc-table', datetime);

    var session_id = data.session_id;
    let instrument_query = data.analysis_parameters.instrument;
    var session_job_ids = '<div>Session ID : ' + session_id + '</div><div>Job ID : ' + job_id + '</div>';
    $('#' + panel_ids.panel_id).data("log", session_job_ids + $('.summary', '#ldialog').html());
    $('#' + panel_ids.panel_id).data("product_type", 'lc');

    // -------------- Toolbar start 
    var toolbar = $('<div>').addClass('btn-group').attr('role', 'group');
    var dbutton = $('<button>').attr('type', 'button').addClass('btn btn-default');
    dbutton.data("datetime", datetime);

    // Add button : Show query parameters
    button = dbutton.clone().addClass('show-query-parameters').text('Query parameters ');
    toolbar.append(button);

    // Add button "Log" : show log
    button = dbutton.clone().addClass('show-log').text('Log ');
    toolbar.append(button);

    // Add button "Share" : share query
    button = dbutton.clone().addClass('share-query').text('Share ');
    glyphicon = $('<span>').addClass("glyphicon glyphicon-info-sign");
    glyphicon.attr({ title: "Copy the product URL to clipboard" });
    button.append(glyphicon);
    toolbar.append(button);

    // Add button "API code" : Copy API code to clipboard
    button = dbutton.clone().addClass('api-code').text('API code ');
    glyphicon = $('<span>').addClass("glyphicon glyphicon-info-sign");
    glyphicon.attr({ title: "Copy the API code to the clipboard" });
    button.append(glyphicon);
    toolbar.append(button);

    // Add button "Publish on Renku", code goes here it's it has to appear for all cases
    toolbar.append(get_renku_publish_button(dbutton, job_id));

    // Add button "Return progress"
    let enabled = false;
    if (instrument_query !== undefined && $(`input[value='${instrument_query}']`, ".instrument-panel.active")[0].attributes.hasOwnProperty('support_return_progress') &&
      $(`input[value='${instrument_query}']`, ".instrument-panel")[0].attributes.support_return_progress.value == 'true') {
      enabled = true;
    }
    toolbar.append(get_return_progress_link_button(enabled));

    // Add button "API token" : copy API token to clipboard if connected
    // otherwise show a form to request it
    toolbar.append(get_token_button());

    // Install toolbar 
    $('#' + panel_ids.panel_body_id).append(toolbar);
    // Activate modal for API token form
    activate_modal('#' + panel_ids.panel_body_id);
    // -------------- Toolbar end 

    if (data.input_prod_list.length > 0) {
      scw_list = data.input_prod_list.join(', ');
      $('#' + panel_ids.panel_body_id).append(
        '<div>ScWs List <button type="button" class="btn btn-xs copy-to-clipboard" >Copy</button>:<br><div class="scw-list">' + scw_list + '</div></div>');
      $('.copy-to-clipboard').on('click', function() {
        copyToClipboard($(this).parent().find('.mmoda-popover-content').text());
      });
      $('.scw-list', '#' + panel_ids.panel_body_id).html(add3Dots('ScWs List', $('.scw-list', '#' + panel_ids.panel_body_id).html(), 71));
      $('.popover-help', '#' + panel_ids.panel_body_id).on('click', function(e) {
        e.preventDefault();
        return true;
      }).popover({
        container: 'body',
        content: function() {
          return $(this).parent().find('.mmoda-popover-content').html();
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
    },
      //    {
      //      data: null,
      //      title: "Multi-product",
      //      name: "multi_product",
      //      defaultContent: '<button type="button" class="btn btn-primary copy-multi-product">Copy</button>',
      //      orderable: false
      //    },
    ];

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

  function display_image_table(data, job_id, instrument) {
    datetime = get_current_date_time();

    var panel_ids = $(".instrument-params-panel", ".instrument-panel.active").insert_new_panel(desktop_panel_counter++, 'image-table', datetime);

    var session_id = data.session_id;
    var session_job_ids = '<div>Session ID : ' + session_id + '</div><div>Job ID : ' + job_id + '</div>';
    $('#' + panel_ids.panel_id).data("log", session_job_ids + $('.summary', '#ldialog').html());

    $('#' + panel_ids.panel_id).data("product_type", 'image');

    // -------------- Toolbar start 
    var toolbar = $('<div>').addClass('btn-group').attr('role', 'group');
    var dbutton = $('<button>').attr('type', 'button').addClass('btn btn-default');
    dbutton.data("datetime", datetime);

    // Add button : Show query parameters
    button = dbutton.clone().addClass('show-query-parameters').text('Query parameters ');
    toolbar.append(button);

    // Add button "Log" : show log
    button = dbutton.clone().addClass('show-log').text('Log ');
    toolbar.append(button);

    // Add button "Share" : share query
    button = dbutton.clone().addClass('share-query').text('Share ');
    glyphicon = $('<span>').addClass("glyphicon glyphicon-info-sign");
    glyphicon.attr({ title: "Copy the product URL to clipboard" });
    button.append(glyphicon);
    toolbar.append(button);

    // Add button "API code" : Copy API code to clipboard
    button = dbutton.clone().addClass('api-code').text('API code ');
    glyphicon = $('<span>').addClass("glyphicon glyphicon-info-sign");
    glyphicon.attr({ title: "Copy the API code to the clipboard" });
    button.append(glyphicon);
    toolbar.append(button);

    // Add button "API token" : copy API token to clipboard if connected
    // otherwise show a form to request it
    toolbar.append(get_token_button());

    // Add button "Publish on Renku", code goes here it's it has to appear for all cases
    toolbar.append(get_renku_publish_button(dbutton, job_id));

    // Add button "Return progress"
    let enabled = false;
    if (instrument !== undefined && $(`input[value='${instrument}']`, ".instrument-panel.active")[0].attributes.hasOwnProperty('support_return_progress') &&
      $(`input[value='${instrument}']`, ".instrument-panel")[0].attributes.support_return_progress.value == 'true') {
      enabled = true;
    }
    toolbar.append(get_return_progress_link_button(enabled));

    // Install toolbar 
    $('#' + panel_ids.panel_body_id).append(toolbar);
    // Activate modal for API token form
    activate_modal('#' + panel_ids.panel_body_id);
    // -------------- Toolbar end 

    if (data.input_prod_list.length > 0) {
      scw_list = data.input_prod_list.join(', ');
      $('#' + panel_ids.panel_body_id).append(
        '<div>ScWs List <button type="button" class="btn btn-xs copy-to-clipboard" >Copy</button>:<br><div class="scw-list">' + scw_list + '</div></div>');
      $('.copy-to-clipboard').on('click', function() {
        copyToClipboard($(this).parent().find('.mmoda-popover-content').text());
      });
      $('.scw-list', '#' + panel_ids.panel_body_id).html(add3Dots('ScWs List', $('.scw-list', '#' + panel_ids.panel_body_id).html(), 71));
      $('.popover-help', '#' + panel_ids.panel_body_id).on('click', function(e) {
        e.preventDefault();
        return true;
      }).popover({
        container: 'body',
        content: function() {
          return $(this).parent().find('.mmoda-popover-content').html();
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
      formData_return_progress_link: current_ajax_call_params.currentFormData
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
    var job_id = current_panel.data('job_id');

    var file_name = data.file_name[lc_index].replace('query_lc_query_lc_', '');

    var files_list = data.file_name[lc_index];
    if (data.root_file_name) {
      file_name = file_name.split('.').slice(0, -1).join('.') + '.tar.gz';
      files_list += ',' + data.root_file_name;
    } else {
      file_name += '.gz';
    }

    // -------------- Toolbar start 
    var toolbar = $('<div>').addClass('btn-group product-toolbar').attr('role', 'group');
    var dbutton = $('<button>').attr('type', 'button').addClass('btn btn-default');
    dbutton.data("datetime", datetime);

    // Add button "Download" : download light curve in FITS format
    var url_params = {
      session_id: data.session_id,
      download_file_name: file_name,
      file_list: files_list,
      query_status: 'ready',
      job_id: job_id,
      instrument: instrument
    };
    var download_url = get_download_url(url_params);
    var link = $('<a>').attr({ href: download_url, role: 'button' }).text('Download ');
    link.addClass('btn btn-default');
    var glyphicon = $('<span>').addClass("glyphicon glyphicon-info-sign");
    glyphicon.attr({ title: "Light curve in FITS format" });
    link.append(glyphicon);
    toolbar.append(link);

    // Install toolbar 
    $('#' + panel_ids.panel_body_id).append(toolbar);
    // Activate modal for API token form
    activate_modal('#' + panel_ids.panel_body_id);
    // -------------- Toolbar end 

    $('#' + panel_ids.panel_body_id).append(image.image.script + image.image.div);

    panel_body_append_header_footer(panel_ids, data);
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

    var instrument_query = data.analysis_parameters.instrument;
    var session_job_ids = '<div>Session ID : ' + data.session_id + '</div><div>Job ID : ' + job_id + '</div>';
    $('#' + panel_ids.panel_id).data("log", session_job_ids + $('.summary', '#ldialog').html());

    // --------------- Toolbar start
    var toolbar = $('<div>').addClass('btn-group').attr('role', 'group');
    var dbutton = $('<button>').attr('type', 'button').addClass('btn btn-default');
    dbutton.data("datetime", datetime);

    // Add button "Download" : download image, catalog and region file
    //    var url_params = {
    //      session_id: data.session_id,
    //      download_file_name: file_name,
    //      file_list: files_list,
    //      query_status: 'ready',
    //      job_id: job_id,
    //      instrument: instrument
    //    };
    //    var download_url = get_download_url(url_params);
    //    var link = $('<a>').attr({ href: download_url, role: 'button' }).text('Download ');
    //    link.addClass('btn btn-default');
    //    var glyphicon = $('<span>').addClass("glyphicon glyphicon-info-sign");
    //    glyphicon.attr({ title: "image, catalog and region file" });
    //    link.append(glyphicon);
    //    toolbar.append(link);

    // Add button "Catalog": show catalog
    product_type = $("input[name$='product_type']:checked", ".instrument-panel.active").val();
    if (product_type.endsWith('image')) {
      button = dbutton.clone().addClass('show-catalog').text('Catalog ');
      toolbar.append(button);
    }
    // Add button "Query parameters" : show query parameters
    button = dbutton.clone().addClass('show-query-parameters').text('Query parameters ');
    toolbar.append(button);

    // Add button "Log" : show log
    button = dbutton.clone().addClass('show-log').text('Log ');
    toolbar.append(button);

    // Add button "Share" : share query
    button = dbutton.clone().addClass('share-query').text('Share ');
    glyphicon = $('<span>').addClass("glyphicon glyphicon-info-sign");
    glyphicon.attr({ title: "Copy the product URL to clipboard" });
    button.append(glyphicon);
    toolbar.append(button);

    // Add button "API code" : copy the API code to the clipboard
    button = dbutton.clone().addClass('api-code').text('API code ');
    glyphicon = $('<span>').addClass("glyphicon glyphicon-info-sign");
    glyphicon.attr({ title: "Copy the API code to the clipboard" });
    button.append(glyphicon);
    toolbar.append(button);

    // Add button "Publish on Renku", code goes here it's it has to appear for all cases
    toolbar.append(get_renku_publish_button(dbutton, job_id));

    // Add button "Return progress"
    let enabled = false;
    if (instrument_query !== undefined && $(`input[value='${instrument_query}']`, ".instrument-panel.active")[0].attributes.hasOwnProperty('support_return_progress') &&
      $(`input[value='${instrument_query}']`, ".instrument-panel")[0].attributes.support_return_progress.value == 'true') {
      enabled = true;
    }
    toolbar.append(get_return_progress_link_button(enabled));

    // Add button "API token" : copy API token to clipboard if connected
    // otherwise show a form to request it
    toolbar.append(get_token_button());

    // Install toolbar 
    $('#' + panel_ids.panel_body_id).append(toolbar);
    // Activate modal for API token form
    activate_modal('#' + panel_ids.panel_body_id);
    // --------------- Toolbar end


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
        session_id: data.session_id,
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
        render: function(data) {
          download_filename = 'spectra-' + data.source_name + '.tar.gz';
          datafiles = data.ph_file_name + ',' + data.arf_file_name + ',' + data.rmf_file_name;
          var url_params = {
            session_id: data.session_id,
            download_file_name: download_filename,
            file_list: datafiles,
            query_status: 'ready',
            job_id: data.job_id,
            instrument: data.instrument
          };
          var download_url = get_download_url(url_params);
          var downloadButton = '<a class="btn btn-default" role="button" href="' + download_url
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
    spectrum_table_container.on('click', 'tbody td:nth-child(2)', function() {
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
    $('#' + panel_ids.panel_body_id).append(data.image.spectral_fit_image.script + data.image.spectral_fit_image.div);

    panel_body_append_header_footer(panel_ids, data);
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
    //    var auth_cookie = $('#ltoken').data('auth-cookie');
    //    var title = 'Copy your API token to the clipboard';
    //    var button = 'api-token';
    //    if (!$.cookie(auth_cookie)) {
    //      title = 'Request an API token';
    //      button = 'api-token-ask';
    //    }
    //    return '<button class="btn btn-default ' + button + '" type="button">API token <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="' + title + '" ></span></button>';
    return '';
  }

  function get_renku_publish_button(dbutton, job_id) {

    button = dbutton.clone().addClass('renku-publish').text('View on Renku ');
    glyphicon = $('<span>').addClass("glyphicon glyphicon-info-sign");
    glyphicon.attr({ title: "Open Renku session with the API code" });
    button.append(glyphicon);

    if (job_id) {
      button.data('job_id', job_id);
    }
    //renku_logo = $('<img>').attr('src', 'images/renku-logo.svg').addClass("renku-logo-tab");
    //button.prepend(renku_logo);

    return button;
  }

  function get_return_progress_link_button(enable = true) {
    let inner_html = $(`<div class="btn return-progress-link return-progress-link-result-panel">
    <div class="prompt"><span class="return-progress-link-tooltip">View notebook progress</span></div>
    <i class="fa fa-spinner fa-spin"></i>
    </div>
    `);
    inner_html.find('.fa-spinner').hide();
    if (enable)
      inner_html.addClass('enabled');
    else
      inner_html.addClass('disabled');
    return inner_html;
  }

  function panel_body_append_header_footer(panel_ids, data) {
    if (data.image.hasOwnProperty('header_text'))
      $('#' + panel_ids.panel_body_id).append(data.image.header_text.replace(/\n/g, "<br />"));
    if (data.image.hasOwnProperty('table_text'))
      $('#' + panel_ids.panel_body_id).append(get_text_table(data.image.table_text));
    if (data.image.hasOwnProperty('footer_text'))
      $('#' + panel_ids.panel_body_id).append(data.image.footer_text.replace(/\n/g, "<br />"));
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

    var session_job_ids = '<div>Session ID : ' + data.session_id + '</div><div>Job ID : ' + job_id + '</div>';
    $('#' + panel_ids.panel_id).data("log", session_job_ids + $('.summary', '#ldialog').html());

    // --------------- Toolbar start
    var toolbar = $('<div>').addClass('btn-group product-toolbar').attr('role', 'group');
    var dbutton = $('<button>').attr('type', 'button').addClass('btn btn-default');
    dbutton.data("datetime", datetime);


    // Add button "JS9" : show the image in JS9 (DS9)
    if (data.image.hasOwnProperty('file_path')) {
      var button = dbutton.clone().addClass('show-js9');
      button.data("image_file_path", data.image.file_path);
      button.data("E1_keV", data.analysis_parameters.E1_keV);
      button.data("E2_keV", data.analysis_parameters.E2_keV);
      button.append("JS9");
      toolbar.append(button);
    }

    // Add button "Download" : download image, catalog and region file
    var file_name = data.file_name;
    if (Array.isArray(file_name)) file_name = file_name.join(',');
    url_params = {
      session_id: data.session_id,
      download_file_name: data.download_file_name,
      file_list: file_name,
      query_status: 'ready',
      job_id: job_id,
      instrument: instrument
    };
    var download_url = get_download_url(url_params);
    var link = $('<a>').attr({ href: download_url, role: 'button' }).text('Download ');
    link.addClass('btn btn-default');
    var glyphicon = $('<span>').addClass("glyphicon glyphicon-info-sign");
    glyphicon.attr({ title: "image, catalog and region file" });
    link.append(glyphicon);
    toolbar.append(link);

    // Add button "Catalog": show catalog
    product_type = $("input[name$='product_type']:checked", ".instrument-panel.active").val();
    if (product_type.endsWith('image')) {
      button = dbutton.clone().addClass('show-catalog').text('Catalog ');
      toolbar.append(button);
    }
    // Add button "Query parameters" : show query parameters
    button = dbutton.clone().addClass('show-query-parameters').text('Query parameters ');
    toolbar.append(button);

    // Add button "Log" : show log
    button = dbutton.clone().addClass('show-log').text('Log ');
    toolbar.append(button);

    // Add button "Share" : share query
    button = dbutton.clone().addClass('share-query').text('Share ');
    glyphicon = $('<span>').addClass("glyphicon glyphicon-info-sign");
    glyphicon.attr({ title: "Copy the product URL to clipboard" });
    button.append(glyphicon);
    toolbar.append(button);

    // Add button "API code" : copy the API code to the clipboard
    button = dbutton.clone().addClass('api-code').text('API code ');
    glyphicon = $('<span>').addClass("glyphicon glyphicon-info-sign");
    glyphicon.attr({ title: "Copy the API code to the clipboard" });
    button.append(glyphicon);
    toolbar.append(button);

    // Add button "API token" : copy API token to clipboard if connected
    // otherwise show a form to request it
    toolbar.append(get_token_button());

    // Add button "Publish on Renku", code goes here it's it has to appear for all cases
    toolbar.append(get_renku_publish_button(dbutton, job_id));

    // Add button "Return progress"
    let enabled = false;
    if (instrument !== undefined && $(`input[value='${instrument}']`, ".instrument-panel.active")[0].attributes.hasOwnProperty('support_return_progress') &&
      $(`input[value='${instrument}']`, ".instrument-panel")[0].attributes.support_return_progress.value == 'true') {
      enabled = true;
    }
    toolbar.append(get_return_progress_link_button(enabled));

    // Install toolbar 
    $('#' + panel_ids.panel_body_id).append(toolbar);
    // Activate modal for API token form
    activate_modal('#' + panel_ids.panel_body_id);
    // --------------- Toolbar end

    if (data.input_prod_list.length > 0) {
      scw_list = data.input_prod_list.join(', ');
      $('#' + panel_ids.panel_body_id).append(
        '<div>ScWs List <button type="button" class="btn btn-xs copy-to-clipboard" >Copy</button>:<br><div class="scw-list">' + scw_list + '</div></div>');
      $('.copy-to-clipboard').on('click', function() {
        copyToClipboard($(this).parent().find('.scw-list .mmoda-popover-content').text());
      });
      $('.scw-list', '#' + panel_ids.panel_body_id).html(add3Dots('ScWs List', $('.scw-list', '#' + panel_ids.panel_body_id).html(), 71));
      var pop = $('.popover-help', '#' + panel_ids.panel_body_id).on('click', function(e) {
        e.preventDefault();
        return true;
      }).popover({
        container: 'body',
        content: function() {
          return $(this).parent().find('.mmoda-popover-content').html();
        },
        html: true,
        template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h4 class="popover-title"></h4><div class="popover-content"></div></div>'
      });
    }
    $('#' + panel_ids.panel_body_id).append(data.image.image.script + data.image.image.div);

    panel_body_append_header_footer(panel_ids, data);
    $('#' + panel_ids.panel_id + ' .panel-heading .panel-title').html(panel_title('', data.analysis_parameters));

    $('#' + panel_ids.panel_id).highlight_result_panel();
    return ($('#' + panel_ids.panel_body_id));
  }

  function display_in_iframe(data) {
    datetime = get_current_date_time();
    var panel_ids = $(".instrument-params-panel", ".instrument-panel.active").insert_new_panel(desktop_panel_counter++, 'iframe', datetime);
    $('#' + panel_ids.panel_body_id).append(data.htmlResponse);
    $('#' + panel_ids.panel_id).highlight_result_panel();
    return ($('#' + panel_ids.panel_body_id));
  }

  function get_download_url(parameters) {
    // if ($.cookie('Drupal.visitor.token'))
    if (current_ajax_call_params.currentFormData.get('token') !== null)
      parameters['token'] = current_ajax_call_params.currentFormData.get('token');
    url = 'dispatch-data/download_products?' + $.param(parameters);

    return (url);
  }

  function get_renku_publish_url(token, job_id) {
    parameters = {};

    if (token)
      parameters['token'] = token;
    if (job_id)
      parameters['job_id'] = job_id;
    url = 'dispatch-data/push-renku-branch?' + $.param(parameters);
    return (url);
  }

  function activate_modal($element) {
    $('area.ctools-use-modal, a.ctools-use-modal', $element).once('ctools-use-modal', function() {
      var $this = $(this);
      $this.click(Drupal.CTools.Modal.clickAjaxLink);
      // Create a drupal ajax object
      var element_settings = {};
      if ($this.attr('href')) {
        element_settings.url = $this.attr('href');
        element_settings.event = 'click';
        element_settings.progress = { type: 'throbber' };
      }
      var base = $this.attr('href');
      Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
    });
  }

  function display_image_js9(image_file_path, data) {
    var js9_ext_id = Drupal.settings.mmoda[instrument].js9_ext_id;
    var panel_ids = $(".instrument-params-panel",
      ".instrument-panel.active").insert_new_panel(desktop_panel_counter++, 'js9', data.datetime);
    $('#' + panel_ids.panel_body_id).append($('<iframe>', {
      src: 'dispatch-data/api/v1.0/oda/get_js9_plot?file_path=' + image_file_path + '&ext_id=' + js9_ext_id,
      id: 'js9iframe',
      width: '650',
      height: '700',
      frameborder: 0,
      scrolling: 'no'
    }));

    $('#' + panel_ids.panel_id + ' .panel-heading .panel-title').html(panel_title('', data));
    $('#' + panel_ids.panel_id).highlight_result_panel();
  }

})(jQuery);
