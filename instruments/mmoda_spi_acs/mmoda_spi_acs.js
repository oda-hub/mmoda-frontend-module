(function($) {

	$(document).ready(
			function() {
				$('.instrument-panel-spi_acs form').bootstrapValidator({
						fields : {
							// live :'disabled',
							'time_bin' : {
								// enabled: false,
								validators : {
									callback : {
										callback : function(value, validator,
												$field) {
											console.log('Inside validator time bin');
											return (validate_timebin(value,
													validator, $field));
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
