"use strict";

var target;
var targetUrl;
var selectionMatchingPattern;
const CONTEXT_MENU_ID = "CUSTOM_CONTEXT_MENU_" + Date.now();

let defaultOptions = {
    site: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/",
    pattern: "*"
};

chrome.runtime.onInstalled.addListener(function() {
  let notSet = "Not set yet";
  chrome.storage.sync.get({site: notSet}, function(data) {
    if(data.site === notSet) {
      chrome.storage.sync.set(defaultOptions, function() {
        console.log("Default values have been set");
      });
    } else {
      loadOptions();
    }
  });
});

function loadOptions(){
  chrome.storage.sync.get( null, function(items){
    target = items["site"];
    targetUrl = items["url"];
    if(items["pattern"].match(/^\*+[*\w-\.]*$/)){
      selectionMatchingPattern = new RegExp("^" + items["pattern"].replace(/\./g, "\\.").replace(/\*/g, ".+") + "$");
    } else {
      selectionMatchingPattern = new RegExp("^" + items["pattern"] + "$");
    }
  });
  console.log("Options loaded");
}

chrome.storage.onChanged.addListener(function() {
    loadOptions();
});

function contextMenuHandler(info,tab) {
  if (info.menuItemId !== CONTEXT_MENU_ID) {
    return;
  }
  let searchStr = encodeURIComponent(info.selectionText);
  console.log(searchStr + " was clicked.");
  chrome.tabs.create({  
    url: (targetUrl.includes("{0}") ? targetUrl.replace(/\{0\}/g, searchStr) : targetUrl + searchStr)
  });
}
console.log("CONTEXT_MENU_ID: " + CONTEXT_MENU_ID);

let cmid;
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.request === 'updateContextMenu') {
    if (msg.selection.match(selectionMatchingPattern)) {
      let options = {
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
