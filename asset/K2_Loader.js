k2RegisterModule("K2_Loader",function () {
	
//_________________________________________
//		K2ObjectHelper
//_________________________________________
	var K2ObjectHelper = classExtend(k2Factories.K2Asset, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Asset.prototype.resetObject.apply(this, arguments);
		
        this.dictionary_ = {};
        this.assets_ = null;
		this.world = null;
		this.xml_ = null;
		this.dependancies_ = 0;
	},
//_________________________________________
	makeObjectColor: function(o) {
		
		k2Factories.K2Asset.prototype.resetObject.apply(this, arguments);
		
        this.dictionary_ = {};
        this.assets_ = null;
		this.world = null;
		this.xml_ = null;
		this.dependancies_ = 0;
	},
//_________________________________________
	getChildrenByClassName: function(o, c, godeep) {
		
		if (godeep===undefined) godeep = true;
		
		var a = [];
		this.getChildrenByClassName_(o,c,a, godeep);
		return a;
	},
//_________________________________________
	getChildrenByClassName_: function(o, c, out, godeep) {
		
		// add to list
		if (o.isTypeOfByClassName(c, godeep)) 
			out.push(o);
																   
		// do tree
		for (var i=o.children_.length-1; i>=0; --i){
			this.getChildrenByClassName_(o.children_[i], c, out, godeep);
		}
	},
//_________________________________________
	findParentByClassName: function(o, c, godeep) {
		
		if (godeep===undefined) godeep = true;
		
		// add to list
		if (o.isTypeOfByClassName(c, godeep)) 
			return o;
			
		if (o.parent==null)
			return null;
																   
		// do tree
		return this.findParentByClassName(o.parent, c, godeep);
	},
//_________________________________________
	getClassName: function() {return 'K2ObjectHelper';}});


	
//_________________________________________
//		K2Loader
//_________________________________________
	var K2Loader = classExtend(K2ObjectHelper, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		K2ObjectHelper.prototype.resetObject.apply(this, arguments);
		
        this.dictionary_ = {};
        this.assets_ = null;
		this.world = null;
		this.xml_ = null;
		this.dependancies_ = 0;
	},
//_________________________________________
	step: function(t, c, b) {
		
		// are we ready
		if (!this.isReady()) 
			return;
		
		//k2Factories.K2Object.prototype.step.apply(this, arguments);
		
		// assets are not stepped
		for (var i=this.children_.length-((self.assets_)?2:1); i>=0; --i){
			this.children_[i].step(t, c, b);
		}
	},
//_________________________________________
    isReady: function() {
		
		return (this.dependancies_==0);
	},
//_________________________________________
    pushDependant: function() {
		
		++this.dependancies_;
	},
//_________________________________________
    popDependant: function() {

		if (this.dependancies_==0){
			this.log_('pop < 0', 2);
			return;
		}
		
		if (--this.dependancies_>0) return;
		
		// we are ready!   release our loader
		if (this.loader_) {
			this.loader_.popDependant();
//		} else {
//			// world is ready
//			this.log_('is ready capn!', 3);
		}
	},
//_________________________________________
    makeObjectsFromXML: function(parentObj, xml) {
		
		this.pushDependant();
		this.makeObjectsFromXML_(parentObj, xml);
		this.popDependant();
	},
//_________________________________________
    makeObjectsFromXML_: function(parentObj, xml) {
		
		var self = this;
		xml.children().each(function(){
			self.makeObjectFromXML_(parentObj, jQuery(this), this.nodeName);
		});
    },
//_________________________________________
    makeObjectFromXML_: function(parentObj, e, n) {
		
		// is this an assets node ?
		if (n=='assets'){
			// make our assets node
			if (this.assets_==null)	this.makeAssetObject();
			this.makeObjectsFromXML_(this.assets_, e);
			return;
		}
		
		// get class name
		var c = e.attr('type');
		
		// is this a property?
		//if (c==undefined && (e.children().length==0 || n.substr(0,2)!='K2')){
		if ((c==undefined) && (n.substr(0,2)!='K2')){
			parentObj.setObjectPropertyFromXML('set' + n, e);
			return;
		}
		
		// if no type, use node name as type, and instanceid as name
		if (c==undefined){
			c = n;
			n = 'instance' + this.world.getCurrentInstanceID();
		}
		
		// child object, make it
		var o = this.makeObjectByClassAndName(c, n);
		if (o==null) return;
		
		// go deep
		this.makeObjectsFromXML_(o, e);
		
		// add as child
		parentObj.addChild(o);
    },
//_________________________________________
	makeAssetObject: function() {
		
		this.assets_ = this.makeObjectByClass('K2Asset');
		this.assets_.setName('assets' + this.world.getCurrentInstanceID());
		this.addChild(this.assets_);
    },
