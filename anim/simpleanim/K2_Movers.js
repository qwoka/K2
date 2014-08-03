k2RegisterModule("K2_Movers",function () {
	
	
//_________________________________________
//		K2Mover
//_________________________________________
	var K2Mover = classExtend(k2Factories.K2Object, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		// super
		k2Factories.K2Object.prototype.initObject.apply(this, arguments);
		
		this.perFrame_ = false;	// false = attached to step,  true = attached to frame
	},
//_________________________________________
	setScene: function(s, x) {
		
		// super
		k2Factories.K2Object.prototype.setScene.apply(this, arguments);
		
		// are we top level mover ?
		if (this.parentX_==null) return;
		var r = this.loader_.findParentByClassName(this.parent_, 'K2Mover');
		if (r) return;
		
		// add mover to parentX
		if (this.perFrame_) this.parentX_.addMoverF(this); else this.parentX_.addMover(this);
	},
//_________________________________________
	getChildSortPriority: function() {
		
		return 1000;
	},
//_________________________________________
	step: function(t, c, b) {
		
	},
//_________________________________________
	stepMover: function(t, c, b) {
		
		// set children
		for (var i=this.children_.length-1; i>=0; --i){
			this.children_[i].stepMover(t, c, b);
		}
	},
//_________________________________________
	getDeltaTime: function(t) {
		
		return (this.perFrame_) ? t.delta_time : t.step_delta;
	},
//_________________________________________
	setPerFrame: function(s) {
		
		// set children
		this.perFrame_ = this.loader_.parseStringAsBool(s);
	},
//_________________________________________
	getClassName: function() {return 'K2Mover';}});	
	
	
	
//_________________________________________
//		K2KeyPress
//_________________________________________
	var K2KeyPress = classExtend(K2Mover, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		// super
		K2Mover.prototype.initObject.apply(this, arguments);
		
		this.key_ = null;
	},
//_________________________________________
	resetObject: function() {
		
		// super
		K2Mover.prototype.resetObject.apply(this, arguments);
		
		this.invert_ = false;
	},
//_________________________________________
	stepMover: function(t, c, b) {
		
		//var keyboard = this.loader_.world.keyboard;
		if (this.isActive()){
			// set children
			K2Mover.prototype.stepMover.apply(this, arguments);
		}
//		if (this.key_.isPressed())
//			this.log_('key press');
	},
//_________________________________________
    isActive: function () {
		
		var k = this.key_.isDown();
		return ((k)?!this.invert_:this.invert_);
	},
//_________________________________________
    setKey: function (s) {
		
		this.key_ = new K2KeyBoardKey(k2KEYBOARD[s]);
	},
//_________________________________________
    setInvert: function (s) {
		
		this.invert_ = this.parseStringAsBool(s);
	},
//_________________________________________
	getClassName: function() {return 'K2KeyPress';}});
		


//_________________________________________
//		K2NodeRotator
//_________________________________________
	var K2NodeRotator = classExtend(K2Mover, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		// super
		K2Mover.prototype.initObject.apply(this, arguments);
		
		this.axisangle_ = [0,1,0,0];
	},
//_________________________________________
	resetObject: function() {
		
		// super
		K2Mover.prototype.resetObject.apply(this, arguments);
		
		vec3.set(K2YAXIS, this.axisangle_);
		
		this.speed_ = 6;
		this.axisIndex_ = 2;
	},
//_________________________________________
	stepMover: function(t, c, b) {
		
		// compute rotation matrix
		//mat4.rotate(this.parentX_.getMatWorld(), td*this.speed_, k2YAXIS, this.parentX_.getMatWorld());
		//mat4.rotate(this.parentX_.xform_, td * this.speed_, this.axisangle_);
		
		this.applyMouseRotation_(t);
		//this.parentX_.markHasMoved(t);
		//quat4.multiplyVec3(K2TEMPQUAT4, this.parentX_.transform.xformLocal.pos);
		
		//this.parentX_.transform.xformLocal.matDirty = true;

		// apply transform to parent node
		//mat4.multiply(this.parentX_.getMatWorld(), this.matRotation_, this.parentX_.getMatWorld());
		
		// super
		K2Mover.prototype.stepMover.apply(this, arguments);
	},
//_________________________________________
    applyMouseRotation_: function (t) {
		
		var q = this.parentX_.transform.xformLocal.quat;
	
		this.axisangle_[3] = this.getDeltaTime(t) * this.speed_;
		quat4.fromAxisAngle(this.axisangle_, K2TEMPQUAT4);
		
		quat4.multiply(K2TEMPQUAT4, q, q);
	},
//_________________________________________
    setAxis: function (s) {
		
		this.axisIndex_ = parseInt(s);
		vec3.set(K2ZERO, this.axisangle_);
		this.axisangle_[this.axisIndex_] = 1.0;
	},
