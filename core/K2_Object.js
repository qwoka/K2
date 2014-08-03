

k2RegisterModule("K2_Object",function () {
	
	
//_________________________________________
//		K2ObjectContainer
//_________________________________________
    function K2ObjectContainer() {
		
		// call reset thru full object inheritance heirarchy
        this.initObject();
        this.resetObject();
    }

    K2ObjectContainer.prototype = {
//_________________________________________
	initObject: function() {
		
	},
//_________________________________________
	resetObject: function() {
		
        this.children_ = [];
        this.parent_ = null;
        this._name_ = '';
        this.addChildToFront_ = false;
	},
//_________________________________________
	setName: function(n) {
		
		this._name_ = n;
	},
//_________________________________________
	getName: function() {
		
		return this._name_;
	},
//_________________________________________
	addChild: function(c) {
		
		c.setParent(this);
		if (c.addChildToFront_) this.children_.push(c); else this.children_.unshift(c);
	},
//_________________________________________
	removeChild: function(c) {
		
		var i = this.children_.indexOf(c);
		if (i<0) return;
		this.children_.slice(i,1);
		c.setParent(null);
	},
//_________________________________________
	getChildAt: function(i) {
		
		i = this.children_.length-1-i;
		return this.children_[i];
	},
//_________________________________________
	indexOf: function(c) {
		
		return this.children_.indexOf(c);
	},
//_________________________________________
//	numChildren: function() {return this.children_.length;},
////_________________________________________
//	checkForDuplicateObject: function(){
//		
//		return false;
//	},
////_________________________________________
//	getSuper: function() {
//		
//		return null;
//	},
//_________________________________________
//	getClassName: function() {return 'K2ObjectContainer';}
	}
	
	
//_________________________________________
//		K2ObjectParamaters
//_________________________________________
	var K2ObjectParamaters = classExtend(K2ObjectContainer, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		K2ObjectContainer.prototype.resetObject.apply(this, arguments);
		
		this.loader_ = null;
	},
//_________________________________________
	linkObjectProperty: function(pname, objname){

		// find object by name
		var o = this.loader_.lookupObjByName(objname);
		if (o) return o;
		
		// did not find it.  if we are not yet loaded, store as unlinkedObjParam
		this.loader_.world.addUnLinkedObjParam(this, 'set'+pname, objname);
		
		// not found
		//this.warnProperty(pname, objname);
		return null;
	},
//_________________________________________
	linkObjectArrayProperty: function(pname, objnames){

		var a = objnames.split(' ');
		var out = [];
		var o = null;
		var ok = true;
		
		for (var i=0; i<a.length; ++i){
			o = this.loader_.lookupObjByName(a[i]);
			if (o==null) 
				ok = false;
			out.push(o);
		}	
		
		if (!ok)
			// failed !
			this.loader_.world.addUnLinkedObjParam(this, 'set'+pname, objnames);
			
		return out;
	},
//_________________________________________
    setObjectPropertyFromXML: function(n, xml) {
		
		var p = this.findObjectProperty(n);
		if (p == null) {
			this.log_('cannot set property [' + n + ']');
			return;
		}
		
		if (xml.children().length){
			// contains xml, check first node to see if it is a k2 declaration
			var c = xml.children()[0];
			if (!(c.nodeName.substr(0,2)!='K2' && jQuery(c).attr('type')===undefined)){
				var nextidx = this.numChildren();
				// load xml
				this.loader_.makeObjectsFromXML(this, xml);
				// set actual param by calling apply with objects name
				if ((this.numChildren()-nextidx)==1){
					p[n].apply(this, [this.children_[0].getName()]);
				} else {
					// add multiple objects (array?)
				}
			} else {
				// property, use xml
				p[n].apply(this, [xml]);
			}
		} else {
			// text, so set property
			var txt = jQuery.trim(xml.text());
			if (txt.length) p[n].apply(this, [txt]);
		}
		//if (!parentObj.factory_.prototype.hasOwnProperty(n)) return;
		//parentObj.factory_.prototype[n].apply(this, [jQuery.trim(xml.text())]);
	},
//_________________________________________
    findObjectProperty: function(n) {
		
		var c = this.findObjectProperty_(this.factory_.prototype, n);
		return c;
	},
//_________________________________________
    findObjectProperty_: function(c, n) {
		
		if (c.hasOwnProperty(n)) return c;
		if (c.super == null) return null;
		return this.findObjectProperty_(c.super, n);
	},
//_________________________________________
    isTypeOfByClassName: function(c, godeep) {
		
		if (godeep===undefined) godeep = true;
		
		return this.isTypeOfByClassName_(this.factory_.prototype, c, godeep);
	},
//_________________________________________
    isTypeOfByClassName_: function(p, c, godeep) {
		
		var tc = p.getClassName.apply(this);
		if (tc==c) 
			return true;
		if ((tc=='K2Object') || (!godeep)) 
			return false;
		return this.isTypeOfByClassName_(p.super, c, godeep);
	},
//_________________________________________
	warnProperty: function(p, v){
		
		this.log_('could not set property ['+p+']  value['+v+']');
	},
//_________________________________________
	parseStringAsFloatArray: function(s){
		
		var sa = s.split(' ');
		var fa = new Array();
		for (var i=sa.length-1; i>=0; --i){
			fa[i] = parseFloat(sa[i]);
		}
		return fa;
	},
//_________________________________________
	parseStringAsIntArray: function(s){
		
		var sa = s.split(' ');
		var fa = new Array();
		for (var i=sa.length-1; i>=0; --i){
			fa[i] = parseInt(sa[i]);
		}
		return fa;
	},
//_________________________________________
	parseStringAsBool: function(s){
		
		if (s.length ==0) return false;
		if (s=='1' || s=='y' || s=='Y' || s=='true') return true;
		return false;
	},
//_________________________________________
	parseStringAsStringArray: function(s){
		
		var sa = s.split(' ');
		return sa;
	},
//_________________________________________
	parseStringAsColor: function(s){
		
		if (s.charAt(0)=='#'){
			var cch,cc;
			var out = [];
			for (var i=0; i<3; ++i){
				cch = s.substring(i*2+1,2);
				// convert hex to int
				cc = parseInt(h,16);
				out.push(cc.toString());
			}
			s = out.join(' ');
		}
		
		var a = this.parseStringAsFloatArray(s);
		if (a[0]>1.0)
			vec3.scale(a, 1.0/255.0);
		return a;
	},
//_________________________________________
//	getClassName: function() {return 'K2ObjectParamaters';}
	});


