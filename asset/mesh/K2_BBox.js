


//_________________________________________
K2CollisionResult = function(){

	this.initObject();
};

K2CollisionResult.prototype = {constructor: K2CollisionResult,
//_________________________________________
	initObject: function(){

		this.hit = false;
		this.room = null;
		this.roomname = '';
		this.f = 0;
		this.n = null;
		this.nE = null;
		this.t0 = 0.0;
		this.t1 = 0.0;
		this.requestid = 0;
	},
//_________________________________________
	resetForIntersectTest: function(requestid){

		this.hit = false;
		this.requestid = requestid;
	},
//_________________________________________
	copyFrom: function(r){

		this.hit = r.hit;
		this.f = r.f;
		this.t0 = r.t0;
		this.t1 = r.t1;
		this.n = r.n;
		this.nE = r.nE;
	},
//_________________________________________
	isInside: function(){

		return ((this.t0 * this.t1)<0.0);
	},
//_________________________________________
	makeNewRequest: function(t0, t1){

		this.requestid = ++K2CollisionResult.requestid_;
		this.hit = false;
		this.t0 = t0;
		this.t1 = t1;
	},
//_________________________________________
	getClassName: function() {return 'K2CollisionResult';}
};

K2CollisionResult.requestid_ = 0;


//_________________________________________
K2CollisionPrimative = function(){

	this.initObject();
	this.resetObject();
};

K2CollisionPrimative.prototype = {constructor: K2CollisionPrimative,
//_________________________________________
	initObject: function(){

		this.center = vec3.create(K2ZERO);
		this.radiusXYZ = vec3.create(K2ZERO);
		this.intersectResult_ = new K2CollisionResult();
	},
//_________________________________________
	resetObject: function(){

		vec3.set(this.center, K2ZERO);
		vec3.set(this.radiusXYZ, K2ZERO);
	},
//_________________________________________
	getIntersectResult: function(){

		// room maintains the result record
		return this.intersectResult_;
	},
//_________________________________________
	makeNewRequest: function(t0, t1){

		this.intersectResult_.makeNewRequest(t0, t1);
	},
//_________________________________________
	setSphere: function(a){

	},
//_________________________________________
	setFromRadius: function(r){

		vec3.set([r,r,r], this.radiusXYZ);
	},
//_________________________________________
	setFromDiameterVec3: function(rv){

		vec3.scale(rv, 0.5, this.radiusXYZ);
	},
//_________________________________________
	getCenter: function(){

		return this.center;
	},
//_________________________________________
	getRadiusXYZ: function(){

		return this.radiusXYZ;
	},
//_________________________________________
	moveTo: function(c, dest){

	},
//_________________________________________
	move: function(cc){

	},
//_________________________________________
	intesectsBox: function(b){

		return false;
	},
//_________________________________________
	containsSphere: function(c, r){

		return false;
	},
//_________________________________________
	intersectRay: function(ray, result, t0, t1){
		
		result.hit = false;
	},
//_________________________________________
	getClassName: function() {return 'K2CollisionPrimative';}
};



