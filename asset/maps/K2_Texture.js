k2RegisterModule("K2_Texture",function () {
	
	
//_________________________________________
	var K2Texture2D = classExtend(k2Factories.K2Asset, function(){
		
	},{
//_________________________________________
	initObject: function() {
		
		k2Factories.K2Asset.prototype.initObject.apply(this, arguments);
		
		this.texMat = mat4.create();
	},
//_________________________________________
	resetObject: function() {
		
		k2Factories.K2Asset.prototype.resetObject.apply(this, arguments);
		
        this.hasGLContext = false;
		
		this.tex_ = null;
		
		this.texWrapS_ = 'REPEAT';	// CLAMP_TO_EDGE / REPEAT /  MIRRORED_REPEAT
		this.texWrapT_ = 'REPEAT';
		
		this.texMinFilter_ = 'NEAREST';		// NEAREST / LINEAR
		this.texMagFilter_ = 'LINEAR';
		
		this.texMipMap_ = true;
		this.texMipMinFilter_ = 'LINEAR';	// NEAREST / LINEAR
		
		this.image_ = null;
		this.width = 0;
		this.height = 0;
				
		mat4.identity(this.texMat);
	},
//_________________________________________
	setPath: function(s) {
		
		var self = this;
		
		// make image
		this.image_ = new Image();
		this.image_.onload = function(ev){
			self.onImageLoaded_();
		}
		
		// is there any path in the src?
		this.src_ = s;
		var path = this.getSrcPath();
		if (path.length==0){ 
			s = this.loader_.getSrcPath() + '/' + s;
		} else if (path[0]=='.') {
			s = this.loader_.getSrcPath() + '/' + s.substr(2);
		}
		
		// start load
		this.loader_.pushDependant();
		this.image_.src = k2WORLDPATH + s;
	},
//_________________________________________
	onImageLoaded_: function() {
		
		this.width = this.image_.width;
		this.height = this.image_.height;
		
		//this.logLoadComplete();
		this.loader_.popDependant();
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
		
		// bind
		gl.bindTexture(gl.TEXTURE_2D, this.tex_);
		
		// upload image data to texture
		this.uploadImage(gl, this.image_);
		
		// generate mipmaps
		if (this.texMipMap_)
			gl.generateMipmap(gl.TEXTURE_2D);
			
		// set filter and wrap
		this.setTextureProperties(gl);
		
		// unbind
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
	scaleImageToNextHighestPowerOf2: function(image){
		
		// Scale up the texture to the next highest power of two dimensions.
        var canvas = document.createElement("canvas");
        canvas.width = this.nextHighestPowerOfTwo(image.width);
        canvas.height = this.nextHighestPowerOfTwo(image.height);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, image.width, image.height);
        return canvas;
	},
//_________________________________________
	isPowerOfTwo: function(x){
		
  		return (x & (x - 1)) == 0; 
	},
//_________________________________________
	nextHighestPowerOfTwo: function(x){
		
  		--x;
		for (var i = 1; i < 32; i <<= 1) {
			x = x | x >> i;
		}
		return x + 1;
	},
//_________________________________________
	nearestPow2: function(n){
		
  		return Math.pow( 2, Math.round( Math.log( n ) / Math.log( 2 ) ) ); 
	},
//_________________________________________
	getGLTexType: function(gl){
		
  		return gl['TEXTURE_2D']; 
	},
//_________________________________________
	setWrapS: function(s){
		
		this.texWrapS_ = s;
	},
//_________________________________________
	setWrapT: function(s){
		
		this.texWrapT_ = s;
	},
//_________________________________________
	setMinFilter: function(s){
		
		this.texMinFilter_ = s;
	},
//_________________________________________
	setMagFilter: function(s){
		
		this.texMagFilter_ = s;
	},
//_________________________________________
	setMipMinFilter: function(s){
		
		this.texMipMinFilter_ = s;
	},
////_________________________________________
//	setMipMagFilter: function(s){
//		
//		this.texMipMagFilter_ = s;
//	},
//_________________________________________
    setMip: function (s) {
		
		this.texMipMap_ = this.parseStringAsBool(s);
	},
//_________________________________________
	getClassName: function() {return 'K2Texture2D';}});

	
	return {
		K2Texture2D: K2Texture2D
	};
});
