k2RegisterModule("K2_Camera",function () {
	

//_________________________________________
	var K2Camera = classExtend(k2Factories.K2XObject, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		k2Factories.K2XObject.prototype.initObject.apply(this, arguments);
		
		this.matProj = mat4.create();
		this.matView = mat4.create();
		this.matViewProj = mat4.create();
		this.matFrustrum = mat4.create();
		
//		// make planes
		this.planes = {};
//		this.planes['NEAR'] = vec3.create(K2ZERO,4);
//		this.planes['FAR'] = vec3.create(K2ZERO,4);
//		this.planes['TOP'] = vec3.create(K2ZERO,4);
//		this.planes['BOTTOM'] = vec3.create(K2ZERO,4);
		this.planes['LEFT'] = vec4.create(K2ZEROVEC4);
		this.planes['RIGHT'] = vec4.create(K2ZEROVEC4);
//		this.planes = [];
//		for (var i=0; i<6; ++i){
//			this.planes.push(vec3.create(K2ZERO, 4));
//		}
	},
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2XObject.prototype.resetObject.apply(this, arguments);
		
		this.fov_ = 60.0;
		this.near_ = 0.1;
		this.far_ = 200.0;
		this.nearWidth_ = 0.0;
		this.nearHeight_ = 0.0;
		this.farWidth_ = 0.0;
		this.farHeight_ = 0.0;
		this.aspect_ = 1.0;
		this.tanhalffov_ = 0.0;
		this.isDrawCam = false;
		
		mat4.identity(this.matProj);
		mat4.identity(this.matView);
		mat4.identity(this.matViewProj);
		mat4.identity(this.matFrustrum);
		
//		this.makeBounds_ = true;
	},
//_________________________________________
	step: function(t, c, b) {
		
		// do movers
		for (var j=0; j<this.movers_.length; ++j)
			this.movers_[j].stepMover(t, this, null);
			
		this.updateXform_(t);
		
		if (c!=this && !this.isDrawCam)
			return;
		
		// compute world matrix
		//this.matWorld = this.getMatWorld();
		//mat4.decomposeOrientationToVectors(this.matWorld, this.vecWorldX, this.vecWorldY, this.vecWorldZ);
		
		// step children, compute world xform
		//k2Factories.K2XObject.prototype.step.apply(this, arguments);
		for (var i=this.children_.length-1; i>=0; --i){
			this.children_[i].step(t, c, b);
		}
		
//		var w = this.getMatWorld();
//		this.matWorld = w;
//
//		// compute view
//		var v = mat4.create();
//		mat4.inverse(w, v);
//		
//		// compute view-projection
//		var vp = mat4.create();
//		mat4.multiply(this.matProj, v, vp);
//
		// extract culling planes
//		this.extractPlanesGL(this.planes, this.getWorldPos(), this.matViewProj);
	},
//_________________________________________
	drawStep: function(t, ts, c) {
		
		// do movers
		for (var j=0; j<this.moversF_.length; ++j)
			this.moversF_[j].stepMover(t, this, null);
			
		//this.updateXform_(t);
		this.transform.updateFromParent(this.parentX_.transform, t);
		
		// get World
		//var w = this.getWorldMatF(t.fixedTimers[0].frame_u);
		var w = this.getWorldMat();
		this.matWorld = w;

		// compute view
		mat4.inverse(w, this.matView);
		
		// compute view-projection
		mat4.multiply(this.matProj, this.matView, this.matViewProj);
		
		// extract culling planes
//		this.extractPlanesGL(this.planes, w, this.matViewProj);
	},
//_________________________________________
	isSphereCulled: function(p, r) {

		var t = K2TEMPVEC4;
		
		// are we in the sphere ?
		vec3.subtract(this.getWorldPos(), p, t);
		if (vec3.dot(t,t)<=r*r)
			return false;
				
		// transform point to screen space
		vec3.set(p, t);
		t[3] = 1.0;
		mat4.multiplyVec4(this.matViewProj, t);
		
		// is it behind camera ?
		if (t[3]<0.0)
			return true;
		
		// divide by w
		vec3.scale(t, 1.0/t[3]);
		
		// convert object radius to screen space
		r *= this.tanhalffov_ / t[2];		
		
		// is outside screen ?
		if (t[0]-r >  1.0 ||
			t[0]+r < -1.0 ||
			t[1]-r >  1.0 ||
			t[1]+r < -1.0)		
			return true;
			
		// on screen
		return false;
	},
////_________________________________________
//	setParent: function(p) {
//		
//		k2Factories.K2XObject.prototype.setParent.apply(this, arguments);
//		
//		if (this.scene
//		
//		if (p == null){ 
//			// remove to scene drawop list
//			//this.setScene(null);
//			//this.parent_ = p;
//			this.scene.removeCamera(this);
//		} else {
//			// register camera with scene
//			this.scene.addCamera(this);
//		}
//	},
//_________________________________________
	setScene: function(s, x) {
		
		// super
		k2Factories.K2XObject.prototype.setScene.apply(this, arguments);
		
		this.scene.addCamera(this);
	},
//_________________________________________
	setContext3D: function(gl) {
		
		this.setProjection(this.scene.getViewPortWidth(), this.scene.getViewPortHeight());
	},
//_________________________________________
	setProjection: function(w, h) {
		
		// compute aspect
		this.aspect_ = w / h;
		
		// limit fov
		var fovy = (this.fov_ >= 180.0) ? 178.0: this.fov_;
		
		// set projection matrix
		mat4.perspective(fovy, this.aspect_, this.near_, this.far_, this.matProj);
		
		// set frustrum matrix
		mat4.frustum(-1,1, -1,1, this.near_, this.far_, this.matFrustrum);
		
		// compute tan fov
		this.tanhalffov_ = Math.tan(fovy * Math.PI / 360.0);
		
		// compute far plane width and height
		this.farWidth_ = 2.0 * this.tanhalffov_ * this.far_;
		this.farHeight_ = this.farWidth_ * this.aspect_;
		this.nearWidth_ = 2.0 * this.tanhalffov_ * this.near_;
		this.nearHeight_ = this.nearWidth_ * this.aspect_;
		
		// make bounding box visualizer
		if (this.makeBounds_)
			this.makeBoundsViz_();
	},
//_________________________________________
	makeBoundsViz_: function() {
		
		this.makeBounds_ = false;
		
		var p = this.loader_.makeObjectByClass('K2FrustumViz');
		
		p.setMaterial('matFrustumViz');
		p.setMesh('meshFrustumViz');
		p.setEffect('effectObjectColor');
		//p.layer = 850;

		this.addChild(p);
		
		vec3.set([this.farWidth_, this.farHeight_, this.far_], p.transform.xformLocal.scale);
	},
//_________________________________________
	setFoV: function(s) {
		
		this.fov_ = parseFloat(s);
	},
//_________________________________________
	setNear: function(s) {
		
		this.near_ = parseFloat(s);
	},
//_________________________________________
	setFar: function(s) {
		
		this.far_ = parseFloat(s);
	},
//_________________________________________
	setDrawCam: function(s) {
		
		this.isDrawCam = this.parseStringAsBool(s);
	},
////_________________________________________
//	extractPlanesGL: function(planes, pos, m){
//
//		//var m = K2TEMPMAT4;
//		//mat4.multiply(w, p, m);
//		var n = vec3.create();
//		var plane;
//		
////		plane = planes['NEAR'];
////		vec3.set([
////			 m[2]  + m[3],
////			 m[6]  + m[7],
////			 m[10] + m[11]
////		], n);
////		vec3.subtract(n, pos);
////		vec3.setPlaneFromPointAndNormal(n, pos, plane);
////		
////		plane = planes['FAR'];
////		vec3.set([
////			-m[2]  + m[3],
////			-m[6]  + m[7],
////			-m[10] + m[11]
////		], n);
////		vec3.subtract(n, pos);
////		vec3.setPlaneFromPointAndNormal(n, pos, plane);
////		
////		plane = planes['BOTTOM'];
////		vec3.set([
////			 m[1]  + m[3],
////			 m[5]  + m[7],
////			 m[9]  + m[11]
////		], n);
////		vec3.subtract(n, pos);
////		vec3.setPlaneFromPointAndNormal(n, pos, plane);
////
////		plane = planes['TOP'];
////		vec3.set([
////			-m[1]  + m[3],
////			-m[5]  + m[7],
////			-m[9]  + m[11]
////		], n);
////		vec3.subtract(n, pos);
////		vec3.setPlaneFromPointAndNormal(n, pos, plane);
//		
//		plane = planes['LEFT'];
//		vec3.set([
//			 m[0]  + m[3],
//			 m[4]  + m[7],
//			 m[8]  + m[11]
//		], n);
//		vec3.subtract(n, pos);
//		vec3.setPlaneFromPointAndNormal(n, pos, plane);
//		
//		plane = planes['RIGHT'];
//		vec3.set([
//			-m[0]  + m[3],
//			-m[4]  + m[7],
//			-m[8]  + m[11]
//		], n);
//		vec3.subtract(n, pos);
//		vec3.setPlaneFromPointAndNormal(n, pos, plane);
//	},
////_________________________________________
//	extractPlanesGL: function(planes, w, p){
//
//		var m = K2TEMPMAT4;
//		mat4.multiply(w, p, m);
//				
//		vec3.setPlaneCoefficients(planes['NEAR'],
////			 m(3,1) + m(4,1),
////			 m(3,2) + m(4,2),
////			 m(3,3) + m(4,3),
////			 m(3,4) + m(4,4));
//			 m[2]  + m[3],
//			 m[6]  + m[7],
//			 m[10] + m[11],
//			 m[14] + m[15]
//		);
//		vec3.setPlaneCoefficients(planes['FAR'],
////			-m(3,1) + m(4,1),
////			-m(3,2) + m(4,2),
////			-m(3,3) + m(4,3),
////			-m(3,4) + m(4,4));
//			-m[2]  + m[3],
//			-m[6]  + m[7],
//			-m[10] + m[11],
//			-m[14] + m[15]
//		);
//		vec3.setPlaneCoefficients(planes['BOTTOM'],
////			 m(2,1) + m(4,1),
////			 m(2,2) + m(4,2),
////			 m(2,3) + m(4,3),
////			 m(2,4) + m(4,4));
//			 m[1]  + m[3],
//			 m[5]  + m[7],
//			 m[9]  + m[11],
//			 m[13] + m[15]
//		);
//		vec3.setPlaneCoefficients(planes['TOP'],
////			-m(2,1) + m(4,1),
////			-m(2,2) + m(4,2),
////			-m(2,3) + m(4,3),
////			-m(2,4) + m(4,4));
//			-m[1]  + m[3],
//			-m[5]  + m[7],
//			-m[9]  + m[11],
//			-m[13] + m[15]
//		);
//		vec3.setPlaneCoefficients(planes['LEFT'],
////			 m(1,1) + m(4,1),
////			 m(1,2) + m(4,2),
////			 m(1,3) + m(4,3),
////			 m(1,4) + m(4,4));
//			 m[0]  + m[3],
//			 m[4]  + m[7],
//			 m[8]  + m[11],
//			 m[12] + m[15]
//		);
//		vec3.setPlaneCoefficients(planes['RIGHT'],
////			-m(1,1) + m(4,1),
////			-m(1,2) + m(4,2),
////			-m(1,3) + m(4,3),
////			-m(1,4) + m(4,4));		
//			-m[0]  + m[3],
//			-m[4]  + m[7],
//			-m[8]  + m[11],
//			-m[12] + m[15]
//		);
//	},
//_________________________________________
	getClassName: function() {return 'K2Camera';}});

	
	return {
		K2Camera: K2Camera
	};
});
