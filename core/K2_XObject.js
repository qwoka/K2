k2RegisterModule("K2_XObject",function () {
	
	
//_________________________________________
	var K2XObject = classExtend(k2Factories.K2Object, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		k2Factories.K2Object.prototype.initObject.apply(this, arguments);
		
		this.matWorldView = mat4.create();
		this.matWorldViewProj = mat4.create();
		
		this.transform = new K2Transform();
		
		this.data_ = null;
//
//		this.boundbox = new K2BBox();
	},
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Object.prototype.resetObject.apply(this, arguments);
		
//		this.isCulled = false;
//		this.doCulling = false;
		this.makeBounds_ = false;
		
		mat4.identity(this.matWorldView);
		mat4.identity(this.matWorldViewProj);
		
		this.transform.resetObject();
		
		this.matWorld = this.transform.xformWorld.mat_;
		
//		this.boundbox.resetObject();
		
		this.lastMoveTime_ = -1.0;
		this.xformInterpolated_ = true;
		
		this.doDrawStep_ = false;
	},
//_________________________________________
	step: function(t, c, b) {
		
		//this.isCulled = this.parentX_.isCulled;
		
		// do movers
		for (var j=0; j<this.movers_.length; ++j)
			this.movers_[j].stepMover(t, c, b);
				
		this.updateXform_(t.timer.system_seconds);
		
		//k2Factories.K2Object.prototype.step.apply(this, arguments);
		for (var i=this.children_.length-1; i>=0; --i)
			this.children_[i].step(t, c, b);
	},
//_________________________________________
	drawStep: function(t, ts, c) {
		
		// do movers
		for (var j=0; j<this.moversF_.length; ++j)
			this.moversF_[j].stepMover(t, this, null);
	},
//_________________________________________
	updateXform_: function(t) {
					
		if (this.getXFormIntepolated()){
			// do transform
			this.transform.updateFromParent(this.parentX_.transform, t);
		} else {
			mat4.multiply(this.parentX_.getWorldMat(), this.getLocalMat(), this.getWorldMat());
			this.transform.xformWorld.clean();
		}
	},
//_________________________________________
	resolveXform: function(t) {
		/*
		called at initialisation to get world pos
		*/
		if (this.parentX_==null) return;
		
		this.parentX_.resolveXform(t);
		
		// do transform
		this.transform.updateFromParent(this.parentX_.transform, 0);
	},
////_________________________________________
//	expandBoundVolume: function(c) {
//		
//		// merge box
//		this.boundbox.mergeBox(c.boundbox);
//	},
//_________________________________________
	hasMoved: function(t) {
		
		return true;
	},
//_________________________________________
	markHasMoved: function(t) {
		
		this.lastMoveTime_ = t;
	},
//_________________________________________
	setScene: function(s, x) {
		
		this.parentX_ = x;
		this.scene = s;

		// go deep into tree to set scene
		for (var i=this.children_.length-1; i>=0; --i){
			this.children_[i].setScene(s,this);
		}
		
		if (this.doDrawStep_)
			this.scene.addDrawStep(this);
	},
//_________________________________________
	getSceneFromParent: function() {
	
		if (this.scene ) return this.scene ;
		return k2Factories.K2Object.prototype.getSceneFromParent.apply(this);
	},
//_________________________________________
	getXNodeFromParent: function() {
		
		return this;
	},
//_________________________________________
    getLocalMat: function() {
		
		return this.transform.getLocalMat();
    },
//_________________________________________
    getWorldPos: function() {
		
		return this.transform.getWorldPos();
    },
//_________________________________________
    getWorldMat: function() {
		
		return this.transform.getWorldMat();
    },
//_________________________________________
    getWorldMatF: function(u) {
		
		return this.transform.getWorldMatF(u);
    },
//_________________________________________
	setXFormPAAS: function(s) {
		
		this.transform.xformLocal.setPAAS(this.parseStringAsFloatArray(s));
	},
//_________________________________________
	setXFormP: function(s) {
		
		this.transform.xformLocal.setPRS(this.parseStringAsFloatArray(s));
	},
//_________________________________________
	setXFormPRS: function(s) {
		
		this.transform.xformLocal.setPRS(this.parseStringAsFloatArray(s));
	},
//_________________________________________
	setQuatLock: function(s) {
		
		this.transform.xformWorldF.quatLock = this.loader_.parseStringAsBool(s);
	},
//_________________________________________
	setXFormIntepolated: function(s) {
		
		this.xformInterpolated_ = this.loader_.parseStringAsBool(s);
	},
//_________________________________________
	getXFormIntepolated: function() {
		
		return this.xformInterpolated_;
	},
//_________________________________________
	setDrawStep: function(s) {
		
		this.doDrawStep_ = this.loader_.parseStringAsBool(s);
	},
//_________________________________________
	getDrawStep: function() {
		
		return this.doDrawStep_;
	},
////_________________________________________
//	setCull: function(s) {
//		
//		this.doCulling = this.loader_.parseStringAsBool(s);
//	},
//_________________________________________
	setMakeBounds: function(s) {
		
		this.makeBounds_ = this.parseStringAsBool(s);
	},
//_________________________________________
	setData: function(key, value) {
		
		if (!this.data_)
			this.data_ = {};
		this.data_[key] = value;
	},
//_________________________________________
	getData: function(key) {
		
		if (!this.data_)
			return null;
		return this.data_[key];
	},
//_________________________________________
	getClassName: function() {return 'K2XObject';}});

	
	
