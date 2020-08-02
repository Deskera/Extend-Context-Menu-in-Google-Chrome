let site = document.getElementById('site');
let url = document.getElementById('url');
let pattern = document.getElementById('pattern');

function saveOptions() {
  chrome.storage.sync.set({
    site: site.value,
    url: url.value,
    pattern: pattern.value
  }, function() {
    let status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
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