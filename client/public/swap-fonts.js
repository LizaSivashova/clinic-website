// Switches the Google Fonts stylesheet from media=print to media=all
// after the page has rendered, making it non-render-blocking without
// using inline event handlers (which violate the Content Security Policy).
(function () {
  var link = document.getElementById('gfonts');
  if (link) link.media = 'all';
})();
