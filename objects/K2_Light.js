k2RegisterModule("K2_Light",function () {
	

//_________________________________________
	var K2LightBase = classExtend(k2Factories.K2XObject, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		k2Factories.K2XObject.prototype.initObject.apply(this, arguments);
		
		this.direction = vec3.create();
	},
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2XObject.prototype.resetObject.apply(this, arguments);
		
		vec3.set(K2ZAXIS, this.direction);
	},
//_________________________________________
	step: function(t, c, b) {
		
		//mat4.multiply(this.parentX_.getMatWorld(), this.xform_, this.matWorld);
		this.updateXform_(t);
		
		// compute world matrix
		this.matWorld = this.getWorldMat();
		//mat4.decomposeOrientationToVectors(this.matWorld, this.vecWorldX, this.vecWorldY, this.vecWorldZ);
		
		// step children, compute world xform
		//k2Factories.K2XObject.prototype.step.apply(this, arguments);
		for (var i=this.children_.length-1; i>=0; --i){
			this.children_[i].step(t, c, b);
		}
	},
////_________________________________________
//	setParent: function(p) {
//		
//		k2Factories.K2XObject.prototype.setParent.apply(this, arguments);
//		
//		if (p == null){ 
//			// remove to scene drawop list
//			//this.setScene(null);
//			//this.parent_ = p;
//		} else {
//			// register scene with world
//			if (this.scene.camera == null) {
//				this.scene.camera = this;
//			}
//		}
//	},
//_________________________________________
	getClassName: function() {return 'K2LightBase';}});


//_________________________________________
	var K2LightDirectional = classExtend(K2LightBase, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		K2LightBase.prototype.resetObject.apply(this, arguments);
		
	},
//_________________________________________
	step: function(t, c, b) {
		
		//mat4.multiply(this.parentX_.getMatWorld(), this.xform_, this.matWorld);
		this.updateXform_(t);
		
		// compute world matrix
		//this.matWorld = this.getMatWorld();
		//mat4.decomposeOrientationToVectors(this.matWorld, this.vecWorldX, this.vecWorldY, this.vecWorldZ);
		
		// get camera heading
		vec3.getAxisZ(this.getWorldMat(), this.direction);		
		
		// step children, compute world xform
		//k2Factories.K2XObject.prototype.step.apply(this, arguments);
		for (var i=this.children_.length-1; i>=0; --i){
			this.children_[i].step(t, c, b);
		}
	},
////_________________________________________
//	setParent: function(p) {
//		
//		k2Factories.K2XObject.prototype.setParent.apply(this, arguments);
//		
//		if (p == null){ 
//			// remove to scene drawop list
//			//this.setScene(null);
//			//this.parent_ = p;
//		} else {
//			// register scene with world
//			if (this.scene.camera == null) {
//				this.scene.camera = this;
//			}
//		}
//	},
//_________________________________________
	getClassName: function() {return 'K2LightDirectional';}});

	

	
	return {
		K2LightDirectional: K2LightDirectional
	};
});
