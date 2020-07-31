const CONTEXT_MENU_ID = "CUSTOM_CONTEXT_MENU_" + Date.now();
function getword(info,tab) {
  if (info.menuItemId !== CONTEXT_MENU_ID) {
    return;
  }
  console.log("Word " + info.selectionText + " was clicked.");
  chrome.tabs.create({  
    url: "https://jira.deskera.com/browse/" + info.selectionText
  });
}
console.log("CONTEXT_MENU_ID: " + CONTEXT_MENU_ID);

var cmid;
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.request === 'updateContextMenu') {
      if (msg.selection == '') {
          if (cmid != null) {
              chrome.contextMenus.remove(cmid);
              cmid = null;
          }
      } else {
          var options = {
              title: "Open \"%s\" in Jira",
              contexts: ['selection']
          };
          if (cmid != null) {
              chrome.contextMenus.update(CONTEXT_MENU_ID, options);
          } else {
              options.id = CONTEXT_MENU_ID;
              chrome.contextMenus.create(options);
              cmid = CONTEXT_MENU_ID;
          }
      }
  }
});
chrome.contextMenus.onClicked.addListener(getword);