//_________________________________________
//		K2Object
//_________________________________________
	var K2Object = classExtend(K2ObjectParamaters, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		K2ObjectParamaters.prototype.resetObject.apply(this, arguments);
		
		this.factoryName_ = this.getClassName();
		this.instanceid = 0;
		this.isPool_ = false;
		this.childSortID_ = 0;
		
		this.scene = null;
        this.parentX_ = null;
        this.hasGLContext = true;
		
		this.movers_ = [];
		this.moversF_ = [];
	},
//_________________________________________
	step: function(t, c, b) {
		
		for (var i=this.children_.length-1; i>=0; --i){
			this.children_[i].step(t, c, b);
		}
	},
//_________________________________________
	setContext3D: function(gl) {
		
	},
//_________________________________________
	setParent: function(p) {
		
		if (p==null){ 
			// remove to scene drawop list
			this.parent_ = null;
			this.parentX_ = null;
		} else {
			// add from scene drawop list
			this.parent_ = p;
			//scene = K2Scene(findObjInParentByClass(K2Scene));
			this.scene = p.getSceneFromParent();
			if (this.scene)
				this.setScene(this.scene, p.getXNodeFromParent());
		}
	},
//_________________________________________
	sortChildren: function() {
		
		var self = this;
		this.children_.sort(function(a,b){
			return self.childSortCompare_(a,b);
		});
	},
//_________________________________________
	childSortCompare_: function(a,b) {
		
		var ap = a.getChildSortPriority();
		var bp = b.getChildSortPriority();
		
		// sort by Priority
		if (ap > bp) return -1;
		if (ap < bp) return  1;
		
		// equal
		return 0;
	},
