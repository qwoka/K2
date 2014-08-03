k2RegisterModule("K2_Mesh",function () {
	
	
//_________________________________________
//		K2Mesh
//_________________________________________
	var K2Mesh = classExtend(k2Factories.K2Asset, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Asset.prototype.resetObject.apply(this, arguments);

        this.hasGLContext = false;
				
		this.meshIndexBuffers_ = [];
		this.meshVertexBuffers_ = [];
		
		this.flipFaces = false;
		this.wire = false;
		this.vertexShader_ = null;
	},
//_________________________________________
    setContext3DRequested_: function(gl) {
		
		this.findMeshBuffers_();
		this.hasGLContext = true;
 	},
//_________________________________________
	findMeshBuffers_: function() {
		
		//var v = new K2Visitor();
		this.meshVertexBuffers_ = this.loader_.getChildrenByClassName(this, 'K2MeshBuffer');
		
		// seperate the index buffers
		this.meshIndexBuffers_.splice(0, this.meshIndexBuffers_.length);
		var b,i;
		for (i=this.meshVertexBuffers_.length-1; i>=0; --i){
			b = this.meshVertexBuffers_[i];
			if (!b.isTypeOfByClassName('K2MeshBufferIndex')) continue;
			this.meshIndexBuffers_.push(b);
			this.meshVertexBuffers_.splice(i,1);
		}
		
		// flip faces
		if (this.flipFaces){
			for (i=this.meshIndexBuffers_.length-1; i>=0; --i){
				b = this.meshIndexBuffers_[i];
				b.flipFaces();
			}
		}			
		
		// make wireframe
		if (this.wire)
			this.convertToWire();
	},
//_________________________________________
	convertToWire: function() {
		
		var b;
		for (var i=this.meshIndexBuffers_.length-1; i>=0; --i){
			b = this.meshIndexBuffers_[i];
			b.convertToLines();
		}
	},
//_________________________________________
	getIndexBuffer: function(i) {
		
		return this.meshIndexBuffers_[i];
	},
//_________________________________________
	getIndexBuffers: function() {
		
		return this.meshIndexBuffers_;
	},
//_________________________________________
	findMeshElementByShaderAttribute: function(lnkname, datatype) {
		
		var e;
		for (var i=this.meshVertexBuffers_.length-1; i>=0; --i){
			e = this.meshVertexBuffers_[i];
			
			if (e.matchMeshElementToShaderAttribute(lnkname, datatype)) 
				return e;
		}
		return null;
	},
//_________________________________________
	setVertexShader: function(s) {
		
		this.vertexShader_ = this.linkObjectProperty('VertexShader', s);	
	},
//_________________________________________
	getNumVerts: function() {
		
		if (this.meshVertexBuffers_.length==0) return 0;	
		return this.meshVertexBuffers_[0].getNumElements();		
	},
//_________________________________________
	getVertexShader: function() {
		
		if (this.vertextShader_) return this.vertexShader_;	
		return null;		
	},
//_________________________________________
	setFlip: function(s) {
		
		this.flipFaces = this.parseStringAsBool(s);
	},
//_________________________________________
	setWire: function(s) {
		
		this.wire = this.parseStringAsBool(s);
	},
//_________________________________________
	getClassName: function() {return 'K2Mesh';}});



//_________________________________________
//		K2MeshBuffer
//_________________________________________
	var K2MeshBuffer = classExtend(k2Factories.K2Asset, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Asset.prototype.resetObject.apply(this, arguments);

        this.hasGLContext = false;
		
		this.buffer_ = [];
		this.glbuffer_ = null;
		this.validAttributeDataTypes = [];
		this.semantics_ = '';
		this.elementSize = 3;
	},
//_________________________________________
    setContext3DRequested_: function(gl) {
		
		this.makeGLBuffer(gl);
		this.hasGLContext = true;
 	},
//_________________________________________
    makeGLBuffer: function(gl, buf) {
		
 	},
//_________________________________________
	setSemantics: function(s) {
		
		this.semantics_ = s;
	},
//_________________________________________
	setElementsPerVertex: function(s) {
		
		this.elementSize = parseInt(s);
	},
//_________________________________________
	getNumElements: function() {
		
		return this.buffer_.length / this.elementSize;
	},
//_________________________________________
	getSize: function() {
		
		return this.buffer_.length;
	},
//_________________________________________
	setCount: function(s) {
		
		//return this.buffer_.length;
	},
//_________________________________________
	setBuffer: function(xml) {
		
		this.setBufferFromXML_(xml);
	},
//_________________________________________
	setBufferFromXML_: function(xml) {
		
		// set buffer from xml
		var self = this;
		jQuery(xml).children().each(function(){
			var a = self.parseBufferArray_(jQuery.trim(jQuery(this).text()));
			self.buffer_ = self.buffer_.concat(a);
		});
		
		// validate
		var	count = xml.attr('count');
		if (count && (count != this.buffer_.length)){			
			this.log_('count of verts and actual do not match:'+this.buffer_.length);
		}
	},
//_________________________________________
	parseBufferArray_: function(s) {
		
	},
//_________________________________________
	getClassName: function() {return 'K2MeshBuffer';}});




