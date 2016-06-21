//Fix para eltiempo.com, añade la clase takeover al body

setTimeout(function(){
	
	var eventSubscription = new EBG.Events.EventSubscription(EBG.Events.EventNames.EXPAND, function(event){
		EBG.adaptor.getDisplayWin().document.body.className = "takeover";
	}, this);
	eventSubscription.timing = EBG.Events.EventTiming.AFTER;
	EBG.eventMgr.subscribeToEvent(eventSubscription);

},300);