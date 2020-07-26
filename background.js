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
chrome.contextMenus.create({
  title: "Open \"%s\" in Jira", 
  contexts:["selection"],
  id: CONTEXT_MENU_ID
});
chrome.contextMenus.onClicked.addListener(getword);