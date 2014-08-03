



//_________________________________________
//			Constants
//_________________________________________
K2MAT4IDENTITY = mat4.identity(mat4.create());
K2TEMPVEC3 = vec3.create();
K2TEMPVEC4 = vec4.create([0,0,0,0]);
K2TEMPMAT4 = mat4.create();
K2TEMPQUAT4 = quat4.create();
K2XAXIS = vec3.create([1,0,0]);
K2YAXIS = vec3.create([0,1,0]);
K2ZAXIS = vec3.create([0,0,1]);
K2ZAXISNEG = vec3.create([0,0,-1]);
K2ZERO = vec3.create([0,0,0]);
K2ONEVEC3 = vec3.create([1,1,1]);
K2ZEROVEC4 = vec4.create([0,0,0,0]);




//_________________________________________
//			K2XMat
//_________________________________________
    function K2XMat() {
		
        this.initObject_();
    }

    K2XMat.prototype = {
//_________________________________________
	initObject_: function() {
		
        this.pos = vec3.create();
        this.quat = quat4.create();
        this.scale = vec3.create();
		
		this.mat_ = mat4.create();
	},
//_________________________________________
	resetObject: function() {
		
		vec3.set([0,0,0], this.pos);
		quat4.fromAxisAngle([0,1,0, 0], this.quat);
		vec3.set([1,1,1], this.scale);
		
		this.posLock = false;
		this.quatLock = false;
		this.scaleLock = false;
		
		this.matDirty = true;
	},
//_________________________________________
	clone: function(dest) {
			
		dest.pos = this.pos;
		dest.quat = this.quat;
		dest.scale = this.scale;
		dest.matDirty = this.matDirty;
		if (!this.matDirty) 
			dest.mat_ = this.mat_;
	},
//_________________________________________
	copy: function(dest) {
		
		vec3.set(this.pos, dest.pos);
		quat4.set(this.quat, dest.quat);
		vec3.set(this.scale, dest.scale);
		dest.matDirty = this.matDirty;
		if (!this.matDirty) 
			mat4.set(this.mat_, dest.mat_);
	},
//_________________________________________
	multiply: function(p, x) {

		vec3.multiply(x.pos, x.scale, this.pos);
		vec3.add(this.pos, p.pos);
		quat4.multiplyVec3(x.quat, this.pos);
			
		quat4.multiply(p.quat, x.quat, this.quat);
		vec3.multiply(p.scale, x.scale, this.scale);

		this.matDirty = true;
	},
//_________________________________________
	composeMat: function(m) {
		
		// compose to matrix
		
		if (this.quatLock) {
			mat4.identity(m);
			quat4.inverse(this.quat, K2TEMPQUAT4);
			quat4.multiplyVec3(K2TEMPQUAT4, this.pos, K2TEMPVEC3);
			mat4.translate(m, K2TEMPVEC3 );
		} else {
			//mat4.identity(m);
			quat4.toMat4(this.quat, m);
			//quat4.inverse(this.quat, m);
			//mat4.multiply(K2TEMPMAT4, m, m);
			mat4.translate(m, this.pos);
			//mat4.setP(this.pos, m);
		}

		mat4.scale(m, this.scale);
	},
//_________________________________________
	setPAAS: function(a) {
		
		// set pos
		this.pos.set(a.slice(0,3));
		
		// set rotation
		if (a.length>=6){
			var q = a.slice(3,7);
			vec3.normalize(q);
			quat4.fromAxisAngle(q, this.quat);
		}
		
		// set scale
		if (a.length>=10){
			this.scale.set(a.slice(7,10));
		}
		
		this.matDirty = true;
	},
//_________________________________________
	setPRS: function(a) {
		
		// set pos
		this.pos.set(a.slice(0,3));
		
		// set rotation
		if (a.length>=6)
			quat4.fromEuler(a.slice(3,6), this.quat);
		
		// set scale
		if (a.length>=9)
			this.scale.set(a.slice(6,9));
		
//		quat4.inverse(this.quat, K2TEMPQUAT4);
//		quat4.multiplyVec3(K2TEMPQUAT4, this.pos);
		
		this.matDirty = true;
	},
//_________________________________________
	getMat: function() {
		
		if (!this.matDirty)
			return this.mat_;
			 
		this.composeMat(this.mat_);
		this.matDirty = false;
		return this.mat_;
	},
//_________________________________________
	lerp: function(a, b, u) {
		
		vec3.lerp(a.pos, b.pos, u, this.pos);
		vec3.lerp(a.scale, b.scale, u, this.scale);
		quat4.slerp(a.quat, b.quat, u, this.quat);
		
		this.matDirty = true;
	},
//_________________________________________
	dirty: function() {
		
		this.matDirty = true;
	},
//_________________________________________
	clean: function() {
		
		this.matDirty = false;
	},
	}
	
	
	
	
//_________________________________________
//			K2Transform
//_________________________________________
    function K2Transform() {
		
        this.initObject();
    }

    K2Transform.prototype = {
//_________________________________________
	initObject: function() {
		
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
		
		this.xformLocal.resetObject();
		this.xformWorld.resetObject();
		this.xformWorldF.resetObject();
		
		vec3.set(K2ZERO, this.worldPos);
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
	}
	}