//_________________________________________
    setSpeed: function (s) {
		
		this.speed_ = parseFloat(s);
    },
//_________________________________________
	getClassName: function() {return 'K2NodeRotator';}});




//_________________________________________
//		K2NodeTranslator
//_________________________________________
	var K2NodeTranslator = classExtend(K2NodeRotator, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		// super
		K2NodeRotator.prototype.initObject.apply(this, arguments);
		
//		this.heading_ = vec3.create();
	},
//_________________________________________
	resetObject: function() {
		
		// super
		K2NodeRotator.prototype.resetObject.apply(this, arguments);
		
		this.speed_ = 6;
//		this.axisIndex_ = 2;
//		vec3.set([0,0,1], this.heading_);
	},
//_________________________________________
	stepMover: function(t, c, b) {
		
//		var s = t.step_delta * this.speed_;
//		
//		// is ctrl doen ?
//		if (this.loader_.world.userinput.isDown(k2KEYBOARD.CTRL))
//		//if (k2KEYSTATE[k2KEYBOARD.CTRL])
//			s *= 0.5;
		
		this.applyTranslation_(this.getDeltaTime(t) * this.speed_, this.parentX_);
		//this.parentX_.markHasMoved(t);
		
//		vec3.scale(this.heading_, s, K2TEMPVEC3);
//		vec3.add(this.parentX_.transform.xformLocal.pos, K2TEMPVEC3);
				
		// super
		K2Mover.prototype.stepMover.apply(this, arguments);
	},
//_________________________________________
    applyTranslation_: function (dt, c) {
		
		var x = c.transform.xformLocal;
		x.dirty();
		//var q = x.quat;
		var p = x.pos;
		var d = (this.axisIndex_<0) ? -1 : 1;
		var tv3 = K2TEMPVEC3;
		
		// is ctrl down ?
		if (this.loader_.world.userinput.isDown(k2KEYBOARD.CTRL))
			dt *= 0.5;
		
		// get camera axis
		//quat4.multiplyVec3(q, K2ZAXIS, tv3);
		vec3.getAxis(c.getWorldMat(), Math.abs(this.axisIndex_)-1, tv3);
		
		vec3.scale(tv3, d * dt);

		// move target
		vec3.add(p, tv3);
	},
//_________________________________________
    setAxis: function (s) {
		
		this.axisIndex_ = parseInt(s);
//		vec3.set(K2ZERO, this.axisangle_);
//		this.axisangle_[this.axisIndex_] = 1.0;
	},
//_________________________________________
	getClassName: function() {return 'K2NodeTranslator';}});


//_________________________________________
//		K2MouseWheelTranslator
//_________________________________________
	var K2MouseWheelTranslator = classExtend(K2NodeTranslator, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		// super
		K2NodeTranslator.prototype.initObject.apply(this, arguments);
	},
//_________________________________________
	resetObject: function() {
		
		// super
		K2NodeTranslator.prototype.resetObject.apply(this, arguments);
		
		this.speed_ = 6;
		//vec3.set([0,0,1], this.heading_);
	},
//_________________________________________
	stepMover: function(t, c, b) {
		
		var w = this.loader_.world.userinput.mouseWheel;
		if (w!=0){
			this.applyWheelTranslation_(this.getDeltaTime(t) * this.speed_, w, this.parentX_);
			//this.parentX_.markHasMoved(t);
		}
		
		// super
		K2Mover.prototype.stepMover.apply(this, arguments);
	},
//_________________________________________
    applyWheelTranslation_: function (dt, w, c) {
		
		var x = c.transform.xformLocal;
		x.dirty();
		//var q = x.quat;
		var p = x.pos;
		
		var d = (w<0) ? 1 : -1;
		var tv3 = K2TEMPVEC3;
		
		// is ctrl down ?
		if (this.loader_.world.userinput.isDown(k2KEYBOARD.CTRL))
			dt *= 0.5;
		
		// get camera heading
		//quat4.multiplyVec3(q, K2ZAXIS, tv3);
		vec3.getAxisZ(c.getWorldMat(), tv3);

		// move target
		vec3.scale(tv3, dt * w * w * d);
		vec3.add(p, tv3);
	},
//_________________________________________
	getClassName: function() {return 'K2MouseWheelTranslator';}});



//_________________________________________
//		K2MouseLook
//_________________________________________
	var K2MouseLook = classExtend(K2Mover, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		// super
		K2Mover.prototype.initObject.apply(this, arguments);
		
		this.axisxangle_ = [0,1,0,0];
		this.axisyangle_ = [1,0,0,0];
	},
//_________________________________________
	resetObject: function() {
		
		// super
		K2Mover.prototype.resetObject.apply(this, arguments);
		
		this.speedx_ = 6;
		this.speedy_ = 6;
	},
