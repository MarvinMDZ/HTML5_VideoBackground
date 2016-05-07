
/************************************************************************************************************
Script Name: CustomVideoBackground.js
Version Number: 1.0.0
Created: 2015-07-27
Modified: 2015-07-27
Author: Javier Egido Alonso | Sizmek Spain
Based On: PL_ResponsivePushdown_CFV001.js
Please do not change or remove this versioning information. In case you do need to modify this script, please 
save the script with a different name so it won't conflict with the naming convention of the original script.
************************************************************************************************************/

function CustomVideoBackground(adConfig) {

	this.displayWindow = EBG.adaptor.getDisplayWin();
	this.displayWindow.addEventListener("message", this.onMessageReceived, false);
	this.subscribeToAfterCreateAdEvent();
	this.subscribeToAfterExpandEvent();
	this.subscribeToAfterCollapseEvent();
	this.requested = false;
	this.imageReady = false;
	this.isWaiting = false;
	this.isFirstLoad = true;

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
	subscribeToAfterCollapseEvent: function() {
		this.subscribeToEvent(EBG.Events.EventNames.COLLAPSE, EBG.Events.EventTiming.AFTER, function(event) {
			this.handleAfterCollapse(event);
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
		SELF.displayWindow.document.getElementsByTagName("body")[0].appendChild(newStyles);
	},
	getBrowserDimension: function() {
		return {width: isNaN(window.innerWidth) ? window.clientWidth : window.innerWidth, height: isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight};				
	},

	onMessageReceived: function(event) {
		try {
			var messageData = JSON.parse(event.data);
			console.log(messageData.type);
			switch(messageData.type){
				case "ebInitDone":
					//console.log("ebInitDone",messageData);
				break;
				case "ebDocumentLoaded":
					//console.log("ebInitDone",messageData);
				break;
				case "collapseRequest":
					console.log("collapseRequest",messageData);
				break;
				case "expansionRequest":
					console.log("expansionRequest",messageData);
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
		
	   	SELF.displayWindow.addEventListener("resize", function() {
			SELF.onResize();
		}, false);
		SELF.displayWindow.addEventListener("orientationchange", function() {
			SELF.onResize();
		}, false);
	},
	handleAfterExpansion: function(event) {
		try{

			SELF.panelDiv = SELF.displayWindow.document.getElementById(event.dispatcher.props.panel.id);
			SELF.panelFrm = SELF.displayWindow.document.getElementById(event.dispatcher.iframeId);
			SELF.panelId = event.dispatcher.props.panel.id;
			
			//document.body.style.overflow = "hidden";
			//SELF.panelDiv.style.display = "none";
			var windowSize = SELF.getBrowserDimension();
			// var winW = isNaN(window.innerWidth) ? window.clientWidth : window.innerWidth;
			// var winH = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
			
			var obj = {};
			obj.browserWidth = windowSize.width;
			obj.browserHeight = windowSize.height;
			SELF.sendMessageToCreative(	SELF.panelId, {type: "infoAd", data: obj});

			SELF.setStyle(SELF.panelFrm, {
				position: "absolute",
				top:EBG.px(0),
				left: EBG.px(0),
				width: EBG.px(windowSize.width),
				height: EBG.px(obj.browserHeight),
				fontSize: "0px",
				whiteSpace: "nowrap",
				visibility: "visible"
			});
			SELF.setStyle(SELF.panelDiv, {
				position: "absolute",
				top:EBG.px(0),
				left: EBG.px(0),
				width: EBG.px(windowSize.width),
				height: EBG.px(obj.browserHeight),
				fontSize: "0px",
				whiteSpace: "nowrap",
				visibility: "visible"
			});

		}catch(error){
			console.log("ERROR: After Expansion",error);
		}
	},
	handleAfterCreateAd: function(event) {
		SELF = this;
		SELF.adDiv = SELF.displayWindow.document.getElementById(SELF._adConfig.placeHolderId);
		SELF.adFrm = SELF.adDiv.getElementsByTagName("iframe")[0];
		SELF.hostDiv = SELF.adDiv.parentNode;
		
	   	SELF.displayWindow.addEventListener("resize", function() {
			SELF.onResize();
		}, false);
		SELF.displayWindow.addEventListener("orientationchange", function() {
			SELF.onResize();
		}, false);
	},
	onResize:function(){
		setTimeout(function(){
			var windowSize = SELF.getBrowserDimension();
			// var winW = isNaN(window.innerWidth) ? window.clientWidth : window.innerWidth;
			// var winH = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
			
			var obj = {};
			obj.browserWidth = windowSize.width;
			obj.browserHeight = windowSize.height;
			SELF.sendMessageToCreative(	SELF.panelId, {type: "infoAd", data: obj});

			SELF.setStyle(SELF.panelFrm, {
				position: "absolute",
				top:EBG.px(0),
				left: EBG.px(0),
				width: EBG.px(obj.browserWidth),
				height: EBG.px(obj.browserHeight),
				fontSize: "0px",
				whiteSpace: "nowrap",
				visibility: "visible"
			});
			SELF.setStyle(SELF.panelDiv, {
				position: "absolute",
				top:EBG.px(0),
				left: EBG.px(0),
				width: EBG.px(obj.browserWidth),
				height: EBG.px(obj.browserHeight),
				fontSize: "0px",
				whiteSpace: "nowrap",
				visibility: "visible"
			});
		}, 50);
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