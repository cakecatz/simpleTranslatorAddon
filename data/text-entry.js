var outputArea = getElem('translator-output-box');



self.port.on('show', function onShow(text) {
  outputArea.innerHTML = '';
  var url = makeTranslateRequestUrl(text, 'en|ja');
  var req = new XMLHttpRequest();
  req.onload = function() {
    data = JSON.parse(this.responseText);
    outputArea.insertAdjacentHTML('beforeend', data.responseData.translatedText);
  };

  req.open('get', url, true);
  req.send();

});

self.port.on('hide', function() {
  outputArea.innerHTML = '';
});

function getElem(id) {
  return document.getElementById(id);
}

function makeTranslateRequestUrl(q, langpair) {
  var url = 'http://api.mymemory.translated.net/get?of=json';

  url += '&langpair=' + langpair;

  url += '&q=' + q;

  return url;
}