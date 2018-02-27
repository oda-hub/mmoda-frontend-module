var waitingDialog;

(function($, Drupal) {
    Drupal.ajax.prototype.commands.set_ra_dec = function(ajax, response, status) {
    	waitingDialog.hide();    	
		html = '<div class="alert alert-dismissable">'
  		  +'<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'
  		  +response.args.message
  		+'</div>';
		html = '<small class="" data-bv-validator="callback" data-bv-for="src_name" data-bv-result="INVALID" style="">'
	  		  +response.args.message
	  		+'</small>';
  		elt = $('.form-item-src-name', '#astrooda-common').append(html);
  		elt.find('.alert').hide();
    	if (response.args.status == 0) {
    		$('.form-item-RA input.form-control').val(response.args.ra);
    		$('.form-item-DEC input.form-control').val(response.args.dec);
    		elt.find('.alert').addClass('alert-success').show(); 
    	}
    	else {
    		$('.form-item-src-name', '#astrooda-common').addClass('has-error').children('.form-control-feedback').removeClass('glyphicon-ok').addClass('glyphicon-remove');
    		$('.form-item-src-name', '#astrooda-common').addClass('has-error');
    		elt.find('.alert').addClass('alert-danger').show();
    		elt.find('small').addClass('help-block');
    		$('.form-item-RA input.form-control').val('');
    		$('.form-item-DEC input.form-control').val('');
    		console.log('Error: ' + response.args.message)
    	}
    	$('form#astrooda-common').bootstrapValidator({ 'live' : 'enabled'});
    }
})(jQuery, Drupal);

