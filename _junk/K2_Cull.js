

k2RegisterModule("K2_Cull",function () {

	
//_________________________________________
//		K2CullBase
//_________________________________________
	function K2CullBase(){
		
		this.resetObject();
	}
	
	K2CullBase.prototype = {
//_________________________________________
	resetObject: function() {
		
		this.states = {};
		this.numStates = 0;
	},
//_________________________________________
	step: function(t,c,b) {

		
	},
	}


//_________________________________________
//		K2CullFrustrum
//_________________________________________
	var K2CullFrustrum = classExtend(K2CullBase, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		K2CullBase.prototype.resetObject.apply(this, arguments);
		
	},
//_________________________________________
	readFromShader: function(gl, shaderprogram) {

		// regex to extract uniform variable name, datatype, and linkage from the shader
		var r = "\\uniform ((bool|int|uint|float|[biu]?vec[234]|mat[234]x?[234]?)[ \t]+([A-Za-z0-9]*);.+link\{([A-Za-z0-9.]*)\})";
		var reg = new RegExp(r, "gi");
		
		// clear uniform states
		//this.states = {};	
		//this.resetObject();
		
		// make uniform states
		var state,tmp;
		while (tmp = reg.exec(shaderprogram.textShader)){
			
			this.states[tmp[3]] = {
				name: tmp[3],
				datatype: tmp[2], 
				linkage: tmp[4],
				target: null,
				glfunction: this.getUniformFunctionName_(tmp[2]),
				glposition: gl.getUniformLocation(shaderprogram.glShader, tmp[3]),
				index: this.numStates++
			};
		};
	},
//_________________________________________
	getClassName: function() {return 'K2CullFrustrum';}});

	
	return {
		K2CullFrustrum: K2CullFrustrum
	};
});

