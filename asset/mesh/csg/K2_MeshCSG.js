k2RegisterModule("K2_MeshCSG",function () {
	

//_________________________________________
//		K2CSGOp
//_________________________________________
	var K2CSGOp = classExtend(k2Factories.K2Drawable, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		k2Factories.K2XObject.prototype.initObject.apply(this, arguments);
		
		this.radiusV3 = vec3.create(K2ONEVEC3);
	},
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2XObject.prototype.resetObject.apply(this, arguments);
				
		// set to orange
		vec3.set([1.0, 0.5, 0.5], this.objectColor);
		
		// 
		vec3.set(K2ONEVEC3, this.radiusV3);
		
		this.csgop_ = null;
	},
//_________________________________________
	performCSG_: function() {
		
		// get children of type K2CSGOp
		var ops = this.loader_.getChildrenByClassName(this, 'K2CSGOp');
		
		// do it
		this.doCSG_();		
	},
//_________________________________________
	doCSG_: function(root) {
				
				
	},
////_________________________________________
//	step: function(t, c, b) {
//		
//		this.isCulled = this.parentX_.isCulled;
//		if (this.isCulled || !this.visible_) 
//			return;
//			
//		this.updateXform_();
//		
//		// add the drawable list
////		this.scene.addDrawable(this);
//		
////		this.boundbox.resetObject();
////		this.boundbox.mergeBox(this.indexBuffers_[0].getBoundBox());
//						
//		//k2Factories.K2XObject.prototype.step.apply(this, arguments);
//		for (var i=this.children_.length-1; i>=0; --i){
//			this.children_[i].step(t, c, b);
//		}
//		
////		if (b) b.mergeBox(this.boundbox);
//	},
////_________________________________________
//	updateXform_: function(t) {
//		
//		// set position from parent x bound box
//		var b = this.parentX_.boundbox;
//		var c = b.getCenter();
////		var wp = this.parentX_.getWorldPos();
//		var p = this.transform.xformWorld.pos;
//		var s = this.transform.xformWorld.scale;
//		var q = this.transform.xformWorld.quat;
////
////		vec3.subtract(c, wp, p);		
//////		
//////		// set scale from parent x bound box
//////		//b.getSize(K2TEMPVEC3);
//////		//vec3.multiply(this.transform.xformLocal.scale, K2TEMPVEC3);
////		b.getSize(s);
//////		//p[1] = 1.5/4;
//////		//vec3.multiply(this.transform.xformLocal.pos, this.transform.xformLocal.scale);
//////		//vec3.set(this.transform.xformLocal.scale, this.transform.xformLocal.pos);
////		vec3.divide(p, s);
//////		quat4.multiplyVec3(q, p);
////		quat4.inverse(q, K2TEMPQUAT4);
////		quat4.multiplyVec3(K2TEMPQUAT4, p);
//		
//		// do transform
//		this.transform.updateFromParent(this.parentX_.transform, t);
//		//vec3.set(wp, this.transform.xformWorld.pos);
//		//this.updateXform_(t);
//		
//		vec3.set(c, p);
//		quat4.multiplyVec3(q, p);
//		b.getSize(s);
////		vec3.negate(this.transform.xformWorld.pos);
//	},
////_________________________________________
//	makeBoundsViz_: function() {
//		
//		// we ARE the bounds object, so make sure we don't make anything
//	},
//_________________________________________
	setDimensions: function(s) {
				
		vec3.set(parseStringAsFloatArray(s), this.radiusV3);
	},
//_________________________________________
	getClassName: function() {return 'K2CSGOp';}});


//_________________________________________
//		K2CSGOpBox
//_________________________________________
	var K2CSGOpBox = classExtend(K2CSGOp, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		K2CSGOp.prototype.initObject.apply(this, arguments);
	},
//_________________________________________
	resetObject: function() {
		
		K2CSGOp.prototype.resetObject.apply(this, arguments);
				
		// set to orange
		vec3.set([1.0, 0.5, 0.5], this.objectColor);
		
		// 
		this.csgop_ = null;
		this.csgRadius = [1,1,1];
		this.csgCenter = [0,0,0];
	},