//_________________________________________
	getChildSortPriority: function() {
		
		return 0;
	},
//_________________________________________
	getSceneFromParent: function() {
		
		if (this.scene ) 
			return this.scene;
		if (this.parent_) 
			return this.parent_.getSceneFromParent();
		return null;
	},
//_________________________________________
	getXNodeFromParent: function() {
		
		if (this.parentX_ ) 
			return this.parentX_;
		if (this.parent_) 
			return this.parent_.getXNodeFromParent();
		return null;
	},
//_________________________________________
	setScene: function(s, x) {
		
		this.parentX_ = x;
		this.scene = s;

		// go deep into tree to set scene
		for (var i=this.children_.length-1; i>=0; --i){
			this.children_[i].setScene(s,x);
		}
	},
//_________________________________________
	addMover: function(m){
		
		this.movers_.push(m);
	},
//_________________________________________
	addMoverF: function(m){
		
		this.moversF_.push(m);
	},
//_________________________________________
	toString: function(){
		
		return this.toK2IDtring();
	},
//_________________________________________
	toK2IDtring: function(){
		
		return this.getName() + ' [' + this.getClassName()+ '] ';
	},
//_________________________________________
	log_: function(o, priority){
		
		if (priority === undefined) priority = 3;
		
		// get canvas
		var c = (this.world) ? this.world.canvas_ : this.loader_.world.canvas_;
		
		// get identifier string
		var s = this.toK2IDtring();
//		c.trigger('k2log', [{
//			msg: s,
//			level: priority
//		}]);
		
		// trigger log event
		c.trigger('k2log', [{
			msg: s+o,
			level: priority
		}]);
	},
//_________________________________________
	logObject_: function(o, priority){
		
		if (priority===undefined) priority = 0;
		
		// get canvas
		var c = (this.world) ? this.world.canvas_ : this.loader_.world.canvas_;
		
		// get identifier string
		var s = this.getName()+' ['+this.getClassName()+'] ';
//		c.trigger('k2log', [{
//			msg: s,
//			level: priority
//		}]);
		
		// trigger log event
		c.trigger('k2log', [{
			msg: s,
			obj: o,
			level: priority
		}]);
	},
//_________________________________________
	release: function() {
		
		this.log_('K2Object released');
        this.resetK2Object();
	},
//_________________________________________
	addToPool: function() {
		
		// if we do not have an object pool, make one
		if (!k2ObjectPool.hasOwnProperty(this.className_) ||
			k2ObjectPool[this.className_] != null){
			k2ObjectPool[this.className_] = [];	
		}
		// add to pool
		k2ObjectPool[this.className_].push(this);
	},
//_________________________________________
	getClassName: function() {return 'K2Object';}});


	
	return {
		K2Object: K2Object
	};
});


////_________________________________________
////		K2Visitor
////_________________________________________
//    function K2Visitor() {
//		
//		// call reset thru full object inheritance heirarchy
//       // this.resetObject();
//    }
//
//    K2Visitor.prototype = {
////_________________________________________
//	getChildrenByClassName: function(o, c, godeep) {
//		
//		if (godeep===undefined) godeep = true;
//		
//		var a = [];
//		this.getChildrenByClassName_(o,c,a, godeep);
//		return a;
//	},
////_________________________________________
//	getChildrenByClassName_: function(o, c, out, godeep) {
//		
//		// add to list
//		if (o.isTypeOfByClassName(c, godeep)) 
//			out.push(o);
//																   
//		// do tree
//		for (var i=o.children_.length-1; i>=0; --i){
//			this.getChildrenByClassName_(o.children_[i], c, out, godeep);
//		}
//	},
////_________________________________________
//	findParentByClassName: function(o, c, godeep) {
//		
//		if (godeep===undefined) godeep = true;
//		
//		// add to list
//		if (o.isTypeOfByClassName(c, godeep)) 
//			return o;
//			
//		if (o.parent==null)
//			return null;
//																   
//		// do tree
//		return this.findParentByClassName(o.parent, c, godeep);
//	},
//	}
//