//_________________________________________
	stepMover: function(t, c, b) {
				
		var ui = this.loader_.world.userinput;
		
		// is ctrl doen ?
		if (ui.mouseDown){
			var deltatime = this.getDeltaTime(t);
			var deltax = deltatime * ui.getMouseDragX();
			var deltay = deltatime * ui.getMouseDragY();
			this.applyMouseRotation_(deltax, deltay);
			//this.parentX_.markHasMoved(t);
		}
		
		// super
		K2Mover.prototype.stepMover.apply(this, arguments);
	},
//_________________________________________
    applyMouseRotation_: function (dx, dy) {
		
		var q = this.parentX_.transform.xformLocal.quat;
	
		this.axisyangle_[3] = this.speedy_  * dy;
		quat4.fromAxisAngle(this.axisyangle_, K2TEMPQUAT4);
		quat4.multiply(K2TEMPQUAT4, q, q);

		this.axisxangle_[3] = this.speedx_  * dx;
		quat4.fromAxisAngle(this.axisxangle_, K2TEMPQUAT4);
		quat4.multiply(q, K2TEMPQUAT4, q);
	},
//_________________________________________
    setSpeedX: function (s) {
		
		this.speedx_ = parseFloat(s);
    },
//_________________________________________
    setSpeedY: function (s) {
		
		this.speedy_ = parseFloat(s);
    },
//_________________________________________
	getClassName: function() {return 'K2MouseLook';}});



//_________________________________________
//		K2RayProbe
//_________________________________________
	var K2RayProbe = classExtend(K2Mover, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		// super
		K2Mover.prototype.initObject.apply(this, arguments);
		
		this.ray_ = new K2Ray();
		this.normal = vec3.create();
	},
//_________________________________________
	resetObject: function() {
		
		// super
		K2Mover.prototype.resetObject.apply(this, arguments);
		
		this.ray_.resetObject();
		vec3.set(K2ZERO, this.normal);
		this.face = 0;
		this.room = null;
	},
//_________________________________________
	stepMover: function(t, c, b) {
		
		this.collideRayAndSetDepth_(c, this.parentX_);
		
		// super
		K2Mover.prototype.stepMover.apply(this, arguments);
	},
//_________________________________________
	collideRayAndSetDepth_: function(c, pl) {
		
		var r = this.ray_;	
		
		// get ray from camera pos and z look	
		r.makeNewRequestFromWorldMat(c.getWorldMat(), 0, null);
		
		// intersect ray
		this.scene.sceneIntersectRay(c, r);
		var rr = r.getIntersectResult();
		if (!rr.hit) {
//			p[2] = -8;
//			this.face = -1;
//			vec3.set(K2ZERO, this.normal);
			return;
		}
		

		
		//console.log('ray collide: ' + rr.f);		
		//this.normal = rr.n;
		//vec3.set(rr.n, this.normal);
		
		//p[2] = rr.t0;
		
		//quat4.lookAt(this.normal, K2YAXIS, q);
		//quat4.fromAxisV3Angle(rr.n, 180, q);
		//quat4.normalize(q);
		
		//r.getPointOnRay(rr.t0, p);
		
		//vec3.getEulerAnglesFromMat(m, this.normal);	
		this.setCollisionPointAndOrientation_(r, rr, pl);
	},
//_________________________________________
	setCollisionPointAndOrientation_: function(r, rr, pl) {
		
		var x = pl.parentX_.transform.xformLocal;
		x.dirty();
		
		//var pn = vec3.create();
		r.getPointOnRay(rr.t1, x.pos);
		
//		var pn = vec3.create();
//		vec3.add(rr.n, p, pn);
//		
//		var m = mat4.create();
//		mat4.lookAt(p, pn, K2YAXIS, m);
//		vec3.getEulerAnglesFromMat(m, this.normal);	
		if (this.face == rr.f && this.room == rr.room) 
			return;

		this.face = rr.f;
		this.room = rr.room;
		vec3.set(rr.n, this.normal);
		
		x = pl.transform.xformLocal;
		x.dirty();
		quat4.fromEuler(rr.nE, x.quat);

		

		//var ax = vec3.create();
		//vec3.getAxisX(m, ax);
		
		//var q = quat4.create();
		//quat4.fromAxisV3Angle(ax, 0.0, q);
		//quat4.inverse(q);
		
		//var r = quat4.create();
		//quat4.fromAxisV3Angle(K2YAXIS, 0.0, r);
	},
//_________________________________________
	getClassName: function() {return 'K2RayProbe';}});

		
	return {
		K2KeyPress: K2KeyPress,
		K2NodeRotator: K2NodeRotator,
		K2NodeTranslator: K2NodeTranslator,
		K2MouseWheelTranslator: K2MouseWheelTranslator,
		K2MouseLook: K2MouseLook,
		K2RayProbe: K2RayProbe
	};
});
