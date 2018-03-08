
(function($) {

	$(document).ready(commonReady);
	var i = 1;
	var session_image_catalogs = [];

	var request_draw_spectrum = false;
	var request_spectrum_form_element;

	var current_ajax_call_params= {};
	
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
	
	function AJAX_call() {
		// Display the key/value pairs
		console.log('--- initialFormData');
		for(var parameter of current_ajax_call_params.initialFormData.entries()) {
			console.log(parameter[0]+ '='+ parameter[1]);
		}
		console.log('--- currentFormData');
		for(var parameter of current_ajax_call_params.currentFormData.entries()) {
			console.log(parameter[0]+ '='+ parameter[1]);
		}
		var requestTimer = null;
		var jqxhr = $.ajax({
			url: current_ajax_call_params.action,
			data: current_ajax_call_params.currentFormData,
			// data: form_elements,
			dataType : 'json',
			processData: false,
			contentType: false,
	    timeout: 60000, // sets timeout to 10 seconds
			type: 'POST'
		})
		.done (function(data, textStatus, jqXHR){
			// merge_response_data();

			console.log('--- Query response ---');
			console.log(data);
			job_id = '';
			if (data['job_monitor'].hasOwnProperty('job_id')) {
				job_id = data['job_monitor']['job_id'];
			}
			waitingDialog.setHeaderMessageJobId(job_id);
			if (data.query_status == 'failed') {
				waitingDialog.hideSpinner();
				waitingDialog.append(get_current_date_time() + ' ' + data.exit_status.error_message, 'danger');
			}
			else if (data.query_status != 'done') {
			  previous_message = '';
				if (typeof message !== 'undefined') {
					previous_message= message;
				}
				message= 'Status : ' + data.job_status;
				if (data['job_monitor'].hasOwnProperty('full_report_dict')) {
					message+= ' | ' + data['job_monitor'].full_report_dict.message + ' | ' +data['job_monitor'].full_report_dict.node;
					if (data['job_monitor'].full_report_dict.hasOwnProperty('scwid')){
						message+= ' | ' + data['job_monitor'].full_report_dict.scwid;
					}
				}
				if (message != previous_message) {
					waitingDialog.append(get_current_date_time() + ' ' + message +'<br>');
				}
				current_ajax_call_params.currentFormData = cloneFormData(current_ajax_call_params.initialFormData);
				current_ajax_call_params.currentFormData.append('query_status', data.query_status);
				if (!current_ajax_call_params.currentFormData.has('job_id')) {
					current_ajax_call_params.currentFormData.append('job_id', job_id);
				}
				
				requestTimer = setTimeout(AJAX_call,5000);
				
			}
			else {
				i++;
				job_id = data['job_monitor']['job_id'];
				instrument = $('input[name=instrument]', ".instrument-panel.active").val();
				$('#ldialog').find('.progress').hide();
				if (data.exit_status.status != 0) {
					debug_message= '';
					if (data.exit_status.debug_message) {
						debug_message= '<hr>' + debug_message;
					}
					$('#ldialog').find('.progress').hide();
				}
				if (data.products.hasOwnProperty('image')) {
					if (data.products.image.hasOwnProperty('spectral_fit_image')) {
						display_spectrum(request_spectrum_form_element.data(), data.products.image, job_id, instrument);
						}
					else {
						catalog_index = 1;
						if (data.products.hasOwnProperty('catalog')) {
							catalog_index= session_image_catalogs.push(data.products.catalog);
						}
						display_image(data.products, catalog_index-1, job_id, instrument);
					}
				}
				else if (data.products.hasOwnProperty('spectrum_name')) {
					display_spectrum_table(job_id, data.query_status, data.products);
				}
				waitingDialog.hide();
			}
		})
		.complete(function(jqXHR, textStatus ) {
			 $('input[type=submit].form-submit', ".instrument-panel.active").prop('disabled', false);
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
						progressType : 'danger' // , showSpinner : false, showProgressBar :
																		// false
					});
		});
		
		$('#ldialog .cancel-button').on('click', function() {
			if (requestTimer) {
				window.clearTimeout(requestTimer);
			}
			jqxhr.abort();
		});

	}

	function commonReady() {
		console.log('Submit button id:'+ $(".form-submit", ".instrument-panel.active").attr('id'));
		console.log('query_type id:'+ $('select[name=query_type]', ".instrument-panel.active").attr('id'));
		waitingDialog =  get_waitingDialog();
		// The main block is hidden at startup (in astrooda.css) and
		// shown here after the setup of DOM and the field controls
		$('.block-astrooda').show();
		
		$('.instrument-panel form').bootstrapValidator({
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
							return (validate_scws(value, 50));
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
		});

		$('.instrument-panel form').on(
				'success.form.bv',
				function(e) {
					var form_id = $(this).attr('id').replace(/-/g , "_");
					
					e.preventDefault();
					var formData;
					if (request_draw_spectrum) {
						formData = request_spectrum_form_element.data('parameters');
					}
					else {
						$('input:not(:file)', this).val(function(_, value) {
							return $.trim(value);
						});
						
						// Disable form elements added by Drupal
						$('[name^=form_]', this).prop('disabled', true);
						$('[name^=form_]','form#astrooda-common').prop('disabled', true);
						// $('[name=catalog_selected_objects]', this).prop('disabled',
						// true);

						// Collect common parameters
						var allFormData = $("form#astrooda-common").serializeArray();
						
						// Collect instrument form fields and remove the form id prefix from
						// the name
						var instrumentFormData = $($(this)[0]).serializeArray().map(function(item, index) {
							  item.name = item.name.replace(form_id+'_','');
								return (item);
						});

						allFormData = allFormData.concat(instrumentFormData);
						formData = new FormData();
						for (var lindex=0; lindex<allFormData.length; lindex++)
						    formData.append(allFormData[lindex].name, allFormData[lindex].value);
						// Enable form elements added by Drupal
						$('[name^=form_]',this).prop('disabled', false);
						$('[name^=form_]','form#astrooda-common').prop('disabled', false);
						// $('[name=catalog_selected_objects]',this).prop('disabled',
						// false);
						
						var catalog_selected_objects = $('input[name=catalog_selected_objects]:checked', $(this).closest('.instrument-panel')).map(function() {return this.value;}).get().join(',');
						if (catalog_selected_objects != '') {
							formData.append('catalog_selected_objects', catalog_selected_objects);
						}
						if (current_catalog_index = $('input[name=catalog_selected_objects]:checked', '.catalog-wrapper').first().closest('.catalog-wrapper').attr('data-catalogue-index')) {
							formData.append('selected_catalog', JSON.stringify(session_image_catalogs[current_catalog_index]));
						}
						// Attach files
						$.each($('input:file', this), function(i, file) {
							if ($(this).val() !== '') {
								// console.log('attaching file
								// '+$(this).attr('name'));
								formData.append($(this).attr('name'), file.files[0]);
							}
						});						
					}
					$('input[name=hidden_xspec_model]', this).prop('disabled', false);
					$('input.spectrum-fit-param', this).prop('disabled', true);
					
					request_draw_spectrum = false;

					waitingDialog.show('Processing ...', '', {
						progressType : 'success', showProgressBar : false, showSpinner : true
					});
					waitingDialog.setHeaderMessagesSessionId(formData.get('session_id'));
					waitingDialog.showHeaderMessage();
					

					current_ajax_call_params = {};
					
					current_ajax_call_params.initialFormData = formData;
					current_ajax_call_params.currentFormData = cloneFormData(formData);
					if (!current_ajax_call_params.currentFormData.has('query_status')) {
						current_ajax_call_params.currentFormData.append('query_status', 'new');
					}
					if (!current_ajax_call_params.currentFormData.has('job_id')) {
						current_ajax_call_params.currentFormData.append('job_id', '');
					}
					current_ajax_call_params.action= $(this).attr('action');
					current_ajax_call_params.form= this;

					AJAX_call();
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
				instrument = $('input[name=instrument]', ".instrument-panel.active").val();
				waitingDialog.show(instrument.toUpperCase()+' Help', help_text, {
					dialogSize : 'lg', buttonText : 'Close', showCloseInHeader : true});
			});
			return false;
		});


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

		// var panel_ids =insert_new_panel(i, 'image-catalog', afterDiv, datetime);
		console.log('---aferDIV='+afterDiv);
		var panel_ids = $(afterDiv).insert_new_panel(i, 'image-catalog', datetime);

		$('#'+panel_ids.panel_body_id ).append('<div class="catalog-wrapper" data-catalogue-index="'+catalog_index+'"><div class="more-less"><a href="#" class="more">More ...</a><a href="#" class="less">Less</a></div></div>');
		$(".catalog-wrapper", '#'+panel_ids.panel_body_id).append(html);
		source_name = $('input[name=src_name]', 'form#astrooda-common').val();
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
		$('#'+panel_ids.panel_body_id + ' .catalog-wrapper').set_table_select_all('catalog-all-objects', 'catalog_selected_objects');
		only_one_catalog_selection('#'+panel_ids.panel_body_id + ' .catalog-wrapper', '.catalog-wrapper', 'catalog-all-objects', 'catalog_selected_objects');

		// highlight_result_panel(panel_ids.panel_id);
		$('#'+panel_ids.panel_id ).highlight_result_panel();

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

	function display_spectrum_table(job_id, query_status, data) {

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

		// var panel_ids =insert_new_panel(i, 'spectrum-table', '#isgri-params',
		// datetime);
		// var panel_ids =$('#isgri-params').insert_new_panel(i, 'spectrum-table',
		// datetime);
		var panel_ids =$(".instrument-params-panel", ".instrument-panel.active").insert_new_panel(i, 'spectrum-table', datetime);

		
		
		$('#'+panel_ids.panel_body_id ).append('<div id="spectrum-table-wrapper"></div>');
		$("#spectrum-table-wrapper").html(html);
		source_name = $('input[name=src_name]', 'form#astrooda-common').val();
		$('#'+panel_ids.panel_id+ ' .panel-heading .panel-title').html('Source : '+ source_name + ' - Spectra table');

		$('.draw_spectrum').on('click', function() {
			console.log('--- Draw spectrum');
			request_draw_spectrum = true;
			request_spectrum_form_element = $(this);
			var i = $(this).attr('data');
			draw_spectrum_form_elements = new FormData();
			var session_id= $('input[name=session_id]', 'form#astrooda-common').val();

			draw_spectrum_form_elements.append('session_id', session_id);
			draw_spectrum_form_elements.append('query_status', 'ready');
			draw_spectrum_form_elements.append('job_id', job_id);
			draw_spectrum_form_elements.append('instrument', $('input[name=instrument]', ".instrument-panel.active").val());
			draw_spectrum_form_elements.append('query_type', $('select[name=query_type]', ".instrument-panel.active").val());
			draw_spectrum_form_elements.append('product_type', 'spectral_fit');
			draw_spectrum_form_elements.append('xspec_model', $('input[id=hidden_xspec_model-'+i+']', ".instrument-panel.active").val());
			draw_spectrum_form_elements.append('ph_file_name', data.ph_file_name[i]);
			draw_spectrum_form_elements.append('arf_file_name', data.arf_file_name[i]);
			draw_spectrum_form_elements.append('rmf_file_name', data.rmf_file_name[i]);

			$(this).data('session_id', session_id);
			$(this).data('parameters', draw_spectrum_form_elements);
			$(this).data('source_name', data.spectrum_name[i]);
			$(this).data('files', data.ph_file_name[i]+','+data.arf_file_name[i]+','+data.rmf_file_name[i]);

			// $(".instrument-panel.active").submit();
			// console.log('Submit button id:'+ $(".form-submit",
			// ".instrument-panel.active").attr(id));
			$(".form-submit", ".instrument-panel.active").click();
		});
		// highlight_result_panel(panel_ids.panel_id);
		$('#'+panel_ids.panel_id ).highlight_result_panel();

	}


	function display_spectrum(metadata, data, job_id, instrument) {
		console.log('--New new spectrum');
		console.log(data);

		datetime= get_current_date_time();
		// var panel_ids =insert_new_panel(i, 'image', '#isgri-params', datetime);
		// var panel_ids =$('#isgri-params').insert_new_panel(i, 'image', datetime);
		var panel_ids =$(".instrument-params-panel", ".instrument-panel.active").insert_new_panel(i, 'image', datetime);

		download_filename = 'spectra-'+ metadata.source_name +'.tar.gz';
		url = 'session_id='+ metadata.session_id +'&file_list='+ metadata.files +'&download_file_name='+ download_filename+'&query_status=ready&job_id='+job_id+'&instrument='+instrument ;
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

		$('#'+panel_ids.panel_id ).highlight_result_panel();
	}

	function display_image(data, catalogue_index, job_id, instrument) {
		// var panel_ids =insert_new_panel(i, 'image', '#catalog-wrapper');
		datetime = get_current_date_time();
		// var panel_ids =$('#isgri-params').insert_new_panel(i, 'image', datetime);
		var panel_ids =$(".instrument-params-panel", ".instrument-panel.active").insert_new_panel(i, 'image', datetime);

		// console.log('Displaying image ...');

		session_id = $('input[name=session_id]', 'form#astrooda-common').val();
		url = 'session_id='+ session_id  + '&download_file_name='+  data.download_file_name+ '&file_list='+  data.file_name+'&query_status=ready&job_id='+job_id+'&instrument='+instrument;
		url = url.replace(/\+/g, '%2B');
		$('#'+panel_ids.panel_body_id ).append('<a href="/dispatch-data/download_products?'+url+'">Download<a>');
		product_type = $("input[name$='product_type']:checked", ".instrument-panel.active").val();
		if (product_type.endsWith('image')) {
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
		// console.log('input_prod_list.length='+ data.input_prod_list.length);
		// data.input_prod_list = ['005100410010.001','005100420010.001'];
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

		source_name = $('input[name=src_name]', 'form#astrooda-common').val();
		$('#'+panel_ids.panel_id+ ' .panel-heading .panel-title').html('Source : '+ source_name + ' - ' + product_type);

		// set_draggable();
		$('#'+panel_ids.panel_id).css({'width' : $('#'+panel_ids.panel_id).width()});

		$('#'+panel_ids.panel_id ).highlight_result_panel();
	}


})(jQuery);