//_________________________________________
	makeObjectByClassAndName: function(c, n) {
		
		var o = this.makeObjectByClass(c);
		if (o == null) return null;
		o.setName(n);
		// add to our dictionary
		this.dictionary_[o.getName()] = o;
		return o;
    },
//_________________________________________
	makeObjectByClass: function(n) {
		
		var o = k2MakeObject(n);
		if (o == null) return null;
		o.instanceid = ++this.world.currentInstances;
		o.loader_ = this;
		return o;
	},
//_________________________________________
    loadXML: function(url) {
		
		var self = this;
		jQuery.ajax({
			type: 'GET',
			url: url,
			dataType: "xml",
			cache: false,
			error: function(jqXHR, textStatus, errorThrown){
			    self.log_(url,1);
			    self.log_(textStatus,1);
			},
			success: function(data) {
				
				//var q = data.childNodes[1].textContent;
				
				self.xml_ = jQuery(data).find('k2');
				
				// create our objects
				self.makeObjectsFromXML(self, self.xml_);
				
				// if we did not aquire any dependancies, release our loader
				//if (self.loader_ && self.isReady()) self.loader_.popDependant();
					
				//self.logLoadComplete();
  			}
		});
    },
//_________________________________________
	setParent: function(p) {
		
		if (p == null){ 
			// remove to scene drawop list
			//this.setScene(null);
			K2ObjectHelper.prototype.setParent.apply(this, arguments);
		} else {
			// add from scene drawop list
			K2ObjectHelper.prototype.setParent.apply(this, arguments);
			//scene = K2Scene(findObjInParentByClass(K2Scene));
			this.world = p.loader_.world;
		}
	},
//_________________________________________
    lookupObjByName: function (n, ignore) {
		
		// do we have this object ?
		if (this.dictionary_.hasOwnProperty(n)) 
			return this.dictionary_[n];
		
		// check parent loader
		if (this.loader_==null) return null;
		var o = this.loader_.lookupObjByNameFromParent_(n, this);
		if (o) return o;
		
		// check children
		return this.lookupObjByNameFromChildren_(this, n);
	},
//_________________________________________
    lookupObjByNameFromParent_: function (n, ignore) {
		
		// do we have this object ?
		if (this.dictionary_.hasOwnProperty(n)) 
			return this.dictionary_[n];
		
		// check children
		var o = this.lookupObjByNameFromChildren_(this, n, ignore);
		if (o) return o;
		
		// go up
		if (this.loader_==null) return null;
		return this.loader_.lookupObjByNameFromParent_(n);
	},
//_________________________________________
    lookupObjByNameFromChildren_: function (o, n, ignore) {
		
		var c,r,i;
		for (i=o.children_.length-1; i>=0; --i){
			c = o.children_[i];
			// ig nore ?
			if (c==ignore) 
				continue;
			// is it a loader?
			if (c.hasOwnProperty('dictionary_')) {
				// do we have this object ?
				if (c.dictionary_.hasOwnProperty(n)) 
					return c.dictionary_[n];
			}
			// go deep
			r = this.lookupObjByNameFromChildren_(c, n);
			if (r) return r;
		}	
		return null;	
    },
//_________________________________________
	getParamaterByLinkage: function(root, lnk) {
		
		var a = lnk.split('.');
		var o = root;
		var n;
		for (var i=0; i<a.length-1; ++i){
			n = a[i];
			if (o.hasOwnProperty(n)){
				o = o[n];
			} else {
				return null;
			}
		}
		
		if (!o) 
			return null;
			
		if (!o.hasOwnProperty(a[i])) 
			return null;
			
		return {
			obj: o,
			prop: a[i]
		};		
	},
//_________________________________________
	parseXMLAsObject: function(xml){
		
		var o = {};
		this.parseXMLAsObject_(xml, o);
		return o;
	},
//_________________________________________
	parseXMLAsObject_: function(xml, p){
		
		var e,n,o;
		
		var self = this;
		xml.children().each(function(){
			
			e = jQuery(this);
			n = this.nodeName;
			
			if (e.children().length==0){
				// set property
				p[n] = jQuery.trim(e.text());
				return;
			}
			
			// its an object
			o = {};
			// go deep
			self.parseXMLAsObject_(o, e);
			
			// add as child
			p[n] = o;
		});
	},
//_________________________________________
    setPath: function (s) {
		
		// store url
		this.src_ = s;
		
		// add dependant to our loader, so it waits
		this.loader_.pushDependant();
		
		// load xml from url
		this.loadXML(k2WORLDPATH + s);
    },
//_________________________________________
	getClassName: function() {return 'K2Loader';}});



//_________________________________________
//		K2Spawner
//_________________________________________
	var K2Spawner = classExtend(K2Loader, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		K2Loader.prototype.resetObject.apply(this, arguments);

				
	},
//_________________________________________
	getClassName: function() {return 'K2Spawner';}});


	
	return {
		K2Loader: K2Loader,
		K2Spawner: K2Spawner,
	};
});
