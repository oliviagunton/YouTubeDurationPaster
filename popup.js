function clickHandler(){
	alert("hello");
}

document.addEventListener('DOMContentLoaded', function(){
	document.getElementByID('optionslink').addEventListener('click', clickHandler);
});

//document.addEventListener('click', alert("Hello"), false);
//chrome.runtime.openOptionsPage()