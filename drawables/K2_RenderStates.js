
	
//_________________________________________
//		K2RenderState
//_________________________________________
	function K2RenderStatesBase(){
		
		this.resetObject();
	}
	
	K2RenderStatesBase.prototype = {
//_________________________________________
	resetObject: function() {
		
		this.states = {};
		this.numStates = 0;
	},
////_________________________________________
//	applyStates: function(gl, currentstate) {
//		
//	},
////_________________________________________
//	undoStates: function(gl, prevstate) {
//		
//	},
//_________________________________________
	readFromShader: function(gl, shaderprogram) {

		
	},
//_________________________________________
	instanceForDrawable: function(d) {
		
		// clone this states
		var newstates = this.clone();
		
		// instance
		newstates.instanceForDrawable_(d);
		return newstates;
	},
//_________________________________________
	clone: function(c) {
		
		for (var attr in this.states) {
            if (!this.states.hasOwnProperty(attr)) continue;
			c.states[attr] = this.cloneState_(this.states[attr]);
        }
		c.numStates = this.numStates;
		return c;
	},
//_________________________________________
	cloneState_: function(state) {
		
		var c = {};
		for (var attr in state) {
            if (!state.hasOwnProperty(attr)) continue;
			c[attr] = state[attr];
        }
		return c;
	},
//_________________________________________
	isEqualTo: function(s) {
		
		return false;
	},
	}


//_________________________________________
//		K2RenderStatesUniform
//_________________________________________
	var K2RenderStatesUniform = classExtend(K2RenderStatesBase, function(){
		
	},{
//_________________________________________
	clone: function(c) {
		
		if (c==null) c = new K2RenderStatesUniform();
		
		return K2RenderStatesBase.prototype.clone.apply(this, [c])
	},
////_________________________________________
//	resetObject: function() {
//		
//		K2RenderStatesBase.prototype.resetObject.apply(this, arguments);
//		
//	},
//_________________________________________
	readFromShader: function(gl, shaderprogram) {

		// regex to extract uniform variable name, datatype, and linkage from the shader
		var r = "uniform ((bool|int|uint|float|[biu]?vec[234]|mat[234]x?[234]?)[ \t]+([\\[\\]A-Za-z0-9]*);.+link\{([A-Za-z0-9.]*)\})";
		var reg = new RegExp(r, "gi");
		
		// clear uniform states
		//this.states = {};	
		//this.resetObject();
		
		// make uniform states
		var n,i,ii,tmp;
		while (tmp = reg.exec(shaderprogram.textShader)){
			n = tmp[3];
			
			// get index if any
			i = n.indexOf('[');
			if (i>=0){
				ii = parseInt(n.substring(i+1, n.length-1));
				n = n.substring(0, i);
				i = ii;
			} else {
				i = null;
			}
			
			this.states[n] = {
				name: n,
				datatype: tmp[2],
				arraylen: i, 
				linkage: tmp[4],
				target: null,
				glfunction: this.getUniformFunctionName_(tmp[2]),
				glposition: gl.getUniformLocation(shaderprogram.glShader, n),
				index: this.numStates++
			};
		};
	},
//_________________________________________
	getUniformFunctionName_: function(datatype) {
		
		switch (datatype){
			case 'mat4':
				return 'uniformMatrix4fv';
			case 'vec4':
				return 'uniform4fv';
			case 'vec3':
				return 'uniform3fv';
			case 'int3':
				return 'uniform3iv';
			case 'int4':
				return 'uniform4iv';
		}
		return '';
	},
//_________________________________________
	instanceForDrawable_: function(d) {
		
		// go thru shader's uniform links
		var state,statename;
		for (statename in this.states){
			state = this.states[statename];
			
			// ask loader for property
			state.target = d.loader_.getParamaterByLinkage(d, state.linkage);
			
			if (state.target==null){
				d.log_('could not link shader: '+statename+'  '+state.linkage, 0);
				//ok = false;
			}
		}
	},
////_________________________________________
//	applyStates: function(gl, currentstate) {
//		
//		// reslove links, and set to gpu
//		var statename,state,lnk,v;
//		for (statename in this.states){
//			state = this.states[statename];
//			
//			// get linktarget
//			lnk = state.target;
//			
//			// resolve link to value
//			v = lnk.obj[lnk.prop];
//			
//			// set gl shader uniform property
//			this.setGLUniform_(gl, state.datatype, state.glposition, v);		
////			if (state.datatype == 'mat4'){
////				//webgl.gl[state.func].apply(webgl.gl, [state.location, v]);  		
////				gl.uniformMatrix4fv(state.glposition, false, v);  			
////			} else {
////				//gl.prototype[state.glfunction].apply(gl, [state.glposition, v]);  
//////				this.setGLUniform_(gl, state.datatype, state.glposition, v);		
////			}
//		}
//	},
////_________________________________________
//	setGLUniform_: function(gl, t, p, v) {
//		
//		switch (t){
//			case 'mat4':
//				gl.uniformMatrix4fv(p, false, v);  			
//				break;
//			case 'vec3':
//				gl.uniform3fv(p, v);  			
//				break;
//			case 'vec4':
//				gl.uniform4fv(p, v);  			
//				break;
//			case 'int3':
//				gl.uniform3iv(p, v);  			
//				break;
//			case 'int4':
//				gl.uniform4iv(p, v);  			
//				break;
//		}
//	}
////_________________________________________
//	undoState: function(gl, prevstate) {
//		
//		//if (this.nop) return;
//		
//		// do we have a current state for this state ?
//		if (!prevstate.hasOwnProperty(this.statename)){
//			// record state
//			prevstate[this.statename] = this;
//			return;
//		}
//		
//		// compare with previous state
//		if (this.isEqualTo(prevstate)){
//			return;
//		}
//		
////		// get prev state value
////		var v = gl[prevstate[this.statename]];
////		
////		// apply state
////		gl.prototype[this.statename].apply(gl, [v]);
//	},
////_________________________________________
//	isEqualTo: function(s) {
//		
//		return true; // (s.statevalue==this.statevalue);
//	},
	});


	