//_________________________________________
	doCSG_: function(root) {
		
		// make csg primative
		var c = CSG.cube({
			radius: this.csgRadius, 
			center: this.csgCenter
		});	
		
		// carve
		root.subtract(c);
		
	},
//_________________________________________
	setCSGRadius: function(s) {
		
		this.csgRadius = this.parseStringAsFloatArray(s);
	},
//_________________________________________
	setCSGCenter: function(s) {
		
		this.csgCenter = this.parseStringAsFloatArray(s);
	},
//_________________________________________
	getClassName: function() {return 'K2CSGOpBox';}});




//_________________________________________
//		K2DrawableCSG
//_________________________________________
	var K2DrawableCSG = classExtend(k2Factories.K2Drawable, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		k2Factories.K2Drawable.prototype.initObject.apply(this, arguments);
	},
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Drawable.prototype.resetObject.apply(this, arguments);
		
		this.makeBounds_ = false;
		this.doCulling = false;
		this.layer = 750;
		
		// set to orange
		vec3.set([1.0, 0.5, 0.5], this.objectColor);
		
		// 
	},
//_________________________________________
	setContext3D: function(gl) {
		
		this.performCSG_();
		this.initPassInstance_(gl);
	},
//_________________________________________
	performCSG_: function() {
		
		// get children of type K2CSGOp
		var ops = this.loader_.getChildrenByClassName(this, 'K2CSGOp');
		
		// make mesh
		this.mesh_ = this.loader_.makeObjectByClassAndName('K2Mesh', this.getName()+'_mesh');
	},
////_________________________________________
//	step: function(t, c, b) {
//		
//		this.isCulled = this.parentX_.isCulled;
//		if (this.isCulled || !this.visible_) 
//			return;
//			
//		this.updateXform_();
//		
//		// add the drawable list
////		this.scene.addDrawable(this);
//		
////		this.boundbox.resetObject();
////		this.boundbox.mergeBox(this.indexBuffers_[0].getBoundBox());
//						
//		//k2Factories.K2XObject.prototype.step.apply(this, arguments);
//		for (var i=this.children_.length-1; i>=0; --i){
//			this.children_[i].step(t, c, b);
//		}
//		
////		if (b) b.mergeBox(this.boundbox);
//	},
////_________________________________________
//	updateXform_: function(t) {
//		
//		// set position from parent x bound box
//		var b = this.parentX_.boundbox;
//		var c = b.getCenter();
////		var wp = this.parentX_.getWorldPos();
//		var p = this.transform.xformWorld.pos;
//		var s = this.transform.xformWorld.scale;
//		var q = this.transform.xformWorld.quat;
////
////		vec3.subtract(c, wp, p);		
//////		
//////		// set scale from parent x bound box
//////		//b.getSize(K2TEMPVEC3);
//////		//vec3.multiply(this.transform.xformLocal.scale, K2TEMPVEC3);
////		b.getSize(s);
//////		//p[1] = 1.5/4;
//////		//vec3.multiply(this.transform.xformLocal.pos, this.transform.xformLocal.scale);
//////		//vec3.set(this.transform.xformLocal.scale, this.transform.xformLocal.pos);
////		vec3.divide(p, s);
//////		quat4.multiplyVec3(q, p);
////		quat4.inverse(q, K2TEMPQUAT4);
////		quat4.multiplyVec3(K2TEMPQUAT4, p);
//		
//		// do transform
//		this.transform.updateFromParent(this.parentX_.transform, t);
//		//vec3.set(wp, this.transform.xformWorld.pos);
//		//this.updateXform_(t);
//		
//		vec3.set(c, p);
//		quat4.multiplyVec3(q, p);
//		b.getSize(s);
////		vec3.negate(this.transform.xformWorld.pos);
//	},
//_________________________________________
	makeBoundsViz_: function() {
		
		// we ARE the bounds object, so make sure we don't make anything
	},
//_________________________________________
	getClassName: function() {return 'K2DrawableCSG';}});


	
	return {
//		K2MeshBox: K2MeshBox,
		K2CSGOp: K2CSGOp,
		K2CSGOpBox: K2CSGOpBox,
		K2DrawableCSG: K2DrawableCSG
	};
});
