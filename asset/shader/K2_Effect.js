
k2RegisterModule("K2_Effect",function () {


//_________________________________________
//		K2EffectBase
//_________________________________________
	var K2EffectBase = classExtend(k2Factories.K2Asset, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		k2Factories.K2Asset.prototype.initObject.apply(this, arguments);
		
		//this.glRenderStates = new K2RenderStatesGL();
		this.uniformRenderStates = new K2RenderStatesUniform();
		this.samplerRenderStates = new K2RenderStatesSampler();
		this.bufferRenderStates = new K2RenderStatesBuffer();
	},
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Asset.prototype.resetObject.apply(this, arguments);
		
        this.hasGLContext = false;
		
		//this.glRenderStates.resetObject();
		this.uniformRenderStates.resetObject();
		this.samplerRenderStates.resetObject();
		this.bufferRenderStates.resetObject();

		//this.glRenderStatesObject = null;
		this.uniformRenderStatesObject = null;
		this.samplerRenderStatesObject = null;
		this.bufferRenderStatesObject = null;
	},
//_________________________________________
	setContext3D: function(gl) {
		
	},
////_________________________________________
//	setStates: function(xml) {
//		
//		this.glRenderStatesObject = this.loader_.parseXMLAsObject(xml);	
//	},
//_________________________________________
	setUniforms: function(xml) {
		
		this.uniformRenderStatesObject = this.loader_.parseXMLAsObject(xml);	
	},
//_________________________________________
	setSamplers: function(xml) {
		
		this.samplerRenderStatesObject = this.loader_.parseXMLAsObject(xml);	
	},
//_________________________________________
	setBuffers: function(xml) {
		
		this.bufferRenderStatesObject = this.loader_.parseXMLAsObject(xml);	
	},
//_________________________________________
    setContext3DRequested: function(gl) {
		
		if (this.hasGLContext) return;
		
		// set context
		this.setContext3DRequested_(gl);
		
		// go deep
		for (var i=this.children_.length-1; i>=0; --i){
			this.children_[i].setContext3DRequested(gl);
		}
 	},
//_________________________________________
    setContext3DRequested_: function(gl) {
		
		// default
		this.hasGLContext = true;
 	},
//_________________________________________
	getClassName: function() {return 'K2EffectBase';}});
	
	
	
//_________________________________________
//		K2Effect
//_________________________________________
	var K2Effect = classExtend(K2EffectBase, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		K2EffectBase.prototype.resetObject.apply(this, arguments);
		
//		this.renderStates = {};
	},
//_________________________________________
	setContext3D: function(gl) {
		
	},
//_________________________________________
	getPass: function(t, p) {
		
		if (t>=this.children_.length) 
			return null;
		var tech = this.getChildAt(t);
		if (p>=tech.children_.length) 
			return null;
		return t.getChildAt(p);
	},
//_________________________________________
	getClassName: function() {return 'K2Effect';}});
	
	
	
//_________________________________________
//		K2Technique
//_________________________________________
	var K2Technique = classExtend(K2EffectBase, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		K2EffectBase.prototype.resetObject.apply(this, arguments);
		
		this.effect = null;
	},
//_________________________________________
	setParent: function(p) {
		
		k2Factories.K2Asset.prototype.setParent.apply(this, arguments);
		
		if (p==null){ 
			this.effect = null;
			return;
		}
		
		// find parent effect
		//var v = new K2Visitor();
		this.effect = this.loader_.findParentByClassName(this, 'K2Effect');
	},
//_________________________________________
	getClassName: function() {return 'K2Technique';}});
	
	
	
//_________________________________________
//		K2Pass
//_________________________________________
	var K2Pass = classExtend(K2EffectBase, function(){
		
	},{
////_________________________________________
//	initObject: function() {
//		
//		K2EffectBase.prototype.initObject.apply(this, arguments);
//	},
//_________________________________________
	resetObject: function() {
		
		K2EffectBase.prototype.resetObject.apply(this, arguments);
		
		this.technique = null;

		this.vertexShader_ = null;
		this.pixelShader_ = null;
		this.shaderProgram_ = null;
		
		this.material = null;
		this.mesh_ = null;
		
		//this.indexBuffers_ = [];
	},
//_________________________________________
	setParent: function(p) {
		
		K2EffectBase.prototype.setParent.apply(this, arguments);
		
		if (p==null){ 
			this.technique = null;
			return;
		}
		
		// find parent technique
		//var v = new K2Visitor();
		this.technique = this.loader_.findParentByClassName(this, 'K2Technique');
	},
//_________________________________________
    setContext3DRequested_: function(gl) {
		
		this.makeShaderProgram_(gl, this.vertexShader_, this.pixelShader_);
		this.hasGLContext = (this.shaderProgram_!=null);
		if (!this.hasGLContext) return;
		
		// make renderstates
		//this.glRenderStates.readFromObject(gl, this.shaderProgram_);
		this.uniformRenderStates.readFromShader(gl, this.shaderProgram_);
		this.samplerRenderStates.readFromShader(gl, this.shaderProgram_);
		this.bufferRenderStates.readFromShader(gl, this.shaderProgram_);
 	},
//_________________________________________
	makeShaderProgram_: function(gl, v, p) {
		
		// get vertex and pixel shaders
		if (!(p && v)) 
			return null;
	
		this.shaderProgram_ = this.makeShaderProgram__(gl, v, p);
		return this.shaderProgram_;
	},
//_________________________________________
	makeShaderProgram__: function(gl, v, p) {
		
		// combined name
		var n = v.getName() + p.getName();
		
		// set program
		var prog = this.loader_.lookupObjByName(n);
		if (prog) return prog;
		
		// make it
		prog = this.loader_.makeObjectByClassAndName('K2ShaderProgram', n);
		prog.vertexShader_ = v;
		prog.pixelShader_ = p;
		prog.setContext3DRequested(gl);
		
		return prog;

		//k2Log(gl.getProgramParameter(this.shaderProgram_, gl.ACTIVE_UNIFORMS));
	},
//_________________________________________
	setVertexShader: function(s) {
		
		this.vertexShader_ = this.linkObjectProperty('VertexShader', s);	
	},
//_________________________________________
	setPixelShader: function(s) {
		
		this.pixelShader_ = this.linkObjectProperty('PixelShader', s);	
	},
//_________________________________________
	getClassName: function() {return 'K2Pass';}});
	


	return {
		K2Pass: K2Pass,
		K2Technique: K2Technique,
		K2Effect: K2Effect
	};
});

	
