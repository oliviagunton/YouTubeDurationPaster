'use strict';

//YouTube Duration Paster
//background.js: scripts for non-persistent background page ((context menu functionality, interaction with clipboard)

// Adapted from "YouTube video length" extension (utils.js)
// https://chrome.google.com/webstore/detail/youtube-video-length/lfkbfhglojdeoebdkpmgmphplhanchff
function IS08601DurationToSeconds(duration) {
	var seconds = duration.match(/(\d*)S/);
	seconds = parseInt(seconds ? (parseInt(seconds[1]) ? seconds[1] : 0) : 0);

	var minutes = duration.match(/(\d*)M/);
	minutes = parseInt(minutes ? (parseInt(minutes[1]) ? minutes[1] : 0) : 0);

	var hours = duration.match(/(\d*)H/);
	hours = parseInt(hours ? (parseInt(hours[1]) ? hours[1] : 0) : 0);

	var totalSeconds = 
		(hours * 60 * 60) +
		(minutes * 60) +
		seconds;

	return totalSeconds;
}

//Source: https://gist.github.com/srsudar/e9a41228f06f32f272a2
function sendPasteToContentScript(toBePasted) {
    // We first need to find the active tab and window and then send the data
    // along. This is based on:
    // https://developer.chrome.com/extensions/messaging
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {data: toBePasted});
        //alert(tabs[0].id);
    });
}

//Adapted from http://www.html5rocks.com/en/tutorials/es6/promises/
function getVideoInfo(videoID) {
	var apiKey = "AIzaSyCZQn2nvBk0XOBZtfLsKx7KjiEATuqlhK8";

	var apiURL = "https://www.googleapis.com/youtube/v3/videos"
	+ "?part=contentDetails,snippet"
	+ "&fields=items/contentDetails/duration,items/snippet/title"
	+ "&id=" + videoID
	+ "&key=" + apiKey;

  	return new Promise(function(resolve, reject) {

    	var req = new XMLHttpRequest();
    	req.open('GET', apiURL);

	    req.onload = function() {
	      if (req.status == 200) {
	        // Resolve the promise with the response text
	        resolve(req.response);
	      }
	      else {
	        // Otherwise reject with the status text
	        // which will hopefully be a meaningful error
	        reject(Error(req.statusText));
	      }
	    };

	    // Handle network errors
	    req.onerror = function() {
	      reject(Error("Network Error"));
	    };

	    // Make the request
	    req.send();
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

function pasteLink(){
	var clipboardtext = getClipboardText();

	// source: http://stackoverflow.com/questions/2964678/jquery-youtube-url-validation-with-regex
	var ytregex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
	
	var URLmatch = clipboardtext.match(ytregex);

	if(URLmatch){
		//alert(URLmatch[1]);

		var videoID = URLmatch[1];

		console.log(videoID);

		getVideoInfo(videoID).then(function(response) {
			  console.log("Success!", response);
			  sendPasteToContentScript("woohoo"); //TODO: parse JSON in response
			}, function(error) {
			  console.error("Failed!", error);
		});

	}else{
		alert("Please copy a valid YouTube video URL to the clipboard first.\n\nYou copied:\n" + clipboardtext);
	}

}

function setupContextMenu(){
	chrome.contextMenus.create({
    	"title": "Paste with YouTube duration(s)",
    	"id": "YDP",
    	"contexts": ["editable"],
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
		pasteLink();
	}
});