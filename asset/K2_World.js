     k2RegisterModule("K2_World ",function () {
	


//_________________________________________
	var K2World = classExtend(k2Factories.K2Loader, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		k2Factories.K2Loader.prototype.initObject.apply(this, arguments);
		
		this.userinput = new K2UserInput();
	},
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Loader.prototype.resetObject.apply(this, arguments);
		
		this.name_ = 'world';
		this.world = this;
		
		this.currentInstances = 0;
		this.unlinkedObjParams_ = [];
		
		this.canvas_ = null;
		this.webgl = null;
		this.p2p = null;
		this.scene_ = null;
		
//		this.disposeContextKey_ = new K2KeyBoardKey(k2KEYBOARD.GRAVE_ACCENT);
	},
//_________________________________________
	step: function(t, c, b) {
		
//		if (!this.isReady()) 
//			return;
		
//		if (this.userinput.mouseWheel) 
//			this.log_('wheel: '+this.userinput.mouseWheel,4);
			
		// record mouse delta		
		this.userinput.updateDragDelta();
		
		// check for canvas resize
		if (this.webgl.isCanvasResized())
			this.webgl.doResize(this.scene_.cameraStep);
		
//		// key to disable context
//		if (this.disposeContextKey_.isPressed()){
//			this.log_('force context dispose!');
//			this.webgl.dispose();
//		}

		for (var i=this.children_.length-1; i>=0; --i){
			this.children_[i].step(t, null, null);
		}
		
		// reset wheel
		this.userinput.mouseWheel = 0;
	},
//_________________________________________
	render: function(t, ts){
		
//		if (!this.isReady()) return;

		if (this.scene_==null) return;
		this.scene_.renderScene(this.webgl, t, ts, null);
	},
//_________________________________________
    popDependant: function() {
		
		if (--this.dependancies_>0) return;
		 
		// we are ready!  build webgl objects
		this.initialiseScene_();
	},
//_________________________________________
	initialiseScene_: function() {
		
		// make sure we have a scene
		if (this.scene_==null){
			this.log_('No Scene loaded.', 1);
			return;
		}
		
		// re-link any remaing xml pararmeters
		this.setUnLinkedObjParams();
		
		// start keyboard and mouse
		this.userinput.start(this.canvas_);

		// create webgl object		
		if (this.webgl==null)
			this.webgl = this.makeWebGL_();
		if (this.webgl==null){
			this.log_('Could not create WebGL.', 1);
			return;
		}
		
		// create webgl context
		this.webgl.create3DContext(this.canvas_);
		
		// send event that k2 is ready
		this.canvas_.trigger('k2Ready');
		
		//this.logLoadComplete();
		//this.log_('loaded in '+this.loop_.getTotalSeconds(),4);
	},
//_________________________________________
    makeWebGL_: function() {
		
		var webgl = this.makeObjectByClassAndName('K2WebGL', 'k2webgl');
		return webgl;
	},
//_________________________________________
    addUnLinkedObjParam: function(o, p, v) {
		
		this.unlinkedObjParams_.push({
			obj: o,
			param: p,
			value: v
		});
	},
//_________________________________________
    setUnLinkedObjParams: function() {
		
		var len = this.unlinkedObjParams_.length;
		if (len==0) return;
		
		var q,p;
		for (var i=0; i<len; ++i){
			q = this.unlinkedObjParams_[i];
			p = q.obj.findObjectProperty(q.param);
			p[q.param].apply(q.obj, [q.value]);
		}
		// remove these ones we linked
		this.unlinkedObjParams_.splice(0,len);
		
		// if there is any left, log an unlinked
		for (i=0; i<this.unlinkedObjParams_.length; ++i){
			q = this.unlinkedObjParams_[i];
			q.obj.log_('unlinked: '+q.param+'  value: '+q.value, 1);			
		}
	},
//_________________________________________
	loadWorld: function(url) {
		
		this.log_('hello world!',0);
		
		this.currentInstances = 1;
		
		if (jQuery.isXMLDoc(url)){
			this.makeObjectsFromXML(this, jQuery(url).find('k2'));
			return;
		}
		
		this.src_ = url;
		this.loadXML(k2WORLDPATH + url);
	},
//_________________________________________
	setCanvas: function(c) {
		
		this.canvas_ = c;
	},
//_________________________________________
	getCanvas: function() {
		
		return this.canvas_;
	},
//_________________________________________
	setScene: function(s) {
		
		this.scene_ = s;
	},
//_________________________________________
	getScene: function() {
		
		return this.scene_;
	},
//_________________________________________
	getGL: function() {
		
		return this.webgl.gl;
	},
//_________________________________________
	getCurrentInstanceID: function() {
		
    	var s = "00000" + this.currentInstances;
    	return s.substr(s.length-5);
	},
//_________________________________________
	getClassName: function() {return 'K2World';}});

	
	return {
		K2World: K2World
	};
});
