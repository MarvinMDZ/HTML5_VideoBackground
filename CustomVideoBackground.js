
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
		// var widthW = isNaN(SELF.displayWindow.innerWidth) ? SELF.displayWindow.clientWidth : SELF.displayWindow.innerWidth;
		// var heightW = isNaN(SELF.displayWindow.innerHeight) ? SELF.displayWindow.clientHeight : SELF.displayWindow.innerHeight;
		var widthW = SELF.displayWindow.document.body.clientWidth;
		var heightW = isNaN(SELF.displayWindow.innerHeight) ? SELF.displayWindow.clientHeight : SELF.displayWindow.innerHeight;
		return {width: widthW, height: heightW};				
	},

	onMessageReceived: function(event) {
		try {
			var messageData = JSON.parse(event.data);
			console.log(messageData);
			switch(messageData.type){
				case "ebInitDone":
					//console.log("ebInitDone",messageData);
				break;
				case "ebDocumentLoaded":
					//console.log("ebInitDone",messageData);
				break;
				case "collapseRequest":
					console.log("collapseRequest",messageData);
					SELF.onCollapseRequested();
				break;
				case "expansionRequest":
					console.log("expansionRequest",messageData);
					SELF.onExpandRequested();
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
			SELF.eyeDiv = SELF.displayWindow.document.getElementById("eyeDiv");
			
			var transitionCSS = "#eyeDiv{position:relative!important;margin-top:150px!important;-webkit-transition: margin-top 1s ease-out;transition: margin-top 1s ease-out;}";
			SELF.insertStyle(transitionCSS);

			var pagefixCSS = "#pagina{position:relative!important;max-width:1024px;margin:0 auto;z-index:99999;}";
			SELF.insertStyle(pagefixCSS);
			
			//document.body.style.overflow = "hidden";
			//SELF.panelDiv.style.display = "none";
			var windowSize = SELF.getBrowserDimension();			
			var obj = {};
			obj.browserWidth = windowSize.width;
			obj.browserHeight = windowSize.height;
			obj.adId = SELF._adConfig.adId;
			SELF.sendMessageToCreative(	SELF.panelId, {type: "infoAd", data: obj});

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
			var obj = {};
			obj.browserWidth = windowSize.width;
			obj.browserHeight = windowSize.height;
			SELF.sendMessageToCreative(	SELF.panelId, {type: "infoAd", data: obj});

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

		var windowSize = SELF.getBrowserDimension();			
		//SELF.eyeDiv.style.marginTop = windowSize.height+"px!important";
		SELF.eyeDiv.style.setProperty("marginTop", windowSize.height+"px", "important");
		console.log("onExpandRequested",windowSize.height);
	},
	onCollapseRequested:function(){
		SELF.eyeDiv.style.marginTop = "150px!important";
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