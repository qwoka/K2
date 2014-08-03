k2RegisterModule("K2_MeshPlane",function () {
	
	
//_________________________________________
//		K2MeshPlane
//_________________________________________
	var K2MeshPlane = classExtend(k2Factories.K2Mesh, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Mesh.prototype.resetObject.apply(this, arguments);
		
		this.planeVerts_ = [];
		this.planeNormals_ = [];	
		this.planeTexCoords_ = [];
		this.planeFaceColors = [];  	
		this.planeIndicies_ = [];
		
		this.width = 1.0;
		this.height = 1.0;
		this.divisionsX = 1;
		this.divisionsY = 1;
	},
//_________________________________________
	findMeshElementByShaderAttribute: function(lnkname, datatype) {
		
		var m = k2Factories.K2Mesh.prototype.findMeshElementByShaderAttribute.apply(this, arguments);
		if (m) return m;
		
		if (this.planeVerts_.length==0) 
			this.makePlaneVerts_(this.width, this.height, this.divisionsX, this.divisionsY);
		
		// can we make it?
		switch (lnkname){
			case 'Position':
				m = this.loader_.makeObjectByClass('K2MeshBufferFloat');
				m.semantics_ = 'Position';
				m.elementSize = 3;
				m.buffer_ = this.planeVerts_;
				this.addChild(m);
			break;
			case 'Normal':
				m = this.loader_.makeObjectByClass('K2MeshBufferFloat');
				m.semantics_ = 'Normal';
				m.elementSize = 3;
				m.buffer_ = this.planeNormals_;
				this.addChild(m);
			break;
			case 'UV':
				m = this.loader_.makeObjectByClass('K2MeshBufferFloat');
				m.semantics_ = 'UV';
				m.elementSize = 2;
				m.buffer_ = this.planeTexCoords_;
				this.addChild(m);
			break;
		}
		
		return m;
	},
//_________________________________________
	makePlaneVerts_: function(w, h, divx, divy) {
		
		var sepx = w/divx;
    	var sepy = h/divy;
		
		var tcy = 0;
		var steptcx = 1.0/divx; // increments
		var steptcy = 1.0/divy;
		var dx = w/2.0;
		var dy = h/2.0;
		var y = -dy;		
	
		for (var j = 0; j <= divy; j++, tcy += steptcy, y += sepy){
			var tcx = 0;
			var x = -dx;
			for (var i = 0; i <= divx; i++, tcx += steptcx, x += sepx){
				this.planeVerts_.push(x);
				this.planeVerts_.push(y);
				this.planeVerts_.push(0);
				// TODO: optimize this in the shader?
				this.planeNormals_.push(0);
				this.planeNormals_.push(0);
				this.planeNormals_.push(1);
				this.planeTexCoords_.push(tcx);
				this.planeTexCoords_.push(tcy);
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
		this.planeIndicies_ = this.makePlaneIndicies_(this.width, this.height, this.divisionsX, this.divisionsY);
		m.buffer_ = this.planeIndicies_;
		this.addChild(m);
		this.meshIndexBuffers_.push(m);
		
		//this.log_('tris: '+m.getNumElements(), 2);
		
		// make wireframe
		if (this.wire)
			this.convertToWire();
		
		return this.meshIndexBuffers_;
	},
//_________________________________________
	makePlaneIndicies_: function(w, h, divx, divy) {
		
		var indexData = [];
		var ij = 0;
		for (var j=0; j<divy; j++, ij+=divx+1){
			for (var i=0; i<divx; i++){
				/* Make a Quad */
				var b = i+ij; // i+(j*(divx+1));
				indexData.push(b); // 0
				indexData.push(b+1); // 1
				indexData.push(b+1+divx+1); // 2
				indexData.push(b+1+divx+1); // 2
				indexData.push(b+divx); // 1
				indexData.push(b); // 0
			}
		}		
		return indexData;
	},
//_________________________________________
	setWidth: function(s) {
		
		this.width = parseFloat(s);
	},
//_________________________________________
	setHeight: function(s) {
		
		this.height = parseFloat(s);
	},
//_________________________________________
	setDivX: function(s) {
		
		this.divisionsX = parseInt(s);
	},
//_________________________________________
	setDivY: function(s) {
		
		this.divisionsY = parseInt(s);
	},
//_________________________________________
	getClassName: function() {return 'K2MeshPlane';}});


	

	
	return {
		K2MeshPlane: K2MeshPlane
	};
});
