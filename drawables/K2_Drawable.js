
k2RegisterModule("K2_Drawable",function () {
	
	
//_________________________________________
//		K2Drawable
//_________________________________________
	var K2Drawable = classExtend(k2Factories.K2XCull, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		k2Factories.K2XCull.prototype.initObject.apply(this, arguments);
		
		this.objectColor = vec4.create(K2ZEROVEC4);
	},
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2XCull.prototype.resetObject.apply(this, arguments);
		
		
        this.hasGLContext = false;
		
		this.doCulling = true;
		
		this.layer = 400;
		this.visible_ = true;
		this.autoPass_ = true;
		
		this.mesh_ = null;

		this.effect = null;
		this.technique = 0;
		this.pass = 0;
///		
		this.material = null;
		
		this.passInstances_ = [];

		// set object color
		this.randomObjectColor();
	},
//_________________________________________
	step: function(t, c, b) {

		// do movers
		for (var j=0; j<this.movers_.length; ++j)
			this.movers_[j].stepMover(t, c, b);
				
		this.updateXform_(t.timer.system_seconds);
		
//		var old = this.isCulled;
//		if (this.doCulling) 
//			this.isCulled = this.doCull_(c);
		
//		if (this.isCulled!=old)
//			this.log_('culled: '+this.isCulled+' ['+t.num_steps+']', 2);

		//this.isCulled = this.parentX_.isCulled;
//		if (this.isCulled) 
//			return;

/*		if (!this.isCulled && old)
			this.transform.pushWorld(t);
*/
//		// remove me !!!
//		if (this.name_=='sphere01'){
//			var m = this.getWorldMat();
//			var p = this.getWorldPos();
//			this.log_('p: ');
//		}		

//		if (this.parentX_.isCulled){
//			if (b) 
//				b.mergeBox(this.boundbox);
//			return;		
//		}
	
		this.boundbox.resetObject();
		//this.boundbox.mergeBox(this.indexBuffers_[0].getBoundBox());
						
		//k2Factories.K2XObject.prototype.step.apply(this, arguments);
		for (var i=this.children_.length-1; i>=0; --i)
			this.children_[i].step(t, c, this.boundbox);
		
		if (this.doCulling) 
			this.isCulled = this.doCull_(c);
			
		if (b) 
			b.mergeBox(this.boundbox);
	},
//_________________________________________
	doCull_: function(c) {
		
		return c.isSphereCulled(this.boundbox.getCenter(), this.boundbox.getRadiusXZ() * 0.5);
	},
//_________________________________________
	computeRenderMats_: function(t, cam) {
		
		// do movers
		//for (var j=0; j<this.moversF_.length; ++j)
		//	this.moversF_[j].stepMover(t, this, null);
			
		var w = (this.getXFormIntepolated()) ? this.getWorldMatF(t.frame_u) : this.getWorldMat();
		
		// get World
		this.matWorld = w;
		
		// calc WorldView
		mat4.multiply(cam.matView, w, this.matWorldView);
		
		// calc WorldViewProj
		mat4.multiply(cam.matViewProj, w, this.matWorldViewProj);
	},
//_________________________________________
	addDrawable: function(pi) {
		
		if (this.visible_ && !this.isCulled)
			this.scene.addDrawable(pi);
	},
//_________________________________________
	setContext3D: function(gl) {
		
		this.initPassInstance_(gl);
	},
//_________________________________________
	initPassInstance_: function(gl) {
		
		// do we have a effect?
		if (this.effect==null) {
			this.log_('no effect attached', 2);
			return;
		}
		
		// do we have a mesh?
		if (this.mesh_==null) {
			this.log_('no mesh attached', 2);
			return;
		}
		
		// make sure it has context
		this.mesh_.setContext3DRequested(gl);
		this.effect.setContext3DRequested(gl);
		
//		// get bound box
//		this.indexBuffers_[0].getBoundBox(this.mesh_.findMeshElementByShaderAttribute('Position', 'vec3'));

		// find index buffer
		var idxs = this.mesh_.getIndexBuffers();
		if (idxs.length==0) {
			this.log_('no index buffer', 2);
			return;
		}
		
		// check for multi material
		if (this.autoPass_){
			if (this.material.isMultiMat()){
				for (var i=idxs.length-1; i>=0; --i){
					// make pass instance
					this.makePassInstance_(i, idxs, this.material.materials[idxs[i].materialid_]);
				}
			} else {
				// make pass instance
				this.makePassInstance_(0, idxs, this.material);
			}
		}
		
		// make bounding box visualizer
		if (this.makeBounds_)
			this.makeBoundsViz_();
	},
//_________________________________________
	makePassInstance_: function(i, idxs, m) {
		
		// make pass instances
		var p = this.loader_.makeObjectByClass('K2PassInstance');
			
		p.drawable = this;
		p.indexBuffer_ = i;
		p.indexBuffers_ = idxs;
		p.effect = this.effect;
		p.technique = this.effect.getChildAt(this.technique);
		p.pass = p.technique.getChildAt(this.pass);
		p.material = m;
		p.layer = this.layer + i;
		
		this.addChild(p);
		this.passInstances_.push(p);
		return p;
	},
//_________________________________________
	makeBoundsViz_: function() {
		
		var p = this.loader_.makeObjectByClass('K2BBoxVis');
		
		p.setMaterial('matBBoxViz');
		p.setMesh('meshBBoxViz');
		p.setEffect('effectObjectColor');
		//p.layer = 850;

		this.addChild(p);
	},
//_________________________________________
	randomObjectColor: function() {
		
		// random red green blue
		vec3.set(K2ZERO, this.objectColor);
		var i = parseInt(Math.random()*3);
		this.objectColor[i] = 0.8;
				
		// set object alpha
		this.objectColor[3] = 1.0;
	},
//_________________________________________
	setMaterial: function(s) {
		
		this.material = this.linkObjectProperty('Material', s);	
	},
//_________________________________________
	getMesh: function() {
		
		return this.mesh_;	
	},
//_________________________________________
	setMesh: function(s) {
		
		this.mesh_ = this.linkObjectProperty('Mesh', s);	
	},
//_________________________________________
	getEffect: function() {
		
		return this.effect;	
	},
//_________________________________________
	setEffect: function(s) {
		
		this.effect = this.linkObjectProperty('Effect', s);	
	},
//_________________________________________
	setLayer: function(s) {
		
		this.layer = parseInt(s);
	},
//_________________________________________
	getLayer: function() {
		
		return this.layer;
	},
//_________________________________________
	setObjectColor: function(s) {
		
		vec3.set(this.parseStringAsColor(s), this.objectColor);
	},
////_________________________________________
//	setBBoxMinMax: function(s) {
//		
//		this.boundbox.setMinMax(this.parseStringAsFloatArray(s));
//	},
////_________________________________________
//	setBBoxSphere: function(s) {
//		
//		this.boundbox.setSphere(this.parseStringAsFloatArray(s));
//	},
//_________________________________________
	getClassName: function(){return 'K2Drawable';}});


	
	return {
		K2Drawable: K2Drawable
	};
});
