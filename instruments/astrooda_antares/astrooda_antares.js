(function($) {

	$(document).ready(
			function() {
				$('.instrument-panel-antares form').bootstrapValidator({
						fields : {
							// live :'disabled',
							'radius' : {
								// enabled: false,
								validators : {
									callback : {
										callback : function(value, validator,
												$field) {
											if (value < 0.1 || value > 2.5) {
                                                return {
                                                    valid: false,
                                                    message: "Please enter value between 0.1 and 2.5 deg"
                                                }
                                            } 
                                            return true;
										}
									}
								}
							}
						},
						feedbackIcons : {
							valid : 'glyphicon glyphicon-ok',
							invalid : 'glyphicon glyphicon-remove',
							validating : 'glyphicon glyphicon-refresh'
						}
			}).data('bootstrapValidator');
});
})(jQuery);