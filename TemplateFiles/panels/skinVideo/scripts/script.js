var expansionDiv,closeButton,expandButton,clickthroughButton,videoContainer,staticImage,video,audioButton,controlButton,adId,fadeAnimation;


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

//function handleMessage(event){
// 	try{
// 		var obj = JSON.parse(event.data);
// 		//console.log("userPanel:" + obj.type);
// 		switch(obj.type ){
// 			case "PAGE_LOAD":
// 				if(typeof config == "object" && typeof EB == "object"){
// 					//EB._sendMessage("setInfo",{topGap:setup.topGap,publisherSetup:setup.publisherSetup});
// 				}
// 			break;
		
// 			case "infoAd":
// 					// var br_w = obj.data.browserWidth;
// 					// var br_h = obj.data.browserHeight;
// 			break;

// 			case "expansionRequest":
							
// 			break;
// 		}
				
// 	}catch(err){
		
// 	}
// }

function startAd(){
	EB._sendMessage("setInfo",{topGap:setup.topGap});
	if(setup.isStatic){
		initStaticBG();
	}else{
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
			checkAutoPlayFrequency() ? video.play() : staticImage.style.display = "block";;
		}
	}else{
		staticImage.style.display = "block";;
	}
	if(setup.autoExpand){
		if (setup.autoExpandFrequency>0) {
			checkAutoExpandFrequency()==true ? handleExpandButtonClick() : console.log("No_AutoExpansion");;
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
	EB._sendMessage("collapseRequest", {});
	expandButton.removeEventListener("click", handleExpandButtonClick);
	setTimeout(function(){
		expandButton.addEventListener("click", handleExpandButtonClick);
	},1000);
}
function handleExpandButtonClick()
{
	fadeIn(closeButton);
	fadeOut(expandButton);
	EB._sendMessage("expansionRequest",{});
	if (!setup.isStatic) {
		fadeOut(staticImage);
		video.play();
		controlButton.style.background = "url(images/pause.png)";
	}
	closeButton.removeEventListener("click", handleCloseButtonClick);
	setTimeout(function(){
		closeButton.addEventListener("click", handleCloseButtonClick);
	},1000);
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
	fadeIn(staticImage);
	if(setup.collapseOnVideoEnds){
		handleCloseButtonClick();
	}
}
function handleControlsButtonClick() {
	if(video.paused){
		fadeOut(staticImage);
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

//window.addEventListener("message", handleMessage , false);