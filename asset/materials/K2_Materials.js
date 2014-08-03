k2RegisterModule("K2_Materials",function () {
	

//_________________________________________
//		K2Material
//_________________________________________
	var K2Material = classExtend(k2Factories.K2Asset, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		k2Factories.K2Asset.prototype.initObject.apply(this, arguments);
		
		this.diffusecolor = vec4.create();
		this.ambientcolor = vec4.create();
	},
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Asset.prototype.resetObject.apply(this, arguments);
		
		this.diffuse = null;
		this.lightmap = null;
		vec4.set([0.8,0.1,0.3,1.0], this.diffusecolor);
		vec4.set([0.3,0.3,0.3,1.0], this.ambientcolor);
	},
//_________________________________________
	setDiffuseMap: function(s){
		
		this.diffuse = this.linkObjectProperty('DiffuseMap', s);	
	},
//_________________________________________
	setLightMap: function(s){
		
		this.lightmap = this.linkObjectProperty('LightMap', s);	
	},
//_________________________________________
	setDiffuseColor: function(s){
		
		vec3.set(this.parseStringAsColor(s), this.diffusecolor);
	},
//_________________________________________
	setAmbientColor: function(s){
		
		vec3.set(this.parseStringAsColor(s), this.ambientcolor);
	},
//_________________________________________
	isMultiMat: function(){
		
		return false;	
	},
////_________________________________________
//	setVertexShader: function(s) {
//		
//		this.vertexShader_ = this.linkObjectProperty('VertexShader', s);
//	},
////_________________________________________
//	setPixelShader: function(s) {
//		
//		this.pixelShader_ = this.linkObjectProperty('PixelShader', s);
//	},
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
	getClassName: function() {return 'K2Material';}});




//_________________________________________
//		K2MaterialMulti
//_________________________________________
	var K2MaterialMulti = classExtend(k2Factories.K2Asset, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Asset.prototype.resetObject.apply(this, arguments);
		
		this.materials = [];
	},
//_________________________________________
	isMultiMat: function(){
		
		return true;	
	},
//_________________________________________
	setMaterials: function(s){
		
		this.materials = this.linkObjectArrayProperty('Materials', s);	
	},
//_________________________________________
	getClassName: function() {return 'K2MaterialMulti';}});



	return {
		K2Material: K2Material,
		K2MaterialMulti: K2MaterialMulti
	};
});
