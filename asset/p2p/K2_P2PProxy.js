k2RegisterModule("K2_P2PProxy",function () {
	
	
	
//_________________________________________
	var K2P2Proxy = classExtend(k2Factories.K2Object, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		k2Factories.K2Object.prototype.initObject.apply(this, arguments);
	},
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Object.prototype.resetObject.apply(this, arguments);
		
		this.p2p_ = null;		
	},
//_________________________________________
	step: function(t, c, b) {
		
		// any messages?
		var n = this.name_;
		var msgs = this.p2p_.getMessages(n);
		if ((!(!msgs)) && (msgs.length>0)){
			this.applyMessages_(t, msgs);
			var m, length = msgs.length;
			for (var i=0; i<length; ++i){
				m = msgs[i];
				this.applyMessage_(t, m);
			}
			this.p2p_.flushMessages(n);
		}
		
		k2Factories.K2Object.prototype.step.apply(this, arguments);
	},
//_________________________________________
	applyMessage_: function(t, msg) {

				
	},
//_________________________________________
	setParent: function(p) {
		
		k2Factories.K2Object.prototype.setParent.apply(this, arguments);
		
		if (p==null){ 
			// remove fron world
				this.p2p_ = null;
		} else {
			// register with world
			this.p2p_ = this.loader_.world.p2p;
		}
	},
//_________________________________________
    setP2PSelector: function (s) {
		
		// store url
		this.this.p2pswfselector_ = s;
    },
	//_________________________________________
	getClassName: function() {return 'K2P2Proxy';}});




	
	return {
		K2P2Proxy: K2P2Proxy
	};
});
