jQuery(document).ready(function($){
    $('.antares-form').bootstrapValidator({
        // live :'disabled',
        fields: {
            'radius': {
                // enabled: false,
                validators: {
                    callback: {
                        callback: function(value, validator, $field) {
                            var arad = validator.getFieldElements('radius').val();
                            if ( Number(arad) < 0.1 || Number(arad) > 2.5 ) {
                                return {
                                valid: false,
                                message: 'Please enter value between 0.1 and 2.5 deg'
                                };
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

    $('[name^=radius]', '.antares-form').on('change', function(e) {
        var form = $(this).parents('form');
        form.data('bootstrapValidator').updateStatus('radius', 'NOT_VALIDATED').validateField('radius');
    });
})