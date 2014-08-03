k2RegisterModule("K2_MeshBox",function () {
	
    // box
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    //
	
//_________________________________________
//		K2MeshBox
//_________________________________________
	var K2MeshBox = classExtend(k2Factories.K2Mesh, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Mesh.prototype.resetObject.apply(this, arguments);
		
		this.boxVerts_ = [
           0.5, 0.5, 0.5,  -0.5, 0.5, 0.5,  -0.5,-0.5, 0.5,   0.5,-0.5, 0.5,    // v0-v1-v2-v3 front
           0.5, 0.5, 0.5,   0.5,-0.5, 0.5,   0.5,-0.5,-0.5,   0.5, 0.5,-0.5,    // v0-v3-v4-v5 right
           0.5, 0.5, 0.5,   0.5, 0.5,-0.5,  -0.5, 0.5,-0.5,  -0.5, 0.5, 0.5,    // v0-v5-v6-v1 top
          -0.5, 0.5, 0.5,  -0.5, 0.5,-0.5,  -0.5,-0.5,-0.5,  -0.5,-0.5, 0.5,    // v1-v6-v7-v2 left
          -0.5,-0.5,-0.5,   0.5,-0.5,-0.5,   0.5,-0.5, 0.5,  -0.5,-0.5, 0.5,    // v7-v4-v3-v2 bottom
           0.5,-0.5,-0.5,  -0.5,-0.5,-0.5,  -0.5, 0.5,-0.5,   0.5, 0.5,-0.5     // v4-v7-v6-v5 back
        ];
		this.boxNormals_ = [
			 0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,     // v0-v1-v2-v3 front
			 1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,     // v0-v3-v4-v5 right
			 0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,     // v0-v5-v6-v1 top
			-1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,     // v1-v6-v7-v2 left
			 0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0,     // v7-v4-v3-v2 bottom
			 0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1      // v4-v7-v6-v5 back
		];	
		this.texCoords_ = [
           1, 1,   0, 1,   0, 0,   1, 0,    // v0-v1-v2-v3 front
           0, 1,   0, 0,   1, 0,   1, 1,    // v0-v3-v4-v5 right
           1, 0,   1, 1,   0, 1,   0, 0,    // v0-v5-v6-v1 top
           1, 1,   0, 1,   0, 0,   1, 0,    // v1-v6-v7-v2 left
           0, 0,   1, 0,   1, 1,   0, 1,    // v7-v4-v3-v2 bottom
           0, 0,   1, 0,   1, 1,   0, 1     // v4-v7-v6-v5 back
        ];
		this.boxFaceColors = [  
			[1.0,  1.0,  1.0,  1.0],    // Front face: white  
			[1.0,  0.0,  0.0,  1.0],    // Back face: red  
			[0.0,  1.0,  0.0,  1.0],    // Top face: green  
			[0.0,  0.0,  1.0,  1.0],    // Bottom face: blue  
			[1.0,  1.0,  0.0,  1.0],    // Right face: yellow  
			[1.0,  0.0,  1.0,  1.0]     // Left face: purple  
		];  	
		this.indicies_ = [
           0, 1, 2,   0, 2, 3,    // front
           4, 5, 6,   4, 6, 7,    // right
           8, 9,10,   8,10,11,    // top
          12,13,14,  12,14,15,    // left
          16,17,18,  16,18,19,    // bottom
          20,21,22,  20,22,23     // back
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
				m.buffer_ = this.boxVerts_;
				this.addChild(m);
			break;
			case 'Normal':
				m = this.loader_.makeObjectByClass('K2MeshBufferFloat');
				m.semantics_ = 'Normal';
				m.elementSize = 3;
				m.buffer_ = this.boxNormals_;
				this.addChild(m);
			break;
			case 'UV':
				m = this.loader_.makeObjectByClass('K2MeshBufferFloat');
				m.semantics_ = 'UV';
				m.elementSize = 2;
				m.buffer_ = this.texCoords_;
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
		m.buffer_ = this.indicies_;
		this.addChild(m);
		this.meshIndexBuffers_.push(m);
		
		return this.meshIndexBuffers_;
	},
//_________________________________________
	getClassName: function() {return 'K2MeshBox';}});



//_________________________________________
//		K2MeshBoxWire
//_________________________________________
	var K2MeshBoxWire = classExtend(K2MeshBox, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2MeshBox.prototype.resetObject.apply(this, arguments);
		
		this.indicieswire_ = [
           	 0, 1,  1, 2,  2, 3,  3, 0,    // front
           	 4, 5,  5, 6,  6, 7,  7, 4,    // right
           	 8, 9,  9,10, 10,11, 11, 8,    // top
          	12,13, 13,14, 14,15, 15,12,    // left
          	16,17, 17,18, 18,19, 19,16,    // bottom
          	20,21, 21,22, 22,23, 23,20     // back
        ];
	},
//_________________________________________
	getIndexBuffers: function() {
		
		if (this.meshIndexBuffers_.length>0) return this.meshIndexBuffers_;
		
		var m = this.loader_.makeObjectByClass('K2MeshBufferIndex');
		m.semantics_ = 'LINES';
		m.elementSize = 2;
		m.primativeType = 'LINES';
		m.buffer_ = this.indicieswire_;
		this.addChild(m);
		this.meshIndexBuffers_.push(m);
		
		return this.meshIndexBuffers_;
	},
//_________________________________________
	getClassName: function() {return 'K2MeshBoxWire';}});



//_________________________________________
//		K2BBoxVis
//_________________________________________
	var K2BBoxVis = classExtend(k2Factories.K2Drawable, function(){
		
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
		this.layer = 850;
		
		// set to orange
		vec3.set([1.0, 0.5, 0.5], this.objectColor);
		
		// lock rotation so it remains axis aligned
		this.transform.xformWorldF.quatLock = true;
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
//_________________________________________
	updateXform_: function(t) {
		
		// set position from parent x bound box
		var b = this.parentX_.boundbox;
		var c = b.getCenter();
//		var wp = this.parentX_.getWorldPos();
		var p = this.transform.xformWorld.pos;
		var s = this.transform.xformWorld.scale;
		var q = this.transform.xformWorld.quat;
//
//		vec3.subtract(c, wp, p);		
////		
////		// set scale from parent x bound box
////		//b.getSize(K2TEMPVEC3);
////		//vec3.multiply(this.transform.xformLocal.scale, K2TEMPVEC3);
//		b.getSize(s);
////		//p[1] = 1.5/4;
////		//vec3.multiply(this.transform.xformLocal.pos, this.transform.xformLocal.scale);
////		//vec3.set(this.transform.xformLocal.scale, this.transform.xformLocal.pos);
//		vec3.divide(p, s);
////		quat4.multiplyVec3(q, p);
//		quat4.inverse(q, K2TEMPQUAT4);
//		quat4.multiplyVec3(K2TEMPQUAT4, p);
		
		// do transform
		this.transform.updateFromParent(this.parentX_.transform, t.timer.system_seconds);
		//vec3.set(wp, this.transform.xformWorld.pos);
		//this.updateXform_(t);
		
		vec3.set(c, p);
		quat4.multiplyVec3(q, p);
		b.getSize(s);
//		vec3.negate(this.transform.xformWorld.pos);
	},
//_________________________________________
	makeBoundsViz_: function() {
		
		// we ARE the bounds object, so make sure we don't make anything
	},
//_________________________________________
	getClassName: function() {return 'K2BBoxVis';}});


	
	return {
		K2MeshBox: K2MeshBox,
		K2MeshBoxWire: K2MeshBoxWire,
		K2BBoxVis: K2BBoxVis
	};
});
