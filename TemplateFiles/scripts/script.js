//var creativeVersion = "1.0.0"; // format version code, please do not alter or remove this variable
//var creativeLastModified = "2015-10-29";

var expandButton;

function initializeCreative()
{
	expandButton = document.getElementById("expandButton");
	expandButton.addEventListener("click", handleExpandButtonClick);
}

function handleExpandButtonClick()
{
	//EB.clickthrough();
	EB._sendMessage("baseExpansionRequest", {});
}
