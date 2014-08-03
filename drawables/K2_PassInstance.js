
k2RegisterModule("K2_PassInstance",function () {
	
	

//_________________________________________
//		K2PassInstance
//_________________________________________
	var K2PassInstance = classExtend(k2Factories.K2Object, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		k2Factories.K2Object.prototype.initObject.apply(this, arguments);
		
		this.boundbox = new K2BBox();
	},
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Object.prototype.resetObject.apply(this, arguments);
		
		this.layer = 400;
		
		this.drawable = null;
		this.effect = null;
		this.technique = null;
		this.pass = null;
		this.material = null;
		
		this.indexBuffers_ = null;
		this.indexBuffer_ = 0;
		this.primativesToDraw = 0;

		this.boundbox.resetObject();
				
		this.glRenderStates = null;
		this.uniformRenderStates = null;
		this.samplerRenderStates = null;
		this.bufferRenderStates = null;
		
		this.standbyToDraw_ = true;
	},
//_________________________________________
	step: function(t, c, b) {
		
//		this.isCulled = this.parentX_.isCulled;
//		if (this.isCulled || !this.visible_ || this.standbyToDraw_) 
//			return;
//		this.updateXform_();
		
		// add the drawable list
//		if (this.drawable.visible_ && !this.drawable.isCulled)
//			this.scene.addDrawable(this);
		this.drawable.addDrawable(this);
		
//		this.boundbox.resetObject();
//		this.boundbox.mergeBox(this.indexBuffers_[0].getBoundBox());
						
//		k2Factories.K2Object.prototype.step.apply(this, arguments);
		for (var i=this.children_.length-1; i>=0; --i)
			this.children_[i].step(t, c, b);

		// set world pos for bound box
		var bb = this.indexBuffers_[this.indexBuffer_].getBoundBox();
//		var bc = bb.getCenter();
//		this.boundbox.setCenter(bc);
//		this.boundbox.moveCenter(this.drawable.transform.getWorldPos());
		bb.moveTo(this.drawable.getWorldPos(), this.boundbox);
		 		
		// merge box with drawable
		//b.mergeBox(this.indexBuffers_[this.indexBuffer_].getBoundBox());
		b.mergeBox(this.boundbox);
	},
//_________________________________________
	render: function(webgl, t, ts, c) {
		
		// set view transforms
		if (this.indexBuffer_ == 0)
			this.drawable.computeRenderMats_(ts, c);
		
		// prepare gpu for rendering
		this.applyStates(webgl);
		
		// draw
		this.indexBuffers_[this.indexBuffer_].draw(webgl.gl, this.primativesToDraw);
		
//		// prepare shader for rendering
//		if (this.effect) {
//			this.effectInstance.popStates(this.loader_.world.webgl);
//		}
	},
//_________________________________________
	setContext3D: function(gl) {
		
		this.initPassInstance_(gl);
	},
//_________________________________________
	initPassInstance_: function(gl) {
		
//		this.drawable = this.parentX_;
		
//		// do we have a effect?
//		if (this.effect==null) {
//			this.log_('no effect attached', 2);
//			return;
//		}
//		
//		// do we have a mesh?
//		if (this.mesh_==null) {
//			this.log_('no mesh attached', 2);
//			return;
//		}
		
//		// get index buffers
//		var ok = this.getIndexBuffers_();
//		if (!ok) {
//			this.log_('could not find an index buffer', 2);
//			return;
//		}
		
//		if (!this.indexBuffers_[0].hasGLContext)
//			this.indexBuffers_[0].convertToLines();
			
		// make sure it has context
		//this.mesh_.setContext3DRequested(gl);
		var ib = this.indexBuffers_[this.indexBuffer_];
		ib.setContext3DRequested(gl);
		//this.effect.setContext3DRequested(gl);
		
		// set num primatives.  Instance mesh may change this dynamically
		this.primativesToDraw = ib.getSize();
		
		// make Effect instance
		ok = this.makePassInstanceFromDrawable_(gl, this);
		if (!ok) {
			this.log_('could not connect effect', 2);
			return;
		}
		
		// get bound box
		this.boundbox.resetObject();
		var vb = this.drawable.mesh_.findMeshElementByShaderAttribute('Position', 'vec3');
		var bb = ib.getBoundBox(vb);
		if (bb) this.boundbox.mergeBox(bb);
		
		// enable
		this.standbyToDraw_ = false;
	},
////_________________________________________
//	getIndexBuffers_: function() {
//		
//		// find index buffer
//		var idxs = this.drawable.mesh_.getIndexBuffers();
//		if (idxs.length==0) return false;
//		
//		this.indexBuffers_ = idxs;
//		return true;
//	},
//_________________________________________
	makePassInstanceFromDrawable_: function(gl, d) {
		
		// store objects references		
//		this.drawable = d;
//		this.effect = d.effect;
//		this.technique = this.effect.getChildAt(d.technique);
//		this.pass = this.technique.getChildAt(d.pass);

		// instance render states from effect pass
		//this.glRenderStates = this.pass.glRenderStates.instanceForDrawable(d);
		this.uniformRenderStates = this.pass.uniformRenderStates.instanceForDrawable(d);
		this.samplerRenderStates = this.pass.samplerRenderStates.instanceForDrawable(d);
		this.bufferRenderStates = this.pass.bufferRenderStates.instanceForDrawable(d);
		
		return true;
	},
//_________________________________________
	applyStates: function(webgl) {
		
		// set gpu shader
		webgl.gl.useProgram(this.pass.shaderProgram_.glShader);

		// set shader states	
		//webgl.applyUniformStates(this.uniformRenderStates);
		webgl.applyUniformStates(this.uniformRenderStates);
		webgl.applySamplerStates(this.samplerRenderStates);
		webgl.applyBufferStates(this.bufferRenderStates);
	},
//_________________________________________
	getClassName: function() {return 'K2PassInstance';}});


	
	return {
		K2PassInstance: K2PassInstance
	};
});
