$(document).ready(function() {
  //email mask
  $('.inputname').blur(function() {
    if ($(this).val() != '') {
      var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
      if (pattern.test($(this).val())) {
        $(this).css({ 'border': '1px solid #569b44' });
      } else {
        $(this).css({ 'border': '1px solid #ff0000' });
      }
    } else {
      $(this).css({ 'border': '1px solid #ff0000' });
    }
  });

  //placeholder
  $('input, textarea').each(function() {
    var placeholder = $(this).attr('placeholder');
    $(this).focus(function() {
      $(this).attr('placeholder', '');
    });
    $(this).focusout(function() {
      $(this).attr('placeholder', placeholder);
    });
  });
});