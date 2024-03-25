var common_form_validator;

function valid_iso_date(value) {
  var iso_date_pattern = new RegExp("^([1|2]\\d\\d\\d)(?:-?(10|11|12|0\\d)(?:-?(30|31|[0-2]\\d)" +
    "(?:[T ](2[0-3]|[0-1]\\d)(?::?([0-5]\\d)(?::?([0-5]\\d)(?:\\.(\\d+))?)?)?)?)?)?$");
  return (iso_date_pattern.test(value));
}

function valid_mjd_date(value) {
  var mjd_date_pattern = new RegExp("^(\\d+\.?\\d*)$");
  return (mjd_date_pattern.test(value) && value >= 0 && value <= max_mjd_date);
}

function validate_scws(value, nb_scws) {
  var scws_pattern = new RegExp("^$|^(\\d{12}\\.00\\d)(\\s*,\\s*\\d{12}\\.00\\d){0," + (nb_scws - 1) + "}$");
  if (!scws_pattern.test(value)) {
    return {
      valid: false,
      message: 'Please enter a valid list of ScWs, maximum ' + nb_scws
    }
  }
  return true;
}

function validate_date(value, validator) {
  max_mjd_date = get_today_mjd();
  var time_format_type = validator.getFieldElements('T_format').val();
  if (time_format_type == 'isot' && !valid_iso_date(value)) {
    return {
      valid: false,
      message: 'Please enter a valid UTC ISO date, YYYY-MM-DDThh:mm:ss.s'
    }
  }
  else if (time_format_type == 'mjd' && !valid_mjd_date(value)) {
    return {
      valid: false,
      message: 'Please enter a valid MJD date <span style="white-space: nowrap;">[0, ' + max_mjd_date + ']</span>'
    }
  }
  return true;
}

// Validate paste
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

(function($) {
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

    $("input[type=text], textarea").bind("input", function(e) {
      var parent_elt = $(this).parent().parent();
      parent_elt.removeClass('has-feedback has-error');
    });
  }

  function common_form_set_bootstrapValidator() {
    var validator_fields = {};
    
    validator_fields['RA'] = {
      validators: {
        callback: {
          callback: function(value, validator, $field) {
            var decimalRA;
            return (HMS2Decimal(value, decimalRA));
          }
        }
      }
    };
    validator_fields['DEC'] = {
      validators: {
        callback: {
          callback: function(value, validator, $field) {
            var decimalDEC;
            return (DMS2Decimal(value, decimalDEC));
          }
        }
      }
    };
    validator_fields['T1'] = {
      validators: {
        callback: {
          callback: function(value, cbvalidator, $field) {
            return (validate_date(value, cbvalidator, $field));
          }
        }
      }
    };
    validator_fields['T2'] = {
      validators: {
        callback: {
          callback: function(value, cbvalidator, $field) {
            return (validate_date(value, cbvalidator, $field));
          }
        }
      }
    };
    
    common_form_validator = $('form#mmoda-common').bootstrapValidator({
      fields: validator_fields,
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
    }).data('bootstrapValidator'); // .validate();
  }
  
  function all_instruments_forms_set_bootstrapValidator() {
    var validator_fields = {};
   
    $("input[type=text][maxlength], textarea[maxlength]").each(function() {
      var name = $(this).attr('name');
      validator_fields[name] = {
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
        validators: {
          callback: {
            callback: function(value, validator, $field) {
              return (validate_scws(value, 500));
            }
        }
      }
    };
    validator_fields['time_bin'] = {
      validators: {
        callback: {
          callback: function(value, validator, $field) {
            return (validate_timebin(value, validator, $field));
          }
        }
      }
    };

    validator_fields['E1_keV'] = {
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
                message: 'Energy min must be lower that energy max'
              }
            }
            return true;
          }
        }
      }
    };
    validator_fields['E2_keV'] = {
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
                message: 'Energy max must be higher that energy min'
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
  
  $(document).ready(function() {
    common_form_set_bootstrapValidator();
    all_instruments_forms_set_bootstrapValidator();

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
    showErrorWhenTruncatedPaste();

  });

})(jQuery);
