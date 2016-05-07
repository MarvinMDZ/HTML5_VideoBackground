var expansionDiv,closeButton,expandButton,clickthroughButton,videoContainer,video,audioButton,controlButton;


function initializeCreative()
{

	expansionDiv = document.getElementById("expansion");
	closeButton = document.getElementById("closeButton");
	expandButton = document.getElementById("expandButton");
	audioButton = document.getElementById("audioButton");
	controlButton = document.getElementById("controlButton");
	clickthroughButton = document.getElementById("clickthroughButton");
	videoContainer = document.getElementById("videoContainer");
	video = document.getElementById("video");

	var videoTrackingModule = new EBG.VideoModule(video);

	closeButton.addEventListener("click", handleCloseButtonClick);
	expandButton.addEventListener("click", handleExpandButtonClick);
	clickthroughButton.addEventListener("click", handleClickthroughButtonClick);

	audioButton.addEventListener("click", handleAudioButtonClick);
	controlButton.addEventListener("click", handleControlsButtonClick);
	
	video.addEventListener('play',setControlImage);
    video.addEventListener('pause',setControlImage);
    video.addEventListener('ended',onVideoEnd);
    video.addEventListener('volumechange',setAudioImage);

    video.play();
}

function handleMessage(event){
	try{
		var obj = JSON.parse(event.data);
		//console.log("userPanel:" + obj.type);
		switch(obj.type ){
			case "PAGE_LOAD":
				if(typeof config == "object" && typeof EB == "object"){
					EB._sendMessage("setInfo", {});
				}
			break;
		
			case "infoAd":
					var br_w = obj.data.browserWidth;
					var br_h = obj.data.browserHeight;			
			break;

			case "expansionRequest":
							
			break;
		}
				
	}catch(err){
		
	}
}

function handleCloseButtonClick()
{
	pauseVideo();
	//SEND MESSAGE TO CUSTOM SCRIPT
	EB._sendMessage("collapseRequest", {});
}
function handleExpandButtonClick()
{
	//SEND MESSAGE TO CUSTOM SCRIPT
	EB._sendMessage("expansionRequest", {});
}

function handleClickthroughButtonClick()
{
	pauseVideo();
	EB.clickthrough();
}

function handleAudioButtonClick() {
	video.muted = !video.muted;
}

function setAudioImage(){
	if(video.muted){
		audioButton.style.background = "url(images/audioOff.png)";
	}else{
		audioButton.style.background = "url(images/audioOn.png)";
	}
}
function setControlImage(){
	if(video.paused){
		controlButton.style.background = "url(images/play.png)";
	}else{
		controlButton.style.background = "url(images/pause.png)";
	}
}

function onVideoEnd(){
	controlButton.style.background = "url(images/replay.png)";
}
function handleControlsButtonClick() {
	if(video.paused){
		video.play();
	}else{
		video.pause();
	}
}

function pauseVideo(){
	if(video){
		video.pause();
	}
}

window.addEventListener("message", handleMessage , false);