//_________________________________________
//		K2XCull
//_________________________________________
	var K2XCull = classExtend(K2XObject, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		K2XObject.prototype.initObject.apply(this, arguments);
		
		this.boundbox = new K2BBox();
	},
//_________________________________________
	resetObject: function() {
		
		K2XObject.prototype.resetObject.apply(this, arguments);
		
		this.isCulled = false;
		this.doCulling = false;
		
		this.boundbox.resetObject();
	},
//_________________________________________
	step: function(t, c, b) {

		this.updateXform_(t);
		
//		var old = this.isCulled;
//		if (this.doCulling) 
//			this.isCulled = this.doCull_(c);
		
//		if (this.isCulled!=old)
//			this.log_('culled: '+this.isCulled+' ['+t.num_steps+']', 2);

		//this.isCulled = this.parentX_.isCulled;
//		if (this.isCulled) 
//			return;

/*		if (!this.isCulled && old)
			this.transform.pushWorld(t);
*/
//		// remove me !!!
//		if (this.name_=='sphere01'){
//			var m = this.getWorldMat();
//			var p = this.getWorldPos();
//			this.log_('p: ');
//		}		

//		if (this.parentX_.isCulled){
//			if (b) 
//				b.mergeBox(this.boundbox);
//			return;		
//		}
	
		this.boundbox.resetObject();
		//this.boundbox.mergeBox(this.indexBuffers_[0].getBoundBox());
						
		//k2Factories.K2XObject.prototype.step.apply(this, arguments);
		for (var i=this.children_.length-1; i>=0; --i)
			this.children_[i].step(t, c, this.boundbox);
		
		if (this.doCulling) 
			this.isCulled = this.doCull_(c);
			
		if (b) 
			b.mergeBox(this.boundbox);
	},
//_________________________________________
	doCull_: function(c) {
		
		return c.isSphereCulled(this.boundbox.getCenter(), this.boundbox.getRadiusXZ() * 0.5);
	},
//_________________________________________
	setCull: function(s) {
		
		this.doCulling = this.loader_.parseStringAsBool(s);
	},
//_________________________________________
	getClassName: function() {return 'K2XCull';}});


		
	
//_________________________________________
	var K2TransformObject = classExtend(k2Factories.K2Object, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		k2Factories.K2Object.prototype.initObject.apply(this, arguments);
		
		this.worldPos = vec3.create();
		
		this.prevWorlds_ = [];
		for (var i=0; i<3; ++i)	this.prevWorlds_[i] = {
			t: 0,
			x: new K2XMat()
		};
	},
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Object.prototype.resetObject.apply(this, arguments);
		
		vec3.set(K2ZERO, this.worldPos);
	},
//_________________________________________
	step: function(t, c, b) {
		
		//this.isCulled = this.parentX_.isCulled;
		
		// do movers
		for (var j=0; j<this.movers_.length; ++j)
			this.movers_[j].stepMover(t, c, b);
				
		this.updateXform_(t.timer.system_seconds);
		
		//k2Factories.K2Object.prototype.step.apply(this, arguments);
		for (var i=this.children_.length-1; i>=0; --i)
			this.children_[i].step(t, c, b);
	},
//_________________________________________
	drawStep: function(t, ts, c) {
		
		// do movers
		for (var j=0; j<this.moversF_.length; ++j)
			this.moversF_[j].stepMover(t, this, null);
	},
//_________________________________________
	updateXform_: function(t) {
					
		if (this.getXFormIntepolated()){
			// do transform
			this.transform.updateFromParent(this.parentX_.transform, t);
		} else {
			mat4.multiply(this.parentX_.getWorldMat(), this.getLocalMat(), this.getWorldMat());
			this.transform.xformWorld.clean();
		}
	},
//_________________________________________
	resolveXform: function(t) {
		/*
		called at initialisation to get world pos
		*/
		if (this.parentX_==null) return;
		
		this.parentX_.resolveXform(t);
		
		// do transform
		this.transform.updateFromParent(this.parentX_.transform, 0);
	},
//_________________________________________
	updateFromParent: function(p, t) {
		
		this.pushWorld_(this.prevWorlds_, this.xformWorld, t);
		
		this.xformWorld.multiply(p.xformWorld, this.xformLocal);
	},
//_________________________________________
	getLocalMat: function() {
		
		return null;
	},
//_________________________________________
	getWorldMat: function() {
		
		return null;
	},
