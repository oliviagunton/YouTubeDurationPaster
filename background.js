//YouTube Duration Paster
//background.js: scripts for non-persistent background page ((context menu functionality, interaction with clipboard)

function clickHandler(){
	alert("hello");
}

chrome.contextMenus.create({
    "title": "YouTube Duration Paster",
    "contexts": ["page", "selection"],
    "onclick" : clickHandler
});

