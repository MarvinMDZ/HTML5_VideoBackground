var expansionDiv,closeButton,expandButton,clickthroughButton,videoContainer,staticImage,video,audioButton,controlButton,adId,fadeAnimation;
var userAgent = window.navigator.userAgent.toLowerCase(), ios = /iphone|ipod|ipad/.test( userAgent );

function initializeCreative()
{
	expansionDiv = document.getElementById("expansion");
	videoContainer = document.getElementById("videoContainer");
	closeButton = document.getElementById("closeButton");
	expandButton = document.getElementById("expandButton");
	
	clickthroughButton = document.getElementById("clickthroughButton");
	staticImage = document.getElementById("staticImage");

	closeButton.addEventListener("click", handleCloseButtonClick);
	expandButton.addEventListener("click", handleExpandButtonClick);
	clickthroughButton.addEventListener("click", handleClickthroughButtonClick);

    try{
		adId = EB._adConfig.adId;
	}catch(error){
		adId = "LocalTest";
	}

	var itemName = adId+"_setDate";
	if (localStorage.getItem(itemName) === null) {
		localStorage.setItem(itemName,new Date());
	}

    startAd();
}


function startAd(){
	try{EB._sendMessage("setInfo",{topGap:setup.topGap});}catch(err){}
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

	var source = document.createElement('source');

	audioButton = document.getElementById("audioButton");
	controlButton = document.getElementById("controlButton");
	video = document.getElementById("video");

	var videoTrackingModule = new EBG.VideoModule(video);

	controlButton.addEventListener("click", handleControlsButtonClick);
	
	video.addEventListener('play',setControlImage);
    video.addEventListener('pause',setControlImage);
    video.addEventListener('ended',onVideoEnd);
    video.addEventListener('volumechange',setAudioImage);

    setAudioImage();
    setControlImage();

	source.setAttribute('src', 'videos/video.mp4');
	video.appendChild(source);

	if(ios){
		audioButton.style.display = "none";
	}else{
		audioButton.addEventListener("click", handleAudioButtonClick);	
	}

	staticImage.style.display = "none";
	videoContainer.style.display = "block";
	showElements();
	if(setup.autoPlayVideo && setup.autoPlayFrequency>0 && checkAutoPlayFrequency() === true){
		video.play();
		setControlImage();
	}else{
		staticImage.style.display = "block";
	}
	if(setup.autoExpand){
		if (setup.autoExpandFrequency>0 && checkAutoExpandFrequency()===true ) {
			setTimeout(function(){handleExpandButtonClick();},2500);
		}
	}
}
function checkAutoPlayFrequency(){
	var itemName = adId+"_autoPlayExpansions";
	var remainigPlays = localStorage.getItem(itemName);
	if (remainigPlays > 0 || remainigPlays === null) {
		remainigPlays = remainigPlays === null ? setup.autoPlayFrequency -1 : remainigPlays-1;
		localStorage.setItem(itemName,remainigPlays);
		return true;
	}else{
		if (checkCookieDate()===true) {
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
	if (remainingExpansions > 0 || remainingExpansions === null) {
		remainingExpansions = remainingExpansions === null ? setup.autoExpandFrequency -1 : remainingExpansions-1;
		localStorage.setItem(itemName,remainingExpansions);
		return true;
	}else{
		if (checkCookieDate()===true) {
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
		return false;
	}
}
function handleCloseButtonClick()
{
	EB.userActionCounter("Collapsed");
	fadeOut(closeButton);
	fadeIn(expandButton);
	if (setup.muteOnCollapse && !setup.isStatic) {
		video.muted = true;
	}
	if (setup.pauseOnCollapse && !setup.isStatic) {
		video.pause();
	}
	try{EB._sendMessage("collapseRequest",{});}catch(err){}

	expandButton.removeEventListener("click", handleExpandButtonClick);
	setTimeout(function(){
		expandButton.addEventListener("click", handleExpandButtonClick);
	},1000);
}
function handleExpandButtonClick()
{
	EB.userActionCounter("Expanded");
	fadeIn(closeButton);
	fadeOut(expandButton);
	try{EB._sendMessage("expansionRequest",{});}catch(err){}

	closeButton.removeEventListener("click", handleCloseButtonClick);
	setTimeout(function(){
		if (!setup.isStatic) {
			fadeOut(staticImage);
			if (setup.restartVideoOnExpand) {
				video.currentTime = 0;
			}
			video.play();
			if (setup.unmuteOnExpand) {
				video.muted = false;
			}
			setControlImage();
		}
		closeButton.addEventListener("click", handleCloseButtonClick);
	},1000);
}

function handleClickthroughButtonClick()
{
	if(!setup.isStatic){pauseVideo()};
	EB.clickthrough();
}

function handleAudioButtonClick() {
	video.muted = !video.muted;
}

function setAudioImage(){
	if(video.muted){
		audioButton.style.backgroundImage = "url(images/audioOff.png)";
	}else{
		audioButton.style.backgroundImage = "url(images/audioOn.png)";
	}
}
function setControlImage(){
	if(video.paused){
		controlButton.style.backgroundImage = "url(images/play.png)";
	}else{
		controlButton.style.backgroundImage = "url(images/pause.png)";
		fadeOut(staticImage);
	}
}

function onVideoEnd(){
	controlButton.style.backgroundImage = "url(images/replay.png)";
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
	setControlImage();
}
function hideElements(){
	if(!ios){
		fadeOut(audioButton);
	}
	fadeOut(controlButton);
}
function showElements(){
	if(!ios){
		fadeIn(audioButton);
	}
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

window.addEventListener("message", function(event){
	try{
		var obj = JSON.parse(event.data);
		switch(obj.type){
			case "baseExpansion":
				handleExpandButtonClick();
			break;
		}
				
	}catch(err){
		console.log("Error Panel: ", err);
	}
}, false);