//_________________________________________
//		K2Ray
//_________________________________________
	var K2Ray = classExtend(K2CollisionPrimative, function(){
		
	},{
//_________________________________________
	initObject: function(){

		// super
		K2CollisionPrimative.prototype.initObject.apply(this, arguments);
		
		this.dir = vec3.create();
		this.dirinv = vec3.create();
		this.dirsign = [];
	},
//_________________________________________
	resetObject: function(){

		// super
		K2CollisionPrimative.prototype.resetObject.apply(this, arguments);
		
		vec3.set(this.dir, K2ZERO);
		vec3.set(this.dirinv, K2ZERO);
		this.dirsign = [0,0,0];
	},
//_________________________________________
	makeNewRequestFromWorldMat: function(mw, t0, t1){

		this.setRayFromWorldMat(mw);
		this.makeNewRequest(t0, t1);
	},
//_________________________________________
	setRayFromWorldMat: function(mw){

		vec3.getP(mw, this.center);
		vec3.getAxisZ(mw, this.dir);

		vec3.inverse(this.dir, this.dirinv);
		
		this.dirsign[0] = (this.dirinv[0]<0) ? 1 : 0;
		this.dirsign[1] = (this.dirinv[1]<0) ? 1 : 0;
		this.dirsign[2] = (this.dirinv[2]<0) ? 1 : 0;
	},
//_________________________________________
	getPointOnRay: function(t, out){

		vec3.set(this.dir, out);
		vec3.scale(out, -t);
		vec3.add(out, this.getCenter());
	},
//_________________________________________
	intersectBox: function(box){
		
		var face = 0;
		var mm = [box.min, box.max];
		var tmin, tmax, tymin, tymax, tzmin, tzmax;
		
		tmin  = (mm[this.dirsign[0]][0]   - this.center[0]) * this.dirinv[0];
		tmax  = (mm[1-this.dirsign[0]][0] - this.center[0]) * this.dirinv[0];
		tymin = (mm[this.dirsign[1]][1]   - this.center[1]) * this.dirinv[1];
		tymax = (mm[1-this.dirsign[1]][1] - this.center[1]) * this.dirinv[1];
		
		if (tmin > tymax || tymin > tmax) 
			return;
			
		if (tymin > tmin){
			tmin = tymin;
			face = 1;
		}
		if (tymax < tmax){
			tmax = tymax;
			face = 1;
		}
		tzmin = (mm[this.dirsign[2]][2]   - this.center[2]) * this.dirinv[2];
		tzmax = (mm[1-this.dirsign[2]][2] - this.center[2]) * this.dirinv[2];

		if (tmin > tzmax || tzmin > tmax) 
			return;
			
		if (tzmin > tmin){
			tmin = tzmin;
			face = 2;
		}
		if (tzmax < tmax){
			tmax = tzmax;
			//face = 2;
		}
		
		var rayresult = this.getIntersectResult();
		if ((rayresult.t0 != null && tmin >= -rayresult.t0) || (rayresult.t1 != null && tmax <= -rayresult.t1))
			return;
		
		face += face + this.dirsign[face];
		
		var result = box.getIntersectResult();
		result.hit = true;
		result.f = face;
		result.n = K2BBox.normals[face];
		result.nE = K2BBox.normalsEuler[face];
		result.t0 = -tmax;
		result.t1 = -tmin;
	},
//_________________________________________
	getClassName: function() {return 'K2Ray';}
	});

