var outputArea = getElem('translator-output-box');

var translatingTextNode = document.createElement('span').appendChild( document.createTextNode('Translating...'));

self.port.on('show', function onShow(text) {
  var url = makeTranslateRequestUrl(text, 'en|ja');
  var req = new XMLHttpRequest();
  req.onload = function() {
    data = JSON.parse(this.responseText);
    var translatedTextNode = document.createElement('div').appendChild(
      document.createTextNode( data.responseData.translatedText ));
    outputArea.removeChild( outputArea.firstChild );
    outputArea.appendChild( translatedTextNode );
  };

  req.open('get', url, true);
  req.send();

});

self.port.on('hide', function() {
  outputArea.removeChild( outputArea.firstChild );
  outputArea.appendChild( translatingTextNode );
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
