if (document.body) {
  document.body.onmouseup = function(e) {
    self.port.emit('onmouseup', { x: e.clientX, y: e.clientY });
  };
}