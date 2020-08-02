var target;
var targetUrl;
var selectionMatchingPattern;
const CONTEXT_MENU_ID = "CUSTOM_CONTEXT_MENU_" + Date.now();

chrome.runtime.onInstalled.addListener(function() {
  notSet = "Not set yet";
  chrome.storage.sync.get({site: notSet}, function(data) {
    chrome.storage.sync.set({site: "Jira", url: "https://jira.deskera.com/browse/", pattern: "\\w+-\\d+"}, function() {
      console.log("Default values have been set");
    });
  });
});

chrome.storage.sync.get( null, function(items){
  target = items["site"];
  targetUrl = items["url"];
  selectionMatchingPattern = new RegExp(items["pattern"], "g");
});

function contextMenuHandler(info,tab) {
  if (info.menuItemId !== CONTEXT_MENU_ID) {
    return;
  }
  console.log(info.selectionText + " was clicked.");
  chrome.tabs.create({  
    url: targetUrl + info.selectionText
  });
}
console.log("CONTEXT_MENU_ID: " + CONTEXT_MENU_ID);

var cmid;
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.request === 'updateContextMenu') {
    if (msg.selection.match(selectionMatchingPattern)) {
      var options = {
        title: "Open \"%s\" in " + target,
        contexts: ['selection']
      };
      if (cmid != null) {
        chrome.contextMenus.update(CONTEXT_MENU_ID, options);
      } else {
        options.id = CONTEXT_MENU_ID;
        chrome.contextMenus.create(options);
        cmid = CONTEXT_MENU_ID;
      }
    } else {
      if (cmid != null) {
        chrome.contextMenus.remove(cmid);
        cmid = null;
      }
    }
  }
});
chrome.contextMenus.onClicked.addListener(contextMenuHandler);
