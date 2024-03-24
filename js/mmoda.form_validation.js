
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

  function all_instruments_forms_set_bootstrapValidator() {

    var validator_fields = {
      'scw_list': {
        // enabled: false,
        validators: {
          callback: {
            callback: function(value, validator, $field) {
              return (validate_scws(value, 500));
            }
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
            console.log('E1 checked');
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

    //$('.instrument-panel form').bootstrapValidator('destroy');
    $('.instrument-panel form').bootstrapValidator({
      // live :'disabled',
      fields: validator_fields,
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      }
    });
  }
  $(document).ready(function() {
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
