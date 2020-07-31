const target = "Jira";
const targetUrl = "https://jira.deskera.com/browse/";
const selectionMatchingPattern = /\w+-\d+/g;

const CONTEXT_MENU_ID = "CUSTOM_CONTEXT_MENU_" + Date.now();

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