//_________________________________________
//		K2MeshBufferFloat
//_________________________________________
	var K2MeshBufferFloat = classExtend(K2MeshBuffer, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		K2MeshBuffer.prototype.resetObject.apply(this, arguments);

		this.validAttributeDataTypes = ['vec'];
		this.scale_ = vec3.create([1,1,1]);
		this.semantics_ = 'Position';
	},
//_________________________________________
    makeGLBuffer: function(gl) {
		
		this.glbuffer_ = gl.createBuffer();  
		gl.bindBuffer(gl.ARRAY_BUFFER, this.glbuffer_);  
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.buffer_), gl.STATIC_DRAW); 
		//gl.vertexAttribPointer(vertexPositionAttribute, this.elementSize, gl.FLOAT, false, 0, 0);    		
		gl.bindBuffer(gl.ARRAY_BUFFER, null);  
 	},
//_________________________________________
	matchMeshElementToShaderAttribute: function(lnkname, datatype) {
		
		// remove last number
		var d = datatype.substr(0,datatype.length-1);
		
		// validate via datatType
		var i = this.validAttributeDataTypes.indexOf(d);
		if (i<0) return false;
		
		// validate via semantics
		if (lnkname!=this.semantics_)
			return false;
		
		return true;
	},
//_________________________________________
	parseBufferArray_: function(s) {
		
		return this.parseStringAsFloatArray(s);
	},
//_________________________________________
	setScale: function(s) {
		
		this.scale_ = vec3.create(this.parseStringAsFloatArray(s));
	},
//_________________________________________
	getClassName: function() {return 'K2MeshBufferFloat';}});

	
	
//_________________________________________
//		K2MeshBufferInt
//_________________________________________
	var K2MeshBufferInt = classExtend(K2MeshBuffer, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		K2MeshBuffer.prototype.resetObject.apply(this, arguments);

		this.validAttributeDataTypes = ['int','uint'];
		this.semantics_ = 'XIndex';
		this.elementSize = 1;
	},
//_________________________________________
    makeGLBuffer: function(gl) {
		
		this.glbuffer_ = gl.createBuffer();  
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.glbuffer_);  
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.buffer_), gl.STATIC_DRAW); 
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);  
 	},
//_________________________________________
	parseBufferArray_: function(s) {
		
		return this.parseStringAsIntArray(s);
	},
//_________________________________________
	getClassName: function() {return 'K2MeshBufferInt';}});

	
//_________________________________________
//		K2MeshBufferIndex
//_________________________________________
	var K2MeshBufferIndex = classExtend(K2MeshBufferInt, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		K2MeshBufferInt.prototype.resetObject.apply(this, arguments);

		this.validAttributeDataTypes = ['uint'];
		//this.semantics_ = 'Index';
		
		this.primativeType = 'TRIANGLES';	// TRIANGLES LINES POINTS
		this.semantics_ = 'TRIANGLES';
		this.materialid_ = 0;
		
		this.boundbox = null;
	},
//_________________________________________
    makeGLBuffer: function(gl) {
		
		this.glbuffer_ = gl.createBuffer();  
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.glbuffer_);  
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.buffer_), gl.STATIC_DRAW); 
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);  
 	},
//_________________________________________
    draw: function(gl, numprimatives) {
		
		// for instancing
		if (!numprimatives) numprimatives = this.getSize();
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.glbuffer_);  
		gl.drawElements(gl[this.primativeType], numprimatives, gl.UNSIGNED_SHORT, 0);  
 	},
//_________________________________________
    flipFaces: function() {
		
		var t;
		for (var i=this.getSize()-1; i>=0; --i){
			// swap faces
			t = this.buffer_[i];
			this.buffer_[i] = this.buffer_[i-1];
			--i;
			this.buffer_[i] = t;
			--i;
		}
 	},
//_________________________________________
    convertToLines: function() {
		
		var old = this.buffer_;
		var b = [];
		
		var n=this.getSize()-1;
		for (var i=0; i<n; ++i){
			b.push(old[i]);
			b.push(old[i+1]);			
		}
		//b.push(old[i]);
		
		this.buffer_ = b;
		this.elementSize = 2;
		this.primativeType = 'LINES';	// TRIANGLES LINES POINTS
 	},
//_________________________________________
	setPrimative: function(s) {
		
		this.primativeType = s;
	},
//_________________________________________
	getBoundBox: function(v) {
		
		if (this.boundbox) 
			return this.boundbox;
		
		if (!v) 
			return null;
		
		// compute bound box
		this.boundbox = new K2BBox();
		this.boundbox.computeFromTris(v.buffer_, v.elementSize, this.buffer_);
		return this.boundbox;
	},
//_________________________________________
	setMaterialID: function(s) {
		
		this.materialid_ = parseInt(s);
	},
//_________________________________________
	getClassName: function() {return 'K2MeshBufferIndex';}});


	
	return {
		K2Mesh: K2Mesh,
		K2MeshBufferFloat: K2MeshBufferFloat,
		K2MeshBufferInt: K2MeshBufferInt,
		K2MeshBufferIndex: K2MeshBufferIndex,
	};
});
