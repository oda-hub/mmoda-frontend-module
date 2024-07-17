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
  return ({ valid: true });
}

function validate_date(value, time_format_type) {
  max_mjd_date = get_today_mjd();
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
  return ({ valid: true });
}


(function($) {

  // Validate paste
  function validate_paste(input) {
    var maxlength = parseInt($(input).attr('maxlength'));
    var pastedValueLength = $(input).data('pastedValueLength');
    if ($(input).data('truncatedPaste')) {
      $(input).removeData('truncatedPaste pastedValueLength');
      return {
        valid: false,
        message: 'Pasted value too large (' + pastedValueLength + '), maximum allowed length is ' + maxlength
      }
    };
    return ({ valid: true });
  }

  function validate_timebin(input) {
    lelement = input.element;
    value = Number(input.value);
    var current_form = lelement.closest('form');
    var time_bin_format = $('select[name="time_bin_format"]', current_form).val();

    if ($(lelement).data('mmodaTimeBinMin')) {

      var time_bin_min_seconds = $(lelement).data('mmodaTimeBinMin');
      var time_bin_format_message = time_bin_min_seconds + ' seconds';
      if (time_bin_format == 'jd') {
        time_bin_min_days = (time_bin_min_seconds / 86400).toFixed(6);
        value = value * 86400;
        var time_bin_format_message = time_bin_min_days + ' day (' + time_bin_min_seconds + ' seconds)';
      }
      if (value < time_bin_min_seconds) {
        return {
          valid: false,
          message: 'Please enter a time bin higher than ' + time_bin_format_message
        }
      }
    }

    if ($(lelement).data('mmodaTimeBinMultiple')) {
      var time_bin_min = $(lelement).data('mmodaTimeBinMin');
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
    return ({ valid: true });
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
          current_form.data('bootstrapValidator').updateFieldStatus(elt_name, 'NotValidated').validateField(elt_name);
        }
      }
    });

    $("input[type=text], textarea").bind("input", function(e) {
      var parent_elt = $(this).parent().parent();
      parent_elt.removeClass('has-feedback has-error');
    });
  }

  function common_form_set_bootstrapValidator() {
    const checkRa = function() {
      return {
        validate: function(input) {
          const value = input.value;
          var decimalRA;
          return (HMS2Decimal(value, decimalRA));
        },
      };
    };
    const checkDec = function() {
      return {
        validate: function(input) {
          const value = input.value;
          var decimalDEC;
          return (DMS2Decimal(value, decimalDEC));
        },
      };
    };
    const checkDate = function() {
      return {
        validate: function(input) {
          const value = input.value;
          var time_format_type = $('select[name="T_format"]', '#mmoda-common-form').val();
          return (validate_date(value, time_format_type));
        },
      };
    };
    // Register the validator
    FormValidation.validators.vcheckRa = checkRa;
    FormValidation.validators.vcheckDec = checkDec;
    FormValidation.validators.vcheckDate = checkDate;

    //var validator_fields = {};

    common_form_validator = FormValidation.formValidation(document.getElementById('mmoda-common-form'),
      {
        //fields: validator_fields,
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          bootstrap: new FormValidation.plugins.Bootstrap5(),
          submitButton: new FormValidation.plugins.SubmitButton(),
          fieldStatus: new FormValidation.plugins.FieldStatus({
            onStatusChanged: function(areFieldsValid) {
              $('input.form-submit', '.instrument-card form').each(function() {
                var submitButton = $(this)[0];
                areFieldsValid
                  // Enable the submit button
                  // so user has a chance to submit the form again
                  ? submitButton.removeAttribute('disabled')
                  // Disable the submit button
                  : submitButton.setAttribute('disabled', 'disabled');
              })
            }
          }),
          declarative: new FormValidation.plugins.Declarative({
          }),
          icon: new FormValidation.plugins.Icon({
            valid: 'fa fa-check',
            invalid: 'fa fa-times',
            validating: 'fa fa-refresh',
          }),
        },
      });
    $('mmoda-common-form').data({ formValidation: common_form_validator });

    //    $('input, select, textarea', '#mmoda-common-form').on('focusout', function() {
    //      common_form_validator.validate();
    //    })

    //    $('input, select, textarea', '#mmoda-common-form').on('error.field.bv', function() {
    common_form_validator.on('core.field.invalid', function() {
      // Disable main submit if error in common parameters
      //      $('[type="submit"]', '.instrument-card').prop('disabled', true);

    }).on('core.form.valid', function() {
      // Enable main submit if error in common parameters
      //      $('[type="submit"]', '.instrument-card').prop('disabled', false);

    });

  }

  function all_instruments_forms_set_bootstrapValidator() {
    const checkPaste = function() {
      return {
        validate: function(input) {
          return (validate_paste(input));
        },
      };
    };

    const checkScws = function() {
      return {
        validate: function(input) {
          const value = input.value;
          return (validate_scws(value, 500));
        },
      };
    };
    const checkTimebin = function() {
      return {
        validate: function(input) {
          return (validate_timebin(input));
        },
      };
    };
    const checkE1kev = function() {
      return {
        validate: function(input) {
          var value = input.value;
          var current_form = $(input.element).closest('form');
          var E2_keV = $('input[name="E2_keV"]', current_form).val();
          if (Number(value) >= Number(E2_keV)) {
            return {
              valid: false,
              message: 'Energy min must be lower that energy max'
            }
          }
          return ({
            valid: true
          });
        }
      }
    }
    const checkE2kev = function() {
      return {
        validate: function(input) {
          var value = input.value;
          var current_form = $(input.element).closest('form');
          var E1_keV = $('input[name="E1_keV"]', current_form).val();
          if (Number(value) <= Number(E1_keV)) {
            return {
              valid: false,
              message: 'Energy max must be higher that energy min'
            }
          }
          return ({
            valid: true
          });
        }
      }
    }
    // Register the validator
    FormValidation.validators.vcheckPaste = checkPaste;
    FormValidation.validators.vcheckScws = checkScws;
    FormValidation.validators.vcheckTimebin = checkTimebin;
    FormValidation.validators.vcheckE1kev = checkE1kev;
    FormValidation.validators.vcheckE2kev = checkE2kev;


    var validator_fields = {};

    // Validate truncated paste
    $("input[type=text][maxlength], textarea[maxlength]").each(function() {
      var name = $(this).attr('name');
      validator_fields[name] = {
        validators: {
          vcheckPaste: {
          }
        }
      }
    });

    //    euclid_multi_fields = $('.euclid-instruments-filters .form-control');
    //
    //    for (let fld of euclid_multi_fields) {
    //      validator_fields[fld.name] = {
    //        validators: {
    //          notEmpty: {
    //            message: (fld.type == 'select-one') ? 'Please select filter' : 'Please enter a value'
    //          }
    //        }
    //      }
    //    };
    $('.instrument-card form').each(function() {
      var submit_button = $('input.form-submit', $(this));
      var submitButton = submit_button[0];
      var formValid = FormValidation.formValidation($(this).get(0),
        {
          plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap: new FormValidation.plugins.Bootstrap5(),
            submitButton: new FormValidation.plugins.SubmitButton({
              livemode: false,
              buttons: function(form) {
                var submit_button = $('input.form-submit', $(form));
                return [submit_button[0]];
              }
            }),
            fieldStatus: new FormValidation.plugins.FieldStatus({
              onStatusChanged: function(areFieldsValid) {
                areFieldsValid
                  // Enable the submit button
                  // so user has a chance to submit the form again
                  ? submitButton.removeAttribute('disabled')
                  // Disable the submit button
                  : submitButton.setAttribute('disabled', 'disabled');
              }
            }),
            declarative: new FormValidation.plugins.Declarative({
            }),
            icon: new FormValidation.plugins.Icon({
              valid: 'fa fa-check',
              invalid: 'fa fa-times',
              validating: 'fa fa-refresh',
            }),
          },
          //fields: validator_fields,

        });
      $(this).data({ formValidation: formValid });
    })

  }

  $(document).ready(function() {
    common_form_set_bootstrapValidator();
    all_instruments_forms_set_bootstrapValidator();

    $('[name^=time_bin_format]', '.instrument-params-card form').on('change', function() {
      var form = $(this).parents('form');
      form.data('formValidation').updateFieldStatus('time_bin', 'NotValidated').validateField('time_bin');
    });

    $('[name=E1_keV]', '.instrument-params-card form').on('change', function() {
      var form = $(this).parents('form');
      form.data('formValidation').updateFieldStatus('E2_keV', 'NotValidated').validateField('E2_keV');
    });

    $('[name=E2_keV]', '.instrument-params-card form').on('change', function() {
      var form = $(this).parents('form');
      form.data('formValidation').updateFieldStatus('E1_keV', 'NotValidated').validateField('E1_keV');
    });

    $('.instrument-card form').on('error.form.bv', function(e) {
      e.preventDefault();
    });
    showErrorWhenTruncatedPaste();
  });


  $('select[name="T_format"]', '#mmoda-common-form').on('change', function() {
    common_form_validator.updateFieldStatus('T1', 'NotValidated').validateField('T1');
    common_form_validator.updateFieldStatus('T2', 'NotValidated').validateField('T2');
  });


})(jQuery);
