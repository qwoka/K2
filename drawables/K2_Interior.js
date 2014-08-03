
k2RegisterModule("K2_Interior",function () {
	

//_________________________________________
//		K2Room
//_________________________________________
	var K2Room = classExtend(k2Factories.K2XObject, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		// super
		k2Factories.K2XObject.prototype.initObject.apply(this, arguments);
		
		this.boundbox_ = new K2BBox();
		this.isMainRoom_ = true;
	},
//_________________________________________
	resetObject: function() {
		
		// super
		k2Factories.K2XObject.prototype.resetObject.apply(this, arguments);
		
		this.boundbox_.resetObject();
		this.parentRooms_ = null;
		this.adjoiningRooms_ = [];
		
		this.roomDrawable_ = null;
	},
//_________________________________________
	setParentRooms: function(s) {
		
		this.parentRooms_ = s;
	},
//_________________________________________
	initRoom: function() {
		
		// move bound box to world pos
		var wp = vec3.create(this.getWorldPos());
		var rr = this.boundbox_.getRadiusXYZ();
		wp[1] = rr[1];
		this.boundbox_.move(wp);
		
		// set easy to read identifier
		this.boundbox_.intersectResult_.room = this;
		this.boundbox_.intersectResult_.roomname = this.getName();
		
		// if no children, this is a small room
		this.isMainRoom_ = (this.children_.length>0);
	},
//_________________________________________
	linkOverlappingRoom: function(r) {
		
		// are we overlapping
		if (!this.boundbox_.intesectsBox(r.getBoundBox()))
			return;

		// link overlapping
		this.adjoiningRooms_.push(r);
		r.adjoiningRooms_.push(this);
	},
//_________________________________________
	step: function(t, c, b) {

		// don't step the interior collision objects, since they don't move
	},
//_________________________________________
	getBoundBox: function() {
		
		return this.boundbox_;
	},
//_________________________________________
	setXFormDim: function(s) {
		
		this.boundbox_.setFromDiameterVec3(this.parseStringAsFloatArray(s));
	},
//_________________________________________
	/*void*/ intersectRay: function(
		/*K3Ray*/ 	ray){ 
//		/*float*/	t0,
//		/*float */	t1){
//		/*array*/ 	outresults, 
//		/*int*/ 	depth /*=0*/){ 
//		/*K3Room*/ 	prevroom /*=null*/) {
		/*
		Only use the first 4 parameters when calling this function.
		The last 2 parareters are for recursion.
		*/
		// default val
		//if (!depth) depth = 0;
		
		// get bound box and result, and reset result
		var result = this.boundbox_.getIntersectResult();
		var rayresult = ray.getIntersectResult();
		if (result.requestid == rayresult.requestid) 
			return;
		
		result.resetForIntersectTest(rayresult.requestid);
		
		// intersect ray with our boundbox, 
		ray.intersectBox(this.boundbox_);
		
		// if no hit, return
		if (!result.hit) 
			return;
		
		//var inside = r.isInside();
		
		// store our result
		if (rayresult.t1 < result.t1){
			rayresult.copyFrom(result);
		}
		
		// dont go too deep (dont follow too many adjoining rooms)
		//if (depth>3) 
		//	return;
		
		// do adjoining rooms
		for (var i=this.adjoiningRooms_.length-1; i>=0; --i){
			var room = this.adjoiningRooms_[i];
			// ignore the room we came from
			//if (prevroom==room) continue;
			// go deep
			//room.intersectRay(ray, t0, outresults[outresults.length-1].t1, outresults, depth+1);
			room.intersectRay(ray);
		}
	},
//_________________________________________
	getClassName: function(){return 'K2Room';}});


	
//_________________________________________
//		K2Interior
//_________________________________________
	var K2Interior = classExtend(K2Room, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		// super
		k2Factories.K2Room.prototype.resetObject.apply(this, arguments);
		
		this.rooms_ = [];
		this.intersectResults_ = [];
	},
//_________________________________________
	setScene: function(s, x) {
		
		// super
		k2Factories.K2Room.prototype.setScene.apply(this, arguments);
		
		// set collosion detector to scene
		s.collisionDetector = this;
		
		// prepare rooms, move bbox into position, link overlapping elements
		this.initRooms_();
	},
//_________________________________________
	findRoomsContainingPos: function(p, out) {
		
		// find room raypos is in
		var r,i;
		for (i=this.rooms_.length-1; i>=0; --i){
			r = this.rooms_[i];
			if (r.boundbox_.containsSphere(p, 0.0)) 
				out.push(r);
		}
		return null;
	},
//_________________________________________
	findRoomContainingPos: function(p) {
		
		// find room raypos is in
		var r,i;
		for (i=this.rooms_.length-1; i>=0; --i){
			r = this.rooms_[i];
			if (r.boundbox_.containsSphere(p, 0.0)) 
				return r;
		}
		return null;
	},
//_________________________________________
	initRooms_: function() {
		
		// get rooms from children
		this.rooms_ = this.findRooms_();
		
		// fisrt resolve worldpos
		var r,i;
		for (i=this.rooms_.length-1; i>=0; --i){
			r = this.rooms_[i];
			r.setParentRooms(this);
			if (r.children_.length>0) continue;
			r.resolveXform();
		}
		
		// move bbox center to worldpos
		for (i=this.rooms_.length-1; i>=0; --i){
			this.rooms_[i].initRoom();
		}
		
		// check for overlapping
		for (i=this.rooms_.length-1; i>=0; --i){
			for (j=i-1; j>=0; --j){
				this.rooms_[i].linkOverlappingRoom(this.rooms_[j]);
			}
		}
	},
//_________________________________________
	findRooms_: function() {
		
		return this.loader_.getChildrenByClassName(this, 'K2Room', false);
	},
//_________________________________________
	step: function(t, c, b) {

		for (var i=this.children_.length-1; i>=0; --i)
			this.children_[i].step(t, c, b);
			
		//this.doIntersectTest_(c);
	},
//_________________________________________
	sceneIntersectRay: function(o, ray) {
		
		// find room raypos is in
		var room = o.getData('room');
		if (!room){
			room = this.findRoomContainingPos(ray.getCenter());
			o.setData('room', room);
		} else {
			if (!room.boundbox_.containsSphere(ray.getCenter(), 0.0)){
				room = this.findRoomContainingPos(ray.getCenter());
				o.setData('room', room);
			}
		}
		//if (rooms.length==0)
		//	this.findRoomsContainingPos(ray.getCenter(), rooms);
		//if (rooms.length==0) return null;
		
		if (!room) return;
		
		// reset interior results list
		//var results = this.intersectResults_;
		//results.splice(0, results.length);
		
		// intersect rooms
		//for (var i=rooms.length-1; i>=0; --i){
			//rooms[i].intersectRay(ray, 0, 100, results);
		//}
		//room.intersectRay(ray, 0, 100, results);
		room.intersectRay(ray);
		
		//return results[results.length-1];
		
		// store result in ray's result
		//jQuery.extend(ray.getIntersectResult(), results[results.length-1]);
	},
//_________________________________________
	getClassName: function(){return 'K2Interior';}});



	
	return {
		K2Room: K2Room,
		K2Interior: K2Interior
	};
});
