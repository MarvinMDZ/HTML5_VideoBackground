
/************************************************************************************************************
Script Name: CustomVideoBackground.js
Version Number: 1.0.0
Created: 2016-05-08
Modified: 2016-05-31
Author: Javier Egido Alonso | Sizmek Spain
Please do not change or remove this versioning information. In case you do need to modify this script, please 
save the script with a different name so it won't conflict with the naming convention of the original script.
************************************************************************************************************/

function CustomVideoBackground(adConfig) {

	this.displayWindow = EBG.adaptor.getDisplayWin();
	this.displayWindow.addEventListener("message", this.onMessageReceived, false);
	this.subscribeToAfterCreateAdEvent();
	this.subscribeToAfterExpandEvent();

	EBG.callSuperConstructor(CustomVideoBackground, this, [adConfig]);
}

CustomVideoBackground.prototype = {
	sendMessageToCreative: function(placeHolderId, msg) {
		try {
			var adFrame = EBG.adaptor.getDisplayWin().document.getElementById(placeHolderId).getElementsByTagName("iframe")[0];
			adFrame.contentWindow.postMessage(JSON.stringify(msg), "*");
		} catch(error) {
			console.log("ERROR:sendMessageToCreative",error);
		}
	},
	subscribeToAfterCreateAdEvent: function() {
		this.subscribeToEvent(EBG.Events.EventNames.CREATE_AD, EBG.Events.EventTiming.AFTER, function(event) {
			this.handleAfterCreateAd(event);
		});
	},
	subscribeToAfterExpandEvent: function() {
		this.subscribeToEvent(EBG.Events.EventNames.EXPAND, EBG.Events.EventTiming.AFTER, function(event) {
			this.handleAfterExpansion(event);
		});
	},
	subscribeToEvent: function(eventName, timing, callback) {
		var eventSubscription = new EBG.Events.EventSubscription(eventName, callback, this);
		eventSubscription.timing = timing;
		EBG.eventMgr.subscribeToEvent(eventSubscription);
	},	
	setStyle: function(elem, attrName, attrValue, all) {
		if (typeof attrName == "string") {
			elem.style[attrName] = attrValue;
			var stylePrefixes = ["webkit","moz","ms","o"];
			if (all) {
				var tmpDiv = document.createElement("div");
				attrName = attrName.substr(0, 1).toUpperCase() + attrName.substr(1, attrName.length);
				for (var i = 0; i < stylePrefixes.length; i++) {
					if(tmpDiv.style.hasOwnProperty(attrName)) {
						elem.style[stylePrefixes[i] + attrName] = attrValue;
					}
				}
			}
		} else if (typeof attrName === "object") {
			for (var prop in attrName) {
				elem.style[prop] = attrName[prop];
			}
		}
	},
	insertStyle: function(cssString) {
		var newStyles = SELF.displayWindow.document.createElement("style");
		newStyles.setAttribute("type", "text/css");
		newStyles.innerHTML = cssString;
		//SELF.displayWindow.document.getElementsByTagName("body")[0].appendChild(newStyles);
		(SELF.displayWindow.document.head||SELF.displayWindow.document.documentElement).appendChild(newStyles);
	},
	getBrowserDimension: function() {
		var widthW = SELF.displayWindow.document.body.clientWidth;
		var heightW = isNaN(SELF.displayWindow.innerHeight) ? SELF.displayWindow.clientHeight : SELF.displayWindow.innerHeight;
		return {width: widthW, height: heightW};				
	},
	onMessageReceived: function(event) {
		try {
			var messageData = JSON.parse(event.data);
			//console.log(messageData);
			switch(messageData.type){
				case "ebInitDone":
					//console.log("ebInitDone",messageData);
				break;
				case "ebDocumentLoaded":
					//console.log("ebInitDone",messageData);
				break;
				case "setInfo":
					SELF.marginTop = messageData.data.topGap;
				break;
				case "collapseRequest":
					SELF.onCollapseRequested();
					SELF.isExpanded = false;
				break;
				case "expansionRequest":
					SELF.onExpandRequested();
					SELF.isExpanded = true;
				break;
				case "baseExpansionRequest":
					try{
						SELF.panelFrm.contentWindow.postMessage(JSON.stringify({type: "baseExpansion", data: {}}), "*");
					}catch(error){
						console.log("Error: ",error);
					}
				break;
			}

		} catch(error) {

		}
	},
	handleAfterCreateAd: function(event) {
		SELF = this;
		SELF.adDiv = SELF.displayWindow.document.getElementById(SELF._adConfig.placeHolderId);
		SELF.adFrm = SELF.adDiv.getElementsByTagName("iframe")[0];
		SELF.hostDiv = SELF.adDiv.parentNode;
		SELF.isExpanded = false;
		
	   	SELF.displayWindow.addEventListener("resize", function() {
			SELF.onResize();
		}, false);
		SELF.displayWindow.addEventListener("orientationchange", function() {
			SELF.onResize();
		}, false);
		SELF.loadExternalJSON(function(response){
			var responseJSON = JSON.parse(response);
			var currentDomain = window.location.hostname;

			for (var i in responseJSON) {
				if (currentDomain == responseJSON[i]["pubDomain"]) {
					SELF.publisherSetup = responseJSON[i]["pubFix"];
				}
			}
			SELF.insertStyle(SELF.publisherSetup);
			
		},"http://services.serving-sys.com/custprojassets/prd/features/feeds/1643/publishersSetup.json");
	},
	handleAfterExpansion: function(event) {
		try{
			SELF.panelDiv = SELF.displayWindow.document.getElementById(event.dispatcher.props.panel.id);
			SELF.panelFrm = SELF.displayWindow.document.getElementById(event.dispatcher.iframeId);
			SELF.panelId = event.dispatcher.props.panel.id;
			//SELF.eyeDiv = SELF.displayWindow.document.getElementById("eyeDiv");

			//var transitionCSS = "#eyeDiv{position:relative!important;margin-top:"+SELF.marginTop+"px!important;-webkit-transition: margin-top 1s ease-out;transition: margin-top 1s ease-out;} #"+event.dispatcher.props.panel.id+"{top:0!important;left:0!important}";
			//var transitionCSS = "#pushDiv{position:relative!important;margin-top:"+SELF.marginTop+"px!important;-webkit-transition: margin-top 1s ease-out;transition: margin-top 1s ease-out;} #"+event.dispatcher.props.panel.id+"{top:0!important;left:0!important;}";

			var transitionCSS = "#"+event.dispatcher.props.panel.id+"{top:0!important;left:0!important;}";
			SELF.insertStyle(transitionCSS);
			
			var auxElement = document.createElement("div");
			auxElement.id = "pushDiv";
			//SELF.pushDiv = auxElement;
			SELF.displayWindow.document.body.insertBefore(auxElement,SELF.displayWindow.document.body.firstChild);

			SELF.pushDiv = SELF.displayWindow.document.getElementById("pushDiv");

			var windowSize = SELF.getBrowserDimension();

			SELF.setStyle(SELF.pushDiv, {
				position: "relative",
				marginTop: SELF.marginTop+"px",
				webkitTransition: "margin-top 1s ease-out",
				transition: "margin-top 1s ease-out;"
			});

			SELF.setStyle(SELF.panelFrm, {
				position: "fixed",
				top:EBG.px(0),
				left: EBG.px(0),
				width: EBG.px(windowSize.width),
				height: EBG.px(windowSize.height),
				fontSize: "0px",
				whiteSpace: "nowrap",
				visibility: "visible"
			});
			SELF.setStyle(SELF.panelDiv, {
				position: "fixed",
				top:EBG.px(0),
				left: EBG.px(0),
				width: EBG.px(windowSize.width),
				height: EBG.px(windowSize.height),
				fontSize: "0px",
				whiteSpace: "nowrap",
				visibility: "visible"
			});
		}catch(error){
			console.log("ERROR: After Expansion",error);
		}
	},
	onResize:function(){
		setTimeout(function(){
			var windowSize = SELF.getBrowserDimension();
			if (SELF.isExpanded == true ) {
				SELF.setMarginTop(windowSize.height);	
			}			
			SELF.setStyle(SELF.panelFrm, {
				position: "fixed",
				top:EBG.px(0),
				left: EBG.px(0),
				width: EBG.px(windowSize.width),
				height: EBG.px(windowSize.height),
				fontSize: "0px",
				whiteSpace: "nowrap",
				visibility: "visible"
			});
			SELF.setStyle(SELF.panelDiv, {
				position: "fixed",
				top:EBG.px(0),
				left: EBG.px(0),
				width: EBG.px(windowSize.width),
				height: EBG.px(windowSize.height),
				fontSize: "0px",
				whiteSpace: "nowrap",
				visibility: "visible"
			});
		}, 50);
	},
	onExpandRequested:function(){			
		SELF.setMarginTop(SELF.getBrowserDimension().height);
	},
	onCollapseRequested:function(){
		SELF.setMarginTop(SELF.marginTop);
	},
	setMarginTop:function(marginTop){
		SELF.pushDiv.style.setProperty("margin-top", marginTop+"px", "important");
	},
	loadExternalJSON:function (callback,pathToFile) { 
	    var xobj = new XMLHttpRequest();
	    xobj.overrideMimeType("application/json");
	    xobj.open('GET', pathToFile, true);
	    xobj.onreadystatechange = function () {
	          if (xobj.readyState == 4 && xobj.status == "200") {
	            callback(xobj.responseText);
	          }
	    };
	    xobj.send(null);  
	 }
}

function CustomVideoBackgroundHook(adConfig) {
	if (adConfig.templateName === EBG.adTypes.ExpBannerHtml5) {
		var eventSub = new EBG.Events.EventSubscription(EBG.Events.EventNames.CREATE_AD, function(event) {
			EBG.declareClass(CustomVideoBackground, event.eventData.currentClass);
			event.eventData.currentClass = CustomVideoBackground;
		});
		eventSub.timing = EBG.Events.EventTiming.BEFORE;
		eventSub.dispatcherFilters = {"_adConfig.rnd": adConfig.rnd};
		EBG.eventMgr.subscribeToEvent(eventSub);
	}
}

ebO.extensionHooks.push(CustomVideoBackgroundHook);