k2RegisterModule("K2_Anim",function () {
	
	
//_________________________________________
//		K2AnimIter
//_________________________________________
    function K2AnimIter() {
		
		// call reset thru full object inheritance heirarchy
        this.stageConstruct();
    }

    K2AnimIter.prototype = {constructor: K2AnimIter,
//_________________________________________
	stageConstruct: function() {
		
		this.ak = 0;
		this.k1 = 0;
		this.k2 = 0;
		this.u = 0;
	},
//_________________________________________
	updateAnim: function(n) {
		
		this.ak = n;
		this.k1 = parseInt(n);
		this.k2 = this.k1;
		this.u = n - this.k1;
		if (this.u > 0.0) 
			++this.k2;
	}
};	

	
	
//_________________________________________
//		K2AnimSet
//_________________________________________
	var K2AnimSet = classExtend(k2Factories.K2Asset, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		// super
		k2Factories.K2Asset.prototype.resetObject.apply(this, arguments);
		
		this.uniform_ = false;
		this.closed_ = true;
		this.linear_ = true;
		
		this.totalTime_ = 0.0;
		this.wavName_ = '';
	},
//_________________________________________
    setClosed: function(s){
		
		this.closed_ = this.parseStringAsBool(s);
	},
//_________________________________________
    setLinear: function(s){
		
		this.linear_ = this.parseStringAsBool(s);
	},
//_________________________________________
    setUniform: function(s){
		
		this.uniform_ = new parseStringAsBool(s);
	},
//_________________________________________
    setWav: function(s){
		
		this.wavName_ = s;
	},
//_________________________________________
	getClassName: function() {return 'K2AnimSet';}});
		


//_________________________________________
//		K2AnimTrack
//_________________________________________
	var K2AnimTrack = classExtend(K2AnimSet, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		// super
		K2AnimSet.prototype.resetObject.apply(this, arguments);
		
		this.tracktype_ = 'AnimSet';
		this.assignto_ = [];
		
		this.animatedprop_ = '';
		this.timeprop_ = 'animKey';
		
		this.timeoffset_ = 0.0;
		this.times_ = [];
		
		this.keyReader_ = null;
	},
//_________________________________________
    loadAnimation_: function(/*xml*/ xml){
		
		switch (this.tracktype_){
			case "AnimSet":
				//tracks[track.name()] = getNumberKeys(track);
				return;
			case "Number":
				//this.keyReader_ = new K3ATNumber();
				this.keys_ = this.parseStringAsFloatArray(t);
				break;
			case "String":
	//		case "Phoneme":
				//this.keyReader_ = new K3ATString();
				this.keys_ = this.parseStringAsStringArray(t);
				break;
	//		case "Phoneme":
	//			keyReader = new K3ATPhoneme();
	//			break;
			case "V3":
				//this.keyReader_ = new K3ATV3();
				this.keys_ = this.parseStringAsFloatArray(t);
				break;
			default:
				this.log(": unknown tracktype: " + this.tracktype_);
				return;
		}
			
		this.times_ = [];
		// get key times
		this.setKeyTimes_(xml.keys[0]);
		
		this.setKeys(xml.keys[0]);
	},
//_________________________________________
    setKeyTimes_: function(/*xml*/ xml){
		
	},
//_________________________________________
    getKey: function(/*int*/ i){
		
		return keyReader.getKey(i);
	},
//_________________________________________
    setTrackType: function(s){
		
		this.tracktype_ = s;
	},
//_________________________________________
    setTProp: function(s){
		
		this.timeprop_ = s;
	},
//_________________________________________
    setKProp: function(s){
		
		this.animatedprop_ = s;
	},
//_________________________________________
    setTOffset: function(s){
		
		this.timeoffset_ = new parseStringAsFloat(s);
	},
//_________________________________________
    setAssignTo: function(s){
		
		this.assignto_ = [];
		
		var a = s.split(' ');
		for (var i=0; i<a.length; ++i){
			this.assignto_.push(a[i]);
		}
	},
//_________________________________________
	getClassName: function() {return 'K2AnimTrack';}});
		





//_________________________________________
//		K2NodeAnim
//_________________________________________
	var K2NodeAnim = classExtend(k2Factories.K2Mover, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		// super
		k2Factories.K2Mover.prototype.initObject.apply(this, arguments);
		
		this.ray_ = new K2Ray();
		this.normal = vec3.create();
	},
//_________________________________________
	resetObject: function() {
		
		// super
		k2Factories.K2Mover.prototype.resetObject.apply(this, arguments);
		
		this.ray_.resetObject();
		vec3.set(K2ZERO, this.normal);
		this.face = 0;
		this.room = null;
	},
//_________________________________________
	stepMover: function(t, c, b) {
		
		this.collideRayAndSetDepth_(c, this.parentX_);
		
		// super
		k2Factories.K2Mover.prototype.stepMover.apply(this, arguments);
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
		K2AnimSet: K2AnimSet,
		K2AnimTrack: K2AnimTrack,
		K2NodeAnim: K2NodeAnim
	};
});
