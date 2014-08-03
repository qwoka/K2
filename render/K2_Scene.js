k2RegisterModule("K2_Scene",function () {
	


//_________________________________________
	var K2Scene = classExtend(k2Factories.K2XCull, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2XCull.prototype.resetObject.apply(this, arguments);
		
		this.drawables_ = [];
		this.numDrawables = 0;
		this.doSort_ = true;
		this.doClear_ = false;
		
		this.cameraStep = null;
		this.cameraDraw = null;
		this.cameras_ = [];
		
		this.prevCamKey = new K2KeyBoardKey(k2KEYBOARD.COMMA);
		this.nextCamKey = new K2KeyBoardKey(k2KEYBOARD.PERIOD);
		this.useDrawCamKey = new K2KeyBoardKey(k2KEYBOARD.FORWARD_SLASH);
		this.useDrawCam = false;
		
		this.sunDir = vec3.create([1,-1,-0.3]);
		vec3.normalize(this.sunDir);
		
		this.objectsForFrameStep_ = [];
		
		this.collisionDetector = null;
	},
//_________________________________________
	step: function(t, c, b) {
		
		// set current camera
		if (this.prevCamKey.isPressed()) this.prevCamera();
		if (this.nextCamKey.isPressed()) this.nextCamera();
		if (this.useDrawCamKey.isPressed()) this.useDrawCam = !this.useDrawCam;
		if (c==null) c = this.cameraStep;
		
		// clear drawables list
		this.clearDrawables_();
		
		// step children
		//k2Factories.K2XCull.prototype.step.apply(this, arguments);
		for (var i=this.children_.length-1; i>=0; --i)
			this.children_[i].step(t, c, this.boundbox);
		
		// sort drawbles
		this.numDrawables = this.drawables_.length;
		if (this.doSort_) 
			this.sortDrawables_();
			
		return;
		
		// fade in
		var s = t.num_steps;
		if (s == 100) {
			this.loader_.world.canvas_.css('opacity', 1.0 );
			return;
		}
		if (s > 100) return;
		this.loader_.world.canvas_.css('opacity', (s/100) );
	},
//_________________________________________
	renderScene: function(webgl, t, ts, c) {
		
		var i;
		
		// are we ready ?
		if ( webgl.gl==null) return;
		
		// use default camera?
		if (c==null && this.useDrawCam) c = this.cameraDraw;
		if (c==null) c = this.cameraStep;
		
		// prepare camera matricies
		if (this.useDrawCam){
			for (i=this.cameras_.length-1; i>=0; --i){
				this.cameras_[i].drawStep(t);
			}
		} else {
			c.drawStep(t);
		}
		
		// render our objects
		for (i=this.objectsForFrameStep_-1; i>=0; --i){
			this.objectsForFrameStep_[i].drawStep(t, ts, c);
		}
		
		 // Clear the color as well as the depth buffer.
		if (this.doClear_)
			webgl.clear();    
		
		// render our objects
		for (i=this.numDrawables-1; i>=0; --i){
			this.drawables_[i].render(webgl, t, ts, c);
		}
	},
//_________________________________________
	addDrawable: function(d) {
		
		this.drawables_.push(d);
	},
//_________________________________________
	clearDrawables_: function() {
		
		this.drawables_.splice(0, this.drawables_.length);
	},
//_________________________________________
	sortDrawables_: function() {
		
		this.drawables_.sort(function(a,b){
			
			// sort by layer
			if (a.layer > b.layer) return -1;
			if (a.layer < b.layer) return  1;
			
			// equal
			return 0;
		});
	},
//_________________________________________
	getSceneFromParent: function() {
		
		return this;
	},
//_________________________________________
	fadeCanvasIn_: function(t) {
		
//		var overlay = jQuery('<div/>');
//		overlay.css({
//			opacity: 1.0,
//			'background-color': 'black',
//			width: '100%',
//			height: '100%',
//			position: 'absolute',
//			top: 0,
//			left: 0
//		});
		
		//this.loader_.world.canvas_.parent().append(overlay);
		
		var c = this.loader_.world.canvas_;
		c.css({opacity: 0.0});
		
		//var overlay = jQuery('#canvas-overlay');
		c.animate({
			opacity: 0.0
		}, 500, function() {
			c.animate({
				opacity: 1.0
			}, t*1000, function() {
			});
		});
  	},
//_________________________________________
	setParent: function(p) {
		
		k2Factories.K2XCull.prototype.setParent.apply(this, arguments);
		
		if (p == null){ 
			// remove to scene drawop list
			//this.setScene(null);
			//this.parent_ = p;
		} else {
			// register scene with world
			this.loader_.world.setScene(this);
		}
		
		this.fadeCanvasIn_(1.6);
	},
//_________________________________________
	addDrawStep: function(o) {
		
		var i = this.objectsForFrameStep_.indexOf(o);
		if (i>=0) return;
		this.objectsForFrameStep_.push(o);
	},
//_________________________________________
	removeDrawStep: function(o) {
		
		var i = this.objectsForFrameStep_.indexOf(o);
		if (i<0) return;
		this.objectsForFrameStep_.splice(i,1);
	},
//_________________________________________
	addCamera: function(c) {
		
		this.cameras_.push(c);
		if (this.cameraStep==null) 
			this.cameraStep = c;
		if (this.cameraDraw==null && c.isDrawCam) 
			this.cameraDraw = c;
	},
//_________________________________________
	removeCamera: function(c) {
		
		var i = this.cameras_.indexOf(c);
		if (i<0) return;
		this.cameras_.splice(i,1);
		if (this.cameraStep==c) 
			this.cameraStep = this.cameras_[0];
		if (this.cameraDraw==c) 
			this.cameraDraw = null;
	},
//_________________________________________
	prevCamera: function() {
		
		var i = this.cameras_.indexOf(this.cameraStep) - 1;
		if (i<0) i = this.cameras_.length-1;
		this.cameraStep = this.cameras_[i];
	},
//_________________________________________
	nextCamera: function() {
		
		var i = this.cameras_.indexOf(this.cameraStep) + 1;
		if (i>=this.cameras_.length) i = 0;
		this.cameraStep = this.cameras_[i];
	},
//_________________________________________
	getViewPortWidth: function() {
		
		return this.loader_.world.webgl.getViewPortWidth();
	},
//_________________________________________
	getViewPortHeight: function() {
		
		return this.loader_.world.webgl.getViewPortHeight();
	},
//_________________________________________
	sceneIntersectRay: function(o, r) {
		
		if (this.collisionDetector==null) return null;
		
		this.collisionDetector.sceneIntersectRay(o, r);
	},
//_________________________________________
	getClassName: function() {return 'K2Scene';}});



	
	return {
		K2Scene: K2Scene
	};
});
