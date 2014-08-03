k2RegisterModule("K2_MeshSphere",function () {
	
	
//_________________________________________
//		K2MeshSphere
//_________________________________________
	var K2MeshSphere = classExtend(k2Factories.K2Mesh, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Mesh.prototype.resetObject.apply(this, arguments);
		
		this.sphereVerts_ = [];
		this.sphereNormals_ = [];	
		this.sphereTexCoords_ = [];
		this.sphereFaceColors = [];  	
		this.sphereIndicies_ = [];
		
		this.radius = 0.5;
		this.numLats = 6;
		this.numLongs = 12;
	},
//_________________________________________
	findMeshElementByShaderAttribute: function(lnkname, datatype) {
		
		var m = k2Factories.K2Mesh.prototype.findMeshElementByShaderAttribute.apply(this, arguments);
		if (m) return m;
		
		if (this.sphereVerts_.length==0) this.makeSphereVerts_(this.radius, this.numLats, this.numLongs);
		
		// can we make it?
		switch (lnkname){
			case 'Position':
				m = this.loader_.makeObjectByClass('K2MeshBufferFloat');
				m.semantics_ = 'Position';
				m.elementSize = 3;
				m.buffer_ = this.sphereVerts_;
				this.addChild(m);
			break;
			case 'Normal':
				m = this.loader_.makeObjectByClass('K2MeshBufferFloat');
				m.semantics_ = 'Normal';
				m.elementSize = 3;
				m.buffer_ = this.sphereNormals_;
				this.addChild(m);
			break;
			case 'UV':
				m = this.loader_.makeObjectByClass('K2MeshBufferFloat');
				m.semantics_ = 'UV';
				m.elementSize = 2;
				m.buffer_ = this.sphereTexCoords_;
				this.addChild(m);
			break;
		}
		
		return m;
	},
//_________________________________________
	makeSphereVerts_: function(radius, lats, longs) {
		
		for (var latNumber=0; latNumber<=lats; ++latNumber) {
			for (var longNumber=0; longNumber<=longs; ++longNumber) {
				
				var theta = latNumber * Math.PI / lats;
				var phi = longNumber * 2 * Math.PI / longs;
				var sinTheta = Math.sin(theta);
				var sinPhi = Math.sin(phi);
				var cosTheta = Math.cos(theta);
				var cosPhi = Math.cos(phi);
	
				var x = cosPhi * sinTheta;
				var y = cosTheta;
				var z = sinPhi * sinTheta;
				var u = 1-(longNumber/longs);
				var v = latNumber/lats;
	
				this.sphereNormals_.push(x);
				this.sphereNormals_.push(y);
				this.sphereNormals_.push(z);
				this.sphereTexCoords_.push(u);
				this.sphereTexCoords_.push(v);
				this.sphereVerts_.push(radius * x);
				this.sphereVerts_.push(radius * y);
				this.sphereVerts_.push(radius * z);
			}
		}
	},
//_________________________________________
	getIndexBuffers: function() {
		
		if (this.meshIndexBuffers_.length>0) 
			return this.meshIndexBuffers_;
		
		// make the index buffer
		var m = this.loader_.makeObjectByClass('K2MeshBufferIndex');
		m.semantics_ = 'Index';
		m.elementSize = 3;
		this.sphereIndicies_ = this.makeSphereIndicies_(this.radius, this.numLats, this.numLongs);
		m.buffer_ = this.sphereIndicies_;
		this.addChild(m);
		this.meshIndexBuffers_.push(m);
		
		// make wireframe
		if (this.wire)
			this.convertToWire();
		
		return this.meshIndexBuffers_;
	},
//_________________________________________
	makeSphereIndicies_: function(radius, lats, longs) {
		
		var indexData = [];
		for (var latNumber=0; latNumber<lats; ++latNumber) {
			for (var longNumber=0; longNumber<longs; ++longNumber) {
				
				var first = (latNumber * (longs+1)) + longNumber;
				var second = first + longs + 1;
				
				indexData.push(first);
				indexData.push(second);
				indexData.push(first+1);
	
				indexData.push(second);
				indexData.push(second+1);
				indexData.push(first+1);
			}
		}
		return indexData;
	},
//_________________________________________
	setRadius: function(s) {
		
		this.radius = parseFloat(s);
	},
//_________________________________________
	setLats: function(s) {
		
		this.numLats = parseInt(s);
	},
//_________________________________________
	setLongs: function(s) {
		
		this.numLongs = parseInt(s);
	},
//_________________________________________
	getClassName: function() {return 'K2MeshSphere';}});


	

	
	return {
		K2MeshSphere: K2MeshSphere
	};
});