//_________________________________________
//		K2BBox
//_________________________________________
	var K2BBox = classExtend(K2CollisionPrimative, function(){
		
	},{
//_________________________________________
	initObject: function(){

		// super
		K2CollisionPrimative.prototype.initObject.apply(this, arguments);
		
		this.min = vec3.create();
		this.max = vec3.create();
		
		this.radius = 0;
		this.radius2 = 0;
		this.radiusXZ = 0;
		this.radiusXZ2 = 0;
		
		this.centerDirty = true;
		this.radiusDirty = true;
		this.radius2Dirty = true;
		this.radiusXZDirty = true;
		this.radiusXZ2Dirty = true;
		
		this.radiusXYZDirty = true;
		
		if (!K2BBox.normals) 
			K2BBox.normals = this.makeNormals_();
		if (!K2BBox.normalsEuler) 
			K2BBox.normalsEuler = this.makeNormalsEuler_();
	},
//_________________________________________
	resetObject: function(){

		// super
		K2CollisionPrimative.prototype.resetObject.apply(this, arguments);
		
		this.setMinValues_(this.max);
		this.setMaxValues_(this.min);
		this.minmaxUpdated_();
	},
//_________________________________________
	setMinMax: function(a){

		vec3.set(this.min, [a[0],a[1],a[2]]);
		vec3.set(this.max, [a[3],a[4],a[5]]);
		this.minmaxUpdated_();
	},
//_________________________________________
	setSphere: function(a){

		this.setFromRadius(a[3]);
		
		//var c = [a[0],a[1],a[2]];
		
		vec3.add(this.min, a);
		vec3.add(this.max, a);
		vec3.add(this.center, a);
	},
//_________________________________________
	mergeBox: function(b){

		vec3.min(this.min, b.min);
		vec3.max(this.max, b.max);
		this.minmaxUpdated_();
	},
//_________________________________________
	mergeVert: function(v){

		vec3.min(this.min, v);
		vec3.max(this.max, v);
		this.minmaxUpdated_();
	},
//_________________________________________
	makeNormals_: function(){

		var n = [];
		n[0] = vec3.create(K2XAXIS);
		n[1] = vec3.create(K2XAXIS);
		n[2] = vec3.create(K2YAXIS);
		n[3] = vec3.create(K2YAXIS);
		n[4] = vec3.create(K2ZAXIS);
		n[5] = vec3.create(K2ZAXIS);
		vec3.negate(n[1]);
		vec3.negate(n[3]);
		vec3.negate(n[5]);
		return n;
	},
//_________________________________________
	makeNormalsEuler_: function(){

		var n = [];
		n[0] = vec3.create([90,0,0]);
		n[1] = vec3.create([-90,0,0]);
		n[2] = vec3.create([0,0,90]);
		n[3] = vec3.create([0,0,-90]);
		n[4] = vec3.create([0,0,0]);
		n[5] = vec3.create([0,180,0]);
		return n;
	},
//_________________________________________
	computeFromTris: function(v, span, i){

		this.resetObject();
		
		var idx,x,y,z;
		
		for (var q=i.length-1; q>=0; --q){
			idx = i[q] * span;
			x = v[idx];
			y = v[idx+1];
			z = v[idx+2];
			vec3.set([x,y,z], K2TEMPVEC3);
			this.mergeVert(K2TEMPVEC3);
		}
	},
//_________________________________________
	computeFromVerts: function(v, span){

		this.resetObject();

		for (var q=v.length-1; q>0; q-=span){
			vec3.set(K2TEMPVEC3, [v[q-2],v[q-1],v[q]]);
			this.mergeVert(K2TEMPVEC3);
		}
	},
//_________________________________________
	setFromRadius: function(r){

		vec3.set([r,r,r], this.min);
		vec3.negate(this.min);
		vec3.set([r,r,r], this.max);
		vec3.set(this.max, this.radiusXYZ);
		this.radius = r;
		this.radius2 = r*r;
		vec3.set(K2ZERO, this.center);
		this.radiusDirty = false;
		this.radius2Dirty = false;
		this.centerDirty = false;
		this.radiusXYZDirty = false;
	},
//_________________________________________
	setFromDiameterVec3: function(rv){

		vec3.scale(rv, 0.5, this.min);
		vec3.negate(this.min);
		vec3.scale(rv, 0.5, this.max);
		vec3.set(this.max, this.radiusXYZ);
		vec3.set(K2ZERO, this.center);
		this.radiusDirty = true;
		this.radius2Dirty = true;
		this.centerDirty = false;
		this.radiusXYZDirty = false;
	},
//_________________________________________
	getRadius: function(){

		if (!this.radiusDirty) return this.radius;
		
		if (!this.radius2Dirty) {
			this.radius = Math.sqrt(this.radius2);
			this.radiusDirty = false;
			return this.radius;
		}
		
		vec3.subtract(this.max, this.min, K2TEMPVEC3);
		this.radius = vec3.length(K2TEMPVEC3);
		this.radiusDirty = false;
		
		return this.radius;
	},
//_________________________________________
	getRadius2: function(){

		if (!this.radius2Dirty) return this.radius2;
		
		if (!this.radiusDirty) {
			this.radius2 = this.radius * this.radius;
			this.radius2Dirty = false;
			return this.radius2;
		}
		
		vec3.subtract(this.max, this.min, K2TEMPVEC3);
		vec3.scale(K2TEMPVEC3, 0.5);
		this.radius2 = vec3.dot(K2TEMPVEC3, K2TEMPVEC3);
		this.radius2Dirty = false;
		
		return this.radius2;
	},
//_________________________________________
	getRadiusXZ: function(){

		if (!this.radiusXZDirty) return this.radiusXZ;
		
		if (!this.radiusXZ2Dirty) {
			this.radiusXZ = Math.sqrt(this.radius2);
			this.radiusXZDirty = false;
			return this.radiusXZ;
		}
		
		vec3.subtract(this.max, this.min, K2TEMPVEC3);
		K2TEMPVEC3[1] = 0.0;
		this.radiusXZ = vec3.length(K2TEMPVEC3);
		this.radiusXZDirty = false;
		
		return this.radiusXZ;
	},
//_________________________________________
	getRadiusXZ2: function(){

		if (!this.radiusXZ2Dirty) return this.radiusXZ2;
		
		if (!this.radiusXZDirty) {
			this.radiusXZ2 = this.radiusXZ * this.radiusXZ;
			this.radiusXZ2Dirty = false;
			return this.radiusXZ2;
		}
		
		vec3.subtract(this.max, this.min, K2TEMPVEC3);
		vec3.scale(K2TEMPVEC3, 0.5);
		K2TEMPVEC3[1] = 0.0;
		this.radiusXZ2 = vec3.dot(K2TEMPVEC3, K2TEMPVEC3);
		this.radiusXZ2Dirty = false;
		
		return this.radiusXZ2;
	},
//_________________________________________
	getCenter: function(){

		if (!this.centerDirty) return this.center;
		
		vec3.subtract(this.max, this.min, this.center);
		vec3.scale(this.center, 0.5);
		vec3.add(this.center, this.min);
		
		this.centerDirty = false;
		return this.center;
	},
//_________________________________________
	getRadiusXYZ: function(){

		if (!this.radiusXYZDirty) return this.radiusXYZ;
		
		vec3.subtract(this.max, this.min, this.radiusXYZ);
		vec3.scale(this.radiusXYZ, 0.5);
		
		this.radiusXYZDirty = false;
		return this.radiusXYZ;
	},
////_________________________________________
//	getSize: function(o){
//
//		vec3.subtract(this.max, this.min, o);
//	},
////_________________________________________
//	setCenter: function(c){
//
//		if (this.centerDirty) getCenter();
//		
//		vec3.set(c, this.center);
//		this.centerDirty = false;
//	},
////_________________________________________
//	moveCenter: function(c){
//
//		if (this.centerDirty) getCenter();
//		
//		vec3.add(this.center, c);
//		vec3.add(this.min, c);
//		vec3.add(this.max, c);
//	},
//_________________________________________
	moveTo: function(c, dest){

		if (this.centerDirty) this.getCenter();
		
		vec3.add(this.center, c, dest.center);
		vec3.add(this.min, c, dest.min);
		vec3.add(this.max, c, dest.max);
	},
//_________________________________________
	move: function(cc){

		this.getCenter();
		
		vec3.add(this.center, cc);
		vec3.add(this.min, cc);
		vec3.add(this.max, cc);
	},
//_________________________________________
	minmaxUpdated_: function(){

		this.centerDirty = true;
		this.radiusDirty = true;
		this.radius2Dirty = true;
		this.radiusXZDirty = true;
		this.radiusXZ2Dirty = true;
		this.radiusXZZDirty = true;
	},
//_________________________________________
	setMinValues_: function(o){

		//var n = this.Number_.NEGATIVE_INFINITY;
		var n = -99999999999.0
		vec3.set([n,n,n], o);
	},
//_________________________________________
	setMaxValues_: function(o){

		//var n = this.Number_.POSITIVE_INFINITY;
		var n = 99999999999.0
		vec3.set([n,n,n], o);
	},
	
//_________________________________________
	intesectsBox: function(b){

		// get vector between boxes
		var v = vec3.create();
		vec3.subtract(this.getCenter(), b.getCenter(), v);
		
		// get extents
		var e = this.getRadiusXYZ();
		var be = b.getRadiusXYZ();
		var v1 = K2TEMPVEC3;
		vec3.add(e, be, v1);
		//
		var f = (Math.abs(v[0]) <= v1[0]) && (Math.abs(v[1]) <= v1[1]) && (Math.abs(v[2]) <= v1[2]);
		return f;
	},
//_________________________________________
	containsSphere: function(c, r){

    	var s;
		var d = 0; 

		//find the square of the distance
		//from the sphere to the box
		for (var i=0; i<3; ++i){
	
			if (c[i]<this.min[i]){ 
				s = c[i] - this.min[i];
				d += s*s;
				 
			} else if (c[i] > this.max[i]){
				s = c[i] - this.max[i];
				d += s*s; 
			}
		}
		return d <= r*r;
	},
//_________________________________________
	getClassName: function() {return 'K2BBox';}
	});



