k2RegisterModule("K2_TextureCube",function () {
	
	
//_________________________________________
	var K2TextureCube = classExtend(k2Factories.K2Texture2D, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		k2Factories.K2Texture2D.prototype.initObject.apply(this, arguments);
		
	},
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Texture2D.prototype.resetObject.apply(this, arguments);
		
		this.texfaces = [];
	},
//_________________________________________
	setPath: function(s) {
		
//		this.src_ = s;
//		// make image
//		this.image_ = new Image();
//		// start load
//		this.loader_.pushDependant();
//		var self = this;
//		this.image_.onload = function(){self.onImageLoaded_();}
//		this.image_.src = k2WORLDPATH + s;
	},
//_________________________________________
	setFaces: function(s){
		
		this.texfaces = this.linkObjectArrayProperty('Faces', s);	
	},
//_________________________________________
    setContext3DRequested_: function(gl) {
		
		// check its power of 2
		if (!this.isPowerOfTwo(this.width) || 
			!this.isPowerOfTwo(this.height)){
			this.log_('non-power of 2 texture: '+this.width+'x'+this.height);
			return;
		}
		
		this.createTexture_(gl);
		this.hasGLContext = true;
 	},
//_________________________________________
	createTexture_: function(gl) {
		
		//create gl texture
		this.tex_ = gl.createTexture();
		
		// upload image data to texture
		gl.bindTexture(gl.TEXTURE_2D, this.tex_);
		this.uploadImage(gl, this.image_);
		
		// generate mipmaps
		if (this.texMipMap_)
			gl.generateMipmap(gl.TEXTURE_2D);
			
		// set filter and wrap
		this.setTextureProperties(gl);
		gl.bindTexture(gl.TEXTURE_2D, null);
	},
//_________________________________________
	uploadImage: function(gl, img){
		
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
	},
//_________________________________________
	setTextureProperties: function(gl){
		
		// set min filter
		var minf = this.texMinFilter_;
		if (this.texMipMap_) minf += '_MIPMAP_' + this.texMipMinFilter_;
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[minf]);
		
		// set mag filter
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[this.texMagFilter_]);
		
		// set wrap
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[this.texWrapS_]);
    	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[this.texWrapT_]);
	},
//_________________________________________
	makeCubeTex_: function(gl){
		
		var textureId;
		// Face 0 - Red
		var cubePixels0 = new Uint8Array([255, 0, 0]);
		// Face 1 - Green,
		var cubePixels1 = new Uint8Array([0, 255, 0]);
		// Face 2 - Blue
		var cubePixels2 = new Uint8Array([0, 0, 255]);
		// Face 3 - Yellow
		var cubePixels3 = new Uint8Array([255, 255, 0]);
		// Face 4 - Purple
		var cubePixels4 = new Uint8Array([255, 0, 255]);
		// Face 5 - White
		var cubePixels5 = new Uint8Array([255, 255, 255]);
		// Generate a texture object
		textureId = gl.createTexture ();
		// Bind the texture object
		gl.bindTexture ( gl.TEXTURE_CUBE_MAP, textureId );
		// Load the cube face - Positive X
		gl.texImage2D ( gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, cubePixels0);
		// Load the cube face - Negative X
		gl.texImage2D ( gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, cubePixels1 );
		// Load the cube face - Positive Y
		gl.texImage2D ( gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, cubePixels2 );
		// Load the cube face - Negative Y
		gl.texImage2D ( gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, cubePixels3 );
		// Load the cube face - Positive Z
		gl.texImage2D ( gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, cubePixels4 );
		// Load the cube face - Negative Z
		gl.texImage2D ( gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, cubePixels5 );
		// Set the filtering mode
		gl.texParameteri ( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
		gl.texParameteri ( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
	},
//_________________________________________
	getGLTexType: function(gl){
		
  		return gl.TEXTURE_CUBE_MAP; 
	},
//_________________________________________
	getClassName: function() {return 'K2TextureCube';}});

	
	return {
		K2TextureCube: K2TextureCube
	};
});
