(function($) {

  $(document).ready(function() {
    $('.instrument-panel form.mmmmmoda-iframe-result').on('success.form.bv', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('This one is called specific 2');
    });
  });
})(jQuery);