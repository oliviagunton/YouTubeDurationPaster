//YouTube Duration Paster
//background.js: scripts for non-persistent background page ((context menu functionality, interaction with clipboard)

function pasteLink(){
	// Modified from http://stackoverflow.com/questions/2964678/jquery-youtube-url-validation-with-regex
	var ytregex = /^https?:\/\/(?:www\.)?youtube.com\/watch\?(?=.*v=\w+)(?:\S+)?$/;
	var text = getClipboardText();
	var URLmatch = text.match(ytregex);

	if(URLmatch){
		alert("Matched!");
	}else{
		alert("Please copy a valid YouTube video URL to the clipboard first.\nYou copied: " + text);
	}
	//alert(text);
}

function setupContextMenu(){
	chrome.contextMenus.create({
    	"title": "Paste with YouTube duration(s)",
    	"id": "YDP",
    	"contexts": ["page", "selection"],
	});
}

// getClipboardText - return any text that is currently on the clipboard
//http://stackoverflow.com/questions/28618766/get-current-text-from-clipboard-in-chrome-app
function getClipboardText() {
    // create div element for pasting into
    var pasteDiv = document.createElement("div");

    // place div outside the visible area
    pasteDiv.style.position = "absolute";
    pasteDiv.style.left = "-10000px";
    pasteDiv.style.top = "-10000px";

    // set contentEditable mode
    pasteDiv.contentEditable = true;

    // find a good place to add the div to the document
    var insertionElement = document.activeElement; // start with the currently active element
    var nodeName = insertionElement.nodeName.toLowerCase(); // get the element type
    while (nodeName !== "body" && nodeName !== "div" && nodeName !== "li" && nodeName !== "th" && nodeName !== "td") { // if have not reached an element that it is valid to insert a div into (stopping eventually with 'body' if no others are found first)
        insertionElement = insertionElement.parentNode; // go up the hierarchy
        nodeName = insertionElement.nodeName.toLowerCase(); // get the element type
    }

    // add element to document
    insertionElement.appendChild(pasteDiv);

    // paste the current clipboard text into the element
    pasteDiv.focus();
    document.execCommand('paste');

    // get the pasted text from the div
    var clipboardText = pasteDiv.innerText;

    // remove the temporary element
    insertionElement.removeChild(pasteDiv);

    // return the text
    return clipboardText;
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
		pasteLink();
	}
});