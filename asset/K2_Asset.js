k2RegisterModule("K2_Asset",function () {
	
	

//_________________________________________
	var K2Asset = classExtend(k2Factories.K2Object, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Object.prototype.resetObject.apply(this, arguments);
		
		//this.isReady = false;
		this.src_ = null;
	},
//_________________________________________
	step: function(t, c, b) {
		
		// assets are not stepped
	},
//_________________________________________
	setParent: function(p) {
		
		if (p==null){ 
			// remove to scene drawop list
			this.parent_ = null;
		} else {
			// add from scene drawop list
			this.parent_ = p;
		}
	},
//_________________________________________
    setContext3DRequested: function(gl) {
		
		if (this.hasGLContext) return;
		this.setContext3DRequested_(gl);
 	},
//_________________________________________
    setContext3DRequested_: function(gl) {
		
 	},
//_________________________________________
    setPath: function (s) {
		
		this.src_ = s;
    },
//_________________________________________
    getSrcPath: function() {
		
		var a = this.src_.split('/');
		if (a.length<2) return '';
		a.pop();
		return a.join('/');
    },
//_________________________________________
	logLoadComplete: function() {
		
		this.log_('loaded: '+this.src_, 4);
	},
//_________________________________________
	getClassName: function() {return 'K2Asset';}});


	
	return {
		K2Asset: K2Asset
	};
});
