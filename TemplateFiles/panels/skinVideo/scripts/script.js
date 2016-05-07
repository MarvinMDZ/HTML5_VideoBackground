var expansionDiv,closeButton,expandButton,clickthroughButton,videoContainer,staticImage,video,audioButton,controlButton,adId;


function initializeCreative()
{

	expansionDiv = document.getElementById("expansion");
	closeButton = document.getElementById("closeButton");
	expandButton = document.getElementById("expandButton");
	audioButton = document.getElementById("audioButton");
	controlButton = document.getElementById("controlButton");
	clickthroughButton = document.getElementById("clickthroughButton");
	staticImage = document.getElementById("staticImage");
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

    try{
		adId = EB._adConfig.adId;
	}catch(error){
		adId = "35572581";
	}
	var itemName = adId+"_setDate";
	localStorage.getItem(itemName,new Date());

    startAd();
    
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
					// var br_w = obj.data.browserWidth;
					// var br_h = obj.data.browserHeight;
			break;

			case "expansionRequest":
							
			break;
		}
				
	}catch(err){
		
	}
}

function startAd(){
	if(setup.isStatic){
		console.log("isStatic");
		initStaticBG();
	}else{
		console.log("isVideoBackground");
		initVideoBG();
	}
	fadeIn(expansionDiv);
}

function initStaticBG(){
	staticImage.style.display = "block";
	videoContainer.style.display = "none";	
}

function initVideoBG(){
	staticImage.style.display = "none";
	videoContainer.style.display = "block";
	showElements();
	if(setup.autoPlayVideo){
		if (setup.autoPlayFrequency>0) {
			checkAutoPlayFrequency() ? video.play() : video.load();
		}
		

	}else{
		video.load();
	}
	if(setup.autoExpand){
		if (setup.autoExpandFrequency>0) {
			checkAutoExpandFrequency()==true ? console.log("EXPAND") : console.log("NO_EXPAND");
		}
	}
}
function checkAutoPlayFrequency(){
	var itemName = adId+"_autoPlayExpansions";
	var remainigPlays = localStorage.getItem(itemName);
	if (remainigPlays > 0 || remainigPlays == null) {
		remainigPlays = remainigPlays == null ? setup.autoPlayFrequency -1 : remainigPlays-1;
		localStorage.setItem(itemName,remainigPlays);
		return true;
	}else{
		if (checkCookieDate()==true) {
			remainigPlays = setup.autoPlayFrequency -1;
			localStorage.setItem(itemName,remainigPlays);
			return true;
		}
		return false;
	}
}

function checkAutoExpandFrequency(){
	var itemName = adId+"_autoExpansions";
	var remainingExpansions = localStorage.getItem(itemName);
	if (remainingExpansions > 0 || remainingExpansions == null) {
		remainingExpansions = remainingExpansions == null ? setup.autoExpandFrequency -1 : remainingExpansions-1;
		localStorage.setItem(itemName,remainingExpansions);
		return true;
	}else{
		if (checkCookieDate()==true) {
			remainingExpansions = setup.autoExpandFrequency -1;
			localStorage.setItem(itemName,remainingExpansions);
			return true;
		}
		return false;
	}
	
}

function checkCookieDate(){
	var itemName = adId+"_setDate";
	var cookieDate = new Date(localStorage.getItem(itemName));
	var actualDate = new Date();
	var diff = (actualDate - cookieDate)/(1000*60*60*24);
	if (diff >= 1) {
		localStorage.setItem(itemName,actualDate);
		return true;
	}else{
		return false
	}
}
function handleCloseButtonClick()
{
	video.muted = true;
	fadeOut(closeButton);
	fadeIn(expandButton);
	//SEND MESSAGE TO CUSTOM SCRIPT
	EB._sendMessage("collapseRequest", {});
}
function handleExpandButtonClick()
{
	//SEND MESSAGE TO CUSTOM SCRIPT
	fadeIn(closeButton);
	fadeOut(expandButton);
	EB._sendMessage("expansionRequest", {topGap:setup.topGap});
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
	video.load();
}
function handleControlsButtonClick() {
	if(video.paused){
		video.play();
	}else{
		video.pause();
	}
}
function hideElements(){
	fadeOut(audioButton);
	fadeOut(controlButton);
}
function showElements(){
	fadeIn(audioButton);
	fadeIn(controlButton);
}
function pauseVideo(){
	if(video){
		video.pause();
	}
}
function fadeIn(elem){
	elem.style.display = "block";
    elem.classList.add("fade-in");
    setTimeout(function(){
    	elem.classList.remove("fade-in");
    },1000);
}
function fadeOut(elem){
 	elem.classList.add("fade-out");   
    setTimeout(function(){
    	elem.style.display = "none";
    	elem.classList.remove("fade-out");
    },1000);
}

window.addEventListener("message", handleMessage , false);