//_________________________________________
//		K2RenderStatesSampler
//_________________________________________
	var K2RenderStatesSampler = classExtend(K2RenderStatesBase, function(){
		
	},{
//_________________________________________
	clone: function(c) {
		
		if (c==null) c = new K2RenderStatesSampler();
		
		//var c = jQuery(this).clone();
		return K2RenderStatesBase.prototype.clone.apply(this, [c])
	},
////_________________________________________
//	resetObject: function() {
//		
//		K2RenderStatesBase.prototype.resetObject.apply(this, arguments);
//		
//	},
//_________________________________________
	readFromShader: function(gl, shaderprogram) {

		// regex to extract uniform variable name, datatype, and link from the shader
		var r = "\\uniform ((sampler[23]D)[ \t]+([A-Za-z0-9]*);.+link\{([A-Za-z0-9.]*)\})";
		var reg = new RegExp(r, "gi");
		
		// clear uniform states
		//this.states = {};	
		//this.resetObject();
		
		var tmp;
		while (tmp = reg.exec(shaderprogram.textShader)){
			
			this.states[tmp[3]] = {
				name: tmp[3],
				datatype: tmp[2], 
				linkage: tmp[4],
				target: null,
				glfunction: null,
				glposition: gl.getUniformLocation(shaderprogram.glShader, tmp[3]),
				index: this.numStates++
			};
		};
	},
//_________________________________________
	instanceForDrawable_: function(d) {
		
		// go thru shader's uniform links
		var state,statename,lnk,v;
		for (statename in this.states){
			state = this.states[statename];
			
			// ask loader for property
			state.target = d.loader_.getParamaterByLinkage(d, state.linkage);
			
			// make sure its loaded in gpu
			lnk = state.target;
			if (state.target==null){
				d.log_('could not link shader: '+statename+'  '+state.linkage, 0);
				//ok = false;
				continue;
			}
			v = lnk.obj[lnk.prop];
			if (v==null){
				d.log_('could not link shader: '+statename+'  '+state.linkage, 0);
				//ok = false;
				continue;
			}
			v.setContext3DRequested(d.loader_.world.webgl.gl);
			
		}
	},
//_________________________________________
	applyStates: function(gl, currentstate) {
		
		// reslove links, and set to gpu
		var statename,state,lnk,v;
		for (statename in this.states){
			state = this.states[statename];
			
			// get linktarget
			lnk = state.target;
			
			// resolve link to value
			v = lnk.obj[lnk.prop];
			
			// set gl sampler property
			this.applyState_(gl, state, v);
		}
	},
//_________________________________________
	applyState_: function(gl, p, v) {
		
		gl.activeTexture(gl['TEXTURE'+p.index]);
		gl.bindTexture(gl.TEXTURE_2D, v.tex_);
		gl.uniform1i(p.glposition, p.index);
	},
////_________________________________________
//	isEqualTo: function(s) {
//		
//		return (s.statevalue==this.statevalue);
//	},
	});


