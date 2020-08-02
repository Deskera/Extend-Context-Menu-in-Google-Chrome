"use strict";

let site = document.getElementById('site');
let url = document.getElementById('url');
let pattern = document.getElementById('pattern');
let status = document.getElementById('status');

function saveOptions() {
  if(site.value.match(/^\w+(?:\s*\w+)*$/) 
  	&& url.value.match(/^(http|https):\/\/[^ "]+$/) 
  	&& pattern.value.match(/^(?:\\w|\\d|-|\.|\*|\+|\w|A-Z|a-z|\[|]|\(|\))+$/)){
    chrome.storage.sync.set({
      site: site.value,
      url: url.value,
      pattern: pattern.value
    }, function() {
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
  } else {
      status.textContent = 'Invalid options.';
      setTimeout(function() {
        status.textContent = '';
      }, 1000);
  }
}

function restoreOptions() {
  chrome.storage.sync.get( null, function(items){
    site.value = items["site"];
    url.value = items["url"];
    pattern.value = items["pattern"];
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);