"use strict";

document.addEventListener('selectionchange', function() {
  let selection = window.getSelection().toString().trim();
  chrome.runtime.sendMessage({
    request: 'updateContextMenu',
    selection: selection
  });
});
