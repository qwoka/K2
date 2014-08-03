k2RegisterModule("K2_Shader",function () {
	
	
//_________________________________________
//		K2Shader
//_________________________________________
	var K2Shader = classExtend(k2Factories.K2Asset, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Asset.prototype.resetObject.apply(this, arguments);
		
        this.hasGLContext = false;
		
		this.textShader = '';		
		this.glShader = null;	
	},
//_________________________________________
	setContext3D: function(gl) {
		
		this.compileShader(gl);
	},
//_________________________________________
	compileShader: function(gl) {
		
		if (this.textShader.length == 0) return;
		
		this.glShader = gl.createShader(this.getShaderType(gl));
		
		gl.shaderSource(this.glShader, this.textShader);
   		gl.compileShader(this.glShader);
 
   		if (!gl.getShaderParameter(this.glShader, gl.COMPILE_STATUS)) {
      		this.log_('Shader compile error');  
			this.log_(gl.getShaderInfoLog(this.glShader));
			return;
    	}
	},
//_________________________________________
    setSrc: function (s) {
		
		this.textShader = s;
    },
//_________________________________________
    setPath: function (s) {
		
		this.src_ = s;
		this.loadText(this.src_);
    },
//_________________________________________
    getShaderType: function (gl) {
		
		return gl.VERTEX_SHADER;
    },
//_________________________________________
    loadText: function(url) {
		
		var self = this;
		jQuery.ajax({
			type: 'GET',
			url: url,
			cache: false,
			dataType: "text",
			success: function(data) {
				self.logLoadComplete();
				self.setSrc(data);	
  			}
		});
    },
//_________________________________________
	getClassName: function() {return 'K2Shader';}});




//_________________________________________
//		K2VertexShader
//_________________________________________
	var K2VertexShader = classExtend(K2Shader, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		K2Shader.prototype.resetObject.apply(this, arguments);
	},
//_________________________________________
	getClassName: function() {return 'K2VertexShader';}});


	
	
//_________________________________________
//		K2PixelShader
//_________________________________________
	var K2PixelShader = classExtend(K2Shader, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		K2Shader.prototype.resetObject.apply(this, arguments);
	},
//_________________________________________
    getShaderType: function (gl) {
		
		return gl.FRAGMENT_SHADER;
    },
//_________________________________________
	getClassName: function() {return 'K2PixelShader';}});




//_________________________________________
//		K2ShaderProgram
//_________________________________________
	var K2ShaderProgram = classExtend(k2Factories.K2Asset, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Asset.prototype.resetObject.apply(this, arguments);
		
        this.hasGLContext = false;
		
		this.textShader = '';
		this.vertexShader_ = null;
		this.pixelShader_ = null;
		this.glShader = null;	
				
		//this.shaderParamUniforms = new K2RenderStatesUniform();
	},
//_________________________________________
    setContext3DRequested_: function(gl) {
		
		this.createProgram_(gl);
	},
//_________________________________________
	createProgram_: function(gl) {
		
		// get vertex and pixel shaders
		var v = this.vertexShader_;
		var p = this.pixelShader_;
		if (!(p && v && p.glShader && v.glShader)) {
			this.log_('missing vertex or pixel shader');
			return;
		}
		
		// compile program
		this.glShader = this.compileProgram_(gl, v.glShader, p.glShader);
		this.textShader = v.textShader + '\n' + p.textShader;
	},
//_________________________________________
	compileProgram_: function(gl, v, p) {
		
		// compile
		var shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, v);
		gl.attachShader(shaderProgram, p);
		gl.linkProgram(shaderProgram);		
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			this.log_("Could not initialise shader program");
			return null;
		}
		
		// combine links
		return shaderProgram;
	},
//_________________________________________
	setVertexShader: function(s) {
		
		this.vertexShader_ = this.linkObjectProperty('VertexShader', s);	
	},
//_________________________________________
	setPixelShader: function(s) {
		
		this.pixelShader_ = this.linkObjectProperty('PixelShader', s);	
	},
////_________________________________________
//	getVertexShader: function() {
//		
//		if (this.vertexShader_) return this.vertexShader_;	
//		return null;		
//	},
////_________________________________________
//	getPixelShader: function() {
//		
//		if (this.pixelShader_) return this.pixelShader_;	
//		return null;	
//	},
//_________________________________________
	getClassName: function() {return 'K2ShaderProgram';}});
	
	


	return {
		K2VertexShader: K2VertexShader,
		K2PixelShader: K2PixelShader,
		K2ShaderProgram: K2ShaderProgram,
	};
});
