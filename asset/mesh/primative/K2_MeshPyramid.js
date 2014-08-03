k2RegisterModule("K2_MeshBox",function () {
	
	
//_________________________________________
//		K2MeshPyramid
//_________________________________________
	var K2MeshPyramid = classExtend(k2Factories.K2Mesh, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Mesh.prototype.resetObject.apply(this, arguments);
		
		this.pyramidVerts_ = [
//			0.0,0,0.0,-0.5,-0.5,1.0,0.5,-0.5,1.0,0.0,0,0.0,0.5,-0.5,1.0,0.5,0.5,1.0,0.5,0.5,1.0,-0.5,0.5,1.0,-0.5,0.5,1.0,-0.5,-0.5,1.0,-0.5,-0.5,1.0,0.0,0.0,1.0,0.5,-0.5,1.0,0.5,0.5,1.0,-0.5,0.5,1.0
			0.0,0.0,0.0,-0.5,-0.5,-1.0,0.5,-0.5,-1.0,0.0,0.0,0.0,0.5,-0.5,-1.0,0.5,0.5,-1.0,0.5,0.5,-1.0,-0.5,0.5,-1.0,-0.5,0.5,-1.0,-0.5,-0.5,-1.0,-0.5,-0.5,-1.0,0.0,0.0,-1.0,0.5,-0.5,-1.0,0.5,0.5,-1.0,-0.5,0.5,-1.0        
		];
		this.pyramidNormals_ = [
			0.0,-0.752275,-0.376137,0.0,-1.02883,-0.514413,0.0,-1.02883,-0.514413,0.0,-0.752275,-0.376137,0.0,-1.02883,-0.514413,1.02883,0.0,-0.514413,1.02883,0.0,-0.514413,0.0,1.02883,-0.514413,0.0,1.02883,-0.514413,0.0,-1.02883,-0.514413,0.0,-1.02883,-0.514413,0.0,0.0,1.0,0.0,-1.02883,-0.514413,1.02883,0.0,-0.514413,0.0,1.02883,-0.514413
		];	
		this.pyramidUV_ = [
           	0.5,-1.0,0.0,0.0,1.0,0.0,0.5,-1.0,0.0,0.0,1.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,1.0,0.0,0.0,-1.0,0.5,-0.5,1.0,-1.0,1.0,0.0,0.0,0.0
        ];
		this.pyramidIndex_ = [
           	0,1,2,3,4,5,0,6,7,3,8,9,10,11,12,12,11,13,13,11,14,14,11,10
        ];
	},
//_________________________________________
	findMeshElementByShaderAttribute: function(lnkname, datatype) {
		
		var m = k2Factories.K2Mesh.prototype.findMeshElementByShaderAttribute.apply(this, arguments);
		if (m) return m;
		
		// can we make it?
		switch (lnkname){
			case 'Position':
				m = this.loader_.makeObjectByClass('K2MeshBufferFloat');
				m.semantics_ = 'Position';
				m.elementSize = 3;
				m.buffer_ = this.pyramidVerts_;
				this.addChild(m);
			break;
			case 'Normal':
				m = this.loader_.makeObjectByClass('K2MeshBufferFloat');
				m.semantics_ = 'Normal';
				m.elementSize = 3;
				m.buffer_ = this.pyramidNormals_;
				this.addChild(m);
			break;
			case 'UV':
				m = this.loader_.makeObjectByClass('K2MeshBufferFloat');
				m.semantics_ = 'UV';
				m.elementSize = 2;
				m.buffer_ = this.pyramidUV_;
				this.addChild(m);
			break;
		}
		
		return m;
	},
//_________________________________________
	getIndexBuffers: function() {
		
		if (this.meshIndexBuffers_.length>0) return this.meshIndexBuffers_;
		
		var m = this.loader_.makeObjectByClass('K2MeshBufferIndex');
		m.semantics_ = 'Index';
		m.elementSize = 3;
		m.buffer_ = this.pyramidIndex_;
		this.addChild(m);
		this.meshIndexBuffers_.push(m);
		
		return this.meshIndexBuffers_;
	},
//_________________________________________
	getClassName: function() {return 'K2MeshPyramid';}});



//_________________________________________
//		K2MeshPyramidWire
//_________________________________________
	var K2MeshPyramidWire = classExtend(K2MeshPyramid, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		K2MeshPyramid.prototype.resetObject.apply(this, arguments);
		
//		this.indicieswire_ = [
//           	 0, 1,  1, 2,  2, 3,  3, 0,    // front
//           	 4, 5,  5, 6,  6, 7,  7, 4,    // right
//           	 8, 9,  9,10, 10,11, 11, 8,    // top
//          	12,13, 13,14, 14,15, 15,12,    // left
//          	16,17, 17,18, 18,19, 19,16,    // bottom
//          	20,21, 21,22, 22,23, 23,20     // back
//        ];
	},
//_________________________________________
	getIndexBuffers: function() {
		
		if (this.meshIndexBuffers_.length>0) return this.meshIndexBuffers_;
		
		var m = this.loader_.makeObjectByClass('K2MeshBufferIndex');
		m.semantics_ = 'LINES';
		m.elementSize = 2;
		m.primativeType = 'LINES';
		m.buffer_ = this.pyramidIndex_;
		m.convertToLines();
		this.addChild(m);
		this.meshIndexBuffers_.push(m);
		
		return this.meshIndexBuffers_;
	},
//_________________________________________
	getClassName: function() {return 'K2MeshPyramidWire';}});



//_________________________________________
//		K2FrustumViz
//_________________________________________
	var K2FrustumViz = classExtend(k2Factories.K2Drawable, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		k2Factories.K2Drawable.prototype.initObject.apply(this, arguments);
	},
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Drawable.prototype.resetObject.apply(this, arguments);
		
		//this.transform.xformWorldF.quatLock = true;
		this.makeBounds_ = false;
		this.doCulling = false;
		
		// set to orange
		vec3.set([1.0, 0.5, 0.5], this.objectColor);
		
		//this.setEffect();
		
		this.layer = 850;
	},
////_________________________________________
//	step: function(t, c, b) {
//		
////		this.isCulled = this.parentX_.isCulled;
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
//	updateXform_: function() {
//		
//		// do transform
//		this.transform.updateFromParent(this.parentX_.transform);
//		
//		// set scale to match fov
//		var b = this.parentX_.boundbox;
//		b.getSize(K2TEMPVEC3);
//		vec3.multiply(this.transform.xformWorld.scale, K2TEMPVEC3);
//	},
//_________________________________________
	setContext3D: function(gl) {
		
		this.initPassInstance_(gl);
	},
//_________________________________________
	makeBoundsViz_: function() {
		
		// we ARE the bounds object, so make sure we don't make anything
	},
//_________________________________________
	getClassName: function() {return 'K2FrustumViz';}});



	
	return {
		K2MeshPyramid: K2MeshPyramid,
		K2MeshPyramidWire: K2MeshPyramidWire,
		K2FrustumViz: K2FrustumViz
	};
});
