var data = require("sdk/self").data;
var text_entry = require("sdk/panel").Panel({
  width: 280,
  height: 80,
  contentURL: data.url("text-entry.html"),
  contentScriptFile: data.url("text-entry.js"),
});
var {observer} = require("sdk/keyboard/observer");

var selection = require ('sdk/selection');

var keyStatus = {

};

observer.on('keydown', function(event) {
  if (event.defaultPrevented){
    return;
  }

  keyStatus[event.keyCode] = true;

  if (keyStatus[16] && keyStatus[17] && selection.text) {
    text_entry.show();
  }
});

observer.on('keyup', function(event) {
  if (event.defaultPrevented){
    return;
  }

  keyStatus[event.keyCode] = false;
});

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
  text_entry.show();
}

text_entry.on('hide', function(){
  text_entry.port.emit("hide");
});

text_entry.on('show', function(){
  text_entry.port.emit("show", selection.text);
});