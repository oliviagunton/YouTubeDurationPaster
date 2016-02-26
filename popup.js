// YouTube Duration Paster
// popup.js: scripts for browser bar popup

function clickHandler(id){
	if ( id == 'optionslink' ) {
    	alert("hello");
    	window.close();
    }
}

document.addEventListener('DOMContentLoaded', function (){
	document.getElementByID('optionslink').addEventListener('mouseup', function (ev){
		clickHandler(ev.target.id);
	});
});

//document.addEventListener('click', alert("Hello"), false);
//chrome.runtime.openOptionsPage()