(function($) {
	
	$(document).ready(commonReady);
	var i = 1;
    var session_image_catalogs = [];
    Date.prototype.getJulian = function() {
    	  return Math.floor((this / 86400000) - (this.getTimezoneOffset() / 1440) + 2440587.5);
    }
    max_mjd_date= get_today_mjd();
    
    var request_draw_spectrum = false;
    var request_spectrum_form_element;
    
    function get_today_mjd() {
    	var today = new Date(); // set any date
    	var today_mjd = today.getJulian() - 2400000.5; // get Modified Julian
    	return(today_mjd);
    }
    
	function valid_iso_date(value) {
		var iso_date_pattern = new RegExp("^([1|2]\\d\\d\\d)(?:-?(10|11|12|0\\d)(?:-?(30|31|[0-2]\\d)" +
		"(?:[T ](2[0-3]|[0-1]\\d)(?::?([0-5]\\d)(?::?([0-5]\\d)(?:\\.(\\d+))?)?)?)?)?)?$");
		return(iso_date_pattern.test(value));
	}
	
	function valid_mjd_date(value) {
		var mjd_date_pattern = new RegExp("^(\\d+\.?\\d*)$");				
		return (mjd_date_pattern.test(value) && value >= 0 && value <= max_mjd_date);
	}
    
	function validate_date(value) {
		var time_format_type = $('select[name="T_format"]', 'form.current-instrument-form').val();
		if (time_format_type == 'isot' && !valid_iso_date(value)) {
			return {
				valid: false,
				message: 'Please enter a valid UTC ISO date, YYYY-MM-DDThh:mm:ss.s'
					}
			}
		else if (time_format_type == 'mjd' && !valid_mjd_date(value)) {
			return {
				valid: false,
				message: 'Please enter a valid MJD date <span style="white-space: nowrap;">[0, '+max_mjd_date+']</span>'
					}
			}
		return true;
	}
    
	function validate_scws(value) {
		var scws_pattern = new RegExp("^$|^(\\d{12}\\.\\d{3})(\\s*,\\s*\\d{12}\\.\\d{3}){0,49}$");	
		if (!scws_pattern.test(value)) {
			return {
				valid: false,
				message: 'Please enter a valid list of ScWs, maximum 50'
					}
			}
		return true;
	}
	
	function validate_timebin(value) {
		var time_bin_format = $('select[name="time_bin_format"]', 'form.current-instrument-form').val();
		if (time_bin_format == 'sec' && (value < 20)) {
			return {
				valid: false,
				message: 'Please enter a time bin higher than 20 seconds.'
					}
			}
		else if (time_bin_format == 'jd' && (value < (20/86400 ).toFixed(6))) {
			return {
				valid: false,
				message: 'Please enter a time bin higher than '+ (20/86400 ).toFixed(6)+' day (20 seconds).'
					}
			}
		return true;
	}

	function commonReady() {
		$('.form-item .description', '.current-instrument-form').each(function() {
			$(this).html(add3Dots($(this).parent().find('label:first').html(), $(this).html(), 40));
		});
		$('.popover-help').on('click', function(e) {e.preventDefault(); return true;}).popover({
				    container: 'body',
				    content : function () { return $(this).parent().find('.astrooda-popver-content').html();},
				    html : true,
					template : '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h4 class="popover-title"></h4><div class="popover-content"></div></div>'
		});
		
		$(document).on('click', function (e) {
		    $('[data-toggle="popover"],[data-original-title]').each(function () {
		        //the 'is' for buttons that trigger popups
		        //the 'has' for icons within a button that triggers a popup
		        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {                
		            (($(this).popover('hide').data('bs.popover')||{}).inState||{}).click = false  // fix for BS 3.3.6
		        }

		    });
		});
		
		waitingDialog =  get_waitingDialog();
		
		
		$( document ).ajaxSend(function( event, jqxhr, settings ) {			
			if (settings.hasOwnProperty('extraData') && settings.extraData.hasOwnProperty('_triggering_element_name') && settings.extraData._triggering_element_name == 'resolve_name') {				
				waitingDialog.show('','Resolving name using <a href="http://cds.u-strasbg.fr/cgi-bin/Sesame" target="_blank">Sesame</a> respectively NED, Simbad and VizieR...', {
					progressType : 'success', 'showProgress' : true, 'showButton' : false
				}); 
				// $('input[name=src_name]',
				// '.current-instrument-form').trigger('resolve-name');
				$('.form-item-src-name small', '#astrooda-common').remove();
	    		$('.form-item-RA input.form-control').val('');
	    		$('.form-item-DEC input.form-control').val('');
	    		$('input:not(:file)', '#astrooda-common').val(function(_, value) {
					   return $.trim(value.replace(/\s+/g, " "));
				});
			}
			
		});

		$('.instrument-panel').resizable({
	        // handles: { 's' : "#toto"
	        handles: 's'
	    });

		var target_form = $('form.current-instrument-form');
		
		$('select[name="T_format"]', target_form).on('change', function() {
			$('input[name="T1"]', target_form).trigger('input');
			$('input[name="T2"]', target_form).trigger('input');
		});
		

		target_form.bootstrapValidator({
			// live :'disabled',
			fields: {
				'T1' : {
					// enabled: false,
					validators : { callback: {
						callback: function (value, validator, $field) {
                            	return (validate_date(value));
                               }
		                     }
				           }
				},
				'T2' : {
					// enabled: false,
					validators : { callback: {
						callback: function (value, validator, $field) {
                            	return (validate_date(value));
                               }
		                     }
				           }
				},
				'scw_list' : {
					// enabled: false,
					validators : { callback: {
						callback: function (value, validator, $field) {
                            	return (validate_scws(value));
                               }
		                     }
				           }
				},
				'time_bin' : {
					// enabled: false,
					validators : { callback: {
						callback: function (value, validator, $field) {
                            	return (validate_timebin(value));
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
		}).on(
				'success.form.bv',
				function(e) {
					console.log('instrument form');
					e.preventDefault();
					// console.log('Form action :' + $(this)attr('action'));
					var formData;
					if (request_draw_spectrum) {
						formData = request_spectrum_form_element.data('parameters');
					}
					else {
						$('input:not(:file)', '.current-instrument-form').val(function(_, value) {
						   return $.trim(value);
						});
						console.log('creating FormData');
						$('[name^=form_],[name=catalog_selected_objects]','.current-instrument-form').prop('disabled', true);
						// Remove files[] from the name attribute of file elements
						$('[type=file]','.current-instrument-form').each(function () {
							//$(this).data('save-name', $(this).attr('name'));
							//$(this).attr('name', $(this).attr('name').replace(/^files\[(\w+)\]$/, '$1'));
						});
						formData = new FormData($('.current-instrument-form')[0]);
						$('[type=file]','.current-instrument-form').each(function () {
							//$(this).attr('name', $(this).data('save-name'));
						});
						$('[name^=form_],[name=catalog_selected_objects]','.current-instrument-form').prop('disabled', false);
						var catalog_selected_objects = $('input[name=catalog_selected_objects]:checked', '.current-instrument-form').map(function() {return this.value;}).get().join(',');
						if (catalog_selected_objects != '') {
							formData.append('catalog_selected_objects', catalog_selected_objects);
						}
						if (current_catalog_index = $('input[name=catalog_selected_objects]:checked', '.catalog-wrapper').first().closest('.catalog-wrapper').attr('data-catalogue-index')) {
							formData.append('selected_catalog', JSON.stringify(session_image_catalogs[current_catalog_index]));
						}
						console.log(formData);
						// Attach files
						$.each($('input:file'), function(i, file) {
							if ($(this).val() !== '') {
								// console.log('attaching file
								// '+$(this).attr('name'));
								formData.append($(this).attr('name'), file.files[0]);
							}
						});
					}
					// Display the key/value pairs
// console.log('--- formData');
// for(var pair of formData.entries()) {
// console.log(pair[0]+ ', '+ pair[1]);
// }
					$('input[name=hidden_xspec_model]', '.current-instrument-form').prop('disabled', false);
					$('input.spectrum-fit-param', '.current-instrument-form').prop('disabled', true);
					request_draw_spectrum = false;
					console.log('showing window');
					waitingDialog.show('Processing ...', '', {
						progressType : 'success', 'showProgress' : true
					});
					$('#ldialog').find('.progress').show();
					
					var jqxhr = $.ajax({
						  url: $(this).attr('action'),
						  data: formData,
						  // data: form_elements,
						  dataType : 'json',
						  processData: false,
						  contentType: false,
						  type: $(this).attr('method')
						  })
						  .done (function(data, textStatus, jqXHR){
							  // merge_response_data();
							  console.log('--- Query response ---');
							  console.log(data);
							if (data.exit_status.status != 0) {
								debug_message= '';
								if (data.exit_status.debug_message) {
									debug_message= '<hr>' + debug_message;
								}
								waitingDialog
								.show(
										'',
										'<div class="alert alert-danger">Error : '+data.exit_status.error_message + debug_message+'</div>',
										{
											progressType : 'danger', 'showProgress' : true
										});
						        $('#ldialog').find('.progress').hide();
								return;
							}
							if (data.products.hasOwnProperty('image')) {
								if (data.products.image.hasOwnProperty('spectral_fit_image')) {
									display_spectrum(request_spectrum_form_element.data(), data.products.image);
								}
								else {
									catalog_index = 1;
									if (data.products.hasOwnProperty('catalog')) {
										catalog_index= session_image_catalogs.push(data.products.catalog);
									}
									display_image(data.products, catalog_index-1);
								}
							}
							else if (data.products.hasOwnProperty('spectrum_name')) {
								display_spectrum_table(data.products);
							}
							waitingDialog.hide();
						  })
						  .complete(function(jqXHR, textStatus ) {
							  target_form.data('bootstrapValidator').resetForm();
						  })
						  .fail(function(jqXHR,  textStatus,  errorThrown) {
							  console.log('textStatus : '+ textStatus);
							  console.log('errorThrown :'+errorThrown);
							  console.log('jqXHR');
							  console.log(jqXHR);
								waitingDialog
										.show(
												'',
												'<div class="alert alert-danger">Error : can not reach the data server<br>Please try later ...</div>',
												{
													'progressType' : 'danger'
												});
								$('#ldialog').find('.progress').hide();
						  });
					
					$('#ldialog .cancel-button').on('click', function() {
						jqxhr.abort();
					});
				});
		
		$('.panel-help').on('click', function(e) {
			// e.preventDefault();
			$.get( $(this).attr('href'), function( data ) {
				var help_text = $(".region-content .content", data);
				  // console.log('help_text:'+help_text);
				  help_text.find('#table-of-contents-links ul.toc-node-bullets li a, .toc-top-links a').each(function() {
						// console.log('href = '+ $(this).attr('href'));
						$(this).attr('href', $(this).attr('href').substring($(this).attr('href').indexOf("#")));
				  });
				  help_text.find('#table-of-contents-links').addClass('rounded');
				  waitingDialog.show('ISGRI Help', help_text, {
						dialogSize : 'lg', buttonText : 'Close', showCloseInHeader : true});
				  
			});
			return false;
		});
				
		set_panel_draggable($('.instrument-params-panel'));
						
	}
						
	
	function get_current_date_time()  {
		var currentdate = new Date();
		return ("0" + currentdate.getDate()).slice(-2) + "."
		+ ("0" + (currentdate.getMonth()+1)).slice(-2) + "."
        + currentdate.getFullYear() + "T"  
	    + ("0" + currentdate.getHours()).slice(-2) + ":"
	    + ("0" + currentdate.getMinutes()).slice(-2) + ":"
	    + ("0" + currentdate .getSeconds()).slice(-2);
	}
	
	function insert_new_panel(product_type, insertAfter, datetime) {
		var panel_id = product_type + '-wrapper-' + i;
		var panel_body_id = product_type + '-' + i;
		i++;				
		
		$result_panel = $('#astrooda_panel_model').clone();
		$result_panel.attr('id', panel_id);
		$result_panel.find('.date').text(datetime);
		$result_panel.find('.panel-body').attr('id', panel_body_id);
		
		$($result_panel).insertAfter(insertAfter);
		
		$('#'+panel_id+ ' .panel-heading .close-panel').on("click", function() {
			$(this).closest('.result-panel').remove();
		});
		set_panel_draggable($('#'+panel_id));
		set_collapsible(panel_id);
		return({ 'panel_id' : panel_id, 'panel_body_id' :panel_body_id});
	}

	function highlight_result_panel(panel_id) {
		max_zindexes = Math.max.apply(Math, $('.ldraggable').map(function() {return parseInt($(this).zIndex());}).get());
		position_left = parseInt(($('#'+panel_id).parent().width() - $('#'+panel_id).width())/2);
		show_options = { to: "#edit-submit--2", className: "ui-effects-transfer" }; 
		$('#'+panel_id).css({'left': position_left}).css('z-index', max_zindexes+1);
		var x = $('#integral-isgri').position().top -80;
	    $('html,body').animate({scrollTop: x}, 500, function() {
	        // Animation complete.
			$('#'+panel_id).show('highlight', {color: '#adebad'}, 1000);
	    });
	}

	function round_catalog_values(catalog) {
		for (var j = 0; j < catalog.cat_column_list[0].length; j++) {
			// Round significance to 1 digit
			catalog.cat_column_list[2][j] = catalog.cat_column_list[2][j].toFixed(1);
			// Round RA to 3 digits
			catalog.cat_column_list[3][j] = catalog.cat_column_list[3][j].toFixed(3);
			// Round DEC to 3 digits
			catalog.cat_column_list[4][j] = catalog.cat_column_list[4][j].toFixed(3);
		}
	}
	
	function display_catalog(catalog_index, afterDiv, datetime) {
		catalog = clone(session_image_catalogs[catalog_index]);
		
		round_catalog_values(catalog);
		var header = '<tr><th><input name="catalog-all-objects" type="checkbox"></th>';
		var body = '';
		for (var i = 1; i < 5; i++) {
			header += '<th>' + catalog.cat_column_names[i] + '</th>';
		}
		for (var i = 5; i < catalog.cat_column_names.length; i++) {
			header += '<th class="optional">' + catalog.cat_column_names[i] + '</th>';
		}
		header += '</tr>';
		for (var j = 0; j < catalog.cat_column_list[0].length; j++) {
			body += '<tr><td><input name="catalog_selected_objects" type="checkbox" value="'
					+ catalog.cat_column_list[0][j] + '"></td>';
			for (var i = 1; i < 5; i++) {
				body += '<td>' + catalog.cat_column_list[i][j] + '</td>';
			}
			for (var i = 5; i < catalog.cat_column_list.length; i++) {
				body += '<td class="optional">' + catalog.cat_column_list[i][j] + '</td>';
			}
			body += '</tr>';
		}
		var html = '<table class="astro-ana"><thead>' + header
				+ '</thead><tbody>' + body + '</tbody></table>';
		
		var panel_ids =insert_new_panel('image-catalog', afterDiv, datetime);
		$('#'+panel_ids.panel_body_id ).append('<div class="catalog-wrapper" data-catalogue-index="'+catalog_index+'"><div class="more-less"><a href="#" class="more">More ...</a><a href="#" class="less">Less</a></div></div>');
		$(".catalog-wrapper", '#'+panel_ids.panel_body_id).append(html);
		source_name = $('input[name=src_name]', '.current-instrument-form').val();
		$('#'+panel_ids.panel_id+ ' .panel-heading .panel-title').html('Source : '+ source_name + ' - Image catalog');
		
		$(".more", '#'+panel_ids.panel_body_id).show().on('click', function(e) {
			e.preventDefault();
			$(this).hide();
			$(".less", '#'+panel_ids.panel_body_id).show();
			$(".optional", '#'+panel_ids.panel_body_id).fadeIn();
			return false;
		})
		$(".less", '#'+panel_ids.panel_body_id).on('click', function(e) {
			e.preventDefault();
			$(this).hide();
			$(".more", '#'+panel_ids.panel_body_id).show();
			$(".optional", '#'+panel_ids.panel_body_id).fadeOut();
			return false;
		})
		set_table_select_all('#'+panel_ids.panel_body_id + ' .catalog-wrapper', 'catalog-all-objects', 'catalog_selected_objects');
		only_one_catalog_selection('#'+panel_ids.panel_body_id + ' .catalog-wrapper', '.catalog-wrapper', 'catalog-all-objects', 'catalog_selected_objects');
		
		highlight_result_panel(panel_ids.panel_id);
	}
	
	function only_one_catalog_selection(element_wrapper, element_class, select_all_element, checked_element) {
		$('input[name=' + checked_element +']', element_wrapper).on('change', function(e) {
			if(this.checked) {
				obj = $(element_wrapper);
				$('input[name=' + checked_element +']', element_class).each(function(e) {
					if (!$(this).closest(element_class).is(obj)) {
						$(this).prop('checked', false);
					}
				});
			}
		});
	}
	
	function set_table_select_all(element_wrapper, select_all_element, elements_to_select) {
		$('input[name=' + select_all_element+']', element_wrapper).on('click', function(e) {
			$('input[name=' + elements_to_select +']', element_wrapper).prop('checked', this.checked).change();
		});
	}
	
	function display_spectrum_table(data) {
// console.log('spectrum table data');
// console.log(data);
		
		datetime= get_current_date_time();
		var header = '<tr><th>Source name</th><th>Xspec model</th><th>Spectrum</th><th/></tr>';
		var body = '';
		for (var i = 0; i < data.spectrum_name.length; i++) {
			body += '<tr><td>' + data.spectrum_name[i] +
			'</td><td><input id="hidden_xspec_model-'+i+'" name="hidden_xspec_model" type="text" class="form-control" value="powerlaw"></td><td><button type="button" class="btn btn-primary draw_spectrum" data="'+i+'">Fit</button></td>'
			+ '</tr>';
		}

		var html = '<table class="astro-ana spectra"><thead>' + header
				+ '</thead><tbody>' + body + '</tbody></table>';
		
		var panel_ids =insert_new_panel('spectrum-table', '#isgri-params', datetime);
		$('#'+panel_ids.panel_body_id ).append('<div id="spectrum-table-wrapper"></div>');
		$("#spectrum-table-wrapper").html(html);
		source_name = $('input[name=src_name]', '.current-instrument-form').val();
		$('#'+panel_ids.panel_id+ ' .panel-heading .panel-title').html('Source : '+ source_name + ' - Spectra table');
		
		$('.draw_spectrum').on('click', function() {
			request_draw_spectrum = true;
			request_spectrum_form_element = $(this);
			var i = $(this).attr('data');
			draw_spectrum_form_elements = new FormData();
			var session_id= $('input[name=session_id]', '.current-instrument-form').val();
			
			draw_spectrum_form_elements.append('session_id', session_id);
			draw_spectrum_form_elements.append('query_type', $('input[name=query_type]', '.current-instrument-form').val());
			draw_spectrum_form_elements.append('product_type', 'spectral_fit');
			draw_spectrum_form_elements.append('xspec_model', $('input[id=hidden_xspec_model-'+i+']', '.current-instrument-form').val());
			draw_spectrum_form_elements.append('ph_file', data.ph_file_path[i]);
			draw_spectrum_form_elements.append('arf_file', data.arf_file_path[i]);
			draw_spectrum_form_elements.append('rmf_file', data.rmf_file_path[i]);
			
			$(this).data('session_id', session_id);
			$(this).data('parameters', draw_spectrum_form_elements);
			$(this).data('source_name', data.spectrum_name[i]);
			$(this).data('files', data.ph_file_path[i]+','+data.arf_file_path[i]+','+data.rmf_file_path[i]);
			
			$('.current-instrument-form').submit();
		});
		highlight_result_panel(panel_ids.panel_id);
	}
	
	function  get_text_table(table) {
		if (! table.hasOwnProperty('column_names')) {
			return '';
		}
		var header = '<tr>';
		for (var i = 0; i < table.column_names.length; i++) {
			header += '<th>' + table.column_names[i] + '</th>';
		}
		header += '</tr>';
		var body = '';
		for (var j = 0; j < table.columns_list[0].length; j++) {
			body += '<tr>';
			for (var i = 0; i < table.columns_list.length; i++) {
				body += '<td>' + table.columns_list[i][j] + '</td>';
			}
			body += '</tr>';
		}
		var html = '<table class="spectrum-text-table"><thead>' + header
				+ '</thead><tbody>' + body + '</tbody></table>';
		return(html);
	}
	
	function display_spectrum(metadata, data) {
		console.log('--New new spectrum');
		console.log(data);

		datetime= get_current_date_time();
		var panel_ids =insert_new_panel('image', '#isgri-params', datetime);

		download_filename = 'spectra-'+ metadata.source_name +'.tar.gz';
		url = 'session_id='+ metadata.session_id +'&file_list='+ metadata.files +'&file_name='+ download_filename ;
		url = url.replace(/\+/g, '%2B');
		$('#'+panel_ids.panel_body_id ).append('<a href="/dispatch-data/download_products?'+url+'">Download<a>');

		data.spectral_fit_image.height *= 0.9375;
		data.spectral_fit_image.width *= 0.9375;
		
		mpld3.draw_figure(panel_ids.panel_body_id, data.spectral_fit_image);
		$('#'+panel_ids.panel_body_id ).append(data.header_text.replace(/\n/g, "<br />"));
		$('#'+panel_ids.panel_body_id ).append(get_text_table(data.table_text));
		$('#'+panel_ids.panel_body_id ).append(data.footer_text.replace(/\n/g, "<br />"));
		$('#'+panel_ids.panel_id+ ' .panel-heading .panel-title').html('Source : '+ metadata.source_name + ' - Spectrum');

		$('#'+panel_ids.panel_id).css({'width' : $('#'+panel_ids.panel_id).width()});
		var x = $('#'+panel_ids.panel_id).offset().top - 100;
	    jQuery('html,body').animate({scrollTop: x}, 500);

		highlight_result_panel(panel_ids.panel_id);
	}
	
	function display_image(data, catalogue_index) {
		// var panel_ids =insert_new_panel('image', '#catalog-wrapper');
		datetime = get_current_date_time();
		var panel_ids =insert_new_panel('image', '#isgri-params', datetime);
		
		console.log('Displaying image ...');
		
		session_id = $('input[name=session_id]', '.current-instrument-form').val();
		url = 'session_id='+ session_id  + '&file_list='+ data.file_path +'&file_name='+  data.file_name;
		url = url.replace(/\+/g, '%2B');
		$('#'+panel_ids.panel_body_id ).append('<a href="/dispatch-data/download_products?'+url+'">Download<a>');
		product_type = $('input[name=product_type]:checked', '.current-instrument-form').val();
		if (product_type == 'isgri_image') {
			data.image.image.height *= 1.4;
			data.image.image.width *= 1.4;
			$('#'+panel_ids.panel_body_id ).append('<br/><a class="show-catalog" data-catalog-index="'+catalogue_index+'" data-datetime="'+ datetime+ '" href="#" >Show catalog<a>');
			$('#'+panel_ids.panel_body_id + ' .show-catalog').on('click', function(e) {
				e.preventDefault();
				var catalog_index = parseInt($(this).attr('data-catalog-index'));
				datetime = $(this).attr('data-datetime');
				display_catalog(catalog_index, '#'+panel_ids.panel_id, datetime);
			});
		}
		//console.log('input_prod_list.length='+ data.input_prod_list.length);
		//data.input_prod_list = ['005100410010.001','005100420010.001'];
		if (data.input_prod_list.length > 0) {
			$('#'+panel_ids.panel_body_id ).append('<div>ScWs List <button type="button" class="btn btn-xs copy-to-clipboard" >Copy</button>:<br><span>'+data.input_prod_list.join(', ')+'</span></div>');
			$('.copy-to-clipboard').on('click', function () {
				copyToClipboard($(this).parent().find('span').text());
			});
		}
		console.log('Displaying image 2...');

		mpld3.draw_figure(panel_ids.panel_body_id, data.image.image);
		$('#'+panel_ids.panel_body_id ).append(data.image.header_text.replace(/\n/g, "<br />"));
		$('#'+panel_ids.panel_body_id ).append(get_text_table(data.image.table_text));
		$('#'+panel_ids.panel_body_id ).append(data.image.footer_text.replace(/\n/g, "<br />"));
		
		source_name = $('input[name=src_name]', '.current-instrument-form').val();
		$('#'+panel_ids.panel_id+ ' .panel-heading .panel-title').html('Source : '+ source_name + ' - ' + product_type);

		// set_draggable();
		$('#'+panel_ids.panel_id).css({'width' : $('#'+panel_ids.panel_id).width()});
        
		highlight_result_panel(panel_ids.panel_id);
	}

	function set_collapsible(panel_id) {
		
	$('#'+panel_id + ' .panel-heading span.clickable').on('click', function(e){
		var $this = $(this);
		if(!$this.hasClass('panel-collapsed')) {
			$this.closest('.panel').find('.panel-body').slideUp();
			$this.addClass('panel-collapsed');
			$this.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
		} else {
			$this.closest('.panel').find('.panel-body').slideDown();
			$this.removeClass('panel-collapsed');
			$this.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
		}
		
	});
	}
	
	function jsUcfirst(string) 
	{
	    return string.charAt(0).toUpperCase() + string.slice(1);
	}

	
	function set_panel_draggable (thisPanel) {
	   thisPanel.draggable({
			handle: '.panel-heading',
			stack : '.ldraggable',
			containment: "parent"
	   });
    }
	
	function set_panel_resizable (thisPanel) {
		   thisPanel.resizable({
		   });
	    }
	
	function clone(old_obj) {
		// Deep copy
		return jQuery.extend(true, {}, old_obj);
	}	
	
})(jQuery);

/**
 * Module for displaying "Waiting for..." dialog using Bootstrap
 * 
 * @author Eugene Maslovich <ehpc@em42.ru>
 */


function get_waitingDialog() {
	var waitingDialog = waitingDialog
		|| (function($) {
			'use strict';
			 
			var $dialog = $("#ldialog");
			// Move modal dialog to the end of body
			$dialog.detach().appendTo('body');
			
			return {
				/**
				 * Opens alog
				 * 
				 * @param message
				 *            Custom message
				 * @param options
				 *            Custom options: options.dialogSize - bootstrap
				 *            postfix for dialog size, e.g. "sm", "m";
				 *            options.progressType - bootstrap postfix for
				 *            progress bar type, e.g. "success", "warning".
				 */
				show : function(title, message, options) {
					// Assigning defaults
					if (typeof options === 'undefined') {
						options = {};
					}
					if (typeof title === 'undefined') {
						title = 'Loading ...';
					}
					if (typeof message === 'undefined') {
						message = '';
					}
					var settings = $.extend({
						dialogSize : 'm', 
						progressType : '',
						onHide : null,
						showProgress : false,
						showCloseInHeader : false,
						showButton : true,
						buttonText : 'Cancel'
					// This callback runs after the dialog was hidden
					}, options);

					// Configuring dialog
					$dialog.find('.modal-dialog').attr('class', 'modal-dialog')
							.addClass('modal-' + settings.dialogSize);
					
					$dialog.find('.progress-bar').attr('class', 'progress-bar');
					if (!settings.showCloseInHeader) {
						$dialog.find('.modal-header .close').hide();
					}
					if (!settings.showProgress) {
						$dialog.find('.progress').hide();
					}
					else if (settings.progressType) {
						$dialog.find('.progress-bar').addClass(
								'progress-bar-' + settings.progressType);
					}
					if (settings.showButton) {
						$dialog.find('button').show();												
					}
					else {
						$dialog.find('button').hide();						
					}
					console.log('show modal window');
					$dialog.find('h4').html(title);
					$dialog.find('.message').html(message);
					$dialog.find('.modal-footer button').text(settings.buttonText).addClass(settings.buttonText.toLowerCase() + '-button');
					
					// Adding callbacks
					if (typeof settings.onHide === 'function') {
						$dialog.off('hidden.bs.modal').on('hidden.bs.modal',
								function(e) {
									settings.onHide.call($dialog);
								});
					}
					// Opening dialog
					$dialog.modal();
					$dialog.find('.close-panel').on("click", function() {
					});

				},
				/**
				 * Closes dialog
				 */
				hide : function() {
					$dialog.modal('hide');
				}
			};

		})(jQuery);
	return(waitingDialog);
}

function copyToClipboard(text) {

	   var textArea = document.createElement( "textarea" );
	   textArea.value = text;
	   document.body.appendChild( textArea );

	   textArea.select();

	   try {
	      var successful = document.execCommand( 'copy' );
	      var msg = successful ? 'successful' : 'unsuccessful';
	   } catch (err) {
	   }

	   document.body.removeChild( textArea );
	}
function add3Dots(field_name, field_description, limit)
{
	
  var dots = '<a href="#" data-toggle="popover" title="'+field_name+' " duuata-content="TTT" class="popover-help"> ...</a>';
  if(field_description.length > limit)
  {
    // you can also use substr instead of substring
	  field_description = '<div class="astrooda-popver-content">' + field_description + '</div><span>'+field_description.substring(0,limit) + '</span>'+ dots;
  }

    return field_description;
}
