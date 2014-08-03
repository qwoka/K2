k2RegisterModule("K2_MeshInstance",function () {
	
	
//_________________________________________
//		K2MeshInstance
//_________________________________________
	var K2MeshInstance = classExtend(k2Factories.K2Mesh, function(){
		
	},{
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Mesh.prototype.resetObject.apply(this, arguments);

		this.numInstances = 3;
		this.numPrimatives = 0;
	},
//_________________________________________
    setContext3DRequested_: function(gl) {
		
		this.findMeshBuffers_();
		
		this.makeInstances_();
		this.hasGLContext = true;
 	},
//_________________________________________
    makeInstances_: function() {
		
		this.numPrimatives = this.meshIndexBuffers_[0].getSize();
		
		// make sure we are in limits
		var m = this.getMaxInstances();
		if (this.numInstances > m || this.numInstances == 0)
			this.numInstances = m;
			
		var nv = this.getNumVerts();
			
		// duplicate mesh in vertext buffers
		for (var i=this.meshVertexBuffers_.length-1; i>=0; --i){
			this.makeVBInstances_(this.meshVertexBuffers_[i]);
		}
			
		// duplicate mesh in index buffers
		for (i=this.meshIndexBuffers_.length-1; i>=0; --i){
			this.makeIBInstances_(this.meshIndexBuffers_[i], nv);
		}
		
		// make Instance ID buffer
		this.makeIBInstanceBuffer_(nv);
 	},
//_________________________________________
    makeIBInstanceBuffer_: function(nv) {
		
		// make transform index buffer
		var b = [];
		var i, ii;
		for (i=1; i<this.numInstances; ++i){
			for (ii=0; ii<nv; ++ii){
				b.push(parseFloat(i));
			}
		}
		
		// make transform index buffer object
		var m;
		m = this.loader_.makeObjectByClass('K2MeshBufferFloat');
		m.semantics_ = 'XIndex';
		m.elementSize = 1;
		m.buffer_ = b;
		this.addChild(m);
 	},
//_________________________________________
    makeVBInstances_: function(b) {
		
		var a = b.buffer_.concat();
		for (var i=1; i<this.numInstances; ++i){
			a = a.concat(b.buffer_);
		}
		b.buffer_ = a;
 	},
//_________________________________________
    makeIBInstances_: function(b, nv) {
		
		var a = b.buffer_.concat();
		var n = b.buffer_.length;
		var i, ii, ni;
		for (i=1; i<this.numInstances; ++i){
			ni = i * n;
			for (ii=0; ii<n; ++ii){
				a.push(b.buffer_[ii] + ni);
			}
		}
		b.buffer_ = a;
 	},
//_________________________________________
    getMaxInstances: function() {
		
		return 3;
 	},
//_________________________________________
    setNumInstances: function() {
		
		return this.numInstances;
 	},
//_________________________________________
    setNumInstances: function() {
		
		this.numInstances = parseInt(s);
 	},
//_________________________________________
	getClassName: function() {return 'K2MeshInstance';}});




//_________________________________________
//		K2DrawableInstanced
//_________________________________________
	var K2DrawableInstanced = classExtend(k2Factories.K2Drawable, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		k2Factories.K2Drawable.prototype.initObject.apply(this, arguments);
	},
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Drawable.prototype.resetObject.apply(this, arguments);

		this.makeBounds_ = false;
		this.doCulling = false;
		//this.visible = false;
		
		this.boneMats = [];		
		this.bones = [];	
		
		this.testArray = vec.create([-0.5, 0.1, 0.0, 0.0, 0.0, 0.0, -0.1, 0.0, 0.0]);	
		this.testVec = vec3.create([-0.1,0.0,0.0]);	
	},
//_________________________________________
	step: function(t, c, b) {

		this.updateXform_(t);
		
		//this.boundbox.resetObject();
		//this.boundbox.mergeBox(this.indexBuffers_[0].getBoundBox());
						
		//k2Factories.K2XObject.prototype.step.apply(this, arguments);
		for (var i=this.children_.length-1; i>=0; --i)
			this.children_[i].step(t, c, b);
		
		// set number of instances
		var np = this.mesh_.numPrimatives;
		var ni = this.getNumInstances();
		this.passInstances_[0].primativesToDraw = 1 * np;
		
//		if (this.doCulling) 
//			this.isCulled = this.doCull_(c);
			
//		if (b) 
//			b.mergeBox(this.boundbox);
	},
////_________________________________________
//	updateXform_: function() {
//		
//		// do transform
//		this.transform.updateFromParent(this.parentX_.transform);
//		
//		// set scale to match fov
//		var b = this.parentX_.boundbox;
//		b.getSize(K2TEMPVEC3);
//		vec3.multiply(this.transform.xformWorld.scale, K2TEMPVEC3);
//	},
//_________________________________________
	newInstance: function(spawnobj) {
		
	},
//_________________________________________
	getNumInstances: function() {
		
		return 3;
	},
////_________________________________________
//	setContext3D: function(gl) {
//		
//		this.initPassInstance_(gl);
//	},
//_________________________________________
	makeBoundsViz_: function() {
		
		// we ARE the bounds object, so make sure we don't make anything
	},
//_________________________________________
	getClassName: function() {return 'K2DrawableInstanced';}});




	
	return {
		K2MeshInstance: K2MeshInstance,
		K2DrawableInstanced: K2DrawableInstanced,
//		K2DrawableInstance: K2DrawableInstance
	};
});
