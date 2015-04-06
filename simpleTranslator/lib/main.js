var areaMargin = {
  top: 20,
  bottom: 20,
  right: 20,
  left: 20,
};

var mousePosition = {
  top: 0,
  left: 0,
};

var areaSize = {
  width: 280,
  height: 80,
};

var keyCodes = {
  ctrl: 16,
  shift: 17,
};

var keyStatus = {
  16: false,
  17: false,
};

var data = require("sdk/self").data;
var tabs = require("sdk/tabs");
var selection = require ('sdk/selection');
var translationPanel = require("sdk/panel").Panel({
  width: areaSize.width,
  height: areaSize.height,
  contentURL: data.url("translatedTextArea.html"),
  contentScriptFile: data.url("translation.js"),
});

var Request = require('sdk/request').Request;

var { observer } = require("sdk/keyboard/observer");

tabs.on('ready', function(tab) {
  worker = tab.attach({
    contentScriptFile: data.url("tabReady.js")
  });
  worker.port.on('onmouseup', function(position) {
    mousePosition = position;
  });
});

observer.on('keydown', function(event) {
  if (event.defaultPrevented){
    return;
  }
  keyStatus[event.keyCode] = true;

  if ( keyStatus[keyCodes.ctrl] && keyStatus[keyCodes.shift] && selection.text) {
    translationPanel.show({
      position: {
        top: mousePosition.y + 10,
        left: mousePosition.x + 10
      },
      width: 300,
    });
  }
});

observer.on('keyup', function(event) {
  if (event.defaultPrevented){
    return;
  }
  keyStatus[event.keyCode] = false;
});

// Toolbar button

require('sdk/ui/button/action').ActionButton({
  id: "translator",
  label: "translate",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png",
  },
  onClick: handleClick,
});

function handleClick(state) {
  translationPanel.show({
    position: {
      top: mousePosition.y + 10,
      left: mousePosition.x + 10
    },
    width: 300,
  });
}

// panel event

translationPanel.on('hide', function(){
  translationPanel.port.emit("hide");
});

translationPanel.on('show', function(){
  translationPanel.port.emit("show", selection.text);
});

translationPanel.port.on('translate', function(data) {
  var translateRequest = Request({
    url: data.url,
    onComplete: function(response) {
      translationPanel.port.emit("translated", response.text);
    }
  });
  translateRequest.get();
});


// methods

function getPosition(position) {
  switch(position) {
    case 'top-left':
      return { top: areaMargin.top, left: areaMargin.left };
    case 'top-right':
      return { top: areaMargin.top, right: areaMargin.right };
    case 'bottom-left':
      return { bottom: areaMargin.bottom, left: areaMargin.left };
    case 'bottom-right':
      return { bottom: areaMargin.bottom, right: areaMargin.right };
  }
}