//_________________________________________
//		K2RenderStatesBuffer
//_________________________________________
	var K2RenderStatesBuffer = classExtend(K2RenderStatesBase, function(){
		
	},{
//_________________________________________
	clone: function(c) {
		
		if (c==null) c = new K2RenderStatesBuffer();
		
		//var c = jQuery(this).clone();
		return K2RenderStatesBase.prototype.clone.apply(this, [c])
	},
////_________________________________________
//	resetObject: function() {
//		
//		K2RenderStatesBase.prototype.resetObject.apply(this, arguments);
//
//	},
//_________________________________________
	readFromShader: function(gl, shaderprogram) {

		var r = "\\attribute ((bool|int|uint|float|[biu]?vec[234]|mat[234]x?[234]?)[ \t]+([A-Za-z0-9]*);.+index\{([A-Za-z0-9.]*)\})";
		var reg = new RegExp(r, "gi");
		
		// clear uniform states
		//this.states = {};	
		//this.resetObject();
		
		var tmp;
		while (tmp = reg.exec(shaderprogram.textShader)){
			
			this.states[tmp[3]] = {
				name: tmp[3],
				datatype: tmp[2], 
				linkage: tmp[4],
				target: null,
				glfunction: null,
				glposition: gl.getAttribLocation(shaderprogram.glShader, tmp[3]),
				index: this.numStates++
			};
			
			// enable
			//gl.enableVertexAttribArray(this.states[tmp[3]].glposition);
		};
	},
//_________________________________________
	instanceForDrawable_: function(d) {
		
		// go thru shader's uniform links
		var state,statename;
		for (statename in this.states){
			state = this.states[statename];
			
			// ask mesh for compatible buffer
			state.target = d.drawable.mesh_.findMeshElementByShaderAttribute(statename, state.datatype);
			
			if (state.target==null){
				d.log_('could not link buffer: '+statename+'  '+state.linkage, 0);
				//ok = false;
				continue;
			}
			
			// make sure its loaded in gpu
			state.target.setContext3DRequested(d.loader_.world.webgl.gl);
		}
	},
////_________________________________________
//	applyStates: function(gl, currentstate) {
//		
//		var maxslot = 0;
//		
//		// reslove links, and set to gpu
//		var statename,state;
//		for (statename in this.states){
//			state = this.states[statename];
//			
//			// set gl sampler property
//			this.applyState_(gl, state.glposition, state.target);
//			
//			++maxslot;
//		}
//
//		// clear 
//		for (var i=maxslot; i<5; ++i){
//			gl.disableVertexAttribArray(i);
//		}
//	},
////_________________________________________
//	applyState_: function(gl, p, v) {
//		
//		gl.bindBuffer(gl.ARRAY_BUFFER, v.glbuffer_);  
//		gl.enableVertexAttribArray(p);
//		gl.vertexAttribPointer(p, v.elementSize, gl.FLOAT, false, 0, 0);
//	},
////_________________________________________
//	isEqualTo: function(s) {
//		
//		return (s.statevalue==this.statevalue);
//	},
	});




//_________________________________________
//		K2RenderStatesGL
//_________________________________________
	var K2RenderStatesGL = classExtend(K2RenderStatesBase, function(){
		
	},{
//_________________________________________
	clone: function(c) {
		
		if (c==null) c = new K2RenderStatesGL();
		
		return K2RenderStatesBase.prototype.clone.apply(this, [c])
	},
////_________________________________________
//	resetObject: function() {
//		
//		K2RenderStatesBase.prototype.resetObject.apply(this, arguments);
//
//		this.statevalue = '';
//	},
//_________________________________________
	applyState: function(gl, currentstate) {
		
		if (currentstate &&
			currentstate.hasOwnProperty(this.statename) &&
			this.isEqualTo(currentstatee[this.statename])){
			this.nop = true;
			return;	
		}
	
		// get value
		var v = gl[this.statevalue];
		// apply state
		gl.prototype[this.statename].apply(gl, [v]);
	},
//_________________________________________
	undoState: function(gl, prevstate) {
		
		//if (this.nop) return;
		
		// do we have a current state for this state ?
		if (!prevstate.hasOwnProperty(this.statename)){
			// record state
			prevstate[this.statename] = this;
			return;
		}
		
		// compare with previous state
		if (this.isEqualTo(prevstate)){
			return;
		}
		
		// get prev state value
		var v = gl[prevstate[this.statename]];
		
		// apply state
		gl.prototype[this.statename].apply(gl, [v]);
	},
//_________________________________________
	isEqualTo: function(s) {
		
		return (s.statevalue==this.statevalue);
	},
//_________________________________________
	setState: function(o) {
		
		this.statename = o.name;
		this.statevalue = o.value;
	},
//_________________________________________
	instanceForDrawable: function(d) {
		
		var c = this.clone();
		return c;
	},
	});


