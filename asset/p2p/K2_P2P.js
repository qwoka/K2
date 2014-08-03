k2RegisterModule("K2_P2P",function () {
	
	
	
//_________________________________________
	var K2P2P = classExtend(k2Factories.K2Asset, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		k2Factories.K2Asset.prototype.initObject.apply(this, arguments);
	},
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Asset.prototype.resetObject.apply(this, arguments);
		
		// messages are stored in an object keyed by the target objects name.
		// each element is an array, containing buffered messages for that target object
        this.messages_ = {};
		
		// selector to place p2p swf control
		this.p2pswfselector_ = '#k2p2pswfcontainer';
		this.p2pswfcontainer = null;
	},
//_________________________________________
    constructP2PWatcherForObject: function(o) {
		
	},
//_________________________________________
    constructFlashP2PSWF: function() {
		
		// resolve the selector
		var swf = jQuery(this.p2pswfselector_);
		if (this.length==0) 
			return;
		
		// set up
		var useLater = jQuery.flash.create({
			
			swf: './../_swf/k2p2p.swf',
			
			height: 64,
			width: 64,
			
//			allowFullScreen: true,
//			wmode: 'transparent',

			attributes: {
				id: 'k2p2pswf'
			},
			
			flashvars: {
				ak2p2p_username: 'Jonathan',
				ak2p2p_appname: 'qwoka'
			}
		});	
		
		//make it
		swf.html(useLater);
		this.container = swf;
	},
//_________________________________________
    pushMessageFromFlash: function(m) {
		
		var msgs = this.messages_;
		
		// first message?
		if (!msgs[n])
			msgs[n] = [];
			
		// prevent buffer getting too long
		if (msgs.length>=40)
			msgs.splice(0, 20);
		
		//store the message
		msgs[n].push(m);
	},
//_________________________________________
	flushMessages: function(n) {
		
		this.messages_[n].splice(0, this.messages_[n].length);
    },
//_________________________________________
    getMessages: function(n) {
		
		return this.messages_[n];
    },
//_________________________________________
	setParent: function(p) {
		
		k2Factories.K2Asset.prototype.setParent.apply(this, arguments);
		
		if (p==null){ 
			// remove fron world
			if (this.loader_.world.p2p==this) 
				this.loader_.world.p2p = null;
		} else {
			// register with world
			p.loader_.world.p2p = this;
		}
	},
//_________________________________________
    setP2PSelector: function (s) {
		
		// store url
		this.p2pswfselector_ = s;
    },
	//_________________________________________
	getClassName: function() {return 'K2P2P';}});




	
	return {
		K2P2P: K2P2P,
	};
});
