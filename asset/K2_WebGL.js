k2RegisterModule("K2_WebGL",function () {
	


//_________________________________________
	var K2WebGL = classExtend(k2Factories.K2Asset, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Asset.prototype.resetObject.apply(this, arguments);
		
		this.gl = null;
		this.canvas = null;
		
		this.canvasWidth = 256;
		this.canvasHeight = 256;
		
		this.clearColor = [0.0, 0.2, 0.44, 1.0];
		this.clearOp = ['COLOR_BUFFER_BIT','DEPTH_BUFFER_BIT']; // Clear the color as well as the depth buffer.  
		
		this.caps = {};
		this.extensions = {};
		
		// default renderstates		
		this.renderStates = {
			enable: 'DEPTH_TEST',
			depthFunc: 'LEQUAL'
		};
		this.stateStack = [this.renderStates];
		
		this.currentEffect = null;
		this.currentTechnique = null;
		this.currentPass = null;
	},
//_________________________________________
	applySamplerStates: function(states) {
		
		// reslove links, and set to gpu
		var statename,state,lnk,v;
		for (statename in states.states){
			state = states.states[statename];
			
			// get linktarget
			lnk = state.target;
			
			// resolve link to value
			v = lnk.obj[lnk.prop];
			
			// set gl sampler property
			this.applySamplerState_(this.gl, state, v);
		}
	},
//_________________________________________
	applySamplerState_: function(gl, p, v) {
		
		gl.activeTexture(gl['TEXTURE'+p.index]);
		gl.bindTexture(gl.TEXTURE_2D, v.tex_);
		gl.uniform1i(p.glposition, p.index);
	},
//_________________________________________
	applyBufferStates: function(states) {
		
		var maxslot = 0;
		
		// reslove links, and set to gpu
		var statename,state;
		for (statename in states.states){
			state = states.states[statename];
			
			// set gl sampler property
			this.applyBufferState_(this.gl, state.glposition, state.target);
			
			++maxslot;
		}

		// clear 
		for (var i=maxslot; i<5; ++i){
			this.gl.disableVertexAttribArray(i);
		}
	},
//_________________________________________
	applyBufferState_: function(gl, p, v) {
		
		gl.bindBuffer(gl.ARRAY_BUFFER, v.glbuffer_);  
		gl.enableVertexAttribArray(p);
		gl.vertexAttribPointer(p, v.elementSize, gl.FLOAT, false, 0, 0);
	},
//_________________________________________
	applyUniformStates: function(states) {
		
		// reslove links, and set to gpu
		var statename,state,lnk,v;
		for (statename in states.states){
			state = states.states[statename];
			
			// get linktarget
			lnk = state.target;
			
			// resolve link to value
			v = lnk.obj[lnk.prop];
			
			// set gl shader uniform property
			this.setGLUniform_(this.gl, state.datatype, state.glposition, v);		
//			if (state.datatype == 'mat4'){
//				//webgl.gl[state.func].apply(webgl.gl, [state.location, v]);  		
//				gl.uniformMatrix4fv(state.glposition, false, v);  			
//			} else {
//				//gl.prototype[state.glfunction].apply(gl, [state.glposition, v]);  
////				this.setGLUniform_(gl, state.datatype, state.glposition, v);		
//			}
		}
	},
//_________________________________________
	setGLUniform_: function(gl, t, p, v) {
		
		switch (t){
			case 'mat4':
				gl.uniformMatrix4fv(p, false, v);  			
				break;
			case 'vec3':
				gl.uniform3fv(p, v);  			
				break;
			case 'vec4':
				gl.uniform4fv(p, v);  			
				break;
			case 'int3':
				gl.uniform3iv(p, v);  			
				break;
			case 'int4':
				gl.uniform4iv(p, v);  			
				break;
		}
	},
////_________________________________________
//	pushStates: function(s) {
//		
//		this.applyRenderStates_(this.gl, this.stateStack[this.stateStack.length-1], s);
//		this.stateStack.push(s);
//	},
////_________________________________________
//	popStates: function() {
//		
//		var currentstate = this.stateStack.pop();
//		var prevstate = this.stateStack[this.stateStack.length-1];
//		
//		var v,state;
//		for (var statename in currentstate){
//			// get state
//			state = r[statename];
//			if (state.nop) 
//				continue;		
//			
//			state.undoState(this.gl, prevstate);
//			
////			// do we have a current state for this state ?
////			if (!prevstate.hasOwnProperty(statename)){
////				// record state
////				prevstate[statename] = state;
////				continue;
////			}
////			
////			// compare with previous state
////			if (prevstate[statename]==state){
////				continue;
////			}
////			
////			// get prev state value
////			v = gl[prevstate[statename]];
////			
////			// apply state
////			gl.prototype[statename].apply(gl, [v]);
//		}
//	},
////_________________________________________
//	applyRenderStates_: function(gl, currentstate, r) {
//		
//		var v,state;
//		for (var statename in r){
//			// get state
//			state = r[statename];
//			
//			state.applyState(gl, currentstate);
//			
////			// do we have a current state for this state ?
////			if (currentstate &&
////				currentstate.hasOwnProperty(statename) &&
////				(currentstate[statename]==state))
////				continue;		
////			
////			// get value
////			v = gl[state];
////			// apply state
////			gl.prototype[statename].apply(gl, [v]);
//		}
//	},
//_________________________________________
	setCurrentEffect: function(e) {
		
		if (this.currentEffect==e) return;
		
		this.currentEffect = e;
	},
//_________________________________________
	setCurrentTechnique: function(t) {
		
		if (this.currentTechnique==t) return;
		
		this.currentTechnique = t;
	},
//_________________________________________
	setCurrentPass: function(p) {
		
		if (this.currentPass==p) return;
		
		this.currentPass = p;
		
		// set shader
		gl.useProgram(p.shaderProgram_.shaderProgram_);
	},
//_________________________________________
	getViewPortWidth: function() {
		
		return this.canvasWidth;
	},
//_________________________________________
	getViewPortHeight: function() {
		
		return this.canvasHeight;
	},
//_________________________________________
	clear: function() {
		
		var gl = this.gl;
		var v = 0;
		for (var i=0; i<this.clearOp.length; ++i){
			v |= gl[this.clearOp[i]];
		}
		gl.clear(v);      
	},
//_________________________________________
	setParent: function(p) {
		
		k2Factories.K2Asset.prototype.setParent.apply(this, arguments);
		if (p == null) return;

		// register with world
		this.loader_.world.webgl = this;
	},
//_________________________________________
    updateContext3D: function(o, gl) {
		
		o.setContext3D(gl);
		
		for (var i=o.children_.length-1; i>=0; --i)
			this.updateContext3D(o.children_[i], gl);
    },
//_________________________________________
	create3DContext: function(c) {
		
		//console.log(c.parent().width());
		//console.log(c.parent().height());
		
		// make sure size is set
//		c.attr('width', c.parent().width());
//		c.attr('height', c.parent().height());
//		c.prop('width', 512);
//		c.prop('height', 512);
//		c.width(512);
//		c.height(512);
		
		// create web gl context
		var gl = this.create3DContext_(c[0]);
		if (gl==null) {
			this.log_('could not create context3d');
			return;
		}
			
		// set canvas
		this.canvas = c;
		c = c[0];
		
		//this.bindContextEvents_(gl);
		
		this.setViewportFromCanvas_(gl);
		
		// reset states and clear
		gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
		// Enable depth testing      
		gl.enable(gl.DEPTH_TEST);                                 
		// Near things obscure far things 
		gl.depthFunc(gl.LEQUAL);
		
		// face culling
		gl.cullFace(gl.BACK);
		gl.enable(gl.CULL_FACE);
		gl.frontFace(gl.CCW);
		
		// Clear the color as well as the depth buffer. 
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);       
		//gl.flush();
		
		this.gl = gl;
		this.log_('context3d created.',4);
		
		// get device capabilities
		this.getCaps();
		this.getGLExtensions();
		
		// update scene
		this.updateContext3D(this.loader_.world, gl);
	},
////_________________________________________
//	unbindContextEvents_: function(gl) {
//		
//		// add a lost context handler and tell it to prevent the default behavior 
//		this.canvas.unbind("webglcontextlost");
//		
//		// re-setup all your WebGL state and re-create all your WebGL resources when the context is restored. 
//		this.canvas.unbind("webglcontextrestored");
//	},
////_________________________________________
//	bindContextEvents_: function(gl) {
//		
//		var self = this;
//		
//		// add a lost context handler and tell it to prevent the default behavior 
//		this.canvas.bind("webglcontextlost", function(e) {
//			self.log_('context lost');
//			e.preventDefault();
//		}, false);
//		
//		// re-setup all your WebGL state and re-create all your WebGL resources when the context is restored. 
//		this.canvas.bind("webglcontextrestored", function(e) {
//			self.log_('context restored');
//			console.log(e);
//			//self.updateContext3D(self.loader_.world, gl);
//		}, false);
//	},
////_________________________________________
//	dispose: function() {
//		
//		this.gl.dispose();
////		this.canvas.width(this.canvas.width()*0.8);		
////		this.canvas.height(this.canvas.height()*0.8);		
//    },
//_________________________________________
	setViewportFromCanvas_: function(gl) {
		
		this.canvasWidth = this.canvas.width();
		this.canvasHeight = this.canvas.height();
//		this.canvasWidth = 256;
//		this.canvasHeight = 256;
		
		// set viewport to match canvas                                
		gl.viewport(0, 0, this.canvasWidth-1, this.canvasHeight-1);
	},
//_________________________________________
	isCanvasResized: function() {
		
		// check for resize
		if (this.canvas.height() == this.canvasHeight &&
			this.canvas.width() == this.canvasWidth)
			return false;
		return true;
	},
//_________________________________________
	doResize: function(cam) {
		
		// canvas has resized
		this.setViewportFromCanvas_(this.gl);
		cam.setProjection(this.canvasWidth, this.canvasHeight);
	},
//_________________________________________
    updateContext3D: function(o, gl) {
		
		o.setContext3D(gl);
		//o.log_('context created',4);
		
		for (var i=o.children_.length-1; i>=0; --i){
			this.updateContext3D(o.children_[i], gl);
		}
    },
//_________________________________________
	create3DContext_: function(canvas, opt_attribs) {
		
		var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
		var context = null;
		for (var ii = 0; ii < names.length; ++ii) {
			try {
				context = canvas.getContext(names[ii], opt_attribs);
			} catch(e) {}
			if (context) break;
		}
		return context;
    },
////_________________________________________
//	logGLParams: function() {
//		
//		this.logGLParam('MAX_VERTEX_TEXTURE_IMAGE_UNITS');
//		this.logGLParam('MAX_TEXTURE_IMAGE_UNITS');
//		this.logGLParam('MAX_COMBINED_TEXTURE_IMAGE_UNITS');
//		this.logGLParam('MAX_CUBE_MAP_TEXTURE_SIZE');
//		this.logGLParam('MAX_TEXTURE_SIZE');
//    },
////_________________________________________
//	logGLParam: function(s) {
//		
//		var p = this.gl.getParameter(this.gl[s]);
//		this.log_(s +': ' + p, 4);
//    },
//_________________________________________
	getGLExtensions: function() {
		
		var exts = this.gl.getSupportedExtensions();
//		for (var i=0; i<exts.length; ++i){
//			this.log_(exts[i]);
//		}
		
		// Query the extension
		this.getGLExtension_(this.gl, "WEBGL_lose_context");
		this.getGLExtension_(this.gl, "WEBGL_depth_texture");
		this.getGLExtension_(this.gl, "OES_texture_float");
   },
//_________________________________________
	getGLExtension_: function(gl, n) {
		
		var ext = gl.getExtension(n);
		if (ext==null){
			var nn = ((jQuery.browser.webkit) ? 'WEBKIT_' : 'MOZ_') + n;
			ext = gl.getExtension(nn);
		}
		this.extensions[n] = ext;
		
		// log
		//this.log_(n+': '+((ext)?'yes':'no'),2);
   },
//_________________________________________
	getCaps: function() {
		
		this.getCap_('MAX_VERTEX_TEXTURE_IMAGE_UNITS');
		this.getCap_('MAX_TEXTURE_IMAGE_UNITS');
		this.getCap_('MAX_COMBINED_TEXTURE_IMAGE_UNITS');
		this.getCap_('MAX_CUBE_MAP_TEXTURE_SIZE');
		this.getCap_('MAX_TEXTURE_SIZE');
		this.getCap_('MAX_VERTEX_ATTRIBS');
		this.getCap_('MAX_VERTEX_UNIFORM_VECTORS');
 		this.getCap_('SHADING_LANGUAGE_VERSION');
 		this.getCap_('VENDOR');
 		this.getCap_('VERSION');
   },
//_________________________________________
	getCap_: function(s) {
		
		var p = this.gl.getParameter(this.gl[s]);
		this.caps[s] = p;
		
		// log
		//this.log_(s +': ' + p, 4);
    },
//_________________________________________
	setClearColor: function(s) {
		
		this.clearColor = this.parseStringAsFloatArray(s);
	},
//_________________________________________
	setRenderStates: function(xml) {
		
		this.renderStates = this.loader_.parseXMLAsObject(xml);	
	},
//_________________________________________
	getClassName: function() {return 'K2WebGL';}});


	
	return {
		K2WebGL: K2WebGL
	};
});