//_________________________________________
	getWorldPos: function() {
		
		return this.worldPos;
	},
//_________________________________________
	pushWorld_: function(a, w, t) {
		
		// push transform
		a[1].x.clone(a[2].x);
		a[0].x.clone(a[1].x);
		w.copy(a[0].x);
		
		// push current time
		a[2].t = a[1].t;
		a[1].t = a[0].t;
		a[0].t = t;
	},
//_________________________________________
	pushWorld: function(t) {
		
		this.pushWorld_(this.prevWorlds_, this.xformWorld, t.timer.system_seconds);
	},
//_________________________________________
	getWorldMatF: function(u) {
		
		// lerp between current step position, and next step position
		this.xformWorldF.lerp(this.prevWorlds_[0].x, this.xformWorld, u);
		
		return this.xformWorldF.getMat();
	},
//_________________________________________
	getClassName: function() {return 'K2TransformObject';}});


		
	
//_________________________________________
	var K2TransformPQS = classExtend(K2TransformObject, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		K2TransformObject.prototype.initObject.apply(this, arguments);
		
		this.xformLocal = new K2XMat();
		this.xformWorld = new K2XMat();
		this.xformWorldF = new K2XMat();
		
		this.worldPos = vec3.create();
		
		this.prevWorlds_ = [];
		for (var i=0; i<3; ++i)	this.prevWorlds_[i] = {
			t: 0,
			x: new K2XMat()
		};
	},
//_________________________________________
	resetObject: function() {
		
		K2TransformObject.prototype.resetObject.apply(this, arguments);
		
        this.addChildToFront_ = true;
		
		this.xformLocal.resetObject();
		this.xformWorld.resetObject();
		this.xformWorldF.resetObject();
		
		vec3.set(K2ZERO, this.worldPos);
	},
//_________________________________________
	addChild: function(c) {
		
		c.setParent(this);
		//this.children_.push(c);
		this.children_.unshift(c);
	},
//_________________________________________
	step: function(t, c, b) {
		
		//this.isCulled = this.parentX_.isCulled;
		
		// do movers
		for (var j=0; j<this.movers_.length; ++j)
			this.movers_[j].stepMover(t, c, b);
				
		this.updateXform_(t.timer.system_seconds);
		
		//k2Factories.K2Object.prototype.step.apply(this, arguments);
		for (var i=this.children_.length-1; i>=0; --i)
			this.children_[i].step(t, c, b);
	},
//_________________________________________
	drawStep: function(t, ts, c) {
		
		// do movers
		for (var j=0; j<this.moversF_.length; ++j)
			this.moversF_[j].stepMover(t, this, null);
	},
//_________________________________________
	updateXform_: function(t) {
					
		if (this.getXFormIntepolated()){
			// do transform
			this.transform.updateFromParent(this.parentX_.transform, t);
		} else {
			mat4.multiply(this.parentX_.getWorldMat(), this.getLocalMat(), this.getWorldMat());
			this.transform.xformWorld.clean();
		}
	},
//_________________________________________
	resolveXform: function(t) {
		/*
		called at initialisation to get world pos
		*/
		if (this.parentX_==null) return;
		
		this.parentX_.resolveXform(t);
		
		// do transform
		this.transform.updateFromParent(this.parentX_.transform, 0);
	},
//_________________________________________
	updateFromParent: function(p, t) {
		
		this.pushWorld_(this.prevWorlds_, this.xformWorld, t);
		
		this.xformWorld.multiply(p.xformWorld, this.xformLocal);
	},
//_________________________________________
	getLocalMat: function() {
		
		return this.xformLocal.getMat();
	},
//_________________________________________
	getWorldMat: function() {
		
		return this.xformWorld.getMat();
	},
//_________________________________________
	getWorldPos: function() {
		
		var m = this.xformWorld.getMat();
		vec3.getP(m, this.worldPos);
		return this.worldPos;
	},
//_________________________________________
	pushWorld_: function(a, w, t) {
		
		// push transform
		a[1].x.clone(a[2].x);
		a[0].x.clone(a[1].x);
		w.copy(a[0].x);
		
		// push current time
		a[2].t = a[1].t;
		a[1].t = a[0].t;
		a[0].t = t;
	},
//_________________________________________
	pushWorld: function(t) {
		
		this.pushWorld_(this.prevWorlds_, this.xformWorld, t.timer.system_seconds);
	},
//_________________________________________
	getWorldMatF: function(u) {
		
		// lerp between current step position, and next step position
		this.xformWorldF.lerp(this.prevWorlds_[0].x, this.xformWorld, u);
		
		return this.xformWorldF.getMat();
	},
//_________________________________________
	getClassName: function() {return 'K2TransformPQS';}});

			
	return {
		K2XObject: K2XObject,
		K2XCull: K2XCull,
		K2TransformObject: K2TransformObject,
		K2TransformPQS: K2TransformPQS
	};
});
