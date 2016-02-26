//YouTube Duration Paster
//background.js: scripts for non-persistent background page ((context menu functionality, interaction with clipboard)

function clickHandler(){
	alert("hello");
}

function setupContextMenu(){
	chrome.contextMenus.create({
    	"title": "Paste YouTube duration",
    	"id": "YDP",
    	"contexts": ["page", "selection"],
	});
}

//Set up context menu when extension is installed or updated
//http://stackoverflow.com/a/26246735
chrome.runtime.onInstalled.addListener(function(){
	setupContextMenu();
});

//Listen for clicks on our menu item
//https://developer.chrome.com/extensions/event_pages#best-practices
chrome.contextMenus.onClicked.addListener(function(info, tab){
	if(info.menuItemId === "YDP"){
		clickHandler();
	}
});

//Keyboard shortcut (default = Ctrl + /)
chrome.commands.onCommand.addListener(function(command){
	if (command == "paste_duration"){
		alert ("Command recognized");